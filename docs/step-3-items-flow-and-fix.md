# Step 3 Items: Flow Analysis and Why Items Don’t Show

## End-to-end flow

### 1. Step 3 UI (setup/step-3/page.tsx)

- **State:** `items: ItemRow[]` (description, quantity, unit, notes, image_url).
- **Load:** On mount, `load()` fetches `GET /api/o/[orgKey]/tenders/[tenderId]/items`. If the response has `items: []`, and the user already has rows in the form, the code does **not** overwrite (`dontOverwriteUserRows`), so the form can show rows while the API returns none.
- **Save & Continue:**
  1. `toSave = items.filter((i) => i.description.trim())` — only rows with a non-empty description.
  2. Payload is `buildItemsPayload(toSave)` → `{ items: [ { sort_order, description, quantity, unit, notes, image_url } ] }`.
  3. `PUT /api/o/[orgKey]/tenders/[tenderId]/items` with that body.
  4. On success: `await load()` then `router.push(step-4)`.
- **Important:** After PUT, the client always calls `load()` (GET items). If GET returns `items: []`, the form state is **not** cleared because of `dontOverwriteUserRows`, so the user doesn’t see the list “disappear” before navigating to step 4. So from the user’s point of view, save “worked” even when the server returns no items later.

### 2. Items API (route.ts)

- **PUT:**
  1. `requireOrg(orgKey)` → 404 if workspace not found.
  2. `getTenderById(tenderId, result.org.id)` → 404 if tender not in that workspace.
  3. `putTenderItemsBody.safeParse(body)` → 400 if validation fails.
  4. `replaceTenderItems(tenderId, parsed.data.items)` → delete all rows for `tender_id`, then insert new rows.
  5. `getTenderItems(tenderId)` → read back rows.
  6. Respond with `{ ok: true, items: saved }`.
- **GET:** Same auth and tender check, then direct Supabase select on `tender_items` by `tender_id`, return `{ items }`.

Both PUT and GET use `getSupabase()` from `lib/db` (same client).

### 3. replaceTenderItems (lib/tenders.ts)

- Delete: `supabase.from("tender_items").delete().eq("tender_id", tenderId)`.
- If `items.length === 0`, return (no insert).
- Insert: one row per item with `tender_id`, `sort_order`, `description`, `quantity`, `unit`, `notes`, `image_url`.
- Throws on delete or insert error.

### 4. Validator (lib/validators.ts)

- `tenderItemSchema`: `sort_order` (int ≥ 0), `description` (string), `quantity` (coerce number ≥ 0), `unit`/`notes` (optional/nullable), `image_url` (optional, transformed to valid URL or null).
- `putTenderItemsBody`: `{ items: z.array(tenderItemSchema) }`.
- Step 3 only sends items with non-empty description; payload matches the schema.

---

## Why “items don’t show” (root cause)

- The **script** (using the same `.env.local` and same Supabase URL) sees **1 row** for the tender in `tender_items`.
- The **API** (GET) returns **0 items** for the same tender and same host (`faclfoevvjprlctynukj.supabase.co`).
- So the row exists in the database, but the **API’s SELECT returns no rows**.

The only plausible explanation is **Row Level Security (RLS)** on `tender_items`:

- If the API uses the **anon** key, then:
  - **DELETE** might delete 0 rows (RLS hides existing rows).
  - **INSERT** can still succeed if RLS allows insert for anon.
  - **SELECT** (in GET and in PUT’s `getTenderItems`) returns 0 rows if RLS does not allow anon to read those rows.
- So: **insert “works”, but the app never sees the rows** because reads are restricted by RLS.

So the bug is **not** in Step 3’s UI or in the create/save logic; it’s that the **API is using a key that is subject to RLS**, and RLS is blocking **read** of `tender_items`.

---

## Fix

1. **Use the service_role key in the API**
   - In Supabase: **Project Settings → API**.
   - Copy the **service_role** secret (not the anon key).
   - In `.env.local` set:
     - `SUPABASE_SERVICE_ROLE_KEY=<service_role secret>`
   - Restart the dev server so the API uses this key. Service role bypasses RLS, so GET and PUT will see the same rows the script sees.

2. **If you must use anon (or another role) for the API**
   - In Supabase SQL Editor, either:
     - Disable RLS on `tender_items`:
       ```sql
       ALTER TABLE public.tender_items DISABLE ROW LEVEL SECURITY;
       ```
     - Or add policies that allow the role used by the API to SELECT (and optionally INSERT/UPDATE/DELETE) the rows it needs.

---

## Dev logging (already added)

- **GET:** `[items GET] { tenderId, count, supabaseHost, rawError }`.
- **PUT:** `[items PUT] { tenderId, incomingCount }` before replace, then `{ tenderId, savedCount }` after `getTenderItems`.

If you see `incomingCount: 1` and `savedCount: 0` on PUT, that confirms the insert runs but the immediate read returns 0 — consistent with RLS blocking SELECT.

---

## Step 3 logic summary

| Step | What happens |
|------|----------------|
| User adds row in ItemsTable | `items` state updated; `buildItemsPayload` can send it (description trimmed). |
| User clicks Save & Continue | Only rows with non-empty description are sent. |
| PUT | Validated → replaceTenderItems (delete + insert) → getTenderItems → 200 + `{ items: saved }`. |
| Client after PUT | Calls `load()` (GET). If GET returns `[]`, form is not overwritten (dontOverwriteUserRows), then navigate to step-4. |
| Review / Preview | Same GET items; if GET returns 0 (e.g. RLS), UI shows “0 items”. |

So “item create” in Step 3 is working; the failure is in **reading** items back in the same API when RLS is applied.

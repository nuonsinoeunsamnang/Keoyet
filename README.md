# Keoyet MVP

Minimal Next.js (App Router) app for org-scoped tender and submission management. No auth; access is by workspace link (`orgKey` in the URL).

## Setup

1. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Apply the Supabase schema: in the Supabase dashboard, open **SQL Editor** and run each migration in order (`001_initial_schema.sql`, then `002_*`, `003_*`, `004_*`, `005_*`). Or use Supabase CLI migrations.
3. `npm install` and `npm run dev`.

### Checking data in Supabase

- Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project (same URL as `NEXT_PUBLIC_SUPABASE_URL`).
- Go to **Table Editor**. You should see at least: `workspaces`, `tenders`, `tender_items`, `tender_required_docs`.
- **Workspaces:** Each row is one org. The `org_key` column is the value used in the URL (e.g. `/o/abc12-def34`). If you use "Create workspace" on the app homepage, a row is added here.
- **Tenders:** One row per tender; `workspace_id` links to `workspaces.id`, `status` is `draft` or `published`.
- **tender_items** and **tender_required_docs:** Filled when you complete step 3 and step 4 of the tender setup.

If nothing appears after creating a tender:

1. **URL must match a workspace.** You must use a workspace that exists. E.g. go to `/`, click "Create workspace", then use the URL you’re redirected to (e.g. `/o/xyz-abcd`) and from there open Tenders → New tender. If you type a random path like `/o/test` and no row in `workspaces` has `org_key = 'test'`, every API call returns 404 and nothing is saved.
2. **Confirm env and project.** Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the same Supabase project you’re viewing in the dashboard.
3. **Confirm migrations.** All tables above must exist. Re-run the migration SQL if needed.
4. **Check the browser Network tab.** When you click "Save & Continue" or "Publish", the request to `/api/o/.../tenders/...` should return **200**. If you see **404** (workspace not found) or **500** (e.g. missing table), fix the cause above.

## Routes

- `/` – Landing: create workspace or enter workspace link
- `/o/[orgKey]` – Org dashboard (requires valid orgKey)
- `/o/[orgKey]/tenders` – Tender list; new tender creates draft and redirects to setup step 1
- `/o/[orgKey]/tenders/[tenderId]/setup/step-1` … `step-5` – Tender setup wizard; step 5 publishes
- `/o/[orgKey]/tenders/[tenderId]/manage/*` – Submissions, vendors, compare, award, Q&A
- `/t/[slug]` – Public view-only tender page (published tenders)
- `/submit/[slug]` – Placeholder for vendor submission (later)
- `/invalid-workspace` – Shown when orgKey is invalid (middleware or layout redirect)

## API

See the plan for the full API map. All org-scoped routes live under `/api/o/[orgKey]/...`. Workspace creation: `POST /api/workspaces`.

## MVP accelerator

`POST /api/o/[orgKey]/tenders/[tenderId]/submissions/ingest` – Ingest a submission (vendor + items + docs) for testing without a vendor portal.

# Keoyet MVP

Minimal Next.js (App Router) app for org-scoped tender and submission management. No auth; access is by workspace link (`orgKey` in the URL).

## Setup

1. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Apply the Supabase schema: run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor (or use Supabase CLI migrations).
3. `npm install` and `npm run dev`.

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

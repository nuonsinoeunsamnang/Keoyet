-- Ensure tender_items is readable/writable by the API (service role or anon).
-- If RLS was enabled in the dashboard, this turns it off so GET /api/.../items returns rows.
alter table public.tender_items disable row level security;

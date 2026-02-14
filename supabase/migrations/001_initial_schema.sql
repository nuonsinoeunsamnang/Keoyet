-- Keoyet MVP: minimal schema for org-scoped tenders, submissions, vendors, awards

-- Workspaces (orgKey in URL scopes all data)
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  org_key text not null unique,
  name text,
  created_at timestamptz not null default now()
);

-- Tenders
create table if not exists public.tenders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  slug text not null unique,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  description text,
  submission_deadline timestamptz,
  submission_link_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tenders_workspace_id on public.tenders(workspace_id);
create index if not exists tenders_slug on public.tenders(slug);

-- BoQ items per tender
create table if not exists public.tender_items (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  sort_order int not null default 0,
  description text not null,
  quantity numeric not null default 1,
  unit text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists tender_items_tender_id on public.tender_items(tender_id);

-- Required documents and rejection rules per tender
create table if not exists public.tender_required_docs (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  name text not null,
  required boolean not null default true,
  rejection_policy jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tender_required_docs_tender_id on public.tender_required_docs(tender_id);

-- Vendors (per workspace; linked via submissions)
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  contact_email text,
  contact_phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendors_workspace_id on public.vendors(workspace_id);

-- Submissions (one per vendor per tender)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'under_review', 'awarded', 'rejected')),
  submitted_at timestamptz,
  compliance jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tender_id, vendor_id)
);

create index if not exists submissions_tender_id on public.submissions(tender_id);
create index if not exists submissions_vendor_id on public.submissions(vendor_id);

-- Line items per submission (prices)
create table if not exists public.submission_items (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  tender_item_id uuid not null references public.tender_items(id) on delete cascade,
  unit_price numeric,
  total numeric,
  notes text,
  created_at timestamptz not null default now(),
  unique(submission_id, tender_item_id)
);

create index if not exists submission_items_submission_id on public.submission_items(submission_id);

-- Documents uploaded per submission
create table if not exists public.submission_docs (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  required_doc_id uuid not null references public.tender_required_docs(id) on delete cascade,
  file_url text,
  status text not null default 'pending' check (status in ('pending', 'provided', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(submission_id, required_doc_id)
);

create index if not exists submission_docs_submission_id on public.submission_docs(submission_id);

-- Awards (winner per tender)
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  submission_id uuid not null references public.submissions(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  notify_winner boolean not null default false,
  notes text,
  unique(tender_id)
);

create index if not exists awards_tender_id on public.awards(tender_id);

-- Optional: trigger to keep tenders.updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tenders_updated_at
  before update on public.tenders
  for each row execute function public.set_updated_at();

create trigger vendors_updated_at
  before update on public.vendors
  for each row execute function public.set_updated_at();

create trigger submissions_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

create trigger submission_docs_updated_at
  before update on public.submission_docs
  for each row execute function public.set_updated_at();

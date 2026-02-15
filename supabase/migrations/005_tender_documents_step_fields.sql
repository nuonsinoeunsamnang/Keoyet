-- Step 4 (Documents): eligibility, rejection criteria, vendor verification policy
alter table public.tenders
  add column if not exists eligibility_requirements text,
  add column if not exists rejection_criteria jsonb,
  add column if not exists only_verified_vendors boolean not null default false;

comment on column public.tenders.eligibility_requirements is 'Bullet list of who is eligible to bid (optional).';
comment on column public.tenders.rejection_criteria is 'Rules that mark bids non-compliant: missing_required_docs, after_deadline, vendor_not_verified.';
comment on column public.tenders.only_verified_vendors is 'If true, only verified vendors can submit bids.';

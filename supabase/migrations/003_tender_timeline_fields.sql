-- Step 2 (Timeline): publish at, questions deadline, submission method options
alter table public.tenders
  add column if not exists publish_at timestamptz,
  add column if not exists questions_deadline timestamptz,
  add column if not exists accept_online_submissions boolean not null default true,
  add column if not exists accept_physical_submissions boolean not null default false,
  add column if not exists physical_submission_instructions text;

comment on column public.tenders.publish_at is 'When the tender becomes visible to vendors';
comment on column public.tenders.questions_deadline is 'Deadline for vendors to submit questions';
comment on column public.tenders.accept_online_submissions is 'Vendors can submit bids through the platform';
comment on column public.tenders.accept_physical_submissions is 'Allow sealed envelope submissions in addition to online';
comment on column public.tenders.physical_submission_instructions is 'Office address, sealed envelope instructions, submission hours (shown on tender page)';

-- Step 1 (Basics) fields: reference ID, category, delivery/work location
alter table public.tenders
  add column if not exists reference_id text,
  add column if not exists category text,
  add column if not exists delivery_location text;

comment on column public.tenders.reference_id is 'Internal reference number for tracking and audit (e.g. RFQ-FY26-ITEquipment-006)';
comment on column public.tenders.category is 'Tender category: goods, services, works, consultancy';
comment on column public.tenders.delivery_location is 'Where goods will be delivered or work will take place';

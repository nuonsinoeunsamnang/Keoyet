-- Optional image URL per tender item (for item detail / reference image)
alter table public.tender_items
  add column if not exists image_url text;

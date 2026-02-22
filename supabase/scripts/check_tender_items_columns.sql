-- Run this in Supabase Dashboard > SQL Editor to verify tender_items schema.
-- Checks if image_url column exists and shows current columns.

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'tender_items'
order by ordinal_position;

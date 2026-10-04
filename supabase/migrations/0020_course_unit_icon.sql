-- Per-unit icon (shown as the colored badge on the Lessons timeline cards),
-- picked by the admin instead of defaulting to one generic icon everywhere.
alter table public.course_units add column if not exists icon text not null default 'book';

-- "What You Will Learn" becomes per-course/editable instead of a hardcoded 4-skill grid.
alter table public.courses add column if not exists skills jsonb not null default '[]';

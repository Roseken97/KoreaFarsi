-- Editable UI copy: overrides for any string in src/lib/i18n/messages/{en,fa}.ts,
-- keyed by its dotted path (e.g. "home.title", "marketing.method.steps.0").
-- Rose edits these from /admin/content; when no row exists (or Supabase is down)
-- the app falls back to the text in the code.

create table if not exists public.site_copy (
  key text not null,
  locale text not null check (locale in ('en', 'fa')),
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (key, locale)
);

alter table public.site_copy enable row level security;

-- UI copy is public text, so anyone may read it.
-- Writes happen only from /admin/content via the service role.
create policy "site_copy: public read" on public.site_copy for select using (true);

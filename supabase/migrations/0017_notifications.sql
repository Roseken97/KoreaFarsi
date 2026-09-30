-- Real in-app notifications (Account/Home bell). Rows are inserted from code
-- at real events (e.g. an order being approved in /admin/orders), via the
-- service role — there is no general user-facing insert policy.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  title_en text,
  body text,
  body_en text,
  href text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications: owner read" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications: owner update" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

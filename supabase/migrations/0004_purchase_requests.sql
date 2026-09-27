-- Milestone 3: "Buy" requests (no payment gateway in Phase 1).
-- Visitors submit their contact + cart; Rose follows up manually.
-- Read them in Supabase → Table Editor → purchase_requests.

create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  contact text not null check (char_length(contact) between 3 and 160), -- phone / email / Telegram id
  message text check (char_length(message) <= 1000),
  items jsonb not null,               -- snapshot: [{slug, title, format, quantity, unit_price}]
  total int not null,
  currency text not null default 'IRT',
  locale text,
  status text not null default 'new' check (status in ('new', 'contacted', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.purchase_requests enable row level security;

-- Anyone may submit; nobody can read through the API (dashboard only).
create policy "purchase_requests: anyone can insert"
  on public.purchase_requests for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Support tickets (Help & Support): categorized, threaded, real admin replies.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (category in ('technical', 'billing', 'courses', 'account', 'other')),
  subject text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

create policy "support_tickets: owner read" on public.support_tickets for select using (auth.uid() = user_id);
create policy "support_tickets: owner insert" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "support_tickets: owner update" on public.support_tickets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Admin reads/replies/closes via the service role in code (no admin-side policy needed).

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  sender text not null check (sender in ('user', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.support_ticket_messages enable row level security;

create policy "support_ticket_messages: owner read"
  on public.support_ticket_messages for select
  using (exists (select 1 from public.support_tickets st where st.id = ticket_id and st.user_id = auth.uid()));

create policy "support_ticket_messages: owner insert"
  on public.support_ticket_messages for insert
  with check (sender = 'user' and exists (select 1 from public.support_tickets st where st.id = ticket_id and st.user_id = auth.uid()));

create index if not exists support_tickets_user_idx on public.support_tickets (user_id, created_at desc);
create index if not exists support_ticket_messages_ticket_idx on public.support_ticket_messages (ticket_id, created_at);

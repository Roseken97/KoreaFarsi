-- Milestone 4: Informational chatbot (PROJECT_BRIEF.md §4, §6).
-- Both tables are server-only: RLS is on with NO policies, so the public API
-- (anon / authenticated keys) can neither read nor write them. The chat module
-- and the admin form use SUPABASE_SERVICE_ROLE_KEY on the server.

create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  category text not null check (category in ('tutor', 'university', 'scholarship', 'visa_sim', 'general')),
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.knowledge_sources enable row level security;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid references public.profiles (id) on delete set null, -- null for guests
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  ip_hash text,                       -- salted SHA-256 of the IP, for the daily limit only
  locale text,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- Daily rate-limit lookups: "user messages today for this session / IP".
create index if not exists chat_messages_session_day_idx on public.chat_messages (session_id, created_at) where role = 'user';
create index if not exists chat_messages_ip_day_idx on public.chat_messages (ip_hash, created_at) where role = 'user';

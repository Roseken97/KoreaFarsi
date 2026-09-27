-- Phase 2, Part 1: Digital Library.
-- No payment gateway exists yet (PROJECT_BRIEF §8: Zarinpal is post-launch).
-- Access is granted manually by an admin from /admin/orders after a
-- purchase_request is fulfilled — this table is the resulting entitlement.

alter table public.products
  add column if not exists digital_file_path text; -- path inside the private 'library' Storage bucket

create table if not exists public.user_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  source text not null default 'purchase_request' check (source in ('purchase_request', 'manual')),
  purchase_request_id uuid references public.purchase_requests (id) on delete set null,
  granted_by uuid references auth.users (id) on delete set null, -- the admin who granted it
  granted_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.user_library enable row level security;

-- The owner can see their own library (rendering /library uses the normal user session).
-- Inserts happen only from /admin/orders via the service role, so no insert policy exists.
create policy "user_library: owner can read"
  on public.user_library for select
  using (auth.uid() = user_id);

create index if not exists user_library_user_idx on public.user_library (user_id);

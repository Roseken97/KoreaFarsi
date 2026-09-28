-- Reusable banner slot for Hero sections (Home, Courses, ...): lets Rose publish
-- an announcement from /admin/announcements without touching page code.

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  placement text not null default 'all' check (placement in ('all', 'home', 'courses')),

  title text not null,
  title_en text,
  body text,
  body_en text,
  href text, -- optional: tapping the banner navigates here

  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

-- Only active rows are readable by everyone (Hero picks the top one per placement).
-- Writes happen only from /admin/announcements via the service role.
create policy "announcements: public read active" on public.announcements for select using (is_active = true);

create index if not exists announcements_placement_idx on public.announcements (placement, is_active, sort_order);

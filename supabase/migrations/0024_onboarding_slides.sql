-- Onboarding slides (the first-run carousel before sign-up): photo + two-tone
-- headline + body per slide, edited by Rose from /admin/onboarding.
-- When no active row exists the app shows the default slides from the code
-- (src/lib/onboarding-slides/defaults.ts). Safe to re-run.

create table if not exists public.onboarding_slides (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  -- Card tint and headline accent, from the brand palette.
  color text not null default 'peach' check (color in ('peach', 'sky', 'lavender', 'rose', 'mint')),

  badge text,              -- short Korean word shown as a chip, e.g. 안녕
  title text not null,     -- first headline line (ink)
  title_accent text,       -- second headline line (in the slide color)
  body text,
  title_en text,
  title_accent_en text,
  body_en text,

  image_url text,          -- public URL in the "covers" bucket
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.onboarding_slides enable row level security;

-- Anyone (signed out too) reads the active slides; writes happen only from
-- /admin/onboarding via the service role.
drop policy if exists "onboarding_slides: public read active" on public.onboarding_slides;
create policy "onboarding_slides: public read active" on public.onboarding_slides for select using (is_active = true);

create index if not exists onboarding_slides_order_idx on public.onboarding_slides (is_active, sort_order);

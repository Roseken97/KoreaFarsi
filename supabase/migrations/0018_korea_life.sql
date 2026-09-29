-- Korea Life: culture/travel/food articles (Home card "Explore culture, travel, food and more").

create table if not exists public.korea_life_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'culture' check (category in ('culture', 'travel', 'food', 'life')),

  title text not null,
  title_en text,
  excerpt text,
  excerpt_en text,
  body text,
  body_en text,
  cover_image_url text,

  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.korea_life_posts enable row level security;

-- Public catalog is readable by everyone; writes happen only from /admin/korea-life via the service role.
create policy "korea_life_posts: public read" on public.korea_life_posts for select using (is_available = true);

create index if not exists korea_life_posts_category_idx on public.korea_life_posts (category, sort_order);

-- Milestone 3: Bookstore catalog.
-- Base columns follow PROJECT_BRIEF.md §6 (title, description, category, price,
-- currency, cover_image_url, format, is_available). Extra columns are what the
-- Bookstore sketch (13) needs: bilingual titles, collection tabs, level,
-- per-format prices, discounts, coming-soon, featured, bundles.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,

  title text not null,                -- Persian title
  title_en text,                      -- English title (shown alongside, per sketch)
  description text,                   -- Persian
  description_en text,

  category text not null check (category in ('course', 'book', 'planner', 'bundle', 'merch')),
  collection text check (collection in ('alphabet', 'four_skills', 'workbook', 'planner', 'merch')),
  level text,                         -- code: 'starter' | '1-1' | '1-2' | 'all' … (labels live in the app)

  price int not null,                 -- default price in Toman
  prices jsonb not null default '{}', -- per-format override, e.g. {"pdf": 180000, "physical": 390000}
  compare_at_prices jsonb not null default '{}', -- per-format original price, shown struck through
  currency text not null default 'IRT',

  cover_image_url text,               -- Supabase Storage public URL; app draws a cover when empty
  format text[] not null default '{}',-- subset of {'pdf','physical'}
  bundle_items text[] not null default '{}', -- slugs of products included in a bundle

  is_available boolean not null default true,
  is_coming_soon boolean not null default false,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  is_sample boolean not null default false, -- sample rows: delete with `delete from products where is_sample;`

  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Catalog is public. Writes happen from the Supabase dashboard (no admin UI in Phase 1).
create policy "products: public read"
  on public.products for select
  using (true);

create index if not exists products_sort_idx on public.products (sort_order, created_at);

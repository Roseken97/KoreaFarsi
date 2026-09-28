-- Phase 2, Part 4: Courses (real video lessons — PROJECT_BRIEF §2 deferred item).
-- A course optionally links to a Bookstore product (category 'course'); when it
-- does, watching its lessons requires the same user_library entitlement that
-- Library already uses (granted manually from /admin/orders). A course with no
-- product_id is open to any signed-in user.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  product_id uuid references public.products (id) on delete set null,

  title text not null,
  title_en text,
  description text,
  description_en text,
  level text,
  cover_image_url text,

  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.course_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  title_en text,
  sort_order int not null default 0
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.course_units (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade, -- denormalized for simpler queries/RLS
  title text not null,
  title_en text,
  sort_order int not null default 0,
  duration_minutes int not null default 0,
  video_path text,              -- path inside the private 'courses' Storage bucket
  script text,
  script_en text,
  vocabulary jsonb not null default '[]', -- [{ "ko": "...", "fa": "...", "en": "..." }]
  notes text
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  is_done boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

alter table public.courses enable row level security;
alter table public.course_units enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- Catalog + structure are public to read (browsing a course list/outline needs
-- no entitlement — only the signed video URL is gated, in code, via
-- src/lib/courses/access.ts). Writes happen only from /admin/courses via the
-- service role, so no insert/update/delete policy exists on these three.
create policy "courses: public read" on public.courses for select using (true);
create policy "course_units: public read" on public.course_units for select using (true);
create policy "course_lessons: public read" on public.course_lessons for select using (true);

-- Progress is normal per-user data.
create policy "lesson_progress: owner full access"
  on public.lesson_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists course_units_course_idx on public.course_units (course_id, sort_order);
create index if not exists course_lessons_unit_idx on public.course_lessons (unit_id, sort_order);
create index if not exists course_lessons_course_idx on public.course_lessons (course_id);
create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);

insert into storage.buckets (id, name, public)
values ('courses', 'courses', false)
on conflict (id) do nothing;

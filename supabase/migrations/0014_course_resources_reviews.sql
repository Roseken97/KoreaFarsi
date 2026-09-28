-- Make the Course Detail "Resources" and "Reviews" tabs real (sketch 07).

create table if not exists public.course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  title_en text,
  file_path text not null, -- path inside the private 'courses' Storage bucket
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.course_resources enable row level security;

-- Metadata (title) is public; the actual file is only ever reached through a
-- signed URL issued in code after the same course-access check lessons use
-- (src/lib/courses/actions.ts). Writes happen only from /admin/courses.
create policy "course_resources: public read" on public.course_resources for select using (true);

create index if not exists course_resources_course_idx on public.course_resources (course_id, sort_order);

create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  -- Denormalized at submit time (profiles is owner-read-only), so the
  -- public review list never needs to join another user's profile row.
  reviewer_name text,
  reviewer_avatar_key text,

  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, user_id)
);

alter table public.course_reviews enable row level security;

create policy "course_reviews: public read" on public.course_reviews for select using (true);
create policy "course_reviews: owner insert" on public.course_reviews for insert with check (auth.uid() = user_id);
create policy "course_reviews: owner update" on public.course_reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "course_reviews: owner delete" on public.course_reviews for delete using (auth.uid() = user_id);

create index if not exists course_reviews_course_idx on public.course_reviews (course_id, created_at desc);

-- Lesson Overview screen (sketch 09): shown before "Start Lesson".

alter table public.course_lessons
  add column if not exists title_ko text,               -- the big Korean phrase (e.g. 만나서 반갑습니다)
  add column if not exists objectives text,              -- "In this lesson, you will be able to" bullets, one per line
  add column if not exists objectives_en text,
  add column if not exists materials jsonb not null default '[]'; -- [{ "title": "...", "title_en": "...", "file_path": "..." }]

create table if not exists public.lesson_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_bookmarks enable row level security;

create policy "lesson_bookmarks: owner full access"
  on public.lesson_bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

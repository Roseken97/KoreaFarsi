-- Lets a lesson be taught with slides (code-rendered) instead of a recorded
-- video. Video stays the default so existing lessons are unaffected.
alter table public.course_lessons
  add column if not exists content_type text not null default 'video' check (content_type in ('video', 'slides')),
  add column if not exists slides jsonb not null default '[]'; -- [{ "title": "...", "title_en": "...", "body": "...", "body_en": "...", "ko": "..." }]

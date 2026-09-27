-- Phase 2, part 2: Planner — study plan + real daily tasks.
-- Fully user-owned (unlike knowledge_sources/user_library): normal RLS,
-- the signed-in user's own session client reads and writes these directly.

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level text not null default 'all',            -- reuses Bookstore's level codes: starter | 1-1 | 1-2 | all
  minutes_per_day int not null default 20 check (minutes_per_day between 5 and 180),
  days_of_week int[] not null default '{0,1,2,3,4,5,6}', -- JS Date.getDay(): 0=Sun … 6=Sat
  categories text[] not null default '{watch,review,practice,speak}',
  goal text,
  target_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.study_plans enable row level security;

create policy "study_plans: owner full access"
  on public.study_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.planner_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid not null references public.study_plans (id) on delete cascade,
  task_date date not null,
  category text not null check (category in ('watch', 'review', 'practice', 'speak')),
  minutes int not null default 10,
  is_done boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (plan_id, task_date, category) -- lets task generation upsert safely, no duplicates
);

alter table public.planner_tasks enable row level security;

create policy "planner_tasks: owner full access"
  on public.planner_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists planner_tasks_user_date_idx on public.planner_tasks (user_id, task_date);

-- The Planner's new 5-step setup computes a pace from the courses the learner
-- picks and how many hours/week they can commit, instead of a raw minutes/day
-- number typed in directly.
alter table public.study_plans add column if not exists course_ids uuid[] not null default '{}';
alter table public.study_plans add column if not exists hours_per_week numeric;

export const TASK_CATEGORIES = ["watch", "review", "practice", "speak"] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const PLAN_LEVELS = ["starter", "1-1", "1-2", "all"] as const;
export type PlanLevel = (typeof PLAN_LEVELS)[number];

export type StudyPlan = {
  id: string;
  user_id: string;
  level: PlanLevel;
  minutes_per_day: number;
  days_of_week: number[]; // 0=Sun … 6=Sat
  categories: TaskCategory[];
  goal: string | null;
  target_date: string | null;
  is_active: boolean;
  created_at: string;
};

export type PlannerTask = {
  id: string;
  plan_id: string;
  task_date: string; // YYYY-MM-DD
  category: TaskCategory;
  minutes: number;
  is_done: boolean;
  completed_at: string | null;
};

export type PlanInput = {
  level: PlanLevel;
  minutesPerDay: number;
  daysOfWeek: number[];
  categories: TaskCategory[];
  goal?: string;
};

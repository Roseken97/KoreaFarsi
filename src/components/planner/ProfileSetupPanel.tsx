"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircleIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { savePlan } from "@/lib/planner/actions";
import { PLAN_LEVELS, TASK_CATEGORIES, type PlanLevel, type TaskCategory } from "@/lib/planner/types";
import type { Course } from "@/lib/courses/types";
import { fmt } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { Profile } from "@/lib/profile";
import { CATEGORY_ICON } from "./categoryIcons";
import { dayOrder } from "./dayOrder";

const HOUR_OPTIONS = [2, 3, 5, 7, 10, 14, 20];

/** Planner carousel page 1: profile header + the 5 questions that compute the plan's pace (sketch request). */
export function ProfileSetupPanel({
  profile,
  courses,
  courseMinutes,
}: {
  profile: Profile | null;
  courses: Course[];
  courseMinutes: Record<string, number>;
}) {
  const { m, locale } = useI18n();
  const t = m.planner.setup;
  const router = useRouter();

  const [level, setLevel] = useState<PlanLevel>("all");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [hours, setHours] = useState(5);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [categories, setCategories] = useState<TaskCategory[]>([...TASK_CATEGORIES]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle<T>(list: T[], setList: (v: T[]) => void, value: T) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const totalMinutes = useMemo(() => courseIds.reduce((sum, id) => sum + (courseMinutes[id] ?? 0), 0), [courseIds, courseMinutes]);
  const estimateWeeks = totalMinutes > 0 ? Math.max(1, Math.ceil(totalMinutes / (hours * 60))) : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (courseIds.length === 0) return setError(t.errors.noCourses);
    if (days.length === 0 || categories.length === 0) return setError(t.errors.invalid);
    setError("");
    setLoading(true);
    const result = await savePlan({ level, courseIds, hoursPerWeek: hours, daysOfWeek: days, categories, goal });
    setLoading(false);
    if (!result.ok) return setError(t.errors.generic);
    router.push("/planner?tab=daily");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top profile view + photo (sketch request) */}
      <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center shadow-soft">
        <Avatar name={profile?.name} email={profile?.user.email} avatarKey={profile?.avatarKey} size={72} className="shadow-soft" />
        <div>
          <p className="font-display text-xl font-semibold">{profile?.name ?? profile?.user.email ?? "—"}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.title}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-card bg-surface p-5 shadow-soft md:p-6">
        {error && <Notice tone="error">{error}</Notice>}

        {/* Q1 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.levelLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {PLAN_LEVELS.map((l) => (
              <motion.button
                key={l}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setLevel(l)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  level === l ? "border-violet bg-violet text-white" : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {m.bookstore.levels[l]}
              </motion.button>
            ))}
          </div>
        </fieldset>

        {/* Q2 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.coursesLabel}</legend>
          {courses.length === 0 ? (
            <p className="text-sm text-ink-faint">{t.coursesEmpty}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {courses.map((c) => {
                const active = courseIds.includes(c.id);
                const title = locale === "en" ? c.title_en || c.title : c.title;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(courseIds, setCourseIds, c.id)}
                    className={`flex items-center gap-3 rounded-field border px-3.5 py-3 text-start transition ${
                      active ? "border-teal bg-sage-soft" : "border-line bg-surface hover:bg-cream"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink" dir="auto">
                      {title}
                    </span>
                    {active && <CheckCircleIcon width={18} height={18} className="shrink-0 text-teal-deep" />}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>

        {/* Q3 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.hoursLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {HOUR_OPTIONS.map((h) => (
              <motion.button
                key={h}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setHours(h)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  hours === h ? "border-violet bg-violet text-white" : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {h}h
              </motion.button>
            ))}
          </div>
          {estimateWeeks && <p className="mt-2 text-xs text-ink-soft">{fmt(t.estimate, { weeks: estimateWeeks })}</p>}
        </fieldset>

        {/* Q4 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.daysLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {dayOrder(locale).map((d) => (
              <motion.button
                key={d}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => toggle(days, setDays, d)}
                className={`grid size-11 place-items-center rounded-full border text-sm font-semibold transition ${
                  days.includes(d) ? "border-teal bg-sage-soft text-teal-deep" : "border-line bg-surface text-ink-faint"
                }`}
              >
                {m.planner.day[d]}
              </motion.button>
            ))}
          </div>
        </fieldset>

        {/* Q5 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.categoriesLabel}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TASK_CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICON[c];
              const active = categories.includes(c);
              return (
                <motion.button
                  key={c}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggle(categories, setCategories, c)}
                  className={`flex flex-col items-center gap-1.5 rounded-field border px-3 py-3 transition ${
                    active ? "border-teal bg-sage-soft text-teal-deep" : "border-line bg-surface text-ink-faint"
                  }`}
                >
                  <Icon width={20} height={20} />
                  <span className="text-xs font-medium">{m.planner.categoryLabel[c]}</span>
                  {active && <CheckCircleIcon width={14} height={14} />}
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <Field label={t.goalLabel} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder={t.goalPlaceholder} />

        <Button type="submit" loading={loading}>
          {t.submit}
        </Button>
      </form>
    </div>
  );
}

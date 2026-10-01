"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircleIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { savePlan } from "@/lib/planner/actions";
import { PLAN_LEVELS, TASK_CATEGORIES, type PlanLevel, type TaskCategory } from "@/lib/planner/types";
import { useI18n } from "@/lib/i18n/client";
import { CATEGORY_ICON } from "./categoryIcons";
import { dayOrder } from "./dayOrder";

const MINUTE_OPTIONS = [10, 15, 20, 30, 45, 60];

export function PlanWizard() {
  const router = useRouter();
  const { m, locale } = useI18n();
  const t = m.planner.setup;

  const [level, setLevel] = useState<PlanLevel>("all");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]); // weekdays, a sane default
  const [minutes, setMinutes] = useState(20);
  const [categories, setCategories] = useState<TaskCategory[]>([...TASK_CATEGORIES]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle<T>(list: T[], setList: (v: T[]) => void, value: T) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (days.length === 0 || categories.length === 0) return setError(t.errors.invalid);
    setError("");
    setLoading(true);
    const result = await savePlan({ level, minutesPerDay: minutes, daysOfWeek: days, categories, goal });
    setLoading(false);
    if (!result.ok) return setError(t.errors.generic);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-card bg-surface p-5 shadow-soft md:p-6">
      {error && <Notice tone="error">{error}</Notice>}

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

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">{t.minutesLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {MINUTE_OPTIONS.map((min) => (
            <motion.button
              key={min}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setMinutes(min)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                minutes === min ? "border-violet bg-violet text-white" : "border-line bg-surface text-ink-soft hover:text-ink"
              }`}
            >
              {min}
            </motion.button>
          ))}
        </div>
      </fieldset>

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
  );
}

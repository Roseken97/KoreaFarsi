"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { CheckIcon } from "@/components/icons";
import { toggleTask } from "@/lib/planner/actions";
import type { PlannerTask } from "@/lib/planner/types";
import { useI18n } from "@/lib/i18n/client";
import { CATEGORY_ICON } from "./categoryIcons";

/** The compact ring version of a task, for Home's 4-icon "Today's Plan" row. */
export function HomeTodayRing({ task }: { task: PlannerTask }) {
  const { m } = useI18n();
  const [done, setDone] = useState(task.is_done);
  const [pending, startTransition] = useTransition();
  const Icon = CATEGORY_ICON[task.category];

  function toggle() {
    const next = !done;
    setDone(next);
    startTransition(async () => {
      const result = await toggleTask(task.id, next).catch(() => ({ ok: false }) as const);
      if (!result.ok) setDone(!next);
    });
  }

  return (
    <li className="flex flex-col items-center gap-2">
      <motion.button
        onClick={toggle}
        disabled={pending}
        aria-pressed={done}
        aria-label={m.planner.categoryLabel[task.category]}
        whileTap={{ scale: 0.88 }}
        animate={done ? { scale: [1, 1.15, 1] } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative grid size-14 place-items-center disabled:opacity-70"
      >
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" className="stroke-line" />
          {done && (
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-success" pathLength={100} strokeDasharray="100" strokeDashoffset={0} />
          )}
        </svg>
        {done ? <CheckIcon width={20} height={20} className="text-success" /> : <Icon width={22} height={22} className="text-ink-soft" />}
      </motion.button>
      <span className={`text-xs font-medium ${done ? "text-success" : "text-ink-soft"}`}>{m.planner.categoryLabel[task.category]}</span>
    </li>
  );
}

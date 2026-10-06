"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { CheckIcon } from "@/components/icons";
import { toggleTask } from "@/lib/planner/actions";
import type { PlannerTask } from "@/lib/planner/types";
import { fmt } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { playSound } from "@/lib/ui/sound";
import { CATEGORY_ICON } from "./categoryIcons";

export function TaskItem({ task }: { task: PlannerTask }) {
  const { m } = useI18n();
  const [done, setDone] = useState(task.is_done);
  const [pending, startTransition] = useTransition();
  const Icon = CATEGORY_ICON[task.category];

  function toggle() {
    const next = !done;
    setDone(next); // optimistic — reverted below if the write fails
    if (next) playSound("success");
    startTransition(async () => {
      const result = await toggleTask(task.id, next).catch(() => ({ ok: false }) as const);
      if (!result.ok) setDone(!next);
    });
  }

  return (
    <li>
      <motion.button
        data-sound="off"
        onClick={toggle}
        disabled={pending}
        aria-pressed={done}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`flex w-full items-center gap-3 rounded-field border px-3.5 py-3 text-start transition-colors disabled:opacity-70 ${
          done ? "border-success-soft bg-success-soft" : "border-line bg-surface hover:border-teal/40"
        }`}
      >
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full ${done ? "bg-success text-white" : "bg-cream-deep text-ink-soft"}`}
        >
          {done ? <CheckIcon width={16} height={16} /> : <Icon width={18} height={18} />}
        </span>
        <span className={`flex-1 text-sm font-medium ${done ? "text-success line-through" : "text-ink"}`}>
          {m.planner.categoryLabel[task.category]}
        </span>
        <span className="shrink-0 text-xs text-ink-faint">{fmt(m.planner.today.minutes, { n: task.minutes })}</span>
      </motion.button>
    </li>
  );
}

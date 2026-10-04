"use client";

import { motion, type PanInfo } from "motion/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const PLANNER_TABS = ["profile", "daily", "weekly", "monthly", "yearly"] as const;
export type PlannerTab = (typeof PLANNER_TABS)[number];

/** Top pill nav + swipeable panel — 5 "pages" (sketch request), each a real server-rendered route via ?tab=. */
export function PlannerCarousel({
  active,
  labels,
  children,
}: {
  active: PlannerTab;
  labels: Record<PlannerTab, string>;
  children: ReactNode;
}) {
  const router = useRouter();
  const index = PLANNER_TABS.indexOf(active);

  function go(i: number) {
    if (i < 0 || i >= PLANNER_TABS.length) return;
    router.push(`/planner?tab=${PLANNER_TABS[i]}`);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -70) go(index + 1);
    else if (info.offset.x > 70) go(index - 1);
  }

  return (
    <div>
      <div className="-mx-4 mb-5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1 rounded-full bg-cream-deep p-1">
          {PLANNER_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => go(i)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                tab === active ? "bg-surface text-ink shadow-soft" : "text-ink-soft hover:text-ink"
              }`}
            >
              {labels[tab]}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={active}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

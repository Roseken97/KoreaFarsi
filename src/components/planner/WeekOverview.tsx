import { toDateKey } from "@/lib/planner/dates";
import type { PlannerTask } from "@/lib/planner/types";
import { fmt } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/config";

/** 7-day strip: a ring per day showing tasks done / scheduled. Server component — no interaction needed here. */
export function WeekOverview({ days, byDate, m }: { days: Date[]; byDate: Record<string, PlannerTask[]>; m: Messages }) {
  const todayKey = toDateKey(new Date());

  return (
    <div>
      <h2 className="mb-3 font-display text-xl font-semibold">{m.planner.week.title}</h2>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const key = toDateKey(day);
          const tasks = byDate[key] ?? [];
          const done = tasks.filter((t) => t.is_done).length;
          const isToday = key === todayKey;
          const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-medium ${isToday ? "text-teal-deep" : "text-ink-faint"}`}>
                {m.planner.day[day.getDay()]}
              </span>
              <div
                className={`relative grid size-10 place-items-center rounded-full text-[10px] font-semibold sm:size-12 ${
                  isToday ? "ring-2 ring-teal ring-offset-2 ring-offset-cream" : ""
                }`}
                style={{
                  background:
                    tasks.length === 0
                      ? "var(--color-line)"
                      : `conic-gradient(from 0deg, var(--color-violet) 0%, var(--color-indigo) ${pct}%, var(--color-line) ${pct}%)`,
                }}
              >
                <span className="grid size-8 place-items-center rounded-full bg-surface sm:size-10">
                  {tasks.length > 0 ? fmt(m.planner.week.doneOf, { done, total: tasks.length }) : "–"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

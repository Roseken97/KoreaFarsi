import { CalendarStrip, type CalendarStripItem } from "./CalendarStrip";
import { ProgressRing } from "./ProgressRing";
import { toDateKey } from "@/lib/planner/dates";
import type { PlannerTask } from "@/lib/planner/types";
import { fmt } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/config";

export function MonthlyPanel({
  year,
  month,
  tasks,
  stripItems,
  m,
  accent,
}: {
  year: number;
  month: number; // 0-indexed
  tasks: PlannerTask[];
  stripItems: CalendarStripItem[];
  m: Messages;
  accent: string;
}) {
  const t = m.planner;
  const done = tasks.filter((x) => x.is_done).length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  const byDate: Record<string, PlannerTask[]> = {};
  for (const task of tasks) (byDate[task.task_date] ??= []).push(task);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const cells: (Date | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];

  return (
    <div className="flex flex-col gap-5">
      <CalendarStrip items={stripItems} />

      <div className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft">
        <ProgressRing pct={pct} accent={accent} size={88} />
        <div>
          <p className="font-display text-lg font-semibold">{t.month.title}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{tasks.length ? fmt(t.month.doneOf, { done, total: tasks.length }) : "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 rounded-card bg-surface p-4 shadow-soft">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const dayTasks = byDate[toDateKey(date)] ?? [];
          const allDone = dayTasks.length > 0 && dayTasks.every((x) => x.is_done);
          const someDone = dayTasks.length > 0 && dayTasks.some((x) => x.is_done);
          return (
            <div
              key={i}
              className={`grid aspect-square place-items-center rounded-lg text-[11px] font-medium ${
                allDone ? "text-white" : someDone ? "text-ink" : dayTasks.length > 0 ? "bg-cream-deep text-ink-soft" : "text-ink-faint"
              }`}
              style={allDone ? { background: accent } : someDone ? { background: "var(--color-line)" } : undefined}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

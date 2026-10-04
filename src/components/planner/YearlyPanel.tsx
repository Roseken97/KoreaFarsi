import { CalendarStrip, type CalendarStripItem } from "./CalendarStrip";
import { ProgressRing } from "./ProgressRing";
import type { PlannerTask } from "@/lib/planner/types";
import { fmt, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/config";

export function YearlyPanel({
  year,
  tasks,
  stripItems,
  m,
  locale,
  accent,
}: {
  year: number;
  tasks: PlannerTask[];
  stripItems: CalendarStripItem[];
  m: Messages;
  locale: Locale;
  accent: string;
}) {
  const t = m.planner;
  const done = tasks.filter((x) => x.is_done).length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  const months = Array.from({ length: 12 }, (_, month) => {
    const monthTasks = tasks.filter((x) => {
      const d = new Date(x.task_date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const monthDone = monthTasks.filter((x) => x.is_done).length;
    return { month, pct: monthTasks.length ? (monthDone / monthTasks.length) * 100 : 0, total: monthTasks.length };
  });

  return (
    <div className="flex flex-col gap-5">
      <CalendarStrip items={stripItems} />

      <div className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft">
        <ProgressRing pct={pct} accent={accent} size={88} />
        <div>
          <p className="font-display text-lg font-semibold">{t.year.title}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{tasks.length ? fmt(t.year.doneOf, { done, total: tasks.length }) : "—"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-card bg-surface p-4 shadow-soft">
        {months.map(({ month, pct: monthPct, total }) => (
          <div key={month} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-xs font-semibold text-ink-soft">
              {new Date(year, month, 1).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { month: "short" })}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              {total > 0 && <div className="h-full rounded-full" style={{ width: `${monthPct}%`, background: accent }} />}
            </div>
            <span className="w-9 shrink-0 text-end text-[11px] text-ink-faint" dir="ltr">
              {Math.round(monthPct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

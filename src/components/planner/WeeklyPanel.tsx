import { WeekOverview } from "./WeekOverview";
import { CalendarStrip, type CalendarStripItem } from "./CalendarStrip";
import { ProgressRing } from "./ProgressRing";
import type { PlannerTask } from "@/lib/planner/types";
import type { Messages } from "@/lib/i18n/config";

export function WeeklyPanel({
  days,
  byDate,
  stripItems,
  m,
  accent,
}: {
  days: Date[];
  byDate: Record<string, PlannerTask[]>;
  stripItems: CalendarStripItem[];
  m: Messages;
  accent: string;
}) {
  const all = Object.values(byDate).flat();
  const done = all.filter((x) => x.is_done).length;
  const pct = all.length ? (done / all.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <CalendarStrip items={stripItems} />

      <div className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft">
        <ProgressRing pct={pct} accent={accent} size={88} />
        <div>
          <p className="font-display text-lg font-semibold">{m.planner.week.title}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{all.length ? `${done}/${all.length}` : "—"}</p>
        </div>
      </div>

      <WeekOverview days={days} byDate={byDate} m={m} />
    </div>
  );
}

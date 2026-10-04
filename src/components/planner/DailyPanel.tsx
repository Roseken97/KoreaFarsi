import { TaskItem } from "@/components/planner/TaskItem";
import { CalendarStrip, type CalendarStripItem } from "./CalendarStrip";
import { ProgressRing } from "./ProgressRing";
import type { PlannerTask } from "@/lib/planner/types";
import type { Messages } from "@/lib/i18n/config";

export function DailyPanel({ tasks, stripItems, m, accent }: { tasks: PlannerTask[]; stripItems: CalendarStripItem[]; m: Messages; accent: string }) {
  const t = m.planner;
  const done = tasks.filter((x) => x.is_done).length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <CalendarStrip items={stripItems} />

      <div className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft">
        <ProgressRing pct={pct} accent={accent} size={88} />
        <div>
          <p className="font-display text-lg font-semibold">{t.today.title}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{tasks.length ? `${done}/${tasks.length}` : t.today.empty}</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.today.empty}</p>
      ) : tasks.every((task) => task.is_done) ? (
        <p className="rounded-card bg-success-soft p-6 text-center text-sm font-medium text-success">{t.today.allDone}</p>
      ) : null}
      {tasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}

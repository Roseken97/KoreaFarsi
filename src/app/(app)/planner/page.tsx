import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlanWizard } from "@/components/planner/PlanWizard";
import { TaskItem } from "@/components/planner/TaskItem";
import { WeekOverview } from "@/components/planner/WeekOverview";
import { PageHeader } from "@/components/shell/PageHeader";
import { FlameIcon } from "@/components/icons";
import { getMessages } from "@/lib/i18n/server";
import { lastNDays } from "@/lib/planner/dates";
import { computeStreak, getActivePlan, getTasksForDate, getWeekTasks } from "@/lib/planner/queries";
import { formatNumber } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.planner.metaTitle };
}

/** Planner (Phase 2, part 2): a short setup wizard, then real daily tasks. */
export default async function PlannerPage() {
  if (isSupabaseConfigured && !(await getCurrentUser())) redirect("/auth/login?next=/planner");

  const [{ m, locale }, plan] = await Promise.all([getMessages(), getActivePlan()]);

  return (
    <div className="animate-fade-up max-w-3xl">
      <PageHeader />
      <h1 className="font-display text-3xl font-semibold">{m.planner.title}</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">{m.planner.subtitle}</p>

      {!plan ? (
        <PlanWizard />
      ) : (
        <PlanView plan={plan} m={m} locale={locale} />
      )}
    </div>
  );
}

async function PlanView({ plan, m, locale }: { plan: NonNullable<Awaited<ReturnType<typeof getActivePlan>>>; m: Awaited<ReturnType<typeof getMessages>>["m"]; locale: Awaited<ReturnType<typeof getMessages>>["locale"] }) {
  const today = new Date();
  const [todayTasks, weekTasks, streak] = await Promise.all([
    getTasksForDate(plan.id, today),
    getWeekTasks(plan.id),
    computeStreak(plan.id),
  ]);
  const t = m.planner;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-center gap-3 rounded-card bg-gradient-to-br from-sage-soft to-cream-deep p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-danger/80 shadow-soft">
          <FlameIcon width={22} height={22} />
        </span>
        <div>
          <p className="font-display text-xl font-semibold">
            {formatNumber(streak, locale)} {t.streak.label}
          </p>
          {streak === 0 && <p className="text-xs text-ink-soft">{t.streak.none}</p>}
        </div>
      </section>

      <WeekOverview days={lastNDays(7)} byDate={weekTasks} m={m} />

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">{t.today.title}</h2>
        {todayTasks.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.today.empty}</p>
        ) : todayTasks.every((task) => task.is_done) ? (
          <p className="rounded-card bg-success-soft p-6 text-center text-sm font-medium text-success">{t.today.allDone}</p>
        ) : null}
        {todayTasks.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </section>

      <details className="rounded-card bg-surface p-4 shadow-soft">
        <summary className="cursor-pointer text-sm font-medium text-ink-soft">{t.editPlan}</summary>
        <div className="mt-4">
          <PlanWizard />
        </div>
      </details>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DailyPanel } from "@/components/planner/DailyPanel";
import { MonthlyPanel } from "@/components/planner/MonthlyPanel";
import { PLANNER_TABS, PlannerCarousel, type PlannerTab } from "@/components/planner/PlannerCarousel";
import { ProfileSetupPanel } from "@/components/planner/ProfileSetupPanel";
import { WeeklyPanel } from "@/components/planner/WeeklyPanel";
import { YearlyPanel } from "@/components/planner/YearlyPanel";
import type { CalendarStripItem } from "@/components/planner/CalendarStrip";
import { PageHeader } from "@/components/shell/PageHeader";
import { getCourseMinutes, getCourses } from "@/lib/courses/queries";
import { getMessages } from "@/lib/i18n/server";
import { addDays, lastNDays, toDateKey } from "@/lib/planner/dates";
import { getActivePlan, getMonthTasks, getTasksForDate, getWeekTasks, getYearTasks } from "@/lib/planner/queries";
import { seasonalTheme } from "@/lib/planner/season";
import { getProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.planner.metaTitle };
}

function isPlannerTab(v: unknown): v is PlannerTab {
  return typeof v === "string" && (PLANNER_TABS as readonly string[]).includes(v);
}

/** Planner: a 5-page carousel (Profile setup, Daily, Weekly, Monthly, Yearly), themed by the season/holiday on the system date. */
export default async function PlannerPage(props: PageProps<"/planner">) {
  if (isSupabaseConfigured && !(await getCurrentUser())) redirect("/auth/login?next=/planner");

  const sp = await props.searchParams;
  const [{ m, locale }, plan, profile] = await Promise.all([getMessages(), getActivePlan(), getProfile()]);

  const requestedTab = isPlannerTab(sp.tab) ? sp.tab : null;
  const tab: PlannerTab = !plan ? "profile" : (requestedTab ?? "daily");
  const theme = seasonalTheme();

  const labels = m.planner.tabs;

  return (
    <div className="animate-fade-up max-w-3xl">
      <PageHeader />
      <div
        className="mb-5 flex items-center justify-between rounded-card p-4"
        style={{ backgroundImage: theme.gradient }}
      >
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{m.planner.title}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{m.planner.subtitle}</p>
        </div>
        <span className="rounded-full bg-surface/80 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur">{theme.label}</span>
      </div>

      <PlannerCarousel active={tab} labels={labels}>
        {tab === "profile" || !plan ? (
          await renderProfile(profile)
        ) : tab === "daily" ? (
          await renderDaily(plan.id, sp.day, m, locale, theme.accent)
        ) : tab === "weekly" ? (
          await renderWeekly(plan.id, sp.week, m, theme.accent)
        ) : tab === "monthly" ? (
          await renderMonthly(plan.id, sp.month, m, theme.accent)
        ) : (
          await renderYearly(plan.id, sp.year, m, locale, theme.accent)
        )}
      </PlannerCarousel>
    </div>
  );
}

async function renderProfile(profile: Awaited<ReturnType<typeof getProfile>>) {
  const courses = await getCourses();
  const courseMinutes = await getCourseMinutes(courses.map((c) => c.id));
  return <ProfileSetupPanel profile={profile} courses={courses} courseMinutes={courseMinutes} />;
}

async function renderDaily(planId: string, dayParam: string | string[] | undefined, m: Awaited<ReturnType<typeof getMessages>>["m"], locale: Awaited<ReturnType<typeof getMessages>>["locale"], accent: string) {
  const selected = typeof dayParam === "string" && !Number.isNaN(Date.parse(dayParam)) ? new Date(dayParam) : new Date();
  const tasks = await getTasksForDate(planId, selected);

  const stripItems: CalendarStripItem[] = lastNDays(9, addDays(selected, 4)).map((d) => ({
    key: toDateKey(d),
    label: String(d.getDate()),
    sub: d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { weekday: "short" }),
    href: `/planner?tab=daily&day=${toDateKey(d)}`,
    active: toDateKey(d) === toDateKey(selected),
  }));

  return <DailyPanel tasks={tasks} stripItems={stripItems} m={m} accent={accent} />;
}

async function renderWeekly(planId: string, weekParam: string | string[] | undefined, m: Awaited<ReturnType<typeof getMessages>>["m"], accent: string) {
  const selected = typeof weekParam === "string" && !Number.isNaN(Date.parse(weekParam)) ? new Date(weekParam) : new Date();
  const byDate = await getWeekTasks(planId, selected);
  const days = lastNDays(7, selected);

  const stripItems: CalendarStripItem[] = Array.from({ length: 5 }, (_, i) => addDays(selected, (i - 2) * 7)).map((d) => ({
    key: toDateKey(d),
    label: String(d.getDate()),
    sub: d.toLocaleDateString(undefined, { month: "short" }),
    href: `/planner?tab=weekly&week=${toDateKey(d)}`,
    active: toDateKey(d) === toDateKey(selected),
  }));

  return <WeeklyPanel days={days} byDate={byDate} stripItems={stripItems} m={m} accent={accent} />;
}

async function renderMonthly(planId: string, monthParam: string | string[] | undefined, m: Awaited<ReturnType<typeof getMessages>>["m"], accent: string) {
  const now = new Date();
  const match = typeof monthParam === "string" ? /^(\d{4})-(\d{2})$/.exec(monthParam) : null;
  const year = match ? Number(match[1]) : now.getFullYear();
  const month = match ? Number(match[2]) - 1 : now.getMonth();
  const tasks = await getMonthTasks(planId, year, month);

  const stripItems: CalendarStripItem[] = Array.from({ length: 12 }, (_, i) => i).map((i) => ({
    key: `${year}-${i}`,
    label: new Date(year, i, 1).toLocaleDateString(undefined, { month: "short" }),
    href: `/planner?tab=monthly&month=${year}-${String(i + 1).padStart(2, "0")}`,
    active: i === month,
  }));

  return <MonthlyPanel year={year} month={month} tasks={tasks} stripItems={stripItems} m={m} accent={accent} />;
}

async function renderYearly(planId: string, yearParam: string | string[] | undefined, m: Awaited<ReturnType<typeof getMessages>>["m"], locale: Awaited<ReturnType<typeof getMessages>>["locale"], accent: string) {
  const now = new Date();
  const year = typeof yearParam === "string" && /^\d{4}$/.test(yearParam) ? Number(yearParam) : now.getFullYear();
  const tasks = await getYearTasks(planId, year);

  const stripItems: CalendarStripItem[] = Array.from({ length: 8 }, (_, i) => now.getFullYear() - 5 + i).map((y) => ({
    key: String(y),
    label: String(y),
    href: `/planner?tab=yearly&year=${y}`,
    active: y === year,
  }));

  return <YearlyPanel year={year} tasks={tasks} stripItems={stripItems} m={m} locale={locale} accent={accent} />;
}

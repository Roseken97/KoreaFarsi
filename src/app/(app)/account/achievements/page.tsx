import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { BADGES, currentByCategory } from "@/lib/achievements/definitions";
import { getAchievementStats } from "@/lib/achievements/queries";
import { formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.achievementsPage.title };
}

/** Real badges derived from existing progress data (lesson_progress, user_library, planner streak, course_reviews) — no separate achievements table needed. */
export default async function AchievementsPage() {
  const [{ m, locale }, profile, stats] = await Promise.all([getMessages(), getProfile(), getAchievementStats()]);
  if (isSupabaseConfigured && !profile) redirect("/auth/login?next=/account/achievements");
  const t = m.account.achievementsPage;

  const current = currentByCategory(stats);
  const unlockedCount = BADGES.filter((b) => current[b.category] >= b.threshold).length;

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.title} backHref="/account" backLabel={m.account.title} />
      <p className="mb-2 text-sm text-ink-soft">{t.subtitle}</p>

      {!isSupabaseConfigured ? (
        <Notice>{m.account.notConfigured}</Notice>
      ) : (
        <>
          <p className="mb-5 text-sm font-semibold text-teal-deep" dir="ltr">
            {t.unlocked.replace("{done}", formatNumber(unlockedCount, locale)).replace("{total}", formatNumber(BADGES.length, locale))}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map(({ key, Icon, category, threshold }) => {
              const value = current[category];
              const unlocked = value >= threshold;
              const badge = t.badges[key];
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center gap-2 rounded-card p-4 text-center shadow-soft ${unlocked ? "bg-surface" : "bg-cream-deep opacity-70"}`}
                >
                  <span className={`grid size-12 place-items-center rounded-full ${unlocked ? "bg-sage-soft text-teal-deep" : "bg-surface text-ink-faint"}`}>
                    <Icon width={22} height={22} />
                  </span>
                  <span className={`text-[13px] font-semibold ${unlocked ? "text-ink" : "text-ink-faint"}`}>{badge.title}</span>
                  <span className="text-[11px] leading-4 text-ink-faint">{badge.body}</span>
                  {!unlocked && (
                    <span className="text-[11px] font-medium text-ink-faint" dir="ltr">
                      {t.progress.replace("{done}", formatNumber(Math.min(value, threshold), locale)).replace("{total}", formatNumber(threshold, locale))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

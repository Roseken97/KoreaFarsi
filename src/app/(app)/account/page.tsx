import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  BellIcon,
  BooksStackIcon,
  FlameIcon,
  GlobeIcon,
  HelpIcon,
  LevelIcon,
  LibraryIcon,
  PencilIcon,
  PlannerIcon,
  SettingsIcon,
  ShieldIcon,
  SparkleIcon,
  StarIcon,
  TrophyIcon,
} from "@/components/icons";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getUnreadNotificationCount } from "@/lib/notifications/queries";
import { computeStreak, getActivePlan } from "@/lib/planner/queries";
import { getProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SignOutRow } from "./SignOutButton";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.metaTitle };
}

/** Account screen (sketch 05). Level/XP wait on Courses; Streak is real, from Planner (Phase 2). */
export default async function AccountPage() {
  const [{ m, locale }, profile, plan] = await Promise.all([getMessages(), getProfile(), getActivePlan()]);
  if (isSupabaseConfigured && !profile) redirect("/auth/login?next=/account");

  const [streak, isAdmin, unreadCount] = await Promise.all([plan ? computeStreak(plan.id) : Promise.resolve(null), getAdminUser(), getUnreadNotificationCount()]);
  const t = m.account;
  const stats: { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string; value: string; soon: boolean }[] = [
    { label: t.stats.level, Icon: LevelIcon, tone: "text-teal", value: "—", soon: true },
    { label: t.stats.xp, Icon: StarIcon, tone: "text-blush", value: "—", soon: true },
    { label: t.stats.streak, Icon: FlameIcon, tone: "text-danger/80", value: streak === null ? "—" : formatNumber(streak, locale), soon: false },
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        actions={
          <>
            <HeaderIconLink href="/notifications" label={m.home.notifications} badge={unreadCount > 0}>
              <BellIcon width={20} height={20} />
            </HeaderIconLink>
            <HeaderIconLink href="/account/settings" label={t.settings}>
              <SettingsIcon width={20} height={20} />
            </HeaderIconLink>
          </>
        }
      />

      {!isSupabaseConfigured && (
        <div className="mb-6">
          <Notice>{t.notConfigured}</Notice>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <section className="flex items-center gap-4">
            <Link href="/account/profile" className="relative" aria-label={t.editProfile}>
              <Avatar name={profile?.name} email={profile?.user.email} avatarKey={profile?.avatarKey} size={72} className="shadow-soft" />
              <span className="absolute -end-0.5 -bottom-0.5 grid size-7 place-items-center rounded-full bg-violet text-white ring-2 ring-white">
                <PencilIcon width={14} height={14} />
              </span>
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-semibold">{profile?.name || t.title}</h1>
              <p className="mt-0.5 text-sm text-ink-soft">{t.motto}</p>
            </div>
          </section>

          {/* Progress summary — Phase 1 placeholder values */}
          <section>
            <ul className="grid grid-cols-3 gap-3">
              {stats.map(({ label, Icon, tone, value, soon }) => (
                <li key={label} className="flex flex-col items-center rounded-card bg-surface px-2 py-4 text-center shadow-soft">
                  <Icon width={22} height={22} className={tone} />
                  <span className={`mt-2 font-display text-xl font-semibold ${soon ? "text-ink-faint" : "text-ink"}`}>{value}</span>
                  <span className="mt-0.5 text-xs text-ink-soft">{label}</span>
                </li>
              ))}
            </ul>
            {stats.some((s) => s.soon) && <p className="mt-2 text-center text-xs text-ink-faint">{t.stats.soon}</p>}
          </section>

          {/* Motivational banner */}
          <section className="flex items-center gap-3 rounded-card bg-gradient-to-br from-blush-soft to-cream-deep p-4">
            <SparkleIcon width={22} height={22} className="shrink-0 text-blush" />
            <p className="text-sm font-medium text-ink">{t.banner}</p>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <ListGroup>
            <ListRow href="/courses" Icon={BooksStackIcon} title={t.items.courses.title} body={t.items.courses.body} tone="bg-sage-soft text-teal-deep" />
            <ListRow href="/library" Icon={LibraryIcon} title={t.items.books.title} body={t.items.books.body} tone="bg-sage-soft text-teal-deep" />
            <ListRow href="/planner" Icon={PlannerIcon} title={t.items.planner.title} body={t.items.planner.body} tone="bg-sage-soft text-teal-deep" />
            <ListRow href="/account/achievements" Icon={TrophyIcon} title={t.items.achievements.title} body={t.items.achievements.body} tone="bg-sage-soft text-teal-deep" />
            {isAdmin && <ListRow href="/admin" Icon={ShieldIcon} title={t.items.admin.title} body={t.items.admin.body} tone="bg-violet text-white" />}
          </ListGroup>

          <ListGroup>
            <ListRow href="/account/language" Icon={GlobeIcon} title={t.items.language.title} body={t.items.language.body} />
            <ListRow href="/account/settings" Icon={SettingsIcon} title={t.items.settings.title} body={t.items.settings.body} />
            <ListRow href="/account/help" Icon={HelpIcon} title={t.items.help.title} body={t.items.help.body} />
            {profile && <SignOutRow label={t.signOut} />}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

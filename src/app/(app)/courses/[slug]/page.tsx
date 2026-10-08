import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { BooksStackIcon, LayersIcon, LevelIcon, ShieldIcon, WatchIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { completedCount, lessonCount, levelBucket } from "@/lib/courses/types";
import { getCourseOutline, getCourseResources, getCourseReviews } from "@/lib/courses/queries";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";
import { getCurrentUser } from "@/lib/supabase/server";
import { CourseDetailTabs } from "./CourseDetailTabs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getMessages()]);
  const outline = await getCourseOutline(slug);
  if (!outline) return { title: "Course" };
  const c = outline.course;
  const title = locale === "en" ? c.title_en || c.title : c.title;
  const description = ((locale === "en" ? c.description_en || c.description : c.description) ?? "").slice(0, 160) || undefined;
  return {
    title,
    description,
    alternates: localeAlternates(`/courses/${slug}`, locale),
    openGraph: { title, description, ...(c.cover_image_url ? { images: [c.cover_image_url] } : {}) },
  };
}

/** Course Detail (sketch 07): hero uses the course's own cover image, then key info + tabs (Overview/Lessons/Resources/Reviews). */
export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ m, locale }, outline] = await Promise.all([getMessages(), getCourseOutline(slug)]);
  if (!outline) notFound();
  const { course, units, hasAccess, progress } = outline;
  const t = m.courses;

  const title = locale === "en" ? course.title_en || course.title : course.title;
  const description = locale === "en" ? course.description_en || course.description : course.description;
  const total = lessonCount(units);
  const done = completedCount(units, progress);
  const totalMinutes = units.reduce((sum, u) => sum + u.lessons.reduce((n, l) => n + l.duration_minutes, 0), 0);
  const levelLabel = course.level ? t.levels[levelBucket(course.level) ?? "beginner"] || course.level : null;
  const hasCover = Boolean(course.cover_image_url);

  let resources: Awaited<ReturnType<typeof getCourseResources>> = [];
  let reviews: Awaited<ReturnType<typeof getCourseReviews>> = [];
  let currentUserId: string | null = null;
  if (hasAccess) {
    const [r, rv, currentUser] = await Promise.all([getCourseResources(course.id), getCourseReviews(course.id), getCurrentUser()]);
    resources = r;
    reviews = rv;
    currentUserId = currentUser?.id ?? null;
  }

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.title} backHref="/courses" backLabel={t.title} />

      {/* Hero — Visual Element: the course's own selected cover image (sketch 07, callout #9) */}
      <section className="relative h-56 w-full overflow-hidden rounded-hero shadow-lift">
        {hasCover ? (
          <Image src={course.cover_image_url!} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blush-soft via-cream to-sage-soft">
            <SakuraBranch className="absolute -top-2 -end-2 w-40 rtl:-scale-x-100" />
            <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-24" />
          </div>
        )}
        {hasCover && <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" aria-hidden="true" />}
        <div className="relative flex h-full flex-col justify-end p-5">
          <p className={`text-xs font-semibold tracking-wide uppercase ${hasCover ? "text-white/80" : "text-ink-soft"}`}>KoreaFarsi</p>
          <h1 className={`mt-1 font-display text-2xl leading-tight font-bold ${hasCover ? "text-white" : "text-ink"}`} dir="auto">
            {title}
          </h1>
          {levelLabel && <p className={`mt-1 text-sm font-medium ${hasCover ? "text-white/85" : "text-ink-soft"}`}>{levelLabel}</p>}
        </div>
      </section>

      {/* Key info row (sketch callout #3) — 4 sections split by a short vertical divider, close under the hero */}
      <div className="mt-2 grid grid-cols-4 divide-x divide-line rounded-card bg-surface p-3 shadow-soft">
        <KeyInfo icon={<LayersIcon width={18} height={18} />} value={formatNumber(total, locale)} label={t.detail.keyInfo.lessons} />
        <KeyInfo icon={<LevelIcon width={18} height={18} />} value={levelLabel ?? "—"} label={t.detail.keyInfo.level} />
        <KeyInfo icon={<WatchIcon width={18} height={18} />} value={totalMinutes > 0 ? fmt(t.detail.keyInfo.minutes, { n: formatNumber(totalMinutes, locale) }) : "—"} label={t.detail.keyInfo.duration} />
        <KeyInfo icon={<BooksStackIcon width={18} height={18} />} value={t.detail.keyInfo.selfPaced} label={t.detail.keyInfo.selfPacedBody} />
      </div>

      {!hasAccess ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center shadow-soft">
          <ShieldIcon width={28} height={28} className="text-ink-faint" />
          <p className="font-semibold text-ink">{t.lockedTitle}</p>
          <p className="text-sm text-ink-soft">{t.lockedBody}</p>
          <ButtonLink href="/bookstore" className="mt-2 w-auto! px-8">
            {t.getAccessCta}
          </ButtonLink>
        </div>
      ) : (
        <CourseDetailTabs
          course={course}
          units={units}
          progress={progress}
          locale={locale}
          description={description}
          total={total}
          done={done}
          resources={resources}
          reviews={reviews}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

function KeyInfo({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 text-center">
      <span className="text-ink-faint">{icon}</span>
      <span className="text-[13px] font-semibold whitespace-nowrap text-ink" dir="auto">
        {value}
      </span>
      <span className="text-[11px] leading-[1.35] text-ink-soft" dir="auto">
        {label}
      </span>
    </div>
  );
}

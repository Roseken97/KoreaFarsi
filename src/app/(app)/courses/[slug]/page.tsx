import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BooksStackIcon, CheckIcon, ShieldIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { completedCount, isLessonUnlocked, lessonCount } from "@/lib/courses/types";
import { getCourseOutline } from "@/lib/courses/queries";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const outline = await getCourseOutline(slug);
  return { title: outline?.course.title ?? "Course" };
}

/** Course Lesson List (sketch 08). Unit tabs from the sketch are shown as stacked sections instead — simpler, same information. */
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
  const flat = units.flatMap((u) => u.lessons);
  const firstOpenId = flat.find((l) => !progress[l.id])?.id ?? flat[0]?.id ?? null;

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.title} backHref="/courses" backLabel={t.title} />

      <section className="flex items-center gap-4">
        {course.cover_image_url ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-cream-deep shadow-soft">
            <Image src={course.cover_image_url} alt="" fill sizes="80px" className="object-cover" />
          </div>
        ) : (
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-sage-soft text-teal-deep shadow-soft">
            <BooksStackIcon width={32} height={32} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold" dir="auto">
            {title}
          </h1>
          {course.level && <p className="mt-0.5 text-sm text-ink-soft">{course.level}</p>}
        </div>
      </section>

      {description && (
        <p className="mt-4 text-[15px] leading-7 text-ink-soft" dir="auto">
          {description}
        </p>
      )}

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
        <>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-soft">{fmt(t.progress, { done: formatNumber(done, locale), total: formatNumber(total, locale) })}</span>
            {firstOpenId && (
              <Link href={`/courses/${course.slug}/lessons/${firstOpenId}`} className="font-semibold text-teal-deep">
                {done > 0 ? t.continueCta : t.startCta}
              </Link>
            )}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-teal" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>

          <div className="mt-6 flex flex-col gap-6">
            {units.length === 0 ? (
              <Notice>{t.empty}</Notice>
            ) : (
              units.map((unit) => (
                <section key={unit.id}>
                  <h2 className="mb-2 font-display text-lg font-semibold" dir="auto">
                    {locale === "en" ? unit.title_en || unit.title : unit.title}
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {unit.lessons.map((lesson, i) => {
                      const isDone = Boolean(progress[lesson.id]);
                      const isCurrent = !isDone && lesson.id === firstOpenId;
                      const unlocked = isDone || isLessonUnlocked(units, progress, lesson.id);
                      const rowClass = `flex items-center gap-3 rounded-field border p-3 ${isCurrent ? "border-teal bg-teal/5" : "border-line bg-surface"}`;
                      const content = (
                        <>
                          <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${isDone ? "bg-success text-white" : "bg-cream-deep text-ink-soft"}`}>
                            {isDone ? <CheckIcon width={14} height={14} /> : formatNumber(i + 1, locale)}
                          </span>
                          <span className={`min-w-0 flex-1 truncate text-sm font-medium ${unlocked ? "text-ink" : "text-ink-faint"}`} dir="auto">
                            {locale === "en" ? lesson.title_en || lesson.title : lesson.title}
                          </span>
                          {unlocked ? (
                            lesson.duration_minutes > 0 && <span className="shrink-0 text-xs text-ink-faint">{lesson.duration_minutes}′</span>
                          ) : (
                            <ShieldIcon width={16} height={16} className="shrink-0 text-ink-faint" />
                          )}
                        </>
                      );
                      return (
                        <li key={lesson.id}>
                          {unlocked ? (
                            <Link href={`/courses/${course.slug}/lessons/${lesson.id}`} className={`${rowClass} transition hover:bg-cream`}>
                              {content}
                            </Link>
                          ) : (
                            <div className={`${rowClass} cursor-not-allowed opacity-70`} aria-disabled="true">
                              {content}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BooksStackIcon, ChevronIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getCourseLessonCounts, getCourses } from "@/lib/courses/queries";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.courses.metaTitle };
}

/** Course list (sketch 06). Level filter tabs from the sketch are deferred — fine while the catalog is small. */
export default async function CoursesPage() {
  const [{ m, locale }, courses] = await Promise.all([getMessages(), getCourses()]);
  const counts = await getCourseLessonCounts(courses.map((c) => c.id));
  const t = m.courses;

  return (
    <div className="animate-fade-up">
      <SubPageHeader title={t.title} backHref="/home" backLabel={m.common.backHome} />

      {courses.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {courses.map((c) => {
            const title = locale === "en" ? c.title_en || c.title : c.title;
            return (
              <li key={c.id}>
                <Link href={`/courses/${c.slug}`} className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                  {c.cover_image_url ? (
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream-deep">
                      <Image src={c.cover_image_url} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-sage-soft text-teal-deep">
                      <BooksStackIcon width={28} height={28} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink" dir="auto">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-soft">
                      {[c.level, fmt(t.lessonsCount, { n: formatNumber(counts[c.id] ?? 0, locale) })].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ChevronIcon width={18} height={18} className="shrink-0 text-ink-faint rtl:-scale-x-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

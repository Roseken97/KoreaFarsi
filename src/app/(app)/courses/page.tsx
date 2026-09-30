import type { Metadata } from "next";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { Hero } from "@/components/shell/Hero";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getCourseLessonCounts, getCourses } from "@/lib/courses/queries";
import { getMessages } from "@/lib/i18n/server";
import { CoursesBrowser } from "./CoursesBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.courses.metaTitle };
}

/** Course list (sketch 06). */
export default async function CoursesPage() {
  const [{ m, locale }, courses] = await Promise.all([getMessages(), getCourses()]);
  const counts = await getCourseLessonCounts(courses.map((c) => c.id));

  return (
    <div className="animate-fade-up">
      <SubPageHeader title={m.courses.title} backHref="/home" backLabel={m.common.backHome} />
      <p className="mb-5 text-sm text-ink-soft">{m.courses.subtitle}</p>

      {/* Hero — Visual Element (sketch 06, callout #6): brand illustration, or the active announcement banner */}
      <div className="mb-6">
        <Hero placement="courses" locale={locale} size="sm">
          <SakuraBranch className="absolute -top-3 -end-3 w-32 md:w-40 rtl:-scale-x-100" />
          <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-16 md:h-20" />
        </Hero>
      </div>

      <CoursesBrowser courses={courses} lessonCounts={counts} />
    </div>
  );
}

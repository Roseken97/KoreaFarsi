import type { Metadata } from "next";
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
  const [{ m }, courses] = await Promise.all([getMessages(), getCourses()]);
  const counts = await getCourseLessonCounts(courses.map((c) => c.id));

  return (
    <div className="animate-fade-up">
      <SubPageHeader title={m.courses.title} backHref="/home" backLabel={m.common.backHome} />
      <CoursesBrowser courses={courses} lessonCounts={counts} />
    </div>
  );
}

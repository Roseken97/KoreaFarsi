import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listCourseProductsAdmin, listCoursesAdmin } from "@/lib/courses/admin-actions";
import { getMessages } from "@/lib/i18n/server";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { CoursesAdmin } from "./CoursesAdmin";

export const metadata: Metadata = { title: "Courses", robots: { index: false } };

/** Internal page: create courses; unit/lesson management (with video upload) happens on /admin/courses/[id]. */
export default async function CoursesAdminPage() {
  const { m } = await getMessages();
  const t = m.coursesAdmin;

  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell title={t.title} nav={<AdminNav active="courses" />}>
        <Notice>{m.admin.notConfigured}</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/courses");
  if (!(await getAdminUser())) {
    return (
      <Shell title={t.title} nav={<AdminNav active="courses" />}>
        <Notice tone="error">{m.admin.forbidden}</Notice>
      </Shell>
    );
  }

  const [courses, products] = await Promise.all([listCoursesAdmin(), listCourseProductsAdmin()]);

  return (
    <Shell title={t.title} subtitle={t.subtitle} nav={<AdminNav active="courses" />}>
      <CoursesAdmin courses={courses} products={products} />
    </Shell>
  );
}

function Shell({ title, subtitle, nav, children }: { title: string; subtitle?: string; nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 mb-6 text-sm text-ink-soft">{subtitle}</p> : <div className="mb-6" />}
      {children}
    </div>
  );
}

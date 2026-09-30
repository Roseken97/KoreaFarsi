import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getAdminUser } from "@/lib/admin";
import { getCourseForAdmin } from "@/lib/courses/admin-actions";
import { getMessages } from "@/lib/i18n/server";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { CourseContentAdmin } from "./CourseContentAdmin";

export const metadata: Metadata = { title: "Course content", robots: { index: false } };

export default async function CourseContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { m } = await getMessages();

  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell>
        <Notice>{m.admin.notConfigured}</Notice>
      </Shell>
    );
  }
  if (!(await getCurrentUser())) redirect(`/auth/login?next=/admin/courses/${id}`);
  if (!(await getAdminUser())) {
    return (
      <Shell>
        <Notice tone="error">{m.admin.forbidden}</Notice>
      </Shell>
    );
  }

  const data = await getCourseForAdmin(id);
  if (!data) notFound();

  return (
    <Shell>
      <SubPageHeader title={data.course.title} backHref="/admin/courses" backLabel="Courses" />
      <CourseContentAdmin course={data.course} units={data.units} lessons={data.lessons} resources={data.resources} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      <AdminNav active="courses" />
      {children}
    </div>
  );
}

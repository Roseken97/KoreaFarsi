import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listAnnouncementsAdmin } from "@/lib/announcements/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { AnnouncementsAdmin } from "./AnnouncementsAdmin";

export const metadata: Metadata = { title: "Announcements", robots: { index: false } };

/** Internal page: banners shown inside the Hero sections (Home / Courses) without a code change. */
export default async function AnnouncementsPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell nav={<AdminNav active="announcements" />}>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/announcements");
  if (!(await getAdminUser())) {
    return (
      <Shell nav={<AdminNav active="announcements" />}>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const announcements = await listAnnouncementsAdmin();

  return (
    <Shell nav={<AdminNav active="announcements" />}>
      <AnnouncementsAdmin announcements={announcements} />
    </Shell>
  );
}

function Shell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">Announcements</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">Banners shown inside the Home / Courses hero. Only the highest-priority active row per page is displayed.</p>
      {children}
    </div>
  );
}

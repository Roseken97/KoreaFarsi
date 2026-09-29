import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listKoreaLifePostsAdmin } from "@/lib/korealife/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { KoreaLifeAdmin } from "./KoreaLifeAdmin";

export const metadata: Metadata = { title: "Korea Life", robots: { index: false } };

/** Internal page: create/edit Korea Life articles (culture/travel/food/life) shown at /korea-life. */
export default async function KoreaLifeAdminPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell nav={<AdminNav active="korealife" />}>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/korea-life");
  if (!(await getAdminUser())) {
    return (
      <Shell nav={<AdminNav active="korealife" />}>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const posts = await listKoreaLifePostsAdmin();

  return (
    <Shell nav={<AdminNav active="korealife" />}>
      <KoreaLifeAdmin posts={posts} />
    </Shell>
  );
}

function Shell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">Korea Life</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">Culture, travel, food and life articles shown at /korea-life.</p>
      {children}
    </div>
  );
}

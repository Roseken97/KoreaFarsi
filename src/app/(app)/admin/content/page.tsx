import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listCopyOverridesAdmin } from "@/lib/site-copy/admin-actions";
import { copyEntries } from "@/lib/site-copy/entries";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { ContentAdmin } from "./ContentAdmin";

export const metadata: Metadata = { title: "Content", robots: { index: false } };

/** Internal page: edit any title, description or label in the app (English + Persian) without a code change. */
export default async function ContentPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell nav={<AdminNav active="content" />}>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/content");
  if (!(await getAdminUser())) {
    return (
      <Shell nav={<AdminNav active="content" />}>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const overrides = await listCopyOverridesAdmin();

  return (
    <Shell nav={<AdminNav active="content" />}>
      <ContentAdmin entries={copyEntries()} initialOverrides={overrides} />
    </Shell>
  );
}

function Shell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-4xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">Content</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        Edit the titles, descriptions and labels shown across the app. Changes go live right away; &ldquo;Reset&rdquo; brings back the original text.
      </p>
      {children}
    </div>
  );
}

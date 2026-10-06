import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listOnboardingSlidesAdmin } from "@/lib/onboarding-slides/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { OnboardingAdmin } from "./OnboardingAdmin";

export const metadata: Metadata = { title: "Onboarding slides", robots: { index: false } };

/** Internal page: edit the onboarding carousel (photos and text) without a code change. */
export default async function OnboardingSlidesPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell nav={<AdminNav active="onboarding" />}>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/onboarding");
  if (!(await getAdminUser())) {
    return (
      <Shell nav={<AdminNav active="onboarding" />}>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const slides = await listOnboardingSlidesAdmin();

  return (
    <Shell nav={<AdminNav active="onboarding" />}>
      <OnboardingAdmin slides={slides} />
    </Shell>
  );
}

function Shell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">Onboarding slides</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">The first-run slides before sign-up: a photo, a two-line headline and a short text per slide. Portrait photos work best (about 3:4).</p>
      {children}
    </div>
  );
}

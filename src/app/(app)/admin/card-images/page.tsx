import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listCardImagesAdmin } from "@/lib/card-images/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { CardImagesAdmin } from "./CardImagesAdmin";

export const metadata: Metadata = { title: "Card photos", robots: { index: false } };

/** Internal page: the photos on the Home and Korea Life section cards. */
export default async function CardImagesPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell nav={<AdminNav active="cardImages" />}>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/card-images");
  if (!(await getAdminUser())) {
    return (
      <Shell nav={<AdminNav active="cardImages" />}>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const images = await listCardImagesAdmin();

  return (
    <Shell nav={<AdminNav active="cardImages" />}>
      <CardImagesAdmin images={images} />
    </Shell>
  );
}

function Shell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">Card photos</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        The photos on the section cards. Square photos work best, with the subject in the upper part: the bottom fades into the card color behind the title. A
        card without a photo keeps its plain color.
      </p>
      {children}
    </div>
  );
}

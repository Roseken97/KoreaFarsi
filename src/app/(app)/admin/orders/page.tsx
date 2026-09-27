import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { getMessages } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { OrdersList, type PurchaseRequestRow } from "./OrdersList";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

/** Internal page: Rose confirms a payment happened, then grants library access here. */
export default async function OrdersPage() {
  const { m } = await getMessages();
  const t = m.orders;

  if (!isSupabaseConfigured) {
    return (
      <Shell title={t.title} nav={<AdminNav active="orders" />}>
        <Notice>{m.admin.notConfigured}</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/orders");
  if (!(await getAdminUser())) {
    return (
      <Shell title={t.title} nav={<AdminNav active="orders" />}>
        <Notice tone="error">{t.errors.forbidden}</Notice>
      </Shell>
    );
  }

  const admin = supabaseAdmin()!;
  const { data } = await admin
    .from("purchase_requests")
    .select("id, name, contact, message, items, total, currency, status, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Shell title={t.title} subtitle={t.subtitle} nav={<AdminNav active="orders" />}>
      <OrdersList requests={(data ?? []) as PurchaseRequestRow[]} />
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

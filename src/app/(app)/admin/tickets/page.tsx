import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { listTicketsAdmin } from "@/lib/tickets/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { TicketsAdmin } from "./TicketsAdmin";

export const metadata: Metadata = { title: "Tickets", robots: { index: false } };

/** Internal page: every learner's support ticket, oldest-reply-first-ish (sorted by updated_at). */
export default async function TicketsAdminPage() {
  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/tickets");
  if (!(await getAdminUser())) {
    return (
      <Shell>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const tickets = await listTicketsAdmin();

  return (
    <Shell>
      <TicketsAdmin tickets={tickets} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      <AdminNav active="tickets" />
      <h1 className="font-display text-3xl font-semibold">Tickets</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">Every learner&apos;s support ticket, most recently updated first.</p>
      {children}
    </div>
  );
}

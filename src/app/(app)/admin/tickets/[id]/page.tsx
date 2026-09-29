import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getAdminUser } from "@/lib/admin";
import { getTicketAdmin } from "@/lib/tickets/admin-actions";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { AdminThreadView } from "./AdminThreadView";

export const metadata: Metadata = { title: "Ticket", robots: { index: false } };

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell>
        <Notice>Supabase isn&apos;t configured yet.</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect(`/auth/login?next=/admin/tickets/${id}`);
  if (!(await getAdminUser())) {
    return (
      <Shell>
        <Notice tone="error">This page is only available to KoreaFarsi admins.</Notice>
      </Shell>
    );
  }

  const result = await getTicketAdmin(id);
  if (!result) notFound();

  return (
    <Shell>
      <SubPageHeader title={result.ticket.subject} backHref="/admin/tickets" backLabel="Tickets" />
      <AdminThreadView ticket={result.ticket} messages={result.messages} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      <AdminNav active="tickets" />
      {children}
    </div>
  );
}

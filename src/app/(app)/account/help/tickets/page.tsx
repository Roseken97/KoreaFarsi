import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { getMyTickets } from "@/lib/tickets/queries";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { TicketsView } from "./TicketsView";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.helpPage.tickets.metaTitle };
}

export default async function TicketsPage() {
  const [{ m }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  const t = m.account.helpPage;

  if (isSupabaseConfigured && !user) redirect("/auth/login?next=/account/help/tickets");

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.tickets.title} backHref="/account/help" backLabel={t.title} />
      <p className="mb-4 text-sm text-ink-soft">{t.tickets.subtitle}</p>
      {!isSupabaseConfigured ? <Notice>{m.account.notConfigured}</Notice> : <TicketsView tickets={await getMyTickets()} />}
    </div>
  );
}

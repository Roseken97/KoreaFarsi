import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getMessages } from "@/lib/i18n/server";
import { getMyTicket } from "@/lib/tickets/queries";
import { ThreadView } from "./ThreadView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getMyTicket(id);
  return { title: result?.ticket.subject ?? "Ticket" };
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ m }, result] = await Promise.all([getMessages(), getMyTicket(id)]);
  if (!result) notFound();
  const t = m.account.helpPage;

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={result.ticket.subject} backHref="/account/help/tickets" backLabel={t.tickets.backToList} />
      <ThreadView ticket={result.ticket} messages={result.messages} />
    </div>
  );
}

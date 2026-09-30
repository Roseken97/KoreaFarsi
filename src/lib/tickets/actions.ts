"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TicketCategory } from "./types";

export type TicketResult = { ok: true; id: string } | { ok: false; error: "unauthenticated" | "generic" };
export type ReplyResult = { ok: true } | { ok: false; error: "unauthenticated" | "generic" };

export async function createTicket(category: TicketCategory, subject: string, message: string): Promise<TicketResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();
  if (!cleanSubject || !cleanMessage) return { ok: false, error: "generic" };

  const { data: ticket, error } = await supabase.from("support_tickets").insert({ user_id: auth.user.id, category, subject: cleanSubject }).select("id").single();
  if (error || !ticket) {
    console.error("[tickets] create:", error?.message);
    return { ok: false, error: "generic" };
  }

  const { error: msgError } = await supabase.from("support_ticket_messages").insert({ ticket_id: ticket.id, sender: "user", body: cleanMessage });
  if (msgError) {
    console.error("[tickets] first message:", msgError.message);
    return { ok: false, error: "generic" };
  }

  revalidatePath("/account/help/tickets");
  return { ok: true, id: ticket.id as string };
}

export async function replyToTicket(ticketId: string, message: string): Promise<ReplyResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const cleanMessage = message.trim();
  if (!cleanMessage) return { ok: false, error: "generic" };

  const { error: msgError } = await supabase.from("support_ticket_messages").insert({ ticket_id: ticketId, sender: "user", body: cleanMessage });
  if (msgError) {
    console.error("[tickets] reply:", msgError.message);
    return { ok: false, error: "generic" };
  }

  // Replying reopens an answered/closed ticket.
  await supabase.from("support_tickets").update({ status: "open", updated_at: new Date().toISOString() }).eq("id", ticketId).eq("user_id", auth.user.id);

  revalidatePath(`/account/help/tickets/${ticketId}`);
  return { ok: true };
}

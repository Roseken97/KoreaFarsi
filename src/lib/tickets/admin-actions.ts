"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SupportTicket, TicketMessage, TicketStatus } from "./types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

export async function listTicketsAdmin(): Promise<SupportTicket[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store.from("support_tickets").select("*").order("updated_at", { ascending: false });
  if (error) {
    console.error("[admin/tickets] list:", error.message);
    return [];
  }
  return (data ?? []) as SupportTicket[];
}

export async function getTicketAdmin(id: string): Promise<{ ticket: SupportTicket; messages: TicketMessage[] } | null> {
  const store = await guard();
  if (!store) return null;
  const [{ data: ticket }, { data: messages }] = await Promise.all([
    store.from("support_tickets").select("*").eq("id", id).maybeSingle(),
    store.from("support_ticket_messages").select("*").eq("ticket_id", id).order("created_at", { ascending: true }),
  ]);
  if (!ticket) return null;
  return { ticket: ticket as SupportTicket, messages: (messages ?? []) as TicketMessage[] };
}

export async function replyAsAdmin(ticketId: string, message: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const body = message.trim();
  if (!body) return { ok: false, error: "generic" };

  const { data: ticket } = await store.from("support_tickets").select("user_id, subject").eq("id", ticketId).maybeSingle();
  if (!ticket) return { ok: false, error: "generic" };

  const { error } = await store.from("support_ticket_messages").insert({ ticket_id: ticketId, sender: "admin", body });
  if (error) {
    console.error("[admin/tickets] reply:", error.message);
    return { ok: false, error: "generic" };
  }

  await store.from("support_tickets").update({ status: "answered", updated_at: new Date().toISOString() }).eq("id", ticketId);
  await store.from("notifications").insert({
    user_id: ticket.user_id,
    title: `پاسخ جدید برای تیکت «${ticket.subject}»`,
    title_en: `New reply on your ticket "${ticket.subject}"`,
    href: "/account/help/tickets",
  });

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  return { ok: true };
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", ticketId);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  return { ok: true };
}

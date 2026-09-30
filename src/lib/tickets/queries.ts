import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { SupportTicket, TicketMessage } from "./types";

export async function getMyTickets(): Promise<SupportTicket[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
  if (error) {
    console.error("[tickets] list:", error.message);
    return [];
  }
  return (data ?? []) as SupportTicket[];
}

export async function getMyTicket(id: string): Promise<{ ticket: SupportTicket; messages: TicketMessage[] } | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: ticket } = await supabase.from("support_tickets").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!ticket) return null;

  const { data: messages, error } = await supabase.from("support_ticket_messages").select("*").eq("ticket_id", id).order("created_at", { ascending: true });
  if (error) console.error("[tickets] messages:", error.message);

  return { ticket: ticket as SupportTicket, messages: (messages ?? []) as TicketMessage[] };
}

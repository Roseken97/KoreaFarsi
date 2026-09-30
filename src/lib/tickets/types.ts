export type TicketCategory = "technical" | "billing" | "courses" | "account" | "other";
export type TicketStatus = "open" | "answered" | "closed";

/** Mirrors public.support_tickets (supabase/migrations/0019_support_tickets.sql). */
export type SupportTicket = {
  id: string;
  user_id: string;
  category: TicketCategory;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
};

/** Mirrors public.support_ticket_messages. */
export type TicketMessage = {
  id: string;
  ticket_id: string;
  sender: "user" | "admin";
  body: string;
  created_at: string;
};

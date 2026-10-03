"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { replyAsAdmin, updateTicketStatus } from "@/lib/tickets/admin-actions";
import type { SupportTicket, TicketMessage, TicketStatus } from "@/lib/tickets/types";

const STATUSES: TicketStatus[] = ["open", "answered", "closed"];

export function AdminThreadView({ ticket, messages }: { ticket: SupportTicket; messages: TicketMessage[] }) {
  const [items, setItems] = useState(messages);
  const [status, setStatus] = useState(ticket.status);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = reply.trim();
    if (!body) return;
    setSending(true);
    setError(null);
    const result = await replyAsAdmin(ticket.id, body);
    setSending(false);
    if (!result.ok) return setError("Couldn't send the reply.");
    setItems((prev) => [...prev, { id: crypto.randomUUID(), ticket_id: ticket.id, sender: "admin", body, created_at: new Date().toISOString() }]);
    setStatus("answered");
    setReply("");
  }

  async function onStatusChange(next: TicketStatus) {
    setStatus(next);
    const result = await updateTicketStatus(ticket.id, next);
    if (!result.ok) setStatus(ticket.status);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 rounded-card bg-surface p-3 shadow-soft">
        <span className="text-sm text-ink-soft capitalize">{ticket.category}</span>
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${status === s ? "bg-violet text-white" : "border border-line text-ink-soft"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
            <div
              dir="auto"
              className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] leading-7 shadow-soft ${
                msg.sender === "admin" ? "rounded-ee-md bg-teal text-white" : "rounded-es-md bg-surface text-ink"
              }`}
            >
              <p className={`mb-0.5 text-[11px] font-semibold ${msg.sender === "admin" ? "text-white/75" : "text-ink-faint"}`}>{msg.sender === "admin" ? "You (Support)" : "Learner"}</p>
              <p className="whitespace-pre-line">{msg.body}</p>
            </div>
          </div>
        ))}
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          rows={3}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your reply…"
          dir="auto"
          className="rounded-field border border-line bg-cream px-3.5 py-2.5 text-[15px] leading-7 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
        />
        <Button type="submit" loading={sending} className="w-auto! self-end px-6">
          Send reply
        </Button>
      </form>
    </div>
  );
}

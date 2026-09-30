"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { replyToTicket } from "@/lib/tickets/actions";
import type { SupportTicket, TicketMessage, TicketStatus } from "@/lib/tickets/types";
import { useI18n } from "@/lib/i18n/client";

const STATUS_TONE: Record<TicketStatus, string> = {
  open: "bg-blush-soft text-blush",
  answered: "bg-sage-soft text-teal-deep",
  closed: "bg-cream-deep text-ink-faint",
};

export function ThreadView({ ticket, messages }: { ticket: SupportTicket; messages: TicketMessage[] }) {
  const { m } = useI18n();
  const t = m.account.helpPage.tickets;
  const [items, setItems] = useState(messages);
  const [status, setStatus] = useState(ticket.status);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = reply.trim();
    if (!body) return;
    setSending(true);
    setError(false);
    const result = await replyToTicket(ticket.id, body);
    setSending(false);
    if (!result.ok) return setError(true);
    setItems((prev) => [...prev, { id: crypto.randomUUID(), ticket_id: ticket.id, sender: "user", body, created_at: new Date().toISOString() }]);
    setStatus("open");
    setReply("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-faint">{t.categories[ticket.category]}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONE[status]}`}>{t.status[status]}</span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              dir="auto"
              className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] leading-7 shadow-soft ${
                msg.sender === "user" ? "rounded-ee-md bg-blush-soft text-ink" : "rounded-es-md bg-surface text-ink"
              }`}
            >
              <p className="mb-0.5 text-[11px] font-semibold text-ink-faint">{msg.sender === "user" ? t.you : t.support}</p>
              <p className="whitespace-pre-line">{msg.body}</p>
            </div>
          </div>
        ))}
      </div>

      {error && <Notice tone="error">{t.error}</Notice>}

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          rows={3}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={t.replyPlaceholder}
          dir="auto"
          className="rounded-field border border-line bg-surface px-3.5 py-2.5 text-[15px] leading-7 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
        />
        <Button type="submit" loading={sending} className="w-auto! self-end px-6">
          {t.send}
        </Button>
      </form>
    </div>
  );
}

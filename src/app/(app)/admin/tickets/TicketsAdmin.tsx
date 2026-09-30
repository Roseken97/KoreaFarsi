"use client";

import Link from "next/link";
import { useState } from "react";
import type { SupportTicket, TicketStatus } from "@/lib/tickets/types";

const STATUS_TONE: Record<TicketStatus, string> = {
  open: "bg-blush-soft text-blush",
  answered: "bg-sage-soft text-teal-deep",
  closed: "bg-cream-deep text-ink-faint",
};

const FILTERS: (TicketStatus | "all")[] = ["all", "open", "answered", "closed"];

export function TicketsAdmin({ tickets }: { tickets: SupportTicket[] }) {
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-full bg-cream-deep p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium capitalize transition ${filter === f ? "bg-surface text-ink shadow-soft" : "text-ink-soft"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">No tickets here.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/admin/tickets/${ticket.id}`} className="flex items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-soft transition hover:bg-cream">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold" dir="auto">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint capitalize">
                    {ticket.category} · {new Date(ticket.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[ticket.status]}`}>{ticket.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

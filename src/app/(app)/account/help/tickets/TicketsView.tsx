"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { createTicket } from "@/lib/tickets/actions";
import type { SupportTicket, TicketCategory, TicketStatus } from "@/lib/tickets/types";
import { useI18n } from "@/lib/i18n/client";

const CATEGORIES: TicketCategory[] = ["technical", "billing", "courses", "account", "other"];

const STATUS_TONE: Record<TicketStatus, string> = {
  open: "bg-blush-soft text-blush",
  answered: "bg-sage-soft text-teal-deep",
  closed: "bg-cream-deep text-ink-faint",
};

export function TicketsView({ tickets }: { tickets: SupportTicket[] }) {
  const { m, locale } = useI18n();
  const t = m.account.helpPage.tickets;
  const router = useRouter();
  const [showForm, setShowForm] = useState(tickets.length === 0);
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(false);
    const result = await createTicket(category, subject, message);
    setSaving(false);
    if (!result.ok) return setError(true);
    router.push(`/account/help/tickets/${result.id}`);
  }

  return (
    <div className="flex flex-col gap-5">
      {showForm ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-soft">
          {error && <Notice tone="error">{t.error}</Notice>}
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">{t.category}</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className={selectClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.categories[c]}
                </option>
              ))}
            </select>
          </label>
          <Field label={t.subject} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subjectPlaceholder} required />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">{t.message}</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              dir="auto"
              required
              className="rounded-field border border-line bg-cream px-3.5 py-2.5 text-[15px] leading-7 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" loading={saving}>
              {t.submit}
            </Button>
            {tickets.length > 0 && (
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="w-auto! px-6">
                {locale === "fa" ? "انصراف" : "Cancel"}
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-auto! self-start px-6">
          <PlusIcon width={16} height={16} />
          {t.newTicket}
        </Button>
      )}

      {tickets.length === 0 ? (
        !showForm && <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/account/help/tickets/${ticket.id}`} className="flex items-center justify-between gap-3 rounded-field border border-line bg-surface p-3.5 shadow-soft transition hover:bg-cream">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink" dir="auto">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">{t.categories[ticket.category]}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONE[ticket.status]}`}>{t.status[ticket.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const selectClass = "h-11 rounded-field border border-line bg-cream px-3.5 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";

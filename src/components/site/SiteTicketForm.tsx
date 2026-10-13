"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createTicket } from "@/lib/tickets/actions";
import type { TicketCategory } from "@/lib/tickets/types";
import { useI18n } from "@/lib/i18n/client";

const CATEGORIES: TicketCategory[] = ["technical", "billing", "courses", "account", "other"];

const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#A99FC4] focus:border-[#2FE6E0] focus:ring-4 focus:ring-[#2FE6E0]/15";

/** Website ticket form: the same support_tickets the app's Help screen uses, so answers show in both. */
export function SiteTicketForm() {
  const { m } = useI18n();
  const t = m.account.helpPage.tickets;
  const s = m.site.contact.ticket;
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(false);
    const result = await createTicket(category, subject, message);
    setSaving(false);
    if (!result.ok) return setError(true);
    setSentId(result.id);
    setSubject("");
    setMessage("");
  }

  if (sentId) {
    return (
      <div className="flex flex-col gap-4">
        <p role="status" className="m-0 rounded-2xl border border-[#2FE6E0]/40 bg-[#2FE6E0]/10 p-4 text-[15px] text-white">
          {s.sent}
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-bold">
          <Link href={`/account/help/tickets/${sentId}`} className="rounded-full bg-white/90 px-5 py-2.5 font-extrabold text-[#1C1336]">
            {s.track}
          </Link>
          <button type="button" onClick={() => setSentId(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-white hover:bg-white/[0.08]">
            {s.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="m-0 rounded-2xl border border-[#FF8FC7]/40 bg-[#FF8FC7]/10 p-3 text-sm text-white">
          {t.error}
        </p>
      )}
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-[#E4DAF7]">{t.category}</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className={`${fieldClass} [&>option]:text-[#1C1336]`}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t.categories[c]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-[#E4DAF7]">{t.subject}</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subjectPlaceholder} required dir="auto" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-[#E4DAF7]">{t.message}</span>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.messagePlaceholder} required dir="auto" className={`${fieldClass} leading-7`} />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-full bg-white/90 px-7 py-3 text-[15px] font-extrabold text-[#1C1336] transition hover:bg-white disabled:opacity-60"
      >
        {t.submit}
      </button>
    </form>
  );
}

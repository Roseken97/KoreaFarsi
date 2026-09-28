"use client";

import { useState, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { deleteAnnouncement, saveAnnouncement, type AdminResult, type AnnouncementInput } from "@/lib/announcements/admin-actions";
import type { Announcement, AnnouncementPlacement } from "@/lib/announcements/types";

const EMPTY: AnnouncementInput = {
  id: null,
  placement: "all",
  title: "",
  title_en: "",
  body: "",
  body_en: "",
  href: "",
  is_active: true,
  sort_order: 0,
};

function toInput(a: Announcement): AnnouncementInput {
  return {
    id: a.id,
    placement: a.placement,
    title: a.title,
    title_en: a.title_en ?? "",
    body: a.body ?? "",
    body_en: a.body_en ?? "",
    href: a.href ?? "",
    is_active: a.is_active,
    sort_order: a.sort_order,
  };
}

const PLACEMENTS: { value: AnnouncementPlacement; label: string }[] = [
  { value: "all", label: "All pages with a hero" },
  { value: "home", label: "Home only" },
  { value: "courses", label: "Courses only" },
];

export function AnnouncementsAdmin({ announcements }: { announcements: Announcement[] }) {
  const [form, setForm] = useState<AnnouncementInput>(EMPTY);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const errorText = (r: AdminResult) => (r.ok ? "" : r.error === "title" ? "Please enter a title." : r.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : "Couldn't save. Please try again.");

  function set<K extends keyof AnnouncementInput>(key: K, value: AnnouncementInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveAnnouncement(form);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setStatus({ tone: "success", text: form.id ? "Announcement updated." : "Announcement created." });
    setForm(EMPTY);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{form.id ? "Edit announcement" : "New announcement"}</h2>
          {form.id && (
            <button type="button" onClick={() => setForm(EMPTY)} className="text-sm text-ink-soft hover:text-ink">
              Cancel edit
            </button>
          )}
        </div>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}

        <Labeled label="Shows in">
          <select value={form.placement} onChange={(e) => set("placement", e.target.value as AnnouncementPlacement)} className={selectClass}>
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Labeled>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (Persian)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <Field label="Title (English)" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} ltr />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Body (Persian, optional)">
            <textarea rows={2} value={form.body} onChange={(e) => set("body", e.target.value)} dir="auto" className={textareaClass} />
          </Labeled>
          <Labeled label="Body (English, optional)">
            <textarea rows={2} value={form.body_en} onChange={(e) => set("body_en", e.target.value)} dir="ltr" className={textareaClass} />
          </Labeled>
        </div>

        <Field label="Link (optional — tapping the banner opens this)" value={form.href} onChange={(e) => set("href", e.target.value)} ltr />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="size-4" />
          Active
        </label>

        <Button type="submit" loading={saving}>
          {form.id ? "Save changes" : "Create announcement"}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Announcements ({announcements.length})</h2>
        {announcements.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">No announcements yet. Create one above to fill the hero banners.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {announcements.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-soft">
                <div className="min-w-0">
                  <p className="font-semibold" dir="auto">
                    {a.title} <span className="font-normal text-ink-faint">({a.placement})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">{a.is_active ? "Active" : "Hidden"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setForm(toInput(a))} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${a.title}"?`)) return;
                      const result = await deleteAnnouncement(a.id);
                      if (!result.ok) setStatus({ tone: "error", text: errorText(result) });
                    }}
                    aria-label="Delete"
                    className="grid size-8 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const textareaClass = "rounded-field border border-line bg-surface px-4 py-3 text-[15px] leading-7 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";
const selectClass = "h-13 rounded-field border border-line bg-surface px-4 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

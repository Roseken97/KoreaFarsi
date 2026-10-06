"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { deleteOnboardingSlide, saveOnboardingSlide, seedDefaultSlides, type AdminResult, type SlideInput } from "@/lib/onboarding-slides/admin-actions";
import { SLIDE_COLORS, SLIDE_COLOR_KEYS, type OnboardingSlideRow } from "@/lib/onboarding-slides/types";
import { createUploadTicket } from "@/lib/products/admin-actions";
import { createClient } from "@/lib/supabase/client";

function emptyInput(nextOrder: number): SlideInput {
  return {
    id: null,
    color: "peach",
    badge: "",
    title: "",
    title_accent: "",
    body: "",
    title_en: "",
    title_accent_en: "",
    body_en: "",
    image_url: null,
    is_active: true,
    sort_order: nextOrder,
  };
}

function toInput(s: OnboardingSlideRow): SlideInput {
  return {
    id: s.id,
    color: s.color,
    badge: s.badge ?? "",
    title: s.title,
    title_accent: s.title_accent ?? "",
    body: s.body ?? "",
    title_en: s.title_en ?? "",
    title_accent_en: s.title_accent_en ?? "",
    body_en: s.body_en ?? "",
    image_url: s.image_url,
    is_active: s.is_active,
    sort_order: s.sort_order,
  };
}

export function OnboardingAdmin({ slides }: { slides: OnboardingSlideRow[] }) {
  const nextOrder = (slides.at(-1)?.sort_order ?? 0) + 10;
  const [form, setForm] = useState<SlideInput>(() => emptyInput(nextOrder));
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);

  const errorText = (r: AdminResult) =>
    r.ok ? "" : r.error === "title" ? "Please enter the first headline line (Persian)." : r.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : "Couldn't save. Please try again.";

  function set<K extends keyof SlideInput>(key: K, value: SlideInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const ticket = await createUploadTicket("cover", `onboarding/${form.id ?? Date.now()}`, file.name);
    if (!ticket.ok) {
      setUploading(false);
      return setStatus({ tone: "error", text: "Couldn't start the upload." });
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(false);
    if (error) return setStatus({ tone: "error", text: `Upload failed: ${error.message}` });
    const { data } = supabase.storage.from("covers").getPublicUrl(ticket.path);
    set("image_url", data.publicUrl);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveOnboardingSlide(form);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setStatus({ tone: "success", text: form.id ? "Slide updated." : "Slide added." });
    setForm(emptyInput(form.id ? nextOrder : form.sort_order + 10));
  }

  async function onSeed() {
    setSeeding(true);
    const result = await seedDefaultSlides();
    setSeeding(false);
    setStatus(result.ok ? { tone: "success", text: "The 4 starting slides are ready to edit." } : { tone: "error", text: errorText(result) });
  }

  const color = SLIDE_COLORS[form.color];

  return (
    <div className="flex flex-col gap-8">
      {slides.length === 0 && (
        <div className="flex flex-col gap-3 rounded-card border border-dashed border-line p-5 text-sm text-ink-soft">
          <p>The app is showing the 4 built-in slides (no photos). Copy them here to edit their text and add photos, or add your own slides below.</p>
          <Button type="button" variant="secondary" loading={seeding} onClick={onSeed} className="sm:w-auto sm:self-start">
            Start from the built-in slides
          </Button>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{form.id ? "Edit slide" : "New slide"}</h2>
          {form.id && (
            <button type="button" onClick={() => setForm(emptyInput(nextOrder))} className="text-sm text-ink-soft hover:text-ink">
              Cancel edit
            </button>
          )}
        </div>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}

        <Labeled label="Photo (portrait, about 3:4 — it fills the lower part of the slide)">
          {form.image_url ? (
            <div className="flex items-center gap-3 rounded-field border border-line bg-cream p-2">
              <div className="relative h-20 w-15 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                <Image src={form.image_url} alt="" fill sizes="60px" className="object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-xs text-ink-soft" dir="ltr">
                {form.image_url}
              </span>
              <button type="button" onClick={() => set("image_url", null)} className="shrink-0 text-xs font-medium text-danger">
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={onImage}
              disabled={uploading}
              className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50"
            />
          )}
          {uploading && <span className="text-xs text-ink-faint">Uploading…</span>}
        </Labeled>

        <Labeled label="Color (top tint, second headline line, dots)">
          <div className="flex flex-wrap gap-2">
            {SLIDE_COLOR_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => set("color", key)}
                aria-pressed={form.color === key}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${form.color === key ? "border-ink" : "border-line"}`}
              >
                <span className="size-4 rounded-full" style={{ background: SLIDE_COLORS[key].base }} />
                {SLIDE_COLORS[key].label}
              </button>
            ))}
          </div>
        </Labeled>

        <Field label="Korean word chip (optional, e.g. 안녕)" value={form.badge} onChange={(e) => set("badge", e.target.value)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Headline line 1 (Persian)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <Field label="Headline line 1 (English)" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} ltr />
          <Field label="Headline line 2, in color (Persian)" value={form.title_accent} onChange={(e) => set("title_accent", e.target.value)} />
          <Field label="Headline line 2, in color (English)" value={form.title_accent_en} onChange={(e) => set("title_accent_en", e.target.value)} ltr />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Text (Persian)">
            <textarea rows={3} value={form.body} onChange={(e) => set("body", e.target.value)} dir="auto" className={textareaClass} />
          </Labeled>
          <Labeled label="Text (English)">
            <textarea rows={3} value={form.body_en} onChange={(e) => set("body_en", e.target.value)} dir="ltr" className={textareaClass} />
          </Labeled>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Order (lower shows first)"
            type="number"
            ltr
            value={String(form.sort_order)}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
          />
          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="size-4" />
            Show in the app
          </label>
        </div>

        {/* quick look at the headline in the slide's colors */}
        <div className="rounded-card p-4" style={{ background: `linear-gradient(to bottom, ${color.tint}, #fff)` }} dir="rtl">
          <p className="text-xl leading-snug font-bold text-ink">
            {form.title || "…"}
            {form.title_accent && (
              <>
                <br />
                <span style={{ color: color.accent }}>{form.title_accent}</span>
              </>
            )}
          </p>
        </div>

        <Button type="submit" loading={saving} disabled={uploading}>
          {form.id ? "Save changes" : "Add slide"}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Slides ({slides.length})</h2>
        {slides.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">No saved slides yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {slides.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-soft">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg" style={{ background: SLIDE_COLORS[s.color].tint }}>
                  {s.image_url && <Image src={s.image_url} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold" dir="auto">
                    {s.title} <span style={{ color: SLIDE_COLORS[s.color].accent }}>{s.title_accent}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    #{s.sort_order} · {s.is_active ? "Shown" : "Hidden"}
                    {!s.image_url && " · no photo"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setForm(toInput(s))} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${s.title}"?`)) return;
                      const result = await deleteOnboardingSlide(s.id);
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

const textareaClass = "rounded-field border border-line bg-surface px-4 py-3 text-[15px] leading-7 outline-none focus:border-violet/50 focus:ring-4 focus:ring-violet/12";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

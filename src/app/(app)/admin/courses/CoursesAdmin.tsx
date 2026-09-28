"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { deleteCourse, saveCourse, type AdminResult, type CourseInput } from "@/lib/courses/admin-actions";
import type { Course } from "@/lib/courses/types";
import { createUploadTicket } from "@/lib/products/admin-actions";
import { createClient } from "@/lib/supabase/client";

const EMPTY: CourseInput = {
  id: null,
  slug: "",
  product_id: null,
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  level: "",
  cover_image_url: null,
  is_available: true,
  sort_order: 0,
};

function toInput(c: Course): CourseInput {
  return {
    id: c.id,
    slug: c.slug,
    product_id: c.product_id,
    title: c.title,
    title_en: c.title_en ?? "",
    description: c.description ?? "",
    description_en: c.description_en ?? "",
    level: c.level ?? "",
    cover_image_url: c.cover_image_url,
    is_available: c.is_available,
    sort_order: c.sort_order,
  };
}

export function CoursesAdmin({ courses, products }: { courses: Course[]; products: { id: string; slug: string; title: string }[] }) {
  const [form, setForm] = useState<CourseInput>(EMPTY);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const errorText = (r: AdminResult) => (r.ok ? "" : r.error === "slug" ? "That slug is missing or already in use." : r.error === "title" ? "Please enter a title." : r.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : "Couldn't save. Please try again.");

  function set<K extends keyof CourseInput>(key: K, value: CourseInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!form.slug.trim()) return setStatus({ tone: "error", text: "Set a slug before uploading a cover." });
    setUploading(true);
    const ticket = await createUploadTicket("cover", form.slug.trim().toLowerCase(), file.name);
    if (!ticket.ok) {
      setUploading(false);
      return setStatus({ tone: "error", text: "Couldn't start the upload." });
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(false);
    if (error) return setStatus({ tone: "error", text: `Upload failed: ${error.message}` });
    const { data } = supabase.storage.from("covers").getPublicUrl(ticket.path);
    set("cover_image_url", data.publicUrl);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveCourse(form);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setStatus({ tone: "success", text: form.id ? "Course updated." : "Course created." });
    setForm(EMPTY);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{form.id ? "Edit course" : "New course"}</h2>
          {form.id && (
            <button type="button" onClick={() => setForm(EMPTY)} className="text-sm text-ink-soft hover:text-ink">
              Cancel edit
            </button>
          )}
        </div>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} ltr required />
          <Field label="Level" value={form.level} onChange={(e) => set("level", e.target.value)} ltr />
          <Field label="Title (Persian)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <Field label="Title (English)" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} ltr />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Description (Persian)">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} dir="auto" className={textareaClass} />
          </Labeled>
          <Labeled label="Description (English)">
            <textarea rows={3} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} dir="ltr" className={textareaClass} />
          </Labeled>
        </div>

        <Labeled label="Requires this product (leave empty = open to any signed-in user)">
          <select value={form.product_id ?? ""} onChange={(e) => set("product_id", e.target.value || null)} className={selectClass}>
            <option value="">— Open to everyone —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.slug})
              </option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Cover image">
          {form.cover_image_url ? (
            <div className="flex items-center gap-2 rounded-field border border-line bg-cream px-3 py-2 text-xs text-ink-soft">
              <span className="min-w-0 flex-1 truncate" dir="ltr">
                {form.cover_image_url}
              </span>
              <button type="button" onClick={() => set("cover_image_url", null)} className="shrink-0 font-medium text-danger">
                Remove
              </button>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={onCover} disabled={uploading} className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50" />
          )}
          {uploading && <span className="text-xs text-ink-faint">Uploading…</span>}
        </Labeled>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_available} onChange={(e) => set("is_available", e.target.checked)} className="size-4" />
          Available
        </label>

        <Button type="submit" loading={saving} disabled={uploading}>
          {form.id ? "Save changes" : "Create course"}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Courses ({courses.length})</h2>
        {courses.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">No courses yet. Create the first one above.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {courses.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-soft">
                <div className="min-w-0">
                  <p className="font-semibold" dir="auto">
                    {c.title} <span className="font-normal text-ink-faint">({c.slug})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {c.product_id ? "Gated by product" : "Open to everyone"}
                    {!c.is_available && " · hidden"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/courses/${c.id}`} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream">
                    Manage content →
                  </Link>
                  <button onClick={() => setForm(toInput(c))} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${c.title}" and all its units/lessons?`)) return;
                      const result = await deleteCourse(c.id);
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

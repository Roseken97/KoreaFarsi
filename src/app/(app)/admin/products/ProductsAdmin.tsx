"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import type { Category, Collection, Format, Product } from "@/lib/bookstore/types";
import { createClient } from "@/lib/supabase/client";
import { createUploadTicket, deleteProduct, saveProduct, type AdminResult, type ProductInput } from "@/lib/products/admin-actions";

const CATEGORIES: Category[] = ["course", "book", "planner", "bundle", "merch"];
const COLLECTIONS: Collection[] = ["alphabet", "four_skills", "workbook", "planner", "merch"];
const FORMATS: Format[] = ["pdf", "physical"];

const EMPTY: ProductInput = {
  id: null,
  slug: "",
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  category: "book",
  collection: "",
  level: "",
  price: 0,
  currency: "IRT",
  format: [],
  cover_image_url: null,
  digital_file_path: null,
  is_available: true,
  is_coming_soon: false,
  is_featured: false,
  sort_order: 0,
};

function toInput(p: Product): ProductInput {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    title_en: p.title_en ?? "",
    description: p.description ?? "",
    description_en: p.description_en ?? "",
    category: p.category,
    collection: p.collection ?? "",
    level: p.level ?? "",
    price: p.price,
    currency: p.currency,
    format: p.format,
    cover_image_url: p.cover_image_url,
    digital_file_path: (p as unknown as { digital_file_path: string | null }).digital_file_path ?? null,
    is_available: p.is_available,
    is_coming_soon: p.is_coming_soon,
    is_featured: p.is_featured,
    sort_order: p.sort_order,
  };
}

/** Internal admin tool — kept English-only, unlike the learner-facing UI. */
export function ProductsAdmin({ products }: { products: Product[] }) {
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "digital" | null>(null);
  const [pending, startTransition] = useTransition();

  const errorText = (r: AdminResult) => (r.ok ? "" : r.error === "slug" ? "That slug is missing or already in use." : r.error === "title" ? "Please enter a title." : r.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : "Couldn't save. Please try again.");

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleFormat(f: Format) {
    set("format", form.format.includes(f) ? form.format.filter((x) => x !== f) : [...form.format, f]);
  }

  async function upload(kind: "cover" | "digital", file: File) {
    if (!form.slug.trim()) {
      setStatus({ tone: "error", text: "Set a slug before uploading a file." });
      return;
    }
    setUploading(kind);
    setStatus(null);
    const ticket = await createUploadTicket(kind, form.slug.trim().toLowerCase(), file.name);
    if (!ticket.ok) {
      setUploading(null);
      setStatus({ tone: "error", text: "Couldn't start the upload. Please try again." });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(null);
    if (error) {
      setStatus({ tone: "error", text: `Upload failed: ${error.message}` });
      return;
    }
    if (kind === "cover") {
      const { data } = supabase.storage.from("covers").getPublicUrl(ticket.path);
      set("cover_image_url", data.publicUrl);
    } else {
      set("digital_file_path", ticket.path);
    }
    setStatus({ tone: "success", text: `${kind === "cover" ? "Cover" : "File"} uploaded.` });
  }

  function onFileInput(kind: "cover" | "digital") {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void upload(kind, file);
    };
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveProduct(form);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setStatus({ tone: "success", text: form.id ? "Product updated." : "Product created." });
    setForm(EMPTY);
  }

  function edit(p: Product) {
    setForm(toInput(p));
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function run(action: () => Promise<AdminResult>) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setStatus({ tone: "error", text: errorText(result) });
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{form.id ? "Edit product" : "New product"}</h2>
          {form.id && (
            <button type="button" onClick={() => setForm(EMPTY)} className="text-sm text-ink-soft hover:text-ink">
              Cancel edit
            </button>
          )}
        </div>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} ltr required />
          <Field label="Level (e.g. starter, 1-1)" value={form.level} onChange={(e) => set("level", e.target.value)} ltr />
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

        <div className="grid gap-4 sm:grid-cols-3">
          <Labeled label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className={selectClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Collection">
            <select value={form.collection} onChange={(e) => set("collection", e.target.value as Collection | "")} className={selectClass}>
              <option value="">—</option>
              {COLLECTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Labeled>
          <Field label="Price (Toman)" type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} ltr />
        </div>

        <Labeled label="Available formats">
          <div className="flex gap-4">
            {FORMATS.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.format.includes(f)} onChange={() => toggleFormat(f)} className="size-4" />
                {f}
              </label>
            ))}
          </div>
        </Labeled>

        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Cover image">
            <UploadRow busy={uploading === "cover"} value={form.cover_image_url} onFile={onFileInput("cover")} onClear={() => set("cover_image_url", null)} accept="image/*" />
          </Labeled>
          <Labeled label="Digital file (PDF, video, …)">
            <UploadRow busy={uploading === "digital"} value={form.digital_file_path} onFile={onFileInput("digital")} onClear={() => set("digital_file_path", null)} accept="application/pdf,video/*" />
          </Labeled>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_available} onChange={(e) => set("is_available", e.target.checked)} className="size-4" />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_coming_soon} onChange={(e) => set("is_coming_soon", e.target.checked)} className="size-4" />
            Coming soon
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="size-4" />
            Featured
          </label>
        </div>

        <Button type="submit" loading={saving} disabled={uploading !== null}>
          {form.id ? "Save changes" : "Create product"}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Catalog ({products.length})</h2>
        {products.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">No products yet. Create the first one above.</p>
        ) : (
          <ul className={`flex flex-col gap-3 ${pending ? "opacity-60" : ""}`}>
            {products.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 rounded-card bg-surface p-4 shadow-soft">
                <div className="min-w-0">
                  <p className="font-semibold" dir="auto">
                    {p.title} <span className="font-normal text-ink-faint">({p.slug})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {p.category} · {p.price.toLocaleString()} {p.currency}
                    {!p.is_available && " · hidden"}
                    {p.is_coming_soon && " · coming soon"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => edit(p)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream">
                    Edit
                  </button>
                  <button
                    onClick={() => confirm(`Delete "${p.title}" permanently?`) && run(() => deleteProduct(p.id))}
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

function UploadRow({ busy, value, onFile, onClear, accept }: { busy: boolean; value: string | null; onFile: (e: ChangeEvent<HTMLInputElement>) => void; onClear: () => void; accept: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {value ? (
        <div className="flex items-center gap-2 rounded-field border border-line bg-cream px-3 py-2 text-xs text-ink-soft">
          <span className="min-w-0 flex-1 truncate" dir="ltr">
            {value}
          </span>
          <button type="button" onClick={onClear} className="shrink-0 font-medium text-danger">
            Remove
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept={accept}
          onChange={onFile}
          disabled={busy}
          className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50"
        />
      )}
      {busy && <span className="text-xs text-ink-faint">Uploading…</span>}
    </div>
  );
}

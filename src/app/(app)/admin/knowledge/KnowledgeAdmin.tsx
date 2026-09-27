"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { KNOWLEDGE_CATEGORIES, type KnowledgeCategory, type KnowledgeSource } from "@/lib/chat-agent/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { addKnowledgeSource, deleteKnowledgeSource, setKnowledgeSourceActive, type AdminResult } from "./actions";

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function KnowledgeAdmin({ sources }: { sources: KnowledgeSource[] }) {
  const { m, locale } = useI18n();
  const t = m.admin;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("general");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();

  const errorText = (r: AdminResult) =>
    r.ok ? "" : r.error === "title" ? t.errors.title : r.error === "content" ? t.errors.content : r.error === "forbidden" ? t.forbidden : t.errors.generic;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await addKnowledgeSource({ title, category, content });
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setStatus({ tone: "success", text: t.form.added });
    setTitle("");
    setContent("");
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    if (!title) setTitle(file.name.replace(/\.(txt|md)$/i, ""));
    e.target.value = "";
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
        {status && <Notice tone={status.tone}>{status.text}</Notice>}
        <Field label={t.form.title} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="kb-category" className="text-sm font-medium">
            {t.form.category}
          </label>
          <select
            id="kb-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
            className="h-13 rounded-field border border-line bg-surface px-4 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
          >
            {KNOWLEDGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.categories[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="kb-content" className="flex justify-between text-sm font-medium">
            <span>{t.form.content}</span>
            <span className="font-normal text-ink-faint">{fmt(t.list.words, { n: formatNumber(wordCount(content), locale) })}</span>
          </label>
          <textarea
            id="kb-content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            dir="auto"
            className="rounded-field border border-line bg-surface px-4 py-3 text-[15px] leading-7 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
          />
        </div>
        <label className="text-sm text-ink-soft">
          {t.form.upload}
          <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={onFile} className="mt-1.5 block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink" />
        </label>
        <Button type="submit" loading={saving}>
          {t.form.submit}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">{t.list.title}</h2>
        {sources.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.list.empty}</p>
        ) : (
          <ul className={`flex flex-col gap-3 ${pending ? "opacity-60" : ""}`}>
            {sources.map((s) => (
              <li key={s.id} className="rounded-card bg-surface p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold" dir="auto">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {t.categories[s.category]} · {fmt(t.list.words, { n: formatNumber(wordCount(s.content), locale) })} ·{" "}
                      <span className={s.is_active ? "text-success" : "text-ink-faint"}>{s.is_active ? t.list.active : t.list.inactive}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => run(() => setKnowledgeSourceActive(s.id, !s.is_active))}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-cream"
                    >
                      {s.is_active ? t.list.deactivate : t.list.activate}
                    </button>
                    <button
                      onClick={() => confirm(t.list.confirmDelete) && run(() => deleteKnowledgeSource(s.id))}
                      aria-label={t.list.delete}
                      className="grid size-8 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 whitespace-pre-line text-ink-soft" dir="auto">
                  {s.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

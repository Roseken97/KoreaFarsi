"use client";

import { useMemo, useState } from "react";
import { Notice } from "@/components/ui/Notice";
import type { Locale } from "@/lib/i18n/config";
import { resetCopy, saveCopy, type CopyResult } from "@/lib/site-copy/admin-actions";
import type { CopyEntry, CopyOverrides } from "@/lib/site-copy/entries";

const PAGE_SIZE = 40;

type Overrides = Record<Locale, CopyOverrides>;

/** Edits every string of one app area (English + Persian). Used by /account/app-admin/[area]. */
export function CopyEditor({ entries, initialOverrides }: { entries: CopyEntry[]; initialOverrides: Overrides }) {
  const [overrides, setOverrides] = useState<Overrides>(initialOverrides);
  const [editedOnly, setEditedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const isEdited = (key: string) => key in overrides.en || key in overrides.fa;
  const editedCount = entries.filter((e) => isEdited(e.key)).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (editedOnly && !(e.key in overrides.en || e.key in overrides.fa)) return false;
      if (!q) return true;
      return [e.key, e.en, e.fa, overrides.en[e.key], overrides.fa[e.key]].some((t) => t?.toLowerCase().includes(q));
    });
  }, [entries, overrides, editedOnly, query]);

  function onSaved(key: string, locale: Locale, value: string | null) {
    setOverrides((o) => {
      const next = { ...o[locale] };
      if (value === null) delete next[key];
      else next[key] = value;
      return { ...o, [locale]: next };
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-soft sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          placeholder="Search text in English or Persian…"
          dir="auto"
          className={`${inputClass} flex-1`}
        />
        <label className="flex shrink-0 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={editedOnly}
            onChange={(e) => {
              setEditedOnly(e.target.checked);
              setLimit(PAGE_SIZE);
            }}
            className="size-4"
          />
          Edited only ({editedCount})
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">
          {editedOnly && !query ? "Nothing here has been edited yet." : "No text matches your search."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.slice(0, limit).map((e) => (
            <li key={e.key} className="rounded-card bg-surface p-4 shadow-soft">
              <p className="mb-3 text-xs text-ink-faint" dir="ltr">
                <code>{e.key}</code>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <CopyField entry={e} locale="en" override={overrides.en[e.key]} onSaved={onSaved} />
                <CopyField entry={e} locale="fa" override={overrides.fa[e.key]} onSaved={onSaved} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > limit && (
        <button onClick={() => setLimit((l) => l + PAGE_SIZE)} className="self-center rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium hover:bg-cream">
          Show more ({filtered.length - limit} left)
        </button>
      )}
    </div>
  );
}

function errorText(r: CopyResult) {
  if (r.ok) return "";
  switch (r.error) {
    case "forbidden":
      return "Only KoreaFarsi admins can edit content.";
    case "empty":
      return "Text can't be empty. Use Reset to bring back the original.";
    case "placeholder":
      return `${r.detail} isn't filled in by the app here, so it would show up as-is. Use only the {…} words from the original.`;
    case "key":
      return "This text no longer exists in the app.";
    default:
      return "Couldn't save. Please try again.";
  }
}

function CopyField({
  entry,
  locale,
  override,
  onSaved,
}: {
  entry: CopyEntry;
  locale: Locale;
  override: string | undefined;
  onSaved: (key: string, locale: Locale, value: string | null) => void;
}) {
  const fallback = entry[locale];
  const current = override ?? fallback;
  const [draft, setDraft] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = draft !== current;
  const isFa = locale === "fa";

  async function save() {
    setBusy(true);
    setError(null);
    const result = await saveCopy(entry.key, locale, draft);
    setBusy(false);
    if (!result.ok) return setError(errorText(result));
    const text = draft.trim();
    setDraft(text);
    onSaved(entry.key, locale, text === fallback ? null : text);
  }

  async function reset() {
    setBusy(true);
    setError(null);
    const result = await resetCopy(entry.key, locale);
    setBusy(false);
    if (!result.ok) return setError(errorText(result));
    setDraft(fallback);
    onSaved(entry.key, locale, null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-sm font-medium">
        {isFa ? "Persian" : "English"}
        {override !== undefined && <span className="rounded-full bg-blush-soft px-2 py-0.5 text-[11px] font-semibold text-blush">Edited</span>}
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={Math.min(6, Math.max(1, Math.ceil(draft.length / 48)))}
        dir={isFa ? "rtl" : "ltr"}
        className={`${inputClass} resize-y py-2.5 leading-7`}
      />
      {override !== undefined && (
        <p className="text-xs text-ink-faint" dir={isFa ? "rtl" : "ltr"}>
          Original: {fallback}
        </p>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {(dirty || override !== undefined) && (
        <div className="flex gap-2">
          {dirty && (
            <button onClick={save} disabled={busy} className="rounded-full bg-violet px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-deep disabled:opacity-55">
              {busy ? "Saving…" : "Save"}
            </button>
          )}
          {dirty && (
            <button onClick={() => setDraft(current)} disabled={busy} className="rounded-full border border-line px-4 py-1.5 text-xs font-medium hover:bg-cream disabled:opacity-55">
              Cancel
            </button>
          )}
          {!dirty && override !== undefined && (
            <button onClick={reset} disabled={busy} className="rounded-full border border-line px-4 py-1.5 text-xs font-medium hover:bg-cream disabled:opacity-55">
              {busy ? "Resetting…" : "Reset to original"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const inputClass = "rounded-field border border-line bg-surface px-4 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15 h-auto min-h-11";

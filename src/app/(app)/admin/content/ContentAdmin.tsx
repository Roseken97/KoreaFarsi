"use client";

import { useMemo, useState } from "react";
import { Notice } from "@/components/ui/Notice";
import type { Locale } from "@/lib/i18n/config";
import { resetCopy, saveCopy, type CopyResult } from "@/lib/site-copy/admin-actions";
import type { CopyEntry, CopyOverrides } from "@/lib/site-copy/entries";

/** Friendly names for the top-level message sections (falls back to the raw key). */
const SECTION_LABELS: Record<string, string> = {
  common: "Shared",
  splash: "Splash screen",
  marketing: "Landing page",
  onboarding: "Onboarding",
  welcome: "Welcome",
  auth: "Sign in / sign up",
  errors: "Error messages",
  nav: "Navigation",
  koreaLife: "Korea Life",
  notifications: "Notifications",
  placeholders: "Coming-soon pages",
  home: "Home",
  account: "Account",
  bookstore: "Bookstore",
  aiPractice: "AI Practice",
  chat: "AI chat",
  admin: "Admin: knowledge base",
  dictionaryPage: "Dictionary",
  productsAdmin: "Admin: products",
  orders: "Orders",
  coursesAdmin: "Admin: courses",
  courses: "Courses",
  library: "Library",
  planner: "Planner",
  language: "Language",
  notFound: "Page not found",
};

const PAGE_SIZE = 40;
const EDITED = "__edited";

type Overrides = Record<Locale, CopyOverrides>;

export function ContentAdmin({ entries, initialOverrides }: { entries: CopyEntry[]; initialOverrides: Overrides }) {
  const [overrides, setOverrides] = useState<Overrides>(initialOverrides);
  const [section, setSection] = useState<string>("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const sections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(e.section, (counts.get(e.section) ?? 0) + 1);
    return [...counts];
  }, [entries]);

  const editedCount = new Set([...Object.keys(overrides.en), ...Object.keys(overrides.fa)]).size;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (section === EDITED ? !(e.key in overrides.en || e.key in overrides.fa) : section && e.section !== section) return false;
      if (!q) return true;
      return [e.key, e.en, e.fa, overrides.en[e.key], overrides.fa[e.key]].some((t) => t?.toLowerCase().includes(q));
    });
  }, [entries, overrides, section, query]);

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
      <div className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-soft sm:flex-row">
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
        <select
          value={section}
          onChange={(e) => {
            setSection(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          className={`${inputClass} sm:w-60`}
        >
          <option value="">All sections ({entries.length})</option>
          <option value={EDITED}>Edited only ({editedCount})</option>
          {sections.map(([key, n]) => (
            <option key={key} value={key}>
              {SECTION_LABELS[key] ?? key} ({n})
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">
          {section === EDITED ? "Nothing has been edited yet." : "No text matches your search."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.slice(0, limit).map((e) => (
            <li key={e.key} className="rounded-card bg-surface p-4 shadow-soft">
              <p className="mb-3 text-xs text-ink-faint" dir="ltr">
                <span className="font-medium text-ink-soft">{SECTION_LABELS[e.section] ?? e.section}</span> · <code>{e.key}</code>
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

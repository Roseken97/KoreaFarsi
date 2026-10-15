"use client";

import { useEffect, useState } from "react";
import { CheckIcon, DownloadIcon, TrashIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";
import { isOfflineSaveSupported, listOfflineSaved, removeFromOffline, saveForOffline } from "@/lib/offline/sw";

type State = "idle" | "saving" | "saved" | "failed";

/** Saves a lesson's pages, video and files on this device so it opens without a connection. */
export function SaveOfflineButton({ id, pages }: { id: string; pages: string[] }) {
  const { m } = useI18n();
  const t = m.offline;
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isOfflineSaveSupported()) {
        if (!cancelled) setSupported(false);
        return;
      }
      const ids = await listOfflineSaved();
      if (!cancelled && ids.includes(id)) setState("saved");
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function save() {
    setState("saving");
    const result = await saveForOffline(id, pages);
    setState(result.ok ? "saved" : "failed");
    if (result.error === "unsupported") setSupported(false);
  }

  async function remove() {
    const result = await removeFromOffline(id);
    if (result.ok) setState("idle");
  }

  if (!supported) return <p className="text-xs text-ink-faint">{t.unsupported}</p>;

  return (
    <div className="flex flex-col gap-1.5">
      {state === "saved" ? (
        <div className="flex items-center justify-between gap-3 rounded-field bg-sage-soft px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-teal-deep">
            <CheckIcon width={16} height={16} />
            {t.saved}
          </span>
          <button onClick={remove} className="flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-danger">
            <TrashIcon width={14} height={14} />
            {t.remove}
          </button>
        </div>
      ) : (
        <button
          onClick={save}
          disabled={state === "saving"}
          aria-busy={state === "saving" || undefined}
          className="flex h-11 items-center justify-center gap-2 rounded-field border border-line bg-surface text-sm font-semibold text-ink shadow-soft transition hover:border-teal disabled:opacity-60"
        >
          <DownloadIcon width={16} height={16} />
          {state === "saving" ? t.saving : t.save}
        </button>
      )}
      <p className={`text-xs ${state === "failed" ? "text-danger" : "text-ink-faint"}`} dir="auto">
        {state === "failed" ? t.failed : t.hint}
      </p>
    </div>
  );
}

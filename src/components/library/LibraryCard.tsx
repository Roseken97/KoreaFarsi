"use client";

import { useState } from "react";
import { ProductCover } from "@/components/bookstore/ProductCover";
import { DownloadIcon } from "@/components/icons";
import { MotionSurface } from "@/components/motion/MotionCard";
import { getLibraryDownloadUrl } from "@/lib/library/actions";
import type { LibraryEntry } from "@/lib/library/types";
import { titles } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";

export function LibraryCard({ entry }: { entry: LibraryEntry }) {
  const { m, locale } = useI18n();
  const t = m.library;
  const { primary, secondary } = titles(entry.product, locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setError("");
    setLoading(true);
    const result = await getLibraryDownloadUrl(entry.product.id).catch(
      () => ({ ok: false, error: "generic" }) as const,
    );
    setLoading(false);
    if (!result.ok) return setError(t.errors[result.error === "unauthenticated" ? "generic" : result.error]);
    // Signed URL is single-use-ish and short-lived; open immediately rather than storing it.
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <MotionSurface hover={false} className="flex gap-4 rounded-[20px] border border-line/60 bg-surface p-3 shadow-soft">
      <div className="w-20 shrink-0 sm:w-24">
        <ProductCover product={entry.product} sizes="96px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 font-display text-base leading-snug font-semibold">{primary}</h3>
        {secondary && (
          <p className="line-clamp-1 text-[12px] text-ink-faint">
            <bdi>{secondary}</bdi>
          </p>
        )}
        <p className="mt-1 text-[12px] text-ink-faint">
          {t.grantedOn.replace("{date}", new Date(entry.granted_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US"))}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3">
          <button
            onClick={download}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-deep disabled:opacity-50"
          >
            <DownloadIcon width={16} height={16} />
            {loading ? t.preparing : t.download}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </div>
    </MotionSurface>
  );
}

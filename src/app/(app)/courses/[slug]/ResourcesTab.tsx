"use client";

import { useState } from "react";
import { DownloadIcon } from "@/components/icons";
import { getCourseResourceUrl } from "@/lib/courses/actions";
import type { CourseResource } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

export function ResourcesTab({ resources, locale }: { resources: CourseResource[]; locale: Locale }) {
  const { m } = useI18n();
  const t = m.courses.detail.resources;

  if (resources.length === 0) {
    return <p className="mt-5 rounded-card bg-surface p-5 text-center text-sm text-ink-soft shadow-soft">{t.empty}</p>;
  }

  return (
    <ul className="mt-5 flex flex-col gap-2">
      {resources.map((r) => (
        <ResourceRow key={r.id} resource={r} locale={locale} downloadLabel={t.download} preparingLabel={t.preparing} />
      ))}
    </ul>
  );
}

function ResourceRow({ resource, locale, downloadLabel, preparingLabel }: { resource: CourseResource; locale: Locale; downloadLabel: string; preparingLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const title = locale === "en" ? resource.title_en || resource.title : resource.title;

  async function download() {
    setError(false);
    setLoading(true);
    const result = await getCourseResourceUrl(resource.id).catch(() => ({ ok: false as const, error: "generic" as const }));
    setLoading(false);
    if (!result.ok) return setError(true);
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-field border border-line bg-surface p-3.5">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink" dir="auto">
        {title}
      </span>
      <button
        onClick={download}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-cream transition hover:bg-ink/85 disabled:opacity-50"
      >
        <DownloadIcon width={14} height={14} />
        {loading ? preparingLabel : downloadLabel}
      </button>
      {error && <span className="text-xs text-danger">!</span>}
    </li>
  );
}

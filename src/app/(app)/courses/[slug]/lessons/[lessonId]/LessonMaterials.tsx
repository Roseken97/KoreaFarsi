"use client";

import { useState } from "react";
import { DictionaryIcon, DownloadIcon, HeadphonesIcon } from "@/components/icons";
import { getLessonMaterialUrl } from "@/lib/courses/actions";
import type { LessonMaterial } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac", ".ogg"];

export function LessonMaterials({ lessonId, materials, locale }: { lessonId: string; materials: LessonMaterial[]; locale: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {materials.map((mat, i) => (
        <MaterialCard key={i} lessonId={lessonId} material={mat} locale={locale} />
      ))}
    </div>
  );
}

function MaterialCard({ lessonId, material, locale }: { lessonId: string; material: LessonMaterial; locale: Locale }) {
  const { m } = useI18n();
  const t = m.courses.lesson.overview.materials;
  const [loading, setLoading] = useState(false);
  const isAudio = AUDIO_EXTENSIONS.some((ext) => material.file_path.toLowerCase().endsWith(ext));
  const Icon = isAudio ? HeadphonesIcon : DictionaryIcon;
  const title = locale === "en" ? material.title_en || material.title : material.title;

  async function download() {
    setLoading(true);
    const result = await getLessonMaterialUrl(lessonId, material.file_path).catch(() => ({ ok: false as const, error: "generic" as const }));
    setLoading(false);
    if (result.ok) window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <button onClick={download} disabled={loading} className="flex items-start gap-2.5 rounded-[16px] border border-line bg-surface p-3 text-start transition hover:bg-cream disabled:opacity-60">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sage-soft text-teal-deep">
        <Icon width={16} height={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-ink" dir="auto">
          {title}
        </span>
        <span className="block text-[11px] text-ink-faint">{isAudio ? t.listenOffline : t.downloadKeep}</span>
      </span>
      <DownloadIcon width={14} height={14} className="mt-1 shrink-0 text-ink-faint" />
    </button>
  );
}

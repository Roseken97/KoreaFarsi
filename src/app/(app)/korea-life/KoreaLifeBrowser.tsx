"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronIcon, LanternIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import type { KoreaLifeCategory, KoreaLifePost } from "@/lib/korealife/types";
import { useI18n } from "@/lib/i18n/client";

const CATEGORIES: KoreaLifeCategory[] = ["culture", "travel", "food", "life"];

export function KoreaLifeBrowser({ posts }: { posts: KoreaLifePost[] }) {
  const { m, locale } = useI18n();
  const t = m.koreaLife;
  const [active, setActive] = useState<KoreaLifeCategory | null>(null);
  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <div>
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-cream-deep p-1">
        <Tab label={t.allCategories} selected={active === null} onClick={() => setActive(null)} />
        {CATEGORIES.map((c) => (
          <Tab key={c} label={t.categories[c]} selected={active === c} onClick={() => setActive(c)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((p) => {
            const title = locale === "en" ? p.title_en || p.title : p.title;
            const excerpt = locale === "en" ? p.excerpt_en || p.excerpt : p.excerpt;
            return (
              <li key={p.id}>
                <MotionCard href={`/korea-life/${p.slug}`} tilt={false} className="flex items-center gap-4 rounded-[20px] border border-line/60 bg-surface p-3.5 shadow-soft">
                  {p.cover_image_url ? (
                    <div className="relative size-[80px] shrink-0 overflow-hidden rounded-2xl bg-cream-deep">
                      <Image src={p.cover_image_url} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="grid size-[80px] shrink-0 place-items-center rounded-2xl bg-blush-soft text-blush">
                      <LanternIcon width={28} height={28} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold tracking-wide text-teal-deep uppercase">{t.categories[p.category]}</span>
                    <p className="truncate font-display text-base font-semibold text-ink" dir="auto">
                      {title}
                    </p>
                    {excerpt && (
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-ink-soft" dir="auto">
                        {excerpt}
                      </p>
                    )}
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream-deep text-ink-faint">
                    <ChevronIcon width={16} height={16} className="rtl:-scale-x-100" />
                  </span>
                </MotionCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Tab({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${selected ? "bg-surface text-ink shadow-soft" : "text-ink-soft"}`}
    >
      {label}
    </button>
  );
}

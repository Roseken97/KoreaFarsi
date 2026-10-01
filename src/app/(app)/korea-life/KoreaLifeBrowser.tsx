"use client";

import Image from "next/image";
import { useState, type ComponentType, type SVGProps } from "react";
import { BowlIcon, ChevronIcon, GlobeIcon, LanternIcon, SparkleIcon } from "@/components/icons";
import { MotionCard, MotionSurface } from "@/components/motion/MotionCard";
import type { KoreaLifeCategory, KoreaLifePost } from "@/lib/korealife/types";
import { useI18n } from "@/lib/i18n/client";
import { MESH, MESH_SHADOW, type MeshColor } from "@/lib/ui/mesh";

const CATEGORIES: KoreaLifeCategory[] = ["culture", "travel", "food", "life"];

const CATEGORY_STYLE: Record<KoreaLifeCategory, { bg: string; mesh?: MeshColor; text: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  culture: { bg: "bg-sage", text: "text-ink", Icon: LanternIcon },
  travel: { bg: "bg-blush", text: "text-white", Icon: GlobeIcon },
  food: { bg: "bg-coral", mesh: "coral", text: "text-white", Icon: BowlIcon },
  life: { bg: "bg-cream-deep", text: "text-ink", Icon: SparkleIcon },
};

export function KoreaLifeBrowser({ posts }: { posts: KoreaLifePost[] }) {
  const { m, locale } = useI18n();
  const t = m.koreaLife;
  const [active, setActive] = useState<KoreaLifeCategory | null>(null);
  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <div>
      {/* Sections as cards (Home-style color tiles) instead of a tab strip */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => {
          const { bg, mesh, text, Icon } = CATEGORY_STYLE[c];
          const selected = active === c;
          const count = posts.filter((p) => p.category === c).length;
          return (
            <MotionSurface
              key={c}
              onClick={() => setActive(selected ? null : c)}
              hover={false}
              style={mesh ? { backgroundImage: MESH[mesh] } : undefined}
              className={`group @container relative flex aspect-[3/2] cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] p-3.5 transition ${mesh ? `card-grain ${MESH_SHADOW[mesh]}` : `${bg} shadow-soft`} ${selected ? "ring-2 ring-teal ring-offset-2 ring-offset-cream" : ""}`}
            >
              <span className="absolute -end-3 -top-3 size-16 rounded-full bg-white/10" aria-hidden="true" />
              <span className={`relative grid size-8 place-items-center rounded-full bg-white/20 ${text}`}>
                <Icon width={16} height={16} />
              </span>
              <span className="relative">
                <span className={`block font-display text-[15px] font-semibold ${text}`}>{t.categories[c]}</span>
                <span className={`mt-0.5 block text-[11px] ${text} opacity-75`}>{count}</span>
              </span>
            </MotionSurface>
          );
        })}
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

"use client";

import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { motion } from "motion/react";
import { ArrowForwardIcon, SparkleIcon, WatchIcon } from "@/components/icons";
import { MascotPlaceholder } from "./MascotPlaceholder";

export type HubCardData = {
  key: string;
  label: string;
  /** Korean name of the mode, shown as the faded sub-title and on the bottom pill. */
  korean: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  live: boolean;
  /** Inner-card backdrop (soft pastel studio light) and optional warm "floor" the mascot stands on. */
  backdrop: string;
  floor?: string;
  /** Real character art; falls back to the mascot placeholder. */
  image?: string;
};

export type HubCardLabels = { start: string; soon: string; live: string; of: string; mode: string; status: string };

// Fixed bokeh spots, like the out-of-focus snow in the reference render.
const BOKEH = [
  { top: "18%", left: "14%", size: 10, o: 0.7 },
  { top: "30%", left: "78%", size: 6, o: 0.8 },
  { top: "46%", left: "8%", size: 14, o: 0.35 },
  { top: "12%", left: "56%", size: 5, o: 0.9 },
  { top: "58%", left: "86%", size: 9, o: 0.5 },
  { top: "38%", left: "30%", size: 4, o: 0.9 },
];

/** Round glass stat chip with a progress ring, like the "12 days / 21 hours" chips in the reference. */
function RingChip({ value, label, progress }: { value: ReactNode; label: string; progress: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-12 place-items-center rounded-full bg-white/30 backdrop-blur-md">
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="2.5" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${c * progress} ${c}`}
        />
      </svg>
      <span className="relative flex flex-col items-center leading-none text-ink">
        <span className="text-[13px] font-bold">{value}</span>
        <span className="mt-0.5 text-[8px] font-medium text-ink/60">{label}</span>
      </span>
    </span>
  );
}

/**
 * One AI Hub mode as a soft 3D mobile card: dark rounded frame with the title on top,
 * a tall pastel image card with the character filling it, ring chips and glass buttons
 * on top, frosted pills and a white round action button at the bottom.
 */
export function HubCard({
  card,
  position,
  total,
  labels,
  formatNumber,
  active,
}: {
  card: HubCardData;
  position: number;
  total: number;
  labels: HubCardLabels;
  formatNumber: (n: number) => string;
  active: boolean;
}) {
  const { Icon } = card;

  return (
    <Link
      href={card.href}
      draggable={false}
      aria-label={`${card.label} — ${card.live ? labels.start : labels.soon}`}
      className="group relative flex h-full flex-col rounded-[44px] bg-[#2b2834] p-2.5 shadow-[0_30px_60px_-24px_rgb(43_40_52/0.55)] outline-none focus-visible:ring-4 focus-visible:ring-white/70"
    >
      {/* frame header */}
      <div className="flex flex-col items-center px-4 pt-3 pb-3 text-center">
        <h2 className="text-[22px] font-bold leading-tight text-white">{card.label}</h2>
        <p lang="ko" className="mt-0.5 text-[20px] font-bold leading-none text-white/20">
          {card.korean}
        </p>
      </div>

      {/* image card */}
      <div className={`relative min-h-0 flex-1 overflow-hidden rounded-[34px] ${card.backdrop}`}>
        {card.floor && <div className={`absolute inset-x-0 bottom-0 h-[34%] rounded-t-[50%_30%] ${card.floor}`} />}
        {BOKEH.map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white blur-[1.5px]"
            style={{ top: b.top, left: b.left, width: b.size, height: b.size, opacity: b.o }}
          />
        ))}

        {/* character */}
        <motion.div
          className="absolute inset-x-0 top-[16%] bottom-[18%] flex items-center justify-center"
          animate={active ? { y: [0, -10, 0] } : { y: 0 }}
          transition={{ duration: 4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        >
          {card.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.image} alt="" className="h-full w-full object-contain drop-shadow-[0_20px_24px_rgb(43_40_52/0.25)]" />
          ) : (
            <MascotPlaceholder wave={position % 2 === 0} className="h-full w-auto drop-shadow-[0_20px_24px_rgb(43_40_52/0.2)]" />
          )}
        </motion.div>

        {/* top row: ring chips (start) + glass buttons (end) */}
        <div className="absolute inset-x-3.5 top-3.5 flex items-start justify-between">
          <div className="flex gap-1.5">
            <RingChip value={formatNumber(position)} label={`${labels.of} ${formatNumber(total)}`} progress={position / total} />
            <RingChip
              value={card.live ? <SparkleIcon width={14} height={14} /> : <WatchIcon width={14} height={14} />}
              label={card.live ? labels.live : labels.soon}
              progress={card.live ? 1 : 0.25}
            />
          </div>
          <div className="flex flex-col gap-2" aria-hidden="true">
            <span className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_6px_14px_-6px_rgb(43_40_52/0.4)]">
              <Icon width={20} height={20} />
            </span>
            <span className="grid size-11 place-items-center rounded-full bg-[#4a4657]/55 text-white backdrop-blur-md">
              <ArrowForwardIcon width={16} height={16} className="-rotate-45 rtl:rotate-45" />
            </span>
          </div>
        </div>

        {/* bottom row: frosted pills + white round action */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
          <span className="flex h-12 items-center gap-2 rounded-full bg-white/35 ps-1.5 pe-3.5 text-ink backdrop-blur-xl">
            <span className="grid size-9 place-items-center rounded-full bg-white/60">
              <Icon width={16} height={16} />
            </span>
            <span lang="ko" className="text-[13px] font-bold">
              {card.korean}
            </span>
          </span>
          <span className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-[#4a4657]/45 px-3 text-[13px] font-bold text-white backdrop-blur-xl">
            <span className="truncate">{card.live ? labels.start : labels.soon}</span>
          </span>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_8px_18px_-8px_rgb(43_40_52/0.5)] transition-transform group-hover:scale-105">
            <ArrowForwardIcon width={20} height={20} />
          </span>
        </div>
      </div>
      {/* dims the cards beside the centered one (an overlay, not opacity, so the glass blur stays clean) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[44px] bg-[#d5cbdf] transition-opacity duration-300 ${active ? "opacity-0" : "opacity-45"}`}
      />
    </Link>
  );
}

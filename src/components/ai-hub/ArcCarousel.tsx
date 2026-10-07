"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { motion, type PanInfo, AnimatePresence } from "motion/react";
import { ArrowForwardIcon, ChevronIcon, SparkleIcon, WatchIcon } from "@/components/icons";

export type ArcCard = {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  bg: string;
  text: string;
  href: string;
  /** Korean name of the mode, shown on the bottom pill. */
  korean: string;
  /** Whether the mode is usable yet (only Chat today). */
  live: boolean;
  /** Illustration for the image area; the mode's icon stands in without one. */
  Illustration?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type ArcCardLabels = { start: string; soon: string; live: string; of: string };

/** Round glass chip with a progress ring, like the stat chips on the reference cards. */
function RingChip({ value, label, progress }: { value: ReactNode; label: string; progress: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-12 place-items-center rounded-full bg-white/10 backdrop-blur-md">
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2.5" />
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
      <span className="relative flex flex-col items-center leading-none text-white">
        <span className="text-[13px] font-bold">{value}</span>
        <span className="mt-0.5 text-[10px] font-medium text-white/90">{label}</span>
      </span>
    </span>
  );
}

/**
 * Card silhouette from the reference: large rounded corners with a soft dip carved
 * into the top edge. Drawn in a 90x130 box, the same 9/13 ratio as the card, so the
 * curves stay true when the mask is stretched to the card's size.
 */
const CARD_SHAPE =
  "M10 0H27C33 0 33.5 7 40 7H50C56.5 7 57 0 63 0H80A10 10 0 0 1 90 10V120A10 10 0 0 1 80 130H10A10 10 0 0 1 0 120V10A10 10 0 0 1 10 0Z";
const CARD_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 130' preserveAspectRatio='none'><path d='${CARD_SHAPE}'/></svg>`,
)}") center / 100% 100% no-repeat`;

/**
 * Large premium carousel matching contemporary Korean aesthetic.
 * 3D-style cards with large character illustrations, infinite loop.
 */
export function ArcCarousel({
  cards,
  labels,
  formatNumber,
}: {
  cards: ArcCard[];
  labels: ArcCardLabels;
  formatNumber: (n: number) => string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  function navigate(delta: number) {
    setDirection(delta);
    setIndex((prev) => {
      const next = prev + delta;
      return next < 0 ? cards.length - 1 : next % cards.length;
    });
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipeThreshold = 50;
    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    if (velocity > 500 || offset > swipeThreshold) {
      if (info.offset.x < -swipeThreshold) navigate(1);
      else if (info.offset.x > swipeThreshold) navigate(-1);
    }
  }

  const card = cards[index];

  const bgColorMap: Record<string, { circle: string; accent: string }> = {
    "bg-gradient-to-br from-[#a07ccc] to-[#6a479e]": { circle: "bg-white/10", accent: "border-purple-400/30" },
    "bg-gradient-to-br from-[#7690ea] to-[#3a4a93]": { circle: "bg-white/10", accent: "border-violet-400/30" },
    "bg-gradient-to-br from-[#e98a8f] to-[#a2434d]": { circle: "bg-white/10", accent: "border-purple-400/30" },
    "bg-gradient-to-br from-[#4fb89b] to-[#1f6e5c]": { circle: "bg-white/10", accent: "border-indigo-400/30" },
    "bg-gradient-to-br from-[#d99a4f] to-[#8a5612]": { circle: "bg-white/10", accent: "border-purple-400/30" },
  };

  const colors = bgColorMap[card.bg] || { circle: "bg-white/10", accent: "border-purple-400/30" };

  return (
    <div className="relative w-full">
      {/* Carousel container */}
      <div className="relative w-full mx-auto overflow-hidden">
        {/* Card */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={card.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              onDragEnd(e, info);
              setIsDragging(false);
            }}
            className="w-full px-4 cursor-grab active:cursor-grabbing"
          >
            <motion.button
              type="button"
              onClick={() => !isDragging && router.push(card.href)}
              className="relative mx-auto block w-full max-w-[340px] aspect-[9/13]"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* soft floor shadow (box-shadow can't follow the masked shape) */}
              <div className="absolute inset-x-8 -bottom-4 h-16 rounded-full bg-black/50 blur-2xl" />
              <div className={`absolute inset-0 ${card.bg}`} style={{ mask: CARD_MASK, WebkitMask: CARD_MASK }}>
                {/* Overlay effects */}
                <div className="absolute inset-0">
                  {/* Subtle shine */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_70%)]" />
                </div>

                {/* Content container: title under the notch, then the image card holding chips, character and buttons */}
                <div className="relative z-10 flex h-full flex-col px-3 pt-[9%] pb-3">
                  <h2 className={`text-center text-3xl font-display font-bold tracking-tight ${card.text}`}>{card.label}</h2>

                  {/* Image card */}
                  <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[30px] border border-white/10 bg-white/10">
                    {/* Glow effect */}
                    <div className={`absolute inset-10 rounded-full ${colors.circle} blur-2xl opacity-70`} />

                    {/* Mode illustration (the mode's icon without one) */}
                    <motion.div
                      animate={{ y: isDragging ? 0 : [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-x-4 top-[20%] bottom-[22%] z-10 flex items-center justify-center"
                    >
                      {card.Illustration ? (
                        <card.Illustration className="h-full w-full drop-shadow-[0_16px_24px_rgba(0,0,0,0.3)]" />
                      ) : (
                        <card.Icon
                          width={140}
                          height={140}
                          className={`${card.text} drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}
                        />
                      )}
                    </motion.div>

                    {/* Top row: progress chips (start side) and glass buttons (end side) */}
                    <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between">
                      <div className="flex gap-1.5">
                        <RingChip
                          value={formatNumber(index + 1)}
                          label={`${labels.of} ${formatNumber(cards.length)}`}
                          progress={(index + 1) / cards.length}
                        />
                        <RingChip
                          value={card.live ? <SparkleIcon width={14} height={14} /> : <WatchIcon width={14} height={14} />}
                          label={card.live ? labels.live : labels.soon}
                          progress={card.live ? 1 : 0.25}
                        />
                      </div>
                      <div className="flex flex-col gap-2" aria-hidden="true">
                        <span className="grid size-11 place-items-center rounded-full bg-white text-purple-800 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.5)]">
                          <card.Icon width={20} height={20} />
                        </span>
                        <span className="grid size-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur-md">
                          <ArrowForwardIcon width={16} height={16} className="-rotate-45 rtl:rotate-45" />
                        </span>
                      </div>
                    </div>

                    {/* Bottom row: frosted pills and the white round action button */}
                    <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-center gap-2">
                      <span className="flex h-12 items-center gap-2 rounded-full bg-white/15 ps-1.5 pe-3.5 text-white backdrop-blur-xl">
                        <span className="grid size-9 place-items-center rounded-full bg-white/20">
                          <card.Icon width={16} height={16} />
                        </span>
                        <span lang="ko" className="text-[13px] font-bold">
                          {card.korean}
                        </span>
                      </span>
                      <span className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-black/25 px-3 text-[13px] font-bold text-white backdrop-blur-xl">
                        <span className="truncate">{card.live ? labels.start : labels.soon}</span>
                      </span>
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-purple-800 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)]">
                        <ArrowForwardIcon width={20} height={20} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* hairline edge following the shape (a border can't follow a mask) */}
              <svg viewBox="0 0 90 130" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                <path d={CARD_SHAPE} fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation indicators */}
      <div className="flex justify-center items-center gap-4 mt-12">
        {/* Previous button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full border border-purple-400/30 hover:border-purple-300/60 hover:bg-white/5 transition-all"
          aria-label="Previous slide"
        >
          {/* ChevronIcon points toward the end edge; flipped, it points to the start edge where this button sits */}
          <ChevronIcon width={20} height={20} className="rotate-180 text-purple-200" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-3">
          {cards.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              animate={{
                width: i === index ? 28 : 8,
                opacity: i === index ? 1 : 0.3,
              }}
              className={`h-2 rounded-full transition-colors ${
                i === index ? "bg-gradient-to-r from-purple-300 to-violet-300" : "bg-purple-400/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => navigate(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full border border-purple-400/30 hover:border-purple-300/60 hover:bg-white/5 transition-all"
          aria-label="Next slide"
        >
          <ChevronIcon width={20} height={20} className="text-purple-200" />
        </motion.button>
      </div>

      {/* Slide counter */}
      <div dir="ltr" className="text-center mt-8 text-xs text-purple-200 font-medium tracking-widest">
        {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
      </div>
    </div>
  );
}

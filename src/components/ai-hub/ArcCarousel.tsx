"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import { motion, type PanInfo, AnimatePresence } from "motion/react";
import { ChevronIcon } from "@/components/icons";

export type ArcCard = {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  bg: string;
  text: string;
  href: string;
};

/**
 * Card silhouette from the reference: large rounded corners with a soft dip carved
 * into the top edge. Drawn in a 90x110 box, the same 9/11 ratio as the card, so the
 * curves stay true when the mask is stretched to the card's size.
 */
const CARD_SHAPE =
  "M10 0H27C33 0 33.5 7 40 7H50C56.5 7 57 0 63 0H80A10 10 0 0 1 90 10V100A10 10 0 0 1 80 110H10A10 10 0 0 1 0 100V10A10 10 0 0 1 10 0Z";
const CARD_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 110' preserveAspectRatio='none'><path d='${CARD_SHAPE}'/></svg>`,
)}") center / 100% 100% no-repeat`;

/**
 * Large premium carousel matching contemporary Korean aesthetic.
 * 3D-style cards with large character illustrations, infinite loop.
 */
export function ArcCarousel({ cards }: { cards: ArcCard[] }) {
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
    "bg-gradient-to-br from-purple-600 to-purple-800": { circle: "bg-white/10", accent: "border-purple-400/30" },
    "bg-gradient-to-br from-violet-600 to-violet-800": { circle: "bg-white/10", accent: "border-violet-400/30" },
    "bg-gradient-to-br from-purple-700 to-slate-900": { circle: "bg-white/10", accent: "border-purple-400/30" },
    "bg-gradient-to-br from-indigo-600 to-purple-800": { circle: "bg-white/10", accent: "border-indigo-400/30" },
    "bg-gradient-to-br from-purple-600 to-indigo-800": { circle: "bg-white/10", accent: "border-purple-400/30" },
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
            className="w-full px-4 sm:px-6 cursor-grab active:cursor-grabbing"
          >
            <motion.button
              type="button"
              onClick={() => !isDragging && router.push(card.href)}
              className="relative block w-full aspect-[9/11]"
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

                {/* Content container */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between pt-10 pb-12 px-6">
                  {/* Top subtle line */}
                  <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  {/* Character illustration area - large and prominent */}
                  <div className="flex-1 flex items-center justify-center w-full relative">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full ${colors.circle} blur-2xl opacity-40`} />

                    {/* Character icon container */}
                    <motion.div
                      animate={{ y: isDragging ? 0 : [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-20"
                    >
                      <div className="w-56 h-56 flex items-center justify-center">
                        <card.Icon
                          width={200}
                          height={200}
                          className={`${card.text} drop-shadow-2xl filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Text section */}
                  <div className="text-center space-y-2">
                    <h2 className={`text-4xl font-display font-bold tracking-tight ${card.text}`}>
                      {card.label}
                    </h2>
                    <p className={`text-xs font-medium ${card.text} opacity-60 uppercase tracking-widest`}>
                      Tap to explore
                    </p>
                  </div>
                </div>
              </div>
              {/* hairline edge following the shape (a border can't follow a mask) */}
              <svg viewBox="0 0 90 110" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
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
      <div className="text-center mt-8 text-xs text-purple-300/60 font-medium tracking-widest">
        {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
      </div>
    </div>
  );
}

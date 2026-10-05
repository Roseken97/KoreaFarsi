"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import { motion, type PanInfo, AnimatePresence } from "motion/react";

export type ArcCard = {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  bg: string;
  text: string;
  href: string;
};

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

  const bgColorMap: Record<string, { circle: string; dark: string }> = {
    "bg-teal-mist": { circle: "bg-teal-deep/30", dark: "from-teal-deep/40" },
    "bg-coral-soft": { circle: "bg-coral-deep/30", dark: "from-coral-deep/40" },
    "bg-sky-soft": { circle: "bg-sky-deep/30", dark: "from-sky-deep/40" },
    "bg-violet-soft": { circle: "bg-violet-deep/30", dark: "from-violet-deep/40" },
    "bg-gold-soft": { circle: "bg-gold-deep/30", dark: "from-gold-deep/40" },
  };

  const colors = bgColorMap[card.bg] || bgColorMap["bg-teal-mist"];

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
            onDragEnd={onDragEnd}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            className="w-full px-4 sm:px-6 cursor-grab active:cursor-grabbing"
          >
            <motion.button
              type="button"
              onClick={() => !isDragging && router.push(card.href)}
              className={`relative w-full aspect-[9/11] rounded-3xl overflow-hidden ${card.bg} shadow-2xl transition-shadow hover:shadow-3xl`}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Multi-layer background */}
              <div className="absolute inset-0">
                {/* Base gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.dark} to-black/30`} />

                {/* Subtle pattern/texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
              </div>

              {/* Content container */}
              <div className="relative z-10 h-full flex flex-col items-center justify-between pt-8 pb-12 px-6">
                {/* Top accent */}
                <div className="text-center opacity-40">
                  <div className="w-12 h-1 mx-auto rounded-full bg-white/30" />
                </div>

                {/* Character illustration area - large and prominent */}
                <div className="flex-1 flex items-center justify-center w-full relative">
                  {/* Large circular background for character */}
                  <div className={`absolute inset-0 rounded-full ${colors.circle} blur-3xl opacity-60`} />

                  {/* Character icon container */}
                  <motion.div
                    animate={{ y: isDragging ? 0 : [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-20"
                  >
                    <div className={`w-56 h-56 flex items-center justify-center`}>
                      <card.Icon
                        width={200}
                        height={200}
                        className={`${card.text} drop-shadow-2xl`}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Text section */}
                <div className="text-center space-y-3">
                  <h2 className={`text-4xl font-display font-bold tracking-tight ${card.text}`}>
                    {card.label}
                  </h2>
                  <p className={`text-sm font-medium ${card.text} opacity-70`}>
                    Tap to explore
                  </p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation indicators */}
      <div className="flex justify-center items-center gap-3 mt-10">
        {/* Previous button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full border border-ink/20 hover:border-ink/40 transition-colors"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              animate={{
                width: i === index ? 24 : 8,
                opacity: i === index ? 1 : 0.4,
              }}
              className={`h-2 rounded-full transition-colors ${
                i === index ? "bg-ink" : "bg-ink/30"
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
          className="p-2 rounded-full border border-ink/20 hover:border-ink/40 transition-colors"
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Slide counter */}
      <div className="text-center mt-6 text-xs text-ink-faint font-medium">
        {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
      </div>
    </div>
  );
}

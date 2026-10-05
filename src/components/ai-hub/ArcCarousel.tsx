"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type SVGProps, useEffect } from "react";
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
 * Large fullscreen carousel with infinite loop, 3D card style matching contemporary design.
 * Swipe left/right to navigate. Cards loop infinitely.
 */
export function ArcCarousel({ cards }: { cards: ArcCard[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragging, setDragging] = useState(false);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 400 : -400,
      opacity: 0,
    }),
  };

  function go(delta: number) {
    setDirection(delta);
    setIndex((prev) => {
      const next = prev + delta;
      return next < 0 ? cards.length - 1 : next % cards.length;
    });
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipeThreshold = 50;
    if (Math.abs(info.velocity.x) > 500 || Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x < -swipeThreshold) go(1);
      else if (info.offset.x > swipeThreshold) go(-1);
    }
  }

  const card = cards[index];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main carousel container */}
      <div className="relative aspect-square max-w-2xl mx-auto w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={card.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            onDragStart={() => setDragging(true)}
            onDragCapture={() => setDragging(false)}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* Card */}
            <motion.button
              type="button"
              onClick={() => router.push(card.href)}
              className={`w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 ${card.bg} shadow-2xl relative overflow-hidden`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />

              {/* Character area (placeholder) */}
              <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                <div className={`w-40 h-40 rounded-full ${card.bg === "bg-teal-mist" ? "bg-teal-deep/20" : card.bg === "bg-coral-soft" ? "bg-coral-deep/20" : card.bg === "bg-sky-soft" ? "bg-sky-deep/20" : card.bg === "bg-violet-soft" ? "bg-violet-deep/20" : "bg-gold-deep/20"} flex items-center justify-center`}>
                  <div className="relative">
                    <card.Icon width={120} height={120} className={card.text} />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="relative z-10 text-center">
                <h2 className={`text-3xl font-display font-bold ${card.text} mb-2`}>{card.label}</h2>
                <p className={`text-sm opacity-75 ${card.text}`}>Swipe to explore</p>
              </div>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-8">
        {cards.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            animate={{
              scale: i === index ? 1.2 : 1,
              opacity: i === index ? 1 : 0.5,
            }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? "bg-ink" : "bg-ink/30"
            }`}
          />
        ))}
      </div>

      {/* Swipe hint */}
      {!dragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-center mt-6 text-xs text-ink-faint"
        >
          ← Swipe →
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { HubCard, type HubCardData, type HubCardLabels } from "./HubCard";

/**
 * Native scroll-snap row of HubCards: the centered card is full size, its neighbours peek
 * in slightly smaller and dimmed, like the three-phone showcase in the reference.
 * Swipe on touch, arrows + dots everywhere else. Works in both RTL and LTR.
 */
export function HubCarousel({
  cards,
  labels,
  formatNumber,
  nav,
}: {
  cards: HubCardData[];
  labels: HubCardLabels;
  formatNumber: (n: number) => string;
  nav: { prev: string; next: string; goTo: string };
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const r = child.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    updateActive();
    window.addEventListener("resize", updateActive);
    return () => window.removeEventListener("resize", updateActive);
  }, [updateActive]);

  function goTo(i: number) {
    const target = scroller.current?.children[(i + cards.length) % cards.length] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className="w-full">
      <div
        ref={scroller}
        onScroll={updateActive}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[calc(50%_-_min(39vw,160px))] pt-4 pb-16 -mb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <div
            key={card.key}
            className={`h-[min(560px,calc(100dvh_-_250px))] min-h-[440px] w-[min(78vw,320px)] shrink-0 snap-center transition-[transform,opacity] duration-300 ease-out ${
              i === active ? "scale-100" : "scale-[0.9]"
            }`}
          >
            <HubCard
              card={card}
              position={i + 1}
              total={cards.length}
              labels={labels}
              formatNumber={formatNumber}
              active={i === active}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label={nav.prev}
          className="hidden size-10 place-items-center rounded-full bg-white/50 text-ink backdrop-blur-md transition hover:bg-white/80 md:grid"
        >
          <ChevronIcon width={18} height={18} className="rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          {cards.map((card, i) => (
            <button
              key={card.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={nav.goTo.replace("{n}", card.label)}
              aria-current={i === active ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-[#2b2834]" : "w-2 bg-[#2b2834]/25"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label={nav.next}
          className="hidden size-10 place-items-center rounded-full bg-white/50 text-ink backdrop-blur-md transition hover:bg-white/80 md:grid"
        >
          <ChevronIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}

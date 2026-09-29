"use client";

import { MascotCorner } from "./MascotCorner";

/** The mascot's little nook, sitting in the corner of the hero (not the whole page — a fixed page-level layer kept getting covered by later opaque sections). */
export function SiteMascotOverlay() {
  return (
    <div className="pointer-events-none absolute bottom-2 start-2 z-20 sm:start-6" aria-hidden="true">
      <MascotCorner />
    </div>
  );
}

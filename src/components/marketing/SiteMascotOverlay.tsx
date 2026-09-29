"use client";

import { MascotCorner } from "./MascotCorner";

/** The mascot's own little nook, fixed at the bottom of the viewport — sitting and waving instead of wandering the page. */
export function SiteMascotOverlay() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 flex justify-center sm:justify-start sm:ps-8" aria-hidden="true">
      <MascotCorner />
    </div>
  );
}

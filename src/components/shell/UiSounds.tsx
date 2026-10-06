"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/ui/sound";

/**
 * One listener for the whole app: a soft tap when a button, link or tab is pressed, a lighter
 * tick for checkboxes, switches and segmented choices. Text fields stay silent.
 * An element can opt out with data-sound="off" (e.g. when it plays its own sound).
 */
export function UiSounds() {
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      const el = (e.target as Element | null)?.closest("button, a[href], [role=radio], [role=tab], [role=switch], input[type=checkbox], label");
      if (!el || el.closest("[data-sound=off]")) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;
      const toggle = el.matches("[role=radio], [role=tab], [role=switch], input[type=checkbox], label");
      playSound(toggle ? "tick" : "tap");
    }
    document.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, []);
  return null;
}

/** Plays the success chime once when it mounts (e.g. on the "You're in!" screen). */
export function SuccessChime() {
  useEffect(() => playSound("success"), []);
  return null;
}

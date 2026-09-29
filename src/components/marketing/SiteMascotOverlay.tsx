"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { MascotSprite } from "./MascotSprite";

/** A loose wandering loop across the full page, not tied to any particular section. */
const PATH_X = [10, 45, 85, 90, 55, 20, 8, 10];
const PATH_Y = [15, 8, 18, 60, 92, 75, 45, 15];

/** The same 2D SVG mascot from the hero's letter scene, now wandering the whole page as a fixed layer over the 3D background — instead of the 3D bear experiment Rose didn't want. */
export function SiteMascotOverlay() {
  const x = useMotionValue(PATH_X[0]);
  const y = useMotionValue(PATH_Y[0]);
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);

  useEffect(() => {
    const cx = animate(x, PATH_X, { duration: 32, repeat: Infinity, repeatType: "loop", ease: "easeInOut" });
    const cy = animate(y, PATH_Y, { duration: 32, repeat: Infinity, repeatType: "loop", ease: "easeInOut" });
    return () => {
      cx.stop();
      cy.stop();
    };
  }, [x, y]);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <motion.div className="absolute" style={{ left, top, x: "-50%", y: "-50%" }}>
        <MascotSprite />
      </motion.div>
    </div>
  );
}

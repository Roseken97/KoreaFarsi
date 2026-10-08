"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { startGuide } from "./guide";

const BlossomScene = dynamic(() => import("./BlossomScene"), { ssr: false });

/**
 * The site guide: a 3D cherry-blossom petal that flies to each homepage section and
 * wakes its animation (see guide.ts). The canvas sits above section backgrounds but
 * below section content (content wrappers use z-10), so it never covers text.
 */
export function BlossomGuide() {
  const [scene, setScene] = useState<{ reduced: boolean } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = startGuide(reduced);
    const cv = document.createElement("canvas");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL and motion settings are only known in the browser
    if (cv.getContext("webgl2") || cv.getContext("webgl")) setScene({ reduced });
    return stop;
  }, []);

  if (!scene) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5]">
      <BlossomScene reduced={scene.reduced} />
    </div>
  );
}

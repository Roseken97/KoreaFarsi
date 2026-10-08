"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BlossomScene = dynamic(() => import("./BlossomScene"), { ssr: false });

/**
 * Fixed, full-screen layer with one 3D cherry-blossom petal that falls down the page as it scrolls.
 * Sits above section backgrounds but below section content (content wrappers use z-10),
 * so text and cards always stay readable. Decorative only.
 */
export function BlossomGuide() {
  const [ready, setReady] = useState<{ reduced: boolean } | null>(null);

  useEffect(() => {
    const cv = document.createElement("canvas");
    if (!(cv.getContext("webgl2") || cv.getContext("webgl"))) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL and motion settings are only known in the browser
    setReady({ reduced: mq.matches });
    const onChange = () => setReady({ reduced: mq.matches });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!ready) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5]">
      <BlossomScene reduced={ready.reduced} />
    </div>
  );
}

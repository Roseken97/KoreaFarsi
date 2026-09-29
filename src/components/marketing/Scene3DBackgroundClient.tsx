"use client";

import dynamic from "next/dynamic";

/** Client-side wrapper so the WebGL scene can be loaded with ssr:false from a server component page. */
const Scene3DBackground = dynamic(() => import("./Scene3DBackground").then((m) => m.Scene3DBackground), {
  ssr: false,
});

export { Scene3DBackground as Scene3DBackgroundClient };

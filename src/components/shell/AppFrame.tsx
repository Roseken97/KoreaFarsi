"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The app is a phone app on every screen: on tablets and desktops it stays a phone-width column
 * centered on a soft backdrop, with the same bottom nav. Admin pages get a wider column because
 * their forms are edited at a desk.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const wide = usePathname().startsWith("/admin");
  return (
    <div className="min-h-dvh bg-cream-deep">
      <div className={`relative mx-auto min-h-dvh w-full bg-white sm:shadow-lift ${wide ? "max-w-5xl" : "max-w-app"}`}>{children}</div>
    </div>
  );
}

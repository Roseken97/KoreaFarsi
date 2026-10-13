"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Page transition for the website: keyed by path, so each navigation remounts
 * the body and it rises and fades in (`.kf-page-in` in globals.css). The
 * animation fills backwards only, so no transform is left behind to trap
 * position:fixed children once it ends.
 */
export function SiteTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={`kf-page-in ${className}`}>
      {children}
    </div>
  );
}

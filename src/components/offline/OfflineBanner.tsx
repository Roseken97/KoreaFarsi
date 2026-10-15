"use client";

import { useConnectivity } from "@/lib/offline/connectivity";
import { useI18n } from "@/lib/i18n/client";

/** Shown across the app while our server can't be reached (offline, or an international-internet cutoff). */
export function OfflineBanner() {
  const { offline } = useConnectivity();
  const { m } = useI18n();
  if (!offline) return null;
  return (
    <div role="status" className="mb-4 rounded-field bg-gold-soft px-4 py-3 text-[13px] leading-6 text-ink">
      <p dir="auto">{m.offline.banner}</p>
      <p dir="auto" className="text-ink-soft">
        {m.offline.bannerLimits}
      </p>
    </div>
  );
}

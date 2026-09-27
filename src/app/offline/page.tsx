import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };
// Static and bilingual: served by the service worker when there's no connection,
// so it can't depend on the locale cookie.
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="flex max-w-sm flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- precached asset, must work offline */}
        <img src="/brand/logo-512.png" alt="" width={96} height={96} />
        <h1 className="mt-6 font-display text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">Check your internet connection and try again.</p>
        <p dir="rtl" lang="fa" className="mt-5 font-[family-name:var(--font-vazirmatn)] text-lg font-semibold">
          اتصال اینترنت برقرار نیست
        </p>
        <p dir="rtl" lang="fa" className="mt-1 font-[family-name:var(--font-vazirmatn)] text-sm text-ink-soft">
          اینترنت خود را بررسی کن و دوباره امتحان کن.
        </p>
      </div>
    </div>
  );
}

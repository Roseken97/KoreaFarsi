"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const noopSubscribe = () => () => {};

/** iOS Safari never fires beforeinstallprompt, so it gets the manual Add-to-Home-Screen steps. */
function iosNotInstalled() {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return !standalone && /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * The green "Get the free app" button. KoreaFarsi is a PWA, so "download" means install:
 * - Chrome/Android/desktop: the browser's real install prompt.
 * - iOS Safari (no install prompt): a short "Add to Home Screen" how-to.
 * - Anything else, or already installed: opens the app (/launch) — never a dead button.
 */
export function InstallCta({
  label,
  iosTitle,
  iosInstructions,
  closeLabel,
}: {
  label: string;
  iosTitle: string;
  iosInstructions: string;
  closeLabel: string;
}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const isIOS = useSyncExternalStore(noopSubscribe, iosNotInstalled, () => false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const className =
    "inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[#34D399] px-7 text-[17px] font-black text-[#052E1C] shadow-[0_10px_30px_rgba(52,211,153,0.4)] transition hover:bg-[#4ADEA8]";
  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
    </svg>
  );

  if (!deferred && !isIOS) {
    return (
      <Link href="/launch" className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  async function onClick() {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else {
      setShowHelp(true);
    }
  }

  return (
    <>
      <button type="button" onClick={onClick} className={className}>
        {icon}
        {label}
      </button>
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={iosTitle}
          className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-4 sm:place-items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#1C1336] p-6 text-start text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-extrabold">{iosTitle}</p>
            <p className="mt-2 text-[15px] leading-7 text-[#C9BEE3]">{iosInstructions}</p>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 min-h-11 w-full rounded-full bg-white/10 font-bold text-white"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

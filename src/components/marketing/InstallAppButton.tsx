"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/icons";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorStandalone = Navigator & { standalone?: boolean };

/**
 * Real "Install App" affordance — uses the browser's actual PWA install prompt on
 * Chrome/Android/desktop, and shows the manual "Add to Home Screen" steps on iOS
 * (Safari never fires beforeinstallprompt). Renders nothing when there's no real
 * install path (already installed, or a browser that offers neither route) —
 * never a button that does nothing.
 */
export function InstallAppButton({
  label,
  iosLabel,
  iosInstructions,
}: {
  label: string;
  iosLabel: string;
  iosInstructions: string;
}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as NavigatorStandalone).standalone)),
  );
  const [isIOS] = useState(() => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent));
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferred(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!deferred && !isIOS)) return null;

  async function handleClick() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setShowIOSHelp((s) => !s);
  }

  return (
    <div className="relative mx-[0.2em] mb-[0.4em] inline-block">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-deep bg-teal-mist px-4 py-[0.55em] text-[13px] font-medium whitespace-nowrap text-teal-deep transition-colors duration-200 hover:bg-teal hover:text-white sm:px-5 sm:text-[15px]"
      >
        <DownloadIcon width={14} height={14} />
        {deferred ? label : iosLabel}
      </button>

      {showIOSHelp && (
        <div className="absolute top-full left-1/2 z-30 mt-2 w-56 -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-xs leading-5 text-cream shadow-lift">
          {iosInstructions}
        </div>
      )}
    </div>
  );
}

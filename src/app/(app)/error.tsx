"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/** Catches server/render errors anywhere under the app shell — shows the real message instead of a raw browser error page. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">این صفحه لود نشد</h1>
      <p className="max-w-sm text-sm text-ink-soft">یه خطای غیرمنتظره رخ داد. می‌تونی دوباره امتحان کنی.</p>
      <Button onClick={reset} className="w-auto! px-8">
        تلاش دوباره
      </Button>
      <details className="mt-4 w-full max-w-md rounded-field border border-line bg-surface p-3 text-start text-xs text-ink-faint">
        <summary className="cursor-pointer font-medium text-ink-soft">جزئیات فنی</summary>
        <p className="mt-2 break-words" dir="ltr">
          {error.message}
          {error.digest && ` (digest: ${error.digest})`}
        </p>
      </details>
    </div>
  );
}

"use client";

import { useState } from "react";
import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { authErrorMessage } from "@/lib/auth/errors";
import { useI18n } from "@/lib/i18n/client";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function GoogleButton({
  next,
  remember = true,
  onError,
  round = false,
}: {
  next: string;
  remember?: boolean;
  onError: (message: string) => void;
  /** Round white icon button, as in the soft-3D auth reference's social row. */
  round?: boolean;
}) {
  const { m } = useI18n();
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!isSupabaseConfigured) return onError(m.errors.notConfigured);
    setLoading(true);
    setRememberMe(remember);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // On success the browser navigates away to Google.
    if (error) {
      setLoading(false);
      onError(authErrorMessage(m, error));
    }
  }

  if (round) {
    return (
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        aria-label={m.auth.google}
        title={m.auth.google}
        className="grid size-12 place-items-center rounded-full border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(30_35_64/0.3)] disabled:opacity-55"
      >
        {loading ? (
          <span className="size-5 animate-spin rounded-full border-2 border-ink-faint border-t-transparent" />
        ) : (
          <GoogleIcon width={22} height={22} />
        )}
      </button>
    );
  }

  return (
    <Button type="button" variant="secondary" loading={loading} onClick={signIn}>
      <GoogleIcon />
      {m.auth.google}
    </Button>
  );
}

export function OrDivider({ label }: { label?: string }) {
  const { m } = useI18n();
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
      <span className="h-px flex-1 bg-line" />
      {label ?? m.common.or}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

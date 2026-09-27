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
}: {
  next: string;
  remember?: boolean;
  onError: (message: string) => void;
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

  return (
    <Button type="button" variant="secondary" loading={loading} onClick={signIn}>
      <GoogleIcon />
      {m.auth.google}
    </Button>
  );
}

export function OrDivider() {
  const { m } = useI18n();
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
      <span className="h-px flex-1 bg-line" />
      {m.common.or}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

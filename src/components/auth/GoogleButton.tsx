"use client";

import { useState } from "react";
import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "@/lib/auth/errors";

export function GoogleButton({ next, onError }: { next: string; onError: (message: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!isSupabaseConfigured) return onError(NOT_CONFIGURED_MESSAGE);
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // On success the browser navigates away to Google.
    if (error) {
      setLoading(false);
      onError(authErrorMessage(error));
    }
  }

  return (
    <Button type="button" variant="secondary" loading={loading} onClick={signIn}>
      <GoogleIcon />
      ادامه با گوگل
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
      <span className="h-px flex-1 bg-line" />
      یا
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

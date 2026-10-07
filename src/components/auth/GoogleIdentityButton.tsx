"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { authErrorMessage } from "@/lib/auth/errors";
import { useI18n } from "@/lib/i18n/client";
import { createClient, setRememberMe } from "@/lib/supabase/client";

/**
 * Public OAuth client ID — the same one Supabase's Google provider lists, which
 * is what signInWithIdToken checks the token's audience against. Not a secret.
 */
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "542619771310-3lk0s0c58lev7m99g6m7k0l9targ07gf.apps.googleusercontent.com";

const GSI_SRC = "https://accounts.google.com/gsi/client";

type GsiCredential = { credential: string };
type GsiApi = {
  accounts: {
    id: {
      initialize(options: Record<string, unknown>): void;
      renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
    };
  };
};

let gsiLoader: Promise<GsiApi> | null = null;

function loadGsi(): Promise<GsiApi> {
  const existing = (window as unknown as { google?: GsiApi }).google;
  if (existing?.accounts?.id) return Promise.resolve(existing);
  gsiLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => resolve((window as unknown as { google: GsiApi }).google);
    script.onerror = () => {
      gsiLoader = null;
      reject(new Error("gsi"));
    };
    document.head.appendChild(script);
  });
  return gsiLoader;
}

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Google's own Sign in with Google button. The account picker opens over the
 * page and returns an ID token in place, so an installed (standalone) app
 * never hands off to the browser the way the OAuth redirect flow does.
 */
export function GoogleIdentityButton({
  next,
  remember,
  onError,
  round,
  fallback,
}: {
  next: string;
  remember: boolean;
  onError: (message: string) => void;
  round: boolean;
  /** Shown if Google's script can't load (offline, blocked); uses the redirect flow. */
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const { m, locale } = useI18n();
  const slot = useRef<HTMLDivElement>(null);
  // Read inside the GIS callback, which is registered once.
  const latest = useRef({ next, remember, onError, m });
  useEffect(() => {
    latest.current = { next, remember, onError, m };
  });

  useEffect(() => {
    let cancelled = false;
    const rawNonce = crypto.randomUUID();

    (async () => {
      try {
        const [gsi, hashedNonce] = await Promise.all([loadGsi(), sha256Hex(rawNonce)]);
        if (cancelled || !slot.current) return;
        gsi.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashedNonce,
          use_fedcm_for_button: true,
          callback: async ({ credential }: GsiCredential) => {
            const { next, remember, onError, m } = latest.current;
            setRememberMe(remember);
            const { error } = await createClient().auth.signInWithIdToken({
              provider: "google",
              token: credential,
              nonce: rawNonce,
            });
            if (error) return onError(authErrorMessage(m, error));
            // Full navigation so server components pick up the new session.
            window.location.assign(next);
          },
        });
        gsi.accounts.id.renderButton(slot.current, {
          type: round ? "icon" : "standard",
          shape: round ? "circle" : "pill",
          theme: "outline",
          size: "large",
          text: "continue_with",
          locale,
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [round, locale]);

  if (failed) return fallback;

  return (
    <div
      ref={slot}
      data-sound="off"
      className={round ? "grid min-h-12 min-w-12 place-items-center" : "flex min-h-11 justify-center"}
    />
  );
}

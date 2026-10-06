"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { HexHero } from "@/components/auth/HexHero";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { LockIcon, MailIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function LoginForm({
  next,
  callbackFailed,
  image,
}: {
  next: string;
  callbackFailed: boolean;
  image?: string;
}) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.auth.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState(
    callbackFailed ? m.errors.callback : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = {
      email: validateEmail(m, email) || undefined,
      password: password ? undefined : m.errors.validation.passwordRequired,
    };
    setFieldErrors(errors);
    setFormError("");
    if (errors.email || errors.password) return;
    if (!isSupabaseConfigured) return setFormError(m.errors.notConfigured);

    setLoading(true);
    setRememberMe(remember);
    const { error } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setLoading(false);
      return setFormError(authErrorMessage(m, error));
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <>
      {/* lavender panel with the 3D render, under a white sheet (soft-3D reference) */}
      <div className="relative -mx-6 -mt-[calc(env(safe-area-inset-top)+4.5rem)] h-64 shrink-0 overflow-hidden bg-[linear-gradient(160deg,#d1b6e7,#ae8ad2_55%,#8f9ee8)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+2.5rem)]">
            <HexHero tone="lavender" letter="가" className="w-44" />
          </div>
        )}
      </div>

      <div className="relative -mx-6 -mt-10 -mb-[max(2rem,env(safe-area-inset-bottom))] flex flex-1 flex-col rounded-t-[2rem] bg-white/85 px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <AuthHeader title={t.title} />

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {formError && <Notice tone="error">{formError}</Notice>}
          <div className="flex flex-col gap-3 rounded-[1.75rem] bg-white p-2 shadow-[0_18px_40px_-22px_rgb(30_35_64/0.35)]">
            <Field
              label={m.auth.fields.email}
              icon={<MailIcon width={18} height={18} />}
              iconTint="bg-gold-soft text-gold-deep"
              type="email"
              ltr
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <Field
              label={m.auth.fields.password}
              icon={<LockIcon width={18} height={18} />}
              iconTint="bg-indigo-soft text-indigo-deep"
              type="password"
              ltr
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 px-1 text-sm text-ink-soft select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded accent-ink"
            />
            {t.rememberMe}
          </label>
          <div className="mt-1 flex items-center justify-between gap-4">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-violet hover:underline"
            >
              {t.forgot}
            </Link>
            <Button
              type="submit"
              variant="navy"
              loading={loading}
              className="h-12 w-auto! shrink-0 px-8"
            >
              {t.submit}
            </Button>
          </div>
        </form>

        <OrDivider label={m.auth.orLoginWith} />
        <div className="flex justify-center">
          <GoogleButton
            next={next}
            remember={remember}
            onError={setFormError}
            round
          />
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-ink-soft">
          {t.noAccount}{" "}
          <Link
            href={`/auth/signup${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-violet-deep hover:underline"
          >
            {t.signupLink}
          </Link>
        </p>
      </div>
    </>
  );
}

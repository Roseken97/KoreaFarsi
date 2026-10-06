"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function LoginForm({ next, callbackFailed }: { next: string; callbackFailed: boolean }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.auth.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState(callbackFailed ? m.errors.callback : "");
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
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      return setFormError(authErrorMessage(m, error));
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <>
      <AuthHeader title={t.title} />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label={m.auth.fields.email}
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
          type="password"
          ltr
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <div className="-mt-1 flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-ink-soft select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded accent-violet-deep"
            />
            {t.rememberMe}
          </label>
          <Link href="/auth/forgot-password" className="font-medium text-violet-deep hover:underline">
            {t.forgot}
          </Link>
        </div>
        <Button type="submit" variant="dark" loading={loading} className="mt-2 h-14">
          {t.submit}
        </Button>
      </form>

      <OrDivider label={m.auth.orLoginWith} />
      <div className="flex justify-center">
        <GoogleButton next={next} remember={remember} onError={setFormError} round />
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
    </>
  );
}

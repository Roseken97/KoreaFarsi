"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SiteField, SiteNotice, SiteSubmit } from "./SiteField";

/** Website login: the same Supabase email/password and Google sign-in as the app, in the site's look. */
export function SiteLoginForm({ next, callbackFailed }: { next: string; callbackFailed: boolean }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.auth.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState(callbackFailed ? m.errors.callback : "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next_errors = {
      email: validateEmail(m, email) || undefined,
      password: password ? undefined : m.errors.validation.passwordRequired,
    };
    setErrors(next_errors);
    setFormError("");
    if (next_errors.email || next_errors.password) return;
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

  const signupHref = `/signup${next !== "/my-account" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <SiteNotice>{formError}</SiteNotice>}
        <SiteField label={m.auth.fields.email} type="email" ltr autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <SiteField label={m.auth.fields.password} type="password" ltr autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-[#C9BEE3] select-none">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[#2FE6E0]" />
            {t.rememberMe}
          </label>
          <Link href="/forgot-password" className="font-bold text-[#6FF3EE] hover:underline">
            {t.forgot}
          </Link>
        </div>
        <SiteSubmit loading={loading}>{t.submit}</SiteSubmit>
      </form>

      <div className="flex items-center gap-3 text-xs text-[#A99FC4]">
        <span className="h-px flex-1 bg-white/15" />
        {m.auth.orLoginWith}
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <div className="flex justify-center">
        <GoogleButton next={next} remember={remember} onError={setFormError} round />
      </div>

      <p className="m-0 text-center text-sm text-[#C9BEE3]">
        {t.noAccount}{" "}
        <Link href={signupHref} className="font-bold text-white hover:underline">
          {t.signupLink}
        </Link>
      </p>
    </div>
  );
}

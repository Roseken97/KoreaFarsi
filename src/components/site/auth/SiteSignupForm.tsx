"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import type { LevelCourse } from "@/components/auth/LevelPrompt";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/config";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SiteField, SiteNotice, SiteSubmit } from "./SiteField";
import { SiteLevelPrompt } from "./SiteLevelPrompt";

type Errors = { name?: string; email?: string; password?: string };

/**
 * Website signup: name, email, password (+ the 6-digit code when email
 * confirmation is on) and Google, on the same Supabase project as the app.
 * Opens with the level question; signed-up visitors land on `next` (/my-account by default).
 */
export function SiteSignupForm({ next, levelCourses }: { next: string; levelCourses: LevelCourse[] }) {
  const router = useRouter();
  const { m, locale } = useI18n();
  const t = m.auth.signup;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  function done() {
    router.replace(next);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Errors = {
      name: name.trim() ? undefined : m.errors.validation.nameRequired,
      email: validateEmail(m, email) || undefined,
      password: validatePassword(m, locale, password) || undefined,
    };
    setErrors(nextErrors);
    setFormError("");
    if (Object.values(nextErrors).some(Boolean)) return;
    if (!isSupabaseConfigured) return setFormError(m.errors.notConfigured);

    setLoading(true);
    setRememberMe(true);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(m, error));
    // Email confirmation ON → no session yet; OFF → signed in immediately.
    if (data.session) done();
    else setSentTo(email.trim());
  }

  async function onVerify(e: FormEvent) {
    e.preventDefault();
    if (!sentTo) return;
    setCodeError("");
    setVerifying(true);
    const { data, error } = await createClient().auth.verifyOtp({ email: sentTo, token: code.trim(), type: "signup" });
    setVerifying(false);
    if (error || !data.session) return setCodeError(t.invalidCode);
    done();
  }

  async function onResend() {
    if (!sentTo) return;
    setResending(true);
    setCodeError("");
    setResent(false);
    const { error } = await createClient().auth.resend({ type: "signup", email: sentTo });
    setResending(false);
    if (error) return setCodeError(authErrorMessage(m, error));
    setResent(true);
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="m-0 text-xl font-black text-white">{t.checkEmailTitle}</h2>
        <p className="m-0 text-[15px] text-[#C9BEE3]">{fmt(t.checkEmailBody, { email: `⁦${sentTo}⁩` })}</p>
        <p className="m-0 text-sm text-[#A99FC4]">{t.checkEmailSpam}</p>
        <form onSubmit={onVerify} noValidate className="flex flex-col gap-4">
          {resent && <SiteNotice tone="success">{t.resent}</SiteNotice>}
          <SiteField label={t.codeLabel} ltr inputMode="numeric" autoComplete="one-time-code" placeholder={t.codePlaceholder} value={code} onChange={(e) => setCode(e.target.value)} error={codeError} />
          <SiteSubmit loading={verifying}>{t.verify}</SiteSubmit>
          <button type="button" onClick={onResend} disabled={resending} className="text-sm font-bold text-[#6FF3EE] hover:underline disabled:opacity-55">
            {t.resend}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SiteLevelPrompt courses={levelCourses} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <SiteNotice>{formError}</SiteNotice>}
        <SiteField label={m.auth.fields.fullName} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <SiteField label={m.auth.fields.email} type="email" ltr autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <SiteField label={m.auth.fields.password} type="password" ltr autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <SiteSubmit loading={loading}>{t.submit}</SiteSubmit>
      </form>

      <div className="flex items-center gap-3 text-xs text-[#A99FC4]">
        <span className="h-px flex-1 bg-white/15" />
        {m.auth.orSignupWith}
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <div className="flex justify-center">
        <GoogleButton next={next} onError={setFormError} round />
      </div>

      <p className="m-0 text-center text-sm text-[#C9BEE3]">
        {t.haveAccount}{" "}
        <Link href={`/login${next !== "/my-account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-white hover:underline">
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
}

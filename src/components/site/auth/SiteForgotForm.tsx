"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SiteField, SiteNotice, SiteSubmit } from "./SiteField";

/** Website "forgot password": sends Supabase's reset link (the link itself opens the shared reset screen). */
export function SiteForgotForm() {
  const { m } = useI18n();
  const t = m.auth.forgot;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateEmail(m, email);
    setEmailError(err);
    setFormError("");
    if (err) return;
    if (!isSupabaseConfigured) return setFormError(m.errors.notConfigured);
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(m, error));
    // Same message whether or not the account exists (no account enumeration).
    setSent(true);
  }

  const back = (
    <Link href="/login" className="text-center text-sm font-bold text-[#6FF3EE] hover:underline">
      {t.backToLogin}
    </Link>
  );

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="m-0 text-xl font-black text-white">{t.sentTitle}</h2>
        <p className="m-0 text-[15px] text-[#C9BEE3]">{fmt(t.sentBody, { email: `⁦${email.trim()}⁩` })}</p>
        {back}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {formError && <SiteNotice>{formError}</SiteNotice>}
      <SiteField label={m.auth.fields.email} type="email" ltr autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
      <SiteSubmit loading={loading}>{t.submit}</SiteSubmit>
      {back}
    </form>
  );
}

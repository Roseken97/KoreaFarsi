"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { MailIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ForgotPasswordForm() {
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

  const backLink = (
    <Link href="/auth/login" className="font-semibold text-teal hover:underline">
      {t.backToLogin}
    </Link>
  );

  if (sent) {
    return (
      <StatusScreen icon={<MailIcon width={30} height={30} />} title={t.sentTitle} action={backLink}>
        <p>{fmt(t.sentBody, { email: `⁦${email.trim()}⁩` })}</p>
      </StatusScreen>
    );
  }

  return (
    <>
      <AuthHeader title={t.title} subtitle={t.subtitle} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label={m.auth.fields.email}
          type="email"
          ltr
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <Button type="submit" loading={loading} className="mt-2">
          {t.submit}
        </Button>
      </form>
      <p className="mt-auto pt-8 text-center text-sm">{backLink}</p>
    </>
  );
}

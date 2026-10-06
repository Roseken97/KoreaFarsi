"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { HexHero } from "@/components/auth/HexHero";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { LockIcon, MailIcon, UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/config";
import { createClient, setRememberMe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Errors = { name?: string; email?: string; password?: string };

// Sketch 03 step 2: Full Name / Email / Password (no confirm field; the eye toggle covers typos).
export function SignupForm({ next, image }: { next: string; image?: string }) {
  const router = useRouter();
  const { m, locale } = useI18n();
  const t = m.auth.signup;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentNotice, setResentNotice] = useState(false);

  // After signup the user lands on the "You're In!" screen, which then continues to `next`.
  const successPath = `/auth/success${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: Errors = {
      name: name.trim() ? undefined : m.errors.validation.nameRequired,
      email: validateEmail(m, email) || undefined,
      password: validatePassword(m, locale, password) || undefined,
    };
    setFieldErrors(errors);
    setFormError("");
    if (Object.values(errors).some(Boolean)) return;
    if (!isSupabaseConfigured) return setFormError(m.errors.notConfigured);

    setLoading(true);
    setRememberMe(true);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(successPath)}`,
      },
    });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(m, error));

    // Email confirmation ON → no session yet; OFF → signed in immediately.
    if (data.session) {
      router.replace(successPath);
      router.refresh();
    } else {
      setSentTo(email.trim());
    }
  }

  async function onVerify(e: FormEvent) {
    e.preventDefault();
    if (!sentTo) return;
    setCodeError("");
    setVerifying(true);
    const { data, error } = await createClient().auth.verifyOtp({
      email: sentTo,
      token: code.trim(),
      type: "signup",
    });
    setVerifying(false);
    if (error || !data.session) return setCodeError(t.invalidCode);
    router.replace(successPath);
    router.refresh();
  }

  async function onResend() {
    if (!sentTo) return;
    setResending(true);
    setCodeError("");
    setResentNotice(false);
    const { error } = await createClient().auth.resend({ type: "signup", email: sentTo });
    setResending(false);
    if (error) return setCodeError(authErrorMessage(m, error));
    setResentNotice(true);
  }

  if (sentTo) {
    return (
      <StatusScreen icon={<MailIcon width={30} height={30} />} title={t.checkEmailTitle}>
        <p>{fmt(t.checkEmailBody, { email: `⁦${sentTo}⁩` })}</p>
        <p className="mt-2 text-sm text-ink-faint">{t.checkEmailSpam}</p>
        <form onSubmit={onVerify} noValidate className="mt-6 flex flex-col gap-4 text-start">
          {resentNotice && <Notice tone="success">{t.resent}</Notice>}
          <Field
            label={t.codeLabel}
            ltr
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t.codePlaceholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={codeError}
          />
          <Button type="submit" variant="navy" loading={verifying}>
            {t.verify}
          </Button>
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="text-sm font-semibold text-violet-deep hover:underline disabled:opacity-55"
          >
            {t.resend}
          </button>
        </form>
        <Link href="/auth/login" className="mt-8 block font-semibold text-violet-deep hover:underline">
          {t.backToLogin}
        </Link>
      </StatusScreen>
    );
  }

  return (
    <>
      <HexHero tone="rose" image={image} letter="한" className="-mt-6 mb-4" />
      <AuthHeader title={t.title} />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label={m.auth.fields.fullName}
          icon={<UserIcon width={18} height={18} />}
          iconTint="bg-gold-soft text-gold-deep"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Field
          label={m.auth.fields.email}
          icon={<MailIcon width={18} height={18} />}
          iconTint="bg-sage-soft text-teal-deep"
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Button type="submit" variant="navy" loading={loading} className="mt-3 h-14">
          {t.submit}
        </Button>
      </form>

      <OrDivider label={m.auth.orSignupWith} />
      <div className="flex justify-center">
        <GoogleButton next={successPath} onError={setFormError} round />
      </div>

      <p className="mt-auto pt-6 text-center text-sm text-ink-soft">
        {t.haveAccount}{" "}
        <Link href="/auth/login" className="font-semibold text-violet-deep hover:underline">
          {t.loginLink}
        </Link>
      </p>
    </>
  );
}

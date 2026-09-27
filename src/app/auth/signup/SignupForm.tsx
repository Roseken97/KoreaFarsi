"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { MailIcon } from "@/components/icons";
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
export function SignupForm({ next }: { next: string }) {
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

  if (sentTo) {
    return (
      <StatusScreen
        icon={<MailIcon width={30} height={30} />}
        title={t.checkEmailTitle}
        action={
          <Link href="/auth/login" className="font-semibold text-teal hover:underline">
            {t.backToLogin}
          </Link>
        }
      >
        <p>{fmt(t.checkEmailBody, { email: `⁦${sentTo}⁩` })}</p>
        <p className="mt-2 text-sm text-ink-faint">{t.checkEmailSpam}</p>
      </StatusScreen>
    );
  }

  return (
    <>
      <AuthHeader title={t.title} subtitle={t.subtitle} />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label={m.auth.fields.fullName}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Field
          label={m.auth.fields.email}
          type="email"
          ltr
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Field
          label={m.auth.fields.password}
          type="password"
          ltr
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Button type="submit" loading={loading} className="mt-2">
          {t.submit}
        </Button>
      </form>

      <OrDivider />
      <GoogleButton next={successPath} onError={setFormError} />

      <p className="mt-auto pt-8 text-center text-sm text-ink-soft">
        {t.haveAccount}{" "}
        <Link href="/auth/login" className="font-semibold text-teal hover:underline">
          {t.loginLink}
        </Link>
      </p>
    </>
  );
}

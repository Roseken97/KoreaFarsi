"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { MailIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    setFormError("");
    if (err) return;
    if (!isSupabaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(error));
    // Same message whether or not the account exists (no account enumeration).
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-1 flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-sage-soft text-teal">
          <MailIcon width={30} height={30} />
        </span>
        <h1 className="mt-6 text-2xl font-bold">لینک بازیابی ارسال شد</h1>
        <p className="mt-3 text-[15px] leading-7 text-ink-soft">
          اگر حسابی با <span dir="ltr" className="font-medium text-ink">{email.trim()}</span> وجود داشته باشد، لینک تعیین رمز جدید برایش ارسال می‌شود.
        </p>
        <Link href="/auth/login" className="mt-8 font-semibold text-teal hover:underline">
          بازگشت به ورود
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="فراموشی رمز عبور"
        subtitle="ایمیل حساب خود را وارد کنید تا لینک تعیین رمز جدید برایتان ارسال شود."
      />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label="ایمیل"
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
          ارسال لینک بازیابی
        </Button>
      </form>
      <p className="mt-auto pt-8 text-center text-sm text-ink-soft">
        <Link href="/auth/login" className="font-semibold text-teal hover:underline">
          بازگشت به ورود
        </Link>
      </p>
    </>
  );
}

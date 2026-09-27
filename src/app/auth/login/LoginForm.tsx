"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "@/lib/auth/errors";
import { validateEmail } from "@/lib/auth/validation";

export function LoginForm({ next, callbackFailed }: { next: string; callbackFailed: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState(
    callbackFailed ? "لینک ورود نامعتبر یا منقضی شده است. دوباره تلاش کنید." : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = {
      email: validateEmail(email) || undefined,
      password: password ? undefined : "رمز عبور را وارد کنید.",
    };
    setFieldErrors(errors);
    setFormError("");
    if (errors.email || errors.password) return;
    if (!isSupabaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      return setFormError(authErrorMessage(error));
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <>
      <AuthHeader title="ورود به حساب" subtitle="خوشحالیم که دوباره برگشتی." />

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
          error={fieldErrors.email}
        />
        <Field
          label="رمز عبور"
          type="password"
          ltr
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Link href="/auth/forgot-password" className="-mt-1 self-start text-sm font-medium text-teal hover:underline">
          رمز عبور را فراموش کرده‌اید؟
        </Link>
        <Button type="submit" loading={loading} className="mt-2">
          ورود
        </Button>
      </form>

      <OrDivider />
      <GoogleButton next={next} onError={setFormError} />

      <p className="mt-auto pt-8 text-center text-sm text-ink-soft">
        حساب کاربری ندارید؟{" "}
        <Link href={`/auth/signup${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-teal hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </>
  );
}

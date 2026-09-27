"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { MailIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "@/lib/auth/errors";
import { validateEmail, validatePassword } from "@/lib/auth/validation";

type Errors = { name?: string; email?: string; password?: string; confirm?: string };

export function SignupForm({ next }: { next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: Errors = {
      name: name.trim() ? undefined : "نام خود را وارد کنید.",
      email: validateEmail(email) || undefined,
      password: validatePassword(password) || undefined,
      confirm: confirm === password ? undefined : "تکرار رمز عبور یکسان نیست.",
    };
    setFieldErrors(errors);
    setFormError("");
    if (Object.values(errors).some(Boolean)) return;
    if (!isSupabaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    setLoading(true);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(error));

    // Email confirmation ON → no session yet; OFF → signed in immediately.
    if (data.session) {
      router.replace(next);
      router.refresh();
    } else {
      setSentTo(email.trim());
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-1 flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-sage-soft text-teal">
          <MailIcon width={30} height={30} />
        </span>
        <h1 className="mt-6 text-2xl font-bold">ایمیل خود را بررسی کنید</h1>
        <p className="mt-3 text-[15px] leading-7 text-ink-soft">
          لینک تأیید حساب به <span dir="ltr" className="font-medium text-ink">{sentTo}</span> ارسال شد. با کلیک روی آن، حساب شما فعال می‌شود.
        </p>
        <p className="mt-2 text-sm text-ink-faint">ایمیل را نمی‌بینید؟ پوشه‌ی Spam را هم نگاه کنید.</p>
        <Link href="/auth/login" className="mt-8 font-semibold text-teal hover:underline">
          بازگشت به ورود
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeader title="ساخت حساب کاربری" subtitle="چند ثانیه تا شروع یادگیری با کره‌فارسی." />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <Notice tone="error">{formError}</Notice>}
        <Field
          label="نام"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Field
          label="تکرار رمز عبور"
          type="password"
          ltr
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={fieldErrors.confirm}
        />
        <Button type="submit" loading={loading} className="mt-2">
          ثبت‌نام
        </Button>
      </form>

      <OrDivider />
      <GoogleButton next={next} onError={setFormError} />

      <p className="mt-auto pt-8 text-center text-sm text-ink-soft">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/auth/login" className="font-semibold text-teal hover:underline">
          وارد شوید
        </Link>
      </p>
    </>
  );
}

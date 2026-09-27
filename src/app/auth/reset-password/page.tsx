"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "@/lib/auth/errors";
import { validatePassword } from "@/lib/auth/validation";

// Reached via the recovery email → /auth/callback (which creates the session) → here.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      password: validatePassword(password) || undefined,
      confirm: confirm === password ? undefined : "تکرار رمز عبور یکسان نیست.",
    };
    setErrors(next);
    setFormError("");
    if (next.password || next.confirm) return;
    if (!isSupabaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(error));
    router.replace("/home");
    router.refresh();
  }

  return (
    <>
      <AuthHeader title="تعیین رمز جدید" subtitle="یک رمز عبور جدید برای حساب خود انتخاب کنید." />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <Notice tone="error">
            {formError}{" "}
            <Link href="/auth/forgot-password" className="font-semibold underline">
              درخواست لینک جدید
            </Link>
          </Notice>
        )}
        <Field
          label="رمز عبور جدید"
          type="password"
          ltr
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Field
          label="تکرار رمز عبور جدید"
          type="password"
          ltr
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" loading={loading} className="mt-2">
          ذخیره‌ی رمز جدید
        </Button>
      </form>
    </>
  );
}

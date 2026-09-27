"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { validatePassword } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ResetPasswordForm() {
  const router = useRouter();
  const { m, locale } = useI18n();
  const t = m.auth.reset;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      password: validatePassword(m, locale, password) || undefined,
      confirm: confirm === password ? undefined : m.errors.validation.confirmMismatch,
    };
    setErrors(next);
    setFormError("");
    if (next.password || next.confirm) return;
    if (!isSupabaseConfigured) return setFormError(m.errors.notConfigured);

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(m, error));
    router.replace("/auth/success");
    router.refresh();
  }

  return (
    <>
      <AuthHeader title={t.title} subtitle={t.subtitle} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <Notice tone="error">
            {formError}{" "}
            <Link href="/auth/forgot-password" className="font-semibold underline">
              {t.requestNew}
            </Link>
          </Notice>
        )}
        <Field
          label={m.auth.fields.newPassword}
          type="password"
          ltr
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Field
          label={m.auth.fields.confirmPassword}
          type="password"
          ltr
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" loading={loading} className="mt-2">
          {t.submit}
        </Button>
      </form>
    </>
  );
}

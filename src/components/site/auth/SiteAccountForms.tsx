"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authErrorMessage } from "@/lib/auth/errors";
import { validatePassword } from "@/lib/auth/validation";
import { useI18n } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";
import { SiteField, SiteNotice, SiteSubmit } from "./SiteField";

const CARD = "flex flex-col gap-4 rounded-[26px] border border-white/12 bg-white/[0.04] p-6";

/** Website form for the display name; writes the same profiles row the app's profile screen does. */
export function SiteNameForm({ userId, initialName, email }: { userId: string; initialName: string; email: string }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.site.account;
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    setSaved(false);
    setError(trimmed ? "" : m.errors.validation.nameRequired);
    if (!trimmed) return;
    setLoading(true);
    const supabase = createClient();
    // Same row and metadata the app writes; avatar fields are left untouched.
    const { error: dbError } = await supabase.from("profiles").upsert({ id: userId, name: trimmed });
    if (!dbError) await supabase.auth.updateUser({ data: { name: trimmed } });
    setLoading(false);
    if (dbError) return setError(m.errors.generic);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className={CARD}>
      <h3 className="m-0 text-lg font-black text-white">{t.profileTitle}</h3>
      {saved && <SiteNotice tone="success">{t.saved}</SiteNotice>}
      <SiteField label={t.nameLabel} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <SiteField label={t.emailLabel} type="email" ltr value={email} readOnly disabled />
      <p className="m-0 -mt-2 text-xs text-[#A99FC4]">{t.emailNote}</p>
      <SiteSubmit loading={loading}>{t.save}</SiteSubmit>
    </form>
  );
}

/** Website form for a new password, for the signed-in user. */
export function SitePasswordForm() {
  const { m, locale } = useI18n();
  const t = m.site.account;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(false);
    setFormError("");
    const next = {
      password: validatePassword(m, locale, password) || undefined,
      confirm: confirm === password ? undefined : t.passwordMismatch,
    };
    setErrors(next);
    if (next.password || next.confirm) return;
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setFormError(authErrorMessage(m, error));
    setPassword("");
    setConfirm("");
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className={CARD}>
      <h3 className="m-0 text-lg font-black text-white">{t.passwordTitle}</h3>
      {saved && <SiteNotice tone="success">{t.passwordSaved}</SiteNotice>}
      {formError && <SiteNotice>{formError}</SiteNotice>}
      <SiteField label={t.newPassword} type="password" ltr autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <SiteField label={t.confirmPassword} type="password" ltr autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
      <SiteSubmit loading={loading}>{t.save}</SiteSubmit>
    </form>
  );
}

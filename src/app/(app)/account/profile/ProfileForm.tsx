"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { useI18n } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({ userId, initialName, email }: { userId: string; initialName: string; email: string }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.account.profile;
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    setNameError(trimmed ? "" : m.errors.validation.nameRequired);
    setStatus(null);
    if (!trimmed) return;

    setLoading(true);
    const supabase = createClient();
    // profiles is the source of truth; metadata is kept in sync for places that read the session only.
    const { error } = await supabase.from("profiles").upsert({ id: userId, name: trimmed });
    if (!error) await supabase.auth.updateUser({ data: { name: trimmed } });
    setLoading(false);

    if (error) return setStatus({ tone: "error", text: authErrorMessage(m, error) });
    setStatus({ tone: "success", text: t.saved });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-card bg-surface p-5 shadow-soft md:p-6">
      <div className="flex justify-center">
        <Avatar name={name || initialName} email={email} size={88} />
      </div>
      {status && <Notice tone={status.tone}>{status.text}</Notice>}
      <Field
        label={m.auth.fields.fullName}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">{m.auth.fields.email}</span>
        <p dir="ltr" className="rounded-field bg-cream px-4 py-3.5 text-start text-[15px] text-ink-soft">
          {email}
        </p>
        <p className="text-xs text-ink-faint">{t.emailNote}</p>
      </div>
      <Button type="submit" loading={loading}>
        {t.save}
      </Button>
    </form>
  );
}

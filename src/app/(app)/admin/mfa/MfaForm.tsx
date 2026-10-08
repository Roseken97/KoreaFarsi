"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import type { Messages } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";

type Step =
  | { kind: "loading" }
  | { kind: "enroll"; factorId: string; qr: string; secret: string }
  | { kind: "verify"; factorId: string }
  | { kind: "failed" };

/**
 * First visit: enrolls a TOTP factor and shows its QR code. Later visits: asks for the code.
 * A correct code upgrades the session to aal2, which getAdminUser() requires.
 */
export function MfaForm({ next, t }: { next: string; t: Messages["account"]["adminHub"]["mfa"] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ kind: "loading" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return setStep({ kind: "failed" });
      const verified = data.totp[0];
      if (verified) return setStep({ kind: "verify", factorId: verified.id });
      // Drop half-finished setups so enroll() doesn't clash with them.
      for (const f of data.all) if (f.factor_type === "totp" && f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
      const res = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "KoreaFarsi admin" });
      if (res.error) return setStep({ kind: "failed" });
      setStep({ kind: "enroll", factorId: res.data.id, qr: res.data.totp.qr_code, secret: res.data.totp.secret });
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step.kind !== "enroll" && step.kind !== "verify") return;
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: step.factorId, code: code.trim() });
    if (error) {
      setBusy(false);
      setError(t.invalid);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  if (step.kind === "loading") return <div className="h-40 animate-pulse rounded-card bg-surface" />;
  if (step.kind === "failed") return <Notice tone="error">{t.failed}</Notice>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-card bg-surface p-5 shadow-soft">
      {step.kind === "enroll" ? (
        <>
          <p className="text-sm leading-6 text-ink-soft">{t.enrollIntro}</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- Supabase returns the QR as an SVG data URL */}
          <img src={step.qr} alt="" width={200} height={200} className="mx-auto rounded-field bg-white p-2" />
          <div className="text-xs leading-5 text-ink-soft">
            {t.manual}
            <code dir="ltr" className="mt-1 block break-all rounded-field bg-blush-soft px-3 py-2 font-mono text-[13px] text-ink select-all">
              {step.secret}
            </code>
          </div>
        </>
      ) : (
        <p className="text-sm leading-6 text-ink-soft">{t.verifyIntro}</p>
      )}
      <Field
        label={t.code}
        ltr
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        error={error || undefined}
      />
      <Button type="submit" loading={busy} disabled={code.length !== 6}>
        {busy ? t.working : t.submit}
      </Button>
    </form>
  );
}

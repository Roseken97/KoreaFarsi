"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { addManualBooking, adminSlots, login, type LoginState, type ManualState, type SaveState } from "@/app/settings/admin/actions";
import { faTime, minToHHMM } from "@/lib/time";
import { Field, Icon, btnPrimary, inputCls } from "../ui";

export function SubmitButton({ children, className = btnPrimary }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "…" : children}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <Field label="رمز عبور مدیر" error={state.error}>
        <input name="password" type="password" className={inputCls} autoComplete="current-password" autoFocus required />
      </Field>
      <SubmitButton className={`${btnPrimary} w-full`}>ورود</SubmitButton>
    </form>
  );
}

/** Settings form that stays on the page and shows a "saved" confirmation. */
export function SaveForm({
  action,
  children,
}: {
  action: (s: SaveState, f: FormData) => Promise<SaveState>;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {children}
      <div className="sticky bottom-3 flex items-center gap-3 rounded-2xl bg-surface/90 p-2 shadow-lift backdrop-blur">
        <SubmitButton className={`${btnPrimary} flex-1 py-3`}>ذخیره‌ی تغییرات</SubmitButton>
        {state.ok && (
          <span key={state.at} className="animate-rise flex items-center gap-1 px-2 text-sm text-ok">
            <Icon name="check" className="size-4" /> ذخیره شد
          </span>
        )}
        {state.error && <span className="px-2 text-sm text-danger">{state.error}</span>}
      </div>
    </form>
  );
}

type Opt = { id: number; name: string };
type Day = { date: string; label: string };

export function ManualBookingForm({ services, days }: { services: Opt[]; days: Day[] }) {
  const [state, action] = useActionState<ManualState, FormData>(addManualBooking, {});
  const [serviceId, setServiceId] = useState(services[0]?.id ?? 0);
  const [date, setDate] = useState(days[0]?.date ?? "");
  const [slots, setSlots] = useState<number[] | null>(null);
  const [, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!serviceId || !date) return;
    start(async () => {
      setSlots(null);
      setSlots(await adminSlots(serviceId, date));
    });
  }, [serviceId, date, state]);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-3 sm:grid-cols-2">
      <Field label="خدمت">
        <select name="serviceId" className={inputCls} value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="روز">
        <select name="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)}>
          {days.map((d) => (
            <option key={d.date} value={d.date}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="ساعت">
        <select name="start" className={inputCls} disabled={!slots?.length} required>
          {slots === null ? (
            <option>در حال بارگذاری…</option>
          ) : slots.length === 0 ? (
            <option>ساعت خالی ندارد</option>
          ) : (
            slots.map((t) => (
              <option key={t} value={minToHHMM(t)}>
                {faTime(t)}
              </option>
            ))
          )}
        </select>
      </Field>
      <Field label="نام مشتری">
        <input name="name" className={inputCls} required />
      </Field>
      <Field label="موبایل">
        <input name="phone" className={`${inputCls} text-left`} dir="ltr" inputMode="tel" required />
      </Field>
      <Field label="یادداشت" hint="اختیاری">
        <input name="note" className={inputCls} />
      </Field>
      <div className="flex items-center gap-3 sm:col-span-2">
        <SubmitButton className={`${btnPrimary} py-3`}>ثبت نوبت</SubmitButton>
        {state.ok && <span className="text-sm text-ok">نوبت ثبت شد.</span>}
        {state.error && <span className="text-sm text-danger">{state.error}</span>}
      </div>
    </form>
  );
}

export function ConfirmButton({ children, message, className }: { children: ReactNode; message: string; className: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { book, getDays, getSlots, type DayOption } from "@/app/actions";
import { depositAmount, durationFa, faDigits, faTime, toman } from "@/lib/time";
import { Field, Icon, SectionTitle, btnPrimary, inputCls } from "./ui";

type Service = { id: number; name: string; description: string; duration: number; price: number };
type Step = 1 | 2 | 3;

const REMEMBER_KEY = "lash:customer";

function readSaved(): { name: string; phone: string } {
  if (typeof window === "undefined") return { name: "", phone: "" };
  try {
    const v = JSON.parse(localStorage.getItem(REMEMBER_KEY) || "null");
    return { name: String(v?.name ?? ""), phone: String(v?.phone ?? "") };
  } catch {
    return { name: "", phone: "" };
  }
}

/**
 * One-page booking flow: service → day & time → details & pay.
 * Finished steps collapse into a one-line summary with a "change" link, so the
 * customer always sees what they've picked and never loses their place.
 */
export function BookingWizard({
  services,
  depositPercent,
  holdMinutes,
  policy,
}: {
  services: Service[];
  depositPercent: number;
  holdMinutes: number;
  policy: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [days, setDays] = useState<DayOption[] | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<number[] | null>(null);
  const [start, setStart] = useState<number | null>(null);
  // Returning customers: prefill from this device. The form only renders after
  // client-side steps, so reading localStorage here can't cause a hydration mismatch.
  const [name, setName] = useState(() => readSaved().name);
  const [phone, setPhone] = useState(() => readSaved().phone);
  const [note, setNote] = useState("");
  const [error, setError] = useState<{ field?: "name" | "phone"; message: string } | null>(null);
  const [loading, startLoading] = useTransition();
  const [paying, startPaying] = useTransition();
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step > 1) stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function pickService(s: Service) {
    setService(s);
    setStart(null);
    setSlots(null);
    setDays(null);
    setStep(2);
    startLoading(async () => {
      const d = await getDays(s.id);
      setDays(d);
      const first = d.find((x) => x.count > 0);
      setDate(first?.date ?? null);
      setSlots(first ? await getSlots(s.id, first.date) : []);
    });
  }

  function pickDate(d: string) {
    if (!service) return;
    setDate(d);
    setStart(null);
    setSlots(null);
    startLoading(async () => setSlots(await getSlots(service.id, d)));
  }

  function pickTime(t: number) {
    setStart(t);
    setError(null);
    setStep(3);
  }

  function pay() {
    if (!service || !date || start === null) return;
    setError(null);
    startPaying(async () => {
      const r = await book({ serviceId: service.id, date, start, name, phone, note });
      if (r.ok) {
        try {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify({ name, phone }));
        } catch {}
        window.location.href = r.url;
        return;
      }
      setError({ field: r.field, message: r.message });
      if (r.slotGone) {
        // Someone else took it: send them back to the times, refreshed.
        setStart(null);
        setStep(2);
        const [d, s] = await Promise.all([getDays(service.id), getSlots(service.id, date)]);
        setDays(d);
        setSlots(s);
      }
    });
  }

  const deposit = service ? depositAmount(service.price, depositPercent) : 0;
  const selectedDay = days?.find((d) => d.date === date);

  return (
    <div className="space-y-4">
      {/* ── Step 1: service ───────────────────────────── */}
      {step === 1 ? (
        <section className="animate-rise">
          <SectionTitle step={1}>چه خدمتی می‌خواهید؟</SectionTitle>
          <div className="space-y-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => pickService(s)}
                className="group flex w-full items-center gap-4 rounded-card bg-surface p-4 text-start shadow-soft ring-1 ring-transparent transition hover:shadow-lift hover:ring-rose/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{s.name}</div>
                  {s.description && <p className="mt-1 text-sm leading-6 text-ink-soft">{s.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="inline-flex items-center gap-1 text-ink-soft">
                      <Icon name="clock" className="size-4" />
                      {durationFa(s.duration)}
                    </span>
                    <span className="font-bold text-rose-deep">{toman(s.price)}</span>
                  </div>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-mist text-rose-deep transition group-hover:bg-rose group-hover:text-white">
                  <Icon name="chevron-left" className="size-4" />
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <Summary label="خدمت" value={service?.name} sub={service && `${durationFa(service.duration)} · ${toman(service.price)}`} onEdit={() => setStep(1)} />
      )}

      <div ref={stepRef} className="scroll-mt-4" />

      {/* ── Step 2: day & time ────────────────────────── */}
      {step === 2 && (
        <section className="animate-rise">
          <SectionTitle step={2}>چه روز و ساعتی؟</SectionTitle>

          {error && <Alert>{error.message}</Alert>}

          <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-2">
            {days === null
              ? Array.from({ length: 7 }, (_, i) => <div key={i} className="h-[5.5rem] w-16 shrink-0 animate-pulse rounded-2xl bg-surface" />)
              : days.map((d) => {
                  const active = d.date === date;
                  const off = d.count === 0;
                  return (
                    <button
                      key={d.date}
                      disabled={off}
                      onClick={() => pickDate(d.date)}
                      aria-pressed={active}
                      className={`flex h-[5.5rem] w-16 shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-2xl text-center transition ${
                        active
                          ? "bg-rose-deep text-white shadow-lift"
                          : off
                            ? "bg-transparent text-ink-faint/70 ring-1 ring-line"
                            : "bg-surface text-ink shadow-soft hover:ring-1 hover:ring-rose/40"
                      }`}
                    >
                      <span className={`text-[11px] ${active ? "text-white/80" : "text-ink-soft"}`}>{d.weekday}</span>
                      <span className="text-xl font-extrabold leading-none">{d.day}</span>
                      <span className={`text-[11px] ${active ? "text-white/80" : off ? "" : "text-ink-soft"}`}>{off ? "پر / تعطیل" : d.month}</span>
                    </button>
                  );
                })}
          </div>

          <div className="mt-4 rounded-card bg-surface p-4 shadow-soft">
            {days !== null && !days.some((d) => d.count > 0) ? (
              <p className="py-6 text-center text-sm text-ink-soft">فعلاً نوبت خالی برای این خدمت نداریم. لطفاً چند روز دیگر سر بزنید.</p>
            ) : slots === null || loading ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-rose-mist" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-soft">این روز ساعت خالی ندارد؛ روز دیگری را انتخاب کنید.</p>
            ) : (
              <>
                <p className="mb-3 text-xs text-ink-faint">
                  {selectedDay && `${selectedDay.weekday} ${selectedDay.day} ${selectedDay.month}`} · {faDigits(slots.length)} ساعت خالی
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => pickTime(t)}
                      className={`h-11 rounded-xl text-sm font-bold transition ${
                        t === start ? "bg-rose-deep text-white" : "bg-rose-mist text-rose-deep hover:bg-rose hover:text-white"
                      }`}
                    >
                      {faTime(t)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
      {step === 3 && selectedDay && start !== null && (
        <Summary label="زمان" value={`${selectedDay.weekday} ${selectedDay.day} ${selectedDay.month}`} sub={`ساعت ${faTime(start)}`} onEdit={() => setStep(2)} />
      )}

      {/* ── Step 3: details & pay ─────────────────────── */}
      {step === 3 && service && start !== null && (
        <section className="animate-rise">
          <SectionTitle step={3}>اطلاعات شما</SectionTitle>
          <form
            className="space-y-4 rounded-card bg-surface p-5 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              pay();
            }}
          >
            <Field label="نام و نام خانوادگی" error={error?.field === "name" ? error.message : undefined}>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} />
            </Field>
            <Field label="شماره موبایل" hint="برای هماهنگی و یادآوری" error={error?.field === "phone" ? error.message : undefined}>
              <input
                className={`${inputCls} text-left`}
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                placeholder="09xx xxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Field>
            <Field label="توضیحات" hint="اختیاری">
              <textarea
                className={`${inputCls} min-h-20 resize-y`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثلاً حساسیت به چسب، مدل مورد علاقه…"
              />
            </Field>

            <div className="space-y-2 rounded-2xl bg-rose-mist p-4 text-sm">
              <Row label="هزینه‌ی کل خدمت" value={toman(service.price)} />
              {depositPercent < 100 && <Row label="پرداخت در سالن" value={toman(service.price - deposit)} muted />}
              <div className="border-t border-rose-soft pt-2">
                <Row label={depositPercent < 100 ? "بیعانه (پرداخت الان)" : "مبلغ قابل پرداخت"} value={toman(deposit)} strong />
              </div>
            </div>

            {error && !error.field && <Alert>{error.message}</Alert>}

            <button type="submit" disabled={paying} className={`${btnPrimary} w-full`}>
              {paying ? "در حال انتقال به درگاه…" : `پرداخت ${toman(deposit)} و ثبت نوبت`}
            </button>
            <p className="text-center text-xs leading-6 text-ink-faint">
              این ساعت تا {faDigits(holdMinutes)} دقیقه برای شما نگه داشته می‌شود و پس از پرداخت قطعی است.
            </p>
            {policy && (
              <details className="text-xs leading-6 text-ink-soft">
                <summary className="cursor-pointer select-none font-medium text-ink-soft">قوانین رزرو</summary>
                <p className="mt-2 whitespace-pre-line">{policy}</p>
              </details>
            )}
          </form>
        </section>
      )}
    </div>
  );
}

function Summary({ label, value, sub, onEdit }: { label: string; value?: string | null; sub?: string | null; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface/70 px-4 py-3 ring-1 ring-line">
      <span className="grid size-6 place-items-center rounded-full bg-ok-soft text-ok">
        <Icon name="check" className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-ink-faint">{label}</div>
        <div className="truncate text-sm font-bold">
          {value} {sub && <span className="font-normal text-ink-soft">· {sub}</span>}
        </div>
      </div>
      <button onClick={onEdit} className="text-sm font-medium text-rose-deep hover:underline">
        تغییر
      </button>
    </div>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-ink-soft" : ""} ${strong ? "text-base font-extrabold text-rose-deep" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="mb-3 flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
      <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

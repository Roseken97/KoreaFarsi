import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { Card, Icon, Shell, StatusBadge, TopBar, btnGhost, btnPrimary } from "@/components/ui";
import { getBookingByCode, getSettings } from "@/lib/store";
import { durationFa, faDigits, faTime, jalaliLong, toman } from "@/lib/time";

export const metadata = { title: "نوبت شما" };

export default async function BookingPage({ params }: PageProps<"/booking/[code]">) {
  const { code } = await params;
  const b = getBookingByCode(code.toUpperCase());
  if (!b) notFound();
  const s = getSettings();

  const hero = {
    confirmed: { icon: "check", tone: "bg-ok-soft text-ok", title: "نوبت شما قطعی شد", text: "منتظر دیدارتان هستیم." },
    completed: { icon: "sparkle", tone: "bg-rose-soft text-rose-deep", title: "ممنون از حضورتان", text: "امیدواریم از نتیجه راضی باشید." },
    pending: {
      icon: "clock",
      tone: "bg-warn-soft text-warn",
      title: "در انتظار پرداخت",
      text: "پرداخت هنوز کامل نشده است. اگر پرداخت کرده‌اید چند لحظه بعد صفحه را تازه کنید.",
    },
    expired: { icon: "x", tone: "bg-danger-soft text-danger", title: "پرداخت انجام نشد", text: "نوبت ثبت نشد و مبلغی از حساب شما کسر نشده است. اگر کسر شده باشد، طبق قوانین بانکی ظرف ۷۲ ساعت برمی‌گردد." },
    cancelled: { icon: "x", tone: "bg-line text-ink-soft", title: "این نوبت لغو شده است", text: "برای هماهنگی با سالن تماس بگیرید." },
    needs_refund: {
      icon: "alert",
      tone: "bg-danger-soft text-danger",
      title: "پرداخت انجام شد، اما این ساعت پر شده بود",
      text: "زمان رزرو شما منقضی شده بود و ساعت به شخص دیگری رسید. سالن به‌زودی برای تعیین زمان جدید یا بازگشت وجه با شما تماس می‌گیرد.",
    },
  }[b.status] as { icon: "check"; tone: string; title: string; text: string };

  const active = b.status === "confirmed" || b.status === "completed" || b.status === "needs_refund";

  return (
    <Shell>
      <TopBar title="نوبت شما" back="/" />

      <div className="animate-rise space-y-4">
        <Card className="text-center">
          <div className={`mx-auto mb-3 grid size-16 place-items-center rounded-full ${hero.tone}`}>
            <Icon name={hero.icon} className="size-8" />
          </div>
          <h1 className="text-xl font-extrabold">{hero.title}</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-ink-soft">{hero.text}</p>

          {active && (
            <div className="mt-5 rounded-2xl bg-rose-mist p-4">
              <p className="text-xs text-ink-soft">کد پیگیری نوبت</p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span dir="ltr" className="font-mono text-2xl font-bold tracking-[0.2em] text-rose-deep">
                  {b.code}
                </span>
                <CopyButton text={b.code} />
              </div>
              <p className="mt-1 text-[11px] text-ink-faint">این کد را نگه دارید؛ برای پیگیری لازم است.</p>
            </div>
          )}
        </Card>

        <Card className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold">{b.service_name}</span>
            <StatusBadge status={b.status} />
          </div>
          <Line icon="calendar" label="تاریخ" value={jalaliLong(b.date)} />
          <Line icon="clock" label="ساعت" value={`${faTime(b.start_min)} تا ${faTime(b.end_min)} (${durationFa(b.end_min - b.start_min)})`} />
          <Line icon="sparkle" label="به نام" value={b.customer_name} />
          {b.amount > 0 && (b.status === "confirmed" || b.status === "completed" || b.status === "needs_refund") && (
            <>
              <Line icon="check" label="پرداخت شده" value={toman(b.amount)} />
              {b.price > b.amount && <Line icon="lock" label="پرداخت در سالن" value={toman(b.price - b.amount)} />}
              {b.ref_id && <Line icon="search" label="شماره پیگیری بانک" value={faDigits(b.ref_id)} />}
            </>
          )}
          {s.address && <Line icon="pin" label="آدرس" value={s.address} />}
        </Card>

        <div className="grid gap-2">
          {b.status === "confirmed" && (
            <a href={`/booking/${b.code}/ics`} className={btnGhost}>
              <Icon name="calendar" className="size-4" />
              افزودن به تقویم گوشی
            </a>
          )}
          {s.phone && (
            <a href={`tel:${s.phone}`} className={btnGhost}>
              <Icon name="phone" className="size-4" />
              تماس با سالن
            </a>
          )}
          {!active && (
            <Link href="/" className={btnPrimary}>
              رزرو دوباره
            </Link>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Line({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} className="mt-0.5 size-4 shrink-0 text-rose" />
      <span className="w-28 shrink-0 text-ink-soft">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

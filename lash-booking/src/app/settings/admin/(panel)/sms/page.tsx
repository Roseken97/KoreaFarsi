import { SaveForm, SmsTestForm, TemplateField } from "@/components/admin/forms";
import { Card, Icon, inputCls } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { PLACEHOLDERS } from "@/lib/notify";
import { smsProvider } from "@/lib/sms";
import { getSettings, recentSms } from "@/lib/store";
import { addDays, faTime, jalaliLong, tehranNow } from "@/lib/time";
import { saveSms } from "../../actions";

export const metadata = { title: "پیامک" };

const KIND_LABEL: Record<string, string> = {
  confirm: "تأیید نوبت",
  reminder: "یادآوری",
  cancel: "لغو",
  owner: "به مدیر",
  test: "آزمایشی",
};

const PROVIDER_LABEL = { mock: "آزمایشی (ارسال واقعی ندارد)", kavenegar: "کاوه‌نگار", smsir: "SMS.ir" };

export default async function SmsAdmin() {
  await requireAdmin();
  const s = getSettings();
  const log = recentSms(40);
  const provider = smsProvider();

  const sample = {
    name: "سارا",
    service: "کاشت مژه کلاسیک",
    date: jalaliLong(addDays(tehranNow().date, 1)),
    time: faTime(600),
    code: "K7M2QX9P",
    salon: s.businessName,
    phone: "09121234567",
    address: s.address,
  };

  return (
    <div className="animate-rise grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <SaveForm action={saveSms}>
        {provider === "mock" && (
          <div className="flex items-start gap-2 rounded-xl bg-warn-soft px-4 py-3 text-sm leading-6 text-warn">
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
            <span>
              سرویس پیامک در حالت <b>آزمایشی</b> است: پیامک‌ها واقعاً ارسال نمی‌شوند و فقط در گزارش همین صفحه ثبت می‌شوند. برای ارسال واقعی، کاوه‌نگار یا
              SMS.ir را روی سرور تنظیم کنید (راهنما در README).
            </span>
          </div>
        )}

        <Card className="space-y-1">
          <h2 className="mb-3 font-bold">چه پیامک‌هایی ارسال شود؟</h2>
          <Toggle name="confirm" checked={s.sms.confirm} title="تأیید نوبت" desc="بلافاصله بعد از پرداخت یا ثبت دستی، برای مشتری" />
          <Toggle name="reminder" checked={s.sms.reminder} title="یادآوری نوبت" desc="قبل از نوبت؛ بین ۲۲ شب تا ۸ صبح ارسال نمی‌شود و تا صبح صبر می‌کند">
            <div className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <input name="reminderHours" type="number" min={1} max={72} defaultValue={s.sms.reminderHours} className={`${inputCls} w-20 py-2 text-center`} />
              ساعت قبل از نوبت
            </div>
          </Toggle>
          <Toggle name="cancel" checked={s.sms.cancel} title="اطلاع لغو" desc="وقتی شما نوبتی را از پنل لغو می‌کنید" />
          <Toggle name="owner" checked={s.sms.owner} title="خبر نوبت جدید برای خودم" desc="هر بار که مشتری آنلاین رزرو و پرداخت می‌کند">
            <div className="mt-2 max-w-60">
              <input name="ownerMobile" defaultValue={s.sms.ownerMobile} placeholder="موبایل مدیر" className={`${inputCls} py-2 text-left`} dir="ltr" inputMode="tel" />
            </div>
          </Toggle>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="font-bold">متن پیامک‌ها</h2>
            <p className="mt-1 text-xs leading-6 text-ink-faint">
              این عبارت‌ها خودکار جایگزین می‌شوند:{" "}
              {PLACEHOLDERS.map((p) => (
                <code key={p} dir="ltr" className="mx-0.5 rounded bg-rose-mist px-1.5 py-0.5 text-rose-deep">
                  {p}
                </code>
              ))}
            </p>
          </div>
          <TemplateField name="tpl_confirm" label="تأیید نوبت" defaultValue={s.sms.templates.confirm} sample={sample} />
          <TemplateField name="tpl_reminder" label="یادآوری" defaultValue={s.sms.templates.reminder} sample={sample} />
          <TemplateField name="tpl_cancel" label="لغو" defaultValue={s.sms.templates.cancel} sample={sample} />
          <TemplateField name="tpl_owner" label="خبر نوبت جدید (برای مدیر)" defaultValue={s.sms.templates.owner} sample={sample} />
        </Card>
      </SaveForm>

      <div className="space-y-6">
        <Card>
          <p className="mb-4 text-sm text-ink-soft">
            سرویس فعلی: <b className="text-ink">{PROVIDER_LABEL[provider]}</b>
          </p>
          <SmsTestForm defaultTo={s.sms.ownerMobile} />
        </Card>

        <Card className="p-0">
          <h2 className="p-5 pb-3 font-bold">گزارش ارسال</h2>
          {log.length === 0 ? (
            <p className="px-5 pb-6 text-sm text-ink-faint">هنوز پیامکی ارسال نشده.</p>
          ) : (
            <ul className="max-h-[36rem] divide-y divide-line overflow-y-auto">
              {log.map((l) => (
                <li key={l.id} className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${l.ok ? "bg-ok" : "bg-danger"}`} />
                    <span className="font-medium">{KIND_LABEL[l.kind] ?? l.kind}</span>
                    <span dir="ltr" className="text-ink-soft">
                      {l.phone}
                    </span>
                    <span className="ms-auto text-[11px] text-ink-faint">{utcToTehran(l.created_at)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs leading-5 text-ink-soft">{l.message}</p>
                  {l.error && (
                    <p className="mt-1 text-xs text-danger" dir="auto">
                      {l.error}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

/** SQLite datetime('now') is UTC "YYYY-MM-DD HH:MM:SS" → Jalali Tehran time, e.g. "۹/۷ ۱۴:۰۵". */
const logTimeFmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
function utcToTehran(sqlUtc: string): string {
  return logTimeFmt.format(new Date(`${sqlUtc.replace(" ", "T")}Z`));
}

function Toggle({ name, checked, title, desc, children }: { name: string; checked: boolean; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl p-2 transition hover:bg-rose-mist/60">
      <input id={`t-${name}`} name={name} type="checkbox" defaultChecked={checked} className="mt-1 size-5 shrink-0 accent-rose-deep" />
      <div className="flex-1">
        <label htmlFor={`t-${name}`} className="block cursor-pointer font-medium">
          {title}
        </label>
        <p className="text-xs leading-6 text-ink-faint">{desc}</p>
        {children}
      </div>
    </div>
  );
}

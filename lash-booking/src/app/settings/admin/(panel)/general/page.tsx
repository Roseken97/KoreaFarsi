import { SaveForm } from "@/components/admin/forms";
import { Card, Field, inputCls } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { providerName } from "@/lib/payment";
import { getSettings } from "@/lib/store";
import { saveGeneral } from "../../actions";

export const metadata = { title: "تنظیمات سالن" };

export default async function GeneralAdmin() {
  await requireAdmin();
  const s = getSettings();

  return (
    <div className="animate-rise max-w-2xl">
      <SaveForm action={saveGeneral}>
        <Card className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-bold sm:col-span-2">معرفی سالن</h2>
          <Field label="نام سالن">
            <input name="businessName" defaultValue={s.businessName} className={inputCls} required />
          </Field>
          <Field label="نام آرتیست" hint="اختیاری">
            <input name="artistName" defaultValue={s.artistName} className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="جمله‌ی معرفی">
              <input name="tagline" defaultValue={s.tagline} className={inputCls} />
            </Field>
          </div>
          <Field label="تلفن تماس">
            <input name="phone" defaultValue={s.phone} className={inputCls} dir="ltr" inputMode="tel" />
          </Field>
          <Field label="اینستاگرام" hint="مثلاً @lash.studio">
            <input name="instagram" defaultValue={s.instagram} className={inputCls} dir="ltr" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="آدرس">
              <input name="address" defaultValue={s.address} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-bold sm:col-span-2">پرداخت</h2>
          <Field label="درصد بیعانه‌ی آنلاین" hint="۱۰۰ = پرداخت کامل">
            <input name="depositPercent" type="number" min={10} max={100} defaultValue={s.depositPercent} className={inputCls} />
          </Field>
          <Field label="مدت نگه‌داشتن ساعت تا پرداخت" hint="دقیقه">
            <input name="holdMinutes" type="number" min={5} max={60} defaultValue={s.holdMinutes} className={inputCls} />
          </Field>
          <p className="text-xs leading-6 text-ink-faint sm:col-span-2">
            درگاه فعلی: <b>{providerName() === "zarinpal" ? "زرین‌پال" : "آزمایشی (بدون پول واقعی)"}</b> — تغییر درگاه از طریق متغیرهای محیطی سرور انجام می‌شود.
          </p>
        </Card>

        <Card>
          <Field label="قوانین رزرو" hint="به مشتری قبل از پرداخت نمایش داده می‌شود">
            <textarea name="policy" defaultValue={s.policy} rows={5} className={`${inputCls} leading-7`} />
          </Field>
        </Card>
      </SaveForm>
    </div>
  );
}

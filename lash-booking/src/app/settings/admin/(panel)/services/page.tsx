import { ConfirmButton, SubmitButton } from "@/components/admin/forms";
import { Card, Field, Icon, btnPrimary, inputCls } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { listServices, type Service } from "@/lib/store";
import { removeService, saveService } from "../../actions";

export const metadata = { title: "خدمات" };

export default async function ServicesAdmin() {
  await requireAdmin();
  const services = listServices();

  return (
    <div className="animate-rise space-y-4">
      <p className="text-sm leading-7 text-ink-soft">
        قیمت‌ها به <b>تومان</b> و مدت‌ها به <b>دقیقه</b> است. خدمتی را که موقتاً ارائه نمی‌دهید «غیرفعال» کنید تا از فرم رزرو حذف شود ولی سابقه‌اش بماند.
      </p>

      {services.map((s) => (
        <ServiceForm key={s.id} s={s} />
      ))}

      <details className="rounded-card bg-surface shadow-soft">
        <summary className="flex cursor-pointer select-none items-center gap-2 p-5 font-bold text-rose-deep">
          <Icon name="plus" className="size-5" />
          افزودن خدمت جدید
        </summary>
        <div className="border-t border-line p-5">
          <ServiceFields />
        </div>
      </details>
    </div>
  );
}

function ServiceForm({ s }: { s: Service }) {
  return (
    <Card className={s.active ? "" : "opacity-70"}>
      <ServiceFields s={s} />
    </Card>
  );
}

function ServiceFields({ s }: { s?: Service }) {
  return (
    <div>
      <form action={saveService} className="grid gap-3 md:grid-cols-6">
        {s && <input type="hidden" name="id" value={s.id} />}
        <div className="md:col-span-3">
          <Field label="نام خدمت">
            <input name="name" defaultValue={s?.name} className={inputCls} required />
          </Field>
        </div>
        <div className="md:col-span-1">
          <Field label="مدت (دقیقه)">
            <input name="duration" type="number" min={10} max={600} step={5} defaultValue={s?.duration_min ?? 60} className={inputCls} required />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="قیمت (تومان)">
            <input name="price" inputMode="numeric" defaultValue={s?.price ?? ""} className={inputCls} dir="ltr" required />
          </Field>
        </div>
        <div className="md:col-span-4">
          <Field label="توضیح کوتاه" hint="اختیاری">
            <input name="description" defaultValue={s?.description} className={inputCls} />
          </Field>
        </div>
        <div className="md:col-span-1">
          <Field label="ترتیب نمایش">
            <input name="sort" type="number" min={0} max={999} defaultValue={s?.sort ?? 0} className={inputCls} />
          </Field>
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm md:col-span-1">
          <input name="active" type="checkbox" defaultChecked={s ? !!s.active : true} className="size-5 accent-rose-deep" />
          فعال
        </label>
        <div className="flex items-center gap-2 md:col-span-6">
          <SubmitButton className={`${btnPrimary} py-2.5 text-sm`}>{s ? "ذخیره" : "افزودن"}</SubmitButton>
        </div>
      </form>
      {s && (
        <form action={removeService} className="mt-2 flex justify-end">
          <input type="hidden" name="id" value={s.id} />
          <ConfirmButton message={`«${s.name}» برای همیشه حذف شود؟ (نوبت‌های قبلی آن باقی می‌مانند)`} className="text-xs text-ink-faint hover:text-danger">
            حذف خدمت
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}

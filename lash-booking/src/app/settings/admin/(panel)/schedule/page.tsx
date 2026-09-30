import { SaveForm, SubmitButton } from "@/components/admin/forms";
import { Card, Field, inputCls } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings, listClosedDays } from "@/lib/store";
import { WEEKDAYS_FA, addDays, faDigits, jalaliParts, tehranNow, weekdayIndex } from "@/lib/time";
import { saveSchedule, toggleClosedDay } from "../../actions";

export const metadata = { title: "ساعات کاری" };

export default async function ScheduleAdmin() {
  await requireAdmin();
  const s = getSettings();
  const closed = new Set(listClosedDays().map((d) => d.date));
  const today = tehranNow().date;
  const calendar = Array.from({ length: 42 }, (_, i) => addDays(today, i));

  return (
    <div className="animate-rise grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <SaveForm action={saveSchedule}>
        <Card>
          <h2 className="mb-4 font-bold">برنامه‌ی هفتگی</h2>
          <div className="divide-y divide-line">
            {s.week.map((d, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 py-3">
                <label className="flex w-28 items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name={`on${i}`} defaultChecked={d.enabled} className="size-5 accent-rose-deep" />
                  {WEEKDAYS_FA[i]}
                </label>
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  از
                  <input type="time" name={`open${i}`} defaultValue={d.open} className={`${inputCls} w-28 py-2`} dir="ltr" />
                  تا
                  <input type="time" name={`close${i}`} defaultValue={d.close} className={`${inputCls} w-28 py-2`} dir="ltr" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="فاصله‌ی ساعت‌های پیشنهادی">
            <select name="slotStep" defaultValue={s.slotStep} className={inputCls}>
              {[15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>
                  هر {faDigits(m)} دقیقه
                </option>
              ))}
            </select>
          </Field>
          <Field label="زمان استراحت بین نوبت‌ها" hint="دقیقه">
            <input name="bufferMin" type="number" min={0} max={120} defaultValue={s.bufferMin} className={inputCls} />
          </Field>
          <Field label="رزرو تا چند روز آینده" hint="روز">
            <input name="horizonDays" type="number" min={1} max={90} defaultValue={s.horizonDays} className={inputCls} />
          </Field>
          <Field label="حداقل فاصله تا نوبت" hint="ساعت">
            <input name="minNoticeHours" type="number" min={0} max={72} defaultValue={s.minNoticeMin / 60} className={inputCls} />
          </Field>
        </Card>
      </SaveForm>

      <Card className="h-fit">
        <h2 className="font-bold">روزهای تعطیل</h2>
        <p className="mb-4 mt-1 text-xs leading-6 text-ink-faint">روی هر روز بزنید تا تعطیل یا دوباره باز شود. (۶ هفته‌ی آینده)</p>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-ink-faint">
          {WEEKDAYS_FA.map((w) => (
            <span key={w}>{w.slice(0, 1)}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: weekdayIndex(today) }, (_, i) => (
            <span key={`pad${i}`} />
          ))}
          {calendar.map((date) => {
            const isClosed = closed.has(date);
            const weeklyOff = !s.week[weekdayIndex(date)].enabled;
            const p = jalaliParts(date);
            return (
              <form key={date} action={toggleClosedDay}>
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="closed" value={isClosed ? "1" : "0"} />
                <SubmitButton
                  className={`flex aspect-square w-full flex-col items-center justify-center rounded-lg text-xs transition ${
                    isClosed
                      ? "bg-danger text-white"
                      : weeklyOff
                        ? "bg-line/60 text-ink-faint"
                        : "bg-rose-mist text-ink hover:bg-rose-soft"
                  } ${date === today ? "ring-2 ring-rose-deep" : ""}`}
                >
                  <span className="text-sm font-bold">{p.day}</span>
                  {(p.day === "۱" || date === today) && <span className="text-[9px] leading-none opacity-80">{p.month}</span>}
                </SubmitButton>
              </form>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-ink-soft">
          <Legend cls="bg-rose-mist" label="باز" />
          <Legend cls="bg-danger" label="تعطیل" />
          <Legend cls="bg-line/60" label="تعطیل هفتگی" />
        </div>
      </Card>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-3 rounded ${cls}`} />
      {label}
    </span>
  );
}

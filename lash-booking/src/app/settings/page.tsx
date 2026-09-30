import Link from "next/link";
import { connection } from "next/server";
import { TrackForm } from "@/components/TrackForm";
import { Card, Icon, Shell, TopBar } from "@/components/ui";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/store";

export const metadata = { title: "تنظیمات" };

export default async function SettingsPage() {
  await connection();
  const s = getSettings();
  const admin = await isAdmin();

  return (
    <Shell>
      <TopBar title="تنظیمات" back="/" />

      <div className="animate-rise space-y-6">
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold text-ink-soft">پیگیری نوبت</h2>
          <Card>
            <TrackForm />
          </Card>
        </section>

        {(s.phone || s.address || s.instagram) && (
          <section>
            <h2 className="mb-2 px-1 text-sm font-bold text-ink-soft">ارتباط با سالن</h2>
            <Card className="divide-y divide-line p-0">
              {s.phone && <Row href={`tel:${s.phone}`} icon="phone" label="تماس" value={s.phone} ltr />}
              {s.instagram && (
                <Row href={`https://instagram.com/${s.instagram.replace(/^@/, "")}`} icon="instagram" label="اینستاگرام" value={s.instagram} ltr />
              )}
              {s.address && <Row icon="pin" label="آدرس" value={s.address} />}
            </Card>
          </section>
        )}

        {s.policy && (
          <section>
            <h2 className="mb-2 px-1 text-sm font-bold text-ink-soft">قوانین رزرو</h2>
            <Card className="whitespace-pre-line text-sm leading-7 text-ink-soft">{s.policy}</Card>
          </section>
        )}

        <section>
          <h2 className="mb-2 px-1 text-sm font-bold text-ink-soft">مدیریت</h2>
          <Link href="/settings/admin" className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-soft transition hover:shadow-lift">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-white">
              <Icon name="lock" className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-bold">پنل مدیریت</span>
              <span className="block text-xs text-ink-faint">{admin ? "وارد شده‌اید" : "مخصوص مدیر سالن"}</span>
            </span>
            <Icon name="chevron-left" className="size-4 text-ink-faint" />
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function Row({ icon, label, value, href, ltr }: { icon: "phone" | "pin" | "instagram"; label: string; value: string; href?: string; ltr?: boolean }) {
  const body = (
    <>
      <Icon name={icon} className="size-5 shrink-0 text-rose" />
      <span className="w-20 shrink-0 text-sm text-ink-soft">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className={`flex-1 text-sm font-medium ${ltr ? "text-right" : ""}`}>
        {value}
      </span>
    </>
  );
  const cls = "flex items-center gap-3 px-4 py-3.5";
  return href ? (
    <a href={href} className={`${cls} transition hover:bg-rose-mist`} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

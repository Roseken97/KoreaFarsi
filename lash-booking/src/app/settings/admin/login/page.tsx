import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/forms";
import { Card, Icon, Shell, TopBar } from "@/components/ui";
import { adminPassword, isAdmin } from "@/lib/auth";

export const metadata = { title: "ورود مدیر" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/settings/admin");
  const disabled = adminPassword() === null;

  return (
    <Shell>
      <TopBar title="پنل مدیریت" back="/settings" />
      <Card className="animate-rise mt-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-white">
            <Icon name="lock" className="size-6" />
          </span>
          <div>
            <h1 className="font-bold">ورود مدیر سالن</h1>
            <p className="text-xs text-ink-faint">مدیریت نوبت‌ها، خدمات و ساعات کاری</p>
          </div>
        </div>
        {disabled ? (
          <p className="rounded-xl bg-warn-soft p-4 text-sm leading-7 text-warn">
            پنل مدیریت غیرفعال است. متغیر محیطی <code dir="ltr">ADMIN_PASSWORD</code> را روی سرور تنظیم کنید.
          </p>
        ) : (
          <LoginForm />
        )}
        {process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD && (
          <p className="mt-4 text-center text-xs text-ink-faint">
            حالت توسعه: رمز پیش‌فرض <code dir="ltr">admin</code>
          </p>
        )}
      </Card>
    </Shell>
  );
}

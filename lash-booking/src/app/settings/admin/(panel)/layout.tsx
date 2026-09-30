import { AdminTabs } from "@/components/admin/AdminTabs";
import { Icon, Shell, TopBar } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { providerName } from "@/lib/payment";
import { logout } from "../actions";

export default async function AdminLayout({ children }: LayoutProps<"/settings/admin">) {
  await requireAdmin();
  return (
    <Shell wide>
      <TopBar
        title="پنل مدیریت"
        back="/settings"
        right={
          <form action={logout}>
            <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-soft transition hover:bg-surface hover:text-danger">
              <Icon name="logout" className="size-4" />
              خروج
            </button>
          </form>
        }
      />
      {providerName() === "mock" && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-warn-soft px-4 py-3 text-sm leading-6 text-warn">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
          <span>
            پرداخت در حالت <b>آزمایشی</b> است و پول واقعی دریافت نمی‌شود. قبل از انتشار، درگاه زرین‌پال را تنظیم کنید (راهنما در README).
          </span>
        </div>
      )}
      <AdminTabs />
      {children}
    </Shell>
  );
}

import Link from "next/link";
import { Shell, btnPrimary } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl font-extrabold text-rose">۴۰۴</p>
        <p className="text-ink-soft">صفحه‌ای که دنبالش بودید پیدا نشد.</p>
        <Link href="/" className={btnPrimary}>
          بازگشت به رزرو
        </Link>
      </div>
    </Shell>
  );
}

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden md:items-center md:justify-center md:p-8">
      {/* soft brand wash */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-32 size-96 rounded-full bg-blush/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-40 size-96 rounded-full bg-sage/35 blur-3xl" />

      <div className="relative flex w-full flex-1 flex-col px-6 pt-10 pb-8 md:max-w-md md:flex-none md:rounded-[2rem] md:bg-surface/85 md:p-10 md:shadow-lift md:backdrop-blur-xl">
        <Link href="/" className="self-start" aria-label="کره‌فارسی">
          <Logo size={44} />
        </Link>
        <div className="mt-10 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

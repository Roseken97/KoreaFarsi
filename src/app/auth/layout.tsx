import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#fbf9f4] md:items-center md:justify-center md:p-8">

      <div className="relative flex w-full flex-1 flex-col px-6 pt-8 pb-8 md:max-w-md md:flex-none md:rounded-[2rem] md:bg-[#fbf9f4] md:p-10 md:shadow-lift md:backdrop-blur-xl">
        <Link href="/auth/welcome" className="self-start" aria-label="KoreaFarsi">
          <Logo size={40} />
        </Link>
        <div className="mt-8 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

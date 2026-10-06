import Link from "next/link";
import { AuthArt } from "@/components/auth/AuthArt";
import { ChevronIcon } from "@/components/icons";
import { getMessages } from "@/lib/i18n/server";

/** Log in, sign up and the password screens: a color panel with a back pill, under a white sheet. */
export default async function SheetLayout({ children }: { children: React.ReactNode }) {
  const { m } = await getMessages();

  return (
    <>
      <div className="relative h-48 shrink-0 overflow-hidden">
        <AuthArt />
        <Link
          href="/auth/welcome"
          className="absolute start-4 top-[calc(env(safe-area-inset-top)+1rem)] flex items-center gap-1 rounded-full bg-ink/25 py-1.5 ps-2 pe-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-ink/35"
        >
          <ChevronIcon width={18} height={18} className="rotate-180" />
          {m.auth.back}
        </Link>
      </div>
      <main className="relative -mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-white px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</main>
    </>
  );
}

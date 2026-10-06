import Link from "next/link";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { ArrowForwardIcon } from "@/components/icons";
import { getMessages } from "@/lib/i18n/server";

/** Log in, sign up and the password screens: a frosted backdrop with a round back button. */
export default async function SheetLayout({ children }: { children: React.ReactNode }) {
  const { m } = await getMessages();

  return (
    <>
      <AuthBackdrop />
      <Link
        href="/auth/welcome"
        aria-label={m.auth.back}
        className="absolute start-5 top-[calc(env(safe-area-inset-top)+1rem)] z-20 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-[0_8px_20px_-10px_rgb(30_35_64/0.35)] backdrop-blur transition hover:bg-white"
      >
        <ArrowForwardIcon width={18} height={18} className="rotate-180" />
      </Link>
      <main className="relative flex flex-1 flex-col px-6 pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</main>
    </>
  );
}

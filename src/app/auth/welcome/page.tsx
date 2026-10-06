import type { Metadata } from "next";
import Link from "next/link";
import { AuthArt } from "@/components/auth/AuthArt";
import { LogoMark } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.welcome.title };
}

/**
 * Auth step 1: the full color panel with the welcome line, and a two-part tab bar at the bottom:
 * Log in on the panel, Create account on a white tab that opens into the sign-up sheet.
 */
export default async function WelcomePage() {
  const { m } = await getMessages();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <AuthArt />

      <div className="relative flex justify-end px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <LanguageSwitch />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-8 pb-10 text-center">
        <span className="grid size-24 place-items-center rounded-full bg-white/90 shadow-[0_18px_40px_-16px_rgb(30_35_64/0.6)]">
          <LogoMark size={68} priority />
        </span>
        <h1 className="mt-6 font-display text-[30px] leading-tight font-bold text-white drop-shadow-[0_2px_10px_rgb(30_35_64/0.25)]">{m.welcome.title}</h1>
        <p className="mt-3 max-w-xs text-[15px] leading-7 text-white/90">{m.welcome.subtitle}</p>
        <Link href="/home" className="mt-6 text-sm font-medium text-white/85 underline underline-offset-4 hover:text-white">
          {m.welcome.guest}
        </Link>
      </div>

      <nav className="relative grid h-[calc(5rem+env(safe-area-inset-bottom))] grid-cols-2 text-[15px] font-semibold">
        <Link href="/auth/login" className="grid place-items-center pb-[env(safe-area-inset-bottom)] text-white transition hover:bg-white/10">
          {m.welcome.login}
        </Link>
        <Link href="/auth/signup" className="grid place-items-center rounded-ss-[2rem] bg-white pb-[env(safe-area-inset-bottom)] text-violet-deep">
          {m.welcome.createAccount}
        </Link>
      </nav>
    </div>
  );
}

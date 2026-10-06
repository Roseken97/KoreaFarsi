import type { Metadata } from "next";
import Link from "next/link";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { HexHero } from "@/components/auth/HexHero";
import { LogoMark } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { ButtonLink } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.welcome.title };
}

/**
 * Auth step 1, in the soft-3D sign-in style: frosted backdrop, the logo in a lavender
 * hexagon, the welcome line, then Create account (navy) and Log in (white). Sized to the
 * visible screen so the buttons never sit below the fold, even with a browser toolbar.
 */
export default async function WelcomePage() {
  const { m } = await getMessages();

  return (
    <div className="relative flex h-dvh max-h-dvh flex-1 flex-col overflow-hidden md:h-auto md:max-h-none">
      <AuthBackdrop />

      <div className="relative flex justify-end px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <LanguageSwitch />
      </div>

      <div className="kf-stagger relative flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
        <HexHero tone="lavender" className="w-[min(13rem,30dvh)]">
          <span className="grid aspect-square w-[44%] place-items-center rounded-full bg-white shadow-[0_14px_30px_-14px_rgb(30_35_64/0.45)]">
            <LogoMark size={64} priority />
          </span>
        </HexHero>
        <h1 className="mt-5 font-display text-[28px] leading-tight font-bold text-ink">{m.welcome.title}</h1>
        <p className="mt-2 max-w-xs text-[15px] leading-7 text-ink-soft">{m.welcome.subtitle}</p>
      </div>

      <nav className="kf-stagger relative flex flex-col gap-3 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <ButtonLink href="/auth/signup" variant="navy" className="h-14">
          {m.welcome.createAccount}
        </ButtonLink>
        <ButtonLink
          href="/auth/login"
          variant="ghost"
          className="h-14 rounded-full! bg-white text-ink no-underline! shadow-[0_10px_26px_-14px_rgb(30_35_64/0.35)] hover:bg-white/80"
        >
          {m.welcome.login}
        </ButtonLink>
        <Link href="/home" className="mt-1 text-center text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline">
          {m.welcome.guest}
        </Link>
      </nav>
    </div>
  );
}

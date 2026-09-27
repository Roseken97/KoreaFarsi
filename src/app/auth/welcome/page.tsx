import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { ButtonLink } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.welcome.title };
}

/** Auth step 1 (sketch 03): Create an account / Log in / Continue as guest. */
export default async function WelcomePage() {
  const { m } = await getMessages();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <LogoMark size={112} priority />
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{m.welcome.title}</h1>
        <p className="mt-3 max-w-xs text-[15px] leading-7 text-ink-soft">{m.welcome.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3">
        <ButtonLink href="/auth/signup">{m.welcome.createAccount}</ButtonLink>
        <ButtonLink href="/auth/login" variant="secondary">
          {m.welcome.login}
        </ButtonLink>
        <Link href="/home" className="py-3 text-center text-sm font-medium text-ink-soft hover:text-ink">
          {m.welcome.guest}
        </Link>
      </div>

      <div className="mt-4 flex justify-center">
        <LanguageSwitch />
      </div>
    </div>
  );
}

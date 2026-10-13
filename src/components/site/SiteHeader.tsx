import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { SiteMenu } from "./SiteMenu";

const telegram = CONTACT.telegram ? CONTACT_LINKS.telegram(CONTACT.telegram) : null;

/** Website top bar: logo, the start CTA, cart and hamburger. Must sit inside a CartProvider. */
export async function SiteHeader({ priorityLogo = false }: { priorityLogo?: boolean }) {
  const [{ m }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1240px] px-5 pt-5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <LogoMark size={40} priority={priorityLogo} />
          <span className="hidden text-[17px] font-extrabold min-[380px]:inline">{m.homepage.footer.colBrand}</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Link href="/auth/welcome" className="rounded-full bg-white/90 px-5 py-2 font-extrabold whitespace-nowrap text-[#1C1336] backdrop-blur-md">
            {m.homepage.nav.start}
          </Link>
          <SiteMenu signedIn={!!user} telegram={telegram} />
        </div>
      </div>
    </header>
  );
}

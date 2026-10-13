import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { SearchIcon } from "@/components/icons";
import { isAdminEmail } from "@/lib/admin";
import { getMessages } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { SiteMenu } from "./SiteMenu";
import styles from "@/components/homepage/homepage.module.css";

/**
 * Website top bar. The row is pinned left-to-right in both languages, as Rose asked:
 * logo on the left; sign up | log in (or "my account"), search, cart and hamburger on the right.
 * Must sit inside a CartProvider.
 */
export async function SiteHeader({ priorityLogo = false }: { priorityLogo?: boolean }) {
  const [{ m, locale }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  const t = m.homepage.menu;
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1240px] px-4 pt-5 sm:px-6">
      <div dir="ltr" className="flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <LogoMark size={40} priority={priorityLogo} />
          <span dir="auto" className="hidden text-[17px] font-extrabold sm:inline">{m.homepage.footer.colBrand}</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          {user ? (
            <Link href="/my-account" className={`rounded-full px-4 py-2 whitespace-nowrap text-white ${styles.glassPill}`}>
              {t.account}
            </Link>
          ) : (
            <div dir={locale === "fa" ? "rtl" : "ltr"} className={`flex items-center rounded-full px-1 whitespace-nowrap text-white ${styles.glassPill}`}>
              <Link href="/signup" className="rounded-full px-3 py-2 hover:bg-white/10">{t.signup}</Link>
              <span aria-hidden="true" className="text-white/40">|</span>
              <Link href="/login" className="rounded-full px-3 py-2 hover:bg-white/10">{t.login}</Link>
            </div>
          )}
          <Link href="/search" aria-label={t.search} className={`grid size-10 place-items-center rounded-full text-white ${styles.glassPill}`}>
            <SearchIcon width={19} height={19} />
          </Link>
          <SiteMenu signedIn={!!user} isAdmin={isAdminEmail(user?.email)} />
        </div>
      </div>
    </header>
  );
}

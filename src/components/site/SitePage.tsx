import Link from "next/link";
import type { ReactNode } from "react";
import { CartProvider } from "@/lib/bookstore/cart";
import { getMessages } from "@/lib/i18n/server";
import { SiteHeader } from "./SiteHeader";
import { SiteTransition } from "./SiteTransition";

/**
 * Shell for the website's inner pages: the homepage's dark look, header and a slim footer.
 * The page body sits in SiteTransition, so moving between site pages fades and rises
 * while the header stays put.
 */
export async function SitePage({ children }: { children: ReactNode }) {
  const { m } = await getMessages();
  return (
    <CartProvider>
      <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-[#140E26] text-[17px] leading-[1.9] text-[#F4EEFF]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(183,156,255,0.22) 0%, rgba(20,14,38,0) 100%)" }}
        />
        <SiteHeader />
        <SiteTransition className="relative z-10 flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </SiteTransition>
        <footer className="relative z-10 border-t border-white/[0.08] px-6 py-6">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 text-[13px] text-[#A99FC4]">
            <span>{m.homepage.footer.rights}</span>
            <nav className="flex flex-wrap gap-4">
              <Link href="/" className="hover:text-white">{m.homepage.menu.brand}</Link>
              <Link href="/shop" className="hover:text-white">{m.homepage.menu.shop}</Link>
              <Link href="/faq" className="hover:text-white">{m.homepage.menu.faq}</Link>
              <Link href="/contact" className="hover:text-white">{m.homepage.menu.contact}</Link>
              <Link href="/terms" className="hover:text-white">{m.homepage.menu.terms}</Link>
            </nav>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

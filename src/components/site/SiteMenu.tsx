"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AccountIcon,
  BooksStackIcon,
  ChatBubbleIcon,
  CloseIcon,
  DictionaryIcon,
  HelpIcon,
  HomeIcon,
  LanternIcon,
  MenuIcon,
  PlayIcon,
  SendIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SparkleIcon,
  UserIcon,
} from "@/components/icons";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { useCart } from "@/lib/bookstore/cart";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import styles from "@/components/homepage/homepage.module.css";

const noopSubscribe = () => () => {};

type Item = { href: string; label: string; icon: ReactNode; color: string; badge?: number };

/**
 * Site header actions: cart and the hamburger. The menu opens as a glass panel
 * over the page and holds every other link, so the bar stays the same on phone
 * and desktop. Rendered into <body> so the hero's stacking and overflow never
 * clip it. Needs a CartProvider above it (SiteHeader's callers provide one).
 */
export function SiteMenu({ signedIn }: { signedIn: boolean }) {
  const { m, locale } = useI18n();
  const t = m.homepage.menu;
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cartCount = hydrated ? count : 0;
  const onHome = usePathname() === "/";

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "",
      items: [{ href: "/", label: t.home, icon: <HomeIcon width={20} height={20} />, color: "#6FF3EE" }],
    },
    {
      title: t.shop,
      items: [
        { href: "/shop/books", label: t.books, icon: <BooksStackIcon width={20} height={20} />, color: "#FF8FC7" },
        { href: "/shop/courses", label: t.courses, icon: <PlayIcon width={20} height={20} />, color: "#B79CFF" },
        { href: "/shop/cart", label: t.cart, icon: <ShoppingBagIcon width={20} height={20} />, color: "#FFC59A", badge: cartCount },
      ],
    },
    {
      title: t.learn,
      items: [
        { href: "/magazine", label: t.koreaLife, icon: <LanternIcon width={20} height={20} />, color: "#FFB72B" },
        { href: "/tools/dictionary", label: t.dictionary, icon: <DictionaryIcon width={20} height={20} />, color: "#2FE6E0" },
        { href: "/app", label: t.app, icon: <SparkleIcon width={20} height={20} />, color: "#5D8FE8" },
      ],
    },
    {
      title: t.brand,
      items: [
        { href: "/about", label: t.about, icon: <HelpIcon width={20} height={20} />, color: "#B79CFF" },
        { href: "/teacher", label: t.teacher, icon: <UserIcon width={20} height={20} />, color: "#FF8FC7" },
      ],
    },
    {
      title: t.support,
      items: [
        { href: "/contact", label: t.contact, icon: <SendIcon width={20} height={20} />, color: "#2FE6E0" },
        { href: "/faq", label: t.faq, icon: <ChatBubbleIcon width={20} height={20} />, color: "#B79CFF" },
        { href: "/terms", label: t.terms, icon: <ShieldIcon width={20} height={20} />, color: "#FFC59A" },
      ],
    },
  ];

  const close = () => setOpen(false);

  const panel = (
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-[#140E26]/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(380px,88vw)] flex-col overflow-y-auto border-l border-white/15 bg-[#1C1336]/85 text-[#F4EEFF] shadow-[0_0_60px_rgba(20,14,38,0.6)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="text-[15px] font-extrabold tracking-wide text-white/90">{t.title}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t.close}
            className={`grid size-10 place-items-center rounded-full text-white ${styles.glassPill}`}
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav aria-label={t.title} className="flex flex-1 flex-col gap-5 px-6 py-3">
          {groups.map((g) => (
            <div key={g.title || g.items[0].href}>
              {g.title && <p className="mb-2 text-xs font-extrabold tracking-wider text-[#A99FC4]">{g.title}</p>}
              <ul className="flex flex-col gap-1">
                {g.items.map((it) => {
                  const body = (
                    <>
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl"
                        style={{ background: `${it.color}24`, color: it.color, boxShadow: `inset 0 0 0 1px ${it.color}55` }}
                      >
                        {it.icon}
                      </span>
                      <span className="flex-1 text-[15px] font-bold">{it.label}</span>
                      {!!it.badge && (
                        <span className="grid min-w-6 place-items-center rounded-full bg-[#FF8FC7] px-1.5 text-xs leading-6 font-extrabold text-[#1C1336]">
                          {formatNumber(it.badge, locale)}
                        </span>
                      )}
                    </>
                  );
                  const cls = "flex items-center gap-3 rounded-2xl px-2 py-1.5 text-white transition hover:bg-white/[0.07] focus-visible:bg-white/[0.07]";
                  return (
                    <li key={it.href}>
                      <Link href={it.href} onClick={close} className={cls}>
                        {body}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-white/10 px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {signedIn ? (
            <Link href="/my-account" onClick={close} className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white ${styles.glassPill}`}>
              <AccountIcon width={18} height={18} />
              {t.account}
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href="/login" onClick={close} className={`rounded-full px-5 py-2.5 text-center text-white ${styles.glassPill}`}>
                {t.login}
              </Link>
              <Link href="/signup" onClick={close} className="rounded-full bg-white/90 px-5 py-2.5 text-center font-extrabold text-[#1C1336]">
                {t.signup}
              </Link>
            </div>
          )}
          <LanguageSwitch className="self-center" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!onHome && (
        <Link href="/" aria-label={t.home} className={`grid size-10 place-items-center rounded-full text-white ${styles.glassPill}`}>
          <HomeIcon width={19} height={19} />
        </Link>
      )}
      <Link
        href="/shop/cart"
        aria-label={cartCount > 0 ? `${t.cart} (${formatNumber(cartCount, locale)})` : t.cart}
        className={`relative grid size-10 place-items-center rounded-full text-white ${styles.glassPill}`}
      >
        <ShoppingBagIcon width={19} height={19} />
        {cartCount > 0 && (
          <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#FF8FC7] px-1 text-[10px] leading-5 font-extrabold text-[#1C1336]">
            {formatNumber(cartCount, locale)}
          </span>
        )}
      </Link>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.open}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`grid size-10 place-items-center rounded-full text-white ${styles.glassPill}`}
      >
        <MenuIcon width={20} height={20} />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}

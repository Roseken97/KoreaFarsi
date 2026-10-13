"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircleIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from "@/components/icons";
import { submitPurchaseRequest } from "@/lib/bookstore/actions";
import { useCart } from "@/lib/bookstore/cart";
import { formatPrice } from "@/lib/bookstore/format";
import { isPurchasable, priceFor, titles, type Product } from "@/lib/bookstore/types";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { ProductCover } from "@/components/bookstore/ProductCover";

const primaryBtn = "flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-white/90 px-7 font-extrabold text-[#1C1336] transition hover:bg-white disabled:opacity-60";
const inputCls = "w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#A99FC4] focus:border-[#6FF3EE]/70";

/** Website cart: the same cart as the app (stored in this browser), sent as a purchase request until online payment exists. */
export function ShopCart({ products, telegram }: { products: Product[]; telegram: string | null }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const { lines, hydrated, setQuantity, remove, clear } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  const rows = lines
    .map((line) => ({ line, product: products.find((p) => p.slug === line.slug) }))
    .filter((r): r is { line: typeof r.line; product: Product } => Boolean(r.product && isPurchasable(r.product)));
  const total = rows.reduce((sum, { line, product }) => sum + priceFor(product, line.format) * line.quantity, 0);

  if (done) {
    return (
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-[#2FE6E0]/15 text-[#6FF3EE]">
          <CheckCircleIcon width={32} height={32} />
        </span>
        <h2 className="m-0 text-2xl font-black text-white">{t.request.successTitle}</h2>
        <p className="m-0 text-[#C9BEE3]">{t.request.successBody}</p>
        <Link href="/shop" className={primaryBtn}>
          {m.shop.continueShopping}
        </Link>
      </div>
    );
  }

  if (!hydrated) return null;

  if (rows.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-[#FF8FC7]/15 text-[#FF8FC7]">
          <ShoppingBagIcon width={30} height={30} />
        </span>
        <p className="m-0 text-[#C9BEE3]">{t.cart.empty}</p>
        <Link href="/shop" className={primaryBtn}>
          {m.shop.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map(({ line, product }) => (
          <li key={`${line.slug}-${line.format}`} className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <Link href={`/shop/${product.slug}`} className="w-16 shrink-0">
              <ProductCover product={product} sizes="64px" mini />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link href={`/shop/${product.slug}`} className="line-clamp-2 text-[15px] font-extrabold text-white">
                {titles(product, locale).primary}
              </Link>
              <span className="text-xs text-[#A99FC4]">{t.formatsLong[line.format]}</span>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-1 rounded-full border border-white/15 p-0.5">
                  <button onClick={() => setQuantity(line.slug, line.format, line.quantity - 1)} aria-label={t.cart.decrease} className="grid size-7 place-items-center rounded-full text-[#C9BEE3] hover:bg-white/10">
                    <MinusIcon width={14} height={14} />
                  </button>
                  <span className="min-w-6 text-center text-sm font-bold text-white" aria-live="polite">
                    {formatNumber(line.quantity, locale)}
                  </span>
                  <button onClick={() => setQuantity(line.slug, line.format, line.quantity + 1)} aria-label={t.cart.increase} className="grid size-7 place-items-center rounded-full text-[#C9BEE3] hover:bg-white/10">
                    <PlusIcon width={14} height={14} />
                  </button>
                </div>
                <span className="text-sm font-extrabold text-[#6FF3EE]">{formatPrice(priceFor(product, line.format) * line.quantity, locale, m)}</span>
              </div>
            </div>
            <button onClick={() => remove(line.slug, line.format)} aria-label={t.cart.remove} className="grid size-8 shrink-0 place-items-center self-start rounded-full text-[#A99FC4] hover:bg-[#FF8FC7]/15 hover:text-[#FF8FC7]">
              <TrashIcon width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>

      <aside className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[#C9BEE3]">{t.cart.total}</span>
          <span className="text-xl font-black text-white">{formatPrice(total, locale, m)}</span>
        </div>
        <p className="m-0 rounded-2xl bg-white/[0.05] px-4 py-3 text-[13px] leading-6 text-[#C9BEE3]">{t.cart.note}</p>
        {showForm ? (
          <RequestForm
            lines={rows.map((r) => r.line)}
            telegram={telegram}
            onDone={() => {
              clear();
              setDone(true);
            }}
          />
        ) : (
          <button type="button" onClick={() => setShowForm(true)} className={primaryBtn}>
            {t.cart.request}
          </button>
        )}
        <Link href="/terms" className="text-center text-xs text-[#A99FC4] hover:text-white">
          {m.homepage.menu.terms}
        </Link>
      </aside>
    </div>
  );
}

function RequestForm({
  lines,
  telegram,
  onDone,
}: {
  lines: { slug: string; format: "pdf" | "physical"; quantity: number }[];
  telegram: string | null;
  onDone: () => void;
}) {
  const { m } = useI18n();
  const t = m.bookstore.request;
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [formError, setFormError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim() ? undefined : t.errors.name,
      contact: contact.trim().length >= 3 ? undefined : t.errors.contact,
    };
    setErrors(next);
    setFormError("");
    if (next.name || next.contact) return;

    setLoading(true);
    const result = await submitPurchaseRequest({ name, contact, message, website, lines }).catch(() => ({ ok: false, error: "generic" }) as const);
    setLoading(false);

    if (result.ok) return onDone();
    if (result.error === "not_configured") return setNotConfigured(true);
    if (result.error === "name" || result.error === "contact") return setErrors({ [result.error]: t.errors[result.error] });
    setFormError(t.errors[result.error === "empty" ? "empty" : "generic"]);
  }

  if (notConfigured) {
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm text-[#C9BEE3]">{t.notConfigured}</p>
        {telegram && (
          <a href={telegram} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
            {m.terms.contactCta}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 border-t border-white/10 pt-4">
      <p className="m-0 font-extrabold text-white">{t.title}</p>
      {formError && <p className="m-0 rounded-2xl bg-[#FF8FC7]/15 px-4 py-2.5 text-sm text-[#FFB3D9]">{formError}</p>}
      <label className="flex flex-col gap-1.5 text-sm font-bold text-white">
        {t.name}
        <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} className={inputCls} />
        {errors.name && <span className="text-xs font-medium text-[#FFB3D9]">{errors.name}</span>}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-white">
        {t.contact}
        <input dir="ltr" autoComplete="tel" value={contact} onChange={(e) => setContact(e.target.value)} aria-invalid={!!errors.contact} className={inputCls} />
        {errors.contact && <span className="text-xs font-medium text-[#FFB3D9]">{errors.contact}</span>}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-white">
        {t.message}
        <textarea rows={3} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} className={inputCls} />
      </label>
      {/* Honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />
      <button type="submit" disabled={loading} className={primaryBtn}>
        {t.submit}
      </button>
    </form>
  );
}

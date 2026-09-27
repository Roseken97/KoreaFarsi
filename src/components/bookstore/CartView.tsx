"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { CheckCircleIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { submitPurchaseRequest } from "@/lib/bookstore/actions";
import { useCart } from "@/lib/bookstore/cart";
import { formatPrice } from "@/lib/bookstore/format";
import { isPurchasable, priceFor, titles, type Product } from "@/lib/bookstore/types";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { BookstoreHeader } from "./BookstoreHeader";
import { ProductCover } from "./ProductCover";

export function CartView({ products, contactFallback }: { products: Product[]; contactFallback: ReactNode }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const { lines, hydrated, setQuantity, remove, clear } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  // Drop lines whose product disappeared or is no longer purchasable.
  const rows = lines
    .map((line) => ({ line, product: products.find((p) => p.slug === line.slug) }))
    .filter((r): r is { line: typeof r.line; product: Product } => Boolean(r.product && isPurchasable(r.product)));
  const total = rows.reduce((sum, { line, product }) => sum + priceFor(product, line.format) * line.quantity, 0);

  if (done) {
    return (
      <div className="animate-fade-up mx-auto flex min-h-[60dvh] max-w-md flex-col">
        <StatusScreen
          icon={<CheckCircleIcon width={32} height={32} />}
          title={t.request.successTitle}
          action={<ButtonLink href="/bookstore">{t.request.backToStore}</ButtonLink>}
        >
          <p>{t.request.successBody}</p>
        </StatusScreen>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <BookstoreHeader backHref="/bookstore" />
      <h1 className="font-display text-3xl font-semibold">{t.cart.title}</h1>

      {!hydrated ? null : rows.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-blush-soft text-blush">
            <ShoppingBagIcon width={30} height={30} />
          </span>
          <p className="mt-4 text-ink-soft">{t.cart.empty}</p>
          <ButtonLink href="/bookstore" variant="secondary" className="mt-6 w-auto! px-8">
            {t.cart.browse}
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
          <ul className="divide-y divide-line/70 overflow-hidden rounded-card bg-surface shadow-soft">
            {rows.map(({ line, product }) => {
              const unit = priceFor(product, line.format);
              return (
                <li key={`${line.slug}-${line.format}`} className="flex gap-3 p-4">
                  <Link href={`/bookstore/${product.slug}`} className="w-14 shrink-0">
                    <ProductCover product={product} sizes="56px" mini />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/bookstore/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-ink">
                      {titles(product, locale).primary}
                    </Link>
                    <span className="mt-0.5 text-xs text-ink-soft">{t.formatsLong[line.format]}</span>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
                        <button
                          onClick={() => setQuantity(line.slug, line.format, line.quantity - 1)}
                          aria-label={t.cart.decrease}
                          className="grid size-7 place-items-center rounded-full text-ink-soft hover:bg-cream"
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium" aria-live="polite">
                          {formatNumber(line.quantity, locale)}
                        </span>
                        <button
                          onClick={() => setQuantity(line.slug, line.format, line.quantity + 1)}
                          aria-label={t.cart.increase}
                          className="grid size-7 place-items-center rounded-full text-ink-soft hover:bg-cream"
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(unit * line.quantity, locale, m)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(line.slug, line.format)}
                    aria-label={t.cart.remove}
                    className="grid size-8 shrink-0 place-items-center self-start rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-soft lg:sticky lg:top-10">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{t.cart.total}</span>
              <span className="font-display text-xl font-semibold">{formatPrice(total, locale, m)}</span>
            </div>
            <p className="rounded-field bg-cream px-4 py-3 text-[13px] leading-6 text-ink-soft">{t.cart.note}</p>
            {showForm ? (
              <RequestForm
                lines={rows.map((r) => r.line)}
                contactFallback={contactFallback}
                onDone={() => {
                  clear();
                  setDone(true);
                }}
              />
            ) : (
              <Button onClick={() => setShowForm(true)}>{t.cart.request}</Button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function RequestForm({
  lines,
  contactFallback,
  onDone,
}: {
  lines: { slug: string; format: "pdf" | "physical"; quantity: number }[];
  contactFallback: ReactNode;
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
    const result = await submitPurchaseRequest({ name, contact, message, website, lines }).catch(
      () => ({ ok: false, error: "generic" }) as const,
    );
    setLoading(false);

    if (result.ok) return onDone();
    if (result.error === "not_configured") return setNotConfigured(true);
    if (result.error === "name" || result.error === "contact") return setErrors({ [result.error]: t.errors[result.error] });
    setFormError(t.errors[result.error === "empty" ? "empty" : "generic"]);
  }

  if (notConfigured) {
    return (
      <div className="flex flex-col gap-3">
        <Notice>{t.notConfigured}</Notice>
        {contactFallback}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 border-t border-line pt-4">
      <p className="font-semibold">{t.title}</p>
      {formError && <Notice tone="error">{formError}</Notice>}
      <Field label={t.name} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Field
        label={t.contact}
        ltr
        autoComplete="tel"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        error={errors.contact}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="request-message" className="text-sm font-medium text-ink">
          {t.message}
        </label>
        <textarea
          id="request-message"
          rows={3}
          maxLength={1000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-field border border-line bg-surface px-4 py-3 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
        />
      </div>
      {/* Honeypot: hidden from people, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <Button type="submit" loading={loading}>
        {t.submit}
      </Button>
    </form>
  );
}

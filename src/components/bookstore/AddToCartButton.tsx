"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ShoppingBagIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/bookstore/cart";
import type { Format } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";

/** Adds one item and shows a short "Added" confirmation. `compact` = round icon button for cards. */
export function AddToCartButton({
  slug,
  format,
  compact = false,
  disabled = false,
}: {
  slug: string;
  format: Format;
  compact?: boolean;
  disabled?: boolean;
}) {
  const { m } = useI18n();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  function onClick() {
    add(slug, format);
    setAdded(true);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={added ? m.bookstore.added : m.bookstore.addToCart}
        className={`grid size-9 shrink-0 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
          added ? "bg-success text-white" : "bg-violet text-white hover:bg-violet-deep"
        }`}
      >
        {added ? <CheckIcon width={18} height={18} /> : <ShoppingBagIcon width={18} height={18} />}
      </button>
    );
  }

  return (
    <Button type="button" onClick={onClick} disabled={disabled} className={added ? "bg-success! hover:bg-success!" : ""}>
      {added ? <CheckIcon width={20} height={20} /> : <ShoppingBagIcon width={20} height={20} />}
      <span aria-live="polite">{added ? m.bookstore.added : m.bookstore.addToCart}</span>
    </Button>
  );
}

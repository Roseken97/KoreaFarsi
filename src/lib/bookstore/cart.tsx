"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Format } from "./types";

/**
 * Phase 1 cart: client-side only (no checkout), persisted in localStorage so it
 * survives reloads for guests too. A server-side cart can replace this when
 * real payments arrive — consumers only use the hook below.
 */
export type CartLine = { slug: string; format: Format; quantity: number };

const STORAGE_KEY = "kf:cart:v1";
const MAX_QTY = 20;

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  add: (slug: string, format: Format) => void;
  setQuantity: (slug: string, format: Format, quantity: number) => void;
  remove: (slug: string, format: Format) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function read(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((l) => typeof l?.slug === "string" && (l.format === "pdf" || l.format === "physical") && l.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate after mount (localStorage is browser-only); keeps SSR markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const setQuantity = useCallback((slug: string, format: Format, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !(l.slug === slug && l.format === format))
        : prev.map((l) => (l.slug === slug && l.format === format ? { ...l, quantity: Math.min(quantity, MAX_QTY) } : l)),
    );
  }, []);

  const add = useCallback((slug: string, format: Format) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.format === format);
      if (existing)
        return prev.map((l) => (l === existing ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QTY) } : l));
      return [...prev, { slug, format, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((slug: string, format: Format) => setQuantity(slug, format, 0), [setQuantity]);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((n, l) => n + l.quantity, 0), hydrated, add, setQuantity, remove, clear }),
    [lines, hydrated, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

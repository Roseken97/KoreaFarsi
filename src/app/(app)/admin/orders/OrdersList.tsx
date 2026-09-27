"use client";

import { useState, useTransition } from "react";
import { CheckCircleIcon } from "@/components/icons";
import { Notice } from "@/components/ui/Notice";
import { formatPrice } from "@/lib/bookstore/format";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { grantPurchaseRequestAccess } from "@/lib/library/admin-actions";

export type PurchaseRequestRow = {
  id: string;
  name: string;
  contact: string;
  message: string | null;
  items: { slug: string; title: string; format: string; quantity: number; unit_price: number }[];
  total: number;
  currency: string;
  status: "new" | "contacted" | "done" | "cancelled";
  user_id: string | null;
  created_at: string;
};

const STATUS_TONE: Record<PurchaseRequestRow["status"], string> = {
  new: "bg-blush-soft text-ink",
  contacted: "bg-sage-soft text-teal-deep",
  done: "bg-success-soft text-success",
  cancelled: "bg-cream-deep text-ink-faint",
};

export function OrdersList({ requests }: { requests: PurchaseRequestRow[] }) {
  const { m } = useI18n();
  const t = m.orders;

  if (requests.length === 0) {
    return <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-ink-soft">{t.empty}</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {requests.map((request) => (
        <OrderRow key={request.id} request={request} />
      ))}
    </ul>
  );
}

function OrderRow({ request }: { request: PurchaseRequestRow }) {
  const { m, locale } = useI18n();
  const t = m.orders;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState(request.status);

  function grant() {
    setError("");
    startTransition(async () => {
      const result = await grantPurchaseRequestAccess(request.id).catch(() => ({ ok: false, error: "generic" }) as const);
      if (!result.ok) return setError(result.error === "no_account" ? t.guestNote : t.errors.generic);
      setStatus("done");
    });
  }

  return (
    <li className="rounded-card bg-surface p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{request.name}</p>
          <p className="text-sm text-ink-soft" dir="ltr">
            {request.contact}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[status]}`}>{t.statusLabel[status]}</span>
      </div>

      <ul className="mt-3 divide-y divide-line/70 rounded-field bg-cream text-sm">
        {request.items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
            <span className="truncate">
              {item.title} · {formatNumber(item.quantity, locale)}× ({item.format})
            </span>
            <span className="shrink-0 font-medium">{formatPrice(item.unit_price * item.quantity, locale, m)}</span>
          </li>
        ))}
      </ul>

      {request.message && (
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-medium text-ink">{t.message}: </span>
          {request.message}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <p className="font-semibold">
          {t.total}: {formatPrice(request.total, locale, m)}
        </p>

        {status === "done" ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
            <CheckCircleIcon width={18} height={18} />
            {t.granted}
          </span>
        ) : !request.user_id ? (
          <span className="max-w-[16rem] text-end text-xs text-ink-faint">{t.guestNote}</span>
        ) : (
          <button
            onClick={grant}
            disabled={pending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ink/85 disabled:opacity-50"
          >
            {pending ? t.granting : t.grant}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
    </li>
  );
}

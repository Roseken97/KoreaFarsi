import { notFound } from "next/navigation";
import { Card, Icon, Shell, btnGhost, btnPrimary } from "@/components/ui";
import { providerName } from "@/lib/payment";
import { getBookingByAuthority } from "@/lib/store";
import { toman } from "@/lib/time";

export const metadata = { title: "درگاه آزمایشی" };

// Stand-in for a real bank gateway, used only while PAYMENT_PROVIDER=mock.
export default async function MockGateway({ searchParams }: PageProps<"/pay/mock">) {
  if (providerName() !== "mock") notFound();
  const { authority } = await searchParams;
  const b = typeof authority === "string" ? getBookingByAuthority(authority) : undefined;
  if (!b) notFound();

  const back = (ok: boolean) => `/api/pay/callback?Authority=${encodeURIComponent(authority as string)}&Status=${ok ? "OK" : "NOK"}`;

  return (
    <Shell>
      <div className="flex min-h-dvh flex-col justify-center py-10">
        <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-warn-soft px-4 py-2 text-sm text-warn">
          <Icon name="alert" className="size-4" />
          درگاه آزمایشی — پولی جابه‌جا نمی‌شود
        </div>
        <Card className="text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-rose-mist text-rose-deep">
            <Icon name="lock" className="size-7" />
          </div>
          <p className="text-sm text-ink-soft">مبلغ قابل پرداخت</p>
          <p className="mt-1 text-3xl font-extrabold">{toman(b.amount)}</p>
          <p className="mt-3 text-sm text-ink-soft">{b.service_name}</p>
          <div className="mt-6 grid gap-2">
            <a href={back(true)} className={btnPrimary}>
              پرداخت موفق
            </a>
            <a href={back(false)} className={btnGhost}>
              انصراف از پرداخت
            </a>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

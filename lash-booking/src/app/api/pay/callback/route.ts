import { NextResponse, after, type NextRequest } from "next/server";
import { onConfirmed } from "@/lib/notify";
import { appUrl, verifyPayment } from "@/lib/payment";
import { getBookingByAuthority, markFailed, markPaid } from "@/lib/store";

// The gateway sends the customer back here: ?Authority=…&Status=OK|NOK
// We never trust Status alone — a paid booking is only confirmed after verify().
export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get("Authority") ?? "";
  const status = req.nextUrl.searchParams.get("Status");
  const booking = authority ? getBookingByAuthority(authority) : undefined;
  if (!booking) return NextResponse.redirect(`${appUrl()}/`);

  // Absolute URL from APP_URL: behind a reverse proxy req.url may carry an internal host.
  const target = `${appUrl()}/booking/${booking.code}`;

  // Already processed (page refresh, double callback): just show the result.
  if (booking.status !== "pending" && booking.status !== "expired") return NextResponse.redirect(target);

  if (status !== "OK") {
    markFailed(booking.code);
    return NextResponse.redirect(target);
  }

  const v = await verifyPayment({ authority, amount: booking.amount });
  if (v.ok) {
    const paid = markPaid(booking.code, v.refId);
    // SMS after the redirect is sent, so a slow SMS API never delays the customer.
    if (paid?.status === "confirmed") after(() => onConfirmed(paid, { online: true }));
  } else markFailed(booking.code);
  return NextResponse.redirect(target);
}

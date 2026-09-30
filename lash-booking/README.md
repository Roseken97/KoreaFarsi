# Lash Booking — اپ رزرو نوبت خدمات مژه

A small web app for booking lash appointments online. Customers pick a service, a day and a time, then pay a deposit (or the full price) to lock the slot. The owner manages everything from an admin panel under **Settings → پنل مدیریت**.

This app is completely independent of KoreaFarsi. It has its own `package.json` and is excluded from the root project's lint and typecheck. **It should eventually move to its own repository.**

## Customer flow

1. **Service**: tap a card (name, duration, price)
2. **Day and time**: the first day with free slots is selected automatically. Days with no free time show as «پر / تعطیل».
3. **Details and payment**: name, mobile number, optional note, then pay the deposit (name and number are remembered on the device)
4. **Result page**: tracking code, full details, and "add to phone calendar" (`.ics` with a 3-hour reminder)

Finished steps collapse into a one-line summary with a «تغییر» link. If someone else takes the slot during payment, the customer is sent back to the time list, which is refreshed.

**Settings** (gear icon): look up a booking with tracking code + mobile number, salon contact details, booking rules, and the entry to the admin panel.

## Admin panel (`/settings/admin`)

| Tab | What it does |
|---|---|
| نوبت‌ها | Stats (today, upcoming, 30-day online revenue); day-by-day list; «انجام شد» and «لغو» buttons; **manual booking** for phone/Instagram bookings so they don't clash with online ones |
| خدمات و قیمت | Add, edit, deactivate or delete services |
| ساعات کاری | Weekly schedule, slot interval, gap between appointments, booking horizon, minimum notice; **Jalali calendar** for closing specific days |
| تنظیمات سالن | Name, introduction, contact, address, Instagram, deposit percentage, hold time, booking rules |

## Booking logic

- Each slot is held for **15 minutes** (configurable) while the customer pays. If they cancel or the payment fails, it is released immediately.
- Payment is confirmed only after the gateway's **verify** step. The `Status=OK` in the URL alone is not trusted.
- Edge case: if payment completes after the hold expired and someone else has taken the slot, the booking is flagged as **«نیاز به پیگیری»** (needs follow-up) so the owner can refund or reschedule. The app never creates a double booking.
- The gap between appointments applies both before and after existing bookings.
- The app assumes **one chair / one artist**, so bookings cannot overlap.

## Running it

```bash
cd lash-booking
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3100
```

In development, if `ADMIN_PASSWORD` is not set the admin password is `admin`. In production the admin panel stays disabled until it is set.

## Going live: required checklist

1. **Server with a persistent disk.** Data lives in a SQLite file (`DATABASE_PATH`). Vercel and other serverless hosts **are not suitable** because their filesystem is wiped. Use a VPS or a Node host with a persistent disk (e.g. Liara with a disk, Railway with a volume). Node **22.13+** is required.
2. `ADMIN_PASSWORD` and `SESSION_SECRET` (32+ random characters)
3. `APP_URL` set to the real domain (used for the payment callback)
4. **Real payment:** `PAYMENT_PROVIDER=zarinpal`, `ZARINPAL_MERCHANT_ID=…`. First test with `ZARINPAL_SANDBOX=true`, then set it to `false`.
   > ⚠️ The Zarinpal integration was written from the v4 API (`request.json` → `StartPay` → `verify.json`, codes 100/101). Zarinpal's site could not be reached from the development environment, so **it has not been tested against the real gateway**. Run a sandbox test before going live.
5. Back up `data/lash.db` regularly (a simple cron job is enough).

```bash
npm run build && npm start   # PORT defaults to 3100
```

## Structure

```
src/lib/db.ts          SQLite schema + seed data
src/lib/store.ts       every query + free-slot calculation (the only file that touches the DB)
src/lib/payment.ts     payment providers (mock / zarinpal)
src/lib/auth.ts        admin session (signed httpOnly cookie)
src/lib/time.ts        Tehran timezone, Jalali dates, Persian digits, Toman
src/app/page.tsx       home page + booking flow (components/BookingWizard.tsx)
src/app/settings/      settings + admin panel
src/app/api/pay/callback  gateway callback
```

## Known limitations (deliberate for the MVP)

- **No SMS.** An SMS confirmation and a reminder the day before (e.g. via Kavenegar or SMS.ir) is the most valuable next step for cutting no-shows.
- Single admin, single chair. For more artists, add a `staff` table and a `staff_id` column to bookings, and compute availability per person.
- SQLite = a single server process. To scale horizontally, only `store.ts` needs to move to Postgres.
- Customers cannot cancel online (by design: cancellation goes through the salon and the deposit policy).

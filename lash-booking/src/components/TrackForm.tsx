"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { track } from "@/app/actions";
import { btnPrimary, inputCls } from "./ui";

export function TrackForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const r = await track(code, phone);
          if (r.ok) router.push(`/booking/${r.code}`);
          else setError(r.message);
        });
      }}
    >
      <p className="text-sm leading-6 text-ink-soft">کد پیگیری و شماره موبایلی که با آن رزرو کرده‌اید را وارد کنید.</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          className={`${inputCls} text-center font-mono uppercase tracking-widest`}
          dir="ltr"
          placeholder="کد پیگیری"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoCapitalize="characters"
        />
        <input
          className={`${inputCls} text-center`}
          dir="ltr"
          inputMode="tel"
          placeholder="09xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button className={`${btnPrimary} w-full py-3`} disabled={pending}>
        {pending ? "در حال جست‌وجو…" : "مشاهده‌ی نوبت"}
      </button>
    </form>
  );
}

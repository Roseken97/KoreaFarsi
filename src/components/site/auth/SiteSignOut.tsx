"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOutIcon } from "@/components/icons";
import { clearOfflineQueue, flushOfflineQueue } from "@/lib/offline/progress-queue";
import { clearOfflineData } from "@/lib/offline/sw";
import { createClient } from "@/lib/supabase/client";

/** "Log out" on the website's account page; returns to the homepage. */
export function SiteSignOut({ label }: { label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function signOut() {
    setLoading(true);
    // Send any offline progress first, then wipe this learner's cached pages and saved lessons.
    await flushOfflineQueue();
    clearOfflineQueue();
    await clearOfflineData();
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-[#FF8FC7]/40 px-5 py-2.5 text-sm font-bold text-[#FF8FC7] transition hover:bg-[#FF8FC7]/10 disabled:opacity-60"
    >
      <LogOutIcon width={16} height={16} />
      {label}
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOutIcon } from "@/components/icons";
import { RowContent, rowClass } from "@/components/ui/ListRow";
import { createClient } from "@/lib/supabase/client";

/** "Log Out" rendered as the last Account list row. */
export function SignOutRow({ label }: { label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await createClient().auth.signOut();
    router.replace("/auth/welcome");
    router.refresh();
  }

  return (
    <li>
      <button onClick={signOut} disabled={loading} className={`${rowClass} disabled:opacity-60`}>
        <RowContent Icon={LogOutIcon} title={label} tone="bg-danger-soft text-danger" />
      </button>
    </li>
  );
}

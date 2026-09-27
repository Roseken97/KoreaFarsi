"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await createClient().auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <Button variant="secondary" loading={loading} onClick={signOut}>
      خروج از حساب
    </Button>
  );
}

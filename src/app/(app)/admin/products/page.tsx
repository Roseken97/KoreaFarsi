import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { getMessages } from "@/lib/i18n/server";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { listProductsAdmin } from "@/lib/products/admin-actions";
import { ProductsAdmin } from "./ProductsAdmin";

export const metadata: Metadata = { title: "Products", robots: { index: false } };

/** Internal page: create/edit Bookstore products and upload covers + digital files (video, PDF, …) without the Supabase dashboard. */
export default async function ProductsPage() {
  const { m } = await getMessages();
  const t = m.productsAdmin;

  if (!isSupabaseConfigured || !hasServiceRole()) {
    return (
      <Shell title={t.title} nav={<AdminNav active="products" />}>
        <Notice>{m.admin.notConfigured}</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/products");
  if (!(await getAdminUser())) {
    return (
      <Shell title={t.title} nav={<AdminNav active="products" />}>
        <Notice tone="error">{m.admin.forbidden}</Notice>
      </Shell>
    );
  }

  const products = await listProductsAdmin();

  return (
    <Shell title={t.title} subtitle={t.subtitle} nav={<AdminNav active="products" />}>
      <ProductsAdmin products={products} />
    </Shell>
  );
}

function Shell({ title, subtitle, nav, children }: { title: string; subtitle?: string; nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      {nav}
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 mb-6 text-sm text-ink-soft">{subtitle}</p> : <div className="mb-6" />}
      {children}
    </div>
  );
}

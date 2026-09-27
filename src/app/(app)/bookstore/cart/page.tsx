import type { Metadata } from "next";
import { CartView } from "@/components/bookstore/CartView";
import { ContactLinks } from "@/components/ContactLinks";
import { getProducts } from "@/lib/bookstore/catalog";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.bookstore.cart.metaTitle };
}

export default async function CartPage() {
  const [products, { m }] = await Promise.all([getProducts(), getMessages()]);
  return <CartView products={products} contactFallback={<ContactLinks m={m} />} />;
}

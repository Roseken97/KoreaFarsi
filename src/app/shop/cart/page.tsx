import type { Metadata } from "next";
import { ShopCart } from "@/components/shop/ShopCart";
import { SitePage } from "@/components/site/SitePage";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getProducts } from "@/lib/bookstore/catalog";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.bookstore.cart.metaTitle, robots: { index: false } };
}

export default async function ShopCartPage() {
  const [products, { m }] = await Promise.all([getProducts(), getMessages()]);
  return (
    <SitePage>
      <div className="mx-auto max-w-[1040px] px-5 pt-14 pb-24 sm:px-6">
        <h1 className="m-0 text-[clamp(30px,5vw,44px)] leading-tight font-black text-white">{m.bookstore.cart.title}</h1>
        <ShopCart products={products} telegram={CONTACT.telegram ? CONTACT_LINKS.telegram(CONTACT.telegram) : null} />
      </div>
    </SitePage>
  );
}

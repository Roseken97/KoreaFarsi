import type { Metadata } from "next";
import { BookstoreBrowser } from "@/components/bookstore/BookstoreBrowser";
import { channelHref, configuredChannels } from "@/components/ContactLinks";
import { getProducts } from "@/lib/bookstore/catalog";
import { getMessages } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  // Same catalogue as the website shop, inside the app shell — consolidate on /shop.
  return pageMetadata({ locale, path: "/shop", title: m.bookstore.metaTitle, description: m.shop.metaDescription });
}

/** Bookstore (sketch 13). Browse + cart; purchase goes through a contact request (no payment in Phase 1). */
export default async function BookstorePage() {
  const products = await getProducts();
  const channels = configuredChannels();
  const community = channels.includes("instagram") ? "instagram" : channels.includes("telegram") ? "telegram" : null;

  return <BookstoreBrowser products={products} communityHref={community ? channelHref(community) : null} />;
}

import type { Metadata } from "next";
import { BookstoreBrowser } from "@/components/bookstore/BookstoreBrowser";
import { channelHref, configuredChannels } from "@/components/ContactLinks";
import { getProducts } from "@/lib/bookstore/catalog";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.bookstore.metaTitle };
}

/** Bookstore (sketch 13). Browse + cart; purchase goes through a contact request (no payment in Phase 1). */
export default async function BookstorePage() {
  const products = await getProducts();
  const channels = configuredChannels();
  const community = channels.includes("instagram") ? "instagram" : channels.includes("telegram") ? "telegram" : null;

  return <BookstoreBrowser products={products} communityHref={community ? channelHref(community) : null} />;
}

import type { Metadata } from "next";
import { DarkLandingApp } from "@/components/marketing/DarkLandingApp";
import { CONTACT } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.marketing.metaTitle };
}

/** Public marketing site at "/" — a dark, single-viewport, sidebar-tab app (Rose's reference), separate from the app itself (which opens at /launch, the PWA start_url). */
export default async function MarketingLandingPage() {
  const { m } = await getMessages();
  const siteDomain = CONTACT.website.replace(/^https?:\/\//, "");

  return <DarkLandingApp m={m} siteDomain={siteDomain} />;
}

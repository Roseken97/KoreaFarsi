import type { Metadata } from "next";

/** The installed app's splash screen (manifest start_url) — not a page for search results. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LaunchLayout({ children }: LayoutProps<"/launch">) {
  return children;
}

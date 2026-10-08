import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { UiSounds } from "@/components/shell/UiSounds";
import { I18nProvider } from "@/lib/i18n/client";
import { dirOf } from "@/lib/i18n/config";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/seo";
import { getCopyOverrides } from "@/lib/site-copy/queries";
import "./globals.css";

// PROVISIONAL typography (UX_SPECS: serif display for branding, sans body).
// Confirm exact families against KoreaFarsi-UX-Sketches.pdf.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], preload: false });

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  const description = m.homepage.metaDescription;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "KoreaFarsi", template: "%s | KoreaFarsi" },
    description,
    applicationName: "KoreaFarsi",
    keywords:
      locale === "fa"
        ? ["آموزش زبان کره‌ای", "یادگیری زبان کره‌ای", "کتاب آموزش کره‌ای", "الفبای کره‌ای", "هانگول", "دوره زبان کره‌ای", "کوریافارسی"]
        : ["learn Korean", "Korean for Persian speakers", "Korean course", "Hangul", "Korean books", "KoreaFarsi"],
    openGraph: {
      type: "website",
      siteName: "KoreaFarsi",
      title: m.homepage.metaTitle,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
    },
    twitter: { card: "summary_large_image", title: m.homepage.metaTitle, description },
    icons: {
      icon: [
        { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
    },
    // iOS: open full-screen from the home screen, no Safari address bar.
    appleWebApp: { capable: true, title: "KoreaFarsi", statusBarStyle: "default" },
    formatDetection: { telephone: false },
    // Google Search Console ownership check (the token from "HTML tag" verification).
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    // eNAMAD domain-ownership check: <meta name="enamad" content="…" />.
    other: { enamad: "53884137" },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const overrides = await getCopyOverrides(locale);
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${playfair.variable} ${inter.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider locale={locale} overrides={overrides}>{children}</I18nProvider>
        <ServiceWorkerRegister />
        <UiSounds />
      </body>
    </html>
  );
}

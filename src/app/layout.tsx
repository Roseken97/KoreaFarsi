import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { UiSounds } from "@/components/shell/UiSounds";
import { I18nProvider } from "@/lib/i18n/client";
import { dirOf } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { getCopyOverrides } from "@/lib/site-copy/queries";
import "./globals.css";

// PROVISIONAL typography (UX_SPECS: serif display for branding, sans body).
// Confirm exact families against KoreaFarsi-UX-Sketches.pdf.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], preload: false });

export const metadata: Metadata = {
  title: { default: "KoreaFarsi", template: "%s | KoreaFarsi" },
  description: "A Bridge to a Brighter You — learn Korean with a path designed for Persian speakers.",
  applicationName: "KoreaFarsi",
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
  // eNAMAD domain-ownership check: <meta name="enamad" content="…" />.
  other: { enamad: "53884137" },
};

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

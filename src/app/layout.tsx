import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/client";
import { dirOf } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

// PROVISIONAL typography (UX_SPECS: serif display for branding, sans body).
// Confirm exact families against KoreaFarsi-UX-Sketches.pdf.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], preload: false });

export const metadata: Metadata = {
  title: { default: "KoreaFarsi", template: "%s | KoreaFarsi" },
  description: "A Bridge to a Brighter You — learn Korean with a path designed for Persian speakers.",
  icons: { icon: "/brand/logo-512.png", apple: "/brand/logo-512.png" },
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${playfair.variable} ${inter.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}

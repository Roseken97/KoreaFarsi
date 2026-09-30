import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { connection } from "next/server";
import { getSettings } from "@/lib/store";
import "./globals.css";

const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"] });

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const s = getSettings();
  return {
    title: { default: `${s.businessName} | رزرو آنلاین`, template: `%s | ${s.businessName}` },
    description: s.tagline,
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf7f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

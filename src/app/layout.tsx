import type { Metadata, Viewport } from "next";
import { Archivo, Be_Vietnam_Pro } from "next/font/google";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-bevietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phú Quốc Media — Chụp ảnh & Quay phim Sự kiện tại Phú Quốc",
    template: "%s — Phú Quốc Media",
  },
  description:
    "Phú Quốc Media: đơn vị chụp ảnh, quay phim sự kiện, phim doanh nghiệp, flycam/FPV và in ảnh lấy ngay chuyên nghiệp tại Phú Quốc từ 2017.",
  applicationName: "Phú Quốc Media",
  openGraph: { siteName: "Phú Quốc Media", type: "website", images: ["/images/dji-0099.webp"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f4f9fa",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "vi";
  return (
    <html lang={locale} className={`${archivo.variable} ${beVietnam.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

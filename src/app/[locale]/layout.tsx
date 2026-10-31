import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingContact from "@/components/site/FloatingContact";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Cursor from "@/components/motion/Cursor";
import Loader from "@/components/motion/Loader";
import Analytics from "@/components/analytics/Analytics";
import CookieBanner from "@/components/analytics/CookieBanner";
import { getDictionary } from "@/lib/dictionaries";
import { href, isLocale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  return {
    title: {
      default: "Phu Quoc Media — Event Photography & Film in Phu Quoc",
      template: "%s — Phu Quoc Media",
    },
    description:
      "Phu Quoc Media: professional event photography & film, corporate video, drone/FPV and instant printing crew since 2017.",
    openGraph: { siteName: "Phu Quoc Media", type: "website", locale: "en_US", images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Phu Quoc Media" }] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: "Phú Quốc Media",
    legalName: "Công ty TNHH MTV Truyền thông Phú Quốc Media",
    url: siteUrl,
    image: `${siteUrl}/images/og-default.jpg`,
    logo: `${siteUrl}/images/logo-dark.png`,
    telephone: settings.phone,
    email: settings.email,
    foundingDate: "2017",
    taxID: settings.taxCode,
    openingHours: "Mo-Su 08:00-21:00",
    geo: { "@type": "GeoCoordinates", latitude: settings.mapCoords.split(",")[0]?.trim(), longitude: settings.mapCoords.split(",")[1]?.trim() },
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tổ 9, Ấp Suối Đá",
      addressLocality: "Dương Tơ, Phú Quốc",
      addressRegion: "Kiên Giang",
      addressCountry: "VN",
    },
    areaServed: "Phú Quốc",
    sameAs: [settings.facebook, settings.youtube, settings.instagram, settings.tiktok].filter(Boolean),
  };

  return (
    <>
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Header locale={locale} dict={dict} phone={settings.phone} email={settings.email} />
      <main id="main">{children}</main>
      <Footer locale={locale} dict={dict} settings={settings} />
      <FloatingContact dict={dict} settings={settings} />
      <CookieBanner labels={dict.cookie} policyHref={href(locale, "privacy")} enabled={Boolean(settings.gaId || settings.metaPixelId)} />
      <Analytics gaId={settings.gaId} pixelId={settings.metaPixelId} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

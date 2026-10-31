import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingContact from "@/components/site/FloatingContact";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Cursor from "@/components/motion/Cursor";
import Loader from "@/components/motion/Loader";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
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
      "Phu Quoc Media: Phu Quoc's leading event photography & film, corporate video, drone/FPV and instant printing crew since 2017.",
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
    image: `${siteUrl}/images/dji-0099.webp`,
    telephone: settings.phone,
    email: settings.email,
    foundingDate: "2017",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

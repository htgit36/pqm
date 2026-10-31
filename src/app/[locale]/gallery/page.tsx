import type { Metadata } from "next";
import { CtaBlock, PageHeader } from "@/components/site/Blocks";
import FbGallery, { FacebookFallback } from "@/components/site/FbGallery";
import { getDictionary } from "@/lib/dictionaries";
import { getFacebookAlbums } from "@/lib/facebook";
import { href, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.galleryTitle,
    description: dict.pages.galleryLead,
    alternates: { canonical: href(locale, "gallery"), languages: { vi: href("vi", "gallery"), en: href("en", "gallery") } },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [albums, settings] = await Promise.all([getFacebookAlbums(40), getSettings()]);

  return (
    <>
      <PageHeader eyebrow={dict.pages.galleryEyebrow} title={dict.pages.galleryTitle} lead={dict.pages.galleryLead} />
      <section className="container-x pb-28 md:pb-40">
        {albums.length > 0 ? (
          <FbGallery
            albums={albums}
            locale={locale}
            labels={{ photos: dict.pages.galleryPhotos, viewOnFacebook: dict.pages.galleryViewOnFacebook, close: dict.nav.close, view: dict.common.view }}
          />
        ) : (
          <FacebookFallback url={settings.facebook} text={dict.pages.galleryFallback} button={dict.pages.galleryFollow} />
        )}
      </section>
      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

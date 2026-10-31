import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LineReveal, Parallax, Reveal } from "@/components/motion/Reveal";
import { CtaBlock, Eyebrow } from "@/components/site/Blocks";
import { ArrowLeft, ArrowUpRight } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getService, getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { renderMarkdown, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  const title = tr(s, "title", locale);
  const place = locale === "en" ? "Phu Quoc" : "Phú Quốc";
  return {
    title: title.toLowerCase().includes(place.toLowerCase()) ? title : `${title} ${locale === "en" ? "in" : "tại"} ${place}`,
    description: tr(s, "summary", locale),
    openGraph: { images: s.coverImage ? [s.coverImage] : undefined },
    alternates: { canonical: href(locale, "services", slug), languages: { vi: href("vi", "services", slug), en: href("en", "services", slug) } },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const s = await getService(slug);
  if (!s) notFound();
  const dict = getDictionary(locale);
  const all = await getServices();
  const others = all.filter((x) => x.id !== s.id).slice(0, 4);

  const url = siteUrl + href(locale, "services", slug);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: tr(s, "title", locale),
      description: tr(s, "summary", locale),
      url,
      image: s.coverImage ? siteUrl + s.coverImage : undefined,
      areaServed: { "@type": "Place", name: locale === "en" ? "Phu Quoc, Vietnam" : "Phú Quốc, Việt Nam" },
      provider: { "@id": `${siteUrl}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: dict.nav.home, item: siteUrl + href(locale, "home") },
        { "@type": "ListItem", position: 2, name: dict.nav.services, item: siteUrl + href(locale, "services") },
        { "@type": "ListItem", position: 3, name: tr(s, "title", locale), item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="theme-dark relative flex min-h-[88svh] flex-col justify-end overflow-hidden pb-14 pt-40">
        <Parallax className="absolute inset-0" amount={10}>
          <Img src={s.coverImage} alt={tr(s, "title", locale)} priority />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="container-x relative">
          <Reveal>
            <Link href={href(locale, "services")} className="eyebrow inline-flex items-center gap-2 text-fg/80 hover:text-fg">
              <ArrowLeft className="h-4 w-4" /> {dict.nav.services}
            </Link>
          </Reveal>
          <LineReveal as="h1" lines={[tr(s, "title", locale)]} immediate delay={0.1} className="display mt-6 max-w-[18ch] text-[clamp(2.4rem,6vw,6rem)]" />
        </div>
      </section>

      <section className="container-x grid gap-14 py-20 md:grid-cols-12 md:py-32">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Reveal>
              <p className="text-xl leading-relaxed text-fg/85">{tr(s, "summary", locale)}</p>
              <Link href={href(locale, "contact")} className="btn btn-accent mt-10">
                {dict.nav.quote} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
        <Reveal className="md:col-span-7 md:col-start-6">
          <div className="prose-pqm" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(s, "body", locale)) }} />
        </Reveal>
      </section>

      <section className="container-x border-t border-line py-20 md:py-28">
        <Eyebrow>{dict.common.otherServices}</Eyebrow>
        <ul className="mt-10 border-t border-line">
          {others.map((o) => (
            <li key={o.id} className="border-b border-line">
              <Link href={href(locale, "services", o.slug)} className="group flex items-center justify-between gap-6 py-6">
                <span className="display text-[clamp(1.5rem,2.8vw,2.4rem)] transition-colors group-hover:text-accent">{tr(o, "title", locale)}</span>
                <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

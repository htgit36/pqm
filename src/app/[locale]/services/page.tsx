import Link from "next/link";
import type { Metadata } from "next";
import { Parallax, Reveal } from "@/components/motion/Reveal";
import { CtaBlock, PageHeader } from "@/components/site/Blocks";
import { ArrowUpRight } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.servicesTitle,
    description: dict.pages.servicesLead,
    alternates: { canonical: href(locale, "services"), languages: { vi: href("vi", "services"), en: href("en", "services") } },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const services = await getServices();

  return (
    <>
      <PageHeader eyebrow={`${services.length} ${dict.nav.services}`} title={dict.pages.servicesTitle} lead={dict.pages.servicesLead} />
      <section className="container-x space-y-24 pb-28 md:space-y-40 md:pb-44">
        {services.map((s, i) => (
          <article key={s.id} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
            <Link
              href={href(locale, "services", s.slug)}
              data-cursor={dict.common.view}
              className={`group relative block aspect-[4/3] overflow-hidden rounded-md md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}
            >
              <Parallax className="absolute inset-0" amount={8}>
                <Img src={s.coverImage} alt={tr(s, "title", locale)} sizes="(min-width:768px) 58vw, 100vw" className="transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105" />
              </Parallax>
            </Link>
            <Reveal className={`md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : ""}`}>
              <p className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="display mt-4 text-[clamp(1.9rem,3.4vw,3.25rem)]">{tr(s, "title", locale)}</h2>
              <p className="mt-6 text-lg leading-relaxed text-fg/70">{tr(s, "summary", locale)}</p>
              <Link href={href(locale, "services", s.slug)} className="btn btn-ghost mt-8">
                {dict.common.readMore} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </article>
        ))}
      </section>
      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

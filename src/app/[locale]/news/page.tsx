import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBlock, PageHeader } from "@/components/site/Blocks";
import { ArrowUpRight } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getPosts } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.newsTitle,
    description: dict.pages.newsLead,
    alternates: { canonical: href(locale, "news"), languages: { vi: href("vi", "news"), en: href("en", "news") } },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const posts = await getPosts();

  return (
    <>
      <PageHeader eyebrow="Journal" title={dict.pages.newsTitle} lead={dict.pages.newsLead} />
      <section className="container-x pb-28 md:pb-44">
        <ul className="border-t border-line">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-line">
              <Reveal>
                <Link href={href(locale, "news", post.slug)} data-cursor={dict.common.readMore} className="group grid items-center gap-6 py-10 md:grid-cols-12 md:gap-10">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-md md:col-span-4">
                    <Img src={post.coverImage} alt={tr(post, "title", locale)} sizes="(min-width:768px) 33vw, 100vw" className="transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105" />
                  </div>
                  <div className="md:col-span-7">
                    <time className="eyebrow" dateTime={post.publishedAt.toISOString()}>
                      {formatDate(post.publishedAt, locale)}
                    </time>
                    <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent">{tr(post, "title", locale)}</h2>
                    <p className="mt-4 max-w-2xl leading-relaxed text-fg/65">{tr(post, "excerpt", locale)}</p>
                  </div>
                  <div className="hidden justify-end md:col-span-1 md:flex">
                    <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

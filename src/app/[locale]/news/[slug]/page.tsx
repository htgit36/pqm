import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CtaBlock } from "@/components/site/Blocks";
import { ArrowLeft } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getPost } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { formatDate, renderMarkdown, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: tr(post, "title", locale),
    description: tr(post, "excerpt", locale),
    openGraph: { type: "article", images: post.coverImage ? [post.coverImage] : undefined, publishedTime: post.publishedAt.toISOString() },
    alternates: { canonical: href(locale, "news", slug), languages: { vi: href("vi", "news", slug), en: href("en", "news", slug) } },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const dict = getDictionary(locale);
  const title = tr(post, "title", locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: post.publishedAt.toISOString(),
    image: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
    author: { "@type": "Organization", name: "Phú Quốc Media" },
  };

  return (
    <>
      <article>
        <header className="container-x pb-14 pt-36 md:pt-48">
          <Reveal>
            <Link href={href(locale, "news")} className="eyebrow inline-flex items-center gap-2 hover:text-fg">
              <ArrowLeft className="h-4 w-4" /> {dict.nav.news}
            </Link>
          </Reveal>
          <LineReveal as="h1" lines={[title]} immediate delay={0.1} className="mt-8 max-w-[22ch] text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-tight" />
          <Reveal className="mt-8">
            <time className="eyebrow" dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt, locale)}
            </time>
          </Reveal>
        </header>
        {post.coverImage && (
          <div className="container-x">
            <div className="relative aspect-[16/8] overflow-hidden rounded-md">
              <Img src={post.coverImage} alt={title} priority sizes="100vw" />
            </div>
          </div>
        )}
        <div className="container-x py-20 md:py-28">
          <Reveal className="mx-auto max-w-3xl">
            <p className="mb-10 text-xl leading-relaxed text-fg">{tr(post, "excerpt", locale)}</p>
            <div className="prose-pqm" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(post, "body", locale)) }} />
          </Reveal>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LineReveal, Parallax, Reveal } from "@/components/motion/Reveal";
import { CtaBlock, Eyebrow, ProjectCard } from "@/components/site/Blocks";
import Gallery from "@/components/site/Gallery";
import { ArrowLeft, ArrowUpRight } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getProject, getProjects, getRelatedProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { categoryLabel, href, tr, type Locale } from "@/lib/i18n";
import { renderMarkdown, youtubeId } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return {
    title: tr(p, "title", locale),
    description: tr(p, "summary", locale) || undefined,
    openGraph: { images: p.coverImage ? [p.coverImage] : undefined },
    alternates: { canonical: href(locale, "work", slug), languages: { vi: href("vi", "work", slug), en: href("en", "work", slug) } },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const dict = getDictionary(locale);
  const [all, related] = await Promise.all([getProjects(), getRelatedProjects(p.category, p.id, 2)]);
  const idx = all.findIndex((x) => x.id === p.id);
  const next = all[(idx + 1) % all.length];
  const yt = youtubeId(p.videoUrl);
  const title = tr(p, "title", locale);
  const body = renderMarkdown(tr(p, "body", locale));
  const gallery = p.gallery ?? [];

  const meta = [
    { label: dict.common.client, value: p.client },
    { label: dict.common.category, value: categoryLabel(p.category, locale) },
  ].filter((m) => m.value);

  return (
    <>
      <section className="container-x pb-12 pt-36 md:pt-48">
        <Reveal>
          <Link href={href(locale, "work")} className="eyebrow inline-flex items-center gap-2 hover:text-fg">
            <ArrowLeft className="h-4 w-4" /> {dict.nav.work}
          </Link>
        </Reveal>
        <LineReveal as="h1" lines={[title]} immediate delay={0.1} className="display mt-6 max-w-[20ch] text-[clamp(2.75rem,8vw,8.5rem)]" />
        <Reveal className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} data-stagger>
              <p className="eyebrow">{m.label}</p>
              <p className="mt-2 text-lg">{m.value}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="container-x">
        {yt ? (
          <div className="aspect-video overflow-hidden rounded-md bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`}
              title={title}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            <Parallax className="absolute inset-0" amount={8}>
              <Img src={p.coverImage} alt={title} priority sizes="100vw" />
            </Parallax>
          </div>
        )}
      </section>

      {(body || p.externalUrl || tr(p, "summary", locale)) && (
        <section className="container-x grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <Reveal className="md:col-span-4">
            <p className="text-xl leading-relaxed text-fg/85">{tr(p, "summary", locale)}</p>
            {p.externalUrl && (
              <a href={p.externalUrl} target="_blank" rel="noopener" className="btn btn-ghost mt-8">
                {dict.common.viewMaterials} <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </Reveal>
          {body && (
            <Reveal className="md:col-span-7 md:col-start-6">
              <div className="prose-pqm" dangerouslySetInnerHTML={{ __html: body }} />
            </Reveal>
          )}
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x pb-20 md:pb-28">
          <Gallery images={gallery} title={title} closeLabel={dict.nav.close} />
        </section>
      )}

      {next && next.id !== p.id && (
        <Link href={href(locale, "work", next.slug)} data-cursor={dict.common.view} className="group relative block overflow-hidden border-t border-line">
          <div className="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-60">
            <Img src={next.coverImage} alt="" sizes="100vw" />
            <div className="absolute inset-0 bg-ink/50" />
          </div>
          <div className="container-x relative py-24 md:py-36">
            <p className="eyebrow">{dict.common.nextProject}</p>
            <p className="display mt-6 max-w-[18ch] text-[clamp(2.5rem,7vw,7rem)] transition-colors group-hover:text-accent">{tr(next, "title", locale)}</p>
          </div>
        </Link>
      )}

      {related.length > 0 && (
        <section className="container-x border-t border-line py-20 md:py-28">
          <Eyebrow>{dict.common.relatedWork}</Eyebrow>
          <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {related.map((r) => (
              <ProjectCard key={r.id} project={r} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

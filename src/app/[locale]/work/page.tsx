import type { Metadata } from "next";
import { CtaBlock, PageHeader, ProjectCard } from "@/components/site/Blocks";
import ProjectGrid from "@/components/site/ProjectGrid";
import { getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { categories, href, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.workTitle,
    description: dict.pages.workLead,
    alternates: { canonical: href(locale, "work"), languages: { vi: href("vi", "work"), en: href("en", "work") } },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const projects = await getProjects();
  const usedCats = new Set(projects.map((p) => p.category));

  return (
    <>
      <PageHeader eyebrow="Portfolio" title={dict.pages.workTitle} lead={dict.pages.workLead} />
      <section className="container-x pb-28 md:pb-44">
        <ProjectGrid
          allLabel={dict.common.all}
          categories={Object.entries(categories)
            .filter(([k]) => usedCats.has(k))
            .map(([key, l]) => ({ key, label: l[locale] }))}
          kinds={[
            { key: "video", label: dict.common.video },
            { key: "photo", label: dict.common.photo },
          ].filter((k) => projects.some((p) => p.kind === k.key))}
          items={projects.map((p, i) => ({
            id: p.id,
            category: p.category,
            kind: p.kind,
            node: <ProjectCard project={p} locale={locale} dict={dict} index={i} sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" />,
          }))}
        />
      </section>
      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/site/Blocks";
import { getLegal } from "@/lib/legal";
import { href, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { phoneDisplay } from "@/lib/utils";

async function load(locale: Locale) {
  const s = await getSettings();
  return getLegal("terms", locale, { taxCode: s.taxCode, address: locale === "en" ? s.addressEn : s.addressVi, phone: phoneDisplay(s.phone), email: s.email });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = await load(locale);
  return {
    title: doc.title,
    description: doc.lead,
    alternates: { canonical: href(locale, "terms"), languages: { vi: href("vi", "terms"), en: href("en", "terms") } },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const doc = await load(locale);
  return (
    <>
      <PageHeader eyebrow={doc.updated} title={doc.title} lead={doc.lead} />
      <section className="container-x pb-28 md:pb-40">
        <Reveal className="prose-pqm max-w-3xl md:ml-auto">
          {doc.sections.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}

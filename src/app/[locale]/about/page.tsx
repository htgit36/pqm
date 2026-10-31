import type { Metadata } from "next";
import { Counter, LineReveal, Parallax, Reveal, ScrubText } from "@/components/motion/Reveal";
import { CtaBlock, Eyebrow, Marquee, PageHeader } from "@/components/site/Blocks";
import Img from "@/components/site/Img";
import { getClients } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.aboutTitle,
    description: dict.pages.aboutLead,
    alternates: { canonical: href(locale, "about"), languages: { vi: href("vi", "about"), en: href("en", "about") } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const clients = await getClients();

  return (
    <>
      <PageHeader eyebrow="Phú Quốc Media" title={dict.pages.aboutTitle} lead={dict.pages.aboutLead} />

      <section className="relative h-[70svh] min-h-[420px] overflow-hidden">
        <Parallax className="absolute inset-0" amount={10}>
          <Img src="/images/deepc-101.webp" alt="Phú Quốc Media team building" sizes="100vw" />
        </Parallax>
      </section>

      <section className="container-x py-28 md:py-40">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Eyebrow index="01">{dict.home.introEyebrow}</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <ScrubText text={dict.home.intro} className="text-[clamp(1.6rem,3.2vw,3.2rem)] font-medium leading-[1.2] tracking-tight" />
          </div>
        </div>
        <Reveal className="mt-24 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {dict.home.stats.map((s, i) => (
            <div key={s.label} data-stagger className={`py-8 ${i % 2 === 1 ? "border-l border-line pl-4 md:pl-8" : ""} ${i === 2 ? "md:border-l md:pl-8" : ""}`}>
              <Counter value={s.value} suffix={s.suffix} className="display block text-[clamp(3rem,6vw,5.5rem)] tabular-nums" />
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-x grid gap-px md:grid-cols-2">
          {[
            { t: dict.pages.vision, b: dict.pages.visionBody, n: "02" },
            { t: dict.pages.mission, b: dict.pages.missionBody, n: "03" },
          ].map((x, i) => (
            <Reveal key={x.t} className={`py-20 md:py-28 ${i === 1 ? "border-t border-line md:border-l md:border-t-0 md:pl-14" : "md:pr-14"}`}>
              <Eyebrow index={x.n}>{x.t}</Eyebrow>
              <p className="mt-8 text-[clamp(1.4rem,2.4vw,2.2rem)] font-light leading-snug">{x.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-28 md:py-40">
        <Eyebrow index="04">{dict.pages.values}</Eyebrow>
        <ul className="mt-12 border-t border-line">
          {dict.pages.valuesList.map((v, i) => (
            <li key={v} className="border-b border-line">
              <LineReveal
                as="p"
                lines={[
                  <span key={v} className="flex items-baseline gap-6">
                    <span className="font-sans text-sm font-medium tracking-normal text-accent">0{i + 1}</span>
                    {v}
                  </span>,
                ]}
                className="display py-4 text-[clamp(3rem,10vw,9rem)]"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x grid gap-12 pb-28 md:grid-cols-12 md:pb-40">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-md md:col-span-6">
          <Img src="/images/dji-0952.webp" alt="" sizes="(min-width:768px) 50vw, 100vw" />
        </Reveal>
        <div className="md:col-span-5 md:col-start-8">
          <Eyebrow index="05">{dict.pages.equipment}</Eyebrow>
          <Reveal as="ul" className="mt-10 border-t border-line">
            {dict.pages.equipmentList.map((e) => (
              <li key={e} data-stagger className="flex items-center gap-4 border-b border-line py-5 text-lg">
                <span className="h-2 w-2 rotate-45 bg-accent" />
                {e}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-28 md:pb-40">
        <div className="grid gap-12 border-t border-line pt-20 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="06">{dict.home.whyEyebrow}</Eyebrow>
          </div>
          <Reveal className="grid gap-10 sm:grid-cols-2 md:col-span-8">
            {dict.home.why.map((w) => (
              <div key={w.title} data-stagger>
                <h3 className="text-2xl font-semibold">{w.title}</h3>
                <p className="mt-3 leading-relaxed text-fg/65">{w.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-28 md:pb-40" aria-label={dict.home.clientsEyebrow}>
        <div className="container-x mb-12">
          <Eyebrow index="07">{dict.home.clientsEyebrow}</Eyebrow>
        </div>
        <Marquee items={clients.map((c) => c.name)} />
      </section>

      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

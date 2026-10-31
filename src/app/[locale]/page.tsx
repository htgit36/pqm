import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesList from "@/components/home/ServicesList";
import WorkScroller from "@/components/home/WorkScroller";
import Showreel from "@/components/home/Showreel";
import { Counter, LineReveal, Reveal, ScrubText } from "@/components/motion/Reveal";
import { CtaBlock, Eyebrow, Marquee } from "@/components/site/Blocks";
import { ArrowUpRight } from "@/components/site/Icons";
import Img from "@/components/site/Img";
import { getClients, getFeaturedProjects, getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { categoryLabel, href, tr, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { youtubeId } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: { canonical: locale === "en" ? "/en" : "/", languages: { vi: "/", en: "/en" } } };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [settings, services, featured, clients] = await Promise.all([getSettings(), getServices(), getFeaturedProjects(), getClients()]);
  const mainServices = services.filter((s) => s.featured).slice(0, 4);

  return (
    <>
      <Hero dict={dict} image={settings.heroImage} video={settings.heroVideo || undefined} />

      {/* Giới thiệu + số liệu */}
      <section className="container-x py-28 md:py-44">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <Eyebrow index="01">{dict.home.introEyebrow}</Eyebrow>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <ScrubText text={dict.home.intro} className="text-[clamp(1.6rem,3.4vw,3.4rem)] font-medium leading-[1.18] tracking-tight" />
            <Reveal className="mt-10">
              <Link href={href(locale, "about")} className="btn btn-ghost">
                {dict.nav.about} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-24 grid grid-cols-2 border-t border-line md:mt-32 md:grid-cols-4">
          {dict.home.stats.map((s, i) => (
            <div key={s.label} data-stagger className={`border-b border-line py-8 pr-4 md:border-b-0 md:py-10 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-4 md:pl-8" : ""}`}>
              <Counter value={s.value} suffix={s.suffix} className="display block text-[clamp(3rem,7vw,6.5rem)] tabular-nums" />
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Dịch vụ */}
      <section className="container-x pb-28 md:pb-44">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow index="02">{dict.home.servicesEyebrow}</Eyebrow>
            </Reveal>
            <LineReveal lines={[dict.home.servicesTitle]} className="display mt-6 max-w-[16ch] text-[clamp(2.75rem,6.5vw,6.5rem)]" />
          </div>
          <Reveal>
            <Link href={href(locale, "services")} className="btn btn-ghost">
              {dict.common.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <ServicesList
          viewLabel={dict.common.view}
          items={mainServices.map((s) => ({ href: href(locale, "services", s.slug), title: tr(s, "title", locale), summary: tr(s, "summary", locale), image: s.coverImage }))}
        />
      </section>

      {/* Dự án chọn lọc */}
      <WorkScroller
        viewLabel={dict.common.view}
        header={
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow index="03">{dict.home.workEyebrow}</Eyebrow>
              <h2 className="display mt-6 max-w-[18ch] text-[clamp(2.75rem,6vw,6rem)]">{dict.home.workTitle}</h2>
            </div>
            <Link href={href(locale, "work")} className="btn btn-ghost self-start md:self-auto">
              {dict.common.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        }
        cards={featured.map((p) => ({
          href: href(locale, "work", p.slug),
          title: tr(p, "title", locale),
          client: p.client,
          category: categoryLabel(p.category, locale),
          kind: p.kind === "video" ? dict.common.video : dict.common.photo,
          image: p.coverImage,
        }))}
        endCard={
          <Link href={href(locale, "work")} data-cursor={dict.common.view} className="group flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-full border border-line text-center transition-colors hover:border-accent">
            <span className="display text-[clamp(2rem,3vw,3rem)] group-hover:text-accent">1000+</span>
            <span className="eyebrow">{dict.common.viewAll}</span>
          </Link>
        }
      />

      <Showreel
        image={settings.showreelImage}
        youtubeId={youtubeId(settings.showreelUrl)}
        fallbackUrl={settings.youtube}
        title={dict.home.reelTitle}
        sub={dict.home.reelSub}
        playLabel={dict.common.playReel}
        closeLabel={dict.nav.close}
      />

      {/* Vì sao chọn chúng tôi */}
      <section className="container-x py-28 md:py-44">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <Reveal>
                <Eyebrow index="04">{dict.home.whyEyebrow}</Eyebrow>
              </Reveal>
              <Reveal className="relative mt-10 hidden aspect-[3/4] overflow-hidden rounded-md md:block">
                <Img src="/images/dscf0024.webp" alt="" sizes="30vw" />
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
              {dict.home.why.map((w, i) => (
                <div key={w.title} data-stagger className="flex min-h-[280px] flex-col justify-between bg-ink p-8 md:p-10">
                  <span className="display text-5xl text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="mt-10 text-2xl font-semibold">{w.title}</h3>
                    <p className="mt-3 leading-relaxed text-fg/65">{w.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="border-y border-line bg-surface py-28 md:py-40">
        <div className="container-x">
          <Reveal>
            <Eyebrow index="05">{dict.home.processEyebrow}</Eyebrow>
          </Reveal>
          <LineReveal lines={[dict.home.processTitle]} className="display mt-6 max-w-[20ch] text-[clamp(2.5rem,5.5vw,5.5rem)]" />
          <Reveal className="mt-16 grid gap-px overflow-hidden border-t border-line md:mt-24 md:grid-cols-4">
            {dict.home.process.map((step, i) => (
              <div key={step.title} data-stagger className="group relative border-b border-line pb-10 pt-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 [&:not(:first-child)]:md:pl-8">
                <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
                <p className="text-sm tabular-nums text-accent">{locale === "vi" ? "Giai đoạn" : "Phase"} 0{i + 1}</p>
                <h3 className="mt-6 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 leading-relaxed text-fg/65">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Đối tác */}
      <section className="py-24 md:py-32" aria-label={dict.home.clientsEyebrow}>
        <div className="container-x mb-12">
          <Eyebrow index="06">{dict.home.clientsEyebrow}</Eyebrow>
        </div>
        <Marquee items={clients.map((c) => c.name)} />
      </section>

      {/* Founder */}
      <section className="container-x pb-28 md:pb-44">
        <div className="grid items-center gap-12 border-t border-line pt-20 md:grid-cols-12 md:pt-28">
          {/* Thay bằng ảnh chân dung Founder khi có: đặt <Img src="/media/..." /> vào khối này */}
          <Reveal className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md border border-line bg-surface md:col-span-4">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(62_224_197/0.18),transparent_60%)]" />
            <span className="display relative text-[clamp(7rem,16vw,14rem)] text-fg/90">
              T<span className="text-accent">L</span>
            </span>
            <span className="eyebrow absolute bottom-6 left-6">Founder · 2017</span>
          </Reveal>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <Eyebrow>{dict.home.founderEyebrow}</Eyebrow>
            </Reveal>
            <Reveal>
              <blockquote className="mt-8 text-[clamp(1.5rem,2.8vw,2.6rem)] font-light leading-[1.3] tracking-tight">
                <span className="text-accent">“</span>
                {dict.home.founderQuote}
                <span className="text-accent">”</span>
              </blockquote>
              <p className="mt-10 text-lg font-semibold">{dict.home.founderName}</p>
              <p className="text-sm text-muted">{dict.home.founderRole}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBlock locale={locale} dict={dict} />
    </>
  );
}

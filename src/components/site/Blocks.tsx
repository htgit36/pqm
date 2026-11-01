import Link from "next/link";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import Img from "./Img";
import { ArrowUpRight } from "./Icons";
import { categoryLabel, href, tr, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { Project } from "@/lib/db/schema";

export function Eyebrow({ children, index }: { children: React.ReactNode; index?: string }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-8 bg-line" />
      {children}
    </p>
  );
}

/** Đầu trang con: tiêu đề cực lớn + mô tả. */
export function PageHeader({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="container-x pb-16 pt-36 md:pb-24 md:pt-48">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <LineReveal as="h1" lines={[title]} immediate delay={0.15} className="display mt-6 text-[clamp(2.75rem,9vw,9rem)]" />
      {(lead || children) && (
        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          {lead && (
            <Reveal className="md:col-span-6 md:col-start-7" delay={0.3}>
              <p className="text-lg leading-relaxed text-fg/75 md:text-xl">{lead}</p>
            </Reveal>
          )}
          {children}
        </div>
      )}
    </section>
  );
}

export function ProjectCard({ project, locale, dict, index, sizes = "(min-width:768px) 50vw, 100vw", tall }: { project: Project; locale: Locale; dict: Dictionary; index?: number; sizes?: string; tall?: boolean }) {
  return (
    <Link href={href(locale, "work", project.slug)} data-cursor={dict.common.view} className="group block">
      <div className={`relative overflow-hidden rounded-md bg-raise ${tall ? "aspect-[4/5]" : "aspect-[3/2]"}`}>
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
          <Img src={project.coverImage} alt={tr(project, "title", locale)} sizes={sizes} />
        </div>
        {index !== undefined && <span className="absolute right-4 top-4 text-sm tabular-nums text-fg/80">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-accent md:text-xl">{tr(project, "title", locale)}</h3>
          <p className="mt-1 text-sm text-muted">{[project.client, categoryLabel(project.category, locale)].filter(Boolean).join(" · ")}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" />
      </div>
    </Link>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((name, i) => (
        <span key={i} className="flex items-center">
          <span className="display whitespace-nowrap px-6 text-[clamp(2rem,4.5vw,4rem)] text-fg/85 transition-colors hover:text-accent md:px-10">{name}</span>
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`group flex overflow-hidden ${className ?? ""}`}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

export function CtaBlock({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="theme-dark relative overflow-hidden bg-ink py-28 md:py-44">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow">{dict.home.ctaEyebrow}</p>
        </Reveal>
        <LineReveal
          lines={[dict.home.ctaTitle1, <span key="b" className="text-accent">{dict.home.ctaTitle2}</span>]}
          className="display mx-auto mt-8 max-w-[20ch] text-[clamp(2.25rem,6vw,6rem)]"
          lineClassName="[text-wrap:balance]"
        />
        <Reveal className="mt-12 flex justify-center" delay={0.2}>
          <Link href={href(locale, "contact")} className="btn btn-accent !min-h-14 !px-8 text-base">
            {dict.home.ctaButton} <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

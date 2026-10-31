"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Img from "@/components/site/Img";

gsap.registerPlugin(ScrollTrigger);

type Card = { href: string; title: string; client: string | null; category: string; kind: string; image: string | null };

// Dải dự án cuộn ngang khi cuộn dọc (máy tính); trên điện thoại là dải vuốt ngang.
export default function WorkScroller({ cards, viewLabel, header, endCard }: { cards: Card[]; viewLabel: string; header: React.ReactNode; endCard: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      t.querySelectorAll<HTMLElement>("[data-card-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-ink py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="container-x mb-12 lg:mb-14">{header}</div>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-4 [scrollbar-width:none] md:gap-6 lg:snap-none lg:overflow-visible lg:pb-0"
      >
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            data-cursor={viewLabel}
            className="group relative block w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[38vw] xl:w-[34vw]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-raise lg:aspect-[4/4.6]">
              <div data-card-img className="absolute inset-[-10%] transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105">
                <Img src={c.image} alt={c.title} sizes="(min-width:1024px) 38vw, 82vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur">
                {c.kind}
              </span>
              <span className="absolute right-4 top-4 text-sm tabular-nums text-fg/80">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold leading-snug md:text-2xl">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{[c.client, c.category].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          </Link>
        ))}
        <div className="flex w-[70vw] shrink-0 snap-start items-center justify-center sm:w-[40vw] lg:w-[28vw]">{endCard}</div>
      </div>
    </section>
  );
}

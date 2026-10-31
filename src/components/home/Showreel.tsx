"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Img from "@/components/site/Img";
import { Close, Play } from "@/components/site/Icons";

gsap.registerPlugin(ScrollTrigger);

// Dải showreel toàn màn hình: ảnh mở rộng khi cuộn tới, bấm để xem video YouTube.
export default function Showreel({ image, youtubeId, fallbackUrl, title, sub, playLabel, closeLabel }: {
  image: string;
  youtubeId: string | null;
  fallbackUrl: string;
  title: string;
  sub: string;
  playLabel: string;
  closeLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reel-frame]",
        { clipPath: "inset(14% 18% 14% 18% round 12px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 10%", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trigger = youtubeId ? (
    <button type="button" onClick={() => setOpen(true)} data-cursor="Play" className="group flex flex-col items-center gap-6" aria-label={playLabel}>
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110 md:h-32 md:w-32">
        <Play className="ml-1 h-8 w-8 md:h-10 md:w-10" />
      </span>
    </button>
  ) : (
    <a href={fallbackUrl} target="_blank" rel="noopener" data-cursor="Play" className="group flex flex-col items-center gap-6" aria-label={playLabel}>
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110 md:h-32 md:w-32">
        <Play className="ml-1 h-8 w-8 md:h-10 md:w-10" />
      </span>
    </a>
  );

  return (
    <section ref={root} className="relative h-[90svh] min-h-[560px] bg-ink">
      <div data-reel-frame className="grain absolute inset-0 overflow-hidden">
        <Img src={image} alt="" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/55" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 text-center">
        <p className="display text-[clamp(3.5rem,13vw,13rem)]">{title}</p>
        {trigger}
        <p className="max-w-sm text-fg/80">{sub}</p>
      </div>

      {open && youtubeId && (
        <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/95 p-4 backdrop-blur" onClick={() => setOpen(false)}>
          <button
            ref={closeBtn}
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-line hover:border-fg"
            aria-label={closeLabel}
          >
            <Close className="h-5 w-5" />
          </button>
          <div className="aspect-video w-full max-w-6xl overflow-hidden rounded-md bg-black" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

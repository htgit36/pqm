"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/dictionaries";
import { pickHeroImage, type HeroImage } from "@/lib/hero-images";

gsap.registerPlugin(ScrollTrigger);

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      const f = Math.floor((t % 1) * 25);
      const s = Math.floor(t) % 60;
      const m = Math.floor(t / 60) % 60;
      if (ref.current) ref.current.textContent = `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref} className="tabular-nums">00:00:00:00</span>;
}

export default function Hero({ dict, image, video, images }: { dict: Dictionary; image: string; video?: string; images: HeroImage[] }) {
  const root = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      // Điều hướng nội bộ về trang chủ: script trong HTML không chạy lại nên chọn ảnh tại đây.
      if (!img.getAttribute("src")) pickHeroImage(img, images);
      if (captionRef.current) captionRef.current.textContent = img.getAttribute("data-hero") ?? "";
    }
  }, [images]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set("[data-hero-line]", { yPercent: 115 });
        gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 20 });
        gsap.set("[data-hero-frame]", { autoAlpha: 0, scale: 1.08 });
      }
      const play = () => {
        if (reduce) return;
        gsap
          .timeline()
          .to("[data-hero-line]", { yPercent: 0, duration: 1.6, stagger: 0.1, ease: "expo.out" })
          .to("[data-hero-frame]", { autoAlpha: 1, scale: 1, duration: 1.4, ease: "expo.out" }, 0.2)
          .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.5);
      };
      if (window.__pqmIntro) play();
      else window.addEventListener("pqm:intro-done", play, { once: true });

      if (!reduce) {
        gsap.to("[data-hero-media]", {
          yPercent: 18,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-title]", {
          yPercent: -30,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="theme-dark grain relative flex h-[100svh] min-h-[620px] flex-col overflow-hidden" aria-label="Hero">
      <div data-hero-media className="absolute inset-0">
        <div className="absolute inset-0 animate-kenburns">
          {video ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={video} poster={image} autoPlay muted loop playsInline preload="metadata" />
          ) : (
            <>
              {/* Không có src ở HTML gốc: script ngay bên dưới chọn ảnh ngẫu nhiên trước khi vẽ trang. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} alt="Phú Quốc Media — sự kiện và flycam tại Phú Quốc" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" decoding="async" suppressHydrationWarning />
              <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `(${pickHeroImage.toString()})(document.currentScript.previousElementSibling,${JSON.stringify(images)})` }} />
              <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Phú Quốc Media" className="absolute inset-0 h-full w-full object-cover" />
              </noscript>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,7,0.6)_100%)]" />
      </div>

      {/* Khung ngắm máy quay */}
      <div data-hero-frame aria-hidden className="pointer-events-none absolute inset-x-[clamp(1rem,4vw,3.5rem)] bottom-[clamp(5.5rem,12vh,8rem)] top-[100px] hidden md:block">
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-8 w-8 border-fg/60 ${c}`} />
        ))}
        <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-fg/40" />
        <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-fg/40" />
        <div className="absolute left-5 top-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-fg/80">
          <span className="h-2 w-2 animate-blink rounded-full bg-rec" /> REC <Timecode />
        </div>
        <div className="absolute right-5 top-4 text-[11px] font-medium uppercase tracking-[0.2em] text-fg/70">4K · 25FPS · F2.8</div>
        {!video && <span ref={captionRef} className="absolute bottom-4 right-5 text-[11px] font-medium uppercase tracking-[0.2em] text-fg/60" />}
      </div>

      <div data-hero-title className="container-x relative mt-auto pb-[clamp(6rem,14vh,9rem)] pt-32">
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-fg/70">
          <span className="h-px w-10 bg-accent" />
          {dict.home.heroTop}
        </p>
        <h1 className="display text-[clamp(2.4rem,7vw,7.25rem)]">
          {[dict.home.heroLine1, dict.home.heroLine2].map((line) => (
            <span key={line} className="-mb-[0.2em] -mt-[0.24em] block overflow-hidden pb-[0.2em] pt-[0.24em]">
              <span data-hero-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-fade className="mt-5 font-sans text-[clamp(1.15rem,2vw,1.9rem)] font-light italic text-accent">
          — {dict.home.heroLine3}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
          <p data-hero-fade className="max-w-md pr-14 text-base text-fg/75 md:col-span-5 md:pr-0 md:text-lg">
            {dict.home.heroSub}
          </p>
        </div>
      </div>

      <div className="container-x absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-line py-5 pr-20 md:pr-[clamp(1rem,4vw,3.5rem)] text-[11px] font-medium uppercase tracking-[0.22em] text-fg/70">
        <span data-hero-fade>{dict.common.since}</span>
        <span data-hero-fade className="hidden md:inline">10°13′N · 103°57′E</span>
        <span data-hero-fade className="flex items-center gap-3">
          {dict.common.scroll}
          <span className="relative h-8 w-px overflow-hidden bg-fg/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-cine)_infinite] bg-accent" />
          </span>
        </span>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}

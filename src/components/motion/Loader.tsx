"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Màn hình mở đầu: đếm 0→100 kiểu timecode rồi kéo rèm lên. Chỉ chạy lần đầu trong phiên.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pqm-intro") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      window.__pqmIntro = true;
      window.dispatchEvent(new Event("pqm:intro-done"));
      const id = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(id);
    }
    window.__lenis?.stop();
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("pqm-intro", "1");
        } catch {}
        setDone(true);
        window.__lenis?.start();
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to("[data-loader-word]", { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.04 }, "+=0.1")
      .add(() => {
        window.__pqmIntro = true;
        window.dispatchEvent(new Event("pqm:intro-done"));
      })
      .to(root.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-[clamp(1rem,4vw,3.5rem)]" role="status" aria-label="Loading">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
        <span className="flex items-center gap-2 overflow-hidden">
          <span data-loader-word className="flex items-center gap-2">
            <span className="h-2 w-2 animate-blink rounded-full bg-rec" /> REC
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-loader-word className="block">10°13′N 103°57′E</span>
        </span>
      </div>
      <div className="overflow-hidden pt-[0.16em]">
        <div data-loader-word className="display text-[clamp(3.5rem,13vw,13rem)]">
          Phú Quốc<span className="text-accent">.</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="overflow-hidden">
          <span data-loader-word className="eyebrow block">Media Production Studio</span>
        </span>
        <span className="overflow-hidden">
          <span data-loader-word className="display block text-[clamp(2.5rem,6vw,5rem)] tabular-nums">
            <span ref={num}>000</span>
          </span>
        </span>
      </div>
    </div>
  );
}

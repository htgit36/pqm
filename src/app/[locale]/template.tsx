"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

declare global {
  interface Window {
    __pqmNavigated?: boolean;
  }
}

// Hiệu ứng chuyển trang: tấm màn đen trượt lên để lộ trang mới (không chạy ở lần tải đầu).
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = !window.__pqmNavigated;
    window.__pqmNavigated = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (first || reduce) {
      gsap.set(curtain.current, { display: "none" });
      return;
    }
    const tl = gsap
      .timeline()
      .set(curtain.current, { display: "block", yPercent: 0 })
      .to(curtain.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
      .from(content.current, { y: 80, duration: 1.1, ease: "expo.out", clearProps: "transform" }, "-=0.6")
      .set(curtain.current, { display: "none" });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden bg-surface" />
      <div ref={content}>{children}</div>
    </>
  );
}

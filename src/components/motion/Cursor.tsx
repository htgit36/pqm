"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Con trỏ tùy biến: chấm nhỏ + vòng tròn; phóng to và hiện nhãn khi rê vào phần tử có [data-cursor].
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    document.documentElement.classList.add("has-cursor");

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { autoAlpha: 1, x: e.clientX, y: e.clientY });
      }
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select, label");
      const text = t?.dataset.cursor ?? "";
      setLabel(text);
      gsap.to(ring.current, {
        scale: text ? 2.6 : t ? 1.6 : 1,
        backgroundColor: text ? "rgba(62,224,197,1)" : "rgba(62,224,197,0)",
        borderColor: text ? "rgba(62,224,197,1)" : "rgba(243,241,236,0.5)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    const enter = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-fg/50"
      >
        <span className="text-[5px] font-semibold uppercase tracking-[0.15em] text-ink">{label}</span>
      </div>
      <div ref={dot} aria-hidden className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent" />
    </>
  );
}

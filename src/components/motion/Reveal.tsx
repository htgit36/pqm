"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Hiện dần khi cuộn tới (fade + trượt lên). Con trực tiếp có [data-stagger] sẽ lần lượt xuất hiện. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 48,
  delay = 0,
  stagger = 0.08,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const items = el.querySelectorAll(":scope > [data-stagger]");
    const targets = items.length ? items : [el];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [y, delay, stagger]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Tiêu đề hiện từng dòng từ dưới mặt nạ lên. Mỗi phần tử của `lines` là một dòng. */
export function LineReveal({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-line]"), {
        yPercent: 110,
        rotate: 2,
        duration: 1.4,
        delay,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, immediate]);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.2em] -mt-[0.24em] block overflow-hidden pb-[0.2em] pt-[0.24em]">
          <span data-line className={`block origin-top-left ${lineClassName ?? ""}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Đoạn văn sáng dần từng chữ theo thanh cuộn. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-w]"),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/** Số đếm tăng dần khi xuất hiện. */
export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isYear = value > 1900 && value < 2100;
  const fmt = (n: number) => (isYear ? String(n) : n.toLocaleString("vi-VN")) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const obj = { v: isYear ? value - 40 : 0 };
    el.textContent = fmt(obj.v);
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = fmt(Math.round(obj.v));
        },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, suffix]);
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}

/** Ảnh trôi chậm hơn trang (parallax). Bọc quanh một khối có overflow-hidden. */
export function Parallax({ children, className, amount = 12 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -amount, scale: 1.15 },
        {
          yPercent: amount,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

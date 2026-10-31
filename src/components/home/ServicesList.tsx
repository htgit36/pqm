"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Img from "@/components/site/Img";
import { ArrowUpRight } from "@/components/site/Icons";

type Item = { href: string; title: string; summary: string; image: string | null };

// Danh sách dịch vụ dạng hàng lớn; trên máy tính, ảnh xem trước bay theo con trỏ.
export default function ServicesList({ items, viewLabel }: { items: Item[]; viewLabel: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !preview.current || !wrap.current) return;
    const xTo = gsap.quickTo(preview.current, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(preview.current, "y", { duration: 0.7, ease: "power3" });
    const el = wrap.current;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, { autoAlpha: active === null ? 0 : 1, scale: active === null ? 0.85 : 1, duration: 0.5, ease: "expo.out" });
  }, [active]);

  return (
    <div ref={wrap} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {items.map((item, i) => (
          <li key={item.href} className="border-b border-line">
            <Link
              href={item.href}
              data-cursor={viewLabel}
              onPointerEnter={() => setActive(i)}
              className="group grid grid-cols-12 items-center gap-4 py-7 md:py-10"
            >
              <span className="col-span-2 text-sm tabular-nums text-muted md:col-span-1">0{i + 1}</span>
              <span className="col-span-10 md:col-span-6">
                <span className="display block text-[clamp(2rem,5.2vw,5rem)] transition-[color,transform] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:text-accent">
                  {item.title}
                </span>
              </span>
              <span className="col-span-10 col-start-3 text-sm leading-relaxed text-fg/65 md:col-span-4 md:col-start-auto">{item.summary}</span>
              <span className="col-span-2 hidden justify-end md:col-span-1 md:flex">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 -ml-[150px] -mt-[100px] hidden h-[200px] w-[300px] overflow-hidden rounded-md md:block"
      >
        {items.map((item, i) => (
          <div key={item.href} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: active === i ? 1 : 0 }}>
            <Img src={item.image} alt="" sizes="300px" />
          </div>
        ))}
      </div>
    </div>
  );
}

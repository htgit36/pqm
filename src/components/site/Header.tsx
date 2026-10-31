"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { href, switchLocalePath, type Locale, type RouteKey } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { cn, phoneDisplay } from "@/lib/utils";
import { ArrowUpRight } from "./Icons";
import Logo from "./Logo";

const navKeys: RouteKey[] = ["services", "gallery", "about", "news", "contact"];

export default function Header({ locale, dict, phone, email }: { locale: Locale; dict: Dictionary; phone: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const panel = useRef<HTMLDivElement>(null);

  // Đóng menu khi chuyển trang.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Ẩn header khi cuộn xuống, hiện lại khi cuộn lên.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 300 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
        .fromTo("[data-menu-item]", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.35")
        .fromTo("[data-menu-fade]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, "-=0.6");
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      window.__lenis?.stop();
    } else {
      tl.current.timeScale(1.6).reverse();
      window.__lenis?.start();
    }
  }, [open]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Trang có ảnh tối ở đầu (trang chủ, chi tiết dịch vụ): header trong suốt, chữ sáng.
  const darkTop = /^\/(en)?$/.test(pathname) || /^\/(dich-vu|en\/services)\/[^/]+$/.test(pathname);
  const onDark = darkTop && !scrolled && !open;
  const other: Locale = locale === "vi" ? "en" : "vi";
  const isActive = (key: RouteKey) => {
    const base = href(locale, key);
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded bg-accent px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {dict.common.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-[transform,background-color,backdrop-filter] duration-700 ease-[var(--ease-expo)]",
          hidden && !open && "-translate-y-full",
          scrolled && !open && "bg-ink/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md",
          onDark && "theme-dark",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
          <Link href={href(locale, "home")} className="relative z-10 flex items-center gap-3" aria-label="Phú Quốc Media">
            <Logo priority variant={onDark ? "light" : "dark"} className="h-12 md:h-[60px]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navKeys.map((key) => (
              <Link
                key={key}
                href={href(locale, key)}
                className={cn("link-u py-2 text-sm font-medium tracking-wide transition-colors", isActive(key) ? "text-fg" : "text-fg/70 hover:text-fg")}
                aria-current={isActive(key) ? "page" : undefined}
              >
                {dict.nav[key as keyof Dictionary["nav"]]}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2 md:gap-4">
            <Link
              href={switchLocalePath(pathname, other)}
              className="flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-xs font-semibold uppercase tracking-[0.18em] text-fg/80 transition-colors hover:border-fg hover:text-fg"
              aria-label={other === "en" ? "English version" : "Phiên bản tiếng Việt"}
              hrefLang={other}
            >
              {other}
            </Link>
            <Link href={href(locale, "contact")} className="btn btn-accent hidden !min-h-11 !py-2.5 md:inline-flex">
              {dict.nav.quote}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? dict.nav.close : dict.nav.menu}
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-px w-full bg-fg transition-transform duration-500", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-fg transition-transform duration-500", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" ref={panel} className="invisible fixed inset-0 z-[55] flex flex-col bg-surface pt-28 lg:hidden" aria-hidden={!open}>
        <nav className="container-x flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
          {(["home", ...navKeys] as RouteKey[]).map((key, i) => (
            <div key={key} className="overflow-hidden">
              <Link
                data-menu-item
                href={href(locale, key)}
                tabIndex={open ? 0 : -1}
                className={cn("display flex items-baseline gap-4 py-1 text-[clamp(2.25rem,9vw,4rem)]", isActive(key) && key !== "home" && "text-accent")}
              >
                <span className="font-sans text-xs font-medium tracking-[0.2em] text-muted">0{i + 1}</span>
                {dict.nav[key as keyof Dictionary["nav"]]}
              </Link>
            </div>
          ))}
        </nav>
        <div className="container-x grid gap-4 border-t border-line py-8 text-sm text-muted sm:grid-cols-2">
          <a data-menu-fade href={`tel:${phone}`} tabIndex={open ? 0 : -1} className="flex items-center justify-between text-fg">
            {phoneDisplay(phone)} <ArrowUpRight className="h-4 w-4" />
          </a>
          <a data-menu-fade href={`mailto:${email}`} tabIndex={open ? 0 : -1} className="flex items-center justify-between text-fg">
            {email} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  );
}

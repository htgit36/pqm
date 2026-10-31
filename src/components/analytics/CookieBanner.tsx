"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "./track";

type Labels = { text: string; accept: string; decline: string; learn: string };

// Thanh một dòng, nhỏ gọn ở góc dưới trái; chỉ hiện khi website có bật GA/Pixel và khách chưa chọn.
export default function CookieBanner({ labels, policyHref, enabled }: { labels: Labels; policyHref: string; enabled: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(enabled && readConsent() === null));
    return () => cancelAnimationFrame(id);
  }, [enabled]);

  if (!open) return null;
  const choose = (v: "granted" | "denied") => {
    writeConsent(v);
    setOpen(false);
  };

  return (
    <div role="region" aria-label="Cookie" className="theme-dark fixed bottom-3 left-3 z-[60] flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-line bg-ink/95 py-2 pl-5 pr-2 text-xs shadow-xl shadow-black/40 backdrop-blur md:bottom-6 md:left-6">
      <p className="text-fg/80">
        {labels.text}{" "}
        <Link href={policyHref} className="link-u text-accent">
          {labels.learn}
        </Link>
      </p>
      <div className="flex gap-1.5">
        <button type="button" onClick={() => choose("denied")} className="rounded-full px-3 py-1.5 text-fg/70 hover:text-fg">
          {labels.decline}
        </button>
        <button type="button" onClick={() => choose("granted")} className="rounded-full bg-accent px-4 py-1.5 font-semibold text-ink">
          {labels.accept}
        </button>
      </div>
    </div>
  );
}

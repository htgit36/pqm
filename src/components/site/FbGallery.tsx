"use client";

import { useCallback, useState } from "react";
import type { FbAlbum } from "@/lib/facebook";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Gallery";
import { Facebook } from "./Icons";

type Labels = { photos: string; viewOnFacebook: string; close: string; view: string };

// Lưới album lấy từ bài đăng fanpage; bấm vào để xem toàn bộ ảnh của bài.
export default function FbGallery({ albums, labels, locale, compact }: { albums: FbAlbum[]; labels: Labels; locale: "vi" | "en"; compact?: boolean }) {
  const [open, setOpen] = useState<FbAlbum | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const fmt = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <>
      <div className={cn("grid gap-4", compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
        {albums.map((a, i) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setOpen(a)}
            data-cursor={labels.view}
            className={cn("theme-dark group relative block overflow-hidden rounded-md bg-raise text-left", !compact && i % 7 === 0 && "md:col-span-2 md:row-span-2")}
          >
            <div className={cn("relative", !compact && i % 7 === 0 ? "aspect-square" : "aspect-[4/5]")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.images[0]} alt={a.message.slice(0, 80) || "Phú Quốc Media"} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute right-3 top-3 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-medium tabular-nums backdrop-blur">
                {a.images.length} {labels.photos}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-fg/60">{fmt.format(new Date(a.date))}</p>
                {a.message && <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-fg">{a.message}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <Lightbox
          images={open.images}
          start={0}
          title={open.message.slice(0, 80) || "Phú Quốc Media"}
          caption={open.message}
          closeLabel={labels.close}
          onClose={close}
          link={{ href: open.url, label: labels.viewOnFacebook }}
        />
      )}
    </>
  );
}

export function FacebookFallback({ url, text, button }: { url: string; text: string; button: string }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-line bg-surface/60 px-6 py-16 text-center">
      <Facebook className="h-10 w-10 text-accent" />
      <p className="max-w-md text-fg/75">{text}</p>
      <a href={url} target="_blank" rel="noopener" className="btn btn-accent">
        {button}
      </a>
    </div>
  );
}

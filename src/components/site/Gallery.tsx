"use client";

import { useEffect, useState } from "react";
import Img from "./Img";
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from "./Icons";

/** Trình xem ảnh toàn màn hình (phím ←/→/Esc). */
export function Lightbox({ images, start, title, closeLabel, onClose, caption, link }: {
  images: string[];
  start: number;
  title: string;
  closeLabel: string;
  onClose: () => void;
  caption?: string;
  link?: { href: string; label: string };
}) {
  const [index, setIndex] = useState(start);
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [images.length, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="theme-dark fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink/95 backdrop-blur" onClick={onClose}>
      <div className="relative h-[72vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
        <Img src={images[index]} alt={`${title} ${index + 1}`} sizes="92vw" className="!object-contain" />
      </div>
      <div className="mt-5 flex max-w-3xl flex-col items-center gap-3 px-16 text-center" onClick={(e) => e.stopPropagation()}>
        {caption && <p className="line-clamp-2 text-sm text-fg/75">{caption}</p>}
        <p className="flex items-center gap-4 text-sm tabular-nums text-muted">
          {index + 1} / {images.length}
          {link && (
            <a href={link.href} target="_blank" rel="noopener" className="link-u inline-flex items-center gap-1 text-accent">
              {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </p>
      </div>
      <button type="button" onClick={onClose} autoFocus className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60" aria-label={closeLabel}>
        <Close className="h-5 w-5" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60" aria-label="Previous">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60" aria-label="Next">
            <ArrowRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}

/** Lưới ảnh của một dự án; bấm vào để mở trình xem toàn màn hình. */
export default function Gallery({ images, title, closeLabel }: { images: string[]; title: string; closeLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setIndex(i)} data-cursor="Zoom" className="group relative block w-full overflow-hidden rounded-md bg-raise" aria-label={`${title} ${i + 1}`}>
            <div className={`relative ${i % 4 === 1 ? "aspect-[3/4]" : "aspect-[3/2]"}`}>
              <Img src={src} alt={`${title} ${i + 1}`} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="transition-transform duration-700 group-hover:scale-105" />
            </div>
          </button>
        ))}
      </div>
      {index !== null && <Lightbox images={images} start={index} title={title} closeLabel={closeLabel} onClose={() => setIndex(null)} />}
    </>
  );
}

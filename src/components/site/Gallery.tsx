"use client";

import { useCallback, useEffect, useState } from "react";
import Img from "./Img";
import { ArrowLeft, ArrowRight, Close } from "./Icons";

// Lưới ảnh + trình xem ảnh toàn màn hình (phím ←/→/Esc).
export default function Gallery({ images, title, closeLabel }: { images: string[]; title: string; closeLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

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
      {index !== null && (
        <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/95 backdrop-blur" onClick={close}>
          <div className="relative h-[80vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Img src={images[index]} alt={`${title} ${index + 1}`} sizes="92vw" className="!object-contain" />
          </div>
          <button type="button" onClick={close} autoFocus className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60" aria-label={closeLabel}>
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
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tabular-nums text-muted">
            {index + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import type { HeroItem } from "@/lib/hero-images";
import { inputCls } from "./Fields";
import { uploadFiles } from "./upload";

const positions = [
  { value: "50% 20%", label: "Lấy nét phía trên" },
  { value: "50% 50%", label: "Lấy nét ở giữa" },
  { value: "50% 80%", label: "Lấy nét phía dưới" },
  { value: "20% 50%", label: "Lấy nét bên trái" },
  { value: "80% 50%", label: "Lấy nét bên phải" },
];

export default function HeroGalleryEditor({ defaultItems }: { defaultItems: HeroItem[] }) {
  const [items, setItems] = useState<HeroItem[]>(defaultItems);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const patch = (i: number, p: Partial<HeroItem>) => setItems((prev) => prev.map((it, k) => (k === i ? { ...it, ...p } : it)));
  const move = (i: number, d: number) =>
    setItems((prev) => {
      const j = i + d;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const { urls, errors } = await uploadFiles(files);
      setItems((prev) => [...prev, ...urls.map((src) => ({ src, vi: "", en: "", pos: "50% 50%", on: true }))]);
      if (errors.length) setError(errors.join("; "));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const active = items.filter((i) => i.on).length;

  return (
    <div className="space-y-4">
      <input type="hidden" name="gallery" value={JSON.stringify(items)} />
      <p className="text-sm text-muted">
        Đang bật <strong className="text-fg">{active}</strong>/{items.length} ảnh. Mỗi lượt truy cập trang chủ sẽ hiện ngẫu nhiên một ảnh đang bật.
      </p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it.src + i} className={`flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:flex-row ${it.on ? "" : "opacity-50"}`}>
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-md border border-line bg-raise sm:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: it.pos }} loading="lazy" />
            </div>
            <div className="grid flex-1 gap-3 md:grid-cols-2">
              <input value={it.vi} onChange={(e) => patch(i, { vi: e.target.value })} placeholder="Chú thích (Tiếng Việt)" className={inputCls} />
              <input value={it.en} onChange={(e) => patch(i, { en: e.target.value })} placeholder="Caption (English)" className={inputCls} />
              <select value={it.pos} onChange={(e) => patch(i, { pos: e.target.value })} className={inputCls}>
                {positions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <label className="mr-2 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={it.on} onChange={(e) => patch(i, { on: e.target.checked })} className="h-4 w-4 accent-[var(--color-accent)]" />
                  Hiển thị
                </label>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md border border-line px-2.5 py-1.5 hover:border-accent disabled:opacity-30" aria-label="Lên trước">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded-md border border-line px-2.5 py-1.5 hover:border-accent disabled:opacity-30" aria-label="Xuống sau">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => confirm("Xóa ảnh này khỏi danh sách? (file vẫn còn trong thư viện)") && setItems((p) => p.filter((_, k) => k !== i))}
                  className="rounded-md px-2.5 py-1.5 text-muted hover:text-rec"
                >
                  Xóa
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => input.current?.click()} disabled={busy} className="rounded-md border border-dashed border-line px-4 py-3 text-sm hover:border-accent disabled:opacity-50">
        {busy ? "Đang tải lên…" : "+ Thêm ảnh (chọn được nhiều ảnh)"}
      </button>
      {error && <p className="text-sm text-rec">{error}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}

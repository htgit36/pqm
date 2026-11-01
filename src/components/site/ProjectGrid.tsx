"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { id: number; category: string; kind: string; node: React.ReactNode };

// Bộ lọc dự án theo hạng mục và loại (video/ảnh), lọc phía trình duyệt.
export default function ProjectGrid({ items, categories, kinds, allLabel }: {
  items: Item[];
  categories: { key: string; label: string }[];
  kinds: { key: string; label: string }[];
  allLabel: string;
}) {
  const [cat, setCat] = useState("all");
  const [kind, setKind] = useState("all");
  const shown = useMemo(() => items.filter((i) => (cat === "all" || i.category === cat) && (kind === "all" || i.kind === kind)), [items, cat, kind]);

  const chip = (active: boolean) =>
    cn(
      "min-h-11 rounded-full border px-4 py-2 text-sm transition-colors",
      active ? "border-accent bg-accent text-ink" : "border-line text-fg/75 hover:border-fg hover:text-fg",
    );

  return (
    <>
      <div className="mb-14 flex flex-col gap-4 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {[{ key: "all", label: allLabel }, ...categories].map((c) => (
            <button key={c.key} type="button" className={chip(cat === c.key)} aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        {kinds.length > 1 && <div className="flex gap-2" role="group" aria-label="Type">
          {[{ key: "all", label: allLabel }, ...kinds].map((k) => (
            <button key={k.key} type="button" className={chip(kind === k.key)} aria-pressed={kind === k.key} onClick={() => setKind(k.key)}>
              {k.label}
            </button>
          ))}
        </div>}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length}
      </p>
      <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((i, idx) => (
          <div key={i.id} className={cn(idx % 3 === 1 && "xl:mt-24")}>
            {i.node}
          </div>
        ))}
      </div>
    </>
  );
}

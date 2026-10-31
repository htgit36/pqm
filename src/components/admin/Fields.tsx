"use client";

import { useRef, useState } from "react";
import { uploadFiles } from "./upload";

export const inputCls =
  "w-full rounded-md border border-line bg-ink px-3.5 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-dim focus:border-accent";

function Preview({ src }: { src: string }) {
  if (/\.(mp4|webm)$/i.test(src)) return <video src={src} className="h-full w-full object-cover" muted />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-full w-full object-cover" />;
}

export function ImageField({ name, defaultValue, accept = "image/*" }: { name: string; defaultValue?: string | null; accept?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const { urls, errors } = await uploadFiles(files);
      if (urls[0]) setValue(urls[0]);
      if (errors.length) setError(errors.join("; "));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-md border border-line bg-raise sm:w-48">
        {value ? <Preview src={value} /> : <span className="absolute inset-0 flex items-center justify-center text-xs text-dim">Chưa có</span>}
      </div>
      <div className="flex-1 space-y-2">
        <input name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder="/media/... hoặc https://..." className={inputCls} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="rounded-md border border-line px-3 py-2 text-sm hover:border-accent disabled:opacity-50">
            {busy ? "Đang tải lên…" : "Tải file lên"}
          </button>
          {value && (
            <button type="button" onClick={() => setValue("")} className="rounded-md px-3 py-2 text-sm text-muted hover:text-rec">
              Xóa
            </button>
          )}
        </div>
        {error && <p className="text-sm text-rec">{error}</p>}
        <input ref={input} type="file" accept={accept} hidden onChange={(e) => onFiles(e.target.files)} />
      </div>
    </div>
  );
}

export function GalleryField({ name, defaultValue }: { name: string; defaultValue?: string[] | null }) {
  const [items, setItems] = useState<string[]>(defaultValue ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const { urls, errors } = await uploadFiles(files);
      setItems((prev) => [...prev, ...urls]);
      if (errors.length) setError(errors.join("; "));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const move = (i: number, d: number) =>
    setItems((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={items.join("\n")} />
      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((src, i) => (
            <li key={src + i} className="group relative aspect-square overflow-hidden rounded-md border border-line bg-raise">
              <Preview src={src} />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/80 p-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="px-2 py-1" aria-label="Lên trước">←</button>
                <button type="button" onClick={() => setItems((p) => p.filter((_, k) => k !== i))} className="px-2 py-1 text-rec">Xóa</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 py-1" aria-label="Ra sau">→</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => input.current?.click()} disabled={busy} className="rounded-md border border-dashed border-line px-4 py-3 text-sm hover:border-accent disabled:opacity-50">
        {busy ? "Đang tải lên…" : "+ Thêm ảnh (chọn được nhiều ảnh)"}
      </button>
      {error && <p className="text-sm text-rec">{error}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}

export function MediaUploader() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const input = useRef<HTMLInputElement>(null);
  return (
    <div>
      <button type="button" onClick={() => input.current?.click()} disabled={busy} className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-50">
        {busy ? "Đang tải lên…" : "+ Tải file lên"}
      </button>
      {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}
      <input
        ref={input}
        type="file"
        multiple
        hidden
        accept="image/*,video/mp4,video/webm,application/pdf"
        onChange={async (e) => {
          if (!e.target.files?.length) return;
          setBusy(true);
          try {
            const { urls, errors } = await uploadFiles(e.target.files);
            setMsg(`Đã tải ${urls.length} file.${errors.length ? " Lỗi: " + errors.join("; ") : ""}`);
            window.location.reload();
          } catch (err) {
            setMsg((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}

export function ConfirmButton({ children, message, className }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => !confirm(message) && e.preventDefault()}>
      {children}
    </button>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="text-xs text-accent hover:underline"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok ? "Đã chép" : "Chép link"}
    </button>
  );
}

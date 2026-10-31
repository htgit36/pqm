"use client";

import { startTransition, useActionState } from "react";
import type { FieldDef } from "@/lib/admin-entities";
import type { SaveState } from "@/app/admin/actions";
import { GalleryField, ImageField, inputCls } from "./Fields";

type Values = Record<string, unknown>;

function toDateInput(v: unknown) {
  if (!v) return new Date().toISOString().slice(0, 10);
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function Field({ f, value }: { f: FieldDef; value: unknown }) {
  const str = value === null || value === undefined ? "" : String(value);
  switch (f.type) {
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" name={f.name} defaultChecked={value === undefined ? f.name === "published" : Boolean(value)} className="h-5 w-5 accent-[var(--color-accent)]" />
          <span>{f.label}</span>
        </label>
      );
    case "textarea":
      return <textarea name={f.name} defaultValue={str} rows={4} className={inputCls} />;
    case "markdown":
      return <textarea name={f.name} defaultValue={str} rows={14} className={`${inputCls} font-mono text-sm leading-relaxed`} />;
    case "image":
      return <ImageField name={f.name} defaultValue={str} />;
    case "gallery":
      return <GalleryField name={f.name} defaultValue={(value as string[] | null) ?? []} />;
    case "select":
      return (
        <select name={f.name} defaultValue={str || f.options?.[0]?.value} className={inputCls}>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "number":
      return <input type="number" name={f.name} defaultValue={str} className={inputCls} />;
    case "date":
      return <input type="date" name={f.name} defaultValue={toDateInput(value)} className={inputCls} />;
    case "url":
      return <input type="url" name={f.name} defaultValue={str} placeholder="https://" className={inputCls} />;
    default:
      return <input type="text" name={f.name} defaultValue={str} required={f.required} className={inputCls} />;
  }
}

export default function EntityForm({ fields, values, action }: {
  fields: FieldDef[];
  values: Values;
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, dispatch, pending] = useActionState(action, {});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => dispatch(data));
      }}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.half ? "" : "md:col-span-2"}>
            {f.type !== "checkbox" && (
              <label className="mb-2 block text-sm font-medium text-fg/85">
                {f.label} {f.required && <span className="text-accent">*</span>}
              </label>
            )}
            <Field f={f} value={values[f.name]} />
            {f.help && <p className="mt-1.5 text-xs text-muted">{f.help}</p>}
            {f.type === "markdown" && <p className="mt-1.5 text-xs text-muted">Định dạng Markdown: ## Tiêu đề, **đậm**, - gạch đầu dòng, [chữ](link).</p>}
          </div>
        ))}
      </div>
      {state.error && <p className="rounded-md border border-rec/40 bg-rec/10 p-4 text-sm text-rec">{state.error}</p>}
      <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur">
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-6 py-2.5 font-semibold text-ink disabled:opacity-60">
          {pending ? "Đang lưu…" : "Lưu"}
        </button>
      </div>
    </form>
  );
}

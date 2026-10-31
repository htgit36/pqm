"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { track } from "@/components/analytics/track";
import { href } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./Icons";

type F = Dictionary["contact"]["form"];

function Field({ name, label, f, error, required, type = "text", textarea, autoComplete, placeholder, inputMode }: {
  name: string;
  label: string;
  f: F;
  error?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "tel" | "email" | "text";
}) {
  const cls = cn(
    "peer w-full border-b bg-transparent pb-3 pt-1 text-lg outline-none transition-colors placeholder:text-dim focus:border-accent",
    error ? "border-rec" : "border-line",
  );
  const errId = `${name}-error`;
  return (
    <div className="relative">
      <label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} rows={4} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={cn(cls, "resize-none")} />
      ) : (
        <input id={name} name={name} type={type} required={required} autoComplete={autoComplete} inputMode={inputMode} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={cls} />
      )}
      {error && (
        <p id={errId} className="mt-2 text-sm text-rec">
          {f[error as keyof F] ?? f.required}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ locale, f, services }: { locale: Locale; f: F; services: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const err = state.errors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      form.current?.reset();
      track("generate_lead", "Lead");
    }
    if (state.errors) form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    else if (state.status !== "idle") status.current?.focus();
  }, [state]);

  return (
    <form
      ref={form}
      noValidate
      className="grid gap-10 sm:grid-cols-2"
      onSubmit={(e) => {
        // Gửi thủ công để form không tự xóa dữ liệu khi có lỗi.
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field name="name" label={f.name} f={f} error={err.name} required autoComplete="name" />
      <Field name="phone" label={f.phone} f={f} error={err.phone} required type="tel" inputMode="tel" autoComplete="tel" />
      <Field name="email" label={f.email} f={f} error={err.email} type="email" inputMode="email" autoComplete="email" />
      <Field name="company" label={f.company} f={f} autoComplete="organization" />
      <div>
        <label htmlFor="service" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {f.service}
        </label>
        <select id="service" name="service" defaultValue="" className="w-full cursor-pointer border-b border-line bg-transparent pb-3 pt-1 text-lg outline-none focus:border-accent [&>option]:bg-surface">
          <option value="">{f.servicePlaceholder}</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value={f.other}>{f.other}</option>
        </select>
      </div>
      <Field name="eventDate" label={f.eventDate} f={f} type="date" />
      <div className="sm:col-span-2">
        <Field name="message" label={f.message} f={f} textarea placeholder={f.messagePlaceholder} />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" aria-invalid={!!err.consent} aria-describedby={err.consent ? "consent-error" : undefined} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent,#3ee0c5)]" />
          <span>
            {f.consent}{" "}
            <Link href={href(locale, "privacy")} target="_blank" className="link-u text-accent">
              {f.consentLink}
            </Link>
            .
          </span>
        </label>
        {err.consent && (
          <p id="consent-error" className="mt-2 text-sm text-rec">
            {f.consentRequired}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{f.privacy}</p>
        <button type="submit" disabled={pending} className="btn btn-accent !min-h-14 !px-8 disabled:opacity-60">
          {pending ? f.sending : f.submit} <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      <div ref={status} tabIndex={-1} role="status" aria-live="polite" className="outline-none sm:col-span-2">
        {state.status === "success" && <p className="rounded-md border border-accent/40 bg-accent/10 p-5 text-accent">{f.success}</p>}
        {state.status === "error" && !state.errors && <p className="rounded-md border border-rec/40 bg-rec/10 p-5 text-rec">{f.error}</p>}
      </div>
    </form>
  );
}

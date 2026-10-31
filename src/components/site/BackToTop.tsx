"use client";

export default function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="link-u uppercase tracking-[0.18em] text-fg/80 hover:text-fg"
      onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
    >
      {label} ↑
    </button>
  );
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}

export function Flash({ params }: { params: Record<string, string | string[] | undefined> }) {
  const msg = params.saved ? "Đã lưu thay đổi." : params.deleted ? "Đã xóa." : null;
  if (!msg) return null;
  return <p className="mb-6 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">{msg}</p>;
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "rec" | "warn" }) {
  const cls = {
    muted: "bg-raise text-muted",
    accent: "bg-accent/15 text-accent",
    rec: "bg-rec/15 text-rec",
    warn: "bg-amber-400/15 text-amber-300",
  }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

import Link from "next/link";
import { desc, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { Badge, PageTitle } from "../ui";

export const metadata = { title: "Lượt truy cập" };

const TZ = "Asia/Ho_Chi_Minh";
const VN_OFFSET = 7 * 3_600_000;
const MAX_ROWS = 50_000;
const ranges = [
  { key: "today", label: "Hôm nay", days: 1 },
  { key: "7", label: "7 ngày", days: 7 },
  { key: "30", label: "30 ngày", days: 30 },
  { key: "90", label: "90 ngày", days: 90 },
] as const;

type View = typeof schema.pageViews.$inferSelect;

const fmt = (d: Date) => d.toLocaleString("vi-VN", { timeZone: TZ });
const dayKey = (d: Date) => new Date(d.getTime() + VN_OFFSET).toISOString().slice(0, 10);
const shortDay = (k: string) => `${k.slice(8)}/${k.slice(5, 7)}`;
const deviceLabel: Record<string, string> = { desktop: "Máy tính", mobile: "Điện thoại", tablet: "Máy tính bảng" };
const mediumTone = { search: "accent", social: "accent", campaign: "warn", referral: "muted", direct: "muted", internal: "muted" } as const;

function vnToday() {
  return Math.floor((Date.now() + VN_OFFSET) / 86_400_000) * 86_400_000 - VN_OFFSET;
}

function tally<T>(rows: T[], key: (r: T) => string | null | undefined, limit = 8) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function Panel({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface">
      <h2 className="border-b border-line px-5 py-3 font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">Chưa có dữ liệu.</p>
      ) : (
        <ul className="divide-y divide-line text-sm">
          {rows.map(([label, n]) => (
            <li key={label} className="relative px-5 py-2.5">
              <span className="absolute inset-y-0 left-0 bg-accent/10" style={{ width: `${Math.round((n / Math.max(total, 1)) * 100)}%` }} />
              <span className="relative flex justify-between gap-3">
                <span className="truncate">{label}</span>
                <span className="tabular-nums text-muted">{n}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function TrafficPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const range = ranges.find((r) => r.key === sp.range) ?? ranges[1];
  const ipFilter = (sp.ip ?? "").trim();

  // Mốc 0h (giờ Việt Nam) của ngày đầu tiên trong khoảng chọn.
  const todayStart = vnToday();
  const since = new Date(todayStart - (range.days - 1) * 86_400_000);

  const all: View[] = await db.select().from(schema.pageViews).where(gte(schema.pageViews.createdAt, since)).orderBy(desc(schema.pageViews.createdAt)).limit(MAX_ROWS);
  const views = ipFilter ? all.filter((v) => v.ip === ipFilter) : all;

  const sessions = new Set(views.map((v) => v.sessionId ?? `${v.ip}|${v.userAgent}`));
  const visitors = new Set(views.map((v) => v.ip));
  const entries = views.filter((v) => v.medium !== "internal");

  // Biểu đồ theo ngày.
  const perDay = new Map<string, number>();
  for (let i = 0; i < range.days; i++) perDay.set(dayKey(new Date(todayStart - (range.days - 1 - i) * 86_400_000 + 3_600_000)), 0);
  for (const v of views) perDay.set(dayKey(v.createdAt), (perDay.get(dayKey(v.createdAt)) ?? 0) + 1);
  const days = [...perDay.entries()];
  const peak = Math.max(...days.map(([, n]) => n), 1);

  // Gom theo IP.
  const byIp = new Map<string, { views: number; sessions: Set<string>; first: Date; last: Date; v: View }>();
  for (const v of views) {
    const g = byIp.get(v.ip);
    const sid = v.sessionId ?? `${v.ip}|${v.userAgent}`;
    if (!g) byIp.set(v.ip, { views: 1, sessions: new Set([sid]), first: v.createdAt, last: v.createdAt, v });
    else {
      g.views++;
      g.sessions.add(sid);
      if (v.createdAt < g.first) g.first = v.createdAt;
      // `v` giữ bản ghi có nguồn vào trang (nếu có) để hiển thị nguồn của IP.
      if (v.medium !== "internal") g.v = v;
    }
  }
  const ipRows = [...byIp.entries()].sort((a, b) => +b[1].last - +a[1].last).slice(0, 100);

  const cards = [
    { label: "Lượt xem trang", value: views.length },
    { label: "Phiên truy cập", value: sessions.size },
    { label: "IP khác nhau", value: visitors.size },
    { label: "Lượt vào từ ngoài", value: entries.length },
  ];
  const q = (r: string, ip?: string) => `/admin/traffic?range=${r}${ip ? `&ip=${encodeURIComponent(ip)}` : ""}`;

  return (
    <>
      <PageTitle title="Lượt truy cập">
        <div className="flex gap-1 rounded-md border border-line bg-surface p-1 text-sm">
          {ranges.map((r) => (
            <Link key={r.key} href={q(r.key, ipFilter)} className={`rounded px-3 py-1.5 ${r.key === range.key ? "bg-accent/15 text-accent" : "text-fg/75 hover:bg-raise"}`}>
              {r.label}
            </Link>
          ))}
        </div>
      </PageTitle>

      {ipFilter && (
        <p className="mb-6 flex flex-wrap items-center gap-3 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Đang xem riêng IP <strong>{ipFilter}</strong>
          <a href={`https://ipinfo.io/${encodeURIComponent(ipFilter)}`} target="_blank" rel="noopener noreferrer" className="underline">Tra cứu chi tiết ↗</a>
          <Link href={q(range.key)} className="ml-auto underline">Bỏ lọc</Link>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-line bg-surface p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{c.value.toLocaleString("vi-VN")}</p>
          </div>
        ))}
      </div>
      {all.length >= MAX_ROWS && <p className="mt-3 text-sm text-amber-300">Khoảng thời gian này có hơn {MAX_ROWS.toLocaleString("vi-VN")} lượt xem; chỉ thống kê phần mới nhất.</p>}

      <div className="mt-6 rounded-lg border border-line bg-surface p-5">
        <h2 className="mb-4 font-semibold">Lượt xem theo ngày</h2>
        <div className="flex h-36 items-end gap-[3px]" role="img" aria-label="Biểu đồ lượt xem theo ngày">
          {days.map(([k, n]) => (
            <div key={k} className="group relative flex h-full flex-1 items-end" title={`${shortDay(k)}: ${n} lượt xem`}>
              <div className="w-full rounded-t bg-accent/70 group-hover:bg-accent" style={{ height: `${Math.max((n / peak) * 100, n ? 3 : 0)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{shortDay(days[0][0])}</span>
          <span>{shortDay(days[days.length - 1][0])}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Nguồn truy cập" rows={tally(entries, (v) => v.source)} total={entries.length} />
        <Panel title="Trang được xem nhiều" rows={tally(views, (v) => v.path)} total={views.length} />
        <Panel title="Quốc gia" rows={tally(views, (v) => v.country)} total={views.length} />
        <Panel title="Thành phố" rows={tally(views, (v) => v.city)} total={views.length} />
        <Panel title="Thiết bị" rows={tally(views, (v) => deviceLabel[v.device] ?? v.device)} total={views.length} />
        <Panel title="Trình duyệt / Hệ điều hành" rows={tally(views, (v) => `${v.browser ?? "?"} · ${v.os ?? "?"}`)} total={views.length} />
      </div>

      {!ipFilter && (
        <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
          <h2 className="border-b border-line px-5 py-3 font-semibold">Theo địa chỉ IP ({visitors.size})</h2>
          {ipRows.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted">Chưa có lượt truy cập nào trong khoảng này.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <th className="px-5 py-2.5 font-medium">IP</th>
                    <th className="px-3 py-2.5 font-medium">Vị trí</th>
                    <th className="px-3 py-2.5 font-medium">Số lần vào</th>
                    <th className="px-3 py-2.5 font-medium">Lượt xem</th>
                    <th className="px-3 py-2.5 font-medium">Nguồn</th>
                    <th className="px-3 py-2.5 font-medium">Thiết bị</th>
                    <th className="px-5 py-2.5 font-medium">Lần đầu → gần nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ipRows.map(([ip, g]) => (
                    <tr key={ip} className="hover:bg-raise/50">
                      <td className="px-5 py-2.5 font-mono">
                        <Link href={q(range.key, ip)} className="text-accent hover:underline">{ip}</Link>
                      </td>
                      <td className="px-3 py-2.5">{[g.v.city, g.v.country].filter(Boolean).join(", ") || "—"}</td>
                      <td className="px-3 py-2.5 tabular-nums">{g.sessions.size}</td>
                      <td className="px-3 py-2.5 tabular-nums">{g.views}</td>
                      <td className="px-3 py-2.5"><Badge tone={mediumTone[g.v.medium as keyof typeof mediumTone] ?? "muted"}>{g.v.source}</Badge></td>
                      <td className="px-3 py-2.5">{deviceLabel[g.v.device] ?? g.v.device} · {g.v.browser}</td>
                      <td className="px-5 py-2.5 text-muted">{fmt(g.first)} → {fmt(g.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-3 font-semibold">Nhật ký truy cập gần đây</h2>
        {views.length === 0 ? (
          <p className="px-5 py-8 text-center text-muted">Chưa có dữ liệu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-line">
                  <th className="px-5 py-2.5 font-medium">Thời gian</th>
                  <th className="px-3 py-2.5 font-medium">IP</th>
                  <th className="px-3 py-2.5 font-medium">Trang</th>
                  <th className="px-3 py-2.5 font-medium">Nguồn</th>
                  <th className="px-3 py-2.5 font-medium">Vị trí</th>
                  <th className="px-5 py-2.5 font-medium">Thiết bị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {views.slice(0, 150).map((v) => (
                  <tr key={v.id} className="hover:bg-raise/50">
                    <td className="whitespace-nowrap px-5 py-2.5 text-muted">{fmt(v.createdAt)}</td>
                    <td className="px-3 py-2.5 font-mono">
                      <Link href={q(range.key, v.ip)} className="text-accent hover:underline">{v.ip}</Link>
                    </td>
                    <td className="max-w-[260px] truncate px-3 py-2.5" title={v.path}>{v.path}</td>
                    <td className="px-3 py-2.5" title={v.referrer ?? undefined}>{v.medium === "internal" ? <span className="text-muted">Nội bộ</span> : v.source}</td>
                    <td className="px-3 py-2.5">{[v.city, v.country].filter(Boolean).join(", ") || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-2.5">{deviceLabel[v.device] ?? v.device} · {v.browser} · {v.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-muted">
        Không tính bot/trình thu thập và lượt xem khi đang đăng nhập admin. “Số lần vào” = số phiên (mỗi lần mở tab mới). Dữ liệu được giữ 12 tháng.
      </p>
    </>
  );
}

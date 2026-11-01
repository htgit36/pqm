import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { Badge, PageTitle } from "./ui";
import { leadStatus } from "./leads/status";

export default async function Dashboard() {
  const count = async (t: typeof schema.projects | typeof schema.services | typeof schema.posts | typeof schema.leads) =>
    Number((await db.select({ n: sql<number>`count(*)` }).from(t))[0].n);
  const [projects, services, posts, leads, newLeads, recent] = await Promise.all([
    count(schema.projects),
    count(schema.services),
    count(schema.posts),
    count(schema.leads),
    db.select({ n: sql<number>`count(*)` }).from(schema.leads).where(eq(schema.leads.status, "new")),
    db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(6),
  ]);

  const cards = [
    { label: "Yêu cầu mới", value: Number(newLeads[0].n), href: "/admin/leads", accent: true },
    { label: "Tổng yêu cầu", value: leads, href: "/admin/leads" },
    { label: "Dự án", value: projects, href: "/admin/projects" },
    { label: "Dịch vụ", value: services, href: "/admin/services" },
    { label: "Bài viết", value: posts, href: "/admin/posts" },
  ];

  return (
    <>
      <PageTitle title="Tổng quan" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-lg border border-line bg-surface p-5 transition-colors hover:border-accent">
            <p className="text-sm text-muted">{c.label}</p>
            <p className={`mt-2 text-3xl font-semibold tabular-nums ${c.accent && c.value ? "text-accent" : ""}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">Yêu cầu báo giá gần đây</h2>
          <Link href="/admin/leads" className="text-sm text-accent hover:underline">
            Xem tất cả
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-muted">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium">
                    {l.name} · <a href={`tel:${l.phone}`} className="text-accent">{l.phone}</a>
                  </p>
                  <p className="text-sm text-muted">{[l.service, l.eventDate, l.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })].filter(Boolean).join(" · ")}</p>
                </div>
                <Badge tone={leadStatus[l.status]?.tone ?? "muted"}>{leadStatus[l.status]?.label ?? l.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { entities, isEntityKey } from "@/lib/admin-entities";
import { categoryLabel } from "@/lib/i18n";
import { Badge, Flash, PageTitle } from "../ui";

type Row = Record<string, unknown> & { id: number };

async function load(entity: string): Promise<Row[]> {
  switch (entity) {
    case "projects":
      return db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder), desc(schema.projects.id));
    case "services":
      return db.select().from(schema.services).orderBy(asc(schema.services.sortOrder));
    case "posts":
      return db.select().from(schema.posts).orderBy(desc(schema.posts.publishedAt));
    case "clients":
      return db.select().from(schema.clients).orderBy(asc(schema.clients.sortOrder));
    case "testimonials":
      return db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder));
  }
  return [];
}

export default async function EntityList({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<Record<string, string>> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  const def = entities[entity];
  const rows = await load(entity);
  const sp = await searchParams;
  const image = (r: Row) => (r.coverImage ?? r.logo ?? r.avatar) as string | null;

  return (
    <>
      <PageTitle title={`${def.label} (${rows.length})`}>
        <Link href={`/admin/${entity}/new`} className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-ink">
          + Thêm {def.singular}
        </Link>
      </PageTitle>
      <Flash params={sp} />
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/${entity}/${r.id}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-raise">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-raise">
                  {image(r) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image(r)!} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{String(r[def.titleField] ?? "")}</p>
                  <p className="truncate text-sm text-muted">
                    {entity === "projects" && [r.client, categoryLabel(String(r.category), "vi"), r.kind === "video" ? "Video" : "Hình ảnh"].filter(Boolean).join(" · ")}
                    {entity === "posts" && (r.publishedAt as Date).toLocaleDateString("vi-VN")}
                    {entity === "services" && String(r.slug)}
                    {entity === "clients" && String(r.url ?? "")}
                    {entity === "testimonials" && String(r.authorRoleVi ?? "")}
                  </p>
                </div>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  {r.featured === true && <Badge tone="accent">Nổi bật</Badge>}
                  {r.published === false && <Badge>Đang ẩn</Badge>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

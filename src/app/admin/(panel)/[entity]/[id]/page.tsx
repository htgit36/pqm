import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { entities, isEntityKey, type EntityKey } from "@/lib/admin-entities";
import EntityForm from "@/components/admin/EntityForm";
import { ConfirmButton } from "@/components/admin/Fields";
import { deleteEntity, saveEntity } from "../../../actions";
import { PageTitle } from "../../ui";

const tables = { projects: schema.projects, services: schema.services, posts: schema.posts, clients: schema.clients, testimonials: schema.testimonials };

export default async function EntityEdit({ params }: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await params;
  if (!isEntityKey(entity)) notFound();
  const def = entities[entity];
  const isNew = id === "new";
  const numId = isNew ? null : Number(id);
  if (!isNew && !Number.isInteger(numId)) notFound();

  let values: Record<string, unknown> = {};
  if (numId) {
    const table = tables[entity as EntityKey];
    const [row] = await db.select().from(table).where(eq(table.id, numId)).limit(1);
    if (!row) notFound();
    values = row;
  }

  return (
    <div className="max-w-5xl">
      <Link href={`/admin/${entity}`} className="text-sm text-muted hover:text-fg">
        ← {def.label}
      </Link>
      <PageTitle title={isNew ? `Thêm ${def.singular}` : String(values[def.titleField] ?? "")}>
        {!isNew && def.publicPath && Boolean(values.slug) && (
          <a href={`${def.publicPath}${values.slug}`} target="_blank" className="text-sm text-accent hover:underline">
            Xem trên website ↗
          </a>
        )}
      </PageTitle>
      <div className="rounded-lg border border-line bg-surface px-6 pt-6">
        <EntityForm fields={def.fields} values={values} action={saveEntity.bind(null, entity, numId)} />
      </div>
      {numId && (
        <form action={deleteEntity.bind(null, entity, numId)} className="mt-6">
          <ConfirmButton message={`Xóa ${def.singular} này? Không thể hoàn tác.`} className="text-sm text-muted hover:text-rec">
            Xóa {def.singular}
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}

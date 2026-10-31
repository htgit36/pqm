import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ConfirmButton, inputCls } from "@/components/admin/Fields";
import { deleteLead, updateLead } from "../../actions";
import { Badge, Flash, PageTitle } from "../ui";
import { leadStatus } from "./status";

export const metadata = { title: "Yêu cầu báo giá" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const leads = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(500);

  return (
    <>
      <PageTitle title={`Yêu cầu báo giá (${leads.length})`} />
      <Flash params={sp} />
      {leads.length === 0 && <p className="rounded-lg border border-line bg-surface p-10 text-center text-muted">Chưa có yêu cầu nào.</p>}
      <div className="space-y-4">
        {leads.map((l) => (
          <details key={l.id} className="group rounded-lg border border-line bg-surface open:border-fg/25">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium">
                  {l.name} <span className="text-muted">· {l.company || "Cá nhân"}</span>
                </p>
                <p className="text-sm text-muted">
                  {l.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · {l.service || "—"} · {l.locale.toUpperCase()}
                </p>
              </div>
              <Badge tone={leadStatus[l.status]?.tone ?? "muted"}>{leadStatus[l.status]?.label ?? l.status}</Badge>
            </summary>
            <div className="grid gap-6 border-t border-line px-5 py-5 md:grid-cols-2">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted">Điện thoại</dt>
                  <dd>
                    <a href={`tel:${l.phone}`} className="text-accent">{l.phone}</a> ·{" "}
                    <a href={`https://zalo.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="text-accent">Zalo</a>
                  </dd>
                </div>
                {l.email && (
                  <div>
                    <dt className="text-muted">Email</dt>
                    <dd><a href={`mailto:${l.email}`} className="text-accent">{l.email}</a></dd>
                  </div>
                )}
                {l.eventDate && (
                  <div>
                    <dt className="text-muted">Ngày dự kiến</dt>
                    <dd>{l.eventDate}</dd>
                  </div>
                )}
                {l.message && (
                  <div>
                    <dt className="text-muted">Nội dung</dt>
                    <dd className="whitespace-pre-wrap">{l.message}</dd>
                  </div>
                )}
              </dl>
              <div>
                <form action={updateLead.bind(null, l.id)} className="space-y-3">
                  <select name="status" defaultValue={l.status} className={inputCls}>
                    {Object.entries(leadStatus).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <textarea name="note" defaultValue={l.note ?? ""} rows={3} placeholder="Ghi chú nội bộ…" className={inputCls} />
                  <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink">Cập nhật</button>
                </form>
                <form action={deleteLead.bind(null, l.id)} className="mt-3">
                  <ConfirmButton message="Xóa yêu cầu này?" className="text-sm text-muted hover:text-rec">Xóa yêu cầu</ConfirmButton>
                </form>
              </div>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

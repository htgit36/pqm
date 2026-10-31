"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { entities, isEntityKey, type EntityKey } from "@/lib/admin-entities";
import { db, schema } from "@/lib/db";
import { settingDefaults, type SettingKey } from "@/lib/settings";
import { deleteMedia } from "@/lib/storage";
import { slugify } from "@/lib/utils";

const tables = {
  projects: schema.projects,
  services: schema.services,
  posts: schema.posts,
  clients: schema.clients,
  testimonials: schema.testimonials,
} as const;

// ——— Đăng nhập ———
const attempts = new Map<string, { n: number; until: number }>();

export async function login(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const a = attempts.get(ip);
  if (a && a.until > Date.now()) return { error: "Đăng nhập sai quá nhiều lần. Thử lại sau 15 phút." };

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 15 * 60_000 : 0 });
    return { error: "Sai tên đăng nhập hoặc mật khẩu." };
  }
  attempts.delete(ip);
  await createSession(username);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ——— Nội dung (dự án, dịch vụ, tin tức, đối tác) ———
export type SaveState = { error?: string };

export async function saveEntity(entity: string, id: number | null, _: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  if (!isEntityKey(entity)) return { error: "Loại nội dung không hợp lệ." };
  const def = entities[entity];
  const values: Record<string, unknown> = {};

  for (const f of def.fields) {
    const raw = formData.get(f.name);
    const str = typeof raw === "string" ? raw.trim() : "";
    switch (f.type) {
      case "checkbox":
        values[f.name] = raw === "on";
        break;
      case "number":
        values[f.name] = str === "" ? (f.name === "sortOrder" ? 0 : null) : Number(str);
        break;
      case "gallery":
        values[f.name] = str ? str.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
        break;
      case "date":
        values[f.name] = str ? new Date(`${str}T09:00:00+07:00`) : null;
        break;
      default:
        values[f.name] = str || null;
    }
    if (f.required && (values[f.name] === null || values[f.name] === "")) return { error: `Vui lòng nhập “${f.label}”.` };
    if (f.type === "number" && values[f.name] !== null && Number.isNaN(values[f.name])) return { error: `“${f.label}” phải là số.` };
  }

  if ("slug" in values || def.fields.some((f) => f.name === "slug")) {
    values.slug = slugify(String(values.slug || values.titleVi || ""));
    if (!values.slug) return { error: "Không tạo được đường dẫn (slug)." };
  }
  for (const k of ["titleEn"]) if (k in values && values[k] === null) values[k] = "";

  const table = tables[entity as EntityKey];
  try {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.update(table).set(values as any).where(eq(table.id, id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(table).values(values as any);
    }
  } catch (err) {
    const code = (err as { cause?: { code?: string }; code?: string }).cause?.code ?? (err as { code?: string }).code;
    if (code === "ER_DUP_ENTRY") return { error: "Đường dẫn (slug) đã tồn tại, hãy chọn tên khác." };
    console.error("[admin] save", err);
    return { error: "Không lưu được. Kiểm tra lại dữ liệu." };
  }
  redirect(`/admin/${entity}?saved=1`);
}

export async function deleteEntity(entity: string, id: number) {
  await requireAdmin();
  if (!isEntityKey(entity)) return;
  const table = tables[entity];
  await db.delete(table).where(eq(table.id, id));
  redirect(`/admin/${entity}?deleted=1`);
}

// ——— Yêu cầu báo giá ———
export async function updateLead(id: number, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "new");
  const note = String(formData.get("note") ?? "").trim() || null;
  await db.update(schema.leads).set({ status, note }).where(eq(schema.leads.id, id));
  redirect(`/admin/leads?saved=1`);
}

export async function deleteLead(id: number) {
  await requireAdmin();
  await db.delete(schema.leads).where(eq(schema.leads.id, id));
  redirect(`/admin/leads?deleted=1`);
}

// ——— Cài đặt ———
export async function saveSettings(formData: FormData) {
  await requireAdmin();
  for (const key of Object.keys(settingDefaults) as SettingKey[]) {
    const value = String(formData.get(key) ?? "").trim();
    await db.insert(schema.settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
  }
  redirect("/admin/settings?saved=1");
}

// ——— Thư viện file ———
export async function removeMedia(url: string) {
  await requireAdmin();
  await deleteMedia(url);
  redirect("/admin/media?deleted=1");
}

import fs from "node:fs";
import path from "node:path";
import { eq, inArray, sql } from "drizzle-orm";
import { db, pool, schema } from "./index";
import { migrations } from "./migrations.generated";
import { featuredProjects } from "./projects-data";
import { seedClients, seedPosts, seedProjects, seedServices } from "./seed-data";

const dataPatches = [
  {
    tag: "data_2026_11_invoice_wording",
    statements: [
      "UPDATE `services` SET `body_vi` = REPLACE(`body_vi`, 'xuất hóa đơn VAT 8% cho mọi giao dịch', 'có hóa đơn tài chính hợp lệ'), `body_en` = REPLACE(`body_en`, 'VAT invoices for every engagement', 'valid financial invoices')",
      "UPDATE `posts` SET `body_vi` = REPLACE(`body_vi`, 'xuất hóa đơn VAT giúp', 'hóa đơn tài chính hợp lệ giúp'), `body_en` = REPLACE(`body_en`, 'VAT invoices keeps', 'valid financial invoices keeps')",
    ],
  },
];

// Chỉ dùng ở máy local (APPLY_SNAPSHOT=1): áp bản chụp nội dung lấy từ host để local giống host.
async function applySnapshot() {
  if (process.env.APPLY_SNAPSHOT !== "1") return;
  const file = path.join(/* turbopackIgnore: true */ process.cwd(), "data", "host-snapshot.json");
  if (!fs.existsSync(file)) return;
  const snap = JSON.parse(fs.readFileSync(file, "utf8")) as { settings?: Record<string, string>; serviceCovers?: Record<string, string> };
  for (const [key, value] of Object.entries(snap.settings ?? {})) {
    await db.insert(schema.settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
  }
  for (const [slug, coverImage] of Object.entries(snap.serviceCovers ?? {})) {
    await db.update(schema.services).set({ coverImage }).where(eq(schema.services.slug, slug));
  }
  console.log("[db] Đã áp bản chụp nội dung từ host.");
}

// Chạy khi server khởi động (src/instrumentation.ts): tạo/cập nhật bảng từ các
// migration đã nhúng sẵn, rồi nạp dữ liệu mẫu nếu cơ sở dữ liệu còn trống.
export async function runMigrations() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS `__app_migrations` (`tag` varchar(191) NOT NULL PRIMARY KEY, `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  );
  const [rows] = await pool.query("SELECT `tag` FROM `__app_migrations`");
  const applied = new Set((rows as { tag: string }[]).map((r) => r.tag));

  for (const m of migrations) {
    if (applied.has(m.tag)) continue;
    for (const statement of m.statements) {
      try {
        await pool.query(statement);
      } catch (err) {
        // Bảng/cột/chỉ mục đã có sẵn (database tạo bằng cách cũ) → bỏ qua.
        const code = (err as { code?: string }).code;
        if (!["ER_TABLE_EXISTS_ERROR", "ER_DUP_FIELDNAME", "ER_DUP_KEYNAME"].includes(code ?? "")) throw err;
      }
    }
    await pool.query("INSERT INTO `__app_migrations` (`tag`) VALUES (?)", [m.tag]);
    console.log(`[db] Đã áp dụng migration ${m.tag}`);
  }

  // Bản vá nội dung (chạy một lần) cho dữ liệu đã nạp trước đó.
  for (const patch of dataPatches) {
    if (applied.has(patch.tag)) continue;
    for (const statement of patch.statements) await pool.query(statement);
    await pool.query("INSERT INTO `__app_migrations` (`tag`) VALUES (?)", [patch.tag]);
    console.log(`[db] Đã áp dụng bản vá ${patch.tag}`);
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.services);
  if (Number(count) === 0) {
    await db.insert(schema.services).values(seedServices);
    await db.insert(schema.clients).values(seedClients);
    await db.insert(schema.posts).values(seedPosts);
    console.log("[db] Đã nạp dữ liệu mẫu.");
  }
  await importFeaturedProjects(applied);
  await applySnapshot();
}

// Nạp các dự án tiêu biểu một lần. Dự án mẫu cũ được ẩn (không xóa) và các dự án
// đã có cùng slug được giữ nguyên, nên nội dung chỉnh trong Admin không bị ghi đè.
async function importFeaturedProjects(applied: Set<string>) {
  const tag = "data_projects_featured_v1";
  if (applied.has(tag)) return;
  const oldSlugs = seedProjects.map((p) => p.slug);
  if (oldSlugs.length) await db.update(schema.projects).set({ published: false }).where(inArray(schema.projects.slug, oldSlugs));
  const existing = new Set((await db.select({ slug: schema.projects.slug }).from(schema.projects)).map((r) => r.slug));
  const fresh = featuredProjects.filter((p) => !existing.has(p.slug));
  if (fresh.length) await db.insert(schema.projects).values(fresh.map((p) => ({ ...p, kind: "photo" })));
  await pool.query("INSERT INTO `__app_migrations` (`tag`) VALUES (?)", [tag]);
  console.log(`[db] Đã nạp ${fresh.length} dự án tiêu biểu.`);
}

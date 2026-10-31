import { sql } from "drizzle-orm";
import { db, pool, schema } from "./index";
import { migrations } from "./migrations.generated";
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
  if (Number(count) > 0) return;

  await db.insert(schema.services).values(seedServices);
  await db.insert(schema.projects).values(seedProjects);
  await db.insert(schema.clients).values(seedClients);
  await db.insert(schema.posts).values(seedPosts);
  console.log("[db] Đã nạp dữ liệu mẫu.");
}

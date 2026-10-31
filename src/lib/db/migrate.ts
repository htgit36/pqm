import path from "node:path";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, schema } from "./index";
import { seedClients, seedPosts, seedProjects, seedServices } from "./seed-data";

// Chạy khi server khởi động (src/instrumentation.ts): tạo/cập nhật bảng,
// và nạp dữ liệu mẫu nếu cơ sở dữ liệu còn trống.
export async function runMigrations() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.services);
  if (Number(count) > 0) return;

  await db.insert(schema.services).values(seedServices);
  await db.insert(schema.projects).values(seedProjects);
  await db.insert(schema.clients).values(seedClients);
  await db.insert(schema.posts).values(seedPosts);
  console.log("[db] Đã nạp dữ liệu mẫu.");
}

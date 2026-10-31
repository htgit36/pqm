// Chạy một MySQL tạm thời trên máy để phát triển (không cần cài MySQL).
// Lần đầu sẽ tải MySQL về bộ nhớ đệm. Dữ liệu mất khi tắt.
// Dùng: npm run db:dev  → rồi mở terminal khác chạy npm run dev
import { createDB } from "mysql-memory-server";

const db = await createDB({ dbName: "pqm", port: 3307, logLevel: "WARN" });
console.log(`MySQL đang chạy. Đặt trong .env.local:\nDATABASE_URL=mysql://${db.username}@127.0.0.1:${db.port}/${db.dbName}`);

const stop = async () => {
  await db.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);

// Nhúng các file SQL trong drizzle/ vào code (src/lib/db/migrations.generated.ts).
// Hostinger chỉ chép bản build sang máy chạy, không chép thư mục drizzle/,
// nên migration phải nằm sẵn trong bundle.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const journal = JSON.parse(fs.readFileSync(path.join(root, "drizzle/meta/_journal.json"), "utf8"));
const migrations = journal.entries.map((e) => ({
  tag: e.tag,
  statements: fs
    .readFileSync(path.join(root, "drizzle", `${e.tag}.sql`), "utf8")
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean),
}));

const out = `// Tự sinh bởi scripts/embed-migrations.mjs — không sửa tay.\nexport const migrations: { tag: string; statements: string[] }[] = ${JSON.stringify(migrations, null, 2)};\n`;
fs.writeFileSync(path.join(root, "src/lib/db/migrations.generated.ts"), out);
console.log(`[embed-migrations] ${migrations.length} migration(s)`);

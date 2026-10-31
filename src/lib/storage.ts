import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

// Thư mục lưu file tải lên. Trên Hostinger nên đặt UPLOAD_DIR ngoài thư mục code
// (vd. /home/<user>/pqm-uploads) để không bị xóa khi deploy lại.
export const UPLOAD_DIR = path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || path.join(process.cwd(), "storage", "uploads"));

export const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

const IMAGE_IN = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);
const PASSTHROUGH: Record<string, string> = { "image/gif": ".gif", "image/svg+xml": ".svg", "video/mp4": ".mp4", "video/webm": ".webm", "application/pdf": ".pdf" };
export const MAX_UPLOAD = 300 * 1024 * 1024;

function baseName(original: string) {
  const stem = original
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${stem || "file"}-${randomBytes(3).toString("hex")}`;
}

/** Lưu file; ảnh được chuyển sang WebP (tối đa 2560px). Trả về URL công khai /media/... */
export async function saveUpload(file: File) {
  const now = new Date();
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dir = path.join(UPLOAD_DIR, sub);
  await fs.mkdir(dir, { recursive: true });
  const name = baseName(file.name);
  const buf = Buffer.from(await file.arrayBuffer());

  let filename: string;
  if (IMAGE_IN.has(file.type)) {
    filename = `${name}.webp`;
    // Nạp lúc chạy (không qua bundler) — tránh lỗi liên kết thư mục của Turbopack trên Windows.
    const { default: sharp } = (await import(/* turbopackIgnore: true */ /* webpackIgnore: true */ "sharp")) as typeof import("sharp");
    await sharp(buf).rotate().resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(dir, filename));
  } else if (PASSTHROUGH[file.type]) {
    filename = `${name}${PASSTHROUGH[file.type]}`;
    await fs.writeFile(path.join(dir, filename), buf);
  } else {
    throw new Error(`Định dạng không hỗ trợ: ${file.type || file.name}`);
  }
  return `/media/${sub}/${filename}`;
}

/** Đường dẫn tuyệt đối an toàn (chặn ../) cho một URL /media/... */
export function resolveMedia(parts: string[]) {
  const full = path.resolve(UPLOAD_DIR, ...parts);
  if (!full.startsWith(UPLOAD_DIR + path.sep)) return null;
  return full;
}

export async function listMedia() {
  const out: { url: string; size: number; mtime: Date }[] = [];
  async function walk(dir: string, rel: string[]) {
    let entries: import("node:fs").Dirent[] = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) await walk(path.join(dir, e.name), [...rel, e.name]);
      else {
        const st = await fs.stat(path.join(dir, e.name));
        out.push({ url: `/media/${[...rel, e.name].join("/")}`, size: st.size, mtime: st.mtime });
      }
    }
  }
  await walk(UPLOAD_DIR, []);
  return out.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

export async function deleteMedia(url: string) {
  const parts = url.replace(/^\/media\//, "").split("/");
  const full = resolveMedia(parts);
  if (full) await fs.unlink(full).catch(() => {});
}

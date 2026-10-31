import { getSession } from "@/lib/auth";
import { MAX_UPLOAD, saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return Response.json({ error: "Chưa chọn file" }, { status: 400 });

  const urls: string[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (file.size > MAX_UPLOAD) {
      errors.push(`${file.name}: vượt quá 300MB`);
      continue;
    }
    try {
      urls.push(await saveUpload(file));
    } catch (err) {
      errors.push(`${file.name}: ${(err as Error).message}`);
    }
  }
  return Response.json({ urls, errors });
}

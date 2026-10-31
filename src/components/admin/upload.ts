export async function uploadFiles(files: FileList | File[]) {
  const body = new FormData();
  for (const f of Array.from(files)) body.append("files", f);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  if (!res.ok) throw new Error(res.status === 401 ? "Phiên đăng nhập đã hết hạn" : `Lỗi tải lên (${res.status})`);
  return (await res.json()) as { urls: string[]; errors: string[] };
}

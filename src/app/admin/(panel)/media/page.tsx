import { listMedia } from "@/lib/storage";
import { ConfirmButton, CopyButton, MediaUploader } from "@/components/admin/Fields";
import { removeMedia } from "../../actions";
import { Flash, PageTitle } from "../ui";

export const metadata = { title: "Thư viện file" };

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const files = await listMedia();
  const sp = await searchParams;
  return (
    <>
      <PageTitle title={`Thư viện file (${files.length})`}>
        <MediaUploader />
      </PageTitle>
      <Flash params={sp} />
      <p className="mb-6 text-sm text-muted">Ảnh tải lên được tự động nén sang WebP (tối đa 2560px). Video nên đăng lên YouTube rồi dán link vào dự án để tải trang nhanh hơn.</p>
      {files.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface p-10 text-center text-muted">Chưa có file nào.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((f) => (
            <li key={f.url} className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className="aspect-[4/3] bg-raise">
                {/\.(mp4|webm)$/.test(f.url) ? (
                  <video src={f.url} className="h-full w-full object-cover" muted preload="metadata" />
                ) : /\.pdf$/.test(f.url) ? (
                  <span className="flex h-full items-center justify-center text-muted">PDF</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs text-muted" title={f.url}>
                  {f.url.split("/").pop()} · {(f.size / 1024).toFixed(0)}KB
                </p>
                <div className="flex items-center justify-between">
                  <CopyButton text={f.url} />
                  <form action={removeMedia.bind(null, f.url)}>
                    <ConfirmButton message="Xóa file này? Các trang đang dùng file sẽ mất ảnh." className="text-xs text-muted hover:text-rec">
                      Xóa
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

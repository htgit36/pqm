import HeroGalleryEditor from "@/components/admin/HeroGalleryEditor";
import { ConfirmButton } from "@/components/admin/Fields";
import { getHeroItems } from "@/lib/hero-gallery";
import { resetHeroGallery, saveHeroGallery } from "../../actions";
import { Flash, PageTitle } from "../ui";

export const metadata = { title: "Ảnh bìa trang chủ" };

export default async function HeroPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const items = await getHeroItems();
  const sp = await searchParams;
  return (
    <div className="max-w-5xl">
      <PageTitle title="Ảnh bìa trang chủ" />
      <Flash params={sp} />
      {sp.error && <p className="mb-6 rounded-md border border-rec/40 bg-rec/10 px-4 py-3 text-sm text-rec">Cần ít nhất một ảnh trong danh sách.</p>}
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted">
        Mỗi lần khách vào trang chủ sẽ thấy ngẫu nhiên một trong các ảnh bên dưới (không lặp lại ảnh vừa xem). Nên chọn ảnh ngang, góc rộng thể hiện quy mô sự kiện, kích thước từ 2400px trở lên. Ảnh tải lên được tự nén sang WebP.
        Nếu đã đặt “Video nền trang chủ” trong Cài đặt thì video sẽ được ưu tiên thay cho ảnh.
      </p>
      <form action={saveHeroGallery} className="space-y-6">
        <HeroGalleryEditor defaultItems={items} />
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button type="submit" className="rounded-md bg-accent px-6 py-2.5 font-semibold text-ink">
            Lưu danh sách
          </button>
        </div>
      </form>
      <form action={resetHeroGallery} className="mt-4">
        <ConfirmButton message="Khôi phục bộ ảnh mặc định? Danh sách hiện tại sẽ bị thay thế." className="rounded-md px-3 py-2 text-sm text-muted hover:text-rec">
          Khôi phục bộ ảnh mặc định
        </ConfirmButton>
      </form>
    </div>
  );
}

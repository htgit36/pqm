import { categories } from "./i18n";

export type FieldType = "text" | "textarea" | "markdown" | "image" | "gallery" | "number" | "checkbox" | "select" | "date" | "url";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  half?: boolean;
};

export type EntityDef = {
  key: EntityKey;
  label: string;
  singular: string;
  titleField: string;
  fields: FieldDef[];
  publicPath?: string;
};

export type EntityKey = "projects" | "services" | "posts" | "clients";

const slug: FieldDef = { name: "slug", label: "Đường dẫn (slug)", type: "text", help: "Để trống sẽ tự tạo từ tiêu đề tiếng Việt.", half: true };
const order: FieldDef = { name: "sortOrder", label: "Thứ tự hiển thị", type: "number", help: "Số nhỏ hiển thị trước.", half: true };
const published: FieldDef = { name: "published", label: "Hiển thị trên website", type: "checkbox" };

export const entities: Record<EntityKey, EntityDef> = {
  projects: {
    key: "projects",
    label: "Dự án",
    singular: "dự án",
    titleField: "titleVi",
    publicPath: "/du-an/",
    fields: [
      { name: "titleVi", label: "Tiêu đề (Tiếng Việt)", type: "text", required: true, half: true },
      { name: "titleEn", label: "Tiêu đề (English)", type: "text", half: true },
      slug,
      { name: "client", label: "Khách hàng", type: "text", half: true },
      {
        name: "category",
        label: "Hạng mục",
        type: "select",
        half: true,
        options: Object.entries(categories).map(([value, l]) => ({ value, label: l.vi })),
      },
      {
        name: "kind",
        label: "Loại",
        type: "select",
        half: true,
        options: [
          { value: "video", label: "Video" },
          { value: "photo", label: "Hình ảnh" },
        ],
      },
      { name: "year", label: "Năm", type: "number", half: true },
      order,
      { name: "coverImage", label: "Ảnh bìa", type: "image", required: true },
      { name: "videoUrl", label: "Link video YouTube", type: "url", help: "Dán link YouTube để nhúng video vào trang dự án.", half: true },
      { name: "externalUrl", label: "Link tư liệu (Google Drive…)", type: "url", help: "Hiện nút “Xem toàn bộ tư liệu”.", half: true },
      { name: "gallery", label: "Thư viện ảnh", type: "gallery" },
      { name: "summaryVi", label: "Mô tả ngắn (Tiếng Việt)", type: "textarea", half: true },
      { name: "summaryEn", label: "Mô tả ngắn (English)", type: "textarea", half: true },
      { name: "bodyVi", label: "Nội dung chi tiết (Tiếng Việt)", type: "markdown" },
      { name: "bodyEn", label: "Nội dung chi tiết (English)", type: "markdown" },
      { name: "featured", label: "Nổi bật ở trang chủ", type: "checkbox" },
      published,
    ],
  },
  services: {
    key: "services",
    label: "Dịch vụ",
    singular: "dịch vụ",
    titleField: "titleVi",
    publicPath: "/dich-vu/",
    fields: [
      { name: "titleVi", label: "Tên dịch vụ (Tiếng Việt)", type: "text", required: true, half: true },
      { name: "titleEn", label: "Tên dịch vụ (English)", type: "text", half: true },
      slug,
      order,
      { name: "coverImage", label: "Ảnh bìa", type: "image" },
      { name: "summaryVi", label: "Mô tả ngắn (Tiếng Việt)", type: "textarea", half: true },
      { name: "summaryEn", label: "Mô tả ngắn (English)", type: "textarea", half: true },
      { name: "bodyVi", label: "Nội dung chi tiết (Tiếng Việt)", type: "markdown" },
      { name: "bodyEn", label: "Nội dung chi tiết (English)", type: "markdown" },
      { name: "featured", label: "Dịch vụ chính (hiện ở trang chủ, tối đa 4)", type: "checkbox" },
      published,
    ],
  },
  posts: {
    key: "posts",
    label: "Tin tức",
    singular: "bài viết",
    titleField: "titleVi",
    publicPath: "/tin-tuc/",
    fields: [
      { name: "titleVi", label: "Tiêu đề (Tiếng Việt)", type: "text", required: true, half: true },
      { name: "titleEn", label: "Tiêu đề (English)", type: "text", half: true },
      slug,
      { name: "publishedAt", label: "Ngày đăng", type: "date", required: true, half: true },
      { name: "coverImage", label: "Ảnh bìa", type: "image" },
      { name: "excerptVi", label: "Tóm tắt (Tiếng Việt)", type: "textarea", half: true },
      { name: "excerptEn", label: "Tóm tắt (English)", type: "textarea", half: true },
      { name: "bodyVi", label: "Nội dung (Tiếng Việt)", type: "markdown" },
      { name: "bodyEn", label: "Nội dung (English)", type: "markdown" },
      published,
    ],
  },
  clients: {
    key: "clients",
    label: "Đối tác",
    singular: "đối tác",
    titleField: "name",
    fields: [
      { name: "name", label: "Tên đối tác", type: "text", required: true, half: true },
      order,
      { name: "url", label: "Website", type: "url", half: true },
      { name: "logo", label: "Logo", type: "image" },
    ],
  },
};

export function isEntityKey(v: string): v is EntityKey {
  return v in entities;
}

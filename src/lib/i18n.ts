export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Tên thư mục route (tiếng Anh) ↔ đường dẫn hiển thị theo ngôn ngữ.
// Tiếng Việt không có tiền tố (/dich-vu), tiếng Anh có /en (/en/services).
export const routes = {
  home: { vi: "", en: "" },
  services: { vi: "dich-vu", en: "services" },
  gallery: { vi: "thu-vien", en: "gallery" },
  news: { vi: "tin-tuc", en: "news" },
  about: { vi: "gioi-thieu", en: "about" },
  contact: { vi: "lien-he", en: "contact" },
} as const;
export type RouteKey = keyof typeof routes;

const viToFolder: Record<string, string> = Object.fromEntries(
  Object.values(routes).filter((r) => r.vi).map((r) => [r.vi, r.en]),
);
const folderToVi: Record<string, string> = Object.fromEntries(
  Object.values(routes).filter((r) => r.vi).map((r) => [r.en, r.vi]),
);

export function viSegmentToFolder(segment: string) {
  return viToFolder[segment];
}
export function folderToViSegment(segment: string) {
  return folderToVi[segment];
}

export function href(locale: Locale, key: RouteKey, slug?: string) {
  const seg = routes[key][locale];
  const parts = [locale === "en" ? "en" : "", seg, slug ?? ""].filter(Boolean);
  return "/" + parts.join("/");
}

// Đổi một đường dẫn hiện tại sang ngôn ngữ còn lại (giữ nguyên slug).
export function switchLocalePath(pathname: string, target: Locale) {
  const segs = pathname.split("/").filter(Boolean);
  const isEn = segs[0] === "en";
  const rest = isEn ? segs.slice(1) : segs;
  if (rest.length === 0) return target === "en" ? "/en" : "/";
  const [first, ...tail] = rest;
  const folder = isEn ? first : (viToFolder[first] ?? first);
  const seg = target === "en" ? folder : (folderToVi[folder] ?? folder);
  return "/" + [target === "en" ? "en" : "", seg, ...tail].filter(Boolean).join("/");
}

type Localized = Record<string, unknown>;
// Lấy trường theo ngôn ngữ (titleVi/titleEn), tự rơi về tiếng Việt nếu bản tiếng Anh trống.
export function tr<T extends Localized>(obj: T, field: string, locale: Locale): string {
  const vi = obj[`${field}Vi`] as string | null | undefined;
  const en = obj[`${field}En`] as string | null | undefined;
  return (locale === "en" ? en || vi : vi) ?? "";
}

export const categories: Record<string, { vi: string; en: string }> = {
  event: { vi: "Sự kiện & Hội nghị", en: "Events & Conferences" },
  corporate: { vi: "Phim doanh nghiệp", en: "Corporate Films" },
  teambuilding: { vi: "Team Building & Gala", en: "Team Building & Gala" },
  sport: { vi: "Thể thao", en: "Sports" },
  hospitality: { vi: "Du lịch & Nghỉ dưỡng", en: "Hospitality" },
};

export function categoryLabel(key: string, locale: Locale) {
  return categories[key]?.[locale] ?? key;
}

// Bộ ảnh bìa trang chủ: mỗi lượt truy cập chọn ngẫu nhiên một ảnh.
// Danh sách do Admin → "Ảnh bìa trang chủ" quản lý; chưa chỉnh gì thì dùng bộ mặc định bên dưới (file trong public/hero).
// "-m" là bản nhẹ cho điện thoại (chỉ có ở ảnh /hero/…). pos = điểm lấy nét khi ảnh bị cắt (object-position).
export type HeroImage = { l: string; m: string; pos: string; caption: string };
export type HeroItem = { src: string; vi: string; en: string; pos: string; on: boolean };

const d = (file: string, vi: string, en: string, pos = "50% 50%"): HeroItem => ({ src: `/hero/${file}.webp`, vi, en, pos, on: true });

export const DEFAULT_HERO_ITEMS: HeroItem[] = [
  d("flycam-beach-1", "Team building Nhựa Tiền Phong · Flycam", "Tien Phong Plastic team building · Aerial"),
  d("flycam-beach-2", "Team building Nhựa Tiền Phong · Flycam", "Tien Phong Plastic team building · Aerial"),
  d("flycam-aerial-3", "Team building Nhựa Tiền Phong · Flycam", "Tien Phong Plastic team building · Aerial"),
  d("night-fountain", "Venice · Grand World Phú Quốc", "Venice · Grand World Phu Quoc"),
  d("night-clocktower", "Venice · Grand World Phú Quốc", "Venice · Grand World Phu Quoc"),
  d("castle-plaza", "Giải chạy tại Phú Quốc", "Running event in Phu Quoc"),
  d("castle-run", "Giải chạy tại Phú Quốc", "Running event in Phu Quoc"),
  d("hue-stage-night", "Sân khấu thực cảnh về đêm", "Live-scene stage at night", "50% 55%"),
  d("edurun-aerial", "Edurun 2026 · Vinschool Grand World", "Edurun 2026 · Vinschool Grand World"),
  d("venice-bridge", "Grand World · Sinh nhật 5 tuổi", "Grand World · 5th anniversary"),
  d("street-night-aerial", "Grand World · Sinh nhật 5 tuổi", "Grand World · 5th anniversary"),
  d("dji-0099", "Phú Quốc từ trên cao", "Phu Quoc from above"),
  d("dji-0952", "Phú Quốc từ trên cao", "Phu Quoc from above"),
  d("edurun-crowd", "Edurun 2026 · Vinschool Grand World", "Edurun 2026 · Vinschool Grand World"),
  d("rainbow-arch-beach", "Team building bãi biển · Flycam", "Beach team building · Aerial"),
  d("sunset-beach", "Resort Phú Quốc lúc hoàng hôn · Flycam", "Phu Quoc resort at sunset · Aerial"),
  d("beach-dinner-dusk", "Gala dinner bên bờ biển", "Beachfront gala dinner"),
  d("night-fireworks", "Pháo hoa · Grand World Phú Quốc", "Fireworks · Grand World Phu Quoc"),
  d("lantern-street-aerial", "Phố lồng đèn · Grand World", "Lantern street · Grand World"),
  d("night-lagoon-aerial", "Grand World về đêm · Flycam", "Grand World at night · Aerial"),
  d("race-start-gate", "Giải chạy · Vạch xuất phát", "Running event · Start gate"),
  d("runners-glass-dome", "Giải chạy · Phố mái kính", "Running event · Glass-dome street"),
  d("ballroom-crowd", "Tiệc thường niên · Mövenpick Phú Quốc", "Annual staff party · Mövenpick Phu Quoc"),
  d("sunset-show-audience", "Show diễn hoàng hôn", "Sunset show"),
  d("conference-stage", "Mastercard Customer Forum 2025", "Mastercard Customer Forum 2025"),
];

export function toHeroImages(items: HeroItem[], locale: "vi" | "en"): HeroImage[] {
  const on = items.filter((i) => i.on);
  return (on.length ? on : DEFAULT_HERO_ITEMS).map((i) => ({
    l: i.src,
    m: i.src.startsWith("/hero/") ? i.src.replace(/\.webp$/, "-m.webp") : i.src,
    pos: i.pos || "50% 50%",
    caption: (locale === "en" ? i.en || i.vi : i.vi || i.en) ?? "",
  }));
}

// Chạy ngay khi trình duyệt phân tích HTML (trước khi vẽ trang) để không bị nháy ảnh.
// Phải tự chứa, không tham chiếu biến ngoài vì được nhúng nguyên văn vào <script>.
export function pickHeroImage(img: HTMLImageElement, items: HeroImage[]) {
  let last = -1;
  try {
    last = parseInt(localStorage.getItem("pqm:hero") || "-1", 10);
  } catch {}
  let i = 0;
  if (items.length > 1) {
    do {
      i = Math.floor(Math.random() * items.length);
    } while (i === last);
  }
  try {
    localStorage.setItem("pqm:hero", String(i));
  } catch {}
  const it = items[i];
  img.style.objectPosition = it.pos;
  img.src = window.innerWidth < 900 ? it.m : it.l;
  img.setAttribute("data-hero", it.caption);
}

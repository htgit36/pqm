import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "./db";
import { DEFAULT_HERO_ITEMS, toHeroImages, type HeroItem } from "./hero-images";

export const HERO_KEY = "heroGallery";

export function parseHeroItems(raw: string): HeroItem[] | null {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    return data
      .filter((i) => i && typeof i.src === "string" && (i.src.startsWith("/") || i.src.startsWith("https://")))
      .slice(0, 60)
      .map((i) => ({
        src: i.src,
        vi: String(i.vi ?? "").slice(0, 120),
        en: String(i.en ?? "").slice(0, 120),
        pos: /^\d{1,3}% \d{1,3}%$/.test(i.pos) ? i.pos : "50% 50%",
        on: i.on !== false,
      }));
  } catch {
    return null;
  }
}

// Danh sách đang lưu trong Admin; chưa lưu lần nào thì trả bộ mặc định.
export async function getHeroItems(): Promise<HeroItem[]> {
  try {
    const [row] = await db.select().from(schema.settings).where(eq(schema.settings.key, HERO_KEY));
    return (row && parseHeroItems(row.value)) || DEFAULT_HERO_ITEMS;
  } catch {
    return DEFAULT_HERO_ITEMS;
  }
}

export async function getHeroGallery(locale: "vi" | "en") {
  return toHeroImages(await getHeroItems(), locale);
}

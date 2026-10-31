import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/content";
import { href, locales, type RouteKey } from "@/lib/i18n";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entry = (key: RouteKey, slug?: string, lastModified?: Date): MetadataRoute.Sitemap[number] => ({
    url: siteUrl + href("vi", key, slug),
    lastModified,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, siteUrl + href(l, key, slug)])) },
  });

  const statics = (["home", "services", "gallery", "about", "news", "contact", "privacy", "terms"] as RouteKey[]).map((k) => entry(k));
  try {
    const [services, posts] = await Promise.all([getServices(), getPosts()]);
    return [
      ...statics,
      ...services.map((s) => entry("services", s.slug, s.updatedAt)),
      ...posts.map((p) => entry("news", p.slug, p.updatedAt)),
    ];
  } catch {
    return statics;
  }
}

import "server-only";

// Phân tích User-Agent, nguồn truy cập và vị trí (quốc gia/thành phố) cho thống kê lượt truy cập.

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|preview|scanner/i;

export function isBot(ua: string) {
  return !ua || BOT_RE.test(ua);
}

export function parseUserAgent(ua: string) {
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone|ipod/i.test(ua) ? "mobile" : "desktop";
  const browser = /zalo/i.test(ua)
    ? "Zalo"
    : /FBAN|FBAV/i.test(ua)
      ? "Facebook app"
      : /edg\//i.test(ua)
        ? "Edge"
        : /opr\/|opera/i.test(ua)
          ? "Opera"
          : /coc_coc/i.test(ua)
            ? "Cốc Cốc"
            : /samsungbrowser/i.test(ua)
              ? "Samsung"
              : /chrome|crios/i.test(ua)
                ? "Chrome"
                : /firefox|fxios/i.test(ua)
                  ? "Firefox"
                  : /safari/i.test(ua)
                    ? "Safari"
                    : "Khác";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /android/i.test(ua)
        ? "Android"
        : /mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Khác";
  return { device, browser, os };
}

const SOCIAL: [RegExp, string][] = [
  [/facebook\.|fb\.com|fb\.me|messenger\./, "Facebook"],
  [/instagram\./, "Instagram"],
  [/tiktok\./, "TikTok"],
  [/zalo\./, "Zalo"],
  [/youtube\.|youtu\.be/, "YouTube"],
  [/t\.co$|twitter\.|x\.com$/, "X / Twitter"],
  [/linkedin\./, "LinkedIn"],
  [/pinterest\./, "Pinterest"],
];
const SEARCH: [RegExp, string][] = [
  [/google\./, "Google"],
  [/bing\./, "Bing"],
  [/coccoc\./, "Cốc Cốc"],
  [/duckduckgo\./, "DuckDuckGo"],
  [/yahoo\./, "Yahoo"],
];

export type Source = { source: string; medium: "direct" | "search" | "social" | "referral" | "campaign" | "internal" };

// `entry` = trang đầu tiên của phiên; các trang sau chỉ là điều hướng nội bộ.
export function classifySource(opts: { entry: boolean; referrer: string; utmSource: string; siteHost: string }): Source {
  if (!opts.entry) return { source: "Nội bộ", medium: "internal" };
  if (opts.utmSource) return { source: opts.utmSource.slice(0, 100), medium: "campaign" };
  if (!opts.referrer) return { source: "Truy cập trực tiếp", medium: "direct" };
  let host = "";
  try {
    host = new URL(opts.referrer).hostname.replace(/^(www|m|l|lm)\./, "");
  } catch {
    return { source: "Truy cập trực tiếp", medium: "direct" };
  }
  if (host === opts.siteHost.replace(/^www\./, "")) return { source: "Nội bộ", medium: "internal" };
  for (const [re, name] of SEARCH) if (re.test(host)) return { source: name, medium: "search" };
  for (const [re, name] of SOCIAL) if (re.test(host)) return { source: name, medium: "social" };
  return { source: host.slice(0, 100), medium: "referral" };
}

export function isPrivateIp(ip: string) {
  return !ip || ip === "local" || ip === "::1" || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|fc|fd|fe80)/i.test(ip);
}

export function clientIp(h: Headers) {
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "";
  return ip.trim().replace(/^::ffff:/, "").slice(0, 64) || "local";
}

type Geo = { country: string | null; city: string | null };
const geoCache = new Map<string, Geo & { at: number }>();
const DAY = 24 * 60 * 60 * 1000;

// Ưu tiên header do CDN/host gắn; nếu không có thì tra một lần/IP (cache 24h) qua ipwho.is.
export async function lookupGeo(ip: string, h: Headers): Promise<Geo> {
  const headerCountry = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country");
  if (headerCountry && headerCountry !== "XX") {
    return { country: headerCountry.slice(0, 64), city: decodeURIComponent(h.get("x-vercel-ip-city") ?? "").slice(0, 100) || null };
  }
  if (isPrivateIp(ip)) return { country: null, city: null };
  const hit = geoCache.get(ip);
  if (hit && Date.now() - hit.at < DAY) return hit;
  let geo: Geo = { country: null, city: null };
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country,city`, { signal: AbortSignal.timeout(2500) });
    const j = (await res.json()) as { success?: boolean; country?: string; city?: string };
    if (j.success) geo = { country: j.country?.slice(0, 64) ?? null, city: j.city?.slice(0, 100) ?? null };
  } catch {}
  if (geoCache.size > 5000) geoCache.clear();
  geoCache.set(ip, { ...geo, at: Date.now() });
  return geo;
}

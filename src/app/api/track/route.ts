import { after } from "next/server";
import { lt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { classifySource, clientIp, isBot, lookupGeo, parseUserAgent } from "@/lib/visits";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const RETENTION_DAYS = 365;
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");
let lastPurge = 0;

// Ghi nhận một lượt xem trang (không dùng cookie; sessionId do trình duyệt tạo trong sessionStorage).
export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new Response(null, { status: 204 });
  // Không đếm chính chủ website khi đang đăng nhập admin.
  if (await getSession()) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const path = clip(body.path, 500);
  if (!path.startsWith("/") || path.startsWith("/admin")) return new Response(null, { status: 204 });

  const ip = clientIp(req.headers);
  const headers = req.headers;
  const { device, browser, os } = parseUserAgent(ua);
  const src = classifySource({
    entry: body.entry === true,
    referrer: clip(body.referrer, 500),
    utmSource: clip(body.utmSource, 100),
    siteHost: new URL(siteUrl).hostname,
  });

  after(async () => {
    try {
      const geo = await lookupGeo(ip, headers);
      await db.insert(schema.pageViews).values({
        ip,
        sessionId: clip(body.sid, 40) || null,
        path,
        locale: body.locale === "en" ? "en" : "vi",
        referrer: clip(body.referrer, 500) || null,
        source: src.source,
        medium: src.medium,
        utmCampaign: clip(body.utmCampaign, 191) || null,
        device,
        browser,
        os,
        country: geo.country,
        city: geo.city,
        userAgent: ua.slice(0, 400),
      });
      // Dọn dữ liệu quá hạn tối đa mỗi giờ một lần.
      if (Date.now() - lastPurge > 3_600_000) {
        lastPurge = Date.now();
        await db.delete(schema.pageViews).where(lt(schema.pageViews.createdAt, new Date(Date.now() - RETENTION_DAYS * 86_400_000)));
      }
    } catch (err) {
      console.error("[track]", err);
    }
  });
  return new Response(null, { status: 204 });
}

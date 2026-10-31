import { NextResponse, type NextRequest } from "next/server";
import { folderToViSegment, viSegmentToFolder } from "@/lib/i18n";

// Định tuyến song ngữ: "/dich-vu/x" → nội bộ "/vi/services/x"; "/en/services/x" giữ nguyên.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segs = pathname.split("/").filter(Boolean);
  const headers = new Headers(req.headers);

  if (segs[0] === "en") {
    headers.set("x-locale", "en");
    return NextResponse.next({ request: { headers } });
  }

  // /vi/... không dùng công khai → chuyển về đường dẫn tiếng Việt chuẩn.
  if (segs[0] === "vi") {
    const [, first, ...rest] = segs;
    const seg = first ? (folderToViSegment(first) ?? first) : "";
    const url = req.nextUrl.clone();
    url.pathname = "/" + [seg, ...rest].filter(Boolean).join("/");
    return NextResponse.redirect(url, 308);
  }

  // Đường dẫn dùng tên thư mục tiếng Anh nhưng không có /en (vd. /services) → bản tiếng Việt.
  if (segs[0] && !viSegmentToFolder(segs[0]) && folderToViSegment(segs[0])) {
    const url = req.nextUrl.clone();
    url.pathname = "/" + [folderToViSegment(segs[0]), ...segs.slice(1)].join("/");
    return NextResponse.redirect(url, 308);
  }

  headers.set("x-locale", "vi");
  const url = req.nextUrl.clone();
  const [first, ...rest] = segs;
  const folder = first ? (viSegmentToFolder(first) ?? first) : "";
  url.pathname = "/" + ["vi", folder, ...rest].filter(Boolean).join("/");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|admin|media|_next|images|favicon\\.ico|icon|apple-icon|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$).*)"],
};

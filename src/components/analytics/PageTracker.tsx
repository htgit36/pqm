"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SID_KEY = "pqm-sid";

// Gửi lượt xem trang về server của chính website (thống kê trong Admin → Lượt truy cập).
export default function PageTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const sent = useRef<string | null>(null);

  useEffect(() => {
    // StrictMode (dev) chạy effect hai lần; mỗi đường dẫn chỉ gửi một lần.
    if (sent.current === pathname) return;
    sent.current = pathname;
    try {
      let sid = sessionStorage.getItem(SID_KEY);
      const entry = !sid;
      if (!sid) {
        sid = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
        sessionStorage.setItem(SID_KEY, sid);
      }
      const q = new URLSearchParams(location.search);
      const payload = JSON.stringify({
        sid,
        entry,
        path: pathname,
        locale,
        referrer: entry ? document.referrer : "",
        utmSource: entry ? (q.get("utm_source") ?? "") : "",
        utmCampaign: entry ? (q.get("utm_campaign") ?? "") : "",
      });
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    } catch {}
  }, [pathname, locale]);

  return null;
}

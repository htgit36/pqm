"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { CONSENT_EVENT, readConsent, track } from "./track";

// Chỉ nạp Google Analytics / Meta Pixel khi đã nhập ID trong Admin và khách bấm “Chấp nhận”.
export default function Analytics({ gaId, pixelId }: { gaId: string; pixelId: string }) {
  const [granted, setGranted] = useState(false);
  const pathname = usePathname();
  const ga = /^G-[A-Z0-9]+$/i.test(gaId) ? gaId : "";
  const px = /^\d{5,20}$/.test(pixelId) ? pixelId : "";

  useEffect(() => {
    const sync = () => setGranted(readConsent() === "granted");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // Pixel không tự ghi nhận chuyển trang kiểu SPA.
  useEffect(() => {
    if (granted && px) window.fbq?.("track", "PageView");
  }, [pathname, granted, px]);

  // Đo lượt bấm gọi / Zalo / Messenger / email.
  useEffect(() => {
    if (!granted) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const h = a?.getAttribute("href") ?? "";
      if (h.startsWith("tel:")) track("click_call", "Contact");
      else if (h.includes("zalo.me")) track("click_zalo", "Contact");
      else if (h.includes("m.me/")) track("click_messenger", "Contact");
      else if (h.startsWith("mailto:")) track("click_email", "Contact");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [granted]);

  if (!granted) return null;
  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}');`}</Script>
        </>
      )}
      {px && (
        <Script id="pixel-init" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');`}</Script>
      )}
    </>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "pqm-consent";
export const CONSENT_EVENT = "pqm:consent";
export const REOPEN_EVENT = "pqm:cookie-open";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Gửi sự kiện chuyển đổi (chỉ có tác dụng khi khách đã đồng ý cookie và GA/Pixel đã nạp).
export function track(event: string, pixelEvent?: string) {
  window.gtag?.("event", event);
  if (pixelEvent) window.fbq?.("track", pixelEvent);
  else window.fbq?.("trackCustom", event);
}

// File JS thuần (không phải .ts): máy chủ Hostinger chỉ chạy được SWC bản WebAssembly,
// bản này không biên dịch được next.config.ts.
// URL của website cũ (OpenCart) → URL mới, giữ thứ hạng Google (301).
/** @type {Array<[string, string]>} */
const legacyRedirects = [
  ["/dich-vu-quay-phim-su-kien-phu-quoc", "/dich-vu/chup-anh-quay-phim-su-kien"],
  ["/chup-anh-teambuilding-phu-quoc", "/dich-vu/chup-anh-teambuilding-gala-dinner"],
  ["/dich-vu-flycam-su-kien-phu-quoc", "/dich-vu/flycam-drone-fpv"],
  ["/chup-anh-city-tour-theo-doan", "/dich-vu/chup-anh-city-tour-theo-doan"],
  ["/chup-anh-kien-truc-nha-mau", "/dich-vu/chup-anh-kien-truc-bat-dong-san"],
  ["/chup-anh-couple", "/dich-vu/chup-anh-couple-gia-dinh"],
  ["/dich-vu-chup-anh-gia-dinh", "/dich-vu/chup-anh-couple-gia-dinh"],
  ["/album", "/du-an"],
  ["/album/:path*", "/du-an"],
  ["/ve-chung-toi", "/gioi-thieu"],
  ["/index.php", "/"],
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/media/**" }],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;

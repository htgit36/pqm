import type { NextConfig } from "next";

// URL của website cũ (OpenCart) → URL mới, giữ thứ hạng Google (301).
const legacyRedirects: Array<[string, string]> = [
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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
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

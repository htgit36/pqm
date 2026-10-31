import "server-only";
import { cache } from "react";
import { db, schema } from "./db";

export const settingDefaults = {
  phone: "0363603606",
  email: "phuquocmediavn@gmail.com",
  zalo: "0363603606",
  messenger: "https://m.me/PhuQuocMediaVn",
  facebook: "https://www.facebook.com/PhuQuocMediaVn",
  youtube: "https://www.youtube.com/channel/UCeKEIw1yuzSa3IhK-KqXtRw",
  instagram: "",
  tiktok: "",
  addressVi: "Tổ 9, Ấp Suối Đá, Xã Dương Tơ, TP. Phú Quốc, Kiên Giang",
  addressEn: "Group 9, Suoi Da Hamlet, Duong To Commune, Phu Quoc, Kien Giang, Vietnam",
  mapLink: "https://maps.app.goo.gl/CM3MEGnoSG1QCQqH9",
  mapCoords: "10.2300994,103.970658",
  heroImage: "/images/dji-0099.webp",
  heroVideo: "",
  showreelUrl: "",
  showreelImage: "/images/dji-0952.webp",
  whyImage: "/images/dscf0024.webp",
  founderImage: "",
  aboutImage: "/images/deepc-101.webp",
  equipmentImage: "/images/dji-0952.webp",
};

export type Settings = typeof settingDefaults;
export type SettingKey = keyof Settings;

export const settingLabels: Record<SettingKey, string> = {
  phone: "Hotline",
  email: "Email nhận liên hệ (hiển thị)",
  zalo: "Số Zalo",
  messenger: "Link Messenger",
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  addressVi: "Địa chỉ (Tiếng Việt)",
  addressEn: "Địa chỉ (English)",
  mapLink: "Link Google Maps của công ty",
  mapCoords: "Tọa độ bản đồ (vĩ độ,kinh độ)",
  heroImage: "Ảnh nền trang chủ",
  heroVideo: "Video nền trang chủ (.mp4)",
  showreelUrl: "Link YouTube showreel",
  showreelImage: "Ảnh nền khu vực showreel",
  whyImage: "Trang chủ — ảnh khối “Vì sao chọn”",
  founderImage: "Trang chủ — ảnh chân dung Founder",
  aboutImage: "Giới thiệu — ảnh lớn đầu trang",
  equipmentImage: "Giới thiệu — ảnh khối Thiết bị",
};

export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const rows = await db.select().from(schema.settings);
    const merged = { ...settingDefaults };
    for (const row of rows) {
      if (row.key in merged) merged[row.key as SettingKey] = row.value;
    }
    return merged;
  } catch {
    return settingDefaults;
  }
});

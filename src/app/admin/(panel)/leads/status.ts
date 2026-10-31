export const leadStatus: Record<string, { label: string; tone: "muted" | "accent" | "rec" | "warn" }> = {
  new: { label: "Mới", tone: "rec" },
  contacted: { label: "Đã liên hệ", tone: "warn" },
  quoted: { label: "Đã báo giá", tone: "warn" },
  won: { label: "Đã chốt", tone: "accent" },
  lost: { label: "Không thành", tone: "muted" },
};

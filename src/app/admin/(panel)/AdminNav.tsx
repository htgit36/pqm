"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/leads", label: "Yêu cầu báo giá" },
  { href: "/admin/projects", label: "Dự án" },
  { href: "/admin/services", label: "Dịch vụ" },
  { href: "/admin/posts", label: "Tin tức" },
  { href: "/admin/clients", label: "Đối tác" },
  { href: "/admin/testimonials", label: "Lời chứng thực" },
  { href: "/admin/hero", label: "Ảnh bìa trang chủ" },
  { href: "/admin/media", label: "Thư viện file" },
  { href: "/admin/settings", label: "Cài đặt" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn("whitespace-nowrap rounded-md px-3 py-2 transition-colors", active ? "bg-accent/15 text-accent" : "text-fg/75 hover:bg-raise hover:text-fg")}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}

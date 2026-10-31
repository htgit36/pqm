import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import AdminNav from "./AdminNav";
import Logo from "@/components/site/Logo";

export const metadata: Metadata = { title: { default: "Quản trị", template: "%s · Quản trị PQM" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-ink text-[15px] lg:flex">
      <aside className="border-b border-line bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/admin" aria-label="Quản trị Phú Quốc Media">
            <Logo className="h-12" />
          </Link>
          <p className="hidden text-xs text-muted lg:mt-1 lg:block">Xin chào, {session.username}</p>
        </div>
        <AdminNav />
        <div className="hidden space-y-1 px-3 pb-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <a href="/" target="_blank" className="block rounded-md px-3 py-2 text-muted hover:bg-raise hover:text-fg">
            Xem website ↗
          </a>
          <form action={logout}>
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-muted hover:bg-raise hover:text-fg">
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-6 lg:ml-60 lg:px-10">{children}</main>
    </div>
  );
}

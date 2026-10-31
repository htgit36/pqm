import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <p className="display text-4xl">
          PQ<span className="text-accent">.</span>Media
        </p>
        <p className="mt-2 text-sm text-muted">Trang quản trị website</p>
        <LoginForm />
      </div>
    </main>
  );
}

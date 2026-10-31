"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { inputCls } from "@/components/admin/Fields";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="mt-10 space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm">
          Tên đăng nhập
        </label>
        <input id="username" name="username" autoComplete="username" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm">
          Mật khẩu
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-rec">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-full rounded-md bg-accent py-3 font-semibold text-ink disabled:opacity-60">
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}

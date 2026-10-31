"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { notifyNewLead } from "@/lib/notify";

export type ContactState = { status: "idle" | "success" | "error"; errors?: Record<string, string> };

const leadSchema = z.object({
  name: z.string().trim().min(2).max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s.-]{7,18}$/),
  email: z.union([z.literal(""), z.email().max(255)]),
  company: z.string().trim().max(255),
  service: z.string().trim().max(255),
  eventDate: z.string().trim().max(64),
  message: z.string().trim().max(5000),
  locale: z.enum(["vi", "en"]),
});

const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function submitContact(_: ContactState, formData: FormData): Promise<ContactState> {
  // Ô ẩn chống spam: người thật không điền.
  if (formData.get("website")) return { status: "success" };

  const raw = Object.fromEntries(["name", "phone", "email", "company", "service", "eventDate", "message", "locale"].map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] = key === "phone" ? "invalidPhone" : key === "email" ? "invalidEmail" : "required";
    }
    return { status: "error", errors };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return { status: "error" };

  const lead = {
    ...parsed.data,
    email: parsed.data.email || null,
    company: parsed.data.company || null,
    service: parsed.data.service || null,
    eventDate: parsed.data.eventDate || null,
    message: parsed.data.message || null,
  };

  try {
    await db.insert(schema.leads).values(lead);
  } catch (err) {
    console.error("[contact] Lưu yêu cầu thất bại:", err);
    return { status: "error" };
  }
  after(() => notifyNewLead(lead));
  return { status: "success" };
}

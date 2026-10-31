import "server-only";
import nodemailer from "nodemailer";
import type { Lead } from "./db/schema";

type NewLead = Omit<Lead, "id" | "createdAt" | "status" | "note">;

function summary(lead: NewLead) {
  return [
    `Họ tên: ${lead.name}`,
    `SĐT: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.company && `Công ty: ${lead.company}`,
    lead.service && `Dịch vụ: ${lead.service}`,
    lead.eventDate && `Ngày dự kiến: ${lead.eventDate}`,
    lead.message && `\nNội dung:\n${lead.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(lead: NewLead) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;
  const port = Number(SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transport.sendMail({
    from: `"Website Phú Quốc Media" <${SMTP_USER}>`,
    to: MAIL_TO || SMTP_USER,
    replyTo: lead.email || undefined,
    subject: `[Báo giá] ${lead.name} – ${lead.service || "Yêu cầu mới"}`,
    text: summary(lead),
  });
}

async function sendTelegram(lead: NewLead) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `🔔 Yêu cầu báo giá mới\n\n${summary(lead)}` }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}`);
}

// Gửi thông báo song song; lỗi ở một kênh không làm hỏng việc lưu yêu cầu.
export async function notifyNewLead(lead: NewLead) {
  const results = await Promise.allSettled([sendEmail(lead), sendTelegram(lead)]);
  for (const r of results) if (r.status === "rejected") console.error("[notify]", r.reason);
}

# Phú Quốc Media — Website

Website song ngữ (Việt/Anh) cho Phú Quốc Media: Next.js 16 + MySQL (Drizzle ORM), hiệu ứng GSAP + Lenis, trang quản trị `/admin`.

## Cấu trúc chính

| Đường dẫn | Nội dung |
|---|---|
| `src/app/[locale]/` | Các trang công khai (trang chủ, dịch vụ, dự án, tin tức, giới thiệu, liên hệ) |
| `src/app/admin/` | Trang quản trị: yêu cầu báo giá, dự án, dịch vụ, tin tức, đối tác, thư viện file, cài đặt |
| `src/lib/dictionaries.ts` | Toàn bộ chữ cố định trên giao diện (VI/EN) |
| `src/lib/db/schema.ts` | Cấu trúc cơ sở dữ liệu |
| `src/lib/db/seed-data.ts` | Dữ liệu mẫu nạp lần đầu (từ Hồ sơ năng lực) |
| `drizzle/` | File migration SQL — tự chạy khi server khởi động |
| `next.config.ts` | Redirect 301 từ URL website cũ |

Đường dẫn: tiếng Việt không có tiền tố (`/dich-vu`, `/du-an`, `/tin-tuc`, `/gioi-thieu`, `/lien-he`), tiếng Anh có `/en` (`/en/services`, `/en/work`…).

## Chạy trên máy

```bash
npm install
npm run db:dev        # cửa sổ 1: bật MySQL tạm (lần đầu sẽ tải MySQL, mất vài phút)
npm run dev           # cửa sổ 2: http://localhost:3000
```

Tạo file `.env.local` theo mẫu `.env.example`. Khi chạy với `db:dev`, dùng
`DATABASE_URL=mysql://root@127.0.0.1:3307/pqm`. Bảng và dữ liệu mẫu được tạo tự động khi server khởi động.

## Đẩy code lên GitHub (lần đầu)

1. Cài GitHub CLI: https://cli.github.com rồi đăng nhập: `gh auth login`
2. Trong thư mục dự án:

```bash
git config --global --add safe.directory "E:/CLAUDE CODE/phuquocmedia-web"   # ổ E: không ghi quyền sở hữu file
git config --global user.name "Tên của bạn"
git config --global user.email "email-github-cua-ban@example.com"
git add -A
git commit -m "Website Phú Quốc Media"
gh repo create phuquocmedia-web --private --source . --push
```

File `.env.local` (mật khẩu, khóa bí mật) và thư mục `storage/` đã được loại khỏi Git.

## Deploy lên Hostinger (gói Business Web Hosting)

1. **Tạo cơ sở dữ liệu**: hPanel → *Databases → MySQL Databases* → tạo database + user. Ghi lại tên DB, user, mật khẩu.
2. **Tạo Node.js app**: hPanel → *Websites → Add website → Node.js Apps* → chọn *Import Git repository*, kết nối GitHub và chọn repo này, nhánh `main`.
   - Framework: **Next.js** · Node.js: **22.x** (hoặc mới hơn)
   - Build command: `npm run build` · Start command: `npm start`
3. **Biến môi trường** (Environment variables) — xem `.env.example`:
   - `DATABASE_URL=mysql://USER:MATKHAU@localhost:3306/TEN_DB`
   - `SITE_URL=https://phuquocmedia.vn`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET` (chuỗi ngẫu nhiên dài)
   - `UPLOAD_DIR=/home/<user>/pqm-uploads` (thư mục ngoài code để ảnh không mất khi deploy lại)
   - Tùy chọn: `SMTP_*`, `MAIL_TO`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
4. **Deploy**. Lần chạy đầu tiên sẽ tự tạo bảng và nạp dữ liệu mẫu.
5. **Gắn tên miền** `phuquocmedia.vn` cho app và bật SSL. Các URL cũ (`/album`, `/ve-chung-toi`, các trang dịch vụ cũ…) tự chuyển hướng 301.
6. Mỗi lần `git push` lên `main`, Hostinger tự build và deploy lại (nếu bật auto-deploy).

## Quản trị

- Đăng nhập: `/admin` bằng `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Ảnh tải lên được nén sang WebP tự động. Video dài nên đăng YouTube và dán link vào dự án.
- *Cài đặt* cho phép đổi hotline, Zalo, mạng xã hội, ảnh/video nền trang chủ và link showreel YouTube.

## Thư viện ảnh từ fanpage Facebook

Trang `/thu-vien` (và khu vực "Mới nhất từ fanpage" ở trang chủ) tự lấy các bài đăng có ảnh từ fanpage, mỗi bài là một album, làm mới mỗi giờ. Cần 2 biến môi trường:

1. Vào https://developers.facebook.com → *My Apps → Create App* (loại **Business**), đăng nhập bằng tài khoản quản trị fanpage.
2. Mở *Tools → Graph API Explorer*: chọn app vừa tạo → *Get Token → Get Page Access Token*, cấp quyền `pages_show_list`, `pages_read_engagement`, chọn fanpage Phú Quốc Media.
3. Đổi sang token dài hạn: mở *Access Token Debugger*, dán token → **Extend Access Token**. Dùng token dài hạn đó gọi `me/accounts` trong Graph API Explorer → copy `access_token` (token của trang, không hết hạn) và `id` (Page ID).
4. Trên Hostinger → *Biến môi trường*: thêm `FACEBOOK_PAGE_ID` và `FACEBOOK_PAGE_TOKEN` → **Lưu và triển khai lại**.

Khi chưa cấu hình, trang Thư viện hiển thị nút dẫn sang fanpage.

## Thông báo yêu cầu báo giá

- **Email**: điền `SMTP_*`. Với Gmail, tạo *App password* tại myaccount.google.com → Security.
- **Telegram**: nhắn @BotFather để tạo bot → lấy token; nhắn bot một tin rồi lấy chat id (vd. qua @userinfobot) → điền `TELEGRAM_*`.
- Tất cả yêu cầu đều được lưu trong `/admin/leads`.

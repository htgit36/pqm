# Hướng dẫn thay hình ảnh và nội dung

Đăng nhập: `https://<tên-miền>/admin` · tên đăng nhập `phuquocmedia` · mật khẩu là dòng `ADMIN_PASSWORD` trong file `.env.hostinger.local`.

Mọi thay đổi trong Admin hiển thị **ngay lập tức** trên website, không cần deploy lại.

---

## 1. Thay hình ảnh (Admin → Cài đặt)

Bấm **Tải file lên** ở từng ô → chọn ảnh → **Lưu cài đặt**. Ảnh tự được nén sang WebP (tối đa 2560px).

| Ô trong Cài đặt | Vị trí trên website | Kích thước gợi ý |
|---|---|---|
| Ảnh nền trang chủ | Khung lớn đầu trang chủ | Ngang, ≥ 2400 × 1350 px |
| Video nền trang chủ (.mp4) | Thay ảnh nền bằng video chạy lặp | 10–20 giây, không tiếng, < 15 MB |
| Link YouTube showreel | Nút ▶ ở dải "Showreel" | Dán link YouTube |
| Ảnh nền khu vực showreel | Dải "Showreel" | Ngang, ≥ 2400 px |
| Trang chủ — ảnh khối "Vì sao chọn" | Cạnh 4 lý do chọn Phú Quốc Media | Dọc 3:4 |
| Trang chủ — ảnh chân dung Founder | Khối lời Founder (để trống thì hiện chữ "TL") | Dọc 4:5 |
| Giới thiệu — ảnh lớn đầu trang | Ảnh toàn khổ trang Giới thiệu | Ngang, ≥ 2400 px |
| Giới thiệu — ảnh khối Thiết bị | Cạnh danh sách thiết bị | Ngang 4:3 |

Mẹo: ảnh nên < 10 MB, chụp ngang cho các khung ngang; tránh chữ/logo sát mép vì ảnh có thể bị cắt nhẹ khi hiển thị trên điện thoại.

## 2. Dịch vụ (Admin → Dịch vụ)

Chọn một dịch vụ để sửa:
- **Ảnh bìa**: ảnh lớn ở trang Dịch vụ và trang chi tiết (ngang 4:3).
- **Tên / Mô tả ngắn / Nội dung chi tiết**: có ô Tiếng Việt và English. Để trống bản English thì website tự dùng bản Tiếng Việt.
- **Dịch vụ chính**: tick để hiện ở trang chủ (tối đa 4).
- **Thứ tự hiển thị**: số nhỏ đứng trước. **Hiển thị trên website**: bỏ tick để ẩn.

Nội dung chi tiết viết theo kiểu Markdown:
```
## Tiêu đề lớn
### Tiêu đề nhỏ
- Gạch đầu dòng
**chữ đậm**, [chữ có link](https://...)
```

## 3. Tin tức (Admin → Tin tức)

**+ Thêm bài viết** → nhập tiêu đề, ngày đăng, ảnh bìa, tóm tắt, nội dung (Markdown như trên) → **Lưu**. Ngày đăng ở tương lai thì bài tự hiện khi đến ngày.

## 4. Đối tác (Admin → Đối tác)

Danh sách tên chạy ngang ở trang chủ và trang Giới thiệu. Thêm/sửa/xóa tên, chỉnh thứ tự.

## 5. Liên hệ, mạng xã hội, bản đồ (Admin → Cài đặt)

Hotline, Zalo, Messenger, email hiển thị, địa chỉ (VI/EN), link Google Maps, tọa độ bản đồ, Facebook/YouTube/Instagram/TikTok (để trống thì ẩn biểu tượng).

## 6. Thư viện ảnh (tự động từ fanpage)

Trang **Thư viện** tự lấy bài đăng có ảnh từ fanpage, làm mới mỗi giờ — chỉ cần đăng bài trên Facebook như bình thường. Cần cài đặt một lần (xem README, mục "Thư viện ảnh từ fanpage Facebook").

## 7. Thư viện file (Admin → Thư viện file)

Nơi xem/xóa mọi ảnh, video đã tải lên; bấm **Chép link** để dùng lại một ảnh ở chỗ khác (dán vào ô ảnh hoặc vào nội dung Markdown: `![mô tả](link)`).

---

## 8. Chữ cố định trên giao diện (cần sửa code)

Các đoạn chữ sau nằm trong file `src/lib/dictionaries.ts` (cả Tiếng Việt và English), **không sửa được trong Admin**:

- Tiêu đề lớn trang chủ, dòng "tại Đảo Ngọc Phú Quốc", câu mô tả dưới tiêu đề
- Đoạn "Về chúng tôi", 4 con số (2017 · 500+ · 1.000+ · 24h)
- 4 lý do "Vì sao chọn Phú Quốc Media", 4 giai đoạn Quy trình
- Lời Founder, Tầm nhìn, Sứ mệnh, Giá trị cốt lõi, danh sách Thiết bị
- Tiêu đề/mô tả đầu các trang, giờ làm việc, chữ trên nút bấm, nội dung form liên hệ

Cách làm nhanh nhất: gửi nội dung mới cho Claude (ghi rõ đoạn cũ → đoạn mới), Claude sửa rồi đẩy lên GitHub; Hostinger tự deploy lại sau khoảng 3–4 phút.

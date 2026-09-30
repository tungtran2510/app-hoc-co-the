# KE_HOACH – Kế hoạch build V1

## Mục tiêu
App học hiểu kiến thức cơ thể theo lộ trình, trên điện thoại, đẹp, dễ dùng cho cả người lớn tuổi, 100% tiếng Việt. Chủ dự án dùng trước; sau này có thể bán cho người khác tự tạo app riêng.

## Đã chốt (không bàn lại)
- 3 tầng: **Chủ đề → Trang nội dung → Khối**. Không Course/Series/Lesson.
- Không khoá (V1 luôn OPEN), không quiz, không tab, không đăng nhập người xem.
- Một trang có thể có 0, 1 hoặc nhiều video (khối Danh sách video).
- Admin sửa ngay trên trang đang xem (1 mật khẩu). Menu 13 lựa chọn = 5 loại khối gốc + kiểu hiển thị.
- Mọi bảng có `workspace_id`; chủ đề/trang có `slug`, `sort_order`, `is_visible`.
- Video: YouTube chế độ Không công khai + bật cho phép nhúng.
- PDF: chỉ mở bằng trình xem chuẩn, không làm trình đọc riêng.
- Công nghệ: Next.js + TypeScript + Tailwind + Supabase, GitHub → Vercel.
- Bảo mật tối thiểu, ưu tiên tốc độ để dùng sớm.

## Tiến độ các lệnh
| Lệnh | Việc | PASS khi | Trạng thái |
|---|---|---|---|
| 00 | Bộ file nền (file này + 00_LUAT, 01_SPEC, 02_DU_LIEU, 03_THIET_KE, LENH_01) | Đủ 6 file trong thư mục chung | **XONG** |
| 01 | Dựng 3 màn người xem bằng Next.js, dữ liệu mẫu local, deploy Vercel | Mở URL Vercel trên điện thoại, đi được Trang chủ → Cột sống → Tổng quan, giống thiết kế | **XONG** |
| 02 | Nối Supabase: tạo 4 bảng, nạp dữ liệu mẫu, Admin thật qua `/api/admin` | Sửa 1 dòng chữ trong Supabase/Admin → app đổi theo thật trên server | **XONG** |
| 03 | Video YouTube IFrame API (tự chuyển video), Xem tiếp & Tiến độ client, phóng to ảnh Lightbox, Chia sẻ trang & Metadata, Tìm kiếm `/tim-kiem`, Sao lưu 1 chạm, Cài PWA | Đủ tính năng, build 0 lỗi, deploy thành công Vercel | **XONG** |
| 04 | Kiểm tra tổng, tăng tốc (next/image, Supabase remotePatterns), rà soát tiếng Việt, tài liệu hướng dẫn `HUONG_DAN_SU_DUNG.md` đủ 8 mục | Build PASS, không lỗi, sẵn sàng bàn giao V1 hoàn chỉnh | **XONG** |

## Để sau V1
Yêu thích, playlist cá nhân, thông báo, thống kê, xem offline, AI, đa ngôn ngữ, bán nền tảng nhiều khách (workspace), chế độ GUIDED/LOCKED.

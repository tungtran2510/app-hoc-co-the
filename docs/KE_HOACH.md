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

## Các lệnh (làm lần lượt, đạt lệnh trước mới giao lệnh sau)
| Lệnh | Việc | PASS khi | Trạng thái |
|---|---|---|---|
| 00 | Bộ file nền (file này + 00_LUAT, 01_SPEC, 02_DU_LIEU, 03_THIET_KE, LENH_01) | Đủ 6 file trong thư mục chung | XONG |
| 01 | Dựng 3 màn người xem bằng Next.js, dữ liệu mẫu local, deploy Vercel | Mở URL Vercel trên điện thoại, đi được Trang chủ → Cột sống → Tổng quan, giống thiết kế | CHỜ |
| 02 | Nối Supabase: tạo 4 bảng, nạp dữ liệu mẫu | Sửa 1 dòng chữ trong Supabase → app đổi theo | |
| 03 | Video YouTube trong trang, Xem tiếp (trang + video + vị trí cuộn), chạm phóng ảnh, Chia sẻ | Gửi link qua Zalo mở đúng trang; mở lại app về đúng chỗ | |
| — | **Từ đây chủ dự án dùng được** (nhập nội dung trong bảng Supabase) | | |
| 04 | Admin sửa tại chỗ: mật khẩu, Sửa · ▲ · ▼ · ⋮, + Thêm nội dung, Ẩn/Hiện, Bản nháp | Tạo 1 trang mới hoàn chỉnh trên điện thoại, không mở Supabase | |
| 05 | Tải ảnh có nén (≤1600px, WebP, <300KB, ảnh nhỏ 400px), quản lý danh sách video (dán link YouTube tự lấy bìa + tên), tải PDF + mở PDF | Ảnh chụp điện thoại tải lên < 300KB; PDF mở được | |
| 06 | Tìm kiếm, sao lưu 1 chạm (JSON), cài ra màn hình (PWA) | Gõ "đĩa đệm" ra đúng trang; tải được file sao lưu | |

Sau Lệnh 01: đo thời gian + token của Anti-Gravity → quyết định giữ nguyên hay chia nhỏ Lệnh 02–06.

## Quy trình mỗi lệnh
1. Claude soạn `LENH_xx.md` (đọc file nào, được sửa gì, tiêu chí PASS có/không).
2. Chủ dự án giao cho Anti-Gravity.
3. Anti-Gravity báo cáo theo mẫu 6 mục trong 00_LUAT.
4. Chủ dự án thử trên điện thoại. Đạt → lệnh tiếp. Chưa đạt → chỉ sửa đúng chỗ lỗi (lệnh sửa nhỏ).

## Để sau V1
Yêu thích, playlist cá nhân, thông báo, thống kê, xem offline, AI, đa ngôn ngữ, bán nền tảng nhiều khách (workspace), chế độ GUIDED/LOCKED.

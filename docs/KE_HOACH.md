# KẾ HOẠCH NÂNG CẤP VÀ CHUYỂN ĐỔI DỮ LIỆU (docs/KE_HOACH.md)

## 1. Hiện trạng đồng bộ dữ liệu người dùng (V1)
- **Tiến độ học viên hiện đang nằm trong bảng `settings`:**
  - Khóa lưu trữ: `user_sync:<hash_sha256(phone)>` (hoặc định dạng lịch sử `user_sync:<phone>`).
  - Dữ liệu dạng JSON chứa: `xem_tiep`, `tien_do` (tiến độ video theo `youtube_id`), `danh_dau` (bài học đã lưu, đã hoàn thành), `can_on_tap` (danh sách ôn tập video), `preferences` (cài đặt font, wakelock, audio), `deleted_saved` và `deleted_completed` (để đồng bộ 2 chiều chính xác khi người dùng bỏ lưu/bỏ đánh dấu).
- **Bảng `user_progress` hiện tại:**
  - **CHƯA DÙNG**: Bảng này chưa được sử dụng trong codebase hiện tại.
  - Tạm thời giữ nguyên bảng trong DB, KHÔNG can thiệp hoặc tác động trong V1.

## 2. Kế hoạch chuyển đổi sang V2
- Khi hệ thống bước sang phiên bản V2 (hỗ trợ tài khoản đăng nhập đầy đủ, xác thực OAuth/OTP):
  1. Xây dựng migration script chuyển đổi toàn bộ bản ghi `user_sync:*` từ bảng `settings` sang bảng chuyên dụng `user_progress` hoặc bảng `users` + `user_activities`.
  2. Chuẩn hoá quan hệ khóa ngoại (foreign key) với bảng `users` (id, phone, email).
  3. Cập nhật RLS chính xác theo từng user id khi người dùng đăng nhập qua Supabase Auth.
- **Lưu ý an toàn:** Trong giai đoạn hiện tại, KHÔNG chạy bất kỳ file SQL phân quyền sai cột nào (như `supabase/security.sql` cũ) gây lỗi API server.

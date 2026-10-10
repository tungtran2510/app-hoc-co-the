# BỘ LUẬT BẤT KHẢ XÂM PHẠM - DỰ ÁN APP HỌC CƠ THỂ (docs/00_LUAT.md)

## 1. NGUYÊN TẮC CỐT LÕI
1. **KHÔNG ĐỔI GIAO DIỆN & BỐ CỤC:** 
   - Tuyệt đối không tự ý thay đổi màu sắc, bố cục, kích thước font, thẻ bài học, thanh điều hướng hay giao diện người dùng nếu không có yêu cầu bằng văn bản rõ ràng.
   - Khi thực hiện lệnh SỬA LỖI DỮ LIỆU: Chỉ can thiệp vào tầng logic nạp, lưu trữ, đồng bộ và kiểm tra dữ liệu.
2. **KHÔNG TỰ Ý LÀM THÊM BẢO MẬT GÂY GÃY HỆ THỐNG:**
   - Không tự ý thêm RLS, không chạy các câu lệnh SQL chưa kiểm chứng làm khóa hoặc chặn quyền của API server hay khóa anon hợp lệ.
3. **BẢO VỆ CƠ SỞ DỮ LIỆU PRODUCTION:**
   - Supabase `evuhamqlzprrbuabxyyn` là cơ sở dữ liệu thật. Tuyệt đối không xóa bảng, không drop table, không ghi đè mất mát dữ liệu học viên hay nội dung bài soạn.
4. **CHỈ SỬA ĐÚNG DELTA:**
   - Sửa đúng phần bị lỗi, giữ nguyên 100% phần đang chạy ổn định.
   - Không tự ý refactor cấu trúc thư mục, không viết lại cả file khi chỉ cần sửa vài dòng.

## 2. QUY CHUẨN XỬ LÝ DỮ LIỆU & BỘ NHỚ ĐỆM
1. **Dữ liệu mẫu (`sample*`):**
   - Chỉ dùng khi môi trường chưa cấu hình biến Supabase.
   - Khi Supabase đã cấu hình: Dữ liệu rỗng trả về rỗng; lỗi kết nối ném thông báo "Không tải được dữ liệu", TUYỆT ĐỐI KHÔNG tự tiện lấy dữ liệu mẫu thế vào.
2. **Chống lưu đè (Optimistic Concurrency Control):**
   - Khi lưu khối: Nếu DB có `updated_at` mới hơn bản Admin đang mở, từ chối lưu và báo "Nội dung đã thay đổi, tải lại trang".
   - Khi đổi thứ tự: Chỉ gửi và cập nhật đúng `id` và `sort_order` cho các khối thực sự thay đổi.
   - Sau khi lưu: Luôn đọc lại dữ liệu tươi mới từ DB, xóa sạch cache liên quan.
3. **Bypass Cache cho Quản trị viên:**
   - Admin đã đăng nhập luôn đọc trực tiếp từ Database. Cache người xem tối đa 60 giây.
4. **Đọc dữ liệu lớn theo phân trang:**
   - Mọi thao tác đọc toàn bảng (sao lưu, tìm kiếm, hỏi đáp AI, lấy tất cả trang/khối) bắt buộc dùng vòng lặp phân trang 1000 dòng/lần (`fetchAllRowsPaged`).
5. **Tiến độ học viên & Video:**
   - Video xem xong được lưu theo `youtube_id`, không lưu theo số thứ tự mảng để tránh sai lệch khi đổi thứ tự.
   - Tự động chuyển đổi dữ liệu số thứ tự cũ sang `youtube_id` khi đọc.
   - Xem tiếp luôn lưu kèm `page_id`. Nếu `page_slug` đổi hoặc không tồn tại, tự tìm theo `page_id` và chuyển hướng 307 tới đúng trang.

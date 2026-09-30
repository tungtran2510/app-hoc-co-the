# LENH_05 – Sửa lỗi Critical: nối Supabase thật, bỏ mật khẩu mặc định, bỏ lưu tạm trên máy

## Lỗi đã kiểm trong code (commit 2775bfb)
1. `src/app/api/admin/login/route.ts`: khi chưa có `ADMIN_PASSWORD` thì nhận `admin123` hoặc `1234` → trên web thật AI CŨNG vào được Admin. **Critical.**
2. `src/lib/storage.ts` + `ContentViewer.tsx`: khi chưa có Supabase thì nội dung Admin sửa chỉ lưu `localStorage` → người khác không thấy, đổi máy là mất, nhưng giao diện vẫn báo như đã lưu. **Critical.**
3. Có thêm khối "So sánh 2 mặt" và cài đặt Zalo/Hotline → phải kiểm `supabase/setup.sql` đã cho phép loại khối mới và có cột mới chưa, nếu không lưu lên Supabase sẽ lỗi.

## Việc cần làm
1. **Đăng nhập:** bỏ hẳn mật khẩu mặc định. Không có `ADMIN_PASSWORD` → màn đăng nhập báo "Chưa cài mật khẩu Admin trên máy chủ" và không cho vào.
2. **Lưu nội dung:** bỏ lưu tạm `localStorage` cho nội dung (chủ đề, trang, khối, cài đặt). Mọi lần lưu phải đi qua `/api/admin/...` vào Supabase. Chưa có Supabase hoặc lưu lỗi → hiện dòng đỏ "Chưa lưu được – chưa kết nối dữ liệu" và KHÔNG giả vờ đã lưu. Giữ `localStorage` chỉ cho thứ của riêng người xem: cỡ chữ, giao diện dịu mắt, xem tiếp, tiến độ, đã hiểu, bài đã lưu.
3. **Báo trạng thái kết nối:** `/api/admin/me` trả thêm `supabase_ok` (thử đọc 1 dòng bảng settings). Trong menu Admin hiện "Dữ liệu: Đã kết nối ✓" hoặc "Dữ liệu: CHƯA kết nối – nội dung sửa sẽ không được lưu".
4. **Database:** cập nhật `supabase/setup.sql` cho khớp code hiện tại (loại khối mới trong ràng buộc `type`, cột Zalo/Hotline trong `settings`, mọi trường mới khác). Tạo thêm `supabase/migrate_05.sql` chỉ gồm phần thay đổi, chạy lại nhiều lần không lỗi (`if not exists`, `drop constraint if exists`).
5. **Tên biến môi trường thống nhất một bộ** và ghi trong `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SECRET`. Nếu code đang dùng tên khác (`ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`) thì đổi về bộ này.
6. **Hướng dẫn chủ dự án nối Supabase** – khi tới bước này, DỪNG và gửi đúng danh sách việc cho chủ dự án (tiếng Việt, từng bước, ngắn):
   a. supabase.com → New project (vùng Singapore), đặt mật khẩu database, đợi tạo xong.
   b. SQL Editor → dán toàn bộ `supabase/setup.sql` → Run.
   c. Project Settings → API → gửi lại: Project URL, anon key, service_role key.
   d. Tự đặt mật khẩu Admin.
   Nhận đủ thông tin → tự điền 5 biến lên Vercel (dùng Vercel CLI `vercel env add`, cho môi trường Production) + tạo `.env.local` → deploy lại.
7. **Kiểm thật sau khi nối:** tự kiểm trên web thật (không phải máy local).

## Tiêu chí PASS
1. [ ] Trên web thật, nhập `admin123` hoặc `1234` → bị từ chối.
2. [ ] Trong code không còn `admin123`, `1234` làm mật khẩu, không còn lưu nội dung vào `localStorage`.
3. [ ] Menu Admin hiện "Dữ liệu: Đã kết nối ✓".
4. [ ] Sửa 1 dòng chữ → mở bằng tab ẩn danh thấy ngay nội dung mới.
5. [ ] Thêm 1 khối "So sánh 2 mặt" → tải lại trang vẫn còn (đã vào Supabase).
6. [ ] Tắt mạng rồi bấm Lưu → hiện dòng đỏ báo chưa lưu được.
7. [ ] `npm run build` không lỗi.

## Báo cáo
Ngắn, đúng mẫu 6 mục ở `00_LUAT`. Ghi rõ tiêu chí nào tự kiểm trên web thật, tiêu chí nào CHƯA KIỂM CHỨNG. Không dán code. Không ghi "đạt 100%" nếu chưa kiểm từng mục.

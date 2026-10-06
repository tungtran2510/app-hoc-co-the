# CẨM NANG HOẠT ĐỘNG AI AGENT (GEMINI.md) - APP HỌC CƠ THỂ
> **Tài liệu nạp tự động cho AI Agent khi mở thư mục `d:\app-hoc-co-the`**

## 1. NGUYÊN TẮC CỐT LÕI
1. **Dự án độc lập 100%:** Đây là ứng dụng học giải phẫu & cơ thể Mobile-First (`app-hoc-co-the`), tách biệt hoàn toàn khỏi các dự án khác.
2. **Bảo vệ dữ liệu người dùng:** Tuyệt đối không can thiệp, xóa hoặc ghi đè dữ liệu trên Supabase Database (`evuhamqlzprrbuabxyyn`). Mọi cập nhật chỉ thực hiện ở tầng mã nguồn giao diện/tính năng.
3. **Chỉ sửa đúng Delta:** Giữ nguyên các khối và bài học người dùng đã soạn.
4. **Tham khảo chi tiết:** Đọc file `PROJECT_BRAIN.md` trong thư mục gốc để nắm rõ toàn bộ kiến trúc 10 khối nội dung, tài khoản quản trị và quy trình triển khai Vercel.
5. **Kiểm thử trình duyệt thật (Playwright) là điều kiện BẮT BUỘC:** Mọi thay đổi liên quan đến click, điều hướng, chuyển trang hay hiệu ứng BẮT BUỘC phải được chạy kịch bản Playwright kiểm thử trên trình duyệt thật (mobile viewport), xác nhận trang chuyển đổi thành công 100% trước khi nghiệm thu.

## 2. QUY TRÌNH TRIỂN KHAI CHUẨN
- Kiểm tra biên dịch: `cmd.exe /c npx tsc --noEmit`
- Kiểm tra build: `cmd.exe /c npm run build`
- Đẩy mã nguồn: `git push origin main`
- Triển khai Vercel: `npx vercel --prod --yes`
- **Kiểm thử trình duyệt thật (Playwright Test):** `node test_live.js` (xác nhận click các tab và chuyển trang thành công 100%)

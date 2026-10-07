# CẨM NANG HOẠT ĐỘNG AI AGENT (GEMINI.md) - APP HỌC CƠ THỂ
> **Tài liệu nạp tự động cho AI Agent khi mở thư mục `d:\app-hoc-co-the`**

## 1. NGUYÊN TẮC CỐT LÕI
1. **Dự án độc lập 100%:** Đây là ứng dụng học giải phẫu & cơ thể Mobile-First (`app-hoc-co-the`), tách biệt hoàn toàn khỏi các dự án khác.
2. **Bảo vệ dữ liệu người dùng:** Tuyệt đối không can thiệp, xóa hoặc ghi đè dữ liệu trên Supabase Database (`evuhamqlzprrbuabxyyn`). Mọi cập nhật chỉ thực hiện ở tầng mã nguồn giao diện/tính năng.
3. **Chỉ sửa đúng Delta:** Giữ nguyên các khối và bài học người dùng đã soạn.
4. **Tham khảo chi tiết:** Đọc file `PROJECT_BRAIN.md` trong thư mục gốc để nắm rõ toàn bộ kiến trúc 10 khối nội dung, tài khoản quản trị và quy trình triển khai Vercel.
5. **Kiểm thử trình duyệt thật (Playwright) là điều kiện BẮT BUỘC:** Mọi thay đổi liên quan đến click, điều hướng, chuyển trang hay hiệu ứng BẮT BUỘC phải được chạy kịch bản Playwright kiểm thử trên trình duyệt thật (mobile viewport), xác nhận trang chuyển đổi thành công 100% trước khi nghiệm thu.
6. **QUY TẮC BẤT KHẢ XÂM PHẠM (CHỤP ẢNH MOBILE & GỬI TRỰC TIẾP VÀO CHAT):**
   - **Bắt buộc gửi ảnh trực tiếp vào chat:** Sau BẤT KỂ một thao tác, tính năng, sửa lỗi, căn chỉnh nút bấm hay văn bản nào: Agent BẮT BUỘC phải dùng trình duyệt thật (Playwright mobile viewport 390x844) chụp ảnh màn hình giao diện thực tế và **GỬI TRỰC TIẾP HÌNH ẢNH ĐÓ VÀO ĐOẠN CHAT** để người dùng nghiệm thu bằng mắt thường. Tuyệt đối **CẤM báo cáo chay bằng chữ hay chỉ đưa tên file**.
   - **Chuẩn tinh gọn trên điện thoại (Mobile-First):** Hoàn thiện mỗi tính năng là phải chuẩn tinh gọn trên màn hình điện thoại, **CẤM TUYỆT ĐỐI các dòng thừa**, chữ vụn vặt, khoảng hở cồng kềnh làm rối mắt.

7. **NGUYÊN TẮC THIẾT KẾ MOBILE-FIRST ƯU TIÊN SỐ 1 (5 TIÊU CHÍ BẮT BUỘC & QUY TẮC 1 DÒNG):**
   - **5 Tiêu chí cốt lõi:** 1. Thông minh · 2. Tinh gọn · 3. Tinh tế · 4. Chuyên nghiệp · 5. Hiện đại.
   - **Quy tắc 1 dòng (Trị dứt điểm rớt dòng / orphan word):** Diện tích màn hình điện thoại rất hẹp. Bất kỳ thành phần nào (tiêu đề, thẻ thông số, nút bấm, mô tả) có thể tối ưu trên 1 dòng BẮT BUỘC phải làm trên 1 dòng. CẤM TUYỆT ĐỐI tình trạng một dòng rồi rớt lại 1 chữ sang dòng thứ hai. Tinh chỉnh câu chữ cô đọng, dùng `truncate`, `whitespace-nowrap`, `flex-nowrap` triệt để.
8. **QUY TẮC BẤT KHẢ XÂM PHẠM: TUYỆT ĐỐI KHÔNG TỰ Ý ĐẨY CODE LÊN GITHUB HOẶC VERCEL (MANDATORY PERMISSION BEFORE PUSH & DEPLOY):**
   - **Cấm tuyệt đối tự ý push/deploy:** Mọi thao tác phát triển, sửa lỗi, hoàn thiện giao diện CHỈ ĐƯỢC kiểm thử trên môi trường nội bộ (Localhost / Playwright Mobile Viewport 390x844).
   - **Bắt buộc hỏi và xin phép trước:** Sau khi sửa xong và chụp ảnh nghiệm thu, Agent BẮT BUỘC phải hỏi ý kiến người dùng và CHỜ người dùng xác nhận "Đồng ý", "Đẩy lên", "Triển khai" thì mới được phép thực thi lệnh đẩy mã nguồn (`git push origin main`) và triển khai Vercel (`vercel --prod`). Tuyệt đối KHÔNG ĐƯỢC tự ý đẩy ngầm trong im lặng khi chưa được phép!

## 2. QUY TRÌNH TRIỂN KHAI CHUẨN (KHI ĐƯỢC NGƯỜI DÙNG CHO PHÉP)
- Kiểm tra biên dịch: `cmd.exe /c npx tsc --noEmit`
- Kiểm tra build: `cmd.exe /c npm run build`
- **Kiểm thử trình duyệt thật & Chụp ảnh (Playwright Test Mobile 390x844):** Chạy script chụp ảnh thực tế, lưu vào thư mục artifact và nhúng trực tiếp ảnh vào câu trả lời để người dùng nghiệm thu.
- **HỎI Ý KIẾN NGƯỜI DÙNG:** Trình bày kết quả và xin phép triển khai.
- **CHỈ KHI NGƯỜI DÙNG ĐỒNG Ý / YÊU CẦU MỚI CHẠY:**
  - Đẩy mã nguồn: `git push origin main`
  - Triển khai Vercel: `cmd.exe /c npx vercel --prod --yes`

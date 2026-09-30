# LENH_04 – Kiểm tra tổng, tăng tốc, và hướng dẫn sử dụng (chốt V1)

## Điều kiện
Chỉ làm khi LENH_03 đã PASS.

## Đọc trước
`docs/00_LUAT.md` · `docs/01_SPEC.md` · `docs/03_THIET_KE.md` mục 5–6. Không thêm chức năng mới.

## Thư viện
Không cài thêm vào app. Được dùng công cụ kiểm tra có sẵn của trình duyệt (Lighthouse) để đo.

## 1. Tự kiểm toàn bộ theo danh sách (bề ngang 375px và 430px)
Đi hết các luồng dưới, lỗi nào gặp thì sửa luôn (chỉ sửa, không đổi thiết kế):
- Người xem: Trang chủ → mỗi chủ đề → mỗi trang → video → ảnh → PDF → Bài liên quan → Tiếp theo → Chia sẻ → Tìm kiếm → Xem tiếp.
- Admin: đăng nhập → thêm chủ đề → thêm trang → thêm đủ 13 loại khối → sửa → ▲▼ → ẩn/hiện → bản nháp → xoá → sao lưu → đăng xuất.
- Trường hợp rỗng: chủ đề chưa có trang, trang chưa có khối, khối video chưa có link, tìm không ra kết quả → đều có câu tiếng Việt, không trắng trang, không lỗi.
- Link sai (`/khong-co-that`) → màn "Không tìm thấy nội dung này".

## 2. Tăng tốc
- Ảnh: dùng `next/image` (cho phép tên miền Supabase Storage trong `next.config`), danh sách dùng `thumb_url`, ảnh dưới màn hình tải chậm (lazy).
- YouTube: chỉ tạo trình phát khi người xem bấm phát hoặc khi khối video lọt vào màn hình; trước đó chỉ hiện ảnh bìa.
- Mục tiêu Lighthouse mobile trang Tổng quan: Performance ≥ 80, Accessibility ≥ 95.

## 3. Rà chữ lần cuối
- Quét toàn bộ chữ hiển thị: không còn tiếng Anh, không lỗi chính tả, cách viết thống nhất ("Xem tiếp", "Bản nháp", "Đang hiện", "Chủ đề", "Trang nội dung").
- Tiêu đề tab trình duyệt từng trang đúng dạng "Tên trang · Tên app".

## 4. Viết hướng dẫn cho chủ dự án
Tạo `docs/HUONG_DAN_SU_DUNG.md` (tiếng Việt, câu ngắn, người không biết lập trình đọc được):
1. Đăng nhập và đăng xuất Admin.
2. Thêm chủ đề, thêm trang, sắp xếp, ẩn, bản nháp.
3. Thêm từng loại khối (13 loại), mỗi loại 2–3 dòng.
4. Đưa video lên YouTube đúng cách: chế độ **Không công khai**, bật **Cho phép nhúng**, rồi dán link.
5. Tải ảnh, tải PDF (giới hạn 20MB).
6. Sao lưu hằng tuần: bấm Sao lưu, cất file vào Google Drive.
7. Đổi mật khẩu Admin: sửa biến `ADMIN_PASSWORD` trên Vercel → Redeploy.
8. Lưu ý Supabase gói miễn phí có thể tạm dừng dự án nếu lâu không có ai dùng: cách vào Supabase bấm khôi phục.

## 5. Cập nhật tài liệu
- `docs/SKILL.md`: tình trạng V1 đã xong, cấu trúc thư mục hiện tại, những gì để sau V1.
- `docs/KE_HOACH.md`: đánh dấu LENH_01–04 XONG.

## Tiêu chí PASS
1. [ ] `npm run build` không lỗi.
2. [ ] Đi hết 2 luồng ở mục 1 không gặp lỗi, không trắng trang.
3. [ ] 4 trường hợp rỗng + link sai đều hiện câu tiếng Việt đúng.
4. [ ] Lighthouse mobile trang Tổng quan: Performance ≥ 80, Accessibility ≥ 95 (ghi số thật vào báo cáo).
5. [ ] Không còn chữ tiếng Anh trên giao diện.
6. [ ] Có `docs/HUONG_DAN_SU_DUNG.md` đủ 8 mục.

## Báo cáo
Đúng mẫu 6 mục ở `00_LUAT`, kèm danh sách lỗi đã tìm thấy và đã sửa. Không dán code.

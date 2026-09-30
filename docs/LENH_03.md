# LENH_03 – Hoàn thiện V1: Xem tiếp, tự chuyển video, phóng ảnh, Chia sẻ, Tìm kiếm, Sao lưu, Cài ra màn hình

## Điều kiện
Chỉ làm khi LENH_02 đã PASS (dữ liệu đã ở Supabase, Admin ghi qua `/api/admin`).

## Đọc trước
`docs/00_LUAT.md` · `docs/01_SPEC.md` mục 3, 4, 5 · `docs/03_THIET_KE.md` mục 4. Chỉ mở code cần sửa.

## Thư viện
KHÔNG cài thêm gì. YouTube dùng IFrame Player API (nạp script `https://www.youtube.com/iframe_api`). Icon app dùng `ImageResponse` có sẵn của Next.js.

## 1. Xem tiếp (nhớ trên máy người xem, không cần đăng nhập)
- `localStorage` key `xem_tiep` = `{ topic_slug, topic_title, page_slug, page_title, page_number, video_index, video_total, video_title, scroll_y, updated_at }`. Cập nhật khi: bắt đầu phát 1 video, và khi rời trang (lưu `scroll_y`).
- `localStorage` key `tien_do` = `{ [page_id]: { last_video: number, watched: number[] } }`. Video được tính "đã xem" khi phát hết hoặc đã xem ≥ 80% thời lượng.
- Trang chủ: thẻ Xem tiếp đọc `xem_tiep`; chưa có → ẩn thẻ. Nút mở `/<topic>/<page>?v=<video_index>`.
- Màn Chủ đề: nút chính "Xem tiếp: 0X …" nếu có tiến độ trong chủ đề này, không thì "Bắt đầu: 01 …". Mỗi thẻ trang: "4 video · Đang ở video 03" / "4 video · Đã xem hết" / "4 video · Chưa xem" + thanh tiến độ theo số video đã xem.
- Trang nội dung: có `?v=n` → trình phát chọn video n và cuộn tới khối video; mở từ Xem tiếp thì cuộn về `scroll_y` đã lưu. Danh sách video hiện "Đã xem" đúng theo `tien_do`.
- Thanh dưới "Đang xem": có `xem_tiep` → mở trang đó; không có → về Trang chủ.
- Thay `getContinue()` cứng bằng đọc phía client (component `'use client'`), bọc try/catch.

## 2. Tự chuyển video
- Dùng YouTube IFrame Player API thay iframe tĩnh. Hết video → tự phát video kế tiếp trong cùng khối; video cuối → dừng, hiện dòng "Đã xem hết danh sách · Tiếp theo: 02 Đĩa đệm" (link).
- Bấm dòng khác trong danh sách → đổi video ngay, không tải lại trang.
- `youtube_id` rỗng → giữ khung "Chưa có video" như cũ.

## 3. Chạm để xem ảnh to
- Chạm ảnh (khối Ảnh, Bộ sưu tập) → lớp phủ toàn màn hình nền đen, ảnh `object-fit: contain`, cho phép chụm 2 ngón phóng to (cho phép zoom tự nhiên của trình duyệt trong lớp phủ) và chạm đúp để phóng to 2 lần.
- Bộ sưu tập: vuốt trái/phải để qua ảnh, dòng "3/8" + chú thích ở dưới.
- Nút "Đóng" to (≥ 52px) góc trên, nút quay lại của điện thoại cũng đóng lớp phủ.

## 4. Chia sẻ
- Cuối Trang nội dung (dưới nút Tiếp theo) và trong bảng ⋮: nút **"Chia sẻ trang này"**.
- Có `navigator.share` → mở bảng chia sẻ của máy (Zalo, Messenger…). Không có → chép link, hiện thông báo nhỏ "Đã chép link".
- Thêm metadata cho từng trang (`generateMetadata`): tiêu đề = tên trang · tên app; mô tả = summary; ảnh = cover_url, không có thì ảnh bìa video đầu tiên. Để dán link vào Zalo có ảnh xem trước.

## 5. Tìm kiếm
- Trang `/tim-kiem` (mở từ ô tìm ở Trang chủ và mục "Tìm kiếm" ở thanh dưới; ô nhập tự focus).
- Tìm trong: tên chủ đề, tên + mô tả trang, tên + mô tả video, chữ trong khối text. **Không phân biệt dấu và hoa thường**: gõ "dia dem" hay "Đĩa Đệm" đều ra "Đĩa đệm".
- Làm đơn giản: 1 API đọc toàn bộ nội dung đang hiện (dữ liệu V1 nhỏ), chuẩn hoá bỏ dấu rồi so khớp trong JS. Không cần full-text search của database.
- Kết quả chia nhóm: **Chủ đề · Trang nội dung · Video**. Mỗi kết quả: tên, dòng "Cột sống · 02", đoạn trích ngắn. Bấm video → mở trang với `?v=n`.
- Không có kết quả → "Không tìm thấy. Thử từ khác, ví dụ: cột sống, đĩa đệm."
- Gõ tới đâu tìm tới đó (chờ 300ms sau khi ngừng gõ).

## 6. Sao lưu 1 chạm (chỉ Admin)
- Trên thanh đen Admin ở Trang chủ: nút **"Sao lưu"** → tải file `sao-luu-YYYY-MM-DD.json` gồm đủ 4 bảng (kể cả mục ẩn và bản nháp).
- API `/api/admin/sao-luu`, kiểm cookie Admin, sai → 401.
- Chưa cần chức năng khôi phục.

## 7. Cài ra màn hình (PWA, không làm xem offline)
- `app/manifest.ts`: name = `settings.app_name`, short_name ≤ 12 ký tự, `display: standalone`, `theme_color #0E6B5A`, `background_color #F6F4EF`, `start_url /`, `lang vi`.
- Icon 192, 512 và apple-touch-icon 180 tạo bằng `ImageResponse`: ô vuông màu #0E6B5A, icon sách trắng ở giữa.
- Service worker tối thiểu (chỉ để cài được), KHÔNG cache nội dung.
- Trong bảng ⋮ Trang chủ: mục "Cài app ra màn hình" → Android: gọi lời nhắc cài của trình duyệt nếu có; iPhone: hiện hướng dẫn 2 bước "Bấm nút Chia sẻ → Thêm vào MH chính".

## 8. Cài đặt app (Admin)
- Admin ở Trang chủ bấm vào tên app → sửa **Tên app** và **Logo** (chọn ảnh, nén như LENH_02) → lưu vào bảng `settings`.

## Tiêu chí PASS
1. [ ] `npm run build` không lỗi, không cài thêm thư viện.
2. [ ] Xem tới video 3 trang Tổng quan, đóng app, mở lại → thẻ Xem tiếp đúng "video 03", bấm vào phát đúng video 3.
3. [ ] Người mới (xoá dữ liệu trình duyệt) → Trang chủ không có thẻ Xem tiếp, màn Chủ đề hiện "Bắt đầu: 01".
4. [ ] Hết video → tự phát video kế tiếp.
5. [ ] Chạm ảnh → xem toàn màn hình, phóng to được, Đóng được bằng nút và nút quay lại.
6. [ ] Chia sẻ trên điện thoại mở bảng chia sẻ; link gửi qua Zalo mở đúng trang, có ảnh xem trước.
7. [ ] Gõ "dia dem" ra trang Đĩa đệm; gõ tên 1 video ra đúng video.
8. [ ] Bấm Sao lưu tải được file JSON đủ 4 bảng; gọi API khi chưa đăng nhập → 401.
9. [ ] Android Chrome cài được app; iPhone Safari thêm vào MH chính có icon đúng.
10. [ ] Mọi chữ mới thêm đều tiếng Việt; vùng bấm ≥ 48px.

## Báo cáo
Đúng mẫu 6 mục ở `00_LUAT`. Không dán code.

# 01_SPEC – Mô tả sản phẩm V1

## 1. App này là gì
App giúp mọi người **hiểu kiến thức về cơ thể** bằng cách xem theo lộ trình: video, hình, và những khối chữ ngắn (Ý nghĩa, Điểm cần nhớ, Chú ý, Sai lầm thường gặp, Giải pháp).
- KHÔNG phải app kiểm tra, KHÔNG có câu hỏi, KHÔNG chấm điểm.
- Người xem không cần đăng nhập.
- Mọi nội dung đều mở. Chỉ GỢI Ý thứ tự xem.
- Người dùng: người lớn tuổi, người bình thường, người làm chuyên môn → phải cực dễ dùng.
- Tên app: chưa chốt → lấy từ Cài đặt (`settings.app_name`), dữ liệu mẫu dùng "[Tên app]".

## 2. Cấu trúc – đúng 3 tầng
```
Trang chủ
 └─ Chủ đề (Cột sống, Dinh dưỡng, Nước, Tiêu hóa, …)
     └─ Trang nội dung (đánh số 01, 02, 03 …)
         └─ Khối (video, ảnh, chữ có nhãn, liên kết, tài liệu)
```
Đường dẫn:
- `/` → Trang chủ
- `/[topicSlug]` → Chủ đề, ví dụ `/cot-song`
- `/[topicSlug]/[pageSlug]` → Trang nội dung, ví dụ `/cot-song/tong-quan-ve-cot-song`
- (Lệnh 04) Admin không có đường dẫn riêng cho nội dung; chỉ có `/dang-nhap` để nhập mật khẩu.

## 3. Màn 1 – Trang chủ `/`
Từ trên xuống:
1. Thanh đầu: logo nhỏ (ô vuông bo góc màu chính + icon sách) + tên app.
2. Lời chào: "Xin chào!" (chữ phụ) + "Hôm nay mình học gì?" (tiêu đề lớn).
3. Ô tìm kiếm (Lệnh 01: chỉ hiển thị, chưa cần chạy; placeholder "Tìm bài, ví dụ: đĩa đệm").
4. Thẻ **Xem tiếp** (nền màu chính, chữ trắng):
   - dòng nhỏ: "Xem tiếp · Cột sống"
   - tiêu đề: "01 · Tổng quan về cột sống"
   - thanh tiến độ + dòng "Đang ở video 03 · Cơ – gân – dây chằng"
   - nút trắng "Xem tiếp →" → mở Trang nội dung đó.
   - Lệnh 01: dữ liệu cứng. Lệnh 03: đọc từ bộ nhớ máy. Nếu chưa xem gì: ẩn thẻ này.
5. Tiêu đề "Chủ đề" + dòng phụ "8 chủ đề".
6. Lưới 2 cột các thẻ Chủ đề: icon trong ô trắng, tên chủ đề, dòng phụ "6 nội dung" hoặc "Sắp có" (khi chưa có trang nào hiện).
7. Thanh điều hướng dưới cùng, 3 mục có chữ + icon: **Trang chủ · Đang xem · Tìm kiếm**. ("Đang xem" = mở thẳng trang đang xem dở.)

## 4. Màn 2 – Chủ đề `/[topicSlug]`
1. Nút quay lại "‹ Trang chủ".
2. Khối ảnh lớn (cover) nền màu chủ đề, chữ nhỏ "CHỦ ĐỀ" + tên chủ đề lớn.
3. Mô tả 1–2 câu.
4. Các nhãn nhỏ: "6 nội dung", "31 video", "Mỗi video 4–6 phút" (tính từ dữ liệu; nhãn thứ 3 lấy từ `topics.meta_note`, có thể trống).
5. Nút chính "Xem tiếp: 01 Tổng quan" (Lệnh 01: cứng; khi chưa xem gì: "Bắt đầu: 01 …").
6. Tiêu đề "Danh sách nội dung" + dòng gợi ý: **"Gợi ý: nếu mới bắt đầu, nên xem theo thứ tự 01 → 02 → 03."**
7. Danh sách Trang nội dung: mỗi thẻ gồm ô số lớn (01), tên, dòng phụ "4 video · Đang ở video 03" hoặc "5 video · Chưa xem", thanh tiến độ nếu đang xem, mũi tên ›. TẤT CẢ đều bấm được. Không ổ khoá.

## 5. Màn 3 – Trang nội dung `/[topicSlug]/[pageSlug]`
Một trang **cuộn dọc duy nhất**. Không tab. Không mở màn mới khi xem video.

Thanh đầu:
- trái: "‹ [Tên chủ đề]"
- phải: nút **Mục lục** (mở danh sách các khối để nhảy tới) + nút **⋮** (mở bảng nhỏ: Cỡ chữ **Vừa / Lớn**, lưu trên máy). Không có nút A+ nổi.

Phần đầu trang: dòng nhỏ "CỘT SỐNG · 01", tiêu đề trang, (khối Văn bản giới thiệu nếu có).

Sau đó là các Khối theo `sort_order`. Cách hiển thị từng loại:

| Loại khối | Hiển thị |
|---|---|
| Danh sách video | Trình phát 16:9 ở trên + danh sách bên dưới. Mỗi dòng: ảnh bìa, tên, mô tả ngắn, thời lượng, trạng thái "Đang phát / Đã xem". Bấm dòng nào → trình phát đổi sang video đó, KHÔNG rời trang. Dòng đang phát có viền màu chính. Dòng phụ dưới trình phát: "Đang phát 3/4 · Xem hết tự chuyển video tiếp". |
| Video (1 video) | Chỉ trình phát, không danh sách. |
| Ảnh | Ảnh bo góc + chú thích. (Lệnh 03: chạm để xem to, phóng to được.) |
| Bộ sưu tập ảnh | Lưới 2 cột ảnh vuông, chạm để xem to và vuốt qua lại. |
| Chữ có nhãn | Thẻ bo góc có màu nền + icon + nhãn IN HOA theo kiểu: Văn bản (không thẻ, chữ thường), Ý nghĩa, Điểm cần nhớ, Chú ý, Sai lầm thường gặp, Giải pháp. Màu & icon ở 03_THIET_KE. |
| Bài liên quan | Tiêu đề "BÀI LIÊN QUAN" + các thẻ link "Cột sống · 02 Đĩa đệm ›" mở thẳng trang đó. |
| Link ngoài | Thẻ link, mở tab mới, có icon mũi tên ra ngoài. |
| Tài liệu (PDF) | Thẻ: icon tài liệu, tên file, dung lượng, nút "Đọc" (mở PDF bằng trình xem chuẩn của trình duyệt/tab mới) + "Tải về". Không làm trình đọc PDF riêng. |

Cuối trang:
- dòng "Gợi ý theo lộ trình" + nút chính **"Tiếp theo: 02 Đĩa đệm →"** (trang kế tiếp theo sort_order trong cùng chủ đề; nếu là trang cuối thì "Về danh sách Cột sống").
- (Lệnh 03) nút **Chia sẻ** trang này.

Khoảng trống cuối trang đủ để không bị thanh dưới che.

## 6. Admin (Lệnh 04–05) – để AI hiểu hướng, CHƯA làm ở Lệnh 01
- Không có trang quản trị riêng. Admin đăng nhập 1 mật khẩu → trên CHÍNH các trang người xem hiện thêm công cụ.
- Thanh đen mỏng trên cùng: "Đang sửa trang này" + nút "Xong".
- Mỗi khối: `Sửa · ▲ · ▼ · ⋮` (⋮ = nhân bản, ẩn/hiện, xoá). Dùng ▲▼ (dễ bấm trên điện thoại); kéo thả chỉ là phụ trên máy tính.
- Cuối trang: **+ Thêm nội dung** → bảng chọn 3 nhóm, 13 lựa chọn:
  - HÌNH ẢNH & VIDEO: Ảnh · Video · Danh sách video · Bộ sưu tập ảnh
  - NỘI DUNG: Văn bản · Ý nghĩa · Điểm cần nhớ · Chú ý · Sai lầm thường gặp · Giải pháp
  - LIÊN KẾT: Bài liên quan · Link ngoài · Tài liệu
- Quản lý danh sách video: bảng trượt từ dưới lên, trang vẫn nằm phía sau. Thêm video = dán link YouTube → tự lấy ảnh bìa + tên. Thời lượng nhập tay.
- Trang và chủ đề có trạng thái Bản nháp / Đang hiện, và Ẩn / Hiện.
- Ảnh tải lên được nén trên máy trước khi gửi: rộng tối đa 1600px, WebP, mục tiêu < 300KB, tạo thêm ảnh nhỏ 400px.
- Sao lưu 1 chạm: tải toàn bộ nội dung về 1 file JSON.

## 7. Chức năng V1 và lệnh tương ứng
| # | Chức năng | Lệnh |
|---|---|---|
| 1 | 3 màn người xem, dữ liệu mẫu, deploy Vercel | 01 |
| 2 | Dữ liệu thật Supabase + nạp sẵn Cột sống | 02 |
| 3 | Phát video YouTube trong trang, Xem tiếp (nhớ trang + video + vị trí cuộn), chạm phóng ảnh, Chia sẻ | 03 |
| 4 | Admin sửa tại chỗ (mật khẩu, sửa, ▲▼, thêm/xoá/ẩn khối, bản nháp) | 04 |
| 5 | Tải ảnh có nén, quản lý danh sách video, tải PDF + mở PDF | 05 |
| 6 | Tìm kiếm, sao lưu 1 chạm, cài ra màn hình (PWA) | 06 |

## 8. KHÔNG làm ở V1
Quiz, khoá bài, đăng nhập người xem, yêu thích, playlist cá nhân, thông báo, thống kê, xem offline, AI, đa ngôn ngữ, nhiều khách hàng (chỉ để sẵn `workspace_id`), trình đọc PDF riêng.

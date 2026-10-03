# DỰ ÁN: APP HỌC CƠ THỂ & GIẢI PHẪU (APP-HOC-CO-THE)
> **Bộ nhớ dùng chung & Bối cảnh phát triển toàn diện (Project Brain)**  
> Cập nhật lần cuối: 04/10/2026

---

## 1. TỔNG QUAN DỰ ÁN & HẠ TẦNG KỸ THUẬT
- **Tên dự án:** Học Cơ Thể & Giải Phẫu 3D (Mobile-First Web App).
- **Thư mục dự án độc lập:** `d:\app-hoc-co-the`.
- **Framework & Công nghệ:** Next.js 14.2.15 (App Router), React 18, Tailwind CSS, Lucide Icons, TypeScript.
- **Hosting & Triển khai:** Vercel Production (`https://app-hoc-co-the.vercel.app`).
- **Kho mã nguồn:** GitHub (`tungtran2510/app-hoc-co-the`), nhánh chính `main`.
- **Cơ sở dữ liệu Đám mây:** Supabase độc lập (`evuhamqlzprrbuabxyyn`):
  - Bảng chính: `topics` (Chủ đề), `pages` (Bài học), `blocks` (Khối nội dung), `settings` (Cấu hình hệ thống & Admin).
  - Storage: Supabase Storage lưu trữ hình ảnh nén WebP và tài liệu PDF.

---

## 2. TÀI KHOẢN QUẢN TRỊ CỦA NGƯỜI DÙNG
- **Trang đăng nhập:** `https://app-hoc-co-the.vercel.app/dang-nhap`
- **Số điện thoại:** `0974248716`
- **Mật khẩu:** `Tung@2510`
- **Tên người dùng:** Tùng Dinh Dưỡng
- **Vai trò:** Admin toàn quyền (Chỉnh sửa nội dung trực tiếp tại chỗ trên trang học).

---

## 3. KIẾN TRÚC NỘI DUNG (3 CẤP: TOPIC -> PAGE -> BLOCK)
Mỗi chủ đề gồm nhiều bài học, mỗi bài học gồm danh sách các khối nội dung (`blocks`).
Hệ thống hỗ trợ đầy đủ **10 khối nội dung chuẩn**:
1. **Khối Hình ảnh & Video:**
   - **Ảnh đơn (`display_style: 'single'`):** Hiển thị 1 ảnh rõ nét, có giao diện chọn ảnh từ máy (tự động nén WebP và chèn ngay), dán link, cắt khung (Crop) theo tỷ lệ.
   - **Bộ sưu tập ảnh (`display_style: 'gallery'`):** Danh sách nhiều ảnh dạng lưới/vuốt, tự động thêm ảnh ngay khi tải từ máy.
   - **Video đơn:** Nhập link YouTube, tự động lấy tiêu đề và ảnh bìa gốc, cho phép đổi ảnh bìa tùy chọn.
   - **Danh sách video:** Quản lý nhiều video bài giảng trong bài học.
2. **Khối Chữ & Ghi nhớ:**
   - **Văn bản (`van_ban`):** Đoạn văn bản mô tả, đính kèm được ảnh và PDF.
   - **Ý nghĩa (`y_nghia`):** Khối nêu bật ý nghĩa y học/chức năng.
   - **Điểm cần nhớ (`diem_can_nho`):** Khối thẻ nhớ quan trọng màu xanh navy/vàng.
   - **Chú ý (`chu_y`):** Khối cảnh báo màu hổ phách/cam.
   - **Sai lầm thường gặp (`sai_lam`):** Khối lưu ý các thói quen sai gây tổn thương cơ thể.
   - **Giải pháp (`giai_phap`):** Khối hướng dẫn bài tập / phương pháp cải thiện.
3. **Các khối bổ trợ khác:** So sánh 2 cột (`comparison`), Câu hỏi thường gặp (`faq`), Mã HTML tùy biến (`html`), Tài liệu Atlas PDF (`files`).

---

## 4. BẢO VỆ DỮ LIỆU & NGUYÊN TẮC KỸ THUẬT QUAN TRỌNG (STRICT GUARD-RAILS)
1. **Lưu thẳng vào Supabase Cloud (Direct Save):**
   - Mọi thao tác thêm/sửa khối gọi thẳng `saveBlockApi` lên Supabase. Không dùng fallback lưu ảo vào `localStorage` của trình duyệt.
   - Khi cập nhật mã nguồn (Deploy Vercel), **CHỈ cập nhật phần code giao diện**, tuyệt đối **KHÔNG xóa hay ghi đè Database Supabase**. Dữ liệu người dùng được bảo toàn 100%.
2. **Không tự ý ẩn khối nội dung:**
   - Cấm thêm bộ lọc ẩn khối chữ khi có video (lỗi cũ đã gỡ bỏ hoàn toàn). Tất cả các khối người dùng tạo ra phải được hiển thị trung thực trên trang.
3. **Tránh Unsplash trên mạng Việt Nam:**
   - Cấm dùng link `images.unsplash.com` làm ảnh mặc định vì dễ bị chặn trên Viettel/Vinaphone. Dùng ảnh nội bộ `/spine_hero_clean.png` hoặc Supabase Storage.
4. **Tự động gắn tệp khi upload:**
   - Khi người dùng bấm "Chọn từ máy", ngay khi hoàn tất tải lên hệ thống phải tự động gán vào mảng dữ liệu, không bắt người dùng bấm thêm nút phụ.

---

## 5. ĐỊNH HƯỚNG THƯƠNG MẠI HÓA TRONG TƯƠNG LAI
- **Mô hình Quản lý Giảng viên / Đa khóa học:**
  - Thêm tính năng phân quyền trong Admin: Chủ sở hữu (`0974248716`) có thể tự tạo tài khoản con (SĐT + Mật khẩu) và gán quyền quản lý từng chủ đề/khóa học cụ thể cho từng người khác.
  - Người được cấp quyền đăng nhập vào chỉ nhìn thấy và biên tập đúng khóa học của mình.
- **Mô hình White-label (Bán cho đối tác theo tên miền riêng):**
  - Cung cấp web riêng với logo, thương hiệu và nội dung độc lập cho từng khách hàng hoặc phòng khám.

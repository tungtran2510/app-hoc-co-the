# App Học Cơ Thể - System Architecture & Implementation Skill

Kỹ năng điều phối, phát triển và bảo trì toàn diện cho ứng dụng học hiểu kiến thức cơ thể theo lộ trình (`app-hoc-co-the`).

---

## 1. Triết lý & Quy tắc Cốt lõi (Strict Rules)
1. **Kiến trúc 3 tầng bất biến:**
   `Trang chủ (Home)` → `Chủ đề (topics)` → `Trang nội dung (pages)` → `Khối (blocks)`.
   *Cấm tuyệt đối* tạo khái niệm trung gian như Course, Series, Lesson, Module hay Unit.
2. **Không ép buộc – Mọi nội dung đều mở (OPEN):**
   Không làm: quiz, câu hỏi, điểm số, khoá bài, đăng nhập người xem, AI, thông báo, thống kê. Chỉ gợi ý thứ tự xem.
3. **100% Tiếng Việt có dấu:**
   Giao diện hiển thị cho người dùng không được có bất kỳ từ tiếng Anh nào (kể cả Loading, Back, Next, Search, Error, Menu, Home, Save, Cancel). Tất cả nút icon phải có `aria-label` tiếng Việt.
4. **Chuẩn Mobile-First & Người lớn tuổi:**
   - Font: **Be Vietnam Pro** qua `next/font/google`.
   - Chữ nội dung $\ge 19\text{px}$, chữ phụ $\ge 14\text{px}$, tiêu đề $\ge 28\text{px}$.
   - Vùng bấm tối thiểu $48 \times 48\text{px}$, nút chính cao $60 - 64\text{px}$.
   - Trên máy tính: nội dung căn giữa, rộng tối đa 480px, nền hai bên là `#F6F4EF`.
   - Một trang cuộn dọc duy nhất, không tab, không mở màn mới khi xem video.

---

## 2. Mô hình Dữ liệu & 13 Khối Nội dung

### 5 Loại Gốc (`type`) & Kiểu Hiển Thị (`display_style`)
| Menu Admin | type | display_style | Cấu trúc dữ liệu (`data`) |
|---|---|---|---|
| **Văn bản** | `text` | `van_ban` | `{ lines: string[], format?: 'paragraph' }` |
| **Ý nghĩa** | `text` | `y_nghia` | `{ lines: string[] }` (icon Lightbulb, nền `#E6F2EF`, chữ `#0A4F43`) |
| **Điểm cần nhớ** | `text` | `diem_can_nho` | `{ lines: string[], format: 'numbered' }` (icon SquareCheck, nền `#E3ECF7`, chữ `#244A78`) |
| **Chú ý** | `text` | `chu_y` | `{ lines: string[] }` (icon TriangleAlert, nền `#FFF1E6`, chữ `#8A3A14`) |
| **Sai lầm thường gặp** | `text` | `sai_lam` | `{ lines: string[] }` (icon CircleX, nền `#FBE7E1`, chữ `#7A2F12`) |
| **Giải pháp** | `text` | `giai_phap` | `{ lines: string[], format: 'bullet' }` (icon Wrench, nền `#EDF3E4`, chữ `#3C5420`) |
| **Video đơn** | `videos` | `single` | `{ videos: [Video] }` |
| **Danh sách video** | `videos` | `playlist` | `{ videos: [Video, ...] }` |
| **Ảnh đơn** | `images` | `single` | `{ images: [Image] }` |
| **Bộ sưu tập ảnh** | `images` | `gallery` | `{ images: [Image, ...] }` (lưới 2 cột) |
| **Bài liên quan** | `links` | `related` | `{ items: [{ page_id, label }] }` |
| **Link ngoài** | `links` | `external` | `{ items: [{ url, label }] }` |
| **Tài liệu (PDF)** | `files` | `pdf` | `{ files: [FileItem] }` |

---

## 3. Cơ chế Admin Sửa Tại Chỗ (In-Place Visual Editor)

### A. Đăng nhập Admin
- Đường dẫn: `/dang-nhap`.
- Chỉ cần 1 mật khẩu admin duy nhất (mặc định hoặc cấu hình qua biến môi trường `ADMIN_PASSWORD`).
- Lưu trạng thái đăng nhập qua HTTP cookie hoặc phiên an toàn.

### B. Thanh công cụ trên cùng ("Admin Bar")
- Khi ở chế độ admin, thanh đen mỏng hiện trên đỉnh trang:
  `[Bút Sửa] Đang sửa trang này` + Nút `Xong` (để thoát chế độ chỉnh sửa).
- Nút chuyển đổi nhanh trạng thái: `Đang hiện cho người xem` / `Bản nháp`.

### C. Nút thao tác trên từng khối
Mỗi khối trong trang có một hàng nút điều khiển:
- `Sửa`: Mở modal chỉnh sửa nội dung khối.
- `▲`: Di chuyển khối lên trên 1 vị trí.
- `▼`: Di chuyển khối xuống dưới 1 vị trí.
- `⋮`: Menu dropdown với các lựa chọn:
  + `Ẩn / Hiện`: Bật tắt `is_visible`.
  + `Nhân bản`: Tạo 1 bản sao của khối ngay bên dưới.
  + `Xóa`: Xóa khối sau khi xác nhận.

### D. Nút "+ Thêm nội dung" (Drawer chọn 13 loại khối)
Bấm nút `+ Thêm nội dung` ở cuối trang mở modal chọn dạng khối phân thành 3 nhóm rõ ràng:
1. **HÌNH ẢNH & VIDEO:** Ảnh đơn · Bộ sưu tập ảnh · Video đơn · Danh sách video.
2. **NỘI DUNG:** Văn bản · Ý nghĩa · Điểm cần nhớ · Chú ý · Sai lầm thường gặp · Giải pháp.
3. **LIÊN KẾT & TÀI LIỆU:** Bài liên quan · Link ngoài · Tài liệu (PDF).

---

## 4. Xử lý Media Tự động (YouTube, Ảnh, PDF)

### A. YouTube oEmbed Parser
- Tự động nhận diện mọi định dạng link YouTube:
  + `https://www.youtube.com/watch?v=VIDEO_ID`
  + `https://youtu.be/VIDEO_ID`
  + `https://www.youtube.com/shorts/VIDEO_ID`
- Trích xuất `youtube_id` chuẩn xác.
- Tự động gọi API oEmbed của YouTube (`https://www.youtube.com/oembed?url=...&format=json`) để lấy **Tiêu đề** và **Ảnh bìa HD** (`https://i.ytimg.com/vi/{id}/hqdefault.jpg`) mà người dùng không cần gõ tay.
- Video Player: nhúng iframe `https://www.youtube-nocookie.com/embed/{id}?rel=0&playsinline=1`. Khi bấm video trong danh sách, đổi video đang phát trực tiếp trên trang, không tải lại trang.

### B. Nén Ảnh Phía Trình Duyệt (Client-Side Canvas Compressor)
- Người dùng tải ảnh từ điện thoại (thường 5–10MB):
- Tự động vẽ lên HTML5 Canvas, giới hạn chiều rộng tối đa 1600px.
- Xuất sang định dạng **WebP chất lượng cao với dung lượng < 300KB**.
- Tự động tạo thêm thumbnail nhỏ 400px phục vụ chế độ gallery.

### C. Quản lý Tài liệu PDF
- Cho phép dán đường dẫn hoặc tải file PDF lên.
- Hiển thị tên file, dung lượng (KB/MB).
- Có 2 nút chuẩn: `Đọc` (mở bằng trình duyệt) và `Tải về`.

---

## 5. Lưu trữ & Đồng bộ Dữ liệu
- Hỗ trợ lưu trữ bền vững:
  1. **Local Persistent Storage:** Lưu trữ vào bộ nhớ trình duyệt để người dùng có thể thao tác và kiểm tra ngay lập tức.
  2. **Supabase Database & Storage:** Khi cấu hình biến môi trường (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), tự động đồng bộ 2 chiều vào Supabase.

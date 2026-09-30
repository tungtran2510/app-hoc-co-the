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

## 5. Lưu trữ & Đồng bộ Dữ liệu (Supabase + In-Place Admin)
- Toàn bộ dữ liệu nằm ở Supabase PostgreSQL (4 bảng: `settings`, `topics`, `pages`, `blocks`).
- Mọi thao tác ghi (thêm, sửa, xóa, di chuyển) đi qua Route Handler `/api/admin/*` kiểm tra cookie HMAC-SHA256 bảo mật phía server, ghi bằng `SUPABASE_SERVICE_ROLE_KEY`.
- Không còn lưu `localStorage` cho nội dung bài học. Khi sửa 1 lần, bất kỳ người dùng nào mở ứng dụng cũng thấy nội dung cập nhật ngay lập tức.
- Bucket Storage `media` lưu ảnh WebP đã nén và file PDF tải lên qua Signed Upload URL.

---

## 6. Tính năng Nâng cao V1 (LENH_03 & LENH_04)
1. **Xem tiếp & Tiến độ học tập:**
   - Nhớ vị trí học và video đang xem trên thiết bị học viên qua `localStorage` (`xem_tiep`, `tien_do`).
   - Tự động nhận diện tiến độ, hỗ trợ param `?v=n`, cuộn về vị trí học trước đó.
2. **YouTube IFrame Player API:**
   - Tự động chuyển tiếp video kế tiếp khi xem hết video hiện tại.
   - Nhận diện khi xem $\ge 80\%$ thời lượng để đánh dấu đã học.
   - Khi kết thúc playlist hiển thị thông báo "Đã xem hết danh sách · Tiếp theo: ...".
3. **Phóng to Ảnh (Lightbox):**
   - Hỗ trợ chụm 2 ngón tay (pinch-to-zoom) và chạm đúp (double-tap) phóng to 2 lần.
   - Vuốt trái/phải xem bộ sưu tập, nút Đóng $\ge 52\text{px}$, tích hợp nút Back của điện thoại.
4. **Chia sẻ & OpenGraph Metadata:**
   - Tích hợp `navigator.share` native mở bảng chia sẻ Zalo, Messenger hoặc chép link.
   - Thẻ OpenGraph động hỗ trợ hiển thị tiêu đề, mô tả và hình ảnh xem trước chuẩn trên mạng xã hội.
5. **Tìm kiếm Nhanh (`/tim-kiem`):**
   - Tìm kiếm không phân biệt dấu và hoa thường trên toàn bộ chủ đề, bài học, video và đoạn văn.
   - Phân nhóm kết quả trực quan (Chủ đề · Trang nội dung · Video).
6. **Sao lưu 1 Chạm:**
   - Xuất toàn bộ 4 bảng dữ liệu ra file `sao-luu-YYYY-MM-DD.json` bảo mật.
7. **Cài Đặt Ứng Dụng (PWA):**
   - Hỗ trợ Web App Manifest, icon SVG/PNG qua Next.js ImageResponse, Service Worker tối thiểu và hướng dẫn cài ra màn hình chính cho Android & iOS.

---

## 7. Cấu trúc Thư mục Dự án Hiện tại
```
app-hoc-co-the/
├── docs/                      # Toàn bộ tài liệu kỹ thuật, luật và hướng dẫn
│   ├── 00_LUAT.md
│   ├── 01_SPEC.md
│   ├── 02_DU_LIEU.md
│   ├── 03_THIET_KE.md
│   ├── HUONG_DAN_SU_DUNG.md   # Hướng dẫn 8 mục cho chủ dự án
│   ├── KE_HOACH.md
│   ├── LENH_01.md
│   ├── LENH_02.md
│   ├── LENH_03.md
│   ├── LENH_04.md
│   └── SKILL.md               # File này
├── public/                    # Tài nguyên tĩnh & Service worker
│   └── sw.js
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [topicSlug]/       # Màn Chủ đề và Trang nội dung
│   │   ├── api/admin/         # 8 API bảo mật quản trị và sao lưu
│   │   ├── api/search/        # API tìm kiếm nhanh
│   │   ├── dang-nhap/         # Màn đăng nhập quản trị
│   │   ├── tim-kiem/          # Màn tìm kiếm nội dung
│   │   ├── layout.tsx         # Root layout (PWA, font Be Vietnam Pro)
│   │   ├── manifest.ts        # PWA Web Manifest
│   │   └── page.tsx           # Trang chủ
│   ├── components/            # Các UI Component di động
│   │   ├── admin/             # Các Modal quản trị (EditTopic, EditPage, EditBlock...)
│   │   ├── blocks/            # Render 13 loại khối nội dung
│   │   ├── BottomNav.tsx      # Thanh điều hướng 3 mục dưới đáy
│   │   ├── Lightbox.tsx       # Trình xem ảnh phóng to toàn màn hình
│   │   └── ...
│   └── lib/                   # Xử lý dữ liệu, nén ảnh, xác thực, Supabase
└── supabase/
    └── setup.sql              # File SQL khởi tạo toàn bộ CSDL và dữ liệu mẫu
```

---

## 8. Những Gì Để Sau V1
- Danh sách yêu thích / bookmark bài học.
- Đăng nhập người học và đồng bộ tiến độ qua đám mây giữa nhiều thiết bị.
- Thông báo nhắc học định kỳ qua Web Push.
- Bảng thống kê số lượt xem, tỷ lệ hoàn thành bài học.
- Chế độ tải nội dung xem offline toàn diện.
- Tích hợp trợ lý AI hỏi đáp nội dung y khoa.
- Đa ngôn ngữ (Tiếng Anh, v.v.).
- Chế độ khóa lộ trình tuần tự (GUIDED / LOCKED).
- Nền tảng SaaS phân quyền nhiều khách hàng (Multi-workspace).


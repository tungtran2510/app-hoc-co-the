# TÀI LIỆU HƯỚNG DẪN VẬN HÀNH HỆ THỐNG PRODUCTION (SOP v1.0)
### Ứng Dụng Học Cơ Thể & Atlas Giải Phẫu 3D Chuyên Sâu (Production Release v1.0.0)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Hệ thống được phát triển theo mô hình Hybrid Web-first & Offline PWA, phục vụ đào tạo giải phẫu học thuật, chăm sóc sức khỏe chủ động và đối chiếu lâm sàng:
1. **Core Web App (Next.js 14 App Router):**
   - Cung cấp giao diện học tập theo chủ đề/bài học, quản trị nội dung, lớp học 3D và trạm chẩn đoán hình ảnh lâm sàng.
   - Lưu trữ tiến độ học tập đa tầng: LocalStorage + IndexedDB Offline + Đồng bộ số điện thoại/Supabase.
2. **3D Anatomy Atlas Engine (Three.js 0.185 + Draco WASM + WebXR):**
   - Nhúng độc lập tại `/giai-phau-3d` và đối chiếu tại `/chan-doan-hinh-anh`.
   - Nén hình học tối ưu: 7 hệ giải phẫu (Skeletal, Muscular, Nervous, Cardiovascular, Visceral, Joints, Lymphatic) chỉ chiếm tổng cộng 13.88 MB.
   - Chạy mượt mà 60 FPS trên cả iPhone, điện thoại Android và Desktop.
3. **PWA & Offline Service Worker (`atlas-v1.0.0`):**
   - Tải trước khung app và decoder Draco. Cung cấp bộ quản lý tải mô hình 3D theo từng hệ độc lập.
   - Cơ chế Transactional Outbox tự động đồng bộ bookmark, ghi chú và bài tập khi có kết nối mạng trở lại.

---

## 2. HƯỚNG DẪN VẬN HÀNH THEO PHÂN QUYỀN

### A. Dành Cho Học Viên & Sinh Viên Y Khoa
1. **Khám Phá Atlas 3D Toàn Cảnh (`/giai-phau-3d`):**
   - **Xoay / Zoom / Di chuyển:** Thao tác vuốt 1 ngón để xoay, 2 ngón để zoom/pan trên màn hình cảm ứng; chuột trái/phải/con lăn trên desktop.
   - **Chọn chi tiết:** Chạm vào bất kỳ cấu trúc nào để xem nhãn tên 3 thứ tiếng (Việt – Anh – Latinh TA2), mô tả giải phẫu, liên quan cơ–xương–thần kinh–mạch máu và video bài học liên kết.
   - **Thanh công cụ thao tác:**
     + Ẩn (Hide) / Cô lập (Isolate) / Trong suốt (Ghost) cấu trúc đang chọn.
     + Bóc tách nhiều lớp (Exploded View): Kéo thanh trượt để tách các cơ quan theo trục giải phẫu.
     + Đo kích thước thực tế (Ruler 3D) & Cắt mặt phẳng (Clipping Plane: Axial, Coronal, Sagittal).
     + Chế độ chuyển động sinh lý (Dynamic Motion): Xem tim đập, lồng ngực thở, cử động khớp gối/khuỷu.
     + Thực tế tăng cường (AR): Đặt mô hình vào phòng thực tế qua camera điện thoại hoặc WebXR.
2. **Chế Độ Học Lớp Học & Bài Tập (`/lop-hoc`):**
   - Tham gia lớp bằng mã mời của giảng viên.
   - Làm bài tập trắc nghiệm giải phẫu và bài tập chạm đúng vị trí 3D.
   - Tạo liên kết chia sẻ góc nhìn 3D có sẵn cấu trúc được isolate để gửi cho bạn học.
3. **Chẩn Đoán Hình Ảnh & Lâm Sàng (`/chan-doan-hinh-anh`):**
   - Lọc theo 5 phương thức: X-quang, CT Scanner, MRI, Siêu âm FAST, Lát cắt giải phẫu.
   - Bấm vào các điểm Hotspot trên phim chụp để highlight cấu trúc giải phẫu tương ứng và đồng bộ độ sâu mặt cắt 3D.
   - Đọc hồ sơ ca bệnh (bệnh sử, triệu chứng, dấu hiệu hình ảnh, liên hệ giải phẫu, cạm bẫy).
   - Làm bài trắc nghiệm suy luận lâm sàng và xem phân tích giải thích y khoa.

### B. Dành Cho Giảng Viên & Bác Sĩ Hướng Dẫn
1. **Quản Lý Lớp Học & Giao Bài Tập (`/lop-hoc`):**
   - Bấm chuyển vai trò sang **"Giảng viên"**.
   - Tạo lớp học mới (nhận mã lớp 6 ký tự để chia sẻ cho sinh viên).
   - Tạo bài tập mới: Giao bài đọc, chỉ định cấu trúc 3D cần nhận diện, hoặc đính kèm bộ câu hỏi trắc nghiệm.
   - Chấm điểm bài nộp và theo dõi tỷ lệ hoàn thành của từng sinh viên.
2. **Tạo Link 3D Trực Quan Giảng Dạy:**
   - Trong giao diện 3D, xoay góc nhìn mong muốn, cô lập cấu trúc cần nhấn mạnh.
   - Bấm nút **"Chia sẻ góc nhìn"** -> Nhận link ngắn (ví dụ: `#sys=skeletal&sel=femur&iso=femur`) để dán vào bài giảng PowerPoint hoặc giáo án.

### C. Dành Cho Quản Trị Viên (Admin)
1. **Đăng Nhập Quản Trị:**
   - Truy cập `/dang-nhap`, nhập mật khẩu quản trị để mở quyền biên tập.
2. **Quản Trị Thuật Ngữ & Cấu Trúc 3D Không Cần Sửa Code (`/admin/giai-phau`):**
   - Thêm/sửa thuật ngữ: Tên tiếng Việt, tên Latinh chuẩn TA2, tên tiếng Anh, tên gọi khác phổ biến.
   - Liên kết cấu trúc với video YouTube và bài giảng tương ứng.
   - Xem cảnh báo dữ liệu: Cảnh báo cấu trúc thiếu tên Latinh, thiếu video, hoặc trùng lặp mã mesh.
   - Phê duyệt trạng thái: *Đã kiểm duyệt* / *Chờ duyệt* / *Cần bổ sung*.
3. **Kiểm Soát Phiên Bản & Rollback Dữ Liệu:**
   - Hệ thống tự động lưu snapshot mỗi khi có thay đổi.
   - Có thể rollback về bất kỳ phiên bản nào trước đó chỉ bằng 1 cú click chuột mà không ảnh hưởng đến code gốc.
4. **Chạy Bộ Kiểm Soát Chất Lượng Tự Động (QC Suite):**
   - Ngay trong trang quản trị, bấm nút **"Chạy QC Tự Động"**.
   - Bộ QC sẽ tự động kiểm tra 32 chỉ số: File size GLB, giải mã Draco, tính toàn vẹn phân cấp cha-con, bản quyền CC-BY và trạng thái Service Worker. Chỉ phát hành khi đạt điểm tuyệt đối 100/100 PASS.
5. **Sao Lưu & Khôi Phục Dữ Liệu:**
   - Bấm nút **"Sao lưu"** trên thanh header admin hoặc gọi GET `/api/admin/sao-luu` để tải toàn bộ cấu hình, chủ đề, bài học và cấu trúc giải phẫu dưới dạng file JSON an toàn.

---

## 3. TIÊU CHUẨN HIỆU NĂNG & THIẾT BỊ HỖ TRỢ

| Hạng mục | Tiêu chuẩn đạt được | Thiết bị kiểm thử |
| :--- | :--- | :--- |
| **FPS 3D Runtime** | 58 - 60 FPS ổn định | iPhone 13, Galaxy S22, Chrome Desktop |
| **Dung lượng 3D Model** | 13.88 MB cho toàn bộ 7 hệ cơ quan | Nén Draco WASM cấp độ 7 |
| **Thời gian nạp khởi đầu** | < 1.2 giây trên mạng 4G | Service Worker Pre-cache |
| **Tiêu thụ RAM** | < 180 MB trên trình duyệt mobile | Bộ dọn dẹp GPU BVH / Textures tự động |
| **Khả năng Offline** | 100% chức năng xem mô hình, ghi chú, bookmark | PWA Cache Storage + IndexedDB |

---

## 4. QUY TRÌNH ROLLBACK & KHẮC PHỤC SỰ CỐ (TROUBLESHOOTING)

### Sự cố 1: Mô hình 3D hiển thị màn hình đen trên một số máy đời cũ
- **Nguyên nhân:** WebGL context bị mất do tràn bộ nhớ GPU hoặc trình duyệt chưa hỗ trợ WebGL 2.0.
- **Cách khắc phục:**
  1. Vào menu Atlas 3D -> Bấm **"Giải phóng bộ nhớ RAM/GPU"**.
  2. Mở trình duyệt Chrome/Safari và kiểm tra cờ hỗ trợ Hardware Acceleration đã bật.

### Sự cố 2: Sinh viên cập nhật bài mới nhưng app vẫn hiện nội dung cũ
- **Nguyên nhân:** PWA Service Worker đang giữ cache cũ.
- **Cách khắc phục:**
  1. Banner cập nhật tự động xuất hiện: Bấm **"Cập nhật ngay"** trên thanh thông báo.
  2. Hoặc vào menu -> Chọn **"Quản lý bộ nhớ Cache & Offline"** -> Bấm **"Làm mới dữ liệu từ máy chủ"**.

### Sự cố 3: Dữ liệu thuật ngữ bị nhập sai hàng loạt trong phiên làm việc
- **Cách khắc phục:**
  1. Truy cập `/admin/giai-phau`.
  2. Tại bảng **"Lịch sử phiên bản & Rollback"**, chọn phiên bản gần nhất đã được kiểm duyệt (`v1.0.0`) -> Bấm **"Khôi phục phiên bản này"**.

---

## 5. THÔNG TIN BẢN QUYỀN VÀ TRÁCH NHIỆM Y KHOA

1. **Bản Quyền Dữ Liệu Hình Học 3D:**
   - Sử dụng tập dữ liệu giải phẫu mở từ **Z-Anatomy** và **BodyParts3D** theo giấy phép **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.
   - Ghi nhận đầy đủ nguồn gốc tác giả tại file `NOTICE` và `public/models/License.txt`.
2. **Tuyên Bố Trách Nhiệm Học Thuật:**
   - Toàn bộ nội dung học tập, hình ảnh đối chiếu X-quang, CT, MRI, siêu âm và phân tích ca lâm sàng được xây dựng strictly cho mục đích giáo dục, nghiên cứu học thuật và đào tạo y khoa. Tuyệt đối không được dùng để thay thế chẩn đoán hoặc chỉ định điều trị y tế thực tế.

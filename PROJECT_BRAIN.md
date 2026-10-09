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
5. **Quy chuẩn Điều hướng Native, Hiệu ứng CSS Active & Kiểm thử trình duyệt thật (BẮT BUỘC):**
   - **Điều hướng Native vững chắc:** Toàn bộ các liên kết điều hướng chính (BottomNav, thẻ Chuyên đề TopicCard, danh sách TopicTile, Breadcrumbs, PageCard, nút Chuyển bài) sử dụng thẻ `<a>` chuẩn kết hợp âm thanh phản hồi `playTapSound()`. Tuyệt đối không để React re-render trên `onTouchStart` vì sẽ khiến trình duyệt di động (WebKit/Chrome) hủy sự kiện click.
   - **Hiệu ứng chạm & phát sáng bằng CSS thuần:** Hiệu ứng phát quang bìa sách 3D (`.topic-card-glow`, `.topic-card-spine`, `.topic-card-badge`, `.topic-card-img`) được kích hoạt tức thì qua CSS `:active` và `:hover`, phản hồi 0ms trên cả điện thoại cảm ứng và chuột máy tính.
   - **Kiểm thử bằng trình duyệt thật là điều kiện bắt buộc:** Trước khi bàn giao bất kỳ bản sửa lỗi nào liên quan đến click/chuyển trang/giao diện, BẮT BUỘC phải chạy script Playwright trên trình duyệt thật để kiểm tra toàn bộ luồng nhấp chuột và chuyển URL thực tế.
6. **TUYỆT ĐỐI KHÔNG TỰ Ý ĐẨY LÊN GITHUB HOẶC TRIỂN KHAI VERCEL KHI CHƯA ĐƯỢC PHÉP:**
   - Mọi thao tác code, sửa lỗi, căn chỉnh chỉ được kiểm thử trên môi trường nội bộ local (Playwright mobile).
   - BẮT BUỘC phải hỏi và xin phép người dùng trước. Chỉ khi người dùng đồng ý hoặc yêu cầu đẩy thì mới được chạy `git push` hoặc `vercel --prod`. CẤM TUYỆT ĐỐI đẩy ngầm khi chưa được phép!

---

## 5. HỆ THỐNG PHÂN QUYỀN ĐA KHÓA HỌC & GIẢNG VIÊN (RBAC) - ĐÃ HOÀN TẤT
- **Chủ sở hữu tối cao (Super Admin):**
  - SĐT: `0974248716` (Tùng Dinh Dưỡng) hoặc mật khẩu quản trị máy chủ.
  - Toàn quyền 100%: Quản lý tất cả khóa học, cài đặt chung, sao lưu CSDL, và trực tiếp cấp/sửa/xóa tài khoản giảng viên con tại tab "Giảng viên" trong Cài đặt quản trị.
- **Tài khoản Giảng viên (Instructor Sub-Accounts):**
  - Đăng nhập bằng SĐT + Mật khẩu riêng tại `/dang-nhap`.
  - Phân quyền theo danh sách chủ đề (`allowed_topic_ids`): Chỉ thấy nút sửa, thêm khối, quản lý bài học trên những chủ đề được bàn giao.
  - Tự động chặn quyền chỉnh sửa tại cả 2 tầng:
    + Client: Không hiện các nút quản trị trên bài học ngoài phạm vi.
    + Server API: `/api/admin/save-block`, `/api/admin/delete-block`, `/api/admin/save-page` kiểm tra quyền sở hữu chủ đề trước khi ghi vào Supabase.
  - Ẩn hoàn toàn các chức năng nhạy cảm (Đổi tên app, Đổi mật khẩu hệ thống, Sao lưu CSDL).

---

## 6. HỆ THỐNG ĐA CƠ SỞ SAAS & WHITE-LABEL WORKSPACES - ĐÃ HOÀN TẤT
- **Mô hình Cơ sở / Khách hàng SaaS (`?ws=[slug]` hoặc Custom Domain):**
  - Cung cấp web riêng với logo, thương hiệu, tài khoản Admin và nội dung độc lập cho từng bác sĩ / phòng khám / đối tác.
  - Quản trị tập trung tại tab **"Cơ sở SaaS"** trong Cài đặt quản trị (chỉ Super Admin `0974248716` truy cập được).
  - Tính năng cấp app tức thì:
    + Tự động tạo slug định danh (vd: `bs-tuan` -> link `/?ws=bs-tuan`).
    + Cấp tài khoản quản trị riêng (SĐT + Mật khẩu quản trị cho khách).
    + Tùy chọn nhân bản/sao chép toàn bộ bộ khóa học mẫu hiện tại hoặc để trống cho khách tự soạn từ đầu.
    + Bật/tắt khóa app khách hàng khi hết hạn dịch vụ hoặc tạm ngưng hợp đồng.
    + Bảo vệ dữ liệu tuyệt đối: Dữ liệu phân tách theo `workspace_id`, không bao giờ lẫn lộn hay đè lên dữ liệu gốc `default`.

---

## 7. HỆ THỐNG TRỢ LÝ AI & ĐỊNH VỊ CHÍNH XÁC VIDEO BÀI GIẢNG (AI COPILOT) - ĐÃ HOÀN TẤT
- **Định vị chính xác từng video trong bài học:**
  - AI Catalog tự động quét và đánh chỉ mục toàn bộ danh sách video (`videos` block) từ Supabase.
  - Khi học viên hỏi bất kỳ vấn đề gì (bốc vác, ngồi văn phòng, uống nước, giải nén cột sống...), AI gợi ý đích danh thẻ video cụ thể (`video_index`, `video_title`), không chỉ dừng ở cấp trang chung.
- **Tự động phát ngay lập tức (1-Click Instant Autoplay):**
  - Nút gợi ý bài học đổi thành **"Phát ngay"** kèm icon Play nổi bật.
  - URL điều hướng gắn trực tiếp tham số: `/[topicSlug]/[pageSlug]?v=[index]&autoplay=1`.
  - Khung xem video (`VideosBlock.tsx`) tự động kích hoạt `isPlaying = true`, vượt qua màn hình thumbnail, tự động cuộn đến video và phát ngay lập tức mà người học không phải bấm thêm lần nào.
- **Cơ chế bám đuổi bài học thông minh (Lesson-Anchored Context Tracking):**
  - **Theo dõi ngữ cảnh liên tục:** Khi học viên đang xem bất kỳ bài học nào, `ContentViewer.tsx` tự động lưu ngữ cảnh vào `sessionStorage` (`qbiz_current_lesson`) và phát sự kiện `qbiz_current_lesson_changed` gồm `topic_slug`, `topic_title`, `page_slug`, `page_title`, `page_summary`.
  - **Nút AI nổi bám đuổi (FloatingAiButton):** Tự động đổi nhãn từ "Hỏi AI" thành **"Hỏi bài này"** kèm chấm xanh nhấp nháy; khi nhấn sẽ tự động chuyển tiếp toàn bộ tham số ngữ cảnh (`?topic=...&page=...&topicTitle=...&pageTitle=...`) sang Trợ lý AI; tọa độ nổi tính toán an toàn (`z-50`), không bị che khuất bởi thanh phân trang hay thanh đáy BottomNav.
  - **Thanh bám sát bài học cố định (Context Bar):** Trên trang `/tro-ly-ai`, thanh bám sát ghim ngay dưới Header hiển thị huy hiệu chuyên đề và tiêu đề bài học đang nghiên cứu (`🎯 ĐANG BÁM SÁT BÀI HỌC`), kèm nút quay lại bài học (`‹ Về bài học`) và nút thoát chế độ bám đuổi (`✕`).
  - **Thẻ chào đón & Gợi ý trọng tâm:** AI chủ động mở lời: *"👋 Chào bạn! Bạn đang học bài [Tên bài học] thuộc chuyên đề [Tên chuyên đề]. 👉 Bạn có câu hỏi gì về phần [tên bài học] này không?"*; bộ 4 câu hỏi gợi ý tự động sinh bám sát chính xác bài học và chuyên đề; đồng thời vẫn mở rộng giải đáp mọi câu hỏi sức khỏe rộng mà người học đưa ra.
  - **Tự động gửi câu hỏi từ khối Video:** Thẻ "Hỏi Trợ lý sức khỏe về bài này" dưới danh sách video tự động đính kèm tham số `q=...` và context, kích hoạt gửi ngay lập tức khi mở trang AI.
- **Quy tắc kiểm duyệt thương hiệu tuyệt đối (Strict Zero-Brand Rule):**
  - Toàn bộ tên thương hiệu (DoctorLoan, Hydro Gems, Gems, các thiết bị thương mại) bị loại bỏ 100% khỏi câu trả lời, câu hỏi gợi ý và cơ sở tri thức huấn luyện AI.



---

## 8. CÁC TÍNH NĂNG MỚI NÂNG CẤP & BỘ NHỚ QUY TẮC BẤT KHẢ XÂM PHẠM
### A. Ba tính năng mới hoàn thiện:
1. **Bước 1 - AI YouTube Lesson Drafter (`/api/admin/draft-lesson`):** Tự động bóc tách transcript, tiêu đề, tóm tắt ý nghĩa y học và soạn sẵn bộ 10 khối nội dung chuẩn chỉ từ link YouTube cho bài học.
2. **Bước 2 - Atlas Giải Phẫu 3D Tương Tác Đa Hệ Cơ Quan (`InteractiveAnatomyModal.tsx` & `/giai-phau-3d`):**
   - Tích hợp mô hình 3D tương tác trực quan 7 hệ cơ quan (Cột sống, Tim mạch, Hô hấp, Tiêu hóa, Thần kinh, Cơ bắp, Xương khớp).
   - Nút bật nhanh "🦴 Mô hình 3D" trên Header từng bài học và nút "Atlas 3D" trên trang chuyên đề.
3. **Bước 4 - Cẩm Nang Y Khoa, Mã QR Từng Bài Học & Chốt Khách Zalo (`HandbookModal.tsx`):**
   - Xuất cẩm nang học tập bỏ túi chuẩn mobile, in ấn/lưu PDF.
   - Sinh mã QR động cho từng bài học để quét xem video/bài giảng tức thì trên điện thoại.
   - Tích hợp form nhận cẩm nang bỏ túi gửi thẳng về Zalo admin (`0974248716`).

### B. QUY TẮC BẤT KHẢ XÂM PHẠM (MANDATORY SUPREME RULE):
- **Bắt buộc gửi ảnh trực tiếp vào chat:** Sau BẤT KỂ một thao tác, tính năng, sửa lỗi, căn chỉnh nút bấm hay văn bản nào: Agent BẮT BUỘC phải dùng trình duyệt thật (Playwright mobile viewport 390x844) chụp ảnh màn hình giao diện thực tế và **GỬI TRỰC TIẾP HÌNH ẢNH ĐÓ VÀO ĐOẠN CHAT** để người dùng nghiệm thu bằng mắt thường. Tuyệt đối **CẤM báo cáo chay bằng chữ hay chỉ đưa tên file**.
- **Chuẩn tinh gọn trên điện thoại (Mobile-First):** Hoàn thiện mỗi tính năng là phải chuẩn tinh gọn trên màn hình điện thoại, **CẤM TUYỆT ĐỐI các dòng thừa**, chữ vụn vặt, khoảng hở cồng kềnh làm rối mắt.

### C. NGUYÊN TẮC BỐ CỤC MOBILE-FIRST ƯU TIÊN SỐ 1 (5 TIÊU CHÍ & QUY TẮC 1 DÒNG):
1. **5 Tiêu chí bắt buộc:** 1. Thông minh · 2. Tinh gọn · 3. Tinh tế · 4. Chuyên nghiệp · 5. Hiện đại.
2. **Quy tắc 1 dòng (Trị dứt điểm rớt dòng):** Không bao giờ làm bố cục vụng về, rải rác. Mọi thông số (số bài, số video, thời lượng), nhãn nút, tiêu đề phụ nếu gom được trên 1 dòng phải tối ưu hoàn toàn trên 1 dòng. Triệt tiêu dứt điểm lỗi rớt lại 1 chữ (orphan word) xuống dòng tiếp theo.
3. **Vị trí Cẩm nang & Mã QR:** Cẩm nang tải PDF / in ấn luôn đặt ở CUỐI trang lộ trình (dưới danh sách bài học), không bao giờ đặt ở trên đầu gây rối mắt và đẩy bài học xuống.

---

## 9. HỆ THỐNG 2 BẢNG MÀU GIAO DIỆN (THEME PALETTES) & TÙY CHỌN TRONG CÀI ĐẶT
1. **Tông 1: Chàm Y Khoa (Mặc định - `indigo`):**
   - Giữ nguyên 100% chuẩn mực y khoa thanh lịch, dịu mắt, sắc thái y tế truyền thống.
   - Primary: `#1E3A8A` / `#2563EB`.
2. **Tông 2: Xanh Navy Sang Trọng (`navy_luxury`):**
   - Thiết kế theo chuẩn kỹ thuật & công nghiệp cao cấp từ mẫu thực tế của người dùng:
     - Primary: `#0E2A5C` (Xanh Navy đậm sang trọng).
     - Điểm nhấn Cyan / Blue Electric: `#0284C7` / `#38BDF8`.
     - Thẻ trắng viền mảnh lịch lãm: `#D3DFEE`.
     - Chế độ đêm Night Navy: Nền `#061021`, thẻ `#0B1C38`, viền `#18335D`, chữ `#F8FAFC`.
3. **Bộ chọn bảng màu đa điểm:**
   - Trong **Cài đặt quản trị** (`AdminSettingsModal.tsx`) tab "Giao diện": thẻ chọn trực quan có vòng màu mẫu và mô tả.
   - Trong **Menu Tùy chọn ⋮ bài học** (`PageHeaderBar.tsx`): 2 nút chọn nhanh chuyển đổi 0ms.
   - Lưu trữ bền vững tại `localStorage` (`qbiz_theme_palette`) và đồng bộ Supabase `settings.block_styles.theme_palette`.

---

## 10. CHUẨN HOÁ TINH GỌN DI ĐỘNG (MOBILE-FIRST COMPACT STANDARDS)
1. **Khối Cẩm Nang Y Khoa & Mã QR:**
   - Vị trí: Đặt ở **DƯỚI CÙNG LỘ TRÌNH HỌC TẬP** (sau tất cả bài học), không chen vào đầu trang.
   - Bố cục: Đúng **1 DÒNG DUY NHẤT** (`h-11`, `mb-12`), định dạng:
     `[ 📚 Cẩm nang y khoa ] [ Mã QR (n bài) ] ------------> [ Bản in A4 → ]`
   - Tuyệt đối không dùng 2 dòng văn bản mô tả dài dòng; giữ khoảng cách đáy an toàn với nút nổi "Hỏi AI".
2. **Modal Cài Đặt Quản Trị Trên Di Động (`AdminSettingsModal.tsx`):**
   - Thanh Tab: Chuyển sang thanh cuộn ngang mượt mà (`overflow-x-auto no-scrollbar`), các tab dạng pill bo tròn `h-8 px-3 text-[12px] font-extrabold`. Không chia cột ép co rúm.
   - Bảng màu: Lưới 2 cột cao đúng 44px (`h-11`), hiển thị vòng màu gradient + tên bảng màu + checkmark. Bỏ mô tả dài dòng.
   - Cỡ chữ đọc bài: 3 nút ngang cao 36px (`h-9`).
   - Tự động chuyển video & Hiện tiến độ: Đóng gói thành nhãn 1 dòng kèm checkbox bật/tắt tiện lợi.
   - Tab Chung & Tab Bảo mật: Thu gọn chiều cao ô nhập liệu (`h-10`), label xúc tích, nút hành động cao `h-10` thanh lịch.




---

## 11. TÍNH NĂNG CẦU NỐI ĐỌC SÁCH CHUYÊN SÂU (SMART EBOOK COMPANION BRIDGE)
1. **Mục tiêu & Triết lý kiến trúc:**
   - Không nhúng nguyên ứng dụng đọc sách vào bên trong làm nặng tải hoặc xáo trộn giao diện học cơ thể.
   - Tích hợp một **Cầu Nối Thông Minh (Companion Bridge)** chuẩn 1 dòng (`h-11`) đặt ngay ở cuối mỗi bài học (trước phần chia sẻ & tư vấn).
   - Tự động nhận diện chuyên đề để giới thiệu đúng cuốn sách chuyên sâu tương ứng (ví dụ Cột sống ➔ "Giải phẫu cột sống & Đĩa đệm", Dinh dưỡng ➔ "Dinh dưỡng chuyên sâu & Chuyển hóa", Tiêu hóa ➔ "Giải phẫu ứng dụng hệ tiêu hóa"...).
   - URL mở ngoài linh hoạt kèm tham số điều hướng chính xác: `?topic=${topic.slug}&page=${page.slug}`.
2. **Thiết kế Mobile-First 5 tiêu chí (Thông minh - Tinh gọn - Tinh tế - Chuyên nghiệp - Hiện đại):**
   - Thẻ Emerald Gradient viền mảnh, bo góc tròn 13px, chuẩn 1 dòng:
     `[ 📖 ] Giải phẫu cột sống & Đĩa đệm ────────> [ Đọc Ebook → ]`
   - Tiêu đề ngắn gọn, cỡ chữ `11.5px/12.5px` font-black, không bị rớt dòng và không bị cắt chữ trên màn hình 390px.
3. **Cài Đặt Quản Trị Chuẩn Apple iOS Card (`AdminSettingsModal.tsx`):**
   - Tab Giao diện được gom cụm thành các thẻ nhóm liền mạch (Grouped Card):
     - Bảng màu giao diện: 3 bảng màu trên cùng 1 dòng (Chàm Y Khoa / Xanh Navy / Tối Giản).
     - Cỡ chữ bài học (Nhỏ / Vừa / Lớn).
     - Nhóm tùy chọn hiển thị & trải nghiệm: Tự động chuyển video, Thanh tiến độ học tập, Cầu nối đọc sách (Ebook).
     - Khi bật Ebook, ô URL App hiện ra liền mạch ngay trong khối, không sinh ra các hộp rời rạc thừa thãi.

---

## 12. HỆ THỐNG BẢNG MÀU 3 TÔNG & TỐI ƯU MENU BỐ CỤC XỔ XUỐNG
1. **3 Bảng màu toàn ứng dụng trên cùng 1 dòng:**
   - **Chàm Y Khoa (`indigo`):** Nền trắng sáng ngọc y tế viền xanh chàm kinh điển.
   - **Xanh Navy (`navy_luxury`):** Sắc sẫm hoàng gia sang trọng.
   - **Tối Giản (`minimal`):** Tông màu trung tính (Clean Slate) thanh thoát, không ám xanh.
2. **Tối ưu không gian hiển thị Chuyên Đề Học:**
   - Đã loại bỏ hoàn toàn chế độ "Chỉ chữ" (`text`).
   - Xóa bỏ khối nút bấm dàn ngang 2 dòng cồng kềnh của Admin.
   - Tích hợp nút capsule xổ xuống tinh gọn `[ ⚙️ Lưới bìa ⌵ ]` ngay cạnh tiêu đề, khi bấm xổ ra 4 lựa chọn: Lưới bìa, Danh mục 3 cột, Danh sách ảnh, Khung to.

# LENH_02 – Lưu thật lên Supabase + Admin thật (gộp Lệnh 02, 04, 05 cũ)

## Bối cảnh (đã kiểm code trên GitHub)
Lệnh 01 đã làm xong giao diện và cả phần Admin sửa tại chỗ, NHƯNG:
- Mọi chỉnh sửa chỉ lưu trong `localStorage` của trình duyệt (`src/lib/storage.ts`) → người khác KHÔNG thấy, xoá dữ liệu trình duyệt là MẤT. Đây là lỗi **Critical**.
- Mật khẩu Admin nằm phía trình duyệt (`NEXT_PUBLIC_ADMIN_PASSWORD`, mặc định `admin123`) → ai xem mã nguồn trang cũng thấy.
- Chưa thêm/sửa được Chủ đề và Trang nội dung; ảnh chỉ nhập bằng link, chưa tải lên được.

## Việc của lệnh này
Chuyển toàn bộ dữ liệu sang Supabase để **sửa 1 lần, ai mở app cũng thấy ngay**. Giữ nguyên giao diện và cách thao tác Admin hiện có; chỉ đổi chỗ lưu và bổ sung phần còn thiếu.

## Đọc trước
`docs/00_LUAT.md` (toàn bộ) · `docs/02_DU_LIEU.md` mục 1, 2, 4 · `docs/01_SPEC.md` mục 6. Chỉ đọc code trong `src/lib/`, `src/components/admin/`, `src/components/ContentViewer.tsx`, `src/app/` khi cần sửa.

## Thư viện được cài thêm
CHỈ `@supabase/supabase-js`. Nén ảnh dùng Canvas có sẵn của trình duyệt, không cài thư viện ảnh.

## Làm theo thứ tự
**1. Database** – tạo 1 file `supabase/setup.sql` (chủ dự án sẽ dán vào Supabase › SQL Editor và bấm Run, chạy 1 lần):
- tạo 4 bảng đúng `02_DU_LIEU` mục 1;
- bật RLS cho 4 bảng, mỗi bảng 1 policy **chỉ cho phép đọc (select)** với mọi người; KHÔNG có policy ghi (ghi chỉ đi qua server bằng service key);
- tạo bucket Storage công khai tên `media`: `insert into storage.buckets (id, name, public) values ('media','media',true) on conflict do nothing;`
- nạp toàn bộ dữ liệu mẫu hiện có trong `src/data/sample.ts` (settings, 8 chủ đề, 6 trang, các khối). Dùng id cố định dạng uuid để link "Bài liên quan" không vỡ.

**2. Đọc dữ liệu** – `src/lib/data.ts` đọc từ Supabase bằng `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Giữ nguyên tên và kiểu trả về của các hàm → component không phải sửa. Các trang để `export const dynamic = 'force-dynamic'` để sửa xong thấy ngay. `getContinue()` giữ nguyên (Lệnh 03 làm).

**3. Admin thật (bảo mật tối thiểu)**
- Xoá `NEXT_PUBLIC_ADMIN_PASSWORD` và mặc định `admin123`. Mật khẩu chỉ nằm ở biến server `ADMIN_PASSWORD`.
- `/dang-nhap` gửi mật khẩu lên API server → đúng thì đặt cookie `httpOnly`, `secure`, `sameSite=lax`, hạn 30 ngày, giá trị = HMAC-SHA256 của chuỗi `admin` với khoá `ADMIN_SECRET`. Server kiểm bằng cách tính lại và so sánh. Không lưu mật khẩu thô ở cookie hay localStorage.
- Mọi thao tác ghi đi qua Route Handler `src/app/api/admin/...` (hoặc Server Action): kiểm cookie trước, sai → trả 401. Ghi bằng `SUPABASE_SERVICE_ROLE_KEY` (chỉ dùng trong file server, không import vào component `'use client'`).
- Phía trình duyệt chỉ dùng cookie để BIẾT có hiện nút sửa hay không (có thể gọi `/api/admin/me`).

**4. Thay `src/lib/storage.ts`**: mọi chỗ đang lưu/đọc `localStorage` cho khối và trạng thái trang → gọi API ghi vào Supabase. Sau khi ghi thành công: cập nhật giao diện ngay. Ghi lỗi → hiện dòng báo đỏ "Chưa lưu được, thử lại" (không im lặng). Xoá nút "Khôi phục dữ liệu mẫu".

**5. Bổ sung Admin còn thiếu** (dùng đúng kiểu giao diện hiện có: thanh đen, nút Sửa · ▲ · ▼ · ⋮):
- Trang chủ: `+ Thêm chủ đề`; mỗi thẻ chủ đề: Sửa (tên, mô tả, ghi chú, màu, icon chọn trong 8 icon, ảnh bìa), ▲▼, Ẩn/Hiện, Xoá (hỏi xác nhận 1 lần).
- Màn Chủ đề: `+ Thêm trang`; mỗi thẻ trang: Sửa (tên, mô tả ngắn, ảnh bìa), ▲▼, Ẩn/Hiện, Bản nháp/Đang hiện, Xoá (hỏi xác nhận).
- `slug` tự tạo từ tên khi TẠO MỚI (bỏ dấu tiếng Việt, "đ"→"d", khoảng trắng→"-", trùng thì thêm -2). Đổi tên sau này KHÔNG tự đổi slug (để link đã chia sẻ không chết); ô slug sửa được bằng tay trong form Sửa.
- Trang "Bản nháp" và mục "Ẩn": người xem không thấy; Admin vẫn thấy, có nhãn "Bản nháp" / "Đang ẩn".

**6. Tải ảnh và PDF lên**
- Ở mọi chỗ nhập ảnh (khối Ảnh, Bộ sưu tập, ảnh bìa chủ đề/trang): nút **"Chọn ảnh từ máy"** (vẫn giữ ô dán link).
- Nén trên trình duyệt trước khi tải: ảnh lớn thu về rộng tối đa 1600px, xuất WebP chất lượng ~0.8; nếu vẫn > 300KB thì giảm chất lượng dần (tối thiểu 0.5). Tạo thêm ảnh nhỏ rộng 400px → lưu vào `thumb_url`.
- PDF: nút "Chọn file PDF", giới hạn 20MB (quá thì báo "File quá lớn, tối đa 20MB").
- Tải lên bằng **signed upload URL** của Supabase (server tạo URL, trình duyệt tải thẳng lên Storage) để không vướng giới hạn dung lượng request của Vercel. Đường dẫn: `media/images/<năm-tháng>/<uuid>.webp`, `media/files/<uuid>.pdf`.
- Hiện thanh tiến trình hoặc chữ "Đang tải lên…" trong lúc tải.

**7. Biến môi trường**: tạo `.env.example` liệt kê 5 biến (không có giá trị thật):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SECRET`. Không commit `.env.local`.

**8.** Cập nhật `docs/SKILL.md` ngắn gọn: dữ liệu ở Supabase, ghi qua `/api/admin`, không còn localStorage cho nội dung.

## Tiêu chí PASS
1. [ ] `npm run build` không lỗi.
2. [ ] Sửa 1 dòng chữ trên điện thoại → mở app ở máy khác / tab ẩn danh thấy ngay nội dung mới.
3. [ ] Xoá dữ liệu trình duyệt rồi mở lại → nội dung vẫn còn.
4. [ ] Trong mã nguồn không còn `admin123` và `NEXT_PUBLIC_ADMIN_PASSWORD`; `SUPABASE_SERVICE_ROLE_KEY` không xuất hiện trong file `'use client'` nào.
5. [ ] Gọi API ghi khi chưa đăng nhập → 401.
6. [ ] Trên điện thoại tạo được: 1 chủ đề mới → 1 trang mới → thêm khối Ảnh (chọn ảnh từ máy), Danh sách video (dán link YouTube), Ý nghĩa → người xem thấy đầy đủ.
7. [ ] Ảnh chụp điện thoại (3–10MB) sau khi tải lên còn < 300KB, có `thumb_url`.
8. [ ] PDF ~10MB tải lên được và bấm "Đọc" mở được.
9. [ ] Trang Bản nháp: người xem không thấy, Admin thấy có nhãn "Bản nháp".
10. [ ] Link cũ `/cot-song/dia-dem` vẫn mở được sau khi đổi tên trang Đĩa đệm.
11. [ ] Giao diện người xem không đổi so với Lệnh 01.

## Anh (chủ dự án) cần làm – Antigravity hướng dẫn từng bước nếu anh hỏi
1. supabase.com → New project (chọn vùng Singapore) → đợi tạo xong.
2. SQL Editor → dán nội dung `supabase/setup.sql` → Run.
3. Project Settings › API → copy `Project URL`, `anon public`, `service_role`.
4. Vercel › Project › Settings › Environment Variables → thêm 5 biến (ADMIN_PASSWORD do anh tự đặt, ADMIN_SECRET là một chuỗi ngẫu nhiên dài) → Redeploy.
5. Gửi 3 thông số Supabase cho Antigravity để nó tạo `.env.local` chạy thử trên máy.

## Báo cáo
Đúng mẫu 6 mục ở `00_LUAT`. Không dán code.

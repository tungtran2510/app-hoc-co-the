# LENH_01 – Dựng 3 màn người xem (dữ liệu mẫu) + deploy Vercel

## Việc DUY NHẤT của lệnh này
Dựng app Next.js mobile-first gồm 3 màn **Trang chủ → Chủ đề "Cột sống" → Trang nội dung "Tổng quan về cột sống"**, đúng thiết kế đã duyệt, dùng dữ liệu mẫu local. Đẩy lên GitHub và chạy được trên Vercel.

CHƯA làm: Supabase, Admin, đăng nhập, tìm kiếm thật, chia sẻ, lưu "Xem tiếp" thật, nén ảnh, PDF, PWA, AI.

## Đọc trước (trong thư mục `docs/` của dự án)
1. `docs/00_LUAT.md` – toàn bộ, bắt buộc tuân theo.
2. `docs/01_SPEC.md` – mục 2, 3, 4, 5.
3. `docs/02_DU_LIEU.md` – mục 2, 3, 4, 5 (bỏ qua SQL mục 1).
4. `docs/03_THIET_KE.md` – toàn bộ.
Không cần đọc file khác.

## Thư viện được cài
`next`, `react`, `react-dom`, `typescript`, `tailwindcss` (+ gói đi kèm theo hướng dẫn chính thức của Next.js), `lucide-react`. Không cài gì thêm.

## Cấu trúc bắt buộc
```
docs/                      ← 6 file hướng dẫn (đã có sẵn, KHÔNG sửa)
src/
  app/
    layout.tsx             ← font Be Vietnam Pro, lang="vi", cột giữa max 480px
    page.tsx               ← Trang chủ
    [topicSlug]/page.tsx   ← Chủ đề
    [topicSlug]/[pageSlug]/page.tsx  ← Trang nội dung
    not-found.tsx          ← "Không tìm thấy nội dung này" + nút "Về trang chủ"
  components/              ← mỗi thành phần 1 file (BottomNav, ContinueCard, TopicCard, PageCard, TopicIcon, blocks/TextBlock, blocks/VideosBlock, blocks/ImagesBlock, blocks/LinksBlock, blocks/FilesBlock, BlockRenderer, PageHeaderBar …)
  data/sample.ts           ← dữ liệu mẫu theo 02_DU_LIEU mục 5
  lib/types.ts             ← đúng kiểu TypeScript ở 02_DU_LIEU mục 4
  lib/data.ts              ← MỌI truy xuất dữ liệu đi qua đây
  lib/blockStyles.ts       ← kiểu hiển thị khối chữ (02_DU_LIEU mục 3)
```
`lib/data.ts` phải có các hàm async (để Lệnh 02 chỉ thay bên trong bằng Supabase, không sửa component):
`getSettings()`, `getTopics()`, `getTopicBySlug(slug)`, `getPagesByTopic(topicId)`, `getPageBySlug(topicSlug, pageSlug)`, `getBlocksByPage(pageId)`, `getPageById(id)`.
Chỉ trả về mục `is_visible = true` (và trang `status = 'published'`). Component KHÔNG được import `data/sample.ts` trực tiếp.

## Yêu cầu chi tiết theo màn
Làm đúng `01_SPEC` mục 3–5 và `03_THIET_KE` mục 4. Riêng lệnh này:
- **Thẻ Xem tiếp** (Trang chủ) và nút "Xem tiếp" (Chủ đề): dữ liệu cứng = trang `tong-quan-ve-cot-song`, video thứ 3. Nhớ tách thành 1 hàm `getContinue()` trong `lib/data.ts` để Lệnh 03 thay bằng bộ nhớ máy.
- Thẻ Chủ đề: chủ đề không có trang nào → dòng phụ "Sắp có"; vẫn bấm được, màn Chủ đề hiện "Nội dung đang được cập nhật."
- Số thứ tự 01, 02… tính theo vị trí, không lưu cứng.
- Ô tìm kiếm ở Trang chủ và mục "Tìm kiếm" ở thanh dưới: chỉ hiển thị, bấm chưa cần làm gì.
- **Khối Danh sách video**: bấm dòng → đổi video đang phát ngay trên trang (state phía client), KHÔNG đổi URL, KHÔNG mở màn mới. `youtube_id` rỗng → khung "Chưa có video" như 03_THIET_KE 4.9. Mặc định đang phát video thứ 3 ở trang Tổng quan (khớp thẻ Xem tiếp), video thứ 1 ở trang khác.
- **Mục lục** và **⋮ Cỡ chữ Vừa/Lớn**: làm chạy thật. Cỡ chữ lưu `localStorage` key `co_chu`, tải lại trang vẫn giữ (đọc/ghi trong try/catch).
- **Nút Tiếp theo**: sang trang kế tiếp trong cùng chủ đề; trang cuối → "Về danh sách Cột sống".
- Bài liên quan: link tới đúng đường dẫn `/cot-song/<slug>`.

## Deploy
1. Khởi tạo git, commit `LENH_01: dựng 3 màn người xem với dữ liệu mẫu`.
2. Đẩy lên repo GitHub mà chủ dự án cung cấp (nếu chưa có link repo: DỪNG và hỏi đúng 1 câu xin link).
3. Hướng dẫn chủ dự án bấm Import repo trên Vercel (không cần biến môi trường ở lệnh này). Ghi URL Vercel vào báo cáo.

## Tiêu chí PASS (tự kiểm từng mục, đánh dấu trong báo cáo)
1. [ ] `npm run build` chạy không lỗi, không cảnh báo TypeScript.
2. [ ] Có URL Vercel mở được trên điện thoại.
3. [ ] Đi được: `/` → `/cot-song` → `/cot-song/tong-quan-ve-cot-song` → nút Tiếp theo → `/cot-song/dia-dem`.
4. [ ] Trang chủ có đủ 8 chủ đề, lưới 2 cột, 7 chủ đề ghi "Sắp có".
5. [ ] Màn Cột sống có đủ 6 trang 01→06, tất cả bấm được, có dòng gợi ý "Gợi ý: nếu mới bắt đầu, nên xem theo thứ tự 01 → 02 → 03."
6. [ ] Trang Tổng quan hiển thị đủ 8 khối đúng thứ tự và đúng màu/nhãn ở 02_DU_LIEU mục 3.
7. [ ] Bấm video trong danh sách → dòng "Đang phát" đổi đúng, URL không đổi.
8. [ ] Mục lục cuộn đúng tới khối; Cỡ chữ Lớn giữ nguyên sau khi tải lại trang.
9. [ ] Không còn chữ tiếng Anh nào trên giao diện (tự rà: Loading, Back, Next, Search, Error, Menu, Home…).
10. [ ] Chữ nội dung ≥ 19px, mọi vùng bấm ≥ 48px, ở bề ngang 375px không có thanh cuộn ngang; trên máy tính app nằm giữa, rộng tối đa 480px.
11. [ ] Không có: quiz, ổ khoá, tab, màn đăng nhập.
12. [ ] Chỉ dùng thư viện được phép; mọi dữ liệu đi qua `lib/data.ts`.

Tiêu chí nào không tự kiểm được (ví dụ xem trên điện thoại thật) → ghi "CHƯA KIỂM CHỨNG", không ghi đạt.

## Báo cáo
Đúng mẫu 6 mục ở `00_LUAT` mục 8. Không dán code vào báo cáo.

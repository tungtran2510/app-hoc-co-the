# 03_THIET_KE – Thiết kế giao diện (đã duyệt)

Bản vẽ gốc (cho người xem, cần đăng nhập Claude): https://claude.ai/artifact/36GbnnWoE6P9V8RLsEDwL9
AI build KHÔNG cần mở link trên: mọi số đo cần thiết đã ghi ở file này. Làm đúng file này là đạt.

Phong cách: nền kem ấm, sạch, chữ đậm rõ, màu xanh ngọc làm màu chính, thẻ bo góc lớn, hình minh hoạ nét đơn giản. KHÔNG gradient, KHÔNG emoji, KHÔNG bóng đổ nặng, KHÔNG viền trái màu kiểu "callout".

## 1. Màu (khai báo trong `tailwind.config` hoặc CSS variables)
| Tên | Mã | Dùng cho |
|---|---|---|
| bg | #F6F4EF | nền toàn app |
| surface | #FFFFFF | thẻ, ô nhập, thanh dưới |
| surface-2 | #F1EEE6 | nút phụ, ô nền nhạt |
| ink | #1B2330 | chữ chính |
| ink-2 | #2E3847 | chữ đoạn văn |
| muted | #4A5563 | chữ phụ (không nhạt hơn màu này) |
| line | #E4E0D6 | viền thẻ |
| line-strong | #D9D4C7 | viền ô nhập, nút phụ |
| primary | #0E6B5A | nút chính, trạng thái đang xem, link |
| primary-dark | #0A4F43 | chữ trên nền primary-soft |
| primary-soft | #E6F2EF | nền dòng video đang phát, khối Ý nghĩa |
| on-primary-muted | #D6EFE8 | chữ phụ trên nền primary |
| primary-track | #0A4F43 | rãnh thanh tiến độ trên nền primary |
| accent | #B4501F | điểm nhấn cam |
| accent-soft | #F2B38A | thanh tiến độ trên thẻ Xem tiếp |

Màu chủ đề: lấy từ `topics.color_bg` / `topics.color_fg` (02_DU_LIEU). Màu khối chữ: 02_DU_LIEU mục 3.

## 2. Chữ
- Font: **Be Vietnam Pro** (400, 500, 600, 700, 800), `next/font/google`, subsets `['vietnamese','latin']`.
- Cỡ chữ (Cỡ chữ "Vừa" = mặc định; "Lớn" = nhân 1.18 cho chữ nội dung, lưu localStorage key `co_chu`):

| Vai trò | Cỡ / dòng / đậm |
|---|---|
| Tiêu đề trang (h1) | 30px / 1.2 / 800 (Trang chủ: 28px) |
| Tiêu đề khu (h2) | 24px / 1.25 / 800 |
| Tên trong thẻ | 19–20px / 1.3 / 800 |
| Chữ nội dung | 19px / 1.6 / 400 |
| Chữ nút chính | 20px / 800 |
| Chữ phụ | 16px / 1.45 / 400–600, màu muted |
| Nhãn IN HOA | 15–16px / 800, letter-spacing 0.5px |
| Nhỏ nhất cho phép | 14px |

## 3. Kích thước & khoảng cách
- Lề trái/phải của trang: 20px. Khoảng cách giữa các khối: 14–16px. Giữa các khu lớn: 24–30px.
- Bo góc: thẻ lớn/ảnh bìa 24–28px · thẻ thường 20–22px · nút 16–18px · ô nhỏ 12–14px · nhãn tròn 999px.
- Chiều cao: nút chính 60–64px · nút phụ / nút icon 52px (tối thiểu 48px) · ô tìm kiếm 58px · thanh dưới 84px (có khoảng an toàn đáy máy).
- Viền thẻ: 1.5px `line`. Thẻ đang chọn: 2px `primary`.
- Màn máy tính: toàn bộ app nằm trong cột giữa `max-width: 480px`, nền hai bên cũng là `bg`.

## 4. Thành phần – mô tả chính xác

### 4.1 Thanh điều hướng dưới (chỉ ở Trang chủ và Chủ đề; Trang nội dung không có để đỡ rối)
Nền trắng, viền trên 1px `line`, lưới 3 cột: **Trang chủ** (icon House) · **Đang xem** (icon BookOpen) · **Tìm kiếm** (icon Search). Icon 26px trên, chữ 15px dưới. Mục đang ở: màu primary, đậm 700; mục khác: muted.

### 4.2 Nút quay lại
Cao 52px, icon ChevronLeft 24px + chữ tên màn trước (18px/700, màu primary), không nền.

### 4.3 Thẻ Xem tiếp (Trang chủ)
Nền primary, bo 24px, đệm 22px, các dòng cách 14px:
1. Icon Clock 18px + "Xem tiếp · Cột sống" (16px/600, màu on-primary-muted)
2. "01 · Tổng quan về cột sống" (24px/800, trắng)
3. Thanh tiến độ cao 10px, rãnh `primary-track`, phần đã xem `accent-soft`, bo tròn; dưới là "Đang ở video 03 · Cơ – gân – dây chằng" (16px, on-primary-muted)
4. Nút nền trắng cao 58px, chữ "Xem tiếp" 20px/800 màu primary + icon ArrowRight.

### 4.4 Thẻ Chủ đề (lưới 2 cột, cách 14px)
Cao 172px, bo 22px, nền `color_bg`, đệm 16px, bố cục dọc hai đầu: trên là ô trắng 64×64 bo 18px chứa icon chủ đề 40px nét màu `color_fg`; dưới là tên (20px/800) + dòng phụ (15px) "6 nội dung" hoặc "Sắp có". Tên dài được xuống 2 dòng.

### 4.5 Ảnh bìa Chủ đề
Cao 250px, bo 28px, nền `color_bg`, hình minh hoạ ở góc phải (nếu có `cover_url` thì dùng ảnh, `object-fit: cover`). Góc trái dưới: "CHỦ ĐỀ" (15px/700) + tên chủ đề 34px/800.

### 4.6 Nhãn thông tin (chip)
Cao 36px, đệm ngang 14px, bo tròn, nền trắng, viền 1px line-strong, chữ 16px/600.

### 4.7 Thẻ Trang nội dung trong danh sách
Nền trắng, viền 1.5px line, bo 22px, đệm 16px, cao tối thiểu 112px, hàng ngang cách 16px:
- ô số 64×64 bo 18px, nền `color_bg` của chủ đề, số "01" 24px/800 màu `color_fg`
- giữa: tên 19px/800; dòng phụ 16px muted ("4 video · Đang ở video 03" / "5 video · Chưa xem"); nếu đang xem: thanh tiến độ 8px (rãnh line, phần đã xem primary)
- phải: ChevronRight 22px màu muted.

### 4.8 Thanh đầu Trang nội dung
Hàng ngang: trái nút quay lại "‹ Cột sống"; phải hai nút nền trắng viền 1.5px line bo 16px cao 52px: **[☰ Mục lục]** (icon Menu + chữ) và **[⋮]** (chỉ icon, aria-label "Tuỳ chọn").
- Bấm Mục lục: hiện bảng trắng bo 20px ngay dưới thanh đầu, mỗi dòng cao 52px là tên một khối có nhãn (Danh sách video, Ý nghĩa, Điểm cần nhớ, Chú ý, Sai lầm thường gặp, Giải pháp, Bài liên quan) → bấm thì cuộn mượt tới khối đó và đóng bảng.
- Bấm ⋮: bảng trắng, tiêu đề "Cỡ chữ", 2 nút cạnh nhau **Vừa** / **Lớn** (nút đang chọn viền 2px primary).

### 4.9 Khối Danh sách video
- Trình phát: tỉ lệ 16:9, bo 22px, nền `ink`. Có `youtube_id` → iframe `https://www.youtube-nocookie.com/embed/{id}?rel=0&playsinline=1`. Không có → khung tối, nút tròn trắng 76px icon Play màu primary ở giữa, dòng chữ trắng dưới cùng là tên video + "Chưa có video".
- Dưới trình phát: "Đang phát 3/4 · Xem hết tự chuyển video tiếp" (15px/600 muted).
- Tiêu đề "DANH SÁCH VIDEO (4)" (nhãn IN HOA).
- Mỗi dòng là `<button>`: bo 18px, đệm 10px, ảnh bìa 96×64 bo 12px (ảnh YouTube hoặc ô màu có icon Play trắng), bên phải: tên 18px/800, mô tả 15px, trạng thái 14px/700 ("Đang phát · 6 phút" màu primary / "Đã xem · 4 phút" / "5 phút" màu muted). Dòng đang phát: nền primary-soft, viền 2px primary. Dòng khác: nền trắng, viền 2px line.

### 4.10 Khối chữ có nhãn
Thẻ bo 22px, đệm 18px, nền `bg` theo kiểu, cách dòng 10px:
- đầu thẻ: icon lucide 24px + nhãn IN HOA màu `fg`
- nội dung 19px/1.55: format "numbered" → "1. …", "bullet" → "• …", "paragraph" → đoạn thường. `**…**` → chữ đậm.
- Kiểu `van_ban`: không có thẻ, không nhãn, chỉ đoạn văn 19px màu ink-2.

### 4.11 Bài liên quan
Nhãn "BÀI LIÊN QUAN", mỗi link là thẻ trắng viền line bo 18px cao tối thiểu 64px, chữ 18px/700 "Cột sống · 02 Đĩa đệm" + ChevronRight.

### 4.12 Nút Tiếp theo (cuối Trang nội dung)
Dòng phụ "Gợi ý theo lộ trình" + nút chính cao 64px nền primary chữ trắng 20px/800 "Tiếp theo: 02 Đĩa đệm" + ArrowRight.

## 5. Icon chủ đề (SVG nét, viewBox 0 0 56 56, `fill="none"`, `stroke="currentColor"`, `stroke-width="3"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
```
spine:    <rect x="20" y="4" width="16" height="9" rx="3"/><rect x="19" y="17" width="18" height="9" rx="3"/><rect x="18" y="30" width="20" height="9" rx="3"/><rect x="19" y="43" width="18" height="9" rx="3"/>
bowl:     <path d="M8 30h40a20 20 0 0 1-40 0z"/><path d="M28 24c0-9 6-14 14-14 0 8-6 14-14 14z"/><path d="M28 24c-1-5-4-8-9-9"/>
droplet:  <path d="M28 5C28 5 12 23 12 34a16 16 0 0 0 32 0C44 23 28 5 28 5z"/><path d="M20 36a8 8 0 0 0 8 8"/>
stomach:  <path d="M22 5v10c0 5-9 7-9 18 0 10 8 17 18 17 9 0 15-7 15-14 0-8-8-11-13-8-4 2-4 7-1 9"/>
body:     <circle cx="28" cy="10" r="6"/><path d="M28 17v17"/><path d="M14 24l14 4 14-4"/><path d="M20 51l8-17 8 17"/>
molecule: <circle cx="15" cy="16" r="6"/><circle cx="41" cy="20" r="6"/><circle cx="26" cy="41" r="6"/><path d="M21 17l14 2"/><path d="M18 22l5 13"/><path d="M37 25l-7 11"/>
liver:    <path d="M7 22c0-8 10-12 24-12s18 6 16 14c-2 10-14 20-26 20-4 0-4-6-2-10-6 0-12-4-12-12z"/>
shield:   <path d="M28 6l18 6v14c0 12-8 20-18 24-10-4-18-12-18-24V12z"/><path d="M20 28l6 6 10-12"/>
```
Minh hoạ ảnh bìa Cột sống (khi chưa có ảnh thật), viewBox 0 0 170 230: 5 đốt sống (rect trắng viền #2D5B94 dày 3, bo 9–10) xen 4 đĩa đệm (rect #F2B38A viền #B4501F dày 2, bo 4.5–5), đốt to dần từ trên xuống.

## 6. Hành vi chung
- Chạm có phản hồi (hơi mờ 0.92 hoặc nền đậm hơn). Không hiệu ứng nhảy múa.
- Cuộn tới khối: `scroll-behavior: smooth`, chừa khoảng trên 16px.
- Trạng thái đang tải: khung xám nhạt bo góc (skeleton), không dùng chữ "Loading".
- Lỗi không tìm thấy trang: màn "Không tìm thấy nội dung này" + nút "Về trang chủ".

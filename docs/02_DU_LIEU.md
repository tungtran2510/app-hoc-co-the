# 02_DU_LIEU – Cấu trúc dữ liệu (đã chốt)

Nguyên tắc:
- Đúng 3 tầng nội dung: `topics` → `pages` → `blocks`, cộng bảng `settings`.
- Mọi bảng có `workspace_id` (V1 chỉ có 1 workspace, id cố định = `'default'`). Mục đích: sau này bán cho nhiều khách không phải đập database.
- `topics` và `pages` có `slug`, `sort_order`, `is_visible` → link chia sẻ ổn định kiểu `/cot-song/dia-dem`.
- Khối chỉ có **5 loại gốc** (`type`) + **kiểu hiển thị** (`display_style`). Menu 13 lựa chọn của Admin chỉ là cách gọi thân thiện của các cặp (type, display_style). Thêm nhãn mới (ví dụ "Kinh nghiệm") = thêm 1 dòng trong `settings.block_styles`, KHÔNG sửa database.
- Lệnh 01 dùng đúng các kiểu TypeScript dưới đây cho dữ liệu mẫu local, để Lệnh 02 chỉ việc thay nguồn dữ liệu.

## 1. Bảng (SQL cho Supabase – dùng ở Lệnh 02)
```sql
create table settings (
  workspace_id text primary key default 'default',
  app_name     text not null default '[Tên app]',
  logo_url     text,
  primary_color text not null default '#0E6B5A',
  access_mode  text not null default 'OPEN' check (access_mode in ('OPEN','GUIDED','LOCKED')),
  block_styles jsonb not null default '{}'::jsonb,   -- nhãn tuỳ biến, xem mục 3
  updated_at   timestamptz not null default now()
);

create table topics (
  id           uuid primary key default gen_random_uuid(),
  workspace_id text not null default 'default',
  slug         text not null,
  title        text not null,
  description  text,
  meta_note    text,                 -- ví dụ "Mỗi video 4–6 phút"
  cover_url    text,
  icon         text,                 -- khoá icon chủ đề: spine|bowl|droplet|stomach|body|molecule|liver|shield (SVG ở 03_THIET_KE)
  color_bg     text not null default '#E3ECF7',
  color_fg     text not null default '#2D5B94',
  sort_order   int  not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table pages (
  id           uuid primary key default gen_random_uuid(),
  workspace_id text not null default 'default',
  topic_id     uuid not null references topics(id) on delete cascade,
  slug         text not null,
  title        text not null,
  summary      text,                 -- 1 câu, hiện ở danh sách
  cover_url    text,
  sort_order   int  not null default 0,   -- số hiển thị 01, 02 = vị trí theo sort_order
  is_visible   boolean not null default true,
  status       text not null default 'published' check (status in ('draft','published')),
  access_mode  text check (access_mode in ('OPEN','GUIDED','LOCKED')),  -- null = theo settings
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (topic_id, slug)
);

create table blocks (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  text not null default 'default',
  page_id       uuid not null references pages(id) on delete cascade,
  type          text not null check (type in ('text','images','videos','links','files')),
  display_style text not null,
  data          jsonb not null default '{}'::jsonb,
  sort_order    int  not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on pages  (topic_id, sort_order);
create index on blocks (page_id, sort_order);
```
Số thứ tự hiển thị (01, 02…) KHÔNG lưu cứng: tính từ vị trí trong danh sách các trang đang hiện của chủ đề, sắp theo `sort_order`.

## 2. 13 lựa chọn của Admin = (type, display_style)
| Menu Admin | type | display_style | data |
|---|---|---|---|
| Ảnh | images | single | `{ images:[Image] }` (1 ảnh) |
| Bộ sưu tập ảnh | images | gallery | `{ images:[Image, …] }` |
| Video | videos | single | `{ videos:[Video] }` (1 video) |
| Danh sách video | videos | playlist | `{ videos:[Video, …] }` |
| Văn bản | text | van_ban | `{ lines:[string], format }` |
| Ý nghĩa | text | y_nghia | như trên |
| Điểm cần nhớ | text | diem_can_nho | như trên, format mặc định "numbered" |
| Chú ý | text | chu_y | như trên |
| Sai lầm thường gặp | text | sai_lam | như trên |
| Giải pháp | text | giai_phap | như trên, format mặc định "bullet" |
| Bài liên quan | links | related | `{ items:[{ page_id, label? }] }` |
| Link ngoài | links | external | `{ items:[{ url, label }] }` |
| Tài liệu | files | pdf | `{ files:[FileItem] }` |

## 3. Kiểu hiển thị của khối chữ (mặc định, đặt trong code; `settings.block_styles` ghi đè/thêm mới)
```json
{
  "van_ban":      { "label": null,                 "icon": null,            "bg": null,      "fg": "#2E3847" },
  "y_nghia":      { "label": "Ý NGHĨA",            "icon": "Lightbulb",     "bg": "#E6F2EF", "fg": "#0A4F43" },
  "diem_can_nho": { "label": "ĐIỂM CẦN NHỚ",       "icon": "SquareCheck",   "bg": "#E3ECF7", "fg": "#244A78" },
  "chu_y":        { "label": "CHÚ Ý",              "icon": "TriangleAlert", "bg": "#FFF1E6", "fg": "#8A3A14" },
  "sai_lam":      { "label": "SAI LẦM THƯỜNG GẶP", "icon": "CircleX",       "bg": "#FBE7E1", "fg": "#7A2F12" },
  "giai_phap":    { "label": "GIẢI PHÁP · ỨNG DỤNG","icon": "Wrench",       "bg": "#EDF3E4", "fg": "#3C5420" }
}
```
Kiểu lạ không có trong danh sách → hiển thị như khối có nhãn màu xám (`bg #F1EEE6`, `fg #3A4250`), nhãn = chính tên kiểu. Không được lỗi trang.

## 4. Kiểu TypeScript (dùng ngay từ Lệnh 01)
```ts
export type AccessMode = 'OPEN' | 'GUIDED' | 'LOCKED';

export interface Settings {
  workspace_id: string; app_name: string; logo_url: string | null;
  primary_color: string; access_mode: AccessMode;
  block_styles: Record<string, { label: string | null; icon: string | null; bg: string | null; fg: string }>;
}
export interface Topic {
  id: string; workspace_id: string; slug: string; title: string;
  description: string | null; meta_note: string | null; cover_url: string | null;
  icon: string | null; color_bg: string; color_fg: string;
  sort_order: number; is_visible: boolean;
}
export interface Page {
  id: string; workspace_id: string; topic_id: string; slug: string; title: string;
  summary: string | null; cover_url: string | null; sort_order: number;
  is_visible: boolean; status: 'draft' | 'published'; access_mode: AccessMode | null;
}
export interface Image { url: string; thumb_url?: string; caption?: string; alt?: string }
export interface Video {
  youtube_id: string;            // rỗng = chưa có video → hiện khung "Chưa có video"
  title: string; description?: string; duration_text?: string; thumbnail_url?: string;
}
export interface FileItem { url: string; name: string; size_bytes?: number }
export type Block =
  | { id: string; page_id: string; type: 'text';   display_style: string; sort_order: number; is_visible: boolean;
      data: { lines: string[]; format?: 'paragraph' | 'numbered' | 'bullet' } }
  | { id: string; page_id: string; type: 'images'; display_style: 'single' | 'gallery'; sort_order: number; is_visible: boolean;
      data: { images: Image[] } }
  | { id: string; page_id: string; type: 'videos'; display_style: 'single' | 'playlist'; sort_order: number; is_visible: boolean;
      data: { videos: Video[] } }
  | { id: string; page_id: string; type: 'links';  display_style: 'related' | 'external'; sort_order: number; is_visible: boolean;
      data: { items: { page_id?: string; url?: string; label?: string }[] } }
  | { id: string; page_id: string; type: 'files';  display_style: 'pdf'; sort_order: number; is_visible: boolean;
      data: { files: FileItem[] } };
```
Quy ước chữ trong `lines`: cho phép `**chữ đậm**`. Không cho HTML.

Ảnh bìa YouTube khi `thumbnail_url` trống: `https://i.ytimg.com/vi/{youtube_id}/hqdefault.jpg`.

## 5. Dữ liệu mẫu (Lệnh 01 để trong `src/data/sample.ts`; Lệnh 02 nạp vào Supabase)

### settings
`{ workspace_id:'default', app_name:'[Tên app]', logo_url:null, primary_color:'#0E6B5A', access_mode:'OPEN', block_styles:{} }`

### topics (sort_order theo thứ tự dưới)
| slug | title | icon | color_bg | color_fg | ghi chú |
|---|---|---|---|---|---|
| cot-song | Cột sống | spine | #E3ECF7 | #2D5B94 | có 6 trang |
| dinh-duong | Dinh dưỡng | bowl | #F6E7D3 | #8A4F10 | 0 trang → "Sắp có" |
| nuoc | Nước | droplet | #DDF0F6 | #1F6E8C | 0 trang |
| tieu-hoa | Tiêu hóa | stomach | #F4E1DF | #9B3B32 | 0 trang |
| co-the-nguoi | Cơ thể người | body | #E9E4F3 | #5A4A8A | 0 trang |
| noi-tiet-chuyen-hoa | Nội tiết – chuyển hóa | molecule | #F3EFD2 | #6B5C0E | 0 trang |
| gan-mat-tuy | Gan – mật – tụy | liver | #E6EEDD | #4E6B2A | 0 trang |
| mien-dich | Miễn dịch | shield | #E0EDEB | #2F6B63 | 0 trang |

cot-song: description = "Hiểu cột sống từ cấu tạo đến cách chăm sóc hằng ngày. Mọi nội dung đều mở, xem phần nào cũng được." · meta_note = "Mỗi video 4–6 phút".

### pages của cot-song
| sort | slug | title | summary |
|---|---|---|---|
| 1 | tong-quan-ve-cot-song | Tổng quan về cột sống | Cấu trúc chung và vai trò của cột sống. |
| 2 | dia-dem | Đĩa đệm | Đĩa đệm nằm ở đâu và làm việc thế nào. |
| 3 | co-gan-day-chang | Cơ – gân – dây chằng | Hệ thống giữ và giúp cột sống vận động. |
| 4 | than-kinh | Thần kinh | Tủy sống, rễ thần kinh và đường dẫn truyền. |
| 5 | tu-the-va-van-dong | Tư thế và vận động | Ngồi, đứng, mang vác sao cho đúng. |
| 6 | cac-van-de-thuong-gap | Các vấn đề thường gặp | Những vấn đề cột sống hay gặp trong đời sống. |

Trang 2–6: mỗi trang chỉ cần 1 khối `text/van_ban` = summary + 1 khối `videos/playlist` có 1 video mẫu (youtube_id rỗng, title "Video sẽ cập nhật").

### blocks của trang "tong-quan-ve-cot-song" (theo thứ tự)
1. `text / van_ban` – lines: ["Cột sống là trục chính của cơ thể: nâng đỡ thân mình, giúp ta cúi, ngửa, xoay người và bảo vệ tủy sống nằm bên trong."]
2. `videos / playlist` – videos (youtube_id để rỗng, Admin điền sau):
   - "01. Tổng quan cột sống" · "Cấu trúc chung và vai trò của cột sống." · "4 phút"
   - "02. Đĩa đệm" · "Đĩa đệm nằm ở đâu và có vai trò gì." · "5 phút"
   - "03. Cơ – gân – dây chằng" · "Hệ thống giữ và giúp cột sống vận động." · "6 phút"
   - "04. Thần kinh" · "Tủy sống, rễ thần kinh và đường dẫn truyền." · "4 phút"
3. `text / y_nghia` – ["Hiểu các thành phần này giúp nhìn cột sống như một hệ thống làm việc cùng nhau, chứ không chỉ là một chồng xương."]
4. `text / diem_can_nho` (numbered) – ["Đốt sống tạo thành bộ khung.", "Đĩa đệm nằm giữa các thân đốt sống.", "Cơ và dây chằng giữ cho cột sống vững.", "Tủy sống và rễ thần kinh đi qua cột sống."]
5. `text / chu_y` – ["**Cần đi khám ngay** nếu đau lưng kèm tê yếu chân hoặc khó đi tiểu."]
6. `text / sai_lam` – ["**Nghĩ đau lưng nào cũng do thoát vị đĩa đệm.** Thực tế đau lưng có nhiều nguyên nhân, hay gặp nhất là do cơ và tư thế.", "**Nằm im hoàn toàn khi đau lưng.** Vận động nhẹ nhàng thường giúp hồi phục tốt hơn."]
7. `text / giai_phap` (bullet) – ["Ngồi lâu thì đứng dậy, đổi tư thế thường xuyên.", "Giữ vận động đều đặn mỗi ngày."]
8. `links / related` – items: trang dia-dem, than-kinh, tu-the-va-van-dong.

Lưu ý: nội dung y khoa mẫu chỉ để dựng giao diện; nội dung thật do Admin nhập và chịu trách nhiệm.

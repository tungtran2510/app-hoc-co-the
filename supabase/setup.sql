-- ==============================================================================
-- SETUP DATABASE CHO APP-HOC-CO-THE TRÊN SUPABASE
-- Dán toàn bộ nội dung file này vào Supabase -> SQL Editor và bấm Run (chạy 1 lần)
-- ==============================================================================

-- 1. BẢNG CẤU HÌNH (settings)
create table if not exists settings (
  workspace_id text primary key default 'default',
  app_name     text not null default 'Sống Khỏe Mỗi Ngày',
  logo_url     text,
  primary_color text not null default '#0E6B5A',
  access_mode  text not null default 'OPEN' check (access_mode in ('OPEN','GUIDED','LOCKED')),
  block_styles jsonb not null default '{}'::jsonb,
  expert_title text,
  hotline      text,
  zalo_url     text,
  updated_at   timestamptz not null default now()
);

-- 2. BẢNG CHỦ ĐỀ (topics)
create table if not exists topics (
  id           uuid primary key default gen_random_uuid(),
  workspace_id text not null default 'default',
  slug         text not null,
  title        text not null,
  description  text,
  meta_note    text,
  cover_url    text,
  icon         text,
  color_bg     text not null default '#E3ECF7',
  color_fg     text not null default '#2D5B94',
  sort_order   int  not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, slug)
);

-- 3. BẢNG TRANG NỘI DUNG (pages)
create table if not exists pages (
  id           uuid primary key default gen_random_uuid(),
  workspace_id text not null default 'default',
  topic_id     uuid not null references topics(id) on delete cascade,
  slug         text not null,
  title        text not null,
  summary      text,
  cover_url    text,
  sort_order   int  not null default 0,
  is_visible   boolean not null default true,
  status       text not null default 'published' check (status in ('draft','published')),
  access_mode  text check (access_mode in ('OPEN','GUIDED','LOCKED')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (topic_id, slug)
);

-- 4. BẢNG KHỐI NỘI DUNG (blocks)
create table if not exists blocks (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  text not null default 'default',
  page_id       uuid not null references pages(id) on delete cascade,
  type          text not null check (type in ('text','images','videos','links','files','comparison')),
  display_style text not null,
  data          jsonb not null default '{}'::jsonb,
  sort_order    int  not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_pages_topic_sort on pages (topic_id, sort_order);
create index if not exists idx_blocks_page_sort on blocks (page_id, sort_order);

-- 5. BẬT BẢO VỆ DỮ LIỆU (Row Level Security - RLS)
-- Chỉ cho phép đọc công khai (select) với tất cả mọi người.
-- Mọi thao tác ghi (insert, update, delete) chỉ đi qua server bằng SUPABASE_SERVICE_ROLE_KEY.
alter table settings enable row level security;
alter table topics enable row level security;
alter table pages enable row level security;
alter table blocks enable row level security;

drop policy if exists "Cho phép mọi người đọc settings" on settings;
create policy "Cho phép mọi người đọc settings" on settings for select using (true);

drop policy if exists "Cho phép mọi người đọc topics" on topics;
create policy "Cho phép mọi người đọc topics" on topics for select using (true);

drop policy if exists "Cho phép mọi người đọc pages" on pages;
create policy "Cho phép mọi người đọc pages" on pages for select using (true);

drop policy if exists "Cho phép mọi người đọc blocks" on blocks;
create policy "Cho phép mọi người đọc blocks" on blocks for select using (true);

-- 6. TẠO BUCKET LƯU TRỮ TỆP CÔNG KHAI (Storage bucket: media)
insert into storage.buckets (id, name, public) 
values ('media', 'media', true) 
on conflict (id) do nothing;

drop policy if exists "Cho phép mọi người xem media" on storage.objects;
create policy "Cho phép mọi người xem media" on storage.objects for select using (bucket_id = 'media');

-- 7. NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA VỚI UUID CỐ ĐỊNH)

-- Settings
insert into settings (workspace_id, app_name, logo_url, primary_color, access_mode, block_styles, expert_title, hotline, zalo_url)
values ('default', 'Sống Khỏe Mỗi Ngày', null, '#0E6B5A', 'OPEN', '{}'::jsonb, 'Chuyên gia Trị liệu & Chăm sóc Cột sống', '0988.123.456', 'https://zalo.me')
on conflict (workspace_id) do update set
  app_name = excluded.app_name,
  primary_color = excluded.primary_color;

-- 8 Chủ đề mẫu
insert into topics (id, workspace_id, slug, title, description, meta_note, cover_url, icon, color_bg, color_fg, sort_order, is_visible)
values
  ('a0000000-0000-0000-0000-000000000001', 'default', 'cot-song', 'Cột sống', 'Hiểu cột sống từ cấu tạo đến cách chăm sóc hằng ngày. Mọi nội dung đều mở, xem phần nào cũng được.', 'Mỗi video 4–6 phút', null, 'spine', '#E3ECF7', '#2D5B94', 1, true),
  ('a0000000-0000-0000-0000-000000000002', 'default', 'dinh-duong', 'Dinh dưỡng', null, null, null, 'bowl', '#F6E7D3', '#8A4F10', 2, true),
  ('a0000000-0000-0000-0000-000000000003', 'default', 'nuoc', 'Nước', null, null, null, 'droplet', '#DDF0F6', '#1F6E8C', 3, true),
  ('a0000000-0000-0000-0000-000000000004', 'default', 'tieu-hoa', 'Tiêu hóa', null, null, null, 'stomach', '#F4E1DF', '#9B3B32', 4, true),
  ('a0000000-0000-0000-0000-000000000005', 'default', 'co-the-nguoi', 'Cơ thể người', null, null, null, 'body', '#E9E4F3', '#5A4A8A', 5, true),
  ('a0000000-0000-0000-0000-000000000006', 'default', 'noi-tiet-chuyen-hoa', 'Nội tiết – chuyển hóa', null, null, null, 'molecule', '#F3EFD2', '#6B5C0E', 6, true),
  ('a0000000-0000-0000-0000-000000000007', 'default', 'gan-mat-tuy', 'Gan – mật – tụy', null, null, null, 'liver', '#E6EEDD', '#4E6B2A', 7, true),
  ('a0000000-0000-0000-0000-000000000008', 'default', 'mien-dich', 'Miễn dịch', null, null, null, 'shield', '#E0EDEB', '#2F6B63', 8, true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  meta_note = excluded.meta_note,
  color_bg = excluded.color_bg,
  color_fg = excluded.color_fg,
  sort_order = excluded.sort_order;

-- 6 Trang nội dung mẫu trong Cột sống
insert into pages (id, workspace_id, topic_id, slug, title, summary, cover_url, sort_order, is_visible, status, access_mode)
values
  ('b0000000-0000-0000-0000-000000000001', 'default', 'a0000000-0000-0000-0000-000000000001', 'tong-quan-ve-cot-song', 'Tổng quan về cột sống', 'Cấu trúc chung và vai trò của cột sống.', null, 1, true, 'published', null),
  ('b0000000-0000-0000-0000-000000000002', 'default', 'a0000000-0000-0000-0000-000000000001', 'dia-dem', 'Đĩa đệm', 'Đĩa đệm nằm ở đâu và làm việc thế nào.', null, 2, true, 'published', null),
  ('b0000000-0000-0000-0000-000000000003', 'default', 'a0000000-0000-0000-0000-000000000001', 'co-gan-day-chang', 'Cơ – gân – dây chằng', 'Hệ thống giữ và giúp cột sống vận động.', null, 3, true, 'published', null),
  ('b0000000-0000-0000-0000-000000000004', 'default', 'a0000000-0000-0000-0000-000000000001', 'than-kinh', 'Thần kinh', 'Tủy sống, rễ thần kinh và đường dẫn truyền.', null, 4, true, 'published', null),
  ('b0000000-0000-0000-0000-000000000005', 'default', 'a0000000-0000-0000-0000-000000000001', 'tu-the-va-van-dong', 'Tư thế và vận động', 'Ngồi, đứng, mang vác sao cho đúng.', null, 5, true, 'published', null),
  ('b0000000-0000-0000-0000-000000000006', 'default', 'a0000000-0000-0000-0000-000000000001', 'cac-van-de-thuong-gap', 'Các vấn đề thường gặp', 'Những vấn đề cột sống hay gặp trong đời sống.', null, 6, true, 'published', null)
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  sort_order = excluded.sort_order;

-- Khối nội dung mẫu cho trang 01 (Tổng quan về cột sống)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000001', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'van_ban', 1, true, '{
    "lines": ["Cột sống là trục chính của cơ thể: nâng đỡ thân mình, giúp ta cúi, ngửa, xoay người và bảo vệ tủy sống nằm bên trong."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000002', 'default', 'b0000000-0000-0000-0000-000000000001', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "c9kmCxFKHPY",
        "title": "01. Cấu tạo & chức năng cột sống",
        "description": "Cấu trúc chung và vai trò của cột sống.",
        "duration_text": "4 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg"
      },
      {
        "youtube_id": "mVtS7TYDpbU",
        "title": "02. Cấu tạo cơ bản đốt sống",
        "description": "Thân đốt sống, đĩa đệm và các mỏm khớp.",
        "duration_text": "5 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/mVtS7TYDpbU/hqdefault.jpg"
      },
      {
        "youtube_id": "yTfFaHohKbY",
        "title": "03. Cơ – gân – dây chằng",
        "description": "Hệ thống giữ và giúp cột sống vận động.",
        "duration_text": "6 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/yTfFaHohKbY/hqdefault.jpg"
      },
      {
        "youtube_id": "_uxMIfQfYGk",
        "title": "04. Thần kinh & tủy sống",
        "description": "Tủy sống, rễ thần kinh và đường dẫn truyền.",
        "duration_text": "4 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/_uxMIfQfYGk/hqdefault.jpg"
      }
    ]
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000003', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'y_nghia', 3, true, '{
    "lines": ["Hiểu các thành phần này giúp nhìn cột sống như một hệ thống làm việc cùng nhau, chứ không chỉ là một chồng xương."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000004', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'diem_can_nho', 4, true, '{
    "lines": [
      "Đốt sống tạo thành bộ khung.",
      "Đĩa đệm nằm giữa các thân đốt sống.",
      "Cơ và dây chằng giữ cho cột sống vững.",
      "Tủy sống và rễ thần kinh đi qua cột sống."
    ],
    "format": "numbered"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000005', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'chu_y', 5, true, '{
    "lines": ["**Cần đi khám ngay** nếu đau lưng kèm tê yếu chân hoặc khó đi tiểu."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000006', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'sai_lam', 6, true, '{
    "lines": [
      "**Nghĩ đau lưng nào cũng do thoát vị đĩa đệm.** Thực tế đau lưng có nhiều nguyên nhân, hay gặp nhất là do cơ và tư thế.",
      "**Nằm im hoàn toàn khi đau lưng.** Vận động nhẹ nhàng thường giúp hồi phục tốt hơn."
    ],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000007', 'default', 'b0000000-0000-0000-0000-000000000001', 'text', 'giai_phap', 7, true, '{
    "lines": [
      "Ngồi lâu thì đứng dậy, đổi tư thế thường xuyên.",
      "Giữ vận động đều đặn mỗi ngày."
    ],
    "format": "bullet"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000008', 'default', 'b0000000-0000-0000-0000-000000000001', 'links', 'related', 8, true, '{
    "items": [
      {"page_id": "b0000000-0000-0000-0000-000000000002", "label": "Cột sống · 02 Đĩa đệm"},
      {"page_id": "b0000000-0000-0000-0000-000000000004", "label": "Cột sống · 04 Thần kinh"},
      {"page_id": "b0000000-0000-0000-0000-000000000005", "label": "Cột sống · 05 Tư thế và vận động"}
    ]
  }'::jsonb)
on conflict (id) do update set
  data = excluded.data,
  sort_order = excluded.sort_order;

-- Khối nội dung mẫu cho trang 02 (Đĩa đệm)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000009', 'default', 'b0000000-0000-0000-0000-000000000002', 'text', 'van_ban', 1, true, '{
    "lines": ["Đĩa đệm nằm ở đâu và làm việc thế nào."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000010', 'default', 'b0000000-0000-0000-0000-000000000002', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "z0FRTp5CVds",
        "title": "02. Giải phẫu và chức năng đĩa đệm",
        "description": "Đĩa đệm nằm ở đâu và làm việc thế nào.",
        "duration_text": "5 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/z0FRTp5CVds/hqdefault.jpg"
      }
    ]
  }'::jsonb)
on conflict (id) do update set data = excluded.data;

-- Khối nội dung mẫu cho trang 03 (Cơ – gân – dây chằng)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000011', 'default', 'b0000000-0000-0000-0000-000000000003', 'text', 'van_ban', 1, true, '{
    "lines": ["Hệ thống giữ và giúp cột sống vận động."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000012', 'default', 'b0000000-0000-0000-0000-000000000003', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "c9kmCxFKHPY",
        "title": "03. Hệ thống cơ và dây chằng cột sống",
        "description": "Hệ thống giữ và giúp cột sống vận động.",
        "duration_text": "6 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg"
      }
    ]
  }'::jsonb)
on conflict (id) do update set data = excluded.data;

-- Khối nội dung mẫu cho trang 04 (Thần kinh)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000013', 'default', 'b0000000-0000-0000-0000-000000000004', 'text', 'van_ban', 1, true, '{
    "lines": ["Tủy sống, rễ thần kinh và đường dẫn truyền."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000014', 'default', 'b0000000-0000-0000-0000-000000000004', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "IUtyDm9O8lU",
        "title": "04. Tủy sống và các rễ thần kinh",
        "description": "Tủy sống, rễ thần kinh và đường dẫn truyền.",
        "duration_text": "5 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/IUtyDm9O8lU/hqdefault.jpg"
      }
    ]
  }'::jsonb)
on conflict (id) do update set data = excluded.data;

-- Khối nội dung mẫu cho trang 05 (Tư thế và vận động)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000015', 'default', 'b0000000-0000-0000-0000-000000000005', 'text', 'van_ban', 1, true, '{
    "lines": ["Ngồi, đứng, mang vác sao cho đúng."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000016', 'default', 'b0000000-0000-0000-0000-000000000005', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "zQVOV1eevck",
        "title": "05. Tư thế sinh hoạt và vận động đúng",
        "description": "Ngồi, đứng, mang vác sao cho đúng.",
        "duration_text": "4 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/zQVOV1eevck/hqdefault.jpg"
      }
    ]
  }'::jsonb)
on conflict (id) do update set data = excluded.data;

-- Khối nội dung mẫu cho trang 06 (Các vấn đề thường gặp)
insert into blocks (id, workspace_id, page_id, type, display_style, sort_order, is_visible, data)
values
  ('c0000000-0000-0000-0000-000000000017', 'default', 'b0000000-0000-0000-0000-000000000006', 'text', 'van_ban', 1, true, '{
    "lines": ["Những vấn đề cột sống hay gặp trong đời sống."],
    "format": "paragraph"
  }'::jsonb),
  ('c0000000-0000-0000-0000-000000000018', 'default', 'b0000000-0000-0000-0000-000000000006', 'videos', 'playlist', 2, true, '{
    "videos": [
      {
        "youtube_id": "gUG_zbKqlaU",
        "title": "06. Các vấn đề cột sống thường gặp",
        "description": "Những vấn đề cột sống hay gặp trong đời sống.",
        "duration_text": "6 phút",
        "thumbnail_url": "https://i.ytimg.com/vi/gUG_zbKqlaU/hqdefault.jpg"
      }
    ]
  }'::jsonb)
on conflict (id) do update set data = excluded.data;

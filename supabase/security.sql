-- Chạy trong Supabase > SQL Editor (dự án evuhamqlzprrbuabxyyn).
-- Mục đích: ngăn người lạ (khóa anon) đọc dữ liệu đồng bộ học viên và ghi đè dữ liệu.
-- Server dùng SERVICE_ROLE_KEY nên không bị ảnh hưởng bởi RLS.
-- LƯU Ý: chạy phần 1 xong hãy kiểm tra app còn hiển thị bình thường trước khi chạy phần 2.

-- ===== PHẦN 1: Bảo vệ bảng settings =====
alter table public.settings enable row level security;

drop policy if exists "anon_read_public_settings" on public.settings;
create policy "anon_read_public_settings" on public.settings
  for select to anon, authenticated
  using (key not like 'user_sync:%');

-- Không tạo policy insert/update/delete cho anon => anon không được ghi.

-- ===== PHẦN 2: Xóa dữ liệu đồng bộ cũ lưu theo số điện thoại (đã bị lộ) =====
-- Dữ liệu cũ sẽ tự chuyển sang khóa băm khi học viên đồng bộ lại; nếu không cần thì xóa:
-- (Chỉ bỏ comment dòng dưới nếu chấp nhận mất tiến độ cũ của 2 học viên thử nghiệm)
-- delete from public.settings where key ~ '^user_sync:[0-9+]+$';

-- ===== PHẦN 3: Xóa lan truyền (cascade) =====
-- Chạy sau khi kiểm tra tên ràng buộc hiện có. Ví dụ:
-- alter table public.blocks drop constraint if exists blocks_page_id_fkey;
-- alter table public.blocks add constraint blocks_page_id_fkey
--   foreign key (page_id) references public.pages(id) on delete cascade;
-- alter table public.pages drop constraint if exists pages_topic_id_fkey;
-- alter table public.pages add constraint pages_topic_id_fkey
--   foreign key (topic_id) references public.topics(id) on delete cascade;

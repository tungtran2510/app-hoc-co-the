-- ==============================================================================
-- MIGRATE_05: CẬP NHẬT DATABASE CHO APP-HOC-CO-THE (LỆNH 05)
-- Chạy trên Supabase -> SQL Editor (idempotent: an toàn khi chạy nhiều lần)
-- ==============================================================================

-- 1. Thêm các cột chuyên gia, hotline, zalo vào bảng settings nếu chưa có
alter table if exists settings add column if not exists expert_title text;
alter table if exists settings add column if not exists hotline text;
alter table if exists settings add column if not exists zalo_url text;

-- 2. Cập nhật ràng buộc type của bảng blocks để hỗ trợ loại khối mới 'comparison'
alter table if exists blocks drop constraint if exists blocks_type_check;
alter table if exists blocks add constraint blocks_type_check 
  check (type in ('text', 'images', 'videos', 'links', 'files', 'comparison'));

-- 3. Đảm bảo bucket media tồn tại và công khai để lưu trữ ảnh và file PDF
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 4. Đảm bảo policy cho phép đọc media công khai
drop policy if exists "Cho phép mọi người xem media" on storage.objects;
create policy "Cho phép mọi người xem media" on storage.objects for select using (bucket_id = 'media');

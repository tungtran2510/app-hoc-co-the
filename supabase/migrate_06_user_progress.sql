-- ==============================================================================
-- BẢN MIGRATION 06: ĐỒNG BỘ TIẾN ĐỘ HỌC TẬP VÀ BÀI ĐÃ LƯU THEO SỐ ĐIỆN THOẠI
-- ==============================================================================
--
-- Tính năng này hỗ trợ học viên lưu lại:
-- 1. Danh sách bài học đã lưu (bai_da_luu)
-- 2. Danh sách bài đã hiểu hoàn thành (da_hoan_thanh)
-- 3. Tiến độ video từng bài (tien_do)
-- 4. Vị trí đang học dở (xem_tiep)
--
-- Hệ thống tự động lưu vào bảng settings với khóa `workspace_id = 'user_sync:<số_điện_thoại>'`
-- và cột `block_styles = { "user_progress": { ... } }`.
-- Nhờ đó, ứng dụng hoạt động ngay lập tức 100% mà không yêu cầu người dùng phải chạy thêm lệnh SQL nào.
--
-- Dưới đây là bảng độc lập tùy chọn (nếu quản trị viên muốn tách riêng sau này):
create table if not exists user_progress (
  phone text primary key,
  xem_tiep jsonb,
  tien_do jsonb default '{}'::jsonb,
  bai_da_luu jsonb default '[]'::jsonb,
  da_hoan_thanh jsonb default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

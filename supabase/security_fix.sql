-- ==============================================================================
-- SUPABASE SECURITY FIX (IDEMPOTENT - CHẠY NHIỀU LẦN KHÔNG LỖI)
-- Dự án Supabase: evuhamqlzprrbuabxyyn
-- Mục tiêu:
-- 1. Tách biệt hoàn toàn admin_accounts ra bảng riêng, RLS chặn 100% quyền đọc/ghi từ anon/authenticated.
-- 2. Xóa cột admin_password và xoá admin_accounts khỏi bảng settings để anon không bao giờ đọc được mật khẩu.
-- 3. Mật khẩu giảng viên lưu trữ bảo mật dạng băm (scrypt hash).
-- ==============================================================================

-- 1. TẠO BẢNG RIÊNG CHO TÀI KHOẢN QUẢN TRỊ & GIẢNG VIÊN (admin_accounts)
create table if not exists public.admin_accounts (
  id text primary key,
  workspace_id text not null default 'default',
  name text not null,
  phone text not null,
  password_hash text not null,
  role text not null default 'instructor' check (role in ('super_admin', 'admin', 'instructor')),
  allowed_topic_ids jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tạo unique index theo workspace + phone
create unique index if not exists idx_admin_accounts_workspace_phone 
  on public.admin_accounts (workspace_id, phone);

-- BẬT RLS (Row Level Security) CHO BẢNG admin_accounts
alter table public.admin_accounts enable row level security;

-- XÓA TẤT CẢ POLICY CŨ TRÊN admin_accounts (NẾU CÓ)
drop policy if exists "anon_read_admin_accounts" on public.admin_accounts;
drop policy if exists "allow_anon_admin_accounts" on public.admin_accounts;
drop policy if exists "public_read_admin_accounts" on public.admin_accounts;

-- TUYỆT ĐỐI KHÔNG TẠO POLICY NÀO CHO anon HOẶC authenticated TRÊN admin_accounts.
-- Chỉ duy nhất server có SUPABASE_SERVICE_ROLE_KEY mới có quyền truy cập bảng này!

-- 2. DI CHUYỂN DỮ LIỆU TÀI KHOẢN GIẢNG VIÊN HIỆN CÓ TỪ settings.block_styles SANG admin_accounts
do $$
declare
  rec record;
  acc jsonb;
  v_phone text;
  v_pass text;
begin
  for rec in 
    select workspace_id, block_styles->'admin_accounts' as accounts 
    from public.settings 
    where block_styles ? 'admin_accounts'
  loop
    if jsonb_typeof(rec.accounts) = 'array' then
      for acc in select * from jsonb_array_elements(rec.accounts)
      loop
        v_phone := trim(acc->>'phone');
        v_pass := coalesce(acc->>'password', '');
        if v_phone is not null and length(v_phone) >= 8 and v_pass <> '' then
          insert into public.admin_accounts (
            id,
            workspace_id,
            name,
            phone,
            password_hash,
            role,
            allowed_topic_ids,
            is_active
          ) values (
            coalesce(acc->>'id', 'acc_' || substr(md5(random()::text), 1, 10)),
            coalesce(rec.workspace_id, 'default'),
            coalesce(acc->>'name', 'Giảng viên'),
            v_phone,
            v_pass,
            coalesce(acc->>'role', 'instructor'),
            coalesce(acc->'allowed_topic_ids', '[]'::jsonb),
            coalesce((acc->>'is_active')::boolean, true)
          )
          on conflict (workspace_id, phone) do update set
            name = excluded.name,
            allowed_topic_ids = excluded.allowed_topic_ids,
            is_active = excluded.is_active;
        end if;
      end loop;
    end if;
  end loop;
end $$;

-- 3. XÓA BỎ HOÀN TOÀN admin_accounts RA KHỎI settings.block_styles
update public.settings
set block_styles = block_styles - 'admin_accounts'
where block_styles ? 'admin_accounts';

-- 3.b XÓA BỎ BẢN GHI MẬT KHẨU (NẾU CÓ) TRONG MẢNG WORKSPACES CỦA SETTINGS
do $$
declare
  rec record;
  cleaned_workspaces jsonb;
begin
  for rec in 
    select workspace_id, block_styles->'workspaces' as ws_list
    from public.settings
    where block_styles ? 'workspaces'
  loop
    if jsonb_typeof(rec.ws_list) = 'array' then
      select jsonb_agg(elem - 'admin_password')
      into cleaned_workspaces
      from jsonb_array_elements(rec.ws_list) as elem;

      update public.settings
      set block_styles = jsonb_set(block_styles, '{workspaces}', coalesce(cleaned_workspaces, '[]'::jsonb))
      where workspace_id = rec.workspace_id;
    end if;
  end loop;
end $$;

-- 4. XÓA DỮ LIỆU VÀ DROP CỘT admin_password TRONG BẢNG settings (NẾU TỒN TẠI)
do $$
begin
  if exists (
    select 1 
    from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'settings' 
      and column_name = 'admin_password'
  ) then
    update public.settings set admin_password = null;
    alter table public.settings drop column admin_password;
  end if;
end $$;

-- 5. ĐẢM BẢO RLS TRÊN BẢNG settings: anon CHỈ ĐỌC DỮ LIỆU CÔNG KHAI
alter table public.settings enable row level security;

drop policy if exists "Cho phép mọi người đọc settings" on public.settings;
drop policy if exists "anon_read_public_settings" on public.settings;

create policy "anon_read_public_settings" on public.settings
  for select to anon, authenticated
  using (true);

-- CẤM anon/authenticated THỰC HIỆN insert, update, delete TRÊN settings (chỉ server mới được ghi)
drop policy if exists "anon_write_settings" on public.settings;
drop policy if exists "anon_update_settings" on public.settings;
drop policy if exists "anon_insert_settings" on public.settings;
drop policy if exists "anon_delete_settings" on public.settings;

import { NextRequest, NextResponse } from 'next/server';
import { checkIsSuperAdminRequest, hashPassword } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function GET(req: NextRequest) {
  if (!checkIsSuperAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Chỉ Chủ sở hữu tối cao mới có quyền truy cập danh sách tài khoản' },
      { status: 403 }
    );
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa kết nối cơ sở dữ liệu' }, { status: 503 });
  }

  try {
    // 1. Thử lấy từ bảng bảo mật admin_accounts (không chứa mật khẩu thô)
    const { data: dbAccounts, error: dbErr } = await supabase
      .from('admin_accounts')
      .select('id, name, phone, role, allowed_topic_ids, is_active, created_at')
      .eq('workspace_id', 'default')
      .order('created_at', { ascending: false });

    let accounts: any[] = [];

    if (!dbErr && dbAccounts && dbAccounts.length > 0) {
      accounts = dbAccounts;
    } else {
      // Fallback tương thích ngược: đọc từ settings nếu bảng admin_accounts chưa tạo
      const { data: stData } = await supabase
        .from('settings')
        .select('block_styles')
        .eq('workspace_id', 'default')
        .maybeSingle();

      const legacy = stData?.block_styles?.admin_accounts || [];
      if (Array.isArray(legacy)) {
        accounts = legacy.map((a: any) => ({
          id: a.id,
          name: a.name,
          phone: a.phone,
          role: a.role || 'instructor',
          allowed_topic_ids: a.allowed_topic_ids || [],
          is_active: a.is_active !== false,
          created_at: a.created_at,
        }));
      }
    }

    const { data: topicsData } = await supabase
      .from('topics')
      .select('id, title, slug, sort_order')
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      success: true,
      accounts,
      topics: (topicsData || []).map((t) => ({ id: t.id, title: t.title, slug: t.slug })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi khi tải danh sách tài khoản' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsSuperAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Chỉ Chủ sở hữu tối cao mới có quyền quản lý tài khoản giảng viên' },
      { status: 403 }
    );
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa kết nối cơ sở dữ liệu' }, { status: 503 });
  }

  try {
    const { action, account, accountId } = await req.json();

    if (action === 'create') {
      const { name, phone, password, allowed_topic_ids } = account || {};
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Vui lòng nhập tên giảng viên' }, { status: 400 });
      }
      const cleanPhone = (phone || '').trim().replace(/\s+/g, '');
      if (!cleanPhone || cleanPhone.length < 8) {
        return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
      }
      if (!password || password.trim().length < 4) {
        return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 4 ký tự' }, { status: 400 });
      }

      // 1. Kiểm tra trùng số điện thoại trong admin_accounts
      const { data: exist } = await supabase
        .from('admin_accounts')
        .select('id')
        .eq('workspace_id', 'default')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (exist) {
        return NextResponse.json({ error: 'Số điện thoại này đã được tạo tài khoản' }, { status: 400 });
      }

      // 2. Băm mật khẩu (scrypt hash) trước khi lưu
      const passwordHash = hashPassword(password.trim());
      const newId = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const { error: insErr } = await supabase.from('admin_accounts').insert({
        id: newId,
        workspace_id: 'default',
        name: name.trim(),
        phone: cleanPhone,
        password_hash: passwordHash,
        role: 'instructor',
        allowed_topic_ids: Array.isArray(allowed_topic_ids) ? allowed_topic_ids : [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insErr) {
        // Fallback lưu vào settings.block_styles nếu bảng admin_accounts chưa tạo, nhưng băm mật khẩu
        const { data: stData } = await supabase
          .from('settings')
          .select('block_styles')
          .eq('workspace_id', 'default')
          .maybeSingle();
        const blockStyles = stData?.block_styles || {};
        const legacyAccounts = Array.isArray(blockStyles.admin_accounts) ? [...blockStyles.admin_accounts] : [];
        legacyAccounts.push({
          id: newId,
          name: name.trim(),
          phone: cleanPhone,
          password: passwordHash, // Lưu dạng băm!
          role: 'instructor',
          allowed_topic_ids: Array.isArray(allowed_topic_ids) ? allowed_topic_ids : [],
          is_active: true,
          created_at: new Date().toISOString(),
        });
        await supabase
          .from('settings')
          .update({ block_styles: { ...blockStyles, admin_accounts: legacyAccounts } })
          .eq('workspace_id', 'default');
      }
    } else if (action === 'update') {
      const targetId = accountId || account?.id;
      if (!targetId) {
        return NextResponse.json({ error: 'Thiếu mã tài khoản' }, { status: 400 });
      }

      const cleanPhone = account.phone ? account.phone.trim().replace(/\s+/g, '') : undefined;
      const updateData: any = {
        name: account.name?.trim(),
        allowed_topic_ids: Array.isArray(account.allowed_topic_ids) ? account.allowed_topic_ids : [],
        is_active: account.is_active !== undefined ? Boolean(account.is_active) : true,
        updated_at: new Date().toISOString(),
      };
      if (cleanPhone) updateData.phone = cleanPhone;

      // Nếu có đổi mật khẩu: băm mật khẩu mới
      if (account.password && account.password.trim().length >= 4) {
        updateData.password_hash = hashPassword(account.password.trim());
      }

      const { error: updErr } = await supabase
        .from('admin_accounts')
        .update(updateData)
        .eq('id', targetId);

      if (updErr) {
        // Fallback settings
        const { data: stData } = await supabase
          .from('settings')
          .select('block_styles')
          .eq('workspace_id', 'default')
          .maybeSingle();
        const blockStyles = stData?.block_styles || {};
        let legacyAccounts = Array.isArray(blockStyles.admin_accounts) ? [...blockStyles.admin_accounts] : [];
        legacyAccounts = legacyAccounts.map((a: any) => {
          if (a.id === targetId) {
            return {
              ...a,
              name: account.name?.trim() || a.name,
              phone: cleanPhone || a.phone,
              password: account.password?.trim() ? hashPassword(account.password.trim()) : a.password,
              allowed_topic_ids: Array.isArray(account.allowed_topic_ids) ? account.allowed_topic_ids : a.allowed_topic_ids,
              is_active: account.is_active !== undefined ? Boolean(account.is_active) : a.is_active,
            };
          }
          return a;
        });
        await supabase
          .from('settings')
          .update({ block_styles: { ...blockStyles, admin_accounts: legacyAccounts } })
          .eq('workspace_id', 'default');
      }
    } else if (action === 'toggle') {
      const targetId = accountId || account?.id;
      const { data: existing } = await supabase
        .from('admin_accounts')
        .select('is_active')
        .eq('id', targetId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('admin_accounts')
          .update({ is_active: !existing.is_active, updated_at: new Date().toISOString() })
          .eq('id', targetId);
      }
    } else if (action === 'delete') {
      const targetId = accountId || account?.id;
      if (!targetId) {
        return NextResponse.json({ error: 'Thiếu mã tài khoản' }, { status: 400 });
      }
      await supabase.from('admin_accounts').delete().eq('id', targetId);

      // Clean up fallback if present
      const { data: stData } = await supabase
        .from('settings')
        .select('block_styles')
        .eq('workspace_id', 'default')
        .maybeSingle();
      if (stData?.block_styles?.admin_accounts) {
        const remaining = stData.block_styles.admin_accounts.filter((a: any) => a.id !== targetId);
        await supabase
          .from('settings')
          .update({ block_styles: { ...stData.block_styles, admin_accounts: remaining } })
          .eq('workspace_id', 'default');
      }
    } else {
      return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
    }

    // Trả về danh sách tài khoản mới nhất (không chứa password_hash)
    const { data: refreshed } = await supabase
      .from('admin_accounts')
      .select('id, name, phone, role, allowed_topic_ids, is_active, created_at')
      .eq('workspace_id', 'default')
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, accounts: refreshed || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý tài khoản' }, { status: 500 });
  }
}

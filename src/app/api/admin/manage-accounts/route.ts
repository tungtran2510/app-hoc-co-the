import { NextRequest, NextResponse } from 'next/server';
import { checkIsSuperAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { InstructorAccount } from '../../../../lib/types';

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
    const { data, error } = await supabase
      .from('settings')
      .select('block_styles')
      .eq('workspace_id', 'default')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const accounts: InstructorAccount[] = data?.block_styles?.admin_accounts || [];

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

    const { data: existingData, error: fetchErr } = await supabase
      .from('settings')
      .select('block_styles')
      .eq('workspace_id', 'default')
      .single();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const blockStyles = existingData?.block_styles || {};
    let accounts: InstructorAccount[] = Array.isArray(blockStyles.admin_accounts)
      ? [...blockStyles.admin_accounts]
      : [];

    if (action === 'create') {
      const { name, phone, password, allowed_topic_ids } = account || {};
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Vui lòng nhập tên giảng viên' }, { status: 400 });
      }
      const cleanPhone = (phone || '').trim().replace(/\s+/g, '');
      if (!cleanPhone || cleanPhone.length < 8) {
        return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
      }
      if (cleanPhone === '0974248716') {
        return NextResponse.json({ error: 'Số điện thoại này là tài khoản Chủ sở hữu' }, { status: 400 });
      }
      if (accounts.some((a) => a.phone === cleanPhone)) {
        return NextResponse.json({ error: 'Số điện thoại này đã được tạo tài khoản' }, { status: 400 });
      }
      if (!password || password.trim().length < 4) {
        return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 4 ký tự' }, { status: 400 });
      }

      const newAcc: InstructorAccount = {
        id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        phone: cleanPhone,
        password: password.trim(),
        role: 'instructor',
        allowed_topic_ids: Array.isArray(allowed_topic_ids) ? allowed_topic_ids : [],
        is_active: true,
        created_at: new Date().toISOString(),
      };
      accounts.push(newAcc);
    } else if (action === 'update') {
      const targetId = accountId || account?.id;
      if (!targetId) {
        return NextResponse.json({ error: 'Thiếu mã tài khoản' }, { status: 400 });
      }
      const idx = accounts.findIndex((a) => a.id === targetId);
      if (idx === -1) {
        return NextResponse.json({ error: 'Không tìm thấy tài khoản cần sửa' }, { status: 404 });
      }

      const existingAcc = accounts[idx];
      const updatedPhone = account.phone
        ? account.phone.trim().replace(/\s+/g, '')
        : existingAcc.phone;

      if (updatedPhone !== existingAcc.phone && accounts.some((a) => a.id !== targetId && a.phone === updatedPhone)) {
        return NextResponse.json({ error: 'Số điện thoại này đã được dùng cho tài khoản khác' }, { status: 400 });
      }

      accounts[idx] = {
        ...existingAcc,
        name: account.name?.trim() || existingAcc.name,
        phone: updatedPhone,
        password: account.password?.trim() ? account.password.trim() : existingAcc.password,
        allowed_topic_ids: Array.isArray(account.allowed_topic_ids)
          ? account.allowed_topic_ids
          : existingAcc.allowed_topic_ids,
        is_active: account.is_active !== undefined ? Boolean(account.is_active) : existingAcc.is_active,
      };
    } else if (action === 'toggle') {
      const targetId = accountId || account?.id;
      const idx = accounts.findIndex((a) => a.id === targetId);
      if (idx !== -1) {
        accounts[idx].is_active = !accounts[idx].is_active;
      }
    } else if (action === 'delete') {
      const targetId = accountId || account?.id;
      if (!targetId) {
        return NextResponse.json({ error: 'Thiếu mã tài khoản' }, { status: 400 });
      }
      accounts = accounts.filter((a) => a.id !== targetId);
    } else {
      return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
    }

    const updatedBlockStyles = {
      ...blockStyles,
      admin_accounts: accounts,
    };

    const { error: updateErr } = await supabase
      .from('settings')
      .update({
        block_styles: updatedBlockStyles,
        updated_at: new Date().toISOString(),
      })
      .eq('workspace_id', 'default');

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, accounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý tài khoản' }, { status: 500 });
  }
}

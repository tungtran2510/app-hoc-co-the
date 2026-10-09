import { NextRequest, NextResponse } from 'next/server';
import { checkIsSuperAdminRequest, hashPassword } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { WorkspaceTenant } from '../../../../lib/types';
import { generateUuid } from '../../../../lib/uuid';

export async function GET(req: NextRequest) {
  if (!checkIsSuperAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Chỉ Chủ sở hữu tối cao mới có quyền truy cập danh sách cơ sở / khách hàng' },
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

    const rawWorkspaces: any[] = data?.block_styles?.workspaces || [];
    const workspaces = rawWorkspaces.map(({ admin_password, ...w }: any) => w);
    return NextResponse.json({ success: true, workspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi khi tải danh sách khách hàng' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsSuperAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Chỉ Chủ sở hữu tối cao mới có quyền quản lý khách hàng' },
      { status: 403 }
    );
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa kết nối cơ sở dữ liệu' }, { status: 503 });
  }

  try {
    const { action, workspace, workspaceId } = await req.json();

    const { data: defaultData, error: fetchErr } = await supabase
      .from('settings')
      .select('*')
      .eq('workspace_id', 'default')
      .single();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const blockStyles = defaultData?.block_styles || {};
    let workspaces: WorkspaceTenant[] = Array.isArray(blockStyles.workspaces)
      ? [...blockStyles.workspaces]
      : [];

    if (action === 'create') {
      const { id, name, owner_name, owner_phone, admin_password, custom_domain, copy_template, note } = workspace || {};
      
      const cleanId = (id || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!cleanId || cleanId.length < 2) {
        return NextResponse.json({ error: 'Mã cơ sở (Slug) không hợp lệ (chỉ gồm chữ thường, số, dấu gạch nối)' }, { status: 400 });
      }
      if (cleanId === 'default' || cleanId.startsWith('user_sync:')) {
        return NextResponse.json({ error: 'Mã cơ sở này thuộc hệ thống, vui lòng chọn mã khác' }, { status: 400 });
      }
      if (workspaces.some((w) => w.id === cleanId)) {
        return NextResponse.json({ error: `Mã cơ sở "${cleanId}" đã tồn tại` }, { status: 400 });
      }
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Vui lòng nhập tên ứng dụng / phòng khám' }, { status: 400 });
      }
      const cleanPhone = (owner_phone || '').trim().replace(/\s+/g, '');
      if (!cleanPhone || cleanPhone.length < 8) {
        return NextResponse.json({ error: 'Số điện thoại chủ sở hữu không hợp lệ' }, { status: 400 });
      }

      const tenantPassword = (admin_password || 'Admin@2026!').trim();

      const newTenant: WorkspaceTenant = {
        id: cleanId,
        name: name.trim(),
        owner_name: owner_name?.trim() || name.trim(),
        owner_phone: cleanPhone,
        custom_domain: custom_domain?.trim() || null,
        subdomain: `${cleanId}.app-hoc-co-the.vn`,
        is_active: true,
        created_at: new Date().toISOString(),
        copied_template: Boolean(copy_template),
        note: note?.trim() || '',
      };

      // 1. Tạo bản ghi settings mới cho workspace này (không chứa mật khẩu hay danh sách tài khoản)
      const newSettings = {
        workspace_id: cleanId,
        app_name: name.trim(),
        app_subtitle: defaultData.app_subtitle || 'Hệ thống học hiểu cơ thể & sức khỏe chủ động',
        brand_tagline: defaultData.brand_tagline || 'EMPOWERING MEDICAL KNOWLEDGE',
        logo_url: defaultData.logo_url || null,
        primary_color: defaultData.primary_color || '#0C0817',
        access_mode: defaultData.access_mode || 'OPEN',
        hotline: cleanPhone,
        zalo_url: `https://zalo.me/${cleanPhone}`,
        author_profile: {
          ...(defaultData.author_profile || {}),
          name: owner_name?.trim() || name.trim(),
          phone: cleanPhone,
          zalo_url: `https://zalo.me/${cleanPhone}`,
        },
        block_styles: {
          ...(defaultData.block_styles || {}),
          workspaces: undefined, // Không sao chép danh sách khách hàng sang tenant con
        },
        updated_at: new Date().toISOString(),
      };
      // Xoá admin_accounts khỏi block_styles nếu có
      delete (newSettings.block_styles as any).admin_accounts;

      const { error: insertErr } = await supabase.from('settings').upsert(newSettings, { onConflict: 'workspace_id' });
      if (insertErr) {
        return NextResponse.json({ error: `Lỗi tạo cấu hình cơ sở: ${insertErr.message}` }, { status: 500 });
      }

      // Lưu tài khoản quản trị của tenant vào bảng bảo mật admin_accounts với mật khẩu băm scrypt
      await supabase.from('admin_accounts').insert({
        id: `acc_owner_${cleanId}`,
        workspace_id: cleanId,
        name: owner_name?.trim() || name.trim(),
        phone: cleanPhone,
        password_hash: hashPassword(tenantPassword),
        role: 'admin',
        allowed_topic_ids: ['*'],
        is_active: true,
      });

      // 2. Nếu chọn nhân bản khóa học mẫu: Sao chép các topics sang workspace mới
      if (copy_template) {
        try {
          const { data: defaultTopics } = await supabase
            .from('topics')
            .select('*')
            .eq('workspace_id', 'default');

          if (Array.isArray(defaultTopics) && defaultTopics.length > 0) {
            for (const t of defaultTopics) {
              const newTopicId = generateUuid();
              const oldTopicId = t.id;

              // Insert topic mới
              await supabase.from('topics').insert({
                id: newTopicId,
                workspace_id: cleanId,
                title: t.title,
                slug: t.slug,
                description: t.description,
                cover_url: t.cover_url,
                gradient_start: t.gradient_start,
                gradient_end: t.gradient_end,
                icon_name: t.icon_name,
                sort_order: t.sort_order,
                is_visible: t.is_visible,
                badge_text: t.badge_text,
                duration_label: t.duration_label,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

              // Copy các trang thuộc topic này
              const { data: pages } = await supabase
                .from('pages')
                .select('*')
                .eq('topic_id', oldTopicId);

              if (Array.isArray(pages)) {
                for (const p of pages) {
                  const newPageId = generateUuid();
                  const oldPageId = p.id;

                  await supabase.from('pages').insert({
                    id: newPageId,
                    workspace_id: cleanId,
                    topic_id: newTopicId,
                    title: p.title,
                    slug: p.slug,
                    order_label: p.order_label,
                    duration_label: p.duration_label,
                    cover_url: p.cover_url,
                    sort_order: p.sort_order,
                    is_visible: p.is_visible,
                    status: p.status || 'published',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });

                  // Copy các khối thuộc trang này
                  const { data: blocks } = await supabase
                    .from('blocks')
                    .select('*')
                    .eq('page_id', oldPageId);

                  if (Array.isArray(blocks) && blocks.length > 0) {
                    const clonedBlocks = blocks.map((b) => ({
                      id: generateUuid(),
                      workspace_id: cleanId,
                      page_id: newPageId,
                      type: b.type,
                      display_style: b.display_style,
                      data: b.data,
                      sort_order: b.sort_order,
                      is_visible: b.is_visible,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }));
                    await supabase.from('blocks').insert(clonedBlocks);
                  }
                }
              }
            }
          }
        } catch (copyErr) {
          console.warn('[Workspace Template Copy Warning]:', copyErr);
        }
      }

      workspaces.push(newTenant);
    } else if (action === 'update') {
      const targetId = workspaceId || workspace?.id;
      const idx = workspaces.findIndex((w) => w.id === targetId);
      if (idx === -1) {
        return NextResponse.json({ error: 'Không tìm thấy cơ sở / khách hàng cần sửa' }, { status: 404 });
      }

      const newPhone = workspace.owner_phone ? workspace.owner_phone.trim().replace(/\s+/g, '') : workspaces[idx].owner_phone;

      workspaces[idx] = {
        ...workspaces[idx],
        name: workspace.name?.trim() || workspaces[idx].name,
        owner_name: workspace.owner_name?.trim() || workspaces[idx].owner_name,
        owner_phone: newPhone,
        custom_domain: workspace.custom_domain !== undefined ? (workspace.custom_domain?.trim() || null) : workspaces[idx].custom_domain,
        is_active: workspace.is_active !== undefined ? Boolean(workspace.is_active) : workspaces[idx].is_active,
        expires_at: workspace.expires_at !== undefined ? workspace.expires_at : workspaces[idx].expires_at,
        note: workspace.note !== undefined ? workspace.note.trim() : workspaces[idx].note,
      };
      delete (workspaces[idx] as any).admin_password;

      // Đồng bộ sang bảng settings của workspace đó
      if (workspace.name) {
        await supabase
          .from('settings')
          .update({
            app_name: workspace.name.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_id', targetId);
      }

      // Nếu cập nhật mật khẩu cho cơ sở, lưu vào bảng bảo mật admin_accounts với scrypt hash
      if (workspace.admin_password && workspace.admin_password.trim()) {
        await supabase
          .from('admin_accounts')
          .update({
            password_hash: hashPassword(workspace.admin_password.trim()),
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_id', targetId)
          .eq('phone', newPhone);
      }
    } else if (action === 'toggle') {
      const targetId = workspaceId || workspace?.id;
      const idx = workspaces.findIndex((w) => w.id === targetId);
      if (idx !== -1) {
        workspaces[idx].is_active = !workspaces[idx].is_active;
      }
    } else if (action === 'delete') {
      const targetId = workspaceId || workspace?.id;
      if (!targetId) {
        return NextResponse.json({ error: 'Thiếu mã cơ sở' }, { status: 400 });
      }
      workspaces = workspaces.filter((w) => w.id !== targetId);
    } else {
      return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
    }

    // Cập nhật lại danh sách workspaces trong settings default
    const updatedBlockStyles = {
      ...blockStyles,
      workspaces,
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

    return NextResponse.json({ success: true, workspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý cơ sở' }, { status: 500 });
  }
}

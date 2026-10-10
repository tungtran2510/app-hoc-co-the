import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, checkIsSuperAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { sampleSettings, sampleTopics, samplePages, sampleBlocks } from '../../../../data/sample';
import { clearDataCache, fetchAllRowsPaged, isSupabaseConfigured } from '../../../../lib/data';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const supabaseConfigured = isSupabaseConfigured();

  let settings: any = sampleSettings;
  let topics: any[] = sampleTopics;
  let pages: any[] = samplePages;
  let blocks: any[] = sampleBlocks;

  if (supabase) {
    try {
      const settingsRes = await supabase.from('settings').select('*').eq('workspace_id', 'default').single();
      if (settingsRes.error && supabaseConfigured) {
        throw new Error(`Lỗi đọc cài đặt: ${settingsRes.error.message}`);
      }
      if (settingsRes.data) settings = settingsRes.data;

      // Đọc các bảng theo phân trang 1000 dòng/lần cho tới hết
      topics = await fetchAllRowsPaged<any>((from, to) =>
        supabase.from('topics').select('*').order('sort_order', { ascending: true }).range(from, to)
      );

      pages = await fetchAllRowsPaged<any>((from, to) =>
        supabase.from('pages').select('*').order('sort_order', { ascending: true }).range(from, to)
      );

      blocks = await fetchAllRowsPaged<any>((from, to) =>
        supabase.from('blocks').select('*').order('sort_order', { ascending: true }).range(from, to)
      );
    } catch (err: any) {
      if (supabaseConfigured) {
        return NextResponse.json({ error: `Lỗi đọc dữ liệu sao lưu: ${err.message || err}` }, { status: 500 });
      }
    }
  }

  const backupData = {
    exported_at: new Date().toISOString(),
    version: '1.0',
    row_counts: {
      settings: settings ? 1 : 0,
      topics: topics.length,
      pages: pages.length,
      blocks: blocks.length,
    },
    settings,
    topics,
    pages,
    blocks,
  };

  const filename = `sao-luu-${new Date().toISOString().split('T')[0]}.json`;

  return new NextResponse(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  if (!checkIsSuperAdminRequest(req)) {
    return NextResponse.json({ error: 'Chỉ Super Admin mới có quyền phục hồi dữ liệu hệ thống' }, { status: 403 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Không thể kết nối đến cơ sở dữ liệu Supabase' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const backupData = body.backupData || body;

    if (!backupData || typeof backupData !== 'object') {
      return NextResponse.json({ error: 'Dữ liệu sao lưu không hợp lệ' }, { status: 400 });
    }

    const { settings, topics, pages, blocks } = backupData;

    // 1. KIỂM TRA TOÀN BỘ FILE TRƯỚC KHI GHI (Validate all data first)
    if (!Array.isArray(topics) || !Array.isArray(pages) || !Array.isArray(blocks)) {
      return NextResponse.json({
        error: 'File sao lưu thiếu danh sách topics, pages hoặc blocks hợp lệ',
      }, { status: 400 });
    }

    if (topics.length === 0 || pages.length === 0) {
      return NextResponse.json({
        error: 'Bản sao lưu không chứa bài học hoặc chuyên đề nào để phục hồi',
      }, { status: 400 });
    }

    if (settings && typeof settings === 'object') {
      if (!settings.workspace_id) {
        return NextResponse.json({ error: 'Dữ liệu settings thiếu trường workspace_id' }, { status: 400 });
      }
    }

    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      if (!t || !t.id || !t.slug || !t.title) {
        return NextResponse.json({
          error: `Chuyên đề thứ ${i + 1} trong file không hợp lệ (yêu cầu đủ id, slug, title)`,
        }, { status: 400 });
      }
    }

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (!p || !p.id || !p.slug || !p.title || !p.topic_id) {
        return NextResponse.json({
          error: `Bài học thứ ${i + 1} trong file không hợp lệ (yêu cầu đủ id, slug, title, topic_id)`,
        }, { status: 400 });
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b || !b.id || !b.page_id || !b.type) {
        return NextResponse.json({
          error: `Khối nội dung thứ ${i + 1} trong file không hợp lệ (yêu cầu đủ id, page_id, type)`,
        }, { status: 400 });
      }
    }

    // 2. GHI DỮ LIỆU TỪNG BƯỚC – LỖI BẤT KỲ BƯỚC NÀO THÌ BÁO RÕ, DỪNG NGAY
    // Bước 2.1: Phục hồi Settings
    if (settings && typeof settings === 'object' && settings.workspace_id) {
      const { error: settingsErr } = await supabase
        .from('settings')
        .upsert(settings, { onConflict: 'workspace_id' });
      if (settingsErr) {
        console.error('[Restore Settings Error]:', settingsErr);
        return NextResponse.json({ error: `Lỗi phục hồi cài đặt: ${settingsErr.message}` }, { status: 500 });
      }
    }

    // Bước 2.2: Phục hồi Topics
    const cleanTopics = topics.map((t: any) => ({
      ...t,
      workspace_id: t.workspace_id || 'default',
    }));
    const { error: topicsErr } = await supabase
      .from('topics')
      .upsert(cleanTopics, { onConflict: 'id' });
    if (topicsErr) {
      console.error('[Restore Topics Error]:', topicsErr);
      return NextResponse.json({ error: `Lỗi phục hồi chuyên đề: ${topicsErr.message}` }, { status: 500 });
    }

    // Bước 2.3: Phục hồi Pages theo lô (chunk 50 items)
    const cleanPages = pages.map((p: any) => ({
      ...p,
      workspace_id: p.workspace_id || 'default',
    }));
    for (let i = 0; i < cleanPages.length; i += 50) {
      const chunk = cleanPages.slice(i, i + 50);
      const { error: pagesErr } = await supabase
        .from('pages')
        .upsert(chunk, { onConflict: 'id' });
      if (pagesErr) {
        console.error('[Restore Pages Error]:', pagesErr);
        return NextResponse.json({ error: `Lỗi phục hồi bài học tại lô ${Math.floor(i / 50) + 1}: ${pagesErr.message}` }, { status: 500 });
      }
    }

    // Bước 2.4: Phục hồi Blocks theo lô (chunk 50 items)
    const cleanBlocks = blocks.map((b: any) => ({
      ...b,
      workspace_id: b.workspace_id || 'default',
    }));
    for (let i = 0; i < cleanBlocks.length; i += 50) {
      const chunk = cleanBlocks.slice(i, i + 50);
      const { error: blocksErr } = await supabase
        .from('blocks')
        .upsert(chunk, { onConflict: 'id' });
      if (blocksErr) {
        console.error('[Restore Blocks Error]:', blocksErr);
        return NextResponse.json({ error: `Lỗi phục hồi khối nội dung tại lô ${Math.floor(i / 50) + 1}: ${blocksErr.message}` }, { status: 500 });
      }
    }

    // 3. GHI XONG THÌ XOÁ KHỐI/TRANG KHÔNG CÓ TRONG FILE (Làm sạch triệt để)
    const validBlockIds = new Set(cleanBlocks.map((b: any) => String(b.id)));
    const validPageIds = new Set(cleanPages.map((p: any) => String(p.id)));

    // Xoá các khối trên DB không nằm trong file sao lưu
    const allDbBlocks = await fetchAllRowsPaged<{ id: string }>((from, to) =>
      supabase.from('blocks').select('id').range(from, to)
    );
    const orphanBlockIds = allDbBlocks
      .map((b) => String(b.id))
      .filter((id) => !validBlockIds.has(id));

    for (let i = 0; i < orphanBlockIds.length; i += 50) {
      const chunk = orphanBlockIds.slice(i, i + 50);
      const { error: delBlockErr } = await supabase
        .from('blocks')
        .delete()
        .in('id', chunk);
      if (delBlockErr) {
        console.error('[Cleanup Orphan Blocks Error]:', delBlockErr);
        return NextResponse.json({ error: `Lỗi dọn khối thừa không có trong sao lưu: ${delBlockErr.message}` }, { status: 500 });
      }
    }

    // Xoá các trang trên DB không nằm trong file sao lưu
    const allDbPages = await fetchAllRowsPaged<{ id: string }>((from, to) =>
      supabase.from('pages').select('id').range(from, to)
    );
    const orphanPageIds = allDbPages
      .map((p) => String(p.id))
      .filter((id) => !validPageIds.has(id));

    for (let i = 0; i < orphanPageIds.length; i += 50) {
      const chunk = orphanPageIds.slice(i, i + 50);
      const { error: delPageErr } = await supabase
        .from('pages')
        .delete()
        .in('id', chunk);
      if (delPageErr) {
        console.error('[Cleanup Orphan Pages Error]:', delPageErr);
        return NextResponse.json({ error: `Lỗi dọn bài học thừa không có trong sao lưu: ${delPageErr.message}` }, { status: 500 });
      }
    }

    // 4. Làm mới bộ nhớ đệm và trang hiển thị
    try {
      clearDataCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua lỗi cache nếu có
    }

    return NextResponse.json({
      success: true,
      message: 'Phục hồi dữ liệu thành công',
      restored: {
        topics: cleanTopics.length,
        pages: cleanPages.length,
        blocks: cleanBlocks.length,
        deleted_orphan_blocks: orphanBlockIds.length,
        deleted_orphan_pages: orphanPageIds.length,
      },
    });
  } catch (err: any) {
    console.error('[Restore Exception]:', err);
    return NextResponse.json({ error: err.message || 'Lỗi xử lý file sao lưu' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, checkIsSuperAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { sampleSettings, sampleTopics, samplePages, sampleBlocks } from '../../../../data/sample';
import { clearDataCache } from '../../../../lib/data';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();

  let settings = sampleSettings;
  let topics = sampleTopics;
  let pages = samplePages;
  let blocks = sampleBlocks;

  if (supabase) {
    const [settingsRes, topicsRes, pagesRes, blocksRes] = await Promise.all([
      supabase.from('settings').select('*').eq('workspace_id', 'default').single(),
      supabase.from('topics').select('*').order('sort_order', { ascending: true }),
      supabase.from('pages').select('*').order('sort_order', { ascending: true }),
      supabase.from('blocks').select('*').order('sort_order', { ascending: true }),
    ]);

    if (settingsRes.data) settings = settingsRes.data;
    if (topicsRes.data && topicsRes.data.length > 0) topics = topicsRes.data;
    if (pagesRes.data && pagesRes.data.length > 0) pages = pagesRes.data;
    if (blocksRes.data && blocksRes.data.length > 0) blocks = blocksRes.data;
  }

  const backupData = {
    exported_at: new Date().toISOString(),
    version: '1.0',
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

    // 1. Phục hồi Settings
    if (settings && typeof settings === 'object' && settings.workspace_id) {
      const { error: settingsErr } = await supabase
        .from('settings')
        .upsert(settings, { onConflict: 'workspace_id' });
      if (settingsErr) {
        console.error('[Restore Settings Error]:', settingsErr);
      }
    }

    // 2. Phục hồi Topics
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

    // 3. Phục hồi Pages theo lô (chunk 50 items)
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
        return NextResponse.json({ error: `Lỗi phục hồi bài học: ${pagesErr.message}` }, { status: 500 });
      }
    }

    // 4. Phục hồi Blocks theo lô (chunk 50 items)
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
        return NextResponse.json({ error: `Lỗi phục hồi khối nội dung: ${blocksErr.message}` }, { status: 500 });
      }
    }

    // 5. Làm mới bộ nhớ đệm và trang hiển thị
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
      },
    });
  } catch (err: any) {
    console.error('[Restore Exception]:', err);
    return NextResponse.json({ error: err.message || 'Lỗi xử lý file sao lưu' }, { status: 500 });
  }
}

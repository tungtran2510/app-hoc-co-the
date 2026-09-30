import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { sampleSettings, sampleTopics, samplePages, sampleBlocks } from '../../../../data/sample';

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

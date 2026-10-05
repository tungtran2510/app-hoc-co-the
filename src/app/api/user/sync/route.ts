import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { UserProgressSyncData } from '../../../../lib/types';
import crypto from 'crypto';
import { rateLimit, getClientIp } from '../../../../lib/authServer';

export const dynamic = 'force-dynamic';

function cleanPhoneNumber(raw?: string | null): string {
  if (!raw) return '';
  return raw.replace(/[^0-9]/g, '');
}

function hashedSyncKey(cleanPhone: string): string {
  const pepper = process.env.USER_SYNC_PEPPER || process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'qbiz-user-sync';
  return 'user_sync:' + crypto.createHmac('sha256', pepper).update(cleanPhone).digest('hex').slice(0, 40);
}

const DISPLAY_MODES = new Set(['card', 'text', 'logo', 'large', 'catalog']);

function normalizeDisplayPreferences(value: any): NonNullable<UserProgressSyncData['display_preferences']> {
  const preferences: NonNullable<UserProgressSyncData['display_preferences']> = {};
  if (!value || typeof value !== 'object') return preferences;
  if (DISPLAY_MODES.has(value.home_topics_display)) preferences.home_topics_display = value.home_topics_display;
  if (DISPLAY_MODES.has(value.topics_page_display)) preferences.topics_page_display = value.topics_page_display;
  return preferences;
}

export async function POST(req: NextRequest) {
  try {
    // Chặn dò số điện thoại hàng loạt: tối đa 40 lần / 10 phút cho mỗi IP
    if (!rateLimit(`usersync:${getClientIp(req)}`, 40, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Thao tác quá nhanh, vui lòng thử lại sau ít phút' }, { status: 429 });
    }
    const body = await req.json();
    const { phone, action = 'sync', localData } = body;

    const cleanPhone = cleanPhoneNumber(phone);
    if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 11) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ (vui lòng nhập từ 9 đến 11 chữ số)' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Hệ thống chưa kết nối cơ sở dữ liệu' },
        { status: 503 }
      );
    }

    // Khóa lưu trữ đã băm: không để số điện thoại xuất hiện dạng chữ rõ trong bảng dữ liệu
    const syncKey = hashedSyncKey(cleanPhone);
    const legacyKey = `user_sync:${cleanPhone}`;

    // Lấy dữ liệu đã lưu trên đám mây của số điện thoại này
    const { data: record, error: fetchErr } = await supabase
      .from('settings')
      .select('block_styles, updated_at')
      .eq('workspace_id', syncKey)
      .maybeSingle();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      return NextResponse.json(
        { error: fetchErr.message || 'Lỗi khi tra cứu dữ liệu học tập' },
        { status: 500 }
      );
    }

    // Tương thích dữ liệu cũ (khóa chứa số điện thoại): đọc rồi tự chuyển sang khóa đã băm khi lưu
    let legacyRecord: any = null;
    if (!record) {
      const { data: legacy } = await supabase
        .from('settings')
        .select('block_styles, updated_at')
        .eq('workspace_id', legacyKey)
        .maybeSingle();
      legacyRecord = legacy || null;
    }

    const sourceRecord = record || legacyRecord;
    const storedBlockStyles = sourceRecord?.block_styles || {};
    const storedProgress = storedBlockStyles.user_progress || storedBlockStyles;
    const displayPreferences = normalizeDisplayPreferences(
      storedBlockStyles.display_preferences || storedProgress?.display_preferences
    );
    const cloudData: UserProgressSyncData = {
      ...(storedProgress || {}),
      phone: '',
      display_preferences: displayPreferences,
    };

    if (action === 'get_preferences') {
      return NextResponse.json({ success: true, preferences: displayPreferences });
    }

    if (action === 'save_preferences') {
      const incoming = normalizeDisplayPreferences(localData?.display_preferences);
      const nextPreferences = { ...displayPreferences, ...incoming };
      const progressData: UserProgressSyncData = {
        phone: '',
        xem_tiep: cloudData.xem_tiep || null,
        tien_do: cloudData.tien_do || {},
        bai_da_luu: cloudData.bai_da_luu || [],
        da_hoan_thanh: cloudData.da_hoan_thanh || [],
        updated_at: new Date().toISOString(),
      };
      const { error: upsertErr } = await supabase.from('settings').upsert(
        {
          workspace_id: syncKey,
          app_name: 'Học viên',
          primary_color: '#0C0817',
          access_mode: 'OPEN',
          block_styles: { user_progress: progressData, display_preferences: nextPreferences },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'workspace_id' }
      );
      if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message || 'Không lưu được cách hiển thị' }, { status: 500 });
      }
      if (legacyRecord) await supabase.from('settings').delete().eq('workspace_id', legacyKey);
      return NextResponse.json({ success: true, preferences: nextPreferences });
    }

    // 1. Chỉ lấy dữ liệu từ đám mây (GET)
    if (action === 'get') {
      return NextResponse.json({
        success: true,
        data: cloudData,
        phone: cleanPhone,
      });
    }

    // 2. Đồng bộ & Gộp dữ liệu đám mây + thiết bị hiện tại (SYNC / SAVE)
    // Merge danh sách bài đã lưu (bai_da_luu)
    const cloudSaved = Array.isArray(cloudData?.bai_da_luu) ? cloudData!.bai_da_luu : [];
    const localSaved = Array.isArray(localData?.bai_da_luu) ? localData.bai_da_luu : [];
    const savedMap = new Map<string, any>();

    for (const item of [...cloudSaved, ...localSaved]) {
      if (!item || !item.page_id) continue;
      const existing = savedMap.get(item.page_id);
      if (!existing || (item.saved_at || 0) >= (existing.saved_at || 0)) {
        savedMap.set(item.page_id, item);
      }
    }
    const mergedBaiDaLuu = Array.from(savedMap.values()).sort(
      (a, b) => (b.saved_at || 0) - (a.saved_at || 0)
    );

    // Merge danh sách bài đã hiểu (da_hoan_thanh)
    const cloudCompleted = Array.isArray(cloudData?.da_hoan_thanh) ? cloudData!.da_hoan_thanh : [];
    const localCompleted = Array.isArray(localData?.da_hoan_thanh) ? localData.da_hoan_thanh : [];
    const mergedDaHoanThanh = Array.from(new Set([...cloudCompleted, ...localCompleted]));

    // Merge tiến độ video từng bài (tien_do)
    const cloudTienDo = (cloudData?.tien_do && typeof cloudData.tien_do === 'object') ? cloudData.tien_do : {};
    const localTienDo = (localData?.tien_do && typeof localData.tien_do === 'object') ? localData.tien_do : {};
    const mergedTienDo: Record<string, { last_video: number; watched: number[] }> = {};
    const allPageIds = Array.from(new Set([...Object.keys(cloudTienDo), ...Object.keys(localTienDo)]));

    for (const pid of allPageIds) {
      const c = cloudTienDo[pid] || { last_video: 0, watched: [] };
      const l = localTienDo[pid] || { last_video: 0, watched: [] };
      const watched = Array.from(new Set([...(c.watched || []), ...(l.watched || [])])).sort((a, b) => a - b);
      const last_video = Math.max(c.last_video || 0, l.last_video || 0);
      mergedTienDo[pid] = { last_video, watched };
    }

    // Merge vị trí học cuối cùng (xem_tiep)
    let mergedXemTiep = localData?.xem_tiep || cloudData?.xem_tiep || null;
    if (cloudData?.xem_tiep && localData?.xem_tiep) {
      const cloudTime = cloudData.xem_tiep.updated_at || 0;
      const localTime = localData.xem_tiep.updated_at || 0;
      mergedXemTiep = cloudTime >= localTime ? cloudData.xem_tiep : localData.xem_tiep;
    }

    const mergedPayload: UserProgressSyncData = {
      phone: '',
      xem_tiep: mergedXemTiep,
      tien_do: mergedTienDo,
      bai_da_luu: mergedBaiDaLuu,
      da_hoan_thanh: mergedDaHoanThanh,
      display_preferences: displayPreferences,
      updated_at: new Date().toISOString(),
    };

    // Ghi an toàn vào Supabase
    const { error: upsertErr } = await supabase.from('settings').upsert(
      {
        workspace_id: syncKey,
        app_name: 'Học viên',
        primary_color: '#0C0817',
        access_mode: 'OPEN',
        block_styles: { user_progress: mergedPayload, display_preferences: displayPreferences },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'workspace_id' }
    );

    if (upsertErr) {
      return NextResponse.json(
        { error: upsertErr.message || 'Lỗi khi lưu dữ liệu học tập lên máy chủ' },
        { status: 500 }
      );
    }

    // Đã chuyển sang khóa đã băm → xóa bản ghi cũ chứa số điện thoại
    if (legacyRecord || (!record && legacyKey !== syncKey)) {
      await supabase.from('settings').delete().eq('workspace_id', legacyKey);
    }

    return NextResponse.json({
      success: true,
      data: mergedPayload,
      phone: cleanPhone,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Lỗi máy chủ khi xử lý đồng bộ' },
      { status: 500 }
    );
  }
}

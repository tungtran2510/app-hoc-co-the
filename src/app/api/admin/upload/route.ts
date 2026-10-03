import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { generateUuid } from '../../../../lib/uuid';

function getYearMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu Supabase' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file để tải lên' }, { status: 400 });
    }

    const ym = getYearMonth();
    const uuid = generateUuid();
    const origExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const isDoc = ['pdf', 'doc', 'docx'].includes(origExt);
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'heic', 'heif', 'pdf', 'doc', 'docx'].includes(origExt) ? origExt : 'webp';
    const folder = isDoc ? 'documents' : 'images';
    const filePath = `${folder}/${ym}/${uuid}.${safeExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type;
    if (!contentType) {
      if (safeExt === 'pdf') contentType = 'application/pdf';
      else if (safeExt === 'doc') contentType = 'application/msword';
      else if (safeExt === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (safeExt === 'webp') contentType = 'image/webp';
      else contentType = 'image/jpeg';
    }

    const { data, error } = await supabase.storage.from('media').upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

    if (error || !data) {
      console.error('[Upload Error]', error);
      return NextResponse.json({ error: error?.message || 'Lỗi khi tải file lên kho lưu trữ' }, { status: 500 });
    }

    const { data: pubData } = supabase.storage.from('media').getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: pubData.publicUrl,
      thumb_url: pubData.publicUrl,
      path: filePath,
    });
  } catch (err: any) {
    console.error('[Server Upload Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi máy chủ khi tải ảnh lên' }, { status: 500 });
  }
}

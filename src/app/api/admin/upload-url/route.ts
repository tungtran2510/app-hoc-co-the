import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { filePath } = await req.json();
    if (!filePath) {
      return NextResponse.json({ error: 'Thiếu đường dẫn tệp filePath' }, { status: 400 });
    }

    // Tạo signed upload URL từ bucket 'media' với quyền ghi đè (upsert: true)
    const { data, error } = await supabase.storage.from('media').createSignedUploadUrl(filePath, { upsert: true });

    if (error || !data) {
      // Nếu createSignedUploadUrl lỗi hoặc chưa hỗ trợ, trả về lỗi chi tiết
      return NextResponse.json({ error: error?.message || 'Không tạo được URL tải lên' }, { status: 500 });
    }

    // Lấy URL công khai sau khi upload
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSettings } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      success: true,
      ai_training: settings.ai_training || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi khi tải cấu hình huấn luyện AI' },
      { status: 500 }
    );
  }
}

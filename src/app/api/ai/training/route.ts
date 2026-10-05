import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '../../../../lib/data';
import { getMasterKnowledgeDocs } from '../../../../lib/aiKnowledgeServer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const isFull = req.nextUrl.searchParams.get('full') === '1';
    const settings = await getSettings(false);
    const baseAi = settings.ai_training || { guidelines: '', faqs: [] };

    let documents = baseAi.documents || [];
    if (isFull) {
      const masterDocs = getMasterKnowledgeDocs();
      documents = [...masterDocs, ...documents];
    }

    return NextResponse.json({
      success: true,
      ai_training: {
        guidelines: baseAi.guidelines || '',
        faqs: baseAi.faqs || [],
        documents: isFull ? documents : [],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi khi tải cấu hình huấn luyện AI' },
      { status: 500 }
    );
  }
}

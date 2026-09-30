import { NextRequest, NextResponse } from 'next/server';
import { getTopics, getPagesByTopic, getBlocksByPage } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

interface LessonCatalogItem {
  topic_title: string;
  topic_slug: string;
  page_title: string;
  page_slug: string;
  summary: string;
  content: string;
}

async function buildLessonCatalog(): Promise<LessonCatalogItem[]> {
  try {
    const topics = await getTopics(false);
    const catalog: LessonCatalogItem[] = [];

    for (const topic of topics) {
      const pages = await getPagesByTopic(topic.id, false);
      for (const page of pages) {
        let contentText = '';
        try {
          const blocks = await getBlocksByPage(page.id, false);
          const lines: string[] = [];
          for (const b of blocks) {
            if (b.type === 'text' && b.data?.lines) {
              lines.push(...b.data.lines);
            } else if (b.type === 'comparison') {
              if (b.data?.left_lines) lines.push(...b.data.left_lines);
              if (b.data?.right_lines) lines.push(...b.data.right_lines);
            }
          }
          contentText = lines.join(' ').slice(0, 500);
        } catch {
          // ignore
        }

        catalog.push({
          topic_title: topic.title,
          topic_slug: topic.slug,
          page_title: page.title,
          page_slug: page.slug,
          summary: page.summary || '',
          content: contentText,
        });
      }
    }
    return catalog;
  } catch {
    return [];
  }
}

// Fallback siêu ngắn gọn theo đúng tài liệu
function fallbackSearch(query: string, catalog: LessonCatalogItem[]) {
  const lower = query.toLowerCase();
  const matched = catalog.filter((item) => {
    return (
      item.page_title.toLowerCase().includes(lower) ||
      item.topic_title.toLowerCase().includes(lower) ||
      item.summary.toLowerCase().includes(lower) ||
      item.content.toLowerCase().includes(lower)
    );
  });

  const selected = (matched.length > 0 ? matched : catalog).slice(0, 2);

  return {
    answer: `Theo tài liệu hướng dẫn của tác giả, vấn đề này cần được điều chỉnh từ tư thế và cơ chế vận động sinh học. Mời bạn mở bài học chi tiết dưới đây:`,
    suggested_pages: selected.map((s) => ({
      title: s.page_title,
      topic_title: s.topic_title,
      topic_slug: s.topic_slug,
      page_slug: s.page_slug,
      reason: 'Xem chi tiết hướng dẫn của tác giả trong bài học này.',
    })),
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Cách phân biệt đau mỏi thông thường?',
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = (body.question || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!question) {
      return NextResponse.json({ error: 'Vui lòng nhập câu hỏi.' }, { status: 400 });
    }

    const catalog = await buildLessonCatalog();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackResult = fallbackSearch(question, catalog);
      return NextResponse.json(fallbackResult);
    }

    // Danh sách bài học và nội dung thực tế do tác giả viết
    const catalogText = catalog
      .map(
        (c, idx) =>
          `[Bài ${idx + 1}] Chủ đề: "${c.topic_title}" | Bài: "${c.page_title}" (slug: ${c.topic_slug}/${c.page_slug})\n- Tóm tắt: ${c.summary}\n- Nội dung tác giả hướng dẫn: ${c.content || 'Xem bài giảng chi tiết.'}`
      )
      .join('\n\n');

    const prompt = `Bạn là Trợ lý AI đồng hành, hướng dẫn người học DỰA TRÊN CHÍNH TÀI LIỆU VÀ BÀI GIẢNG CỦA TÁC GIẢ trong ứng dụng "Học Cơ Thể".

TOÀN BỘ TÀI LIỆU & NỘI DUNG TÁC GIẢ HƯỚNG DẪN TRONG HỆ THỐNG:
${catalogText}

CÂU HỎI CỦA NGƯỜI HỌC: "${question}"

LỊCH SỬ HỘI THOẠI TRƯỚC:
${history.slice(-2).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}

QUY TẮC BẮT BUỘC:
1. CHỈ TRẢ LỜI DỰA VÀO TÀI LIỆU VÀ BÀI HỌC CỦA TÁC GIẢ Ở TRÊN. Không tự bịa đặt hoặc nói lý thuyết lan man bên ngoài.
2. NÓI THẬT NGẮN GỌN (CHỈ TỪ 1 ĐẾN 2 CÂU NGẮN, TỐI ĐA 40 - 50 TỪ)! Nêu thẳng vào kết luận cốt lõi theo tác giả hướng dẫn, không dài dòng.
3. CHỌN 1 ĐẾN 2 BÀI HỌC CHÍNH XÁC trong tài liệu trên để người học mở ra xem chi tiết.

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON (không kèm văn bản nào khác):
{
  "answer": "Câu trả lời siêu ngắn gọn (1-2 câu, nêu đúng hướng dẫn cốt lõi của tác giả)...",
  "suggested_pages": [
    {
      "title": "Tên bài học chính xác trong tài liệu",
      "topic_title": "Tên chủ đề",
      "topic_slug": "slug_chu_de",
      "page_slug": "slug_bai_hoc",
      "reason": "Lý do ngắn gọn 1 câu"
    }
  ],
  "follow_up_questions": [
    "Câu hỏi ngắn gợi ý tiếp theo 1?",
    "Câu hỏi ngắn gợi ý tiếp theo 2?"
  ]
}`;

    const candidateModels = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
    let rawText = '';

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            rawText = text;
            break;
          }
        }
      } catch {
        // thử model tiếp theo
      }
    }

    if (!rawText) {
      const fallbackResult = fallbackSearch(question, catalog);
      return NextResponse.json(fallbackResult);
    }

    // Bóc tách JSON an toàn từ phản hồi của Gemini
    let parsedJson: any = null;
    try {
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsedJson = JSON.parse(cleaned);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedJson = JSON.parse(jsonMatch[0]);
        } catch {
          parsedJson = null;
        }
      }
    }

    if (parsedJson && parsedJson.answer) {
      const normalizedSuggested = Array.isArray(parsedJson.suggested_pages)
        ? parsedJson.suggested_pages.map((p: any) => {
            const topicSlug = (p.topic_slug || '').trim();
            let pageSlug = (p.page_slug || '').trim();
            if (topicSlug && pageSlug.startsWith(`${topicSlug}/`)) {
              pageSlug = pageSlug.slice(topicSlug.length + 1);
            }
            return {
              title: p.title || '',
              topic_title: p.topic_title || '',
              topic_slug: topicSlug,
              page_slug: pageSlug,
              reason: p.reason || '',
            };
          })
        : [];

      return NextResponse.json({
        answer: parsedJson.answer,
        suggested_pages: normalizedSuggested,
        follow_up_questions: Array.isArray(parsedJson.follow_up_questions) ? parsedJson.follow_up_questions : [],
      });
    }

    return NextResponse.json(fallbackSearch(question, catalog));
  } catch (error: any) {
    return NextResponse.json(
      {
        answer: 'Xin lỗi bạn, kết nối tới Trợ lý AI đang gián đoạn một chút. Mời bạn tham khảo trực tiếp các bài học hướng dẫn dưới đây:',
        suggested_pages: [],
        follow_up_questions: [],
      },
      { status: 200 }
    );
  }
}

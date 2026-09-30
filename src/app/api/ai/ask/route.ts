import { NextRequest, NextResponse } from 'next/server';
import { getTopics, getPagesByTopic } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

interface LessonCatalogItem {
  topic_title: string;
  topic_slug: string;
  page_title: string;
  page_slug: string;
  summary: string;
}

async function buildLessonCatalog(): Promise<LessonCatalogItem[]> {
  try {
    const topics = await getTopics(false);
    const catalog: LessonCatalogItem[] = [];

    for (const topic of topics) {
      const pages = await getPagesByTopic(topic.id, false);
      for (const page of pages) {
        catalog.push({
          topic_title: topic.title,
          topic_slug: topic.slug,
          page_title: page.title,
          page_slug: page.slug,
          summary: page.summary || '',
        });
      }
    }
    return catalog;
  } catch {
    return [];
  }
}

// Hàm fallback gợi ý bài học theo từ khóa nếu mạng lỗi
function fallbackSearch(query: string, catalog: LessonCatalogItem[]) {
  const lower = query.toLowerCase();
  const matched = catalog.filter((item) => {
    return (
      item.page_title.toLowerCase().includes(lower) ||
      item.topic_title.toLowerCase().includes(lower) ||
      item.summary.toLowerCase().includes(lower)
    );
  });

  const selected = (matched.length > 0 ? matched : catalog).slice(0, 3);

  return {
    answer: `Chào bạn! Về vấn đề **"${query}"**, việc hiểu rõ cấu trúc sinh cơ học và nguyên nhân gây đau là chìa khóa then chốt để phục hồi an toàn tại nhà. Bạn nên kết hợp nghỉ ngơi hợp lý, tránh các tư thế gây áp lực xấu và bắt đầu với các bài tập vận động nhẹ nhàng theo lộ trình chuẩn. Dưới đây là các bài học liên quan nhất trong hệ thống dành cho bạn:`,
    suggested_pages: selected.map((s) => ({
      title: s.page_title,
      topic_title: s.topic_title,
      topic_slug: s.topic_slug,
      page_slug: s.page_slug,
      reason: 'Bài học cung cấp kiến thức nền tảng và phương pháp phục hồi phù hợp cho tình trạng này.',
    })),
    follow_up_questions: [
      'Làm thế nào để phân biệt đau cơ thông thường và thoát vị đĩa đệm?',
      'Các bài tập kéo giãn an toàn khi bị đau cấp tính?',
      'Tư thế ngồi làm việc đúng cho cột sống và cổ vai gáy?',
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

    // Danh sách bài học để cung cấp ngữ cảnh RAG cho Gemini
    const catalogText = catalog
      .map(
        (c, idx) =>
          `${idx + 1}. [${c.topic_title}] ${c.page_title} (slug: ${c.topic_slug}/${c.page_slug}) - Tóm tắt: ${c.summary}`
      )
      .join('\n');

    const prompt = `Bạn là Trợ lý AI Chuyên gia Cơ Thể & Phục hồi Chức năng trong ứng dụng "Học Cơ Thể".
Bạn có phong cách tư vấn: Ân cần, chuẩn xác y khoa, khoa học, dễ hiểu, trấn an người bệnh và hướng tới việc tự thấu hiểu cơ thể để chăm sóc đúng cách.

DANH MỤC CÁC BÀI HỌC CÓ SẴN TRONG ỨNG DỤNG:
${catalogText}

CÂU HỎI CỦA NGƯỜI HỌC: "${question}"

LỊCH SỬ HỘI THOẠI TRƯỚC ĐÓ:
${history.slice(-4).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}

NHIỆM VỤ CỦA BẠN:
1. Trả lời tư vấn chuyên môn ngắn gọn, súc tích (khoảng 2-3 đoạn ngắn), giải thích cơ chế hoặc nguyên nhân và lời khuyên an toàn.
2. CHỌN TỪ 1 ĐẾN 3 BÀI HỌC PHÙ HỢP NHẤT từ danh mục trên để gợi ý cho người học vào đọc ngay. Nếu có bài học liên quan trực tiếp, bắt buộc phải chọn!
3. Đưa ra 2 đến 3 câu hỏi gợi ý tiếp theo ngắn gọn để người học tiện hỏi tiếp.

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON (không kèm văn bản thừa bên ngoài) có cấu trúc sau:
{
  "answer": "Nội dung câu trả lời tư vấn định dạng markdown...",
  "suggested_pages": [
    {
      "title": "Tên bài học",
      "topic_title": "Tên chủ đề",
      "topic_slug": "slug_chu_de",
      "page_slug": "slug_bai_hoc",
      "reason": "Lý do ngắn gọn vì sao nên học bài này"
    }
  ],
  "follow_up_questions": [
    "Câu hỏi gợi ý 1",
    "Câu hỏi gợi ý 2"
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
              temperature: 0.3,
              maxOutputTokens: 1200,
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
      // Tìm khối JSON đầu tiên nếu có văn bản bọc ngoài
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

    // Nếu parse thất bại, trả về rawText hoặc fallback
    if (rawText.trim()) {
      return NextResponse.json({
        answer: rawText.replace(/```json/g, '').replace(/```/g, '').trim(),
        suggested_pages: catalog.slice(0, 2).map((c) => ({
          title: c.page_title,
          topic_title: c.topic_title,
          topic_slug: c.topic_slug,
          page_slug: c.page_slug,
          reason: 'Bài học kiến thức cơ bản liên quan trong ứng dụng',
        })),
        follow_up_questions: [
          'Các lưu ý khi tập luyện phục hồi cột sống?',
          'Cách nhận biết dấu hiệu chèn ép thần kinh?',
        ],
      });
    }

    return NextResponse.json(fallbackSearch(question, catalog));
  } catch (error: any) {
    return NextResponse.json(
      {
        answer: 'Xin lỗi bạn, kết nối tới Trợ lý AI đang gián đoạn một chút. Dưới đây là các chủ đề bài học gợi ý bạn có thể tham khảo trực tiếp:',
        suggested_pages: [],
        follow_up_questions: [],
      },
      { status: 200 }
    );
  }
}

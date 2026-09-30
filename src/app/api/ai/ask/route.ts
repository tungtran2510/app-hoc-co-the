import { NextRequest, NextResponse } from 'next/server';
import { getTopics, getPagesByTopic, getBlocksByPage, getSettings } from '../../../../lib/data';

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

    const [catalog, settings] = await Promise.all([
      buildLessonCatalog(),
      getSettings(),
    ]);

    const apiKey = process.env.GEMINI_API_KEY;
    const aiTraining = settings?.ai_training;

    if (!apiKey) {
      const fallbackResult = fallbackSearch(question, catalog);
      return NextResponse.json(fallbackResult);
    }

    // 1. Danh sách bài học và nội dung thực tế do tác giả viết
    const catalogText = catalog
      .map(
        (c, idx) =>
          `[Bài ${idx + 1}] Chủ đề: "${c.topic_title}" | Bài: "${c.page_title}" (slug: ${c.topic_slug}/${c.page_slug})\n- Tóm tắt: ${c.summary}\n- Nội dung tác giả hướng dẫn: ${c.content || 'Xem bài giảng chi tiết.'}`
      )
      .join('\n\n');

    // 2. Tài liệu chuyên sâu do tác giả nạp thêm vào
    const authorDocsText =
      aiTraining?.documents && aiTraining.documents.length > 0
        ? '\n\nCÁC TÀI LIỆU & SÁCH CHUYÊN SÂU TÁC GIẢ NẠP THÊM:\n' +
          aiTraining.documents
            .map((d, i) => `=== [Tài liệu ${i + 1}: ${d.title}] ===\n${d.content}`)
            .join('\n\n')
        : '';

    // 3. Câu hỏi và trả lời mẫu do tác giả định sẵn
    const authorFaqsText =
      aiTraining?.faqs && aiTraining.faqs.length > 0
        ? '\n\nCÁC CÂU HỎI & TRẢ LỜI MẪU CỦA TÁC GIẢ:\n' +
          aiTraining.faqs.map((f) => `Q: "${f.question}" -> A: "${f.answer}"`).join('\n')
        : '';

    // 4. Lời dặn và nguyên tắc cốt lõi
    const authorGuidelines =
      aiTraining?.guidelines ||
      '1. Tác giả KHÔNG PHẢI LÀ BÁC SĨ. Tác giả là Tùng dinh dưỡng, chia sẻ kiến thức nền tảng giúp mọi người hiểu cơ thể.\n2. CẤM TUYỆT ĐỐI: Không khám bệnh, không chẩn đoán bệnh, không chữa bệnh, không điều trị bệnh, không kê đơn thuốc.\n3. Đây là Trợ lý Sức Khỏe chia sẻ kiến thức giáo dục về cấu trúc cơ thể, thói quen sinh hoạt đúng và phục hồi tự nhiên.\n4. Luôn trả lời ngắn gọn (1-2 câu), đi thẳng vào kết luận theo tài liệu tác giả và hướng dẫn người học xem các bài học cụ thể trong ứng dụng.';

    const prompt = `Bạn là Trợ lý Sức Khỏe AI đồng hành, hướng dẫn người học DỰA TRÊN CHÍNH TÀI LIỆU VÀ BÀI GIẢNG CỦA TÁC GIẢ (Tùng dinh dưỡng) trong ứng dụng "Học Cơ Thể".

ĐẶC BIỆT LƯU Ý & CẤM TUYỆT ĐỐI LIÊN QUAN ĐẾN CHỮA BỆNH:
1. BẠN LÀ TRỢ LÝ SỨC KHỎE, TUYỆT ĐỐI KHÔNG PHẢI TRỢ LÝ Y KHOA.
2. TÁC GIẢ KHÔNG PHẢI LÀ BÁC SĨ: Tác giả là Tùng dinh dưỡng, chỉ chia sẻ kiến thức nền tảng giúp người học hiểu về cơ thể và chủ động chăm sóc sức khỏe.
3. CẤM TUYỆT ĐỐI: KHÔNG KHÁM BỆNH, KHÔNG CHẨN ĐOÁN BỆNH, KHÔNG CHỮA BỆNH, KHÔNG ĐIỀU TRỊ BỆNH, KHÔNG KÊ ĐƠN THUỐC hay đưa ra chỉ định can thiệp y tế.
4. Chỉ chia sẻ kiến thức giáo dục về cấu trúc cơ thể, cơ chế sinh học, thói quen sinh hoạt đúng và vận động khoa học theo tài liệu của tác giả.
5. Nếu người học hỏi về dấu hiệu đau nhức bệnh lý bất thường hoặc nghi ngờ bệnh, luôn nhắc nhở họ đi khám tại các cơ sở y tế / bác sĩ chuyên khoa để được thăm khám chính xác.

NGUYÊN TẮC VÀ LỜI DẶN CỐT LÕI CỦA TÁC GIẢ:
${authorGuidelines}

TOÀN BỘ TÀI LIỆU & NỘI DUNG TÁC GIẢ HƯỚNG DẪN TRONG HỆ THỐNG:
${catalogText}
${authorDocsText}
${authorFaqsText}

CÂU HỎI CỦA NGƯỜI HỌC: "${question}"

LỊCH SỬ HỘI THOẠI TRƯỚC:
${history.slice(-2).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}

QUY TẮC BẮT BUỘC:
1. CHỈ TRẢ LỜI DỰA VÀO TÀI LIỆU VÀ BÀI HỌC CỦA TÁC GIẢ Ở TRÊN. Không tự bịa đặt hoặc nói lý thuyết lan man bên ngoài.
2. TUYỆT ĐỐI KHÔNG KHÁM CHỮA BỆNH, KHÔNG DÙNG TỪ NGỮ Y KHOA ĐIỀU TRỊ.
3. NÓI THẬT NGẮN GỌN (CHỈ TỪ 1 ĐẾN 2 CÂU NGẮN, TỐI ĐA 40 - 50 TỪ)! Nêu thẳng vào kết luận cốt lõi theo hướng dẫn của tác giả, không dài dòng.
4. CHỌN 1 ĐẾN 2 BÀI HỌC CHÍNH XÁC trong tài liệu trên để người học mở ra xem chi tiết.

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

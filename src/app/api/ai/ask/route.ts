import { NextRequest, NextResponse } from 'next/server';
import { getTopics, getPagesByTopic, getBlocksByPage, getSettings } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

import { searchFastKnowledge } from '../../../../lib/knowledge';

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

let cachedCatalog: LessonCatalogItem[] | null = null;
let cachedCatalogExpiry = 0;

async function getOrBuildLessonCatalog(): Promise<LessonCatalogItem[]> {
  if (cachedCatalog && cachedCatalog.length > 0 && cachedCatalogExpiry > Date.now()) {
    return cachedCatalog;
  }
  const catalog = await buildLessonCatalog();
  if (catalog.length > 0) {
    cachedCatalog = catalog;
    cachedCatalogExpiry = Date.now() + 15 * 60 * 1000; // Lưu cache trong bộ nhớ 15 phút
  }
  return catalog;
}

// Fallback thông minh dựa trên tri thức chuyên sâu từ 20 file Markdown của tác giả
function fallbackSearch(query: string, catalog: LessonCatalogItem[]) {
  const lower = query.toLowerCase();
  const matchedDocs = searchFastKnowledge(query, 2);

  const matched = catalog.filter((item) => {
    return (
      item.page_title.toLowerCase().includes(lower) ||
      item.topic_title.toLowerCase().includes(lower) ||
      item.summary.toLowerCase().includes(lower) ||
      item.content.toLowerCase().includes(lower)
    );
  });

  const selected = (matched.length > 0 ? matched : catalog).slice(0, 2);

  if (matchedDocs.length > 0) {
    const doc = matchedDocs[0];
    const docExcerpt = doc.excerpt.replace(/\n+/g, ' ').slice(0, 280);

    const answer = `Theo tài liệu "${doc.fileTitle}" của tác giả Tùng Dinh Dưỡng, vấn đề này cần được tiếp cận toàn diện theo 3 trụ cột phục hồi tự nhiên:\n\n` +
      `1. **Cơ chế & Giải áp:** ${docExcerpt}...\n` +
      `2. **Vận động sinh cơ học:** Giữ vững đường cong sinh lý tự nhiên, gia cố hệ cơ lõi và tránh áp lực đè nén đột ngột.\n` +
      `3. **Dinh dưỡng tế bào:** Cung cấp đủ nước và dưỡng chất để nuôi dưỡng cấu trúc cơ thể qua cơ chế thẩm thấu tự nhiên.\n\n` +
      `*Lưu ý: Nếu có triệu chứng đau lan chi hoặc tê yếu, cần thăm khám y tế chuyên khoa. Mời bạn mở bài học chi tiết dưới đây:*`;

    return {
      answer,
      suggested_pages: selected.map((s) => ({
        title: s.page_title,
        topic_title: s.topic_title,
        topic_slug: s.topic_slug,
        page_slug: s.page_slug,
        reason: `Hướng dẫn chuyên sâu theo tài liệu "${doc.fileTitle}".`,
      })),
      follow_up_questions: [
        'Tư thế sinh hoạt đúng cần chú ý những gì?',
        'Lộ trình chăm sóc và phục hồi tự nhiên như thế nào?',
      ],
    };
  }

  return {
    answer: `Theo tài liệu hướng dẫn của tác giả Tùng Dinh Dưỡng, sức khỏe cơ thể và hệ cơ xương khớp bắt đầu từ việc khôi phục độ cong sinh lý tự nhiên, vận động đúng cơ chế sinh học và nuôi dưỡng tế bào qua đường thẩm thấu.\n\nMời bạn mở bài học chi tiết dưới đây để xem video và hướng dẫn thực hành của tác giả:`,
    suggested_pages: selected.map((s) => ({
      title: s.page_title,
      topic_title: s.topic_title,
      topic_slug: s.topic_slug,
      page_slug: s.page_slug,
      reason: 'Xem chi tiết hướng dẫn của tác giả trong bài học này.',
    })),
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Cách phân biệt đau mỏi thông thường và sai lệch trục?',
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
      getOrBuildLessonCatalog(),
      getSettings(),
    ]);

    const aiTraining = settings?.ai_training;
    const lowerQ = question.toLowerCase();

    // KIỂM TRA PHẢN HỒI SIÊU TỐC TỪ CÂU HỎI MẪU FAQ CỦA TÁC GIẢ (< 5ms)
    if (Array.isArray(aiTraining?.faqs) && aiTraining.faqs.length > 0) {
      const matchedFaq = aiTraining.faqs.find((f) => {
        const fq = f.question.toLowerCase();
        return fq === lowerQ || lowerQ.includes(fq) || fq.includes(lowerQ);
      });

      if (matchedFaq && matchedFaq.answer) {
        // Tìm 1-2 bài học liên quan nhất từ catalog đã nạp sẵn trong bộ nhớ
        const relatedPages = catalog
          .filter((c) => {
            const text = `${c.page_title} ${c.topic_title} ${c.summary}`.toLowerCase();
            const words = matchedFaq.question.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
            return words.some((w) => text.includes(w));
          })
          .slice(0, 2);

        return NextResponse.json({
          answer: matchedFaq.answer,
          suggested_pages: (relatedPages.length > 0 ? relatedPages : catalog.slice(0, 2)).map((s) => ({
            title: s.page_title,
            topic_title: s.topic_title,
            topic_slug: s.topic_slug,
            page_slug: s.page_slug,
            reason: 'Tài liệu hướng dẫn trực tiếp từ chuyên gia.',
          })),
          follow_up_questions: [
            'Lộ trình chăm sóc cụ thể như thế nào?',
            'Có lưu ý gì trong sinh hoạt hàng ngày không?',
          ],
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackResult = fallbackSearch(question, catalog);
      return NextResponse.json(fallbackResult);
    }

    // 1. Lọc thông minh 3-4 bài học liên quan nhất từ catalog (giảm 80% độ trễ suy nghĩ của AI)
    const lowerTokens = lowerQ.split(/[\s,?.!;:()\[\]{}"]+/).filter((w: string) => w.length >= 2);
    const scoredCatalog = catalog.map((c) => {
      let score = 0;
      const text = `${c.page_title} ${c.topic_title} ${c.summary} ${c.content}`.toLowerCase();
      lowerTokens.forEach((t: string) => {
        if (text.includes(t)) score += 1;
      });
      return { c, score };
    });
    scoredCatalog.sort((a, b) => b.score - a.score);
    const topCatalog = scoredCatalog[0]?.score > 0 ? scoredCatalog.slice(0, 4).map((sc: { c: LessonCatalogItem }) => sc.c) : catalog.slice(0, 3);

    const catalogText = topCatalog
      .map(
        (c, idx) =>
          `[Bài ${idx + 1}] Chủ đề: "${c.topic_title}" | Bài: "${c.page_title}" (slug: ${c.topic_slug}/${c.page_slug})\n- Tóm tắt: ${c.summary}\n- Nội dung tác giả hướng dẫn: ${c.content || 'Xem bài giảng chi tiết.'}`
      )
      .join('\n\n');

    // 2. Tra cứu siêu tốc từ các file Markdown chuyên sâu nguyên văn của tác giả
    const matchedDocs = searchFastKnowledge(question, 2);
    const authorDocsText = matchedDocs.length > 0
      ? '\n\nCÁC TÀI LIỆU CHUYÊN SÂU NGUYÊN VĂN CỦA TÁC GIẢ:\n' +
        matchedDocs.map((m, i) => `=== [Tài liệu ${i + 1}: ${m.fileTitle} (${m.sourceFile})] ===\n${m.excerpt}`).join('\n\n')
      : (aiTraining?.documents && aiTraining.documents.length > 0
          ? '\n\nCÁC TÀI LIỆU & SÁCH CHUYÊN SÂU TÁC GIẢ NẠP THÊM:\n' +
            aiTraining.documents.map((d, i) => `=== [Tài liệu ${i + 1}: ${d.title}] ===\n${d.content}`).join('\n\n')
          : '');

    // 3. Câu hỏi và trả lời mẫu do tác giả định sẵn
    const authorFaqsText =
      aiTraining?.faqs && aiTraining.faqs.length > 0
        ? '\n\nCÁC CÂU HỎI & TRẢ LỜI MẪU CỦA TÁC GIẢ:\n' +
          aiTraining.faqs.map((f) => `Q: "${f.question}" -> A: "${f.answer}"`).join('\n')
        : '';

    // 4. Lời dặn và nguyên tắc cốt lõi
    const authorGuidelines =
      aiTraining?.guidelines ||
      '1. VAI TRÒ CHUYÊN MÔN: Trợ lý Sức Khỏe AI chia sẻ kiến thức giáo dục về cấu trúc cơ thể, cơ chế sinh học, thói quen sinh hoạt đúng và phục hồi tự nhiên theo tài liệu của tác giả Tùng dinh dưỡng.\n2. NGUYÊN TẮC AN TOÀN Y KHOA: Cung cấp thông tin tham khảo khoa học, không đưa ra chẩn đoán hay điều trị y khoa thay thế bác sĩ chuyên khoa.\n3. PHONG CÁCH TRẢ LỜI: Trả lời thông minh, thấu đáo, chuẩn y lý theo Bộ quy chuẩn 3 Tầng Vàng (120-160 từ), chia nhánh rõ ràng, có luận điểm khoa học và giải pháp thực tế.\n4. TUYỆT ĐỐI CẤM: Tuyệt đối không nhắc đến các cụm từ như "tác giả không phải bác sĩ", "Tùng không phải bác sĩ" hay giải thích danh xưng.';

    const prompt = `Bạn là Trợ lý Sức Khỏe AI đồng hành, hướng dẫn người học DỰA TRÊN CHÍNH TÀI LIỆU VÀ BÀI GIẢNG CỦA TÁC GIẢ (Tùng dinh dưỡng) trong ứng dụng "Học Cơ Thể".

NGUYÊN TẮC VÀ LỜI DẶN CỐT LÕI CỦA TÁC GIẢ:
${authorGuidelines}

BỘ QUY CHUẨN TRẢ LỜI 3 TẦNG VÀNG (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
Mỗi câu trả lời chuyên môn phải có độ dài chuẩn mực từ 120 đến 160 từ, diễn giải thông minh, chuẩn y lý, chia thành 3 phần rõ ràng:
1. TẦNG 1: CƠ CHẾ & BẢN CHẤT CỐT LÕI (30-40 từ):
   - Giải thích bản chất vì sao cơ thể bị đau/tổn thương (ví dụ: mất độ cong sinh lý tự nhiên, áp lực cơ học đè nén, nhân nhầy chèn ép, thiếu thẩm thấu dinh dưỡng).
2. TẦNG 2: 3 TRỤ CỘT HÀNH ĐỘNG THỰC TẾ (70-90 từ - trình bày bằng gạch đầu dòng hoặc đánh số 1, 2, 3 rõ ràng):
   - Trụ cột 1 (Cơ học & Tư thế): Khôi phục và nâng đỡ độ cong sinh lý tự nhiên khi ngồi và ngủ (giải pháp DoctorLoan, giữ lưng thẳng, tránh cúi gập vặn xoắn).
   - Trụ cột 2 (Vận động sinh cơ học): Kích hoạt và gia cố hệ cơ lõi (vùng bụng, lưng) để nâng đỡ tải trọng thay cho cột sống; tránh bất động quá lâu gây xơ cứng.
   - Trụ cột 3 (Dinh dưỡng tế bào): Uống đủ nước theo công thức (0.04 x trọng lượng), bổ sung chất nền sụn khớp và chất chống oxy hóa để nuôi dưỡng đĩa đệm qua cơ chế thẩm thấu.
3. TẦNG 3: CỜ ĐỎ AN TOÀN & ĐIỀU HƯỚNG BÀI HỌC (20-30 từ):
   - Nhắc nhở: Nếu có dấu hiệu tê yếu chân lan nhanh hoặc rối loạn bài tiết, cần thăm khám y tế chuyên khoa ngay.
   - Gợi ý người học mở bài học chi tiết bên dưới để xem video và hình ảnh giải phẫu trực quan.

ĐẶC BIỆT LƯU Ý & CÁC QUY TẮC AN TOÀN:
- TUYỆT ĐỐI CẤM: CẤM TUYỆT ĐỐI NÓI CÁC CÂU NHƯ "Tác giả không phải là bác sĩ", "Tùng không phải bác sĩ", "tôi không phải bác sĩ" hay bất kỳ câu trần tình, giải thích danh xưng nào.
- VAI TRÒ: Chia sẻ kiến thức giáo dục về cấu trúc cơ thể, cơ chế sinh học, thói quen sinh hoạt đúng và vận động khoa học theo tài liệu của tác giả. Không kê đơn thuốc, không cam kết "chữa khỏi dứt điểm", dùng thuật ngữ "phục hồi tự nhiên", "hỗ trợ điều chỉnh độ cong sinh lý", "nuôi dưỡng tái tạo".
- ĐIỀU HƯỚNG: CHỌN 1 ĐẾN 2 BÀI HỌC CHÍNH XÁC NHẤT trong danh mục bài học dưới đây để người học mở ra xem chi tiết.

TOÀN BỘ TÀI LIỆU & NỘI DUNG TÁC GIẢ HƯỚNG DẪN TRONG HỆ THỐNG:
${catalogText}
${authorDocsText}
${authorFaqsText}

CÂU HỎI CỦA NGƯỜI HỌC: "${question}"

LỊCH SỬ HỘI THOẠI TRƯỚC:
${history.slice(-2).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON (không kèm văn bản nào khác):
{
  "answer": "Câu trả lời theo đúng chuẩn 3 Tầng Vàng (120-160 từ, chia dòng thông thoáng, đánh số 1-2-3)...",
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
    "Câu hỏi gợi ý mở rộng 1?",
    "Câu hỏi gợi ý mở rộng 2?"
  ]
}
`;

    const candidateModels = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
    ];
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
      // Làm sạch triệt để mọi tàn dư nếu model vô tình sinh ra cụm từ "không phải bác sĩ"
      let cleanAnswer = String(parsedJson.answer)
        .replace(/(?:tác giả\s+)?(?:tùng\s+)?(?:dinh dưỡng\s+)?(?:không phải|chưa phải)(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
        .replace(/tôi không phải(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
        .replace(/\bkhông phải bác sĩ\b/gi, '')
        .replace(/y\s+khoa\s+chữa\s+bệnh/gi, 'y khoa chuyên sâu')
        .replace(/khám\s+chữa\s+bệnh/gi, 'thăm khám y tế')
        .replace(/chữa\s+dứt\s+điểm/gi, 'phục hồi tự nhiên')
        .replace(/chữa\s+bệnh/gi, 'chăm sóc sức khỏe')
        .replace(/chữa\s+trị/gi, 'chăm sóc')
        .replace(/điều\s+trị/gi, 'phục hồi')
        .replace(/nắn\s+chỉnh\s+cột\s+sống/gi, 'hỗ trợ điều chỉnh độ cong sinh lý cột sống')
        .replace(/nắn\s+chỉnh/gi, 'hỗ trợ điều chỉnh tư thế')
        .replace(/uốn\s+nắn/gi, 'hỗ trợ điều chỉnh')
        .trim();
      if (cleanAnswer.length > 0) {
        cleanAnswer = cleanAnswer.charAt(0).toUpperCase() + cleanAnswer.slice(1);
      }

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
        answer: cleanAnswer || parsedJson.answer,
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

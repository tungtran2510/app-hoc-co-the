import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeId, fetchYouTubeMeta } from '../../../../lib/youtube';
import { rateLimit, getClientIp } from '../../../../lib/authServer';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

interface GeneratedLessonData {
  title: string;
  summary: string;
  youtubeId: string;
  thumbnailUrl: string;
  blocks: {
    type: 'text';
    display_style: 'y_nghia' | 'diem_can_nho' | 'sai_lam' | 'giai_phap';
    title: string;
    lines: string[];
    format: 'paragraph' | 'numbered' | 'bullet';
  }[];
}

// Hàm dự phòng mẫu chuẩn y khoa nếu không có API key hoặc mạng chập chờn
function generateFallbackLesson(title: string, youtubeId: string, thumb: string): GeneratedLessonData {
  return {
    title,
    youtubeId,
    thumbnailUrl: thumb,
    summary: `Bài giảng cung cấp kiến thức nền tảng và hướng dẫn thực hành khoa học về ${title}, giúp bảo vệ cấu trúc giải phẫu và nâng cao sức khỏe tự nhiên.`,
    blocks: [
      {
        type: 'text',
        display_style: 'y_nghia',
        title: 'Ý Nghĩa Y Khoa & Chức Năng Giải Phẫu',
        format: 'paragraph',
        lines: [
          `Hiểu rõ bản chất giải phẫu học của ${title} là chìa khóa để chăm sóc và phòng ngừa các tổn thương cấu trúc mạn tính.`,
          'Khi áp dụng đúng các nguyên lý sinh học tự nhiên, cơ thể sẽ kích hoạt cơ chế tự cân bằng và phục hồi mô bị tổn thương.'
        ]
      },
      {
        type: 'text',
        display_style: 'diem_can_nho',
        title: 'Điểm Cốt Lõi Cần Nhớ',
        format: 'numbered',
        lines: [
          'Luôn duy trì tư thế trục cột sống sinh lý tự nhiên trong mọi hoạt động sinh hoạt và vận động.',
          'Lắng nghe tín hiệu cảnh báo đau từ các dây thần kinh và mô cơ để điều chỉnh kịp thời.',
          'Kết hợp dinh dưỡng đầy đủ chất nền tảng (nước, khoáng chất, đạm) để tế bào được nuôi dưỡng liên tục.'
        ]
      },
      {
        type: 'text',
        display_style: 'sai_lam',
        title: 'Sai Lầm Phổ Biến Cần Tránh',
        format: 'bullet',
        lines: [
          'Chủ quan với các cơn đau mỏi âm ỉ kéo dài và chỉ can thiệp khi đã có biến chứng nặng.',
          'Thực hiện các động tác vặn, bẻ hoặc mang vác vật nặng sai tư thế đột ngột gây áp lực quá tải lên khớp.',
          'Lạm dụng thuốc giảm đau tạm thời mà bỏ qua việc phục hồi nguồn gốc cơ chế giải phẫu bên trong.'
        ]
      },
      {
        type: 'text',
        display_style: 'giai_phap',
        title: 'Giải Pháp & Lộ Trình Ứng Dụng Hàng Ngày',
        format: 'bullet',
        lines: [
          'Thực hiện bài tập kéo giãn và giải nén nhẹ nhàng 10-15 phút mỗi ngày theo đúng biên độ sinh lý.',
          'Bổ sung đủ nước và điện giải để duy trì độ đàn hồi của các mô liên kết và đĩa đệm.',
          'Tạo lập thói quen làm việc có quãng nghỉ: đứng dậy vận động nhẹ sau mỗi 45-60 phút ngồi một chỗ.'
        ]
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    // Giới hạn 20 request / 5 phút cho mỗi IP để tránh spam AI
    if (!rateLimit(`ai-transcribe:${getClientIp(req)}`, 20, 5 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Bạn thao tác quá nhanh, vui lòng thử lại sau 1 phút' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { url, topicTitle = 'Cơ thể người', pageTitle = '' } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Vui lòng cung cấp link video YouTube hợp lệ' }, { status: 400 });
    }

    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) {
      return NextResponse.json({ error: 'Không tìm thấy ID video YouTube từ link đã nhập' }, { status: 400 });
    }

    // 1. Lấy metadata chính thức từ YouTube oEmbed
    const meta = await fetchYouTubeMeta(youtubeId);
    const videoTitle = pageTitle.trim() || meta.title || 'Bài giảng giải phẫu & cơ thể';

    const geminiKey = process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    if (!geminiKey && !deepseekKey) {
      // Dùng fallback thông minh
      return NextResponse.json({
        success: true,
        source: 'fallback_template',
        data: generateFallbackLesson(videoTitle, youtubeId, meta.thumbnail_url)
      });
    }

    // 2. Soạn prompt chuyên môn y khoa - dinh dưỡng chuẩn E-E-A-T
    const systemPrompt = `Bạn là Chuyên gia Y sinh học & Giải phẫu Cơ thể cao cấp (Cố vấn chuyên môn cho Tủ sách Sống Khỏe Mỗi Ngày của Thầy Tùng Dinh Dưỡng).
Nhiệm vụ của bạn là phân tích tiêu đề và chủ đề bài giảng y khoa YouTube dưới đây để soạn thảo ra nội dung bài học có tính thực chứng cao, chuẩn xác giải phẫu tiếng Việt, ngắn gọn, dễ hiểu và cực kỳ thực dụng.

THÔNG TIN BÀI HỌC:
- Tiêu đề video: "${videoTitle}"
- Chủ đề lớn: "${topicTitle}"

YÊU CẦU ĐẦU RA JSON BẮT BUỘC (Chỉ trả về định dạng JSON thuần túy, không dùng thẻ code markdown):
{
  "summary": "Tóm tắt bài học trong 2 câu súc tích, nêu bật cơ chế sinh lý và thông điệp hành động.",
  "blocks": [
    {
      "display_style": "y_nghia",
      "title": "Ý Nghĩa Y Khoa & Chức Năng Giải Phẫu",
      "format": "paragraph",
      "lines": [
        "Đoạn 1 phân tích cơ chế giải phẫu, chức năng sinh học của cơ quan/vấn đề đang bàn.",
        "Đoạn 2 nêu rõ tại sao việc hiểu đúng cơ chế này lại quyết định sức khỏe lâu dài."
      ]
    },
    {
      "display_style": "diem_can_nho",
      "title": "Điểm Cốt Lõi Cần Nhớ",
      "format": "numbered",
      "lines": [
        "Nguyên tắc cốt lõi 1 (khoa học, ngắn gọn).",
        "Nguyên tắc cốt lõi 2.",
        "Nguyên tắc cốt lõi 3.",
        "Nguyên tắc cốt lõi 4."
      ]
    },
    {
      "display_style": "sai_lam",
      "title": "Sai Lầm Phổ Biến Cần Tránh",
      "format": "bullet",
      "lines": [
        "Sai lầm thường gặp trong thói quen hoặc tư thế.",
        "Hiểu lầm tai hại trong ăn uống hoặc điều trị.",
        "Dấu hiệu cảnh báo sớm mà người bệnh thường bỏ qua."
      ]
    },
    {
      "display_style": "giai_phap",
      "title": "Giải Pháp & Hướng Dẫn Thực Hành",
      "format": "bullet",
      "lines": [
        "Hành động tập luyện/vận động cụ thể hàng ngày.",
        "Nguyên tắc dinh dưỡng/lối sống phục hồi cơ thể.",
        "Lời khuyên duy trì kỷ luật bản thân."
      ]
    }
  ]
}`;

    // Gọi Gemini API
    if (geminiKey) {
      const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
      for (const model of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 2048,
                  responseMimeType: 'application/json'
                }
              }),
              signal: AbortSignal.timeout(18000)
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const parsed = JSON.parse(text);
              if (parsed.summary && Array.isArray(parsed.blocks)) {
                return NextResponse.json({
                  success: true,
                  source: `gemini_${model}`,
                  data: {
                    title: videoTitle,
                    youtubeId,
                    thumbnailUrl: meta.thumbnail_url,
                    summary: parsed.summary,
                    blocks: parsed.blocks.map((b: any) => ({
                      type: 'text',
                      display_style: b.display_style,
                      title: b.title,
                      format: b.format || 'paragraph',
                      lines: b.lines || []
                    }))
                  }
                });
              }
            }
          }
        } catch {
          // Thử model tiếp theo
        }
      }
    }

    // Fallback nếu Gemini bận
    return NextResponse.json({
      success: true,
      source: 'fallback_template',
      data: generateFallbackLesson(videoTitle, youtubeId, meta.thumbnail_url)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý AI soạn bài' }, { status: 500 });
  }
}

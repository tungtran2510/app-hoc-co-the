import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '../../../../lib/data';
import { sampleTopics, samplePages } from '../../../../data/sample';
import { getSupabaseClient } from '../../../../lib/supabaseClient';
import { searchFastKnowledge } from '../../../../lib/knowledge';

export const dynamic = 'force-dynamic';


interface LessonCatalogItem {
  topic_title: string;
  topic_slug: string;
  page_title: string;
  page_slug: string;
  summary: string;
  content: string;
}

let cachedCatalog: LessonCatalogItem[] | null = null;
let cachedCatalogExpiry = 0;

// Chuẩn hóa văn bản tiếng Việt để tìm kiếm từ khóa chính xác tuyệt đối
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// BỘ CÂU HỎI & TRẢ LỜI CHUẨN XÁC, NGẮN GỌN, ĐÚNG TRỌNG TÂM (PHẢN HỒI TỨC THÌ < 5ms)
const CURATED_QA = [
  {
    keywords: [
      'thoat vi dia dem l4 can lam gi',
      'thoat vi dia dem l4',
      'thoat vi dia dem l5',
      'thoat vi dia dem that lung',
      'thoat vi dia dem',
      'thoat vi',
      'bi thoat vi dia dem',
      'thoat vi dia dem can lam gi',
      'thoat vi dia dem phai lam sao',
    ],
    answer:
`Đối với tình trạng thoát vị đĩa đệm (đặc biệt vùng thắt lưng L4-L5), bạn cần chú ý các nguyên tắc chăm sóc và bảo vệ sau:

• Giữ thẳng trục thắt lưng: Tuyệt đối tránh cúi gập cong lưng hoặc vặn xoắn đột ngột; khi cúi nhặt vật luôn gập gối, hạ thấp trọng tâm và dùng lực từ đùi.
• Giảm tải áp lực đĩa đệm: Nằm nghỉ ngơi trên đệm phẳng vừa phải, hai chân co nhẹ tự nhiên để giải phóng lực căng thắt lưng.
• Tránh ngồi tĩnh tại quá lâu: Không ngồi liên tục quá 30 - 45 phút; nên đứng dậy đi lại nhẹ nhàng để tăng tuần hoàn và nuôi dưỡng đĩa đệm qua cơ chế thẩm thấu.
• Vận động an toàn: Thực hiện các bài tập kéo giãn cơ dựng sống nhẹ nhàng; tránh tập các động tác gập bụng truyền thống (sit-ups) gây chèn ép nhân nhầy ra sau.
• Cảnh báo y tế cần khám ngay: Nếu xuất hiện cảm giác đau nhói buốt lan nhanh xuống chân, tê mất cảm giác bàn chân hoặc rối loạn đại tiểu tiện.`,
    suggested_pages: [
      {
        title: 'Đĩa đệm và cơ chế giảm xóc',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'dia-dem',
        reason: 'Hiểu rõ cấu trúc nhân nhầy và cơ chế thẩm thấu nuôi dưỡng đĩa đệm.',
      },
      {
        title: 'Tư thế chuẩn & Vận động giải áp',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tu-the-va-van-dong',
        reason: 'Hướng dẫn các tư thế công thái học và bài tập giải nén an toàn.',
      },
      {
        title: 'Các vấn đề thường gặp và cách phòng tránh',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'cac-van-de-thuong-gap',
        reason: 'Nhận diện các hội chứng đau cơ xương khớp và cách phòng ngừa thoái hóa.',
      },
    ],
    follow_up_questions: [
      'Thời điểm nào nên đi bộ nhẹ nhàng để phục hồi đĩa đệm?',
      'Cách cúi nhấc vật nặng an toàn không đau lưng?',
    ],
  },
  {
    keywords: [
      'tu the sinh hoat dung can chu y gi',
      'tu the sinh hoat dung',
      'tu the dung can chu y gi',
      'tu the dung',
      'tu the ngoi',
      'tu the ngu',
      'tu the cuoi',
      'tu the be do',
      'tu the vac do',
      'tu the sinh hoat',
      'chu y tu the',
    ],
    answer:
`Để bảo vệ cột sống và đĩa đệm, bạn cần chú ý các tư thế sinh hoạt cốt lõi sau:

• Khi ngồi làm việc: Giữ lưng thẳng, vai thả lỏng, màn hình ngang tầm mắt; hai chân đặt phẳng trên sàn, không ngồi bắt chéo chân hoặc gù lưng.
• Khi cúi nhấc vật nặng: Luôn gập gối, hạ thấp hông, giữ lưng thẳng và dùng lực cơ đùi để nâng lên (tuyệt đối không cúi gập cong lưng).
• Khi đứng và đi lại: Giữ trục thẳng tự nhiên, phân bổ đều trọng lượng lên hai chân, tránh dồn lực lệch một bên.
• Khi nằm ngủ: Nằm thẳng trục trên đệm phẳng có độ đàn hồi tốt; tránh nằm võng hoặc đệm lún sâu làm cong gập cột sống.
• Nhịp nghỉ ngơi: Cứ sau 45 - 60 phút, hãy đứng dậy vươn vai và đi lại nhẹ nhàng 1 - 2 phút để giải nén đĩa đệm.`,
    suggested_pages: [
      {
        title: 'Tư thế chuẩn & Vận động giải áp',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tu-the-va-van-dong',
        reason: 'Hướng dẫn chi tiết tư thế công thái học và bài tập giải nén.',
      },
      {
        title: 'Đĩa đệm và cơ chế giảm xóc',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'dia-dem',
        reason: 'Hiểu cơ chế thẩm thấu dinh dưỡng và giảm tải áp lực đĩa đệm.',
      },
    ],
    follow_up_questions: [
      'Cách nâng vật nặng đúng để không đau lưng?',
      'Bài tập kéo giãn giải áp cột sống cổ tại chỗ?',
    ],
  },
  {
    keywords: [
      'cach phan biet dau moi thong thuong',
      'phan biet dau moi thong thuong',
      'phan biet dau moi',
      'dau moi thong thuong',
      'dau co hay thoat vi',
      'dau lung thong thuong',
    ],
    answer:
`Bạn có thể phân biệt cơn đau qua các đặc điểm thực tế sau:

• Đau mỏi cơ thông thường: Do căng cơ khi ngồi lâu hoặc làm việc nặng. Đau âm ỉ khu trú tại vùng cơ lưng/cổ, giảm nhanh khi nghỉ ngơi, xoa bóp và không lan xuống tay chân.
• Tổn thương đĩa đệm hoặc chèn ép: Đau buốt nhói, đau tăng rõ rệt khi cúi gập hoặc ho/hắt hơi; kèm cảm giác tê bì, châm chích hoặc yếu cơ lan dọc theo cánh tay hoặc cẳng chân.
• Cần đi khám y tế ngay: Nếu xuất hiện cảm giác tê yếu chi lan nhanh, bàn chân khó nhấc hoặc rối loạn đại tiểu tiện.`,
    suggested_pages: [
      {
        title: 'Các vấn đề thường gặp và cách phòng tránh',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'cac-van-de-thuong-gap',
        reason: 'Nhận diện các hội chứng đau cơ xương khớp và biện pháp phòng ngừa.',
      },
      {
        title: 'Thần kinh và tủy sống',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'than-kinh',
        reason: 'Tìm hiểu đường dẫn truyền thần kinh và cơ chế chèn ép rễ.',
      },
    ],
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Bài tập kéo giãn giải áp cột sống hàng ngày?',
    ],
  },
  {
    keywords: [
      'uong nuoc dung cach',
      'cach uong nuoc',
      'nguyen tac uong nuoc',
      'uong nuoc the nao',
      'uong bao nhieu nuoc',
    ],
    answer:
`Uống nước đúng cách giúp nuôi dưỡng tế bào và duy trì độ đàn hồi cho đĩa đệm:

• Uống từng ngụm nhỏ: Ngồi uống thong thả để nước kịp thẩm thấu vào tế bào, tránh uống ừng ực lượng lớn khi đang đứng.
• Thời điểm vàng: 1 ly nước ấm ngay khi thức dậy để kích hoạt tuần hoàn, 1 ly trước bữa ăn 30 phút, và uống rải rác đều trong ngày.
• Lượng nước chuẩn: Khoảng 0.04 lít trên mỗi kg cân nặng (ví dụ: người 50kg cần khoảng 2 lít nước/ngày), tăng nhẹ khi vận động nhiều mồ hôi.
• Chọn nguồn nước: Ưu tiên nước sạch, giàu khoáng và có tính kiềm tự nhiên để trung hòa axit dư thừa.`,
    suggested_pages: [
      {
        title: 'Nguyên tắc uống nước',
        topic_title: 'Nước',
        topic_slug: 'nuoc',
        page_slug: 'nguyen-tac-uong-nuoc',
        reason: 'Quy tắc 4 đúng khi uống nước cho tế bào.',
      },
      {
        title: 'Vai trò của nước',
        topic_title: 'Nước',
        topic_slug: 'nuoc',
        page_slug: 'vai-tro-cua-nuoc',
        reason: 'Dung môi sinh hóa và cơ chế thẩm thấu nuôi đĩa đệm.',
      },
    ],
    follow_up_questions: [
      'Dấu hiệu nhận biết cơ thể đang thiếu nước?',
      'Nước kiềm và khoáng chất có lợi gì cho xương khớp?',
    ],
  },
  {
    keywords: [
      'dinh duong cho khop',
      'dinh duong cot song',
      'an gi tot cho xuong khop',
      'dinh duong khang viem',
      'an gi do dau lung',
    ],
    answer:
`Dinh dưỡng khoa học giúp giảm viêm âm thầm và nuôi dưỡng sụn khớp từ gốc:

• Thực phẩm kháng viêm: Tăng cường cá béo (cá hồi, cá thu giàu Omega-3), dầu ô liu, quả mọng, nghệ, gừng và các loại rau lá xanh đậm.
• Dưỡng chất xây dựng mô: Bổ sung đủ đạm chất lượng cao, vitamin C, kẽm, canxi và vitamin D3/K2 để tái tạo mô liên kết và xương.
• Cần cắt giảm: Hạn chế đường tinh luyện, đồ ngọt, thực phẩm siêu chế biến, dầu chiên đi chiên lại và nước ngọt có gas.`,
    suggested_pages: [
      {
        title: 'Dinh dưỡng kháng viêm',
        topic_title: 'Dinh Dưỡng',
        topic_slug: 'dinh-duong',
        page_slug: 'dinh-duong-khang-viem',
        reason: 'Thực đơn và nhóm chất giúp kiểm soát phản ứng viêm khớp.',
      },
      {
        title: 'Chất đạm (Protein)',
        topic_title: 'Dinh Dưỡng',
        topic_slug: 'dinh-duong',
        page_slug: 'chat-dam-protein',
        reason: 'Nguyên liệu cấu tạo cơ bắp và hệ thống dây chằng.',
      },
    ],
    follow_up_questions: [
      'Uống nước đúng cách như thế nào?',
      'Tư thế sinh hoạt đúng cần chú ý gì?',
    ],
  },
  {
    keywords: [
      'tong quan ve cot song',
      'cau tao cot song',
      'vai tro cot song',
      'cot song va dia dem',
    ],
    answer:
`Cột sống là trục nâng đỡ và bảo vệ hệ thần kinh trung ương của cơ thể:

• Cấu tạo tổng thể: Gồm 33-34 đốt sống xếp chồng lên nhau, tạo thành 4 đường cong sinh lý tự nhiên (cổ, ngực, thắt lưng, cùng cụt) giúp phân tán lực khi vận động.
• Đĩa đệm giảm xóc: Nằm giữa các đốt sống, đóng vai trò như đệm sinh học giảm chấn động và giúp cơ thể cúi, ngửa, xoay chuyển linh hoạt.
• Cơ chế nuôi dưỡng: Đĩa đệm nhận dinh dưỡng qua cơ chế thẩm thấu khi vận động đúng trục sinh học tự nhiên.`,
    suggested_pages: [
      {
        title: 'Tổng quan về cột sống',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tong-quan-ve-cot-song',
        reason: 'Cấu trúc giải phẫu và 4 đường cong sinh lý.',
      },
      {
        title: 'Đĩa đệm',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'dia-dem',
        reason: 'Cấu tạo nhân nhầy và cơ chế hấp thụ xung lực.',
      },
    ],
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Cách phân biệt đau mỏi thông thường?',
    ],
  },
];

function findCuratedMatch(query: string) {
  const norm = normalizeText(query);
  for (const item of CURATED_QA) {
    for (const kw of item.keywords) {
      const normKw = normalizeText(kw);
      if (norm === normKw || norm.includes(normKw)) {
        return item;
      }
    }
  }
  return null;
}

// Xếp hạng bài học thông minh theo từ khóa chuyên môn (tránh gợi ý sai chủ đề)
function rankCatalogPages(query: string, catalog: LessonCatalogItem[]): LessonCatalogItem[] {
  const normQ = normalizeText(query);
  const tokens = normQ.split(/\s+/).filter((w) => w.length >= 2);

  const scored = catalog.map((c) => {
    let score = 0;
    const text = normalizeText(`${c.page_title} ${c.topic_title} ${c.summary}`);

    // Phân loại chủ đề theo từ khóa câu hỏi
    if (
      (normQ.includes('dia dem') ||
        normQ.includes('thoat vi') ||
        normQ.includes('cot song') ||
        normQ.includes('lung') ||
        normQ.includes('l4') ||
        normQ.includes('l5') ||
        normQ.includes('co') ||
        normQ.includes('gay')) &&
      c.topic_slug === 'cot-song'
    ) {
      score += 15;
    }

    if ((normQ.includes('nuoc') || normQ.includes('uong')) && c.topic_slug === 'nuoc') {
      score += 15;
    }

    if ((normQ.includes('dinh duong') || normQ.includes('an') || normQ.includes('khang viem')) && c.topic_slug === 'dinh-duong') {
      score += 15;
    }

    if ((normQ.includes('da day') || normQ.includes('ruot') || normQ.includes('tieu hoa')) && c.topic_slug === 'tieu-hoa') {
      score += 15;
    }

    tokens.forEach((t) => {
      if (text.includes(t)) score += 2;
    });

    return { c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((s) => s.c);
}

// Xây dựng danh mục bài học siêu tốc (chỉ 2 query song song hoặc fallback 0ms tới sample data)
async function getOrBuildLessonCatalog(): Promise<LessonCatalogItem[]> {
  if (cachedCatalog && cachedCatalog.length > 0 && cachedCatalogExpiry > Date.now()) {
    return cachedCatalog;
  }

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const [{ data: topics }, { data: pages }] = await Promise.all([
        supabase.from('topics').select('id, title, slug').order('sort_order'),
        supabase.from('pages').select('id, title, slug, summary, topic_id').order('sort_order'),
      ]);

      if (topics && pages && pages.length > 0) {
        const topicMap = new Map(topics.map((t) => [t.id, t]));
        const catalog: LessonCatalogItem[] = pages.map((p) => {
          const t = topicMap.get(p.topic_id);
          return {
            topic_title: t?.title || 'Cột Sống & Đĩa Đệm',
            topic_slug: t?.slug || 'cot-song',
            page_title: p.title,
            page_slug: p.slug,
            summary: p.summary || '',
            content: p.summary || '',
          };
        });

        cachedCatalog = catalog;
        cachedCatalogExpiry = Date.now() + 60 * 60 * 1000; // Cache 1 giờ
        return catalog;
      }
    }
  } catch (err) {
    console.warn('[AI Catalog] Fallback to bundled sample data:', err);
  }

  const topicMap = new Map(sampleTopics.map((t) => [t.id, t]));
  const catalog: LessonCatalogItem[] = samplePages.map((p) => {
    const t = topicMap.get(p.topic_id);
    return {
      topic_title: t?.title || 'Cột Sống & Đĩa Đệm',
      topic_slug: t?.slug || 'cot-song',
      page_title: p.title,
      page_slug: p.slug,
      summary: p.summary || '',
      content: p.summary || '',
    };
  });

  cachedCatalog = catalog;
  cachedCatalogExpiry = Date.now() + 60 * 60 * 1000;
  return catalog;
}

// Fallback an toàn khi mạng chập chờn (gọn gàng, đúng trọng tâm, TUYỆT ĐỐI KHÔNG CHÈN DOCTORLOAN HAY BẢN NÓI ĐÀO TẠO)
function fastFallbackSearch(query: string, catalog: LessonCatalogItem[]) {
  const selectedPages = rankCatalogPages(query, catalog);
  const primaryPage = selectedPages[0];

  let answerText = '';
  const lowerQ = query.toLowerCase();

  if (lowerQ.includes('cổ') || lowerQ.includes('vai') || lowerQ.includes('gáy') || lowerQ.includes('ngực')) {
    answerText = `• Giữ thẳng trục cột sống cổ, đặt màn hình làm việc hoặc điện thoại ngang tầm mắt.\n• Thay đổi tư thế mỗi 30 - 45 phút, xoay nhẹ khớp vai và ngửa cổ thư giãn cơ dựng sống.\n• Chườm ấm vùng cổ vai gáy 10 - 15 phút vào buổi tối để tăng tuần hoàn máu.`;
  } else if (lowerQ.includes('lưng') || lowerQ.includes('đĩa đệm') || lowerQ.includes('thoát vị') || lowerQ.includes('tọa')) {
    answerText = `• Giữ thẳng lưng khi ngồi và sinh hoạt, luôn gập gối hạ thấp trọng tâm khi nâng nhặt đồ vật.\n• Nằm ngửa thư giãn trên đệm phẳng có độ đàn hồi tốt, co nhẹ chân để giải tỏa áp lực thắt lưng.\n• Đi lại nhẹ nhàng mỗi 30 phút, tránh ngồi tĩnh tại quá lâu làm tăng áp lực nội đĩa đệm.`;
  } else if (lowerQ.includes('nước') || lowerQ.includes('uống')) {
    answerText = `• Uống từng ngụm nhỏ, rải đều trong suốt cả ngày thay vì uống dồn một lượng lớn.\n• Bổ sung nước ấm vào buổi sáng sau khi thức dậy để kích hoạt nhu động đường tiêu hóa.\n• Khi vận động ra nhiều mồ hôi, nên bù thêm khoáng điện giải tự nhiên.`;
  } else if (lowerQ.includes('ăn') || lowerQ.includes('tiêu hóa') || lowerQ.includes('dạ dày') || lowerQ.includes('đầy bụng')) {
    answerText = `• Ăn chậm, nhai kỹ để giảm gánh nặng co bóp và tiết acid cho dạ dày.\n• Hạn chế đồ ăn quá nhiều dầu mỡ, đồ cay nóng hoặc nằm ngay sau khi ăn no.\n• Duy trì khoảng cách tối thiểu 2 - 3 giờ giữa bữa tối và giờ đi ngủ.`;
  } else {
    answerText = `• Lắng nghe các tín hiệu của cơ thể, duy trì lối sống điều độ và chế độ dinh dưỡng lành mạnh.\n• Duy trì vận động nhịp nhàng mỗi ngày để tăng cường tuần hoàn và trao đổi chất.\n• Xem chi tiết bài học y học trực quan bên dưới để nắm rõ cơ chế và cách ứng dụng.`;
  }

  return {
    answer: `Hướng dẫn chăm sóc sức khỏe chủ động:\n\n${answerText}`,
    suggested_pages: selectedPages.map((s) => ({
      title: s.page_title,
      topic_title: s.topic_title,
      topic_slug: s.topic_slug,
      page_slug: s.page_slug,
      reason: `Tham khảo kiến thức chuẩn trong bài "${s.page_title}".`,
    })),
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Cách phân biệt đau mỏi thông thường?',
    ],
    provider: 'fallback_clean',
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

    const isAskingDoctorLoan = /doctor\s*loan/i.test(question);

    // 1. KIỂM TRA PHẢN HỒI TỨC THÌ TỪ DANH SÁCH CÂU HỎI MẪU CHUẨN XÁC (< 5ms)
    const curated = findCuratedMatch(question);
    if (curated) {
      return NextResponse.json({
        answer: curated.answer,
        suggested_pages: curated.suggested_pages,
        follow_up_questions: curated.follow_up_questions,
        provider: 'curated_instant',
      });
    }

    // Lấy catalog bài học siêu nhanh
    const [catalog, settings] = await Promise.all([
      getOrBuildLessonCatalog(),
      getSettings(),
    ]);

    const aiTraining = settings?.ai_training;
    const lowerQ = question.toLowerCase();

    // 2. KIỂM TRA FAQ DO TÁC GIẢ TỰ CẤU HÌNH TRONG ADMIN (< 5ms)
    if (Array.isArray(aiTraining?.faqs) && aiTraining.faqs.length > 0) {
      const matchedFaq = aiTraining.faqs.find((f) => {
        const fq = f.question.toLowerCase();
        return fq === lowerQ || lowerQ.includes(fq) || fq.includes(lowerQ);
      });

      if (matchedFaq && matchedFaq.answer) {
        // Nếu người dùng KHÔNG hỏi DoctorLoan nhưng FAQ chứa DoctorLoan, bỏ qua để AI sinh nội dung chuẩn
        if (isAskingDoctorLoan || !/doctor\s*loan/i.test(matchedFaq.answer)) {
          const selectedPages = rankCatalogPages(question, catalog);

          return NextResponse.json({
            answer: matchedFaq.answer,
            suggested_pages: selectedPages.map((s) => ({
              title: s.page_title,
              topic_title: s.topic_title,
              topic_slug: s.topic_slug,
              page_slug: s.page_slug,
              reason: 'Tài liệu hướng dẫn trực tiếp từ chuyên gia.',
            })),
            follow_up_questions: [
              'Tư thế sinh hoạt đúng cần chú ý gì?',
              'Có lưu ý gì trong sinh hoạt hàng ngày không?',
            ],
            provider: 'admin_faq',
          });
        }
      }
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!deepseekKey && !geminiKey) {
      return NextResponse.json(fastFallbackSearch(question, catalog));
    }

    // 3. LỌC 2-3 BÀI HỌC LIÊN QUAN NHẤT TỪ CATALOG BẰNG THUẬT TOÁN ĐIỂM CHỦ ĐỀ
    const topCatalog = rankCatalogPages(question, catalog);

    const catalogText = topCatalog
      .map((c, idx) => `[Bài ${idx + 1}] "${c.page_title}" (Chủ đề: ${c.topic_title}, slug: ${c.topic_slug}/${c.page_slug}): ${c.summary}`)
      .join('\n');

    // 4. HỆ THỐNG PROMPT TỐI ƯU: ĐÚNG TRỌNG TÂM, NGẮN GỌN, TUYỆT ĐỐI CẤM BÁN HÀNG DOCTORLOAN
    const systemPrompt = `Bạn là Trợ lý Sức Khỏe AI trong ứng dụng giáo dục y học "Học Cơ Thể" (Tủ Sách Y Khoa Qbiz Books của tác giả Tùng dinh dưỡng).

NGUYÊN TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
1. ĐÚNG TRỌNG TÂM CÂU HỎI (P0):
   - Người học hỏi vấn đề gì, hãy trả lời trực diện, chính xác vào đúng vấn đề đó.
   - Hỏi về thoát vị đĩa đệm (L4, L5, thắt lưng, cổ): Giải thích các nguyên tắc tự bảo vệ cột sống, tư thế nằm nghỉ, tránh cúi vặn xoắn và bài tập giải nén.
   - Hỏi về tư thế: Chỉ giải thích về tư thế sinh hoạt đúng (ngồi, đứng, cúi vác, nằm ngủ).
   - Hỏi về dinh dưỡng: Chỉ nói về dinh dưỡng, thực phẩm, kháng viêm.
   - Hỏi về nước: Chỉ nói về nước và cách uống nước.
   - TUYỆT ĐỐI KHÔNG lan man sang các chủ đề không liên quan.

2. NGẮN GỌN & SÚC TÍCH (P0):
   - Độ dài: 60 đến 90 từ (tối đa 110 từ).
   - Trình bày thông thoáng bằng 3 đến 4 gạch đầu dòng rõ ràng, dễ áp dụng ngay trong đời sống.

3. TUYỆT ĐỐI CẤM (VI PHẠM SẼ BỊ HỦY BỎ):
   - CẤM TUYỆT ĐỐI nhắc đến thương hiệu DoctorLoan, ghế DoctorLoan hay bất kỳ sản phẩm bán hàng nào (trừ khi người dùng đích thân hỏi từ "DoctorLoan").
   - CẤM TUYỆT ĐỐI dùng từ "gối" dưới dạng vật dụng (gối ngủ, kê gối, chọn gối, kẹp gối, gối cao, gối mềm...). Tác giả Tùng Dinh Dưỡng KHÔNG có tài liệu và KHÔNG tư vấn về gối. Khi nói về tư thế nằm/ngủ, CHỈ hướng dẫn nằm trên đệm phẳng có độ đàn hồi tốt, co nhẹ chân tự nhiên, giữ thẳng trục đầu - cổ - thắt lưng.
   - CẤM TUYỆT ĐỐI chia kiểu máy móc: "TẦNG 1", "TẦNG 2", "TẦNG 3".
   - CẤM tự ý đưa công thức nước 0.04 hay cảnh báo cấp cứu/bệnh viện vào các câu hỏi sinh hoạt thông thường.
   - CẤM các từ: "chữa bệnh", "khám chữa bệnh", "điều trị dứt điểm", "bác sĩ".
   - CẤM các câu trần tình như "tôi không phải bác sĩ", "tác giả không phải bác sĩ".

4. ĐỊNH HƯỚNG BÀI HỌC:
   - Chọn đúng 1-2 bài học liên quan nhất trong danh mục dưới đây để gợi ý người học mở ra xem:
${catalogText}

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON:
{
  "answer": "Nội dung trả lời ngắn gọn theo 3-4 gạch đầu dòng...",
  "suggested_pages": [
    {
      "title": "Tên bài học chính xác trong danh mục",
      "topic_title": "Tên chủ đề",
      "topic_slug": "slug_chu_de",
      "page_slug": "slug_bai_hoc",
      "reason": "Lý do ngắn gọn 1 câu"
    }
  ],
  "follow_up_questions": [
    "Câu hỏi gợi ý 1?",
    "Câu hỏi gợi ý 2?"
  ]
}`;

    let rawText = '';
    let usedProvider = '';

    // 5. GỌI PRIMARY: DEEPSEEK V3 VỚI TIMEOUT 3500ms
    if (deepseekKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-2).map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.text,
              })),
              { role: 'user', content: question },
            ],
            max_tokens: 800,
            temperature: 0.3,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (deepseekRes.ok) {
          const dsData = await deepseekRes.json();
          const text = dsData.choices?.[0]?.message?.content;
          if (text) {
            rawText = text;
            usedProvider = 'deepseek';
          }
        }
      } catch (err: any) {
        console.warn('[AI] DeepSeek timed out or failed, falling back to Gemini Flash Lite...', err?.message);
      }
    }

    // 6. GỌI SECONDARY (FALLBACK): GOOGLE GEMINI VỚI TIMEOUT 4500ms
    if (!rawText && geminiKey) {
      const candidateModels = [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
      ];

      const geminiPrompt = `${systemPrompt}\n\nCÂU HỎI CỦA NGƯỜI HỌC: "${question}"\n\nLỊCH SỬ:\n${history.slice(-2).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}`;

      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3,
                maxOutputTokens: 800,
              },
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              rawText = text;
              usedProvider = model;
              break;
            }
          }
        } catch {
          // Thử model tiếp theo
        }
      }
    }

    if (!rawText) {
      return NextResponse.json(fastFallbackSearch(question, catalog));
    }

    // 7. BÓC TÁCH JSON VÀ LÀM SẠCH KẾT QUẢ
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

    // Phục hồi dữ liệu nếu JSON bị ngắt quãng giữa chừng
    if (!parsedJson) {
      try {
        const answerMatch = rawText.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)/);
        if (answerMatch && answerMatch[1]) {
          parsedJson = {
            answer: answerMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, ' '),
            suggested_pages: topCatalog.slice(0, 2),
          };
        }
      } catch {
        parsedJson = null;
      }
    }

    if (parsedJson && parsedJson.answer) {
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

      // BẢO VỆ TUYỆT ĐỐI: NẾU NGƯỜI DÙNG KHÔNG HỎI DOCTORLOAN, LOẠI BỎ TRIỆT ĐỂ
      if (!isAskingDoctorLoan) {
        cleanAnswer = cleanAnswer
          .replace(/.*(?:doctor\s*loan|ghế\s+nhựa\s+doctorloan|gối\s+doctorloan).*\n?/gi, '')
          .replace(/\bdoctor\s*loan\b/gi, '')
          .trim();
      }

      // LOẠI BỎ TRIỆT ĐỂ VIỆC TƯ VẤN GỐI KHI NGƯỜI DÙNG KHÔNG HỎI VỀ GỐI
      const isAskingPillows = /gối/i.test(question);
      if (!isAskingPillows) {
        cleanAnswer = cleanAnswer
          .split('\n')
          .map((line) => {
            if (/gối/i.test(line) && !/(?:đầu\s*gối|khớp\s*gối|gập\s*gối|chùng\s*gối)/i.test(line)) {
              let l = line;
              l = l.replace(/kê\s+(?:một\s+)?gối\s+(?:mỏng|mềm|nhẹ)?\s+(?:dưới|ở)\s+cổ/gi, 'giữ cổ thẳng trục tự nhiên');
              l = l.replace(/(?:kê\s+)?đệm\s+phẳng\s+mỏng\s+dưới\s+khoeo\s+chân/gi, 'chân co nhẹ tự nhiên');
              l = l.replace(/(?:kẹp\s+)?gối\s+giữa\s+hai\s+(?:đầu\s+)?gối/gi, 'hai chân co nhẹ song song');
              l = l.replace(/(?:bằng|dùng)\s+gối\s+mềm/gi, '');
              l = l.replace(/không\s+dùng\s+gối\s+cao/gi, 'không nằm gập đầu cổ');
              l = l.replace(/(?:hoặc\s+)?(?:gối|đệm\s+phẳng)\s+(?:kê\s+)?quá\s+cao(?:\s*[\/\-]\s*thấp)?/gi, 'tư thế gập cong cổ');
              l = l.replace(/tránh\s+gối\s+quá\s+cao/gi, 'tránh nằm gập cổ');
              l = l.replace(/gối\s+cao\s+vừa\s+phải/gi, 'độ dốc vừa phải');
              l = l.replace(/ngủ\s+sai\s+gối/gi, 'nằm sai tư thế cổ');
              l = l.replace(/(?<!(?:đầu|khớp|gập|chùng)\s*)gối/gi, '');
              l = l.replace(/(?:,\s*)?(?:không\s+dùng|tránh)\s*(?=\))/gi, '');
              l = l.replace(/\s*\(\s*(?:không\s+dùng|tránh)?\s*\)/gi, '');
              l = l.replace(/\s*\(\s*\)/g, '');
              return l.replace(/\s{2,}/g, ' ').trim();
            }
            return line;
          })
          .filter((l) => l.trim().length > 0)
          .join('\n');
      }

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

      const filteredFollowUps = Array.isArray(parsedJson.follow_up_questions)
        ? parsedJson.follow_up_questions.filter((q: string) => isAskingPillows || !/gối/i.test(q))
        : [];

      return NextResponse.json({
        answer: cleanAnswer || parsedJson.answer,
        suggested_pages: normalizedSuggested,
        follow_up_questions: filteredFollowUps,
        provider: usedProvider || 'ai',
      });
    }

    return NextResponse.json(fastFallbackSearch(question, catalog));
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

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '../../../../lib/authServer';
import { getSettings } from '../../../../lib/data';
import { sampleTopics, samplePages, sampleBlocks } from '../../../../data/sample';
import { getSupabaseClient } from '../../../../lib/supabaseClient';
import { retrieveKnowledge, formatKnowledgeForPrompt, KnowledgeExcerpt } from '../../../../lib/aiKnowledgeRetrieval';
import { getMasterKnowledgeDocs } from '../../../../lib/aiKnowledgeServer';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface VideoItemSummary {
  index: number;
  title: string;
  description?: string;
}

interface LessonCatalogItem {
  topic_title: string;
  topic_slug: string;
  page_title: string;
  page_slug: string;
  summary: string;
  content: string;
  videos?: VideoItemSummary[];
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

// Tìm video chuẩn xác nhất trong bài học tương ứng với câu hỏi của người học
function findBestVideoIndex(
  query: string,
  videos?: VideoItemSummary[]
): { video_index: number; video_title: string } {
  if (!videos || videos.length === 0) {
    return { video_index: 1, video_title: '' };
  }
  const normQ = normalizeText(query);
  const qTokens = normQ.split(' ').filter((w) => w.length >= 2);

  let bestIndex = 1;
  let bestTitle = videos[0].title;
  let bestScore = -1;

  for (const v of videos) {
    let score = 0;
    const vNorm = normalizeText(`${v.title} ${v.description || ''}`);

    // Khớp nguyên cụm từ khóa dài
    if (normQ.length > 3 && vNorm.includes(normQ)) {
      score += 15;
    }

    // Khớp từng từ đơn
    for (const t of qTokens) {
      if (vNorm.includes(t)) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIndex = v.index;
      bestTitle = v.title;
    }
  }

  return { video_index: bestIndex, video_title: bestTitle };
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
`Đối với tình trạng thoát vị đĩa đệm (đặc biệt vùng thắt lưng L4-L5), bạn cần chú ý các nguyên tắc bảo vệ sau:

• Giữ thẳng trục thắt lưng: Tránh các động tác cúi gập cong lưng hoặc vặn xoắn đột ngột; khi nâng nhấc đồ vật luôn giữ lưng thẳng và hạ thấp trọng tâm.
• Duy trì tư thế nằm chuẩn và ngồi chuẩn: Giữ cột sống ở trục sinh lý tự nhiên trong các sinh hoạt hàng ngày để giảm áp lực nội đĩa đệm.
• Tránh tư thế tĩnh tại quá lâu: Không ngồi hoặc đứng liên tục quá 30 - 45 phút; nên đi lại nhẹ nhàng định kỳ để tăng cường tuần hoàn và nuôi dưỡng đĩa đệm.
• Lắng nghe phản hồi của cơ thể: Do thể trạng và mức độ tổn thương của mỗi người là khác nhau, cần vận động nhẹ nhàng vừa sức và tránh các tư thế gây đau tăng.
• Cảnh báo y tế cần khám ngay: Nếu xuất hiện cảm giác đau nhói buốt lan nhanh xuống chân, tê mất cảm giác bàn chân hoặc rối loạn đại tiểu tiện.`,
    suggested_pages: [
      {
        title: '02. Cơ chế hình thành thoát vị đĩa đệm 3D',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'dia-dem',
        video_index: 2,
        video_title: '02. Cơ chế hình thành thoát vị đĩa đệm 3D',
        reason: 'Hiểu rõ cấu trúc nhân nhầy và cơ chế thẩm thấu nuôi dưỡng đĩa đệm.',
      },
      {
        title: '03. Chuỗi bài tập giải nén cột sống cuối ngày (Vinmec)',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tu-the-va-van-dong',
        video_index: 3,
        video_title: '03. Chuỗi bài tập giải nén cột sống cuối ngày (Vinmec)',
        reason: 'Hướng dẫn các nguyên tắc công thái học và bảo vệ cột sống an toàn.',
      },
      {
        title: '02. Thoát vị đĩa đệm nặng: Giải pháp điều trị (BV Tâm Anh)',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'cac-van-de-thuong-gap',
        video_index: 2,
        video_title: '02. Thoát vị đĩa đệm nặng: Giải pháp điều trị (BV Tâm Anh)',
        reason: 'Nhận diện các hội chứng đau cơ xương khớp và cách phòng ngừa thoái hóa.',
      },
    ],
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Chế độ dinh dưỡng nào giúp hỗ trợ sụn khớp?',
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
`Để bảo vệ cột sống và đĩa đệm, bạn cần chú ý các nguyên tắc tư thế chuẩn chung sau:

• Duy trì tư thế ngồi chuẩn, nằm chuẩn: Giữ các đường cong sinh lý tự nhiên của cột sống thẳng trục, tránh gù lưng hoặc vẹo lệch một bên.
• Khi nâng nhấc vật nặng: Luôn giữ lưng thẳng, hạ thấp trọng tâm và dùng lực từ đùi để nâng lên, tuyệt đối không cúi gập cong lưng.
• Tránh tư thế tĩnh tại: Không ngồi hoặc đứng yên một chỗ quá 45 - 60 phút; hãy đứng dậy vươn người nhẹ nhàng để giải tỏa áp lực cho đĩa đệm.
• Lắng nghe cơ thể: Do thể trạng và cơ địa mỗi người khác nhau, không có một tư thế cố định áp dụng cho tất cả; hãy điều chỉnh tư thế sao cho cột sống được nâng đỡ thoải mái và tự nhiên nhất.`,
    suggested_pages: [
      {
        title: '01. Tư thế công thái học cho dân văn phòng (BV Tâm Anh)',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tu-the-va-van-dong',
        video_index: 1,
        video_title: '01. Tư thế công thái học cho dân văn phòng (BV Tâm Anh)',
        reason: 'Hướng dẫn chi tiết nguyên tắc tư thế công thái học bảo vệ cột sống.',
      },
      {
        title: '02. Nguyên tắc bốc vác & vận động an toàn (Vinmec)',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tu-the-va-van-dong',
        video_index: 2,
        video_title: '02. Nguyên tắc bốc vác & vận động an toàn (Vinmec)',
        reason: 'Kỹ thuật bản lề háng Hip Hinge bảo vệ thắt lưng khi nâng đồ nặng.',
      },
    ],
    follow_up_questions: [
      'Dinh dưỡng kháng viêm hỗ trợ sụn khớp như thế nào?',
      'Cách uống nước đúng để nuôi dưỡng đĩa đệm?',
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
        title: '01. Thoái hóa cột sống: Dấu hiệu & Điều trị (BV Tâm Anh)',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'cac-van-de-thuong-gap',
        video_index: 1,
        video_title: '01. Thoái hóa cột sống: Dấu hiệu & Điều trị (BV Tâm Anh)',
        reason: 'Bác sĩ chuyên khoa giải thích tiến trình thoái hóa và đau mỏi cột sống.',
      },
      {
        title: '02. Hội chứng chèn ép rễ thần kinh tọa 3D',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'than-kinh',
        video_index: 2,
        video_title: '02. Hội chứng chèn ép rễ thần kinh tọa 3D',
        reason: 'Đường đi dây thần kinh tọa từ thắt lưng và phân biệt đau rễ thần kinh.',
      },
    ],
    follow_up_questions: [
      'Tư thế sinh hoạt đúng cần chú ý gì?',
      'Dinh dưỡng kháng viêm hỗ trợ sụn khớp như thế nào?',
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
        title: '01. Uống nước đúng cách: Nhấp từng ngụm ở tư thế ngồi',
        topic_title: 'Nước & Điện Giải',
        topic_slug: 'nuoc',
        page_slug: 'nguyen-tac-uong-nuoc',
        video_index: 1,
        video_title: '01. Uống nước đúng cách: Nhấp từng ngụm ở tư thế ngồi',
        reason: 'Quy tắc 4 đúng khi uống nước cho tế bào và đĩa đệm.',
      },
      {
        title: '02. Công thức tính lượng nước chuẩn theo cân nặng',
        topic_title: 'Nước & Điện Giải',
        topic_slug: 'nuoc',
        page_slug: 'nguyen-tac-uong-nuoc',
        video_index: 2,
        video_title: '02. Công thức tính lượng nước chuẩn theo cân nặng',
        reason: 'Công thức tính lượng nước chuẩn theo thể trạng.',
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
        title: '01. Chế độ ăn kháng viêm: Giảm đau nhức mạn tính',
        topic_title: 'Dinh Dưỡng Nền Tảng',
        topic_slug: 'dinh-duong',
        page_slug: 'dinh-duong-khang-viem',
        video_index: 1,
        video_title: '01. Chế độ ăn kháng viêm: Giảm đau nhức mạn tính',
        reason: 'Thực đơn và nhóm chất giúp kiểm soát phản ứng viêm khớp.',
      },
      {
        title: '02. Bộ ba Canxi, Vitamin D3 & K2 dẫn truyền vào xương',
        topic_title: 'Dinh Dưỡng Nền Tảng',
        topic_slug: 'dinh-duong',
        page_slug: 'vitamin-khoang-chat',
        video_index: 2,
        video_title: '02. Bộ ba Canxi, Vitamin D3 & K2 dẫn truyền vào xương',
        reason: 'Vi chất thiết yếu tăng mật độ xương và phục hồi khớp.',
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
        title: '01. Cấu tạo & chức năng cột sống',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'tong-quan-ve-cot-song',
        video_index: 1,
        video_title: '01. Cấu tạo & chức năng cột sống',
        reason: 'Cấu trúc giải phẫu và 4 đường cong sinh lý.',
      },
      {
        title: '01. Giải phẫu đĩa đệm: Vòng sợi & Nhân nhầy',
        topic_title: 'Cột Sống & Đĩa Đệm',
        topic_slug: 'cot-song',
        page_slug: 'dia-dem',
        video_index: 1,
        video_title: '01. Giải phẫu đĩa đệm: Vòng sợi & Nhân nhầy',
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
    const videosText = (c.videos || []).map((v) => `${v.title} ${v.description || ''}`).join(' ');
    const text = normalizeText(`${c.page_title} ${c.topic_title} ${c.summary} ${videosText}`);

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

    if ((normQ.includes('da day') || normQ.includes('ruot') || normQ.includes('tieu hoa') || normQ.includes('enzym')) && c.topic_slug === 'tieu-hoa') {
      score += 15;
    }

    tokens.forEach((t) => {
      if (text.includes(t)) score += 2;
    });

    // Điểm thưởng cao nếu có video trong bài khớp trực tiếp từ khóa
    (c.videos || []).forEach((v) => {
      const vNorm = normalizeText(`${v.title} ${v.description || ''}`);
      if (normQ.length > 3 && vNorm.includes(normQ)) {
        score += 10;
      }
      tokens.forEach((t) => {
        if (vNorm.includes(t)) score += 3;
      });
    });

    return { c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((s) => s.c);
}

// Xây dựng danh mục bài học siêu tốc kèm danh sách video từng bài
async function getOrBuildLessonCatalog(): Promise<LessonCatalogItem[]> {
  if (cachedCatalog && cachedCatalog.length > 0 && cachedCatalogExpiry > Date.now()) {
    return cachedCatalog;
  }

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const [{ data: topics }, { data: pages }, { data: blocks }] = await Promise.all([
        supabase.from('topics').select('id, title, slug').order('sort_order'),
        supabase.from('pages').select('id, title, slug, summary, topic_id').order('sort_order'),
        supabase.from('blocks').select('page_id, type, data').eq('type', 'videos'),
      ]);

      if (topics && pages && pages.length > 0) {
        const topicMap = new Map(topics.map((t) => [t.id, t]));
        const videoBlockMap = new Map<string, VideoItemSummary[]>();

        (blocks || []).forEach((b) => {
          if (Array.isArray(b.data?.videos)) {
            videoBlockMap.set(
              b.page_id,
              b.data.videos.map((v: any, idx: number) => ({
                index: idx + 1,
                title: v.title || `Video ${idx + 1}`,
                description: v.description || '',
              }))
            );
          }
        });

        const catalog: LessonCatalogItem[] = pages.map((p) => {
          const t = topicMap.get(p.topic_id);
          const vList = videoBlockMap.get(p.id) || [];
          return {
            topic_title: t?.title || 'Cột Sống & Đĩa Đệm',
            topic_slug: t?.slug || 'cot-song',
            page_title: p.title,
            page_slug: p.slug,
            summary: p.summary || '',
            content: p.summary || '',
            videos: vList,
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
  const videoBlockMap = new Map<string, VideoItemSummary[]>();
  sampleBlocks.forEach((b) => {
    if (b.type === 'videos' && Array.isArray((b.data as any)?.videos)) {
      videoBlockMap.set(
        b.page_id,
        (b.data as any).videos.map((v: any, idx: number) => ({
          index: idx + 1,
          title: v.title || `Video ${idx + 1}`,
          description: v.description || '',
        }))
      );
    }
  });

  const catalog: LessonCatalogItem[] = samplePages.map((p) => {
    const t = topicMap.get(p.topic_id);
    const vList = videoBlockMap.get(p.id) || [];
    return {
      topic_title: t?.title || 'Cột Sống & Đĩa Đệm',
      topic_slug: t?.slug || 'cot-song',
      page_title: p.title,
      page_slug: p.slug,
      summary: p.summary || '',
      content: p.summary || '',
      videos: vList,
    };
  });

  cachedCatalog = catalog;
  cachedCatalogExpiry = Date.now() + 60 * 60 * 1000;
  return catalog;
}

// Fallback khi AI bận hoặc chậm: trích xuất trực tiếp từ tài liệu chuyên môn của tác giả và đề xuất video bài học
function fastFallbackSearch(query: string, catalog: LessonCatalogItem[], excerpts?: KnowledgeExcerpt[]) {
  const selectedPages = rankCatalogPages(query, catalog);

  let answerText = '';
  if (excerpts && excerpts.length > 0 && excerpts[0].text) {
    const rawContent = excerpts[0].text;
    const lines = rawContent
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => {
        if (s.length < 20) return false;
        if (/^#{1,6}\s+/.test(s)) return false;
        if (/^\|.*\|$/.test(s)) return false;
        if (/^(?:bài\s+\d+|chương\s+\d+|phần\s+\d+|mục\s+\d+)/i.test(s)) return false;
        if (/(?:doctorloan|doctor loan|hydro gems|gems)/i.test(s)) return false;
        return true;
      });

    const cleanBullets = lines
      .slice(0, 3)
      .map((s: string) => {
        const clean = s
          .replace(/^[-•*]\s*/, '')
          .replace(/^\d+[\.\)]\s*/, '')
          .replace(/^[IVXLCDM]+[\.\)]\s*/i, '')
          .trim();
        return `• ${clean}`;
      })
      .join('\n\n');

    if (cleanBullets) {
      answerText = `Dưới đây là các lưu ý khoa học quan trọng nhất về vấn đề này:\n\n${cleanBullets}\n\nBạn có thể nhấn vào video bài học đề xuất bên dưới để xem phân tích chi tiết:`;
    }
  }

  if (!answerText) {
    answerText =
      'Dưới đây là các video bài học trực quan liên quan nhất để bạn theo dõi và nắm rõ nguyên tắc khoa học ngay:';
  }

  return {
    answer: answerText,
    suggested_pages: selectedPages.map((s) => {
      const best = findBestVideoIndex(query, s.videos);
      return {
        title: best.video_title || s.page_title,
        topic_title: s.topic_title,
        topic_slug: s.topic_slug,
        page_slug: s.page_slug,
        video_index: best.video_index,
        video_title: best.video_title,
        reason: `Bài học liên quan: "${s.page_title}".`,
      };
    }),
    follow_up_questions: [
      'Nguyên tắc duy trì tư thế chuẩn để bảo vệ cột sống?',
      'Chế độ dinh dưỡng khoa học hỗ trợ phục hồi tự nhiên?',
    ],
    provider: 'smart_fallback',
  };
}

export async function POST(req: NextRequest) {
  if (!rateLimit('ai:' + getClientIp(req), 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Bạn hỏi quá nhanh, vui lòng thử lại sau ít phút.' }, { status: 429 });
  }
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
      getSettings(true),
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
            suggested_pages: selectedPages.map((s) => {
              const best = findBestVideoIndex(question, s.videos);
              return {
                title: best.video_title || s.page_title,
                topic_title: s.topic_title,
                topic_slug: s.topic_slug,
                page_slug: s.page_slug,
                video_index: best.video_index,
                video_title: best.video_title,
                reason: 'Tài liệu hướng dẫn trực tiếp từ chuyên gia.',
              };
            }),
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

    // 3b. TRUY XUẤT CÁC ĐOẠN TÀI LIỆU LIÊN QUAN TỪ KHO TÀI LIỆU MASTER (< 1ms từ RAM)
    const masterDocs = getMasterKnowledgeDocs();
    const allDocs = (Array.isArray(aiTraining?.documents) && aiTraining.documents.length > 0)
      ? [...masterDocs, ...aiTraining.documents]
      : masterDocs;
    const excerpts = retrieveKnowledge(question, allDocs);
    const knowledgeText = formatKnowledgeForPrompt(excerpts);
    const authorGuidelines = (aiTraining?.guidelines || '').trim();

    if (!deepseekKey && !geminiKey) {
      return NextResponse.json(fastFallbackSearch(question, catalog, excerpts));
    }

    // 3. LỌC 2-3 BÀI HỌC LIÊN QUAN NHẤT TỪ CATALOG BẰNG THUẬT TOÁN ĐIỂM CHỦ ĐỀ
    const topCatalog = rankCatalogPages(question, catalog);

    const catalogText = topCatalog
      .map((c, idx) => {
        let text = `[Bài ${idx + 1}] "${c.page_title}" (Chủ đề: ${c.topic_title}, slug: ${c.topic_slug}/${c.page_slug}): ${c.summary}`;
        if (c.videos && c.videos.length > 0) {
          text += '\n  Danh sách video trong bài:\n' + c.videos.map((v) => `    * Video ${v.index}: "${v.title}"${v.description ? ` (${v.description})` : ''}`).join('\n');
        }
        return text;
      })
      .join('\n\n');

    // 4. HỆ THỐNG PROMPT TỐI ƯU: ĐÚNG TRỌNG TÂM, CÓ ĐIỂM NHẤN, BỐ CỤC THÔNG THOÁNG, KHÔNG THƯƠNG HIỆU
    const systemPrompt = `Bạn là Trợ lý Sức Khỏe AI trong ứng dụng giáo dục y học "Học Cơ Thể" (Tủ Sách Y Khoa Qbiz Books của tác giả Tùng dinh dưỡng).

NGUYÊN TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
1. ĐÚNG TRỌNG TÂM, CÓ ĐIỂM NHẤN, BỐ CỤC THÔNG THOÁNG (P0):
   - Trả lời thẳng vào câu hỏi, không lan man, không lặp lại câu hỏi, không dùng từ ngữ sáo rỗng.
   - BẮT BUỘC IN ĐẬM TỪ KHÓA BẰNG DẤU ** (VD: **từ khóa**):
     + BẮT BUỘC in đậm tên các loại thực phẩm, nhóm thực phẩm cụ thể (VD: **hạt bí đỏ**, **hạt mè đen**, **rau ngót**, **cải bó xôi**, **chuối**, **gạo lứt**, **yến mạch**, **các loại đậu**...).
     + BẮT BUỘC in đậm các khoáng chất, vitamin, hoạt chất sinh học (VD: **Magie**, **Vitamin B1**, **Vitamin B6**, **Vitamin B12**, **chất xơ hòa tan**, **Flavonoid**, **Polyphenol**...).
     + BẮT BUỘC in đậm các cơ chế và hành động cốt lõi (VD: **chia nhỏ bữa ăn**, **nhai kỹ**, **giảm chất béo bão hòa**, **bổ sung men vi sinh Probiotics**...).
   - BỐ CỤC XUỐNG DÒNG RÕ RÀNG, DỄ ĐỌC TRÊN ĐIỆN THOẠI:
     + 1-2 câu trả lời trực diện mở đầu.
     + Tiếp theo là 3 đến 4 gạch đầu dòng (bắt đầu bằng dấu • ), mỗi gạch đầu dòng nêu rõ 1 ý hoặc 1 nhóm thực phẩm/hành động cụ thể.
     + 1 câu cuối dẫn dắt người học sang video bài học liên quan nhất bên dưới.
   - TUYỆT ĐỐI KHÔNG TRÍCH DẪN SỐ THỨ TỰ ĐỀ MỤC NGỚ NGẨN:
     + Tuyệt đối KHÔNG trích các tiêu đề mục sách, số thứ tự chương như "3. CÂN BẰNG NĂNG LƯỢNG", "4. HỘI CHỨNG SAU CẮT TÚI MẬT", "Mục 2.1". Phải diễn đạt tự nhiên thành kiến thức chia sẻ.
   - TUYỆT ĐỐI KHÔNG DÙNG CÂU PHÒNG THỦ:
     + Tuyệt đối KHÔNG nói: "Phần này chưa có trong tài liệu của tác giả...", "Tài liệu của tác giả chưa đề cập...". Hãy trả lời dựa trên kiến thức giải phẫu - dinh dưỡng khoa học chính xác, khách quan.
   - Câu hỏi mơ hồ hoặc quá rộng (ví dụ "đau lưng", "mệt mỏi"): Đừng liệt kê tràn lan. Trả lời 1 ý chính rồi hỏi lại đúng 1 câu làm rõ (đau ở vùng nào, bao lâu, kèm tê hay không).
   - Có thông tin về hội chứng đỏ (tê yếu chi lan nhanh, rối loạn đại tiểu tiện, sốt kèm đau dữ dội): khuyên đi khám chuyên khoa ngay, ngắn gọn.
   - Câu gợi ý hỏi tiếp (follow_up_questions): 3 câu, mỗi câu 8 đến 14 từ, đi tiếp theo mạch bài giảng (hiểu cơ chế, nguyên nhân gốc, rồi cách chăm sóc), nói như người học thật sự sẽ hỏi. TUYỆT ĐỐI KHÔNG CHỨA BẤT KỲ TÊN THƯƠNG HIỆU, NHÃN HIỆU NÀO.

2. NGUYÊN TẮC QUAN TRỌNG VỀ TƯ THẾ & VẬN ĐỘNG (TUYỆT ĐỐI TUÂN THỦ THEO TÁC GIẢ):
   - CẤM TIỂU TƯ VẤN NẰM/NGỒI CHI TIẾT:
     + Tuyệt đối KHÔNG hướng dẫn cụ thể nằm kiểu gì (không chỉ định nằm nghiêng trái, nằm ngửa, co chân, kê cao đầu giường 15-20cm, kê vật gì dưới đệm...).
     + Tuyệt đối KHÔNG hướng dẫn cụ thể ngồi kiểu gì (không quy định góc khuỷu tay 90 độ, không quy định mắt cách vở/bàn bao nhiêu cm, không chỉ định chân đặt thế nào...).
   - CẤM TƯ VẤN GỐI & GHẾ:
     + Tuyệt đối KHÔNG tư vấn về gối hay ghế (loại gối, kê gối, chọn gối, loại ghế, chỉnh ghế...). Tác giả Tùng Dinh Dưỡng KHÔNG có tài liệu và KHÔNG tư vấn về gối hay ghế.
   - CẤM TƯ VẤN BÀI TẬP CỤ THỂ:
     + Tuyệt đối KHÔNG kê toa hoặc chỉ định bài tập thể dục, động tác tập cụ thể (không bảo đu xà, bơi lội, squat, plank, bài tập kéo giãn chi tiết...).
   - NẾU CÓ ĐỀ CẬP ĐẾN TƯ THẾ HOẶC SINH HOẠT:
     + CHỈ ĐƯỢC NÓI CHUNG theo nguyên tắc: "Duy trì tư thế nằm chuẩn, ngồi chuẩn để bảo vệ trục cột sống và độ cong sinh lý tự nhiên", "tránh duy trì tư thế tĩnh tại một chỗ quá lâu, nên đứng dậy đi lại nhẹ nhàng định kỳ", "vận động nhẹ nhàng phù hợp với thể trạng của bản thân".
   - LÝ DO CHUYÊN MÔN: Thể trạng, cơ địa và mức độ tổn thương của mỗi người là khác nhau, không ai giống ai nên không áp đặt một tư thế nằm ngồi hay bài tập cố định cho tất cả mọi người.

3. TUYỆT ĐỐI CẤM THƯƠNG HIỆU, NHÃN HIỆU & SẢN PHẨM (ÁP DỤNG TRIỆT ĐỂ Ở CẢ CÂU TRẢ LỜI VÀ CÂU HỎI TIẾP THEO):
   - CẤM TUYỆT ĐỐI NÊU TÊN BẤT KỲ THƯƠNG HIỆU, NHÃN HIỆU NÀO (DoctorLoan, Doctor Loan, Hydro Gems, Gems, hoặc bất kỳ thương hiệu, nhãn hiệu thương mại nào) trong câu trả lời cũng như trong câu hỏi gợi ý tiếp theo (follow_up_questions).
   - CẤM TUYỆT ĐỐI nêu tên hoặc gợi ý câu hỏi về sản phẩm, hàng hóa, thiết bị, ghế, gối.
   - CÂU HỎI TIẾP THEO (follow_up_questions): Phải 100% là câu hỏi y học thuần túy về cấu tạo giải phẫu, cơ chế sinh lý, nước, dinh dưỡng khoa học hoặc phòng ngừa tự nhiên. TUYỆT ĐỐI KHÔNG chứa tên bất kỳ thương hiệu, nhãn hiệu, sản phẩm, thiết bị, ghế, gối hay bài tập cụ thể nào.
   - CẤM chia kiểu máy móc: "TẦNG 1", "TẦNG 2", "TẦNG 3".
   - CẤM tự ý đưa công thức nước 0.04 hay cảnh báo cấp cứu/bệnh viện vào các câu hỏi sinh hoạt thông thường.
   - CẤM các từ: "chữa bệnh", "khám chữa bệnh", "điều trị dứt điểm", "bác sĩ".
   - CẤM các câu trần tình như "tôi không phải bác sĩ", "tác giả không phải bác sĩ".

4. KIẾN THỨC TỪ TÀI LIỆU CỦA TÁC GIẢ (ƯU TIÊN SỐ 1 - luôn tuân theo các nguyên tắc ở mục 2 và 3):
${authorGuidelines ? `Chỉ dẫn riêng của tác giả: ${authorGuidelines}\n\n` : ''}${knowledgeText || '(Không tìm thấy đoạn tài liệu khớp trực tiếp; hãy trả lời theo kiến thức giải phẫu - dinh dưỡng phổ thông, thận trọng, đúng nguyên tắc ở trên.)'}

5. ĐỊNH HƯỚNG BÀI HỌC VÀ CHỈ ĐỊNH ĐÚNG VIDEO (P0 - BẮT BUỘC):
   - Chọn đúng 1-2 bài học liên quan nhất từ danh mục dưới đây.
   - BẮT BUỘC CHỈ ĐỊNH ĐÚNG "video_index" (số thứ tự 1, 2, 3...) và "title" là tên video trả lời đúng nhất câu hỏi của người học, để khi người học bấm "Phát ngay" là mở đúng video đó và phát ngay, KHÔNG bắt người học phải tự đi tìm trong danh sách.
${catalogText}

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON:
{
  "answer": "1-2 câu trả lời thẳng có in đậm, 3-4 gạch đầu dòng bắt đầu bằng • có in đậm từ khóa quan trọng, 1 câu cuối dẫn sang bài học liên quan",
  "suggested_pages": [
    {
      "title": "Tên video chính xác trong danh mục",
      "topic_title": "Tên chủ đề",
      "topic_slug": "slug_chu_de",
      "page_slug": "slug_bai_hoc",
      "video_index": 1,
      "video_title": "Tên video chính xác",
      "reason": "Lý do ngắn gọn 1 câu"
    }
  ],
  "follow_up_questions": [
    "Câu hỏi tiếp theo THỰC TẾ 1 (8-14 từ, nói như người học thật sự sẽ hỏi, bám đúng nội dung vừa trả lời)?",
    "Câu hỏi tiếp theo THỰC TẾ 2?",
    "Câu hỏi tiếp theo THỰC TẾ 3?"
  ]
}`;

    let rawText = '';
    let usedProvider = '';

    // 5. GỌI PRIMARY: GOOGLE GEMINI TỐC ĐỘ CAO (PHẢN HỒI ~1-1.5s)
    if (geminiKey) {
      const candidateModels = [
        'gemini-flash-lite-latest',
        'gemini-3.5-flash',
        'gemini-flash-latest',
      ];

      const geminiPrompt = `${systemPrompt}\n\nCÂU HỎI CỦA NGƯỜI HỌC: "${question}"\n\nLỊCH SỬ:\n${history.slice(-4).map((h: any) => `${h.role === 'user' ? 'Người học' : 'Trợ lý'}: ${h.text}`).join('\n')}`;

      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3800);

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3,
                maxOutputTokens: 1400,
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
          } else {
            console.warn(`[AI] Gemini ${model} failed with status:`, geminiRes.status);
          }
        } catch (err: any) {
          console.warn(`[AI] Gemini ${model} attempt timed out or failed:`, err?.message);
        }
      }
    }

    // 6. GỌI SECONDARY (FALLBACK): DEEPSEEK V3 VỚI TIMEOUT 4500ms
    if (!rawText && deepseekKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

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
              ...history.slice(-4).map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.text,
              })),
              { role: 'user', content: question },
            ],
            max_tokens: 1400,
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
        } else {
          console.warn('[AI] DeepSeek returned status:', deepseekRes.status);
        }
      } catch (err: any) {
        console.warn('[AI] DeepSeek timed out or failed:', err?.message);
      }
    }

    if (!rawText) {
      return NextResponse.json(fastFallbackSearch(question, catalog, excerpts));
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

    // Nếu model trả về JSON hợp lệ nhưng dùng các trường tiếng Việt khác ngoài "answer"
    if (parsedJson && !parsedJson.answer) {
      const parts: string[] = [];
      for (const [k, v] of Object.entries(parsedJson)) {
        if (k === 'suggested_pages' || k === 'follow_up_questions') continue;
        if (typeof v === 'string' && v.trim()) {
          parts.push(`• ${v.trim()}`);
        } else if (Array.isArray(v)) {
          v.forEach((item) => {
            if (typeof item === 'string' && item.trim()) {
              parts.push(`• ${item.trim()}`);
            }
          });
        } else if (typeof v === 'object' && v !== null) {
          for (const subVal of Object.values(v)) {
            if (Array.isArray(subVal)) {
              subVal.forEach((item) => {
                if (typeof item === 'string' && item.trim()) parts.push(`• ${item.trim()}`);
              });
            } else if (typeof subVal === 'string' && subVal.trim()) {
              parts.push(`• ${subVal.trim()}`);
            }
          }
        }
      }
      if (parts.length > 0) {
        parsedJson.answer = parts.slice(0, 6).join('\n');
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

      // LOẠI BỎ TRIỆT ĐỂ VIỆC TIỂU TƯ VẤN: NẰM CỤ THỂ, NGỒI CỤ THỂ, GỐI, GHẾ, BÀI TẬP CỤ THỂ
      const isAskingPillows = /gối/i.test(question);
      const cleanedLines = cleanAnswer
        .split('\n')
        .map((line) => {
          let l = line;

          // 1. Khử gối khi người dùng không hỏi về gối (bảo tồn giải phẫu: đầu gối, khớp gối, gập gối, chùng gối)
          if (!isAskingPillows && /gối/i.test(l) && !/(?:đầu\s*gối|khớp\s*gối|gập\s*gối|chùng\s*gối)/i.test(l)) {
            l = l.replace(/kê\s+(?:một\s+)?gối\s+(?:mỏng|mềm|nhẹ)?\s+(?:dưới|ở)\s+cổ/gi, 'giữ cổ thẳng trục tự nhiên');
            l = l.replace(/(?:kê\s+)?đệm\s+phẳng\s+mỏng\s+dưới\s+khoeo\s+chân/gi, 'thả lỏng tự nhiên');
            l = l.replace(/(?:kẹp\s+)?gối\s+giữa\s+hai\s+(?:đầu\s+)?gối/gi, 'thả lỏng hai chân');
            l = l.replace(/(?:bằng|dùng)\s+gối\s+mềm/gi, '');
            l = l.replace(/không\s+dùng\s+gối\s+cao/gi, 'không nằm gập đầu cổ');
            l = l.replace(/(?:hoặc\s+)?(?:gối|đệm\s+phẳng)\s+(?:kê\s+)?quá\s+cao(?:\s*[\/\-]\s*thấp)?/gi, 'tư thế gập cong cổ');
            l = l.replace(/tránh\s+gối\s+quá\s+cao/gi, 'tránh nằm gập cổ');
            l = l.replace(/gối\s+cao\s+vừa\s+phải/gi, 'độ dốc vừa phải');
            l = l.replace(/ngủ\s+sai\s+gối/gi, 'nằm sai tư thế');
            l = l.replace(/(?<!(?:đầu|khớp|gập|chùng)\s*)gối/gi, '');
          }

          // 2. Khử tiểu tư vấn nằm kiểu gì (nằm nghiêng trái, nằm ngửa co chân, kê đầu giường 15-20cm...)
          l = l.replace(/nằm\s+nghiêng\s+(?:bên\s+)?trái/gi, 'duy trì tư thế nằm chuẩn');
          l = l.replace(/nằm\s+nghiêng\s+sang\s+một\s+bên/gi, 'duy trì tư thế nằm chuẩn');
          l = l.replace(/nằm\s+ngửa\s+trên\s+đệm\s+phẳng/gi, 'duy trì tư thế nằm chuẩn');
          l = l.replace(/nằm\s+ngửa/gi, 'duy trì tư thế nằm chuẩn');
          l = l.replace(/kê\s+cao\s+(?:phần\s+)?đầu\s+(?:giường|đệm)(?:\s*\([^)]*\))?/gi, 'nghỉ ngơi ở tư thế thoải mái');
          l = l.replace(/kê\s+cao\s+chân\s+hơn\s+(?:mức\s+)?tim(?:\s*\([^)]*\))?/gi, 'thả lỏng chân thoải mái');
          l = l.replace(/(?:hai\s+)?chân\s+co\s+nhẹ(?:\s+tự\s+nhiên|\s+song\s+song)?/gi, 'thả lỏng cơ thể');
          l = l.replace(/co\s+nhẹ\s+(?:hai\s+)?chân(?:\s+tự\s+nhiên|\s+song\s+song)?/gi, 'thả lỏng cơ thể');

          // 3. Khử tiểu tư vấn ngồi kiểu gì & ghế
          l = l.replace(/mắt\s+(?:cách\s+vở|ngang\s+tầm\s+sách|ngang\s+tầm)[^,;.\n]*/gi, 'ngồi thẳng lưng tự nhiên');
          l = l.replace(/khuỷu\s+tay\s+vuông\s+góc/gi, 'thả lỏng vai và tay');
          l = l.replace(/(?:hai\s+)?chân\s+(?:đặt\s+phẳng\s+trên\s+sàn|chạm\s+đất)/gi, 'tư thế ngồi thoải mái');
          l = l.replace(/lưng\s+thẳng\s+dựa\s+vào\s+thành\s+ghế/gi, 'ngồi giữ thẳng lưng tự nhiên');
          l = l.replace(/điều\s+chỉnh\s+bàn\s+ghế\s+phù\s+hợp(?:\s+chiều\s+cao)?/gi, 'giữ tư thế ngồi học và làm việc chuẩn');
          l = l.replace(/bàn\s+ghế\s+phù\s+hợp/gi, 'tư thế ngồi chuẩn');
          l = l.replace(/\bghế\s+công\s+thái\s+học\b/gi, 'chỗ ngồi phù hợp');

          // 4. Khử bài tập cụ thể (đu xà, bơi lội, bài tập kéo giãn, squat, plank...)
          l = l.replace(/(?:tập\s+)?bơi\s*(?:lội)?,\s*(?:đu\s+xà|treo\s+xà(?:\s+đơn)?)\s*(?:nhẹ)?/gi, 'vận động nhẹ nhàng phù hợp thể trạng');
          l = l.replace(/(?:đu\s+xà|treo\s+xà(?:\s+đơn)?|bơi\s+lội)/gi, 'vận động nhẹ nhàng vừa sức');
          l = l.replace(/bài\s+tập\s+(?:kéo\s+giãn|giải\s+nén|vai\s+sau|lưng|cơ\s+lưng)/gi, 'vận động nhẹ nhàng');

          // 5. Dọn dẹp dấu ngoặc rỗng, dấu phẩy thừa
          l = l.replace(/(?:,\s*)?(?:không\s+dùng|tránh)\s*(?=\))/gi, '');
          l = l.replace(/\s*\(\s*(?:không\s+dùng|tránh)?\s*\)/gi, '');
          l = l.replace(/\s*\(\s*\)/g, '');
          l = l.replace(/,\s*,/g, ',');
          l = l.replace(/:\s*,\s*/g, ': ');
          l = l.replace(/\s{2,}/g, ' ').trim();

          return l;
        })
        .filter((l) => l.trim().length > 0);

      // Định dạng khoảng cách dòng thông thoáng và khử số thứ tự mục sách thừa
      const spacedLines: string[] = [];
      for (let i = 0; i < cleanedLines.length; i++) {
        let l = cleanedLines[i].trim();
        // Khử số thứ tự mục sách nếu LLM lỡ sinh ra: "• 3. CÂN BẰNG..." -> "• Cân bằng..."
        l = l.replace(/^([•\-\*]\s*)\d+[\.\)]\s*/, '$1');
        l = l.replace(/^\d+[\.\)]\s+/, '• ');
        spacedLines.push(l);
        // Chèn dòng trống sau mỗi ý để giao diện thông thoáng, dễ đọc trên điện thoại
        if (i < cleanedLines.length - 1) {
          spacedLines.push('');
        }
      }
      cleanAnswer = spacedLines.join('\n').trim();

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

            const catItem = catalog.find((c) => c.topic_slug === topicSlug && c.page_slug === pageSlug)
              || catalog.find((c) => c.page_slug === pageSlug);

            let vIndex = typeof p.video_index === 'number' && p.video_index >= 1 ? p.video_index : null;
            let vTitle = p.video_title || '';

            if (catItem && catItem.videos && catItem.videos.length > 0) {
              if (!vIndex || !vTitle) {
                const best = findBestVideoIndex(question, catItem.videos);
                vIndex = vIndex || best.video_index;
                vTitle = vTitle || best.video_title;
              } else {
                const matchedV = catItem.videos.find((v) => v.index === vIndex);
                if (matchedV) {
                  vTitle = matchedV.title;
                }
              }
            }

            return {
              title: vTitle || p.title || '',
              topic_title: p.topic_title || catItem?.topic_title || '',
              topic_slug: topicSlug,
              page_slug: pageSlug,
              video_index: vIndex || 1,
              video_title: vTitle || p.title || '',
              reason: p.reason || '',
            };
          })
        : [];

      const filteredFollowUps = Array.isArray(parsedJson.follow_up_questions)
        ? parsedJson.follow_up_questions.filter((q: string) => {
            if (!q || typeof q !== 'string') return false;
            const lq = q.toLowerCase();
            if (
              lq.includes('doctorloan') ||
              lq.includes('doctor loan') ||
              lq.includes('hydro gems') ||
              lq.includes('gems') ||
              lq.includes('thiết bị') ||
              lq.includes('sản phẩm') ||
              lq.includes('thương hiệu') ||
              lq.includes('nhãn hiệu') ||
              lq.includes('nhãn hàng') ||
              lq.includes('gối') ||
              lq.includes('ghế') ||
              lq.includes('bài tập') ||
              lq.includes('tập gì') ||
              lq.includes('tập luyện') ||
              lq.includes('nằm ngủ') ||
              lq.includes('tư thế ngủ') ||
              lq.includes('nằm thế nào') ||
              lq.includes('nằm kiểu') ||
              lq.includes('ngồi kiểu')
            ) {
              return false;
            }
            return true;
          })
        : [];

      if (filteredFollowUps.length < 2) {
        filteredFollowUps.push('Nguyên tắc duy trì tư thế chuẩn để bảo vệ cột sống?');
        filteredFollowUps.push('Chế độ dinh dưỡng khoa học hỗ trợ phục hồi khớp?');
      }

      return NextResponse.json({
        answer: cleanAnswer || parsedJson.answer,
        suggested_pages: normalizedSuggested,
        follow_up_questions: filteredFollowUps,
        provider: usedProvider || 'ai',
      });
    }

    return NextResponse.json(fastFallbackSearch(question, catalog, excerpts));
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

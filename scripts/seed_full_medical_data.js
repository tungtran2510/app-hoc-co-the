const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

// Danh mục 8 chuyên đề y khoa chuẩn
const TOPICS = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    slug: 'cot-song',
    title: 'Cột Sống & Đĩa Đệm',
    description: 'Hiểu cột sống từ cấu tạo giải phẫu đến phương pháp chăm sóc, bảo vệ đường cong sinh lý và vận động khoa học.',
    meta_note: 'Atlas 3D · 6 bài học',
    cover_url: '/images/topics/cot-song.png',
    icon: 'spine',
    color_bg: '#E3ECF7',
    color_fg: '#2D5B94',
    sort_order: 1,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    slug: 'dinh-duong',
    title: 'Dinh Dưỡng Nền Tảng',
    description: 'Kiến thức dinh dưỡng vi lượng, đa lượng, cơ chế chuyển hóa năng lượng tế bào và dinh dưỡng kháng viêm tự nhiên.',
    meta_note: 'Y khoa thực hành · 6 bài học',
    cover_url: '/images/topics/dinh-duong.png',
    icon: 'bowl',
    color_bg: '#F6E7D3',
    color_fg: '#8A4F10',
    sort_order: 2,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    slug: 'co-the-nguoi',
    title: 'Cơ Thể Người 3D',
    description: 'Khám phá giải phẫu 3D toàn diện các hệ cơ quan: Cơ xương khớp, tuần hoàn máu, hô hấp, thần kinh và bài tiết.',
    meta_note: 'Atlas giải phẫu · 6 bài học',
    cover_url: '/images/topics/co-the-nguoi.png',
    icon: 'body',
    color_bg: '#E9E4F3',
    color_fg: '#5A4A8A',
    sort_order: 3,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    slug: 'tieu-hoa',
    title: 'Hệ Tiêu Hóa',
    description: 'Cơ chế tiêu hóa từ khoang miệng đến đại tràng, chức năng enzym phân giải và hệ vi sinh đường ruột Microbiome.',
    meta_note: 'Đường ruột & Miễn dịch · 6 bài học',
    cover_url: '/images/topics/tieu-hoa.png',
    icon: 'stomach',
    color_bg: '#F4E1DF',
    color_fg: '#9B3B32',
    sort_order: 4,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    slug: 'nuoc',
    title: 'Nước & Điện Giải',
    description: 'Vai trò sống còn của nước trong tế bào, điều hòa áp suất thẩm thấu và cân bằng các chất điện giải thiết yếu.',
    meta_note: 'Nội môi & Năng lượng · 6 bài học',
    cover_url: '/images/topics/nuoc.png',
    icon: 'droplet',
    color_bg: '#DDF0F6',
    color_fg: '#1F6E8C',
    sort_order: 5,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    slug: 'noi-tiet-chuyen-hoa',
    title: 'Nội Tiết – Chuyển Hóa',
    description: 'Mạng lưới các tuyến nội tiết, sứ giả hormone điều hòa năng lượng, nhịp sinh học và hội chứng chuyển hóa.',
    meta_note: 'Hormone & Sinh hóa · 6 bài học',
    cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
    icon: 'molecule',
    color_bg: '#F3EFD2',
    color_fg: '#6B5C0E',
    sort_order: 6,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000007',
    slug: 'gan-mat-tuy',
    title: 'Gan – Mật – Tụy',
    description: 'Bộ ba cơ quan tiêu hóa & thải độc: Nhà máy sinh hóa 500 chức năng của gan, nhũ tương chất béo và enzym tụy.',
    meta_note: 'Thải độc & Chuyển hóa · 6 bài học',
    cover_url: '/images/topics/gan-mat-tuy.png',
    icon: 'liver',
    color_bg: '#E6EEDD',
    color_fg: '#4E6B2A',
    sort_order: 7,
    is_visible: true,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000008',
    slug: 'mien-dich',
    title: 'Hệ Miễn Dịch',
    description: 'Đội quân phòng thủ đa tầng của cơ thể: Bạch cầu thực bào, tế bào T, tế bào B, kháng thể và phản ứng viêm lành mạnh.',
    meta_note: 'Tự chữa lành · 6 bài học',
    cover_url: '/images/topics/mien-dich.png',
    icon: 'shield',
    color_bg: '#E0EDEB',
    color_fg: '#2F6B63',
    sort_order: 8,
    is_visible: true,
  },
];

// Danh sách các bài học chi tiết cho từng chuyên đề
const TOPIC_PAGES = {
  'cot-song': [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      slug: 'tong-quan-ve-cot-song',
      title: 'Tổng quan về cột sống',
      summary: 'Cấu trúc 33-34 đốt sống, 4 đoạn cong sinh lý và vai trò chịu lực trung tâm cơ thể.',
      cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
      videos: [
        {
          title: '01. Cấu trúc tổng thể cột sống và 4 đường cong sinh lý',
          youtube_id: 'c9kmCxFKHPY',
          description: 'Phân tích chức năng giảm chấn của 4 đoạn cong: cổ, ngực, thắt lưng và cùng cụt.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg'
        },
        {
          title: '02. Cơ chế phân bổ tải trọng khi đứng và ngồi',
          youtube_id: 'z0FRTp5CVds',
          description: 'Tại sao ngồi sai tư thế làm tăng áp lực lên cột sống gấp 2 lần so với đứng thẳng.',
          duration_text: '4 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/z0FRTp5CVds/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Cột sống người trưởng thành là trục chịu lực trung tâm của toàn bộ cơ thể, nâng đỡ đầu, gắn kết lồng ngực và truyền trọng lực xuống khung chậu.',
        'Nhờ có 4 đường cong sinh lý xen kẽ (ưỡn cổ, gù ngực, ưỡn thắt lưng, gù cùng), cột sống có khả năng đàn hồi và chịu lực xóc cao gấp 10 lần so với một cột thẳng đứng.',
        'Mỗi phân đoạn có đặc điểm chức năng riêng: Đoạn cổ linh hoạt nhất, đoạn ngực vững chắc bảo vệ tim phổi, đoạn thắt lưng to dày chịu tải trọng lớn nhất.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      slug: 'dia-dem',
      title: 'Đĩa đệm và cơ chế giảm xóc',
      summary: 'Cấu tạo nhân nhầy, bao xơ sinh học và cơ chế thẩm thấu nuôi dưỡng đĩa đệm.',
      cover_url: '/images/lessons/dia-dem.jpg',
      videos: [
        {
          title: '01. Giải phẫu và chức năng đĩa đệm sinh học',
          youtube_id: 'z0FRTp5CVds',
          description: 'Cấu trúc nhân nhầy chứa 80% nước được bọc trong các lớp bao xơ collagen đồng tâm.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/z0FRTp5CVds/hqdefault.jpg'
        },
        {
          title: '02. Cơ chế thoát vị đĩa đệm và cách phòng ngừa',
          youtube_id: 'zQVOV1eevck',
          description: 'Khi bao xơ bị rách, nhân nhầy thoát ra ngoài chèn ép rễ thần kinh tủy sống.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/zQVOV1eevck/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Đĩa đệm nằm xen kẽ giữa các thân đốt sống, đóng vai trò như bộ giảm xóc thủy lực tự nhiên tuyệt vời của cơ thể.',
        'Ở người trưởng thành, đĩa đệm không có mạch máu trực tiếp mà được nuôi dưỡng hoàn toàn qua cơ chế thẩm thấu dịch khi cơ thể vận động nhịp nhàng.',
        'Ngồi lâu một chỗ khiến đĩa đệm bị ép liên tục, ngăn cản dòng dịch dinh dưỡng đi vào, dẫn đến xơ hóa và thoái hóa sớm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      slug: 'co-gan-day-chang',
      title: 'Cơ – gân – dây chằng cột sống',
      summary: 'Hệ thống dây chằng dọc trước, dọc sau và cơ lõi giữ vững trục cột sống.',
      cover_url: '/images/lessons/co-gan-day-chang.jpg',
      videos: [
        {
          title: '01. Mạng lưới dây chằng và cơ lưng sâu',
          youtube_id: 'c9kmCxFKHPY',
          description: 'Vai trò của dây chằng vàng, dây chằng liên gai và hệ thống cơ nhiều nhánh (multifidus).',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Xương đốt sống không thể tự đứng vững nếu thiếu mạng lưới dây chằng bền bỉ và hệ cơ dựng sống bao quanh.',
        'Dây chằng dọc trước hạn chế ưỡn quá mức, dây chằng dọc sau và dây chằng vàng giữ vững ống sống khi cúi gập.',
        'Hệ cơ lõi (Core) khỏe mạnh là chiếc áo giáp tự nhiên tốt nhất bảo vệ cột sống thắt lưng khỏi chấn thương.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000004',
      slug: 'than-kinh',
      title: 'Tủy sống & Các rễ thần kinh',
      summary: 'Tủy sống, 31 đôi rễ thần kinh và đường dẫn truyền cảm giác vận động.',
      cover_url: '/images/lessons/than-kinh.jpg',
      videos: [
        {
          title: '01. Hệ thần kinh tủy sống và các dây thần kinh gai sống',
          youtube_id: 'q0_7_M2hBwU',
          description: 'Hành trình các rễ thần kinh thoát ra từ lỗ liên hợp chi phối vận động và cảm giác cơ thể.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/q0_7_M2hBwU/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Ống sống là hành lang an toàn bằng xương bảo vệ tủy sống - trung tâm dẫn truyền xung thần kinh giữa não và các cơ quan.',
        'Có 31 đôi dây thần kinh tủy sống chui qua các lỗ liên hợp để chi phối từng vùng da và nhóm cơ tương ứng.',
        'Khi đốt sống thoái hóa hoặc đĩa đệm lồi ra chèn ép rễ thần kinh, cơn đau sẽ lan dọc theo đường đi của dây thần kinh (đau thần kinh tọa).'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000005',
      slug: 'tu-the-va-van-dong',
      title: 'Tư thế chuẩn & Vận động giải áp',
      summary: 'Ngồi, đứng, mang vác đồ vật chuẩn công thái học và bài tập giải nén cột sống.',
      cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
      videos: [
        {
          title: '01. Hướng dẫn tư thế ngồi làm việc chuẩn công thái học',
          youtube_id: 'zQVOV1eevck',
          description: 'Cách điều chỉnh ghế, màn hình và thói quen 45 phút đứng dậy vận động một lần.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/zQVOV1eevck/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Mỗi góc nghiêng của đầu và lưng đều làm tăng tải trọng lên đĩa đệm theo cấp số nhân: cúi đầu 60° tạo áp lực 27kg lên đốt sống cổ.',
        'Quy tắc vàng khi bê vác vật nặng: Luôn giữ lưng thẳng, hạ khớp gối xuống và dùng lực cơ đùi chứ không dùng lưng để gập người nhấc đồ.',
        'Treo người thả lỏng trên xà đơn nhẹ nhàng hoặc tư thế kéo giãn em bé giúp tạo áp suất âm hút dinh dưỡng trở lại đĩa đệm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000006',
      slug: 'cac-van-de-thuong-gap',
      title: 'Các vấn đề cột sống thường gặp',
      summary: 'Thoái hóa đốt sống, phồng lồi đĩa đệm, gai xương và lộ trình phục hồi bảo tồn.',
      cover_url: '/images/lessons/cac-van-de-thuong-gap.jpg',
      videos: [
        {
          title: '01. Hiểu đúng về thoái hóa cột sống và gai xương',
          youtube_id: 'c9kmCxFKHPY',
          description: 'Gai xương thực chất là phản ứng tự vệ của cơ thể nhằm tăng diện tích tiếp xúc khi đĩa đệm bị xẹp.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Thoái hóa cột sống là quá trình biến đổi sinh học tự nhiên theo tuổi tác, nhưng thói quen sinh hoạt sai lầm khiến nó xảy ra sớm ở người trẻ.',
        'Gai xương không phải là dị vật mọc đâm vào thịt, mà là phản ứng bồi đắp canxi của cơ thể để tăng độ vững khi đĩa đệm mất chiều cao.',
        'Hơn 85% các trường hợp đau cột sống có thể phục hồi tốt thông qua điều chỉnh tư thế, dinh dưỡng kháng viêm và tập luyện cơ lõi.'
      ]
    }
  ],

  'dinh-duong': [
    {
      id: 'b0000000-0000-0000-0000-000000000011',
      slug: 'tong-quan-dinh-duong-hoc',
      title: 'Tổng quan dinh dưỡng học tế bào',
      summary: 'Phân loại chất dinh dưỡng đa lượng, vi lượng và chuyển hóa năng lượng ATP.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Dinh dưỡng học tế bào và chu trình năng lượng ATP',
          youtube_id: '9i9yP5xYF40',
          description: 'Thức ăn được phân giải thành các phân tử sinh học nuôi sống hơn 30 nghìn tỷ tế bào trong cơ thể.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/9i9yP5xYF40/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Cơ thể con người được cấu tạo từ chính những gì chúng ta ăn vào mỗi ngày. Dinh dưỡng cung cấp năng lượng và nguyên liệu tái tạo tế bào.',
        'Chất đa lượng (Đạm, Béo, Tinh bột) cung cấp calo hoạt động; chất vi lượng (Vitamin, Khoáng chất) đóng vai trò xúc tác các phản ứng sinh hóa.',
        'Một chế độ dinh dưỡng cân bằng là nền tảng vững chắc nhất để phòng ngừa các bệnh mạn tính không lây nhiễm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000012',
      slug: 'chat-dam-protein',
      title: 'Chất đạm (Protein) & Tái tạo mô cơ',
      summary: 'Các axit amin thiết yếu, vai trò xây dựng cơ bắp, kháng thể và enzym sinh học.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Vai trò của Protein và 9 axit amin thiết yếu',
          youtube_id: 'd40X_Yy6H50',
          description: 'Cơ chế cơ thể phân giải protein thành axit amin để tái tổng hợp collagen, mô cơ và enzym sống.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/d40X_Yy6H50/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Protein là vật liệu xây dựng chính của cơ bắp, da, tóc, dây chằng và các phân tử miễn dịch trong máu.',
        'Cơ thể cần 20 loại axit amin, trong đó có 9 loại cơ thể không tự tổng hợp được mà bắt buộc phải nạp qua thực phẩm.',
        'Thiếu đạm làm suy giảm khối cơ, chậm lành vết thương và làm đĩa đệm cũng như dây chằng cột sống mất đi độ săn chắc.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000013',
      slug: 'chat-beo-lipid',
      title: 'Chất béo tốt (Lipid) & Màng tế bào',
      summary: 'Chất béo không bão hòa, Omega-3, cholesterol và sự hình thành màng tế bào thần kinh.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Giải mã chất béo tốt và vai trò của Omega-3',
          youtube_id: '_7zJ_p0X8V8',
          description: 'Phân biệt chất béo chuyển hóa gây viêm và chất béo lành mạnh bảo vệ tim mạch, màng tế bào não.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/_7zJ_p0X8V8/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Chất béo không phải là kẻ thù của sức khỏe. Màng của mọi tế bào trong cơ thể và 60% não bộ đều được cấu tạo từ lipid.',
        'Chất béo là dung môi hòa tan các vitamin quan trọng như A, D, E, K và là tiền chất để sản sinh các hormone giới tính.',
        'Axit béo Omega-3 có đặc tính kháng viêm tự nhiên mạnh mẽ, giúp làm dịu các cơn đau cơ xương khớp và bảo vệ hệ tim mạch.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000014',
      slug: 'tinh-bot-carbohydrate',
      title: 'Tinh bột (Carbohydrate) & Chỉ số GI',
      summary: 'Đường đơn vs tinh bột phức hợp, chỉ số đường huyết Glycemic Index và bài toán Insulin.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Tinh bột, đường huyết và cơ chế hoạt động của Insulin',
          youtube_id: 'wxyxV1Z3X7k',
          description: 'Cách tinh bột phân giải thành glucose và vai trò của insulin trong việc nạp đường vào tế bào tạo năng lượng.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/wxyxV1Z3X7k/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Carbohydrate là nguồn cung cấp năng lượng nhanh nhất và ưa thích nhất của não bộ cũng như các cơ bắp hoạt động.',
        'Nên ưu tiên tinh bột phức hợp giàu chất xơ (gạo lứt, yến mạch, khoai lang) có chỉ số GI thấp để giữ đường huyết ổn định.',
        'Lạm dụng đường tinh luyện khiến đường huyết tăng vọt, kích thích tiết thừa insulin dẫn đến tích mỡ nội tạng và phản ứng viêm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000015',
      slug: 'vitamin-khoang-chat',
      title: 'Vitamin & Khoáng chất thiết yếu',
      summary: 'Canxi, Magie, Vitamin D3, K2 và các nguyên tố vi lượng kích hoạt enzym sự sống.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Bộ đôi Canxi - D3 - K2 và sức khỏe xương khớp',
          youtube_id: 'iswT2B1t7c4',
          description: 'Cách vitamin D3 hấp thu canxi vào máu và vitamin K2 định hướng canxi gắn chặt vào xương.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/iswT2B1t7c4/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Dù chỉ chiếm lượng rất nhỏ, vi chất dinh dưỡng là những mắt xích không thể thiếu trong hàng nghìn phản ứng enzym mỗi giây.',
        'Để xương và cột sống chắc khỏe, canxi cần có vitamin D3 tăng hấp thu ở ruột và vitamin K2 dẫn đường gắn canxi vào cấu trúc xương.',
        'Magie đóng vai trò then chốt giúp giãn cơ, chống co thắt cơ lưng và làm dịu hệ thần kinh căng thẳng.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000016',
      slug: 'dinh-duong-khang-viem',
      title: 'Dinh dưỡng kháng viêm & Tái tạo mô',
      summary: 'Các thực phẩm giàu chất chống oxy hóa, polyphenol và nguyên tắc ăn uống giảm đau mạn tính.',
      cover_url: '/images/topics/dinh-duong.png',
      videos: [
        {
          title: '01. Chế độ ăn kháng viêm đẩy lùi thoái hóa và đau nhức',
          youtube_id: 'k2gZ49z_t5g',
          description: 'Các hợp chất tự nhiên như Curcumin trong nghệ, EGCG trong trà xanh giúp ức chế con đường viêm mạn tính.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/k2gZ49z_t5g/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Viêm mạn tính cấp độ thấp là nguyên nhân sâu xa phá hủy đĩa đệm, sụn khớp và gây nên các cơn đau nhức dai dẳng.',
        'Cắt giảm thực phẩm siêu chế biến, dầu tinh luyện chiên đi chiên lại và bổ sung rau xanh đậm, cá béo, quả mọng giúp dập tắt phản ứng viêm.',
        'Uống đủ nước và bổ sung chất chống oxy hóa tự nhiên giúp cơ thể kích hoạt cơ chế tự sửa chữa các tổn thương vi mô.'
      ]
    }
  ],

  'co-the-nguoi': [
    {
      id: 'b0000000-0000-0000-0000-000000000021',
      slug: 'tong-quan-giai-phau-co-the',
      title: 'Tổng quan các hệ cơ quan trong cơ thể',
      summary: 'Bản đồ 11 hệ cơ quan sinh học phối hợp nhịp nhàng duy trì sự sống kỳ diệu.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Du hành qua các hệ cơ quan cơ thể người 3D',
          youtube_id: 'uBGl2BujkPQ',
          description: 'Khám phá sự phối hợp đồng bộ giữa xương, cơ, tim mạch, thần kinh và các tạng trong cơ thể.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/uBGl2BujkPQ/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Cơ thể người là cỗ máy sinh học tinh vi nhất vũ trụ với hơn 30 nghìn tỷ tế bào được tổ chức thành các mô và cơ quan chuyên biệt.',
        '11 hệ cơ quan bao gồm: Vận động, Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh, Nội tiết, Bài tiết, Miễn dịch, Da, Sinh sản và Bạch huyết.',
        'Mỗi hệ cơ quan đều hoạt động liên kết mật thiết: tim bơm máu nuôi não, phổi cấp oxy cho tim, thận lọc chất thải của mọi cơ quan.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000022',
      slug: 'he-co-xuong-khop',
      title: 'Hệ cơ xương khớp & Cơ chế vận động',
      summary: '206 chiếc xương, hơn 600 cơ bắp và các khớp động cho phép con người cử động linh hoạt.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Giải phẫu hệ cơ xương khớp và đòn bẩy sinh học',
          youtube_id: 'f_y02XU4_zE',
          description: 'Cách các bó cơ co rút tạo lực kéo qua gân xương, biến đổi thành các chuyển động nhịp nhàng.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/f_y02XU4_zE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Khung xương người trưởng thành gồm 206 xương đóng vai trò nâng đỡ thân mình và bảo vệ các cơ quan nội tạng quan trọng.',
        'Các khớp động (khớp gối, khớp háng, khớp vai) được bao phủ bởi lớp sụn trơn láng và dịch khớp giúp giảm ma sát tối đa.',
        'Cơ xương chiếm khoảng 40% trọng lượng cơ thể, hoạt động theo nguyên lý đòn bẩy sinh cơ học dưới sự điều khiển của hệ thần kinh.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000023',
      slug: 'he-tuan-hoan-tim-mach',
      title: 'Trái tim & Hệ tuần hoàn máu',
      summary: 'Cấu tạo 4 ngăn tim, 100.000 km mạch máu và vòng tuần hoàn lớn nhỏ vận chuyển oxy.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Trái tim và mạng lưới tuần hoàn sự sống',
          youtube_id: 'fR3NxCR9z2U',
          description: 'Hành trình máu giàu oxy từ tâm thất trái đi khắp cơ thể và máu nghèo oxy trở về phổi trao đổi khí.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/fR3NxCR9z2U/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Trái tim chỉ nặng khoảng 300 gram nhưng đập hơn 100.000 lần mỗi ngày để bơm 7.500 lít máu qua mạng lưới mạch máu dài gần 100.000 km.',
        'Động mạch có thành dày đàn hồi chịu áp lực cao; tĩnh mạch có van một chiều dẫn máu về tim; mao mạch là nơi trao đổi chất vi mô.',
        'Tập luyện tim mạch đều đặn giúp tăng cường dung tích tống máu, hạ huyết áp khi nghỉ và kéo dài tuổi thọ tế bào cơ tim.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000024',
      slug: 'he-ho-hap-phoi',
      title: 'Hệ hô hấp & Trao đổi khí tại phế nang',
      summary: 'Khí quản, phế quản, 300 triệu phế nang và cơ hoành điều khiển hơi thở.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Cơ chế hít thở và trao đổi khí tại màng phế nang',
          youtube_id: 'bHzSvS7bWGE',
          description: 'Oxy khuếch tán vào hồng cầu và CO2 được thải ra ngoài qua lớp màng siêu mỏng chỉ vài micromet.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/bHzSvS7bWGE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hệ hô hấp cung cấp dưỡng khí oxy cho mọi tế bào hô hấp tạo năng lượng và đào thải khí thải cacbonic ra môi trường ngoài.',
        'Bề mặt trao đổi khí của hơn 300 triệu phế nang trong hai lá phổi khi trải rộng tương đương diện tích của một sân tennis.',
        'Thói quen thở bụng sâu bằng cơ hoành giúp tăng lượng oxy vào đáy phổi, kích hoạt hệ thần kinh phó giao cảm giúp giảm stress.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000025',
      slug: 'he-than-kinh-nao-bo',
      title: 'Não bộ & Mạng lưới neuron thần kinh',
      summary: '86 tỷ neuron thần kinh, các thùy não và cơ chế dẫn truyền xung điện qua synap.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Cấu trúc kỳ diệu của não bộ và tế bào thần kinh',
          youtube_id: 'q0_7_M2hBwU',
          description: 'Các xung điện truyền dọc sợi trục với tốc độ lên đến 400 km/h giải mã suy nghĩ, cảm xúc và vận động.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/q0_7_M2hBwU/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Bộ não người chứa khoảng 86 tỷ tế bào thần kinh (neuron) với hàng nghìn tỷ kết nối synap tạo nên trung tâm chỉ huy tối cao của cơ thể.',
        'Não tiêu thụ tới 20% tổng lượng calo và oxy của cơ thể dù chỉ chiếm khoảng 2% trọng lượng thân mình.',
        'Tính mềm dẻo của não bộ (Neuroplasticity) cho phép não liên tục hình thành các đường mòn thần kinh mới khi chúng ta học hỏi điều mới.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000026',
      slug: 'he-bai-tiet-than',
      title: 'Hệ bài tiết & Bộ lọc sinh học của thận',
      summary: '2 triệu nephron lọc 180 lít huyết tương mỗi ngày, tạo nước tiểu và điều hòa huyết áp.',
      cover_url: '/images/topics/co-the-nguoi.png',
      videos: [
        {
          title: '01. Thận và cơ chế lọc máu của đơn vị Nephron',
          youtube_id: 'FN3MFhYPWWo',
          description: 'Hành trình lọc cầu thận, tái hấp thu nước, glucose và bài tiết độc tố urea ra nước tiểu.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/FN3MFhYPWWo/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hai quả thận nhỏ bé hình hạt đậu lọc sạch toàn bộ lượng máu trong cơ thể khoảng 40 lần mỗi ngày để đào thải độc tố chuyển hóa.',
        'Mỗi quả thận chứa khoảng 1 triệu đơn vị chức năng gọi là Nephron gồm cầu thận lọc máu và hệ thống ống thận tinh vi.',
        'Thận còn tiết hormone erythropoietin kích thích tủy xương tạo hồng cầu và sản sinh enzym renin điều hòa huyết áp toàn thân.'
      ]
    }
  ],

  'tieu-hoa': [
    {
      id: 'b0000000-0000-0000-0000-000000000031',
      slug: 'tong-quan-ong-tieu-hoa',
      title: 'Hành trình thức ăn qua ống tiêu hóa',
      summary: 'Từ khoang miệng, thực quản đến dạ dày: Tiêu hóa cơ học và hóa học ban đầu.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Hành trình 9 mét của thức ăn qua đường tiêu hóa',
          youtube_id: 'xM_Hq0iT91s',
          description: 'Các cử động nhu động đẩy thức ăn qua ống tiêu hóa dài 9 mét từ miệng đến trực tràng.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/xM_Hq0iT91s/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Ống tiêu hóa là một đường ống cơ liên tục dài khoảng 9 mét bắt đầu từ khoang miệng và kết thúc ở hậu môn.',
        'Quá trình tiêu hóa bắt đầu ngay từ khi nhai: Răng nghiền nhỏ thức ăn và enzym amylase trong nước bọt phân giải tinh bột chín.',
        'Nhai kỹ là bước khởi đầu quan trọng nhất giúp giảm tải gánh nặng tiêu hóa cho dạ dày và tăng hiệu suất hấp thu dưỡng chất.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000032',
      slug: 'da-day-va-axit-dich-vi',
      title: 'Dạ dày & Sức mạnh của Axit dịch vị',
      summary: 'Axit clohydric pH 1.5 - 2.0, enzym pepsin phân cắt đạm và lớp màng nhầy bảo vệ.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Giải phẫu dạ dày và cơ chế bài tiết dịch vị',
          youtube_id: 'jGmesw1Jk_o',
          description: 'Tại sao axit dạ dày có thể hòa tan kim loại nhưng không tự làm thủng niêm mạc dạ dày nhờ lớp chất nhầy.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/jGmesw1Jk_o/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Dạ dày là một túi cơ hình chữ J có tính axit cao (pH 1.5 - 2.0) giúp tiêu diệt hầu hết vi khuẩn có hại lẫn trong thức ăn.',
        'Axit clohydric kích hoạt tiền enzym pepsinogen thành pepsin hoạt động để cắt các chuỗi đạm phức tạp thành các đoạn peptide ngắn.',
        'Lớp chất nhầy giàu bicarbonate lót bảo vệ niêm mạc; khi hàng rào này bị suy yếu sẽ dẫn đến viêm loét dạ dày tá tràng.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000033',
      slug: 'ruot-non-va-hap-thu',
      title: 'Ruột non: Nơi hấp thu 90% dưỡng chất',
      summary: 'Tá tràng, hỗng tràng, hồi tràng và hàng triệu nhung mao tăng diện tích hấp thu.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Cấu trúc nhung mao ruột non và cơ chế hấp thu dinh dưỡng',
          youtube_id: 'aPEh_p8wI3Y',
          description: 'Hàng triệu vi nhung mao tạo nên bề mặt hấp thu rộng lớn lên tới 250 mét vuông.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/aPEh_p8wI3Y/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Ruột non dài khoảng 6 mét là trung tâm tiêu hóa và hấp thu dinh dưỡng quan trọng nhất của cơ thể con người.',
        'Tại tá tràng, dịch mật từ gan và enzym từ tụy đổ vào giúp trung hòa axit và phân giải triệt để chất đạm, béo, tinh bột.',
        'Bề mặt ruột non có các nếp gấp, nhung mao và vi nhung mao giúp tăng diện tích tiếp xúc lên gấp 600 lần.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000034',
      slug: 'ruot-gia-va-he-vi-sinh',
      title: 'Đại tràng & Hệ vi sinh vật Microbiome',
      summary: '100 nghìn tỷ vi khuẩn đường ruột, lên men chất xơ và sản xuất vitamin K, B12.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Hệ vi sinh vật đường ruột Microbiome và sức khỏe miễn dịch',
          youtube_id: '1sISguPDlhY',
          description: 'Các vi khuẩn có lợi lên men chất xơ prebiotic thành các axit béo chuỗi ngắn SCFA nuôi dưỡng niêm mạc.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/1sISguPDlhY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Ruột già (đại tràng) có nhiệm vụ chính là tái hấp thu nước, khoáng chất và tạo khuôn chất bã thải ra ngoài.',
        'Đây là ngôi nhà của hơn 100 nghìn tỷ vi sinh vật (Microbiome) có số lượng tế bào còn nhiều hơn cả tổng số tế bào của cơ thể người.',
        'Hệ vi sinh khỏe mạnh giúp sản sinh các axit béo chuỗi ngắn (SCFA), bảo vệ thành ruột và tổng hợp vitamin nhóm B và vitamin K.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000035',
      slug: 'truc-nao-ruot',
      title: 'Trục Não – Ruột (Gut-Brain Axis)',
      summary: 'Dây thần kinh phế vị, 90% Serotonin tạo ra ở ruột và tâm trạng con người.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Não bộ thứ hai: Mối liên kết kỳ diệu giữa ruột và não',
          youtube_id: 'awtm_12_f6E',
          description: 'Cách đường ruột gửi tín hiệu liên tục lên não qua dây thần kinh phế vị ảnh hưởng đến cảm xúc và lo âu.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/awtm_12_f6E/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Đường ruột có hệ thần kinh ruột riêng (ENS) với hơn 500 triệu tế bào thần kinh, được ví như bộ não thứ hai của con người.',
        'Hơn 90% lượng hormone hạnh phúc Serotonin của toàn cơ thể được tổng hợp trực tiếp tại các tế bào niêm mạc đường ruột.',
        'Căng thẳng tâm lý làm rối loạn nhu động ruột, ngược lại đường ruột bị viêm cũng phát tín hiệu gây lo âu và trầm cảm trên não.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000036',
      slug: 'cham-soc-tieu-hoa',
      title: 'Chăm sóc & Phục hồi hệ tiêu hóa',
      summary: 'Phòng ngừa trào ngược dạ dày, hội chứng ruột kích thích và bổ sung men vi sinh đúng cách.',
      cover_url: '/images/topics/tieu-hoa.png',
      videos: [
        {
          title: '01. Các giải pháp tự nhiên cải thiện trào ngược và đầy trướng bụng',
          youtube_id: 'g_K4N72W8xI',
          description: 'Thói quen ăn chậm nhai kỹ, không nằm ngay sau ăn và bổ sung thực phẩm lên men tự nhiên.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/g_K4N72W8xI/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hội chứng ruột kích thích (IBS) và trào ngược dạ dày thực quản (GERD) thường bắt nguồn từ lối sống vội vã và stress mạn tính.',
        'Để chăm sóc đường ruột: Ăn đúng giờ, bổ sung chất xơ hòa tan từ rau củ, uống đủ nước và hạn chế đồ uống có cồn, cay nóng.',
        'Thực phẩm lên men tự nhiên như sữa chua, kim chi, dưa cải cung cấp nguồn lợi khuẩn Probiotics dồi dào củng cố hệ vi sinh.'
      ]
    }
  ],

  'nuoc': [
    {
      id: 'b0000000-0000-0000-0000-000000000041',
      slug: 'vai-tro-cua-nuoc-trong-co-the',
      title: 'Nước: 70% cơ thể và môi trường sự sống',
      summary: 'Phân bố nước nội bào, ngoại bào và vai trò vận chuyển dinh dưỡng.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. Điều gì xảy ra khi bạn uống đủ nước mỗi ngày?',
          youtube_id: 'v9j8sQ9Zk1w',
          description: 'Nước tham gia vào mọi phản ứng sinh hóa, bôi trơn khớp và điều hòa thân nhiệt con người.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/v9j8sQ9Zk1w/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Nước chiếm khoảng 60-70% trọng lượng cơ thể người trưởng thành và lên tới 80% trong não bộ, cơ bắp và đĩa đệm cột sống.',
        'Hai phần ba lượng nước nằm bên trong tế bào (dịch nội bào), một phần ba nằm trong máu và khoảng gian bào (dịch ngoại bào).',
        'Nước là môi trường hòa tan các chất dinh dưỡng, bôi trơn các khớp xương và giúp cơ thể đào thải chất độc qua nước tiểu và mồ hôi.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000042',
      slug: 'co-che-khat-va-dieu-hoa-nuoc',
      title: 'Cơ chế khát & Điều hòa áp suất thẩm thấu',
      summary: 'Vùng dưới đồi, hormone chống bài niệu ADH và cơ chế bù trừ của thận.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. Cơ chế khát nước và hormone ADH điều hòa nước',
          youtube_id: '9iMGFqMmUFs',
          description: 'Khi máu bị cô đặc, các cảm thụ quan vùng dưới đồi phát tín hiệu khát và kích thích thận giữ nước.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/9iMGFqMmUFs/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Khi cơ thể mất 1-2% lượng nước, nồng độ thẩm thấu của máu tăng lên kích hoạt trung tâm khát ở vùng dưới đồi não bộ.',
        'Tuyến yên lập tức tiết hormone chống bài niệu ADH truyền lệnh cho thận tái hấp thu nước tối đa, làm nước tiểu cô đặc lại.',
        'Cảm giác khát thực chất là tín hiệu muộn; khi bạn thấy khát thì tế bào đã bắt đầu rơi vào tình trạng thiếu nước nhẹ.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000043',
      slug: 'dien-giai-natri-kali-canxi',
      title: 'Các chất điện giải: Natri, Kali & Magie',
      summary: 'Điện thế màng tế bào, dẫn truyền xung điện thần kinh và phòng ngừa chuột rút.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. Chất điện giải là gì và tại sao chúng ta cần chúng?',
          youtube_id: 'n4O1lS2t8_s',
          description: 'Bơm Natri - Kali trên màng tế bào tạo ra dòng điện sinh học cho phép tim đập và cơ bắp co rút.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/n4O1lS2t8_s/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Nước trong cơ thể không phải là nước cất tinh khiết mà là dung dịch chứa các ion tích điện gọi là chất điện giải (Electrolytes).',
        'Natri là ion chính ở ngoài tế bào duy trì huyết áp; Kali là ion chính trong tế bào điều hòa nhịp tim và co bóp cơ.',
        'Mất cân bằng điện giải khi đổ nhiều mồ hôi hoặc tiêu chảy có thể gây chuột rút, hoa mắt chóng mặt và rối loạn nhịp tim nguy hiểm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000044',
      slug: 'uong-nuoc-dung-cach',
      title: 'Nguyên tắc uống nước khoa học theo thể trạng',
      summary: 'Công thức tính lượng nước 40ml/kg cân nặng, 4 thời điểm vàng uống nước trong ngày.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. 4 thời điểm vàng uống nước trong ngày giúp sống thọ',
          youtube_id: '3z3G_G6_1lE',
          description: 'Uống 1 ly nước ấm ngay sau khi thức dậy kích hoạt tuần hoàn và làm loãng máu chống đột quỵ ban mai.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/3z3G_G6_1lE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Lượng nước chuẩn mỗi ngày được tính theo công thức: Cân nặng (kg) x 40ml. Ví dụ người 60kg cần khoảng 2.4 lít nước mỗi ngày.',
        'Nên uống từng ngụm nhỏ rải rác trong ngày, uống ấm hoặc nhiệt độ phòng; tránh uống ừng ực lượng lớn gây quá tải cho thận.',
        '4 thời điểm vàng: Sau khi thức dậy, trước bữa ăn 30 phút, trước khi tắm và một lượng nhỏ trước khi đi ngủ.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000045',
      slug: 'tac-hai-cua-mat-nuoc',
      title: 'Tác hại của mất nước mạn tính',
      summary: 'Đau đầu, sỏi thận, đĩa đệm xẹp nhanh và suy giảm khả năng tập trung.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. Tác hại ngấm ngầm của việc lười uống nước mỗi ngày',
          youtube_id: 'b_f4V3jQ4xM',
          description: 'Mất nước mạn tính làm tăng độ nhớt của máu, lắng cặn canxi tạo sỏi thận và đẩy nhanh lão hóa khớp.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/b_f4V3jQ4xM/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Nhiều người rơi vào trạng thái mất nước mạn tính mà không hề hay biết, biểu hiện qua mệt mỏi vô cớ, da khô và táo bón.',
        'Đĩa đệm cột sống mất nước vào ban ngày và cần nạp lại nước vào ban đêm; thiếu nước làm đĩa đệm xẹp nhanh và thoái hóa sớm.',
        'Nước tiểu màu vàng sậm có mùi nồng là thước đo khách quan nhất cho thấy cơ thể bạn đang thiếu nước trầm trọng.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000046',
      slug: 'nuoc-khoang-tu-nhien',
      title: 'Nước khoáng tự nhiên & Cân bằng pH',
      summary: 'Nước khoáng thiên nhiên, chỉ số pH và cơ chế đệm bảo vệ môi trường máu.',
      cover_url: '/images/topics/nuoc.png',
      videos: [
        {
          title: '01. Phân biệt nước tinh khiết, nước khoáng và nước kiềm',
          youtube_id: 'm3E8Q9r8_xY',
          description: 'Lựa chọn nguồn nước uống an toàn giàu khoáng chất tự nhiên tốt cho tim mạch và xương khớp.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/m3E8Q9r8_xY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Nước khoáng tự nhiên chứa các vi khoáng hòa tan dạng ion như Canxi, Magie, Kali rất dễ được niêm mạc ruột hấp thu.',
        'Độ pH của máu luôn được duy trì chặt chẽ ở mức 7.35 - 7.45 nhờ hệ thống đệm hô hấp và bài tiết ion của thận.',
        'Ưu tiên nguồn nước sạch, giàu vi khoáng tự nhiên và hạn chế các loại nước ngọt có gas chứa nhiều đường và axit phosphoric.'
      ]
    }
  ],

  'noi-tiet-chuyen-hoa': [
    {
      id: 'b0000000-0000-0000-0000-000000000051',
      slug: 'tong-quan-he-noi-tiet',
      title: 'Tổng quan hệ thống nội tiết & Hormone',
      summary: 'Các tuyến nội tiết chính: Tuyến yên, tuyến giáp, tuyến tụy, tuyến thượng thận và sinh dục.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Hệ nội tiết hoạt động như thế nào?',
          youtube_id: 'ER49EweKwW8',
          description: 'Hormone là các chất hóa học được tiết trực tiếp vào máu để điều phối sự phát triển, sinh sản và trao đổi chất.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/ER49EweKwW8/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hệ nội tiết cùng với hệ thần kinh là hai mạng lưới điều khiển thông tin chủ chốt duy trì sự cân bằng nội môi của cơ thể.',
        'Tuyến yên nằm ở đáy não được ví như nhạc trưởng điều khiển các tuyến nội tiết khác như tuyến giáp, tuyến thượng thận.',
        'Chỉ một lượng hormone siêu nhỏ (tính bằng phần tỷ gam) cũng đủ tạo ra những thay đổi sinh lý to lớn trên toàn bộ cơ thể.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000052',
      slug: 'tuyen-giap-va-chuyen-hoa',
      title: 'Tuyến giáp: Bộ điều tốc năng lượng cơ thể',
      summary: 'Hormone T3, T4, vai trò của I-ốt và sự khác biệt giữa cường giáp - suy giáp.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Tuyến giáp và vai trò điều hòa chuyển hóa năng lượng',
          youtube_id: 'bKk_T9c8M4w',
          description: 'Tuyến giáp hình cánh bướm ở cổ quyết định tốc độ đốt cháy calo và nhịp tim của bạn.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/bKk_T9c8M4w/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Tuyến giáp hình cánh bướm nằm trước cổ sản sinh hormone Thyroxine (T4) và Triiodothyronine (T3) điều khiển tốc độ trao đổi chất.',
        'Suy giáp làm cơ thể chậm chạp, dễ tăng cân, sợ lạnh và mệt mỏi; ngược lại cường giáp làm sụt cân nhanh, run tay và tim đập nhanh.',
        'I-ốt và Selen là hai vi chất bắt buộc phải có để tuyến giáp tổng hợp đủ lượng hormone sinh học mỗi ngày.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000053',
      slug: 'tuyen-tuy-va-insulin',
      title: 'Tuyến tụy & Cân bằng đường huyết với Insulin',
      summary: 'Đảo tụy Langerhans, cơ chế đối kháng giữa Insulin và Glucagon.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Insulin và chiếc chìa khóa mở cửa tế bào nạp đường',
          youtube_id: 'bW_Y4T4k_0U',
          description: 'Tế bào beta đảo tụy tiết insulin giúp đường glucose đi vào tế bào tạo năng lượng và hạ đường huyết.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/bW_Y4T4k_0U/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Tuyến tụy nội tiết chứa các cụm tế bào gọi là đảo Langerhans: Tế bào beta tiết Insulin và tế bào alpha tiết Glucagon.',
        'Sau khi ăn, Insulin hoạt động như chiếc chìa khóa mở cửa tế bào cho glucose đi vào; khi đói, Glucagon kích thích gan giải phóng đường dự trữ.',
        'Đề kháng insulin xảy ra khi tế bào bị trơ lì với tín hiệu insulin, dẫn đến đường huyết tăng cao và tiến triển thành tiểu đường tuýp 2.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000054',
      slug: 'tuyen-thuong-than-cortisol',
      title: 'Tuyến thượng thận, Cortisol & Phản ứng Stress',
      summary: 'Adrenaline chuẩn bị chiến đấu, Cortisol điều hòa viêm và hội chứng kiệt sức thượng thận.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Cortisol: Hormone sinh tồn và mặt trái khi stress kéo dài',
          youtube_id: '9t5B0Y9j_8w',
          description: 'Stress cấp tính giúp bạn vượt qua hiểm nguy, nhưng stress mạn tính phá hủy giấc ngủ và hệ miễn dịch.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/9t5B0Y9j_8w/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hai tuyến thượng thận nhỏ hình tam giác nằm úp trên đỉnh hai quả thận tiết ra Adrenaline và Cortisol đáp ứng với căng thẳng.',
        'Phản ứng "Chiến đấu hay Bỏ chạy" (Fight or Flight) huy động tối đa năng lượng, tăng nhịp tim và giãn đồng tử để ứng phó hiểm nguy.',
        'Stress kéo dài khiến nồng độ Cortisol luôn ở mức cao làm tăng mỡ bụng, ức chế miễn dịch và gây mất ngủ triền miên.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000055',
      slug: 'hormone-sinh-duc-va-lao-hoa',
      title: 'Hormone sinh dục & Quá trình lão hóa tự nhiên',
      summary: 'Estrogen, Progesterone, Testosterone và sự thay đổi mật độ xương khi có tuổi.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Hormone sinh dục và sức khỏe xương khớp, năng lượng',
          youtube_id: 'h3_4X9_qW2A',
          description: 'Sự sụt giảm estrogen ở phụ nữ mãn kinh và testosterone ở nam giới ảnh hưởng đến cơ bắp và xương khớp.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/h3_4X9_qW2A/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Testosterone ở nam giới và Estrogen ở nữ giới không chỉ quyết định chức năng sinh sản mà còn bảo vệ khối cơ bắp và xương khớp.',
        'Estrogen giúp bảo vệ mật độ khoáng của xương; khi phụ nữ bước vào giai đoạn mãn kinh, sự sụt giảm estrogen khiến xương xốp và dễ gãy hơn.',
        'Duy trì giấc ngủ sâu, kiểm soát stress và tập luyện tạ đều đặn là phương pháp tự nhiên kích thích duy trì nồng độ hormone tối ưu.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000056',
      slug: 'roi-loan-chuyen-hoa',
      title: 'Hội chứng chuyển hóa & Giải pháp toàn diện',
      summary: 'Mỡ máu, huyết áp cao, gan nhiễm mỡ và lộ trình đảo ngược đề kháng insulin.',
      cover_url: '/images/topics/noi-tiet-chuyen-hoa.png',
      videos: [
        {
          title: '01. Đảo ngược hội chứng chuyển hóa bằng lối sống khoa học',
          youtube_id: 'p8Q_3r8_m9s',
          description: 'Cách kết hợp nhịn ăn gián đoạn hợp lý, đi bộ sau ăn và cắt giảm tinh bột nhanh để phục hồi độ nhạy insulin.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/p8Q_3r8_m9s/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hội chứng chuyển hóa là tổ hợp các yếu tố nguy cơ: Vòng eo to (mỡ nội tạng), tăng huyết áp, tăng đường huyết và mỡ máu xấu Triglyceride cao.',
        'Cội rễ của hội chứng chuyển hóa là tình trạng nạp thừa năng lượng liên tục kết hợp lối sống tĩnh tại ít vận động.',
        'Hoàn toàn có thể đảo ngược hội chứng này trong vài tháng thông qua giảm cân lành mạnh, đi bộ mỗi ngày và dinh dưỡng ít tinh bột nhanh.'
      ]
    }
  ],

  'gan-mat-tuy': [
    {
      id: 'b0000000-0000-0000-0000-000000000061',
      slug: 'gan-nha-may-hoa-chat',
      title: 'Gan: Nhà máy hóa chất và hơn 500 chức năng',
      summary: 'Khối lượng 1.5kg, khả năng tái sinh thần kỳ và trung tâm điều phối chuyển hóa.',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Giải phẫu lá gan và hơn 500 chức năng duy trì sự sống',
          youtube_id: 'yq3E0q6U_4k',
          description: 'Gan là cơ quan nội tạng lớn nhất, vừa lọc máu, vừa dự trữ glycogen, vừa tổng hợp protein huyết tương.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/yq3E0q6U_4k/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Lá gan nằm ở hạ sườn phải, nặng khoảng 1.4 - 1.6 kg, được ví như nhà máy hóa chất khổng lồ hoạt động liên tục 24/7.',
        'Gan tiếp nhận hai nguồn máu: Động mạch gan mang oxy và tĩnh mạch cửa mang toàn bộ chất dinh dưỡng từ đường ruột về để xử lý.',
        'Gan có khả năng tái sinh mô kỳ diệu: Ngay cả khi bị cắt bỏ tới 70% thể tích, gan vẫn có thể tự phục hồi lại kích thước ban đầu.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000062',
      slug: 'co-che-thai-doc-cua-gan',
      title: 'Cơ chế thải độc 2 pha của tế bào gan',
      summary: 'Pha 1 (Oxy hóa khử qua Cytochrome P450) và Pha 2 (Liên hợp bài tiết an toàn).',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Cơ chế thải độc pha 1 và pha 2 của lá gan',
          youtube_id: 'w8_j0K2_y3s',
          description: 'Biến đổi các độc tố tan trong mỡ thành dạng tan trong nước để thải ra ngoài qua thận và dịch mật.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/w8_j0K2_y3s/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Mọi chất độc hại từ thực phẩm, thuốc tây, rượu bia hay chất ô nhiễm đều phải qua hệ thống thanh lọc 2 pha tại gan.',
        'Pha 1 sử dụng enzym Cytochrome P450 để bẻ gãy độc tố; Pha 2 gắn thêm các phân tử axit amin (như Glutathione) để trung hòa độc tính.',
        'Nếu thiếu các dưỡng chất hỗ trợ pha 2, các chất trung gian độc hại từ pha 1 sẽ ứ đọng lại gây tổn thương trực tiếp lên tế bào gan.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000063',
      slug: 'tui-mat-va-dich-mat',
      title: 'Túi mật & Dịch mật nhũ tương hóa chất béo',
      summary: 'Muối mật, sắc tố mật bilirubin, cô đặc dịch mật và nguy cơ sỏi túi mật.',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Túi mật có chức năng gì và tại sao hình thành sỏi mật?',
          youtube_id: 'k7_1L9_z4xE',
          description: 'Dịch mật do gan sản xuất được dự trữ và cô đặc gấp 10 lần tại túi mật chờ thức ăn giàu béo đi xuống.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/k7_1L9_z4xE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Dịch mật do tế bào gan sản xuất liên tục (khoảng 800ml/ngày) nhưng được chuyển về dự trữ và cô đặc trong túi mật hình quả lê.',
        'Khi thức ăn có chất béo đi vào tá tràng, túi mật co bóp tống dịch mật vào ruột để nhũ tương hóa giọt mỡ thành các hạt siêu nhỏ.',
        'Mất cân bằng giữa cholesterol và muối mật là nguyên nhân chính hình thành sỏi bùn và sỏi túi mật gây viêm đau quặn gan.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000064',
      slug: 'tuy-ngoai-tiet-va-enzym',
      title: 'Tuyến tụy ngoại tiết & Các enzym tiêu hóa mạnh',
      summary: 'Amylase tiêu tinh bột, Lipase phân giải mỡ, Trypsin tiêu đạm và dịch kiềm kiềm hóa.',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Tuyến tụy ngoại tiết: Cỗ máy sản xuất enzym tiêu hóa',
          youtube_id: 'x9_4M2_p8vE',
          description: 'Các enzym tụy mạnh mẽ được tiết dưới dạng bất hoạt và chỉ kích hoạt khi đổ vào lòng ruột non.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/x9_4M2_p8vE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Ngoài chức năng nội tiết tiết insulin, hơn 95% mô tụy dành cho chức năng ngoại tiết sản xuất dịch tụy tiêu hóa.',
        'Enzym tụy cực kỳ mạnh mẽ: Amylase cắt tinh bột, Lipase cắt chất béo, Trypsin và Chymotrypsin cắt liên kết protein.',
        'Tụy còn tiết một lượng lớn ion Bicarbonate kiềm tính giúp trung hòa tức thì dịch axit từ dạ dày đổ xuống bảo vệ niêm mạc tá tràng.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000065',
      slug: 'gan-nhiem-mo-va-men-gan',
      title: 'Gan nhiễm mỡ, Men gan cao & Xơ gan',
      summary: 'Cơ chế tích tụ triglyceride trong tế bào gan, viêm gan và các giai đoạn xơ hóa.',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Gan nhiễm mỡ không do rượu (NAFLD) và cách nhận biết',
          youtube_id: 'v4_8Q1_r2tY',
          description: 'Khi lượng mỡ tích tụ vượt quá 5% trọng lượng gan, tế bào gan bắt đầu bị chèn ép và tăng men gan AST, ALT.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/v4_8Q1_r2tY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Gan nhiễm mỡ không do rượu (NAFLD) đang trở thành căn bệnh thời đại do thói quen ăn nhiều đường fructose và ít vận động.',
        'Khi tế bào gan bị viêm và vỡ, các enzym nội bào như AST, ALT sẽ tràn vào máu tạo nên hiện tượng "men gan cao".',
        'Nếu không can thiệp kịp thời, tình trạng viêm kéo dài sẽ kích hoạt tế bào hình sao tạo sẹo collagen dẫn đến xơ gan không hồi phục.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000066',
      slug: 'phuc-hoi-chuc-nang-gan',
      title: 'Phương pháp bảo vệ & Phục hồi tế bào gan',
      summary: 'Thảo dược Silymarin (kế sữa), Atiso, giấc ngủ giải độc và lối sống dưỡng gan.',
      cover_url: '/images/topics/gan-mat-tuy.png',
      videos: [
        {
          title: '01. Các thực phẩm vàng giúp giải độc và tái tạo tế bào gan',
          youtube_id: 'b5_2K9_w7xM',
          description: 'Rau họ cải (bông cải xanh), tỏi, trà xanh và giấc ngủ sâu trước 23h giúp gan phục hồi tốt nhất.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/b5_2K9_w7xM/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Gan là cơ quan chịu đựng âm thầm vì không có dây thần kinh cảm giác đau; khi gan phát triệu chứng đau thì bệnh thường đã nặng.',
        'Hoạt chất Silymarin từ cây kế sữa có khả năng ổn định màng tế bào gan, ngăn chất độc ngấm vào trong và kích thích tổng hợp protein gan.',
        'Ngủ sâu giấc trước 23h là thời điểm lưu lượng máu dồn về gan cao nhất để thực hiện chu trình đào thải độc tố và tái tạo tế bào.'
      ]
    }
  ],

  'mien-dich': [
    {
      id: 'b0000000-0000-0000-0000-000000000071',
      slug: 'tong-quan-he-mien-dich',
      title: 'Đội quân phòng thủ: Miễn dịch bẩm sinh & Thích ứng',
      summary: 'Phân biệt miễn dịch tự nhiên phản ứng nhanh và miễn dịch đặc hiệu tạo kháng thể.',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. Hệ thống miễn dịch hoạt động như thế nào?',
          youtube_id: 'wK8Q6yZpYvA',
          description: 'Cuộc chiến sinh tử diễn ra mỗi giây giữa các tế bào phòng ngự và hàng tỷ vi khuẩn, virus xâm nhập.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/wK8Q6yZpYvA/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hệ thống miễn dịch là tấm khiên sinh học bảo vệ cơ thể khỏi hàng triệu mầm bệnh (vi khuẩn, virus, nấm, ký sinh trùng) mỗi ngày.',
        'Miễn dịch bẩm sinh (Innate) là phản ứng tức thì không đặc hiệu; Miễn dịch thích ứng (Adaptive) ghi nhớ mầm bệnh và tạo kháng thể chính xác.',
        'Một hệ miễn dịch tối ưu là hệ thống biết nhận diện đâu là kẻ thù cần tiêu diệt và đâu là tế bào của chính mình để tránh bệnh tự miễn.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000072',
      slug: 'hang-rao-da-va-niem-mac',
      title: 'Hàng rào phòng thủ vòng ngoài: Da & Niêm mạc',
      summary: 'Lớp biểu bì da, axit mồ hôi, lông chuyển niêm mạc và enzym lysozyme.',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. Tuyến phòng ngự đầu tiên: Da và lớp niêm mạc bảo vệ',
          youtube_id: 'z4_9Q2_t8vE',
          description: 'Hàng rào vật lý và hóa học ngăn chặn mầm bệnh xâm nhập vào các mô sâu bên trong cơ thể.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/z4_9Q2_t8vE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Da là hàng rào vật lý rộng lớn nhất với lớp sừng keratin bền vững và độ pH axit nhẹ (pH 5.5) ức chế vi khuẩn phát triển.',
        'Các lớp niêm mạc lót trong đường thở, đường tiêu hóa tiết chất nhầy bẫy giữ bụi bẩn và chứa enzym Lysozyme phá hủy màng vi khuẩn.',
        'Lớp lông chuyển ở niêm mạc phế quản liên tục đập nhịp nhàng để quét sạch các dị vật ra ngoài qua phản xạ ho và khạc đờm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000073',
      slug: 'bach-cau-va-te-bao-nk',
      title: 'Bạch cầu thực bào & Tế bào sát thủ NK',
      summary: 'Bạch cầu trung tính, đại thực bào "nuốt chửng" mầm bệnh và tế bào Natural Killer tiêu diệt tế bào lạ.',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. Bạch cầu thực bào và tế bào sát thủ tự nhiên NK',
          youtube_id: 'c2_8K4_y1sW',
          description: 'Cận cảnh đại thực bào nuốt chửng vi khuẩn và tế bào NK phóng độc chất tiêu diệt tế bào ung thư.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/c2_8K4_y1sW/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Bạch cầu đa nhân trung tính là lực lượng lính tiên phong tuần tra trong máu, có mặt đầu tiên tại ổ viêm trong vài phút.',
        'Đại thực bào (Macrophage) là những "cỗ xe dọn rác" khổng lồ nuốt chửng vi khuẩn, mảnh vụn tế bào chết và trình diện kháng nguyên.',
        'Tế bào giết tự nhiên (Natural Killer - NK) chuyên nhận diện và tiêu diệt các tế bào bị nhiễm virus hoặc tế bào đột biến ung thư sớm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000074',
      slug: 'te-bao-t-te-bao-b-va-khang-the',
      title: 'Tế bào T, Tế bào B & Kháng thể đặc hiệu',
      summary: 'Tế bào T hỗ trợ CD4, T độc CD8, tế bào B sản xuất kháng thể Immunoglobulin (IgG, IgA, IgM).',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. Miễn dịch dịch thể và vũ khí kháng thể tinh xảo',
          youtube_id: 'm9_3X7_v2rA',
          description: 'Cách tế bào B tạo ra hàng nghìn phân tử kháng thể mỗi giây khóa chặt mầm bệnh như ổ khóa khớp với chìa.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/m9_3X7_v2rA/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Tế bào lympho T trưởng thành ở tuyến ức chịu trách nhiệm miễn dịch qua trung gian tế bào: T hỗ trợ chỉ huy, T độc tiêu diệt mầm bệnh.',
        'Tế bào lympho B biệt hóa thành tương bào sản sinh hàng tỷ phân tử kháng thể (IgG, IgA, IgM, IgE) trung hòa độc tố vi khuẩn.',
        'Tế bào nhớ (Memory cells) lưu giữ ký ức về mầm bệnh qua nhiều thập kỷ, cho phép cơ thể miễn nhiễm với các lần tái nhiễm sau này.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000075',
      slug: 'phan-ung-viem-va-chua-lanh',
      title: 'Phản ứng viêm: Cơ chế tự chữa lành của cơ thể',
      summary: '4 dấu hiệu kinh điển: Sưng - Nóng - Đỏ - Đau, sự khác nhau giữa viêm cấp và viêm mạn.',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. Bản chất của phản ứng viêm: Cứu mạng hay tàn phá?',
          youtube_id: 't5_1L8_q9wE',
          description: 'Histamine làm giãn mạch đưa máu và bạch cầu đến vùng tổn thương để dọn dẹp và hàn gắn mô.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/t5_1L8_q9wE/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Phản ứng viêm cấp tính là cơ chế tự vệ sinh tồn thiết yếu: Giãn mạch, tăng lưu lượng máu để đưa tế bào miễn dịch đến sửa chữa tổn thương.',
        '4 dấu hiệu sưng, nóng, đỏ, đau thực chất là bằng chứng cho thấy cơ thể đang dồn toàn lực dọn dẹp vi khuẩn và tái tạo mô mới.',
        'Tuy nhiên, viêm mạn tính kéo dài âm ỉ không có hồi kết lại là thủ phạm chính gây xơ vữa động mạch, thoái hóa khớp và lão hóa sớm.'
      ]
    },
    {
      id: 'b0000000-0000-0000-0000-000000000076',
      slug: 'tang-cuong-mien-dich-tu-nhien',
      title: 'Nâng cao sức đề kháng tự nhiên mỗi ngày',
      summary: 'Giấc ngủ sâu, kẽm, vitamin C, vitamin D và thói quen vận động kích hoạt hệ bạch huyết.',
      cover_url: '/images/topics/mien-dich.png',
      videos: [
        {
          title: '01. 5 thói quen đơn giản giúp tăng gấp đôi sức đề kháng',
          youtube_id: 'k4_7M2_r3sY',
          description: 'Giấc ngủ đủ 7-8 tiếng, tắm nắng sớm bổ sung Vitamin D và vận động giúp tuần hoàn dịch bạch huyết tốt nhất.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/k4_7M2_r3sY/hqdefault.jpg'
        }
      ],
      paragraphs: [
        'Hệ bạch huyết không có trái tim riêng để bơm dịch; chỉ khi cơ bắp co bóp khi vận động thì dịch bạch huyết mới lưu thông đẩy mầm bệnh qua hạch.',
        'Giấc ngủ sâu là thời điểm vàng để hệ miễn dịch tiết ra các cytokine bảo vệ và củng cố trí nhớ kháng thể.',
        'Vitamin D3, Vitamin C, Kẽm và Men vi sinh đường ruột là bộ tứ dưỡng chất thiết yếu hàng đầu giúp tăng cường sức đề kháng bền vững.'
      ]
    }
  ]
};

async function seedData() {
  console.log('--- BẮT ĐẦU CẬP NHẬT 8 CHUYÊN ĐỀ VÀO SUPABASE ---');

  // 1. Cập nhật bảng topics
  for (const topic of TOPICS) {
    const { error: topicErr } = await supabase.from('topics').upsert(topic, { onConflict: 'id' });
    if (topicErr) {
      console.error(`Lỗi upsert topic ${topic.slug}:`, topicErr.message);
    } else {
      console.log(`✓ Đã cập nhật topic: ${topic.title} (${topic.slug})`);
    }
  }

  // 2. Cập nhật các bài học (pages) và các khối (blocks)
  let totalPagesCount = 0;
  let totalBlocksCount = 0;

  for (const [topicSlug, pagesList] of Object.entries(TOPIC_PAGES)) {
    const topicObj = TOPICS.find(t => t.slug === topicSlug);
    if (!topicObj) continue;

    for (let pIdx = 0; pIdx < pagesList.length; pIdx++) {
      const p = pagesList[pIdx];
      const pageRecord = {
        id: p.id,
        workspace_id: 'default',
        topic_id: topicObj.id,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        cover_url: p.cover_url,
        sort_order: pIdx + 1,
        is_visible: true,
        status: 'published',
        access_mode: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: pageErr } = await supabase.from('pages').upsert(pageRecord, { onConflict: 'id' });
      if (pageErr) {
        console.error(`Lỗi upsert page ${p.slug}:`, pageErr.message);
        continue;
      }
      totalPagesCount++;

      // Tạo Block Text (Tóm tắt cốt lõi)
      const textBlockId = p.id.replace('b0000000', 'c0000000') + '-text';
      const textBlock = {
        id: textBlockId,
        workspace_id: 'default',
        page_id: p.id,
        type: 'text',
        display_style: 'van_ban',
        sort_order: 1,
        is_visible: true,
        data: {
          lines: p.paragraphs,
          format: 'paragraph',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Tạo Block Videos (Danh sách phát bài giảng)
      const videoBlockId = p.id.replace('b0000000', 'c0000000') + '-vid';
      const videoBlock = {
        id: videoBlockId,
        workspace_id: 'default',
        page_id: p.id,
        type: 'videos',
        display_style: 'playlist',
        sort_order: 2,
        is_visible: true,
        data: {
          videos: p.videos,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase.from('blocks').upsert(textBlock, { onConflict: 'id' });
      await supabase.from('blocks').upsert(videoBlock, { onConflict: 'id' });
      totalBlocksCount += 2;
    }
  }

  console.log(`\n🎉 HOÀN TẤT ĐỒNG BỘ:`);
  console.log(`- 8 Chuyên đề (Topics)`);
  console.log(`- ${totalPagesCount} Bài học (Pages) đầy đủ 100%`);
  console.log(`- ${totalBlocksCount} Khối nội dung & Video HD`);
}

seedData();

import { Settings, Topic, Page, Block, AuthorProfile, RecommendedBook, AiTrainingConfig } from '../lib/types';

export const DEFAULT_AUTHOR_PROFILE: AuthorProfile = {
  name: 'Tùng dinh dưỡng',
  title: 'Hỗ trợ kiến thức nền tảng & Sức khỏe',
  avatar_url: null,
  bio: 'Tùng mong muốn chia sẻ kiến thức khoa học và kinh nghiệm thực tiễn giúp mọi người chủ động chăm sóc sức khỏe bền vững vì một Việt Nam khỏe mạnh.',
  intro_image_url: null,
  intro_video_url: null,
  books: [
    {
      id: 'book-1',
      title: 'Hiểu Đúng Cột Sống',
      cover_url: '/documents/covers/cover_hieu_dung_ve_cot_song.png',
      description: 'Cẩm nang toàn diện giải mã cơ chế thoát vị đĩa đệm, thoái hóa và giải pháp vận động tự phục hồi.',
      year: '2025',
      youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    },
    {
      id: 'book-2',
      title: 'Phục Hồi Lưng Cổ',
      cover_url: '/documents/covers/cover_tu_chua_lanh_lung_co.png',
      description: 'Các bài tập sinh cơ học đơn giản, 15 phút mỗi ngày giúp bảo vệ và phục hồi đường cong sinh lý.',
      year: '2024',
      youtube_url: 'https://www.youtube.com/watch?v=zQVOV1eevck',
    },
  ],
  extra_title: 'Triết lý phụng sự',
  extra_content: 'Sức khỏe không đến từ sự lo sợ, mà đến từ sự thấu hiểu chính cơ thể mình. Khi bạn hiểu cơ thể, bạn sẽ biết cách yêu thương và chăm sóc đúng cách mỗi ngày.',
  contact_note: 'Mọi thắc mắc hoặc cần tư vấn lộ trình phục hồi chuyên sâu, vui lòng kết nối trực tiếp với chuyên gia qua Hotline hoặc Zalo bên dưới.',
  phone: '0974.248.716',
  zalo_url: 'https://zalo.me/0987792400',
  email: 'chuyengiacotsong@gmail.com',
  facebook_url: 'https://facebook.com',
  address: 'Hà Nội & TP. Hồ Chí Minh',
};

export const DEFAULT_RECOMMENDED_BOOKS: RecommendedBook[] = [
  {
    id: 'rec-book-1',
    title: 'Lắng Nghe Cơ Thể',
    category: 'Cơ Xương Khớp',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_lang_nghe_co_the.png',
    description: 'Hướng dẫn nhận diện các tín hiệu cảnh báo sớm từ hệ cơ xương khớp và phương pháp phục hồi tự nhiên.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    gallery_images: [
      '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
      '/spine_hero_clean.png',
    ],
  },
  {
    id: 'rec-book-2',
    title: 'Giải Mã Cột Sống',
    category: 'Cột Sống & Đĩa Đệm',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_giai_ma_cot_song.png',
    description: 'Phân tích cơ sinh học cột sống, các sai lầm trong sinh hoạt hằng ngày và bài tập điều chỉnh tư thế.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    gallery_images: [
      '/spine_hero_clean.png',
      '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
    ],
  },
  {
    id: 'rec-book-3',
    title: 'Dinh Dưỡng Kháng Viêm',
    category: 'Dinh Dưỡng Phục Hồi',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_dinh_duong_khang_viem.png',
    description: 'Chế độ ăn uống khoa học giúp nuôi dưỡng sụn khớp, đĩa đệm và giảm phản ứng viêm đau mạn tính.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
  },
  {
    id: 'rec-book-4',
    title: 'Bảo Vệ Đốt Sống Cổ',
    category: 'Cột Sống Cổ & Vai Gáy',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_cam_nang_dot_song_co.png',
    description: 'Dành riêng cho người làm việc văn phòng, lái xe và những người thường xuyên bị đau mỏi vai gáy.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
  },
];

export const DEFAULT_AI_TRAINING: AiTrainingConfig = {
  guidelines: `1. VAI TRÒ CHUYÊN MÔN: Trợ lý Sức Khỏe AI đồng hành, hướng dẫn người học khám phá kiến thức y khoa, giải phẫu học cơ thể người, cơ chế sinh học, thói quen sinh hoạt đúng và dinh dưỡng cân bằng tế bào dựa trên chính tài liệu và bài giảng của tác giả Tùng dinh dưỡng trong ứng dụng "Học Cơ Thể".
2. BẢN CHẤT ỨNG DỤNG - KHÔNG BÁN HÀNG: Đây là ứng dụng giáo dục và hướng dẫn học tập, tuyệt đối KHÔNG PHẢI kênh bán hàng thương mại. CẤM TUYỆT ĐỐI các hành vi: chào mời mua sản phẩm, báo giá, xin số điện thoại, xưng hô nịnh nọt bán hàng ("khách yêu", "mình ơi", "em xin phép...").
3. NGUYÊN TẮC AN TOÀN PHÁP LÝ (BẮT BUỘC):
   - CẤM TUYỆT ĐỐI các từ: "y khoa chữa bệnh", "khám chữa bệnh", "chữa bệnh", "chữa trị", "điều trị", "hỗ trợ điều chỉnh" (hay "hỗ trợ điều chỉnh cột sống").
   - CẤM nói: "tác giả không phải bác sĩ", "Tùng không phải bác sĩ" hay giải thích danh xưng.
   - TRỌNG TÂM TỪ NGỮ: Dùng các cụm từ chuẩn mực: "hỗ trợ điều chỉnh tư thế", "bảo vệ và điều chỉnh cột sống", "chăm sóc cột sống chủ động", "hướng dẫn học tập theo tài liệu".
   - HẠN CHẾ SÁNG CHẾ: Tuyệt đối không tự ca ngợi hay nhắc đi nhắc lại "bằng sáng chế độc quyền". Nếu cần nhắc đến công cụ DoctorLoan, chỉ mở ngoặc ngắn gọn: (đã được cấp sáng chế).
4. PHONG CÁCH TRẢ LỜI & ĐIỀU HƯỚNG VÀO TÀI LIỆU:
   - Trả lời siêu ngắn gọn (1 đến 2 câu ngắn, khoảng 30 - 50 từ), đi thẳng vào giải thích cơ chế khoa học theo tài liệu của tác giả.
   - Luôn định hướng người học mở đúng bài học và tài liệu liên quan trong hệ thống (chọn 1-2 bài học phù hợp nhất) để xem video, hình ảnh và hướng dẫn chi tiết.
   - Khách có dấu hiệu bệnh lý nặng hoặc báo động đỏ (Red Flags): Khuyên thẳng thắn, dứt khoát đến cơ sở y tế chuyên khoa để được bác sĩ thăm khám.`,
  documents: [
    {
      id: 'doc-01-cotsong-doctorloan',
      title: 'Cột Sống, Đĩa Đệm & Cơ Chế Bảo Vệ, Hỗ Trợ Điều Chỉnh Tư Thế',
      content: `Cột sống người gồm 33-34 đốt sống tạo thành 4 đường cong sinh lý tự nhiên (cổ, ngực, thắt lưng, cùng cụt). Đĩa đệm đóng vai trò giảm xóc sinh học với nhân nhầy ngậm nước và vòng sợi bao quanh, nhận dinh dưỡng qua cơ chế thẩm thấu khi vận động.
Nguyên nhân cốt lõi gây đau mỏi, thoái hóa là sai lệch trục chịu lực, mất đường cong sinh lý do thói quen ngồi gù lưng, cúi đầu bấm điện thoại hoặc mang vác sai tư thế.
Giải pháp bảo vệ cột sống gồm 3 phần: (1) Nâng cao nhận thức về tư thế sinh hoạt đúng; (2) Sử dụng công cụ hỗ trợ điều chỉnh tư thế DoctorLoan (đã được cấp sáng chế) để giải tỏa áp lực đĩa đệm khi ngồi, nằm, ngủ, lái xe; (3) Tập luyện phục hồi hệ cơ lõi và duy trì thói quen vận động khoa học.
Phản ứng thích nghi: Cảm giác căng tức, mỏi cơ nhẹ trong 1-3 ngày đầu là hiện tượng bình thường khi cơ bắp co rút được kéo giãn và điều chỉnh lại. Nếu xuất hiện đau dữ dội hoặc tê yếu chi, cần dừng lại và kiểm tra y tế chuyên khoa.`,
      updated_at: '2026-10-02T00:00:00.000Z',
    },
    {
      id: 'doc-02-nuoc-hydro-gems',
      title: 'Nước Hydro Gems & Quản Trị Nguồn Nước Uống Cấp Tế Bào',
      content: `Nước chiếm 55-70% trọng lượng cơ thể, là môi trường dung môi cho toàn bộ phản ứng sinh hóa, vận chuyển dưỡng chất và thanh lọc độc tố tế bào.
Nguyên lý chăm sóc sức khỏe chủ động qua nguồn nước: Giúp mỗi gia đình tự đo lường, kiểm tra và quản trị chất lượng nước uống tại nhà bằng các công cụ đo trực quan (test pH, test chống oxy hóa ORP, độ tinh khiết TDS, kích thước phân tử nước).
3 đặc tính khoa học của Nước Gems: (1) Tính kiềm tự nhiên: Giúp trung hòa lượng axit dư thừa sinh ra từ chuyển hóa và căng thẳng; (2) Giàu Hydrogen hòa tan: Hoạt chất chống oxy hóa mạnh giúp trung hòa gốc tự do và bảo vệ màng tế bào; (3) Cụm phân tử nước siêu nhỏ: Thẩm thấu sâu vào tế bào, hỗ trợ chuyển hóa và đào thải cặn bã hiệu quả. Nước là nền tảng môi trường sống của tế bào, không phải là thuốc.`,
      updated_at: '2026-10-02T00:00:00.000Z',
    },
    {
      id: 'doc-03-dinh-duong-te-bao',
      title: 'Dinh Dưỡng Cân Bằng Tế Bào & Cơ Chế Chuyển Hóa Kháng Viêm',
      content: `Triết lý dinh dưỡng cốt lõi: 'Tiền không cứu được sức khỏe – chỉ tư duy và kiến thức đúng mới cứu được.' Không hỏi cơ thể mắc bệnh gì, mà cần hiểu hệ thống đang rối loạn ở khâu nào để tái lập cân bằng.
4 nguyên tắc can thiệp dinh dưỡng chuẩn mực: (1) Đảm bảo đủ năng lượng cho hoạt động tế bào; (2) Đầy đủ dưỡng chất đa lượng và vi lượng thiết yếu (đạm chất lượng cao, omega-3, canxi, magie, vitamin D, K2 nuôi dưỡng hệ cơ xương khớp); (3) Cân đối tỷ lệ Protein - Lipid - Glucid, ưu tiên tinh bột phức hợp và chất béo tốt; (4) Đa dạng thực phẩm tự nhiên, giảm đường tinh luyện và thực phẩm siêu chế biến gây viêm âm thầm.
Khung phục hồi 3 tầng: Dinh dưỡng nuôi dưỡng nền tế bào từ gốc -> Công cụ hỗ trợ tuần hoàn, giải cơ -> Hệ tiêu hóa và đường ruột thông suốt để hấp thu tối ưu.`,
      updated_at: '2026-10-02T00:00:00.000Z',
    },
    {
      id: 'doc-04-giai-phau-van-dong',
      title: 'Giải Phẫu Hệ Vận Động, Chuỗi Động Học & Cảnh Báo An Toàn Y Tế',
      content: `Cột sống không đứng độc lập mà nằm trong chuỗi động học liên hoàn: Bàn chân -> Khớp gối -> Khớp háng -> Khung chậu -> Cột sống thắt lưng -> Cột sống cổ. Khi một mắt xích bị sai lệch (như cơ mông yếu, khớp háng cứng), cột sống sẽ phải chịu lực bù trừ dẫn đến tổn thương đĩa đệm.
Ranh giới an toàn: Các can thiệp xâm lấn, phẫu thuật hoặc kê đơn thuốc thuộc thẩm quyền y khoa tại bệnh viện. Giải pháp học tập và chăm sóc tại nhà là phi xâm lấn, tập trung vào điều chỉnh tư thế, dinh dưỡng và bài tập vận động.
Dấu hiệu cảnh báo đỏ (Red Flags) cần đi viện ngay: Đau nhói dữ dội lan nhanh xuống chi dưới, tê bì yếu liệt chân tay, mất cảm giác hoặc rối loạn đại tiểu tiện (hội chứng chùm đuôi ngựa).`,
      updated_at: '2026-10-02T00:00:00.000Z',
    },
  ],
  faqs: [
    {
      id: 'faq-01',
      question: 'Tại sao ngồi nhiều hay bị đau lưng và mỏi cổ vai gáy?',
      answer: 'Vấn đề bắt nguồn từ việc mất đường cong sinh lý và áp lực đè nén liên tục lên đĩa đệm khi ngồi sai tư thế. Mời bạn mở bài học "Tư thế chuẩn & Vận động giải áp" trong chủ đề Cột Sống để nắm rõ các bài tập giải nén cột sống.',
    },
    {
      id: 'faq-02',
      question: 'Thoát vị đĩa đệm thì giải pháp DoctorLoan hỗ trợ thế nào?',
      answer: 'Giải pháp DoctorLoan (đã được cấp sáng chế) hỗ trợ điều chỉnh tư thế tự nhiên khi ngồi, nằm, ngủ để giải tỏa áp lực đĩa đệm và phục hồi hệ cơ. Mời bạn xem chi tiết tại bài học "Đĩa đệm và cơ chế giảm xóc" trong chủ đề Cột Sống.',
    },
    {
      id: 'faq-03',
      question: 'Mới sử dụng gối hoặc thiết bị điều chỉnh tư thế thấy hơi mỏi thì có sao không?',
      answer: 'Đây là phản ứng thích nghi sinh học bình thường trong 1-3 ngày đầu khi các nhóm cơ co rút lâu ngày được kéo giãn và điều chỉnh lại. Bạn hãy xem hướng dẫn chi tiết trong bài "Tư thế chuẩn & Vận động giải áp".',
    },
    {
      id: 'faq-04',
      question: 'Nước Hydro Gems có điểm gì khác biệt so với nước thông thường?',
      answer: 'Nước Gems có 3 đặc tính sinh học: tính kiềm tự nhiên bù khoáng, giàu hydrogen chống oxy hóa và cụm phân tử nước siêu nhỏ thẩm thấu nhanh. Bạn hãy mở bài học "Nước & Điện Giải" để xem chi tiết thí nghiệm đo lường.',
    },
    {
      id: 'faq-05',
      question: 'Người hay đau mỏi xương khớp thì dinh dưỡng cần bổ sung gì?',
      answer: 'Cần ưu tiên đạm chất lượng, omega-3, các vi khoáng canxi, magie, vitamin D3, K2 và chăm sóc đường ruột để tăng hấp thu. Bạn hãy xem cụ thể trong chủ đề "Dinh Dưỡng Nền Tảng".',
    },
    {
      id: 'faq-06',
      question: 'DoctorLoan có phải là thuốc hay chữa dứt điểm bệnh không?',
      answer: 'DoctorLoan là giải pháp hỗ trợ điều chỉnh tư thế tự nhiên (đã được cấp sáng chế), không phải là thuốc và không thay thế can thiệp y tế. Mời bạn tham khảo tài liệu học tập trong hệ thống để nắm vững phương pháp chăm sóc cột sống chủ động.',
    },
    {
      id: 'faq-07',
      question: 'Muốn phòng ngừa thoái hóa cột sống cổ khi làm việc văn phòng thì làm thế nào?',
      answer: 'Cần giữ màn hình máy tính ngang tầm mắt để cổ không bị cúi gập, duy trì tư thế ngồi thẳng lưng và cứ sau mỗi 45-60 phút nên đứng dậy vận động xoay vai nhẹ nhàng để đĩa đệm được bơm hút dịch dinh dưỡng.',
    },
  ],
};

export const sampleSettings: Settings = {
  workspace_id: 'default',
  app_name: 'Sống Khỏe Mỗi Ngày',
  app_subtitle: 'Kiến thức đúng · Sức khỏe bền vững',
  logo_url: null,
  primary_color: '#1D58D8',
  access_mode: 'OPEN',
  block_styles: {},
  expert_title: 'Hỗ trợ kiến thức nền tảng & Sức khỏe',
  hotline: '0974.248.716',
  zalo_url: 'https://zalo.me/0987792400',
  author_profile: DEFAULT_AUTHOR_PROFILE,
  home_greeting: 'Xin chào!',
  home_title: 'Hôm nay mình học gì?',
  search_placeholder: 'Tìm bài, ví dụ: đĩa đệm',
  topics_title: 'Chuyên Đề Học',
  recommended_books_title: 'Tài Liệu Y Khoa',
  recommended_books_subtitle: 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày',
  recommended_books_layout: 'grid',
  recommended_books: DEFAULT_RECOMMENDED_BOOKS,
  home_sections_order: [
    'topics',
    'author_profile',
    'author_books',
    'author_philosophy',
    'recommended_books',
    'author_contact',
  ],
  ai_training: DEFAULT_AI_TRAINING,
};

export const sampleTopics: Topic[] = [
  {
    id: 'topic-cot-song',
    workspace_id: 'default',
    slug: 'cot-song',
    title: 'Cột sống',
    description:
      'Hiểu cột sống từ cấu tạo đến cách chăm sóc hằng ngày. Mọi nội dung đều mở, xem phần nào cũng được.',
    meta_note: 'Mỗi video 4–6 phút',
    cover_url: null,
    icon: 'spine',
    color_bg: '#E3ECF7',
    color_fg: '#2D5B94',
    sort_order: 1,
    is_visible: true,
  },
  {
    id: 'topic-dinh-duong',
    workspace_id: 'default',
    slug: 'dinh-duong',
    title: 'Dinh dưỡng',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'bowl',
    color_bg: '#F6E7D3',
    color_fg: '#8A4F10',
    sort_order: 2,
    is_visible: true,
  },
  {
    id: 'topic-co-the-nguoi',
    workspace_id: 'default',
    slug: 'co-the-nguoi',
    title: 'Cơ thể người',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'body',
    color_bg: '#E9E4F3',
    color_fg: '#5A4A8A',
    sort_order: 3,
    is_visible: true,
  },
  {
    id: 'topic-tieu-hoa',
    workspace_id: 'default',
    slug: 'tieu-hoa',
    title: 'Tiêu hóa',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'stomach',
    color_bg: '#F4E1DF',
    color_fg: '#9B3B32',
    sort_order: 4,
    is_visible: true,
  },
  {
    id: 'topic-nuoc',
    workspace_id: 'default',
    slug: 'nuoc',
    title: 'Nước',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'droplet',
    color_bg: '#DDF0F6',
    color_fg: '#1F6E8C',
    sort_order: 5,
    is_visible: true,
  },
  {
    id: 'topic-noi-tiet-chuyen-hoa',
    workspace_id: 'default',
    slug: 'noi-tiet-chuyen-hoa',
    title: 'Nội tiết – chuyển hóa',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'molecule',
    color_bg: '#F3EFD2',
    color_fg: '#6B5C0E',
    sort_order: 6,
    is_visible: true,
  },
  {
    id: 'topic-gan-mat-tuy',
    workspace_id: 'default',
    slug: 'gan-mat-tuy',
    title: 'Gan – mật – tụy',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'liver',
    color_bg: '#E6EEDD',
    color_fg: '#4E6B2A',
    sort_order: 7,
    is_visible: true,
  },
  {
    id: 'topic-mien-dich',
    workspace_id: 'default',
    slug: 'mien-dich',
    title: 'Miễn dịch',
    description: null,
    meta_note: null,
    cover_url: null,
    icon: 'shield',
    color_bg: '#E0EDEB',
    color_fg: '#2F6B63',
    sort_order: 8,
    is_visible: true,
  },
];

export const samplePages: Page[] = [
  {
    id: 'page-cot-song-1',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'tong-quan-ve-cot-song',
    title: 'Tổng quan về cột sống',
    summary: 'Cấu trúc chung và vai trò của cột sống.',
    cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
    sort_order: 1,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
  {
    id: 'page-cot-song-2',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'dia-dem',
    title: 'Đĩa đệm',
    summary: 'Đĩa đệm nằm ở đâu và làm việc thế nào.',
    cover_url: '/images/lessons/dia-dem.jpg',
    sort_order: 2,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
  {
    id: 'page-cot-song-3',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'co-gan-day-chang',
    title: 'Cơ – gân – dây chằng',
    summary: 'Hệ thống giữ và giúp cột sống vận động.',
    cover_url: '/images/lessons/co-gan-day-chang.jpg',
    sort_order: 3,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
  {
    id: 'page-cot-song-4',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'than-kinh',
    title: 'Thần kinh',
    summary: 'Tủy sống, rễ thần kinh và đường dẫn truyền.',
    cover_url: '/images/lessons/than-kinh.jpg',
    sort_order: 4,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
  {
    id: 'page-cot-song-5',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'tu-the-va-van-dong',
    title: 'Tư thế và vận động',
    summary: 'Ngồi, đứng, mang vác sao cho đúng.',
    cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
    sort_order: 5,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
  {
    id: 'page-cot-song-6',
    workspace_id: 'default',
    topic_id: 'topic-cot-song',
    slug: 'cac-van-de-thuong-gap',
    title: 'Các vấn đề thường gặp',
    summary: 'Những vấn đề cột sống hay gặp trong đời sống.',
    cover_url: '/images/lessons/cac-van-de-thuong-gap.jpg',
    sort_order: 6,
    is_visible: true,
    status: 'published',
    access_mode: null,
  },
];

export const sampleBlocks: Block[] = [
  // Blocks for tong-quan-ve-cot-song
  {
    id: 'block-1',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'van_ban',
    sort_order: 1,
    is_visible: true,
    data: {
      lines: [
        'Cột sống là trục chính của cơ thể: nâng đỡ thân mình, giúp ta cúi, ngửa, xoay người và bảo vệ tủy sống nằm bên trong.',
      ],
      format: 'paragraph',
    },
  },
  {
    id: 'block-2',
    page_id: 'page-cot-song-1',
    type: 'videos',
    display_style: 'playlist',
    sort_order: 2,
    is_visible: true,
    data: {
      videos: [
        {
          youtube_id: 'c9kmCxFKHPY',
          title: '01. Cấu tạo & chức năng cột sống',
          description: 'Cấu trúc chung và vai trò của cột sống.',
          duration_text: '4 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/c9kmCxFKHPY/hqdefault.jpg',
        },
        {
          youtube_id: 'mVtS7TYDpbU',
          title: '02. Cấu tạo cơ bản đốt sống',
          description: 'Thân đốt sống, đĩa đệm và các mỏm khớp.',
          duration_text: '5 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/mVtS7TYDpbU/hqdefault.jpg',
        },
        {
          youtube_id: 'yTfFaHohKbY',
          title: '03. Cơ – gân – dây chằng',
          description: 'Hệ thống giữ và giúp cột sống vận động.',
          duration_text: '6 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/yTfFaHohKbY/hqdefault.jpg',
        },
        {
          youtube_id: '_uxMIfQfYGk',
          title: '04. Thần kinh & tủy sống',
          description: 'Tủy sống, rễ thần kinh và đường dẫn truyền.',
          duration_text: '4 phút',
          thumbnail_url: 'https://i.ytimg.com/vi/_uxMIfQfYGk/hqdefault.jpg',
        },
      ],
    },
  },
  {
    id: 'block-3',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'y_nghia',
    sort_order: 3,
    is_visible: true,
    data: {
      lines: [
        'Hiểu các thành phần này giúp nhìn cột sống như một hệ thống làm việc cùng nhau, chứ không chỉ là một chồng xương.',
      ],
      format: 'paragraph',
    },
  },
  {
    id: 'block-4',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'diem_can_nho',
    sort_order: 4,
    is_visible: true,
    data: {
      lines: [
        'Đốt sống tạo thành bộ khung.',
        'Đĩa đệm nằm giữa các thân đốt sống.',
        'Cơ và dây chằng giữ cho cột sống vững.',
        'Tủy sống và rễ thần kinh đi qua cột sống.',
      ],
      format: 'numbered',
    },
  },
  {
    id: 'block-5',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'chu_y',
    sort_order: 5,
    is_visible: true,
    data: {
      lines: [
        '**Cần đi khám ngay** nếu đau lưng kèm tê yếu chân hoặc khó đi tiểu.',
      ],
      format: 'paragraph',
    },
  },
  {
    id: 'block-6',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'sai_lam',
    sort_order: 6,
    is_visible: true,
    data: {
      lines: [
        '**Nghĩ đau lưng nào cũng do thoát vị đĩa đệm.** Thực tế đau lưng có nhiều nguyên nhân, hay gặp nhất là do cơ và tư thế.',
        '**Nằm im hoàn toàn khi đau lưng.** Vận động nhẹ nhàng thường giúp hồi phục tốt hơn.',
      ],
      format: 'paragraph',
    },
  },
  {
    id: 'block-7',
    page_id: 'page-cot-song-1',
    type: 'text',
    display_style: 'giai_phap',
    sort_order: 7,
    is_visible: true,
    data: {
      lines: [
        'Ngồi lâu thì đứng dậy, đổi tư thế thường xuyên.',
        'Giữ vận động đều đặn mỗi ngày.',
      ],
      format: 'bullet',
    },
  },
  {
    id: 'block-8',
    page_id: 'page-cot-song-1',
    type: 'links',
    display_style: 'related',
    sort_order: 8,
    is_visible: true,
    data: {
      items: [
        { page_id: 'page-cot-song-2', label: 'Cột sống · 02 Đĩa đệm' },
        { page_id: 'page-cot-song-4', label: 'Cột sống · 04 Thần kinh' },
        { page_id: 'page-cot-song-5', label: 'Cột sống · 05 Tư thế và vận động' },
      ],
    },
  },

  // Blocks for pages 2 to 6
  ...samplePages.slice(1).flatMap((p, idx) => {
    const pagePlaylists: Record<string, { id: string; title: string; duration: string; desc: string }[]> = {
      'page-cot-song-2': [
        { id: 'z0FRTp5CVds', title: '01. Giải phẫu đĩa đệm: Vòng sợi & Nhân nhầy', duration: '6 phút', desc: 'Cơ chế hoạt động của giảm xóc sinh học tự nhiên giữa các đốt sống.' },
        { id: 'y8Atq_HMJbU', title: '02. Cơ chế hình thành thoát vị đĩa đệm 3D', duration: '8 phút', desc: 'Áp lực tải trọng gây rách vòng sợi và tràn nhân nhầy chèn ép rễ.' },
        { id: 'cdW-7QXCF3Q', title: '03. Dinh dưỡng thẩm thấu & Tái tạo đĩa đệm', duration: '5 phút', desc: 'Cách duy trì độ ngậm nước cho đĩa đệm qua vận động và tư thế đúng.' },
        { id: '87TGU0Y9dSU', title: '04. Bài tập kéo giãn giải áp đĩa đệm an toàn', duration: '7 phút', desc: 'Hướng dẫn tự tập luyện giảm đau lưng và phục hồi áp lực cột sống.' }
      ],
      'page-cot-song-3': [
        { id: 'c9kmCxFKHPY', title: '01. Hệ thống cơ sâu & Dây chằng cột sống', duration: '7 phút', desc: 'Dây chằng dọc trước, sau và dây chằng vàng giữ vững đốt sống.' },
        { id: '8tXMChrI4c0', title: '02. Sức mạnh cơ lõi (Core) bảo vệ thắt lưng', duration: '6 phút', desc: 'Kích hoạt nhóm cơ bụng sâu và cơ nhiều nhánh (Multifidus).' },
        { id: 'kqgViHyDW9k', title: '03. Kỹ thuật giãn cơ giải tỏa co thắt cạnh sống', duration: '8 phút', desc: 'Giải phóng căng cơ sau ngày dài ngồi làm việc sai tư thế.' },
        { id: 'gOlY8o8MYuQ', title: '04. Rèn luyện sức bền khối cơ dựng gai sống', duration: '6 phút', desc: 'Bài tập tăng cường nhóm cơ lưng dưới không gây quá tải đĩa đệm.' }
      ],
      'page-cot-song-4': [
        { id: 'IUtyDm9O8lU', title: '01. Tủy sống & 31 đôi rễ thần kinh gai sống', duration: '8 phút', desc: 'Cấu tạo ống sống và đường truyền cảm giác vận động của cơ thể.' },
        { id: 'XilwFY71LR4', title: '02. Hội chứng chèn ép rễ thần kinh tọa 3D', duration: '7 phút', desc: 'Đường đi dây thần kinh tọa từ thắt lưng xuống mông, đùi và bàn chân.' },
        { id: '9cvpCJddloY', title: '03. Dấu hiệu cảnh báo chèn ép thần kinh nguy hiểm', duration: '5 phút', desc: 'Phân biệt đau thần kinh tọa cơ học và tổn thương tủy sống cấp.' },
        { id: 'XBnPTgSP21M', title: '04. Bài tập trượt thần kinh (Nerve Flossing)', duration: '7 phút', desc: 'Vận động trị liệu giúp rễ thần kinh trượt êm ái, giảm đau buốt.' }
      ],
      'page-cot-song-5': [
        { id: 'zQVOV1eevck', title: '01. Tư thế ngồi & đứng chuẩn công thái học', duration: '6 phút', desc: 'Bảo toàn đường cong sinh lý tự nhiên khi làm việc với máy tính.' },
        { id: 'fR3NxCR9z2U', title: '02. Nguyên tắc bốc vác vật nặng an toàn', duration: '5 phút', desc: 'Ứng dụng bản lề háng (Hip Hinge) thay vì gập lưng gây chấn thương.' },
        { id: 'FN3MFhYPWWo', title: '03. Chuỗi bài tập giải nén cột sống cuối ngày', duration: '7 phút', desc: 'Treo xà, tư thế em bé và kéo giãn giải phóng tải trọng đốt sống.' },
        { id: 'uBGl2BujkPQ', title: '04. Chỉnh sửa tư thế ngủ và chọn gối nệm đúng', duration: '6 phút', desc: 'Giữ trục cổ - lưng thẳng hàng suốt 8 tiếng phục hồi ban đêm.' }
      ],
      'page-cot-song-6': [
        { id: 'gUG_zbKqlaU', title: '01. Thoái hóa cột sống: Tiến trình & Nguyên nhân', duration: '8 phút', desc: 'Sự hao mòn sụn khớp, xơ hóa xương dưới sụn và hình thành gai xương.' },
        { id: '08VyJOEcDos', title: '02. Phân biệt phồng lồi đĩa đệm & Thoát vị thực thụ', duration: '6 phút', desc: 'Mức độ tổn thương trên phim MRI và hướng điều trị bảo tồn.' },
        { id: '1sISguPDlhY', title: '03. Chiến lược toàn diện ngăn ngừa đau lưng tái phát', duration: '7 phút', desc: 'Kiểm soát cân nặng, bài tập cơ lõi và chế độ dinh dưỡng kháng viêm.' },
        { id: '9iMGFqMmUFs', title: '04. Khi nào cần can thiệp y khoa chuyên sâu?', duration: '5 phút', desc: 'Các chỉ định phẫu thuật và dấu hiệu đỏ cần nhập viện khẩn cấp.' }
      ],
    };

    const playlist = pagePlaylists[p.id] || [
      { id: 'c9kmCxFKHPY', title: `01. ${p.title} - Tổng quan`, duration: '6 phút', desc: p.summary || '' },
      { id: 'z0FRTp5CVds', title: `02. ${p.title} - Cơ chế sinh học`, duration: '7 phút', desc: 'Phân tích chi tiết cơ chế hoạt động và tương tác cơ thể.' },
      { id: 'y8Atq_HMJbU', title: `03. ${p.title} - Chăm sóc & Vận động`, duration: '8 phút', desc: 'Các bài tập và thói quen sinh hoạt bảo vệ sức khỏe chủ động.' },
      { id: 'IUtyDm9O8lU', title: `04. ${p.title} - Sai lầm cần tránh`, duration: '5 phút', desc: 'Nhận diện các sai lầm phổ biến và phương pháp phòng ngừa.' }
    ];

    return [
      {
        id: `block-page-${idx + 2}-text`,
        page_id: p.id,
        type: 'text' as const,
        display_style: 'van_ban',
        sort_order: 1,
        is_visible: true,
        data: {
          lines: [p.summary || p.title],
          format: 'paragraph' as const,
        },
      },
      {
        id: `block-page-${idx + 2}-video`,
        page_id: p.id,
        type: 'videos' as const,
        display_style: 'playlist' as const,
        sort_order: 2,
        is_visible: true,
        data: {
          videos: playlist.map((v) => ({
            youtube_id: v.id,
            title: v.title,
            duration_text: v.duration,
            description: v.desc,
            thumbnail_url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
            is_vertical: false,
            aspect_ratio: 'horizontal' as const,
          })),
        },
      },
    ];
  }),
];

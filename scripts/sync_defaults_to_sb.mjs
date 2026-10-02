import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const DEFAULT_AUTHOR_PROFILE = {
  name: 'Tùng Dinh Dưỡng',
  title: 'Hỗ trợ kiến thức nền tảng',
  avatar_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/f4085260-0601-4bda-ab26-4fd63457cd7f.webp',
  bio: 'Hơn 10 năm nghiên cứu và ứng dụng giải phẫu cơ xương khớp, dinh dưỡng sinh học và phục hồi chức năng tự nhiên. Đồng hành cùng hàng ngàn học viên thấu hiểu cơ thể để tự chăm sóc sức khỏe chủ động và bền vững.',
  intro_image_url: null,
  intro_video_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
  books: [
    {
      id: 'book-1',
      title: 'Hiểu Đúng Về Cột Sống',
      cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
      description: 'Cẩm nang toàn diện về giải phẫu cột sống, cơ chế thoái hóa thoát vị đĩa đệm và lộ trình phục hồi vận động an toàn tại nhà.',
      year: '2025',
      youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
      gallery_images: [
        'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
        'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp'
      ],
      is_visible: true,
    },
    {
      id: 'book-2',
      title: 'Tự Chữa Lành Lưng & Cổ',
      cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp',
      description: 'Phương pháp giải áp đĩa đệm tự nhiên, cân bằng chuỗi cơ sâu và chế độ sinh hoạt chuẩn y khoa cho người làm việc văn phòng.',
      year: '2024',
      youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
      gallery_images: [
        'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp'
      ],
      is_visible: true,
    },
  ],
  extra_title: 'Triết lý phụng sự',
  extra_content: '“Sức khỏe không đến từ sự lo sợ, mà đến từ sự thấu hiểu chính cơ thể mình. Khi bạn hiểu cơ thể, bạn sẽ biết cách yêu thương và chăm sóc đúng cách mỗi ngày.”',
  contact_note: 'Tư vấn giải đáp thắc mắc chuyên môn và lộ trình phục hồi sức khỏe cá nhân hóa trực tiếp cùng chuyên gia.',
  phone: '0974.248.716',
  zalo_url: 'https://zalo.me/0987792400',
  email: 'tungdinhduong@gmail.com',
  facebook_url: 'https://facebook.com/tung.nutrition',
  address: 'Hà Nội',
};

const DEFAULT_RECOMMENDED_BOOKS = [
  {
    id: 'rec-1',
    title: 'Lắng Nghe Cơ Thể Để Tự Chữa Lành',
    category: 'Cơ Xương Khớp',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
    description: 'Hướng dẫn nhận biết sớm các tín hiệu cảnh báo đau nhức cơ xương khớp và cách lắng nghe cơ thể để can thiệp kịp thời.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    tag: 'Cơ Xương Khớp',
    color_theme: 'blue',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp'
    ],
    is_visible: true,
  },
  {
    id: 'rec-2',
    title: 'Giải Mã Cột Sống & Vận Động Đúng',
    category: 'Cột Sống',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp',
    description: 'Phân tích sinh cơ học cột sống, tư thế chuẩn trong sinh hoạt và các bài tập tăng cường sức bền đĩa đệm.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    tag: 'Cột Sống',
    color_theme: 'amber',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/27facdbb-f299-4507-8b52-719a985ecec0.webp'
    ],
    is_visible: true,
  },
  {
    id: 'rec-3',
    title: 'Dinh Dưỡng Kháng Viêm & Tái Tạo Khớp',
    category: 'Dinh Dưỡng',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/02327c65-40dd-4e3c-8656-78daea8ef627.webp',
    description: 'Chế độ dinh dưỡng chống viêm mạn tính, bổ sung vi chất sinh học thúc đẩy tổng hợp collagen và phục hồi sụn khớp.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    tag: 'Dinh Dưỡng',
    color_theme: 'emerald',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/02327c65-40dd-4e3c-8656-78daea8ef627.webp'
    ],
    is_visible: true,
  },
  {
    id: 'rec-4',
    title: 'Cẩm Nang Bảo Vệ Đốt Sống Cổ',
    category: 'Cột Sống Cổ',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/5513d9c5-10bc-4b23-b2f3-2f9d72fd7436.webp',
    description: 'Khắc phục hội chứng cổ rùa (text neck), giảm đau mỏi vai gáy và phục hồi đường cong sinh lý cột sống cổ.',
    author: 'Tùng Dinh Dưỡng',
    link_url: '',
    tag: 'Cột Sống Cổ',
    color_theme: 'purple',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/5513d9c5-10bc-4b23-b2f3-2f9d72fd7436.webp'
    ],
    is_visible: true,
  },
];

async function main() {
  console.log('--- Đọc settings hiện tại từ Supabase ---');
  const { data: current, error: getErr } = await supabase
    .from('settings')
    .select('*')
    .eq('workspace_id', 'default')
    .single();

  if (getErr) {
    console.error('Lỗi lấy settings:', getErr.message);
  }

  const existingBlockStyles = current?.block_styles || {};
  const updatedBlockStyles = {
    ...existingBlockStyles,
    recommended_books: DEFAULT_RECOMMENDED_BOOKS,
  };

  const updatePayload = {
    workspace_id: 'default',
    app_name: 'Qbiz Books',
    primary_color: '#0C0817',
    hotline: '0974.248.716',
    zalo_url: 'https://zalo.me/0987792400',
    expert_title: 'Tùng Dinh Dưỡng - Hỗ trợ kiến thức nền tảng',
    author_profile: DEFAULT_AUTHOR_PROFILE,
    block_styles: updatedBlockStyles,
    updated_at: new Date().toISOString(),
  };

  console.log('--- Cập nhật settings vào Supabase ---');
  const { data, error } = await supabase
    .from('settings')
    .upsert(updatePayload, { onConflict: 'workspace_id' });

  if (error) {
    console.error('Lỗi khi upsert settings:', error.message);
  } else {
    console.log('CẬP NHẬT THÀNH CÔNG VÀO SUPABASE!');
  }
}

main();

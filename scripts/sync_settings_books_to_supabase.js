const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

const author_books = [
  {
    id: 'book-1',
    title: 'Hiểu Đúng Về Cột Sống',
    cover_url: '/documents/covers/cover_hieu_dung_ve_cot_song.png',
    description: 'Cẩm nang toàn diện giải mã cơ chế thoát vị đĩa đệm, thoái hóa và giải pháp vận động tự phục hồi.',
    year: '2025',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    is_visible: true
  },
  {
    id: 'book-2',
    title: 'Tự Chữa Lành Lưng & Cổ',
    cover_url: '/documents/covers/cover_tu_chua_lanh_lung_co.png',
    description: 'Các bài tập sinh cơ học đơn giản, 15 phút mỗi ngày giúp bảo vệ và phục hồi đường cong sinh lý.',
    year: '2024',
    youtube_url: 'https://www.youtube.com/watch?v=zQVOV1eevck',
    is_visible: true
  }
];

const author_profile = {
  name: 'Tùng dinh dưỡng',
  title: 'Hỗ trợ kiến thức nền tảng & Sức khỏe',
  avatar_url: null,
  bio: 'Tùng mong muốn chia sẻ kiến thức khoa học và kinh nghiệm thực tiễn giúp mọi người chủ động chăm sóc sức khỏe bền vững vì một Việt Nam khỏe mạnh.',
  intro_image_url: null,
  intro_video_url: null,
  books: author_books,
  extra_title: 'Triết lý phụng sự',
  extra_content: 'Sức khỏe không đến từ sự lo sợ, mà đến từ sự thấu hiểu chính cơ thể mình. Khi bạn hiểu cơ thể, bạn sẽ biết cách yêu thương và chăm sóc đúng cách mỗi ngày.',
  contact_note: 'Mọi thắc mắc hoặc cần tư vấn lộ trình phục hồi chuyên sâu, vui lòng kết nối trực tiếp với chuyên gia qua Hotline hoặc Zalo bên dưới.',
  phone: '0974.248.716',
  zalo_url: 'https://zalo.me/0987792400',
  email: 'chuyengiacotsong@gmail.com',
  facebook_url: 'https://facebook.com',
  address: 'Hà Nội & TP. Hồ Chí Minh'
};

const recommended_books = [
  {
    id: 'rec-book-1',
    title: 'Lắng Nghe Cơ Thể Để Tự Chữa Lành',
    category: 'Cơ Xương Khớp',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_lang_nghe_co_the.png',
    description: 'Hướng dẫn nhận diện các tín hiệu cảnh báo sớm từ hệ cơ xương khớp và phương pháp phục hồi tự nhiên.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    gallery_images: [
      '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
      '/spine_hero_clean.png'
    ],
    is_visible: true
  },
  {
    id: 'rec-book-2',
    title: 'Giải Mã Cột Sống & Vận Động Đúng',
    category: 'Cột Sống & Đĩa Đệm',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_giai_ma_cot_song.png',
    description: 'Phân tích cơ sinh học cột sống, các sai lầm trong sinh hoạt hằng ngày và bài tập điều chỉnh tư thế.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    gallery_images: [
      '/spine_hero_clean.png',
      '/documents/bang_tra_cuu_re_than_kinh_cot_song.png'
    ],
    is_visible: true
  },
  {
    id: 'rec-book-3',
    title: 'Dinh Dưỡng Kháng Viêm & Tái Tạo Khớp',
    category: 'Dinh Dưỡng Phục Hồi',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_dinh_duong_khang_viem.png',
    description: 'Chế độ ăn uống khoa học giúp nuôi dưỡng sụn khớp, đĩa đệm và giảm phản ứng viêm đau mạn tính.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    is_visible: true
  },
  {
    id: 'rec-book-4',
    title: 'Cẩm Nang Bảo Vệ Đốt Sống Cổ',
    category: 'Cột Sống Cổ & Vai Gáy',
    badge_tag: 'TÀI LIỆU NÊN ĐỌC',
    cover_url: '/documents/covers/cover_cam_nang_dot_song_co.png',
    description: 'Dành riêng cho người làm việc văn phòng, lái xe và những người thường xuyên bị đau mỏi vai gáy.',
    author: 'Tùng dinh dưỡng',
    link_url: '',
    is_visible: true
  }
];

async function run() {
  console.log('=== ĐỒNG BỘ BÌA SÁCH THẬT VÀ TÀI LIỆU VÀO SUPABASE SETTINGS ===');

  const { data: rows, error: fErr } = await supabase.from('settings').select('*');
  if (fErr) {
    console.error('Lỗi lấy settings:', fErr.message);
    return;
  }

  for (const row of rows) {
    console.log(`Đang cập nhật workspace: ${row.workspace_id}...`);
    const currentBlockStyles = row.block_styles || {};
    const updatedBlockStyles = {
      ...currentBlockStyles,
      recommended_books: recommended_books,
      recommended_books_title: 'Tài Liệu Y Khoa Chuyên Sâu',
      recommended_books_subtitle: 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày',
      recommended_books_layout: currentBlockStyles.recommended_books_layout || 'grid'
    };

    const { error: upErr } = await supabase
      .from('settings')
      .update({
        author_profile: author_profile,
        block_styles: updatedBlockStyles,
        updated_at: new Date().toISOString()
      })
      .eq('workspace_id', row.workspace_id);

    if (upErr) {
      console.error(`Lỗi cập nhật row ${row.workspace_id}:`, upErr.message);
    } else {
      console.log(`✓ Thành công cập nhật bìa sách & tài liệu cho workspace ${row.workspace_id}`);
    }
  }

  console.log('\n🎉 ĐÃ ĐỒNG BỘ TOÀN DIỆN VÀO SUPABASE!');
}

run();

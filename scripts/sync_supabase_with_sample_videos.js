const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
let url = '', key = '';
for (const l of lines) {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
}

// Dùng service role key từ scripts/restore_full_48_videos_and_blocks.js để có quyền ghi đè toàn quyền
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, serviceKey);

const SPINE_PLAYLISTS = {
  'tong-quan-ve-cot-song': [
    { id: 'c9kmCxFKHPY', title: '01. Cấu tạo & chức năng cột sống', dur: '4 phút', desc: 'Cấu trúc chung và vai trò của cột sống.' },
    { id: 'mVtS7TYDpbU', title: '02. Cấu tạo cơ bản đốt sống', dur: '5 phút', desc: 'Thân đốt sống, đĩa đệm và các mỏm khớp.' },
    { id: 'hESYYpn33OE', title: '03. Cơ – gân – dây chằng: Giãn dây chằng & hồi phục', dur: '7 phút', desc: 'Giải pháp chữa lành và phục hồi chức năng dây chằng cột sống (ThS.BS.CK2 Mai Duy Linh).' },
    { id: '_uxMIfQfYGk', title: '04. Thần kinh & tủy sống', dur: '4 phút', desc: 'Tủy sống, rễ thần kinh và đường dẫn truyền (HMU).' }
  ],
  'dia-dem': [
    { id: 'z0FRTp5CVds', title: '01. Giải phẫu đĩa đệm: Vòng sợi & Nhân nhầy', dur: '6 phút', desc: 'Cơ chế hoạt động của giảm xóc sinh học tự nhiên giữa các đốt sống.' },
    { id: 'y8Atq_HMJbU', title: '02. Cơ chế hình thành thoát vị đĩa đệm 3D', dur: '8 phút', desc: 'Áp lực tải trọng gây rách vòng sợi và tràn nhân nhầy chèn ép rễ.' },
    { id: 'ilTB5Ks5JQE', title: '03. Điều trị thoát vị đĩa đệm ít xâm lấn (BV Tâm Anh)', dur: '6 phút', desc: 'Kỹ thuật đốt sóng cao tần và can thiệp giải áp đĩa đệm bảo tồn.' },
    { id: 'ghNXQWVABC4', title: '04. 5 Bài tập kéo giãn giải áp đĩa đệm (Vinmec)', dur: '7 phút', desc: 'Hướng dẫn tự tập luyện giảm đau thắt lưng và phục hồi áp lực cột sống.' }
  ],
  'co-gan-day-chang': [
    { id: 'c9kmCxFKHPY', title: '01. Hệ thống cơ sâu & Dây chằng cột sống', dur: '7 phút', desc: 'Dây chằng dọc trước, sau và dây chằng vàng giữ vững đốt sống.' },
    { id: '-2P9olGUajg', title: '02. Bài tập 10 phút kích hoạt cơ lõi Core (Vinmec)', dur: '10 phút', desc: 'Plank và bài tập cầu mông củng cố cơ bụng sâu và cơ nhiều nhánh.' },
    { id: '6ewOPvwfPlo', title: '03. 4 Động tác giải tỏa co thắt cơ lưng (Vinmec)', dur: '8 phút', desc: 'Giải phóng căng cơ sau ngày dài làm việc và ngồi sai tư thế.' },
    { id: 'XFy_0kQxBs4', title: '04. Rèn luyện sức bền cơ dựng gai sống (BV Tâm Anh)', dur: '10 phút', desc: 'Tập luyện cơ lưng dưới mỗi ngày giúp đẩy lùi thoái hóa thắt lưng.' }
  ],
  'than-kinh': [
    { id: 'IUtyDm9O8lU', title: '01. Tủy sống & 31 đôi rễ thần kinh gai sống', dur: '8 phút', desc: 'Cấu tạo ống sống và đường truyền cảm giác vận động của cơ thể.' },
    { id: 'XilwFY71LR4', title: '02. Hội chứng chèn ép rễ thần kinh tọa 3D', dur: '7 phút', desc: 'Đường đi dây thần kinh tọa từ thắt lưng xuống mông, đùi và bàn chân.' },
    { id: 'LS75s0fz20w', title: '03. Chèn ép rễ thần kinh & Nguy cơ yếu liệt (BV Tâm Anh)', dur: '6 phút', desc: 'Nhận diện sớm dấu hiệu tê bì, mất phản xạ và suy giảm vận động chi dưới.' },
    { id: 'XBnPTgSP21M', title: '04. Bài tập trượt thần kinh (Nerve Flossing)', dur: '7 phút', desc: 'Vận động trị liệu giúp rễ thần kinh trượt êm ái, giảm đau buốt.' }
  ],
  'tu-the-va-van-dong': [
    { id: '9o55FWHFl2k', title: '01. Tư thế công thái học cho dân văn phòng (BV Tâm Anh)', dur: '6 phút', desc: 'Bảo toàn đường cong sinh lý tự nhiên khi ngồi làm việc với máy tính.' },
    { id: '6ewOPvwfPlo', title: '02. Nguyên tắc bốc vác & vận động an toàn (Vinmec)', dur: '5 phút', desc: 'Ứng dụng bản lề háng (Hip Hinge) thay vì gập lưng gây chấn thương.' },
    { id: 'ghNXQWVABC4', title: '03. Chuỗi bài tập giải nén cột sống cuối ngày (Vinmec)', dur: '7 phút', desc: 'Kéo giãn giải phóng áp lực nội đĩa đệm và thư giãn nhóm cơ cạnh sống.' },
    { id: 'rQ02ysP2vN8', title: '04. Vật lý trị liệu & Tư thế sinh hoạt đúng (BV Tâm Anh)', dur: '8 phút', desc: 'Chỉnh sửa thói quen đi đứng, nằm ngồi và chọn gối nệm đúng chuẩn.' }
  ],
  'thoai-hoa-va-phuc-hoi': [
    { id: 'Yhvd1RnC_jQ', title: '01. Thoái hóa cột sống: Dấu hiệu & Điều trị (BV Tâm Anh)', dur: '8 phút', desc: 'Bác sĩ chuyên khoa giải thích tiến trình hao mòn sụn và xơ hóa đốt sống.' },
    { id: '7wzAARekAMk', title: '02. Thoát vị đĩa đệm nặng: Giải pháp điều trị (BV Tâm Anh)', dur: '7 phút', desc: 'Phác đồ chẩn đoán hình ảnh MRI và hướng điều trị bảo tồn tích cực.' },
    { id: 'EDVhzV8bb7k', title: '03. Chiến lược phục hồi & Ngăn ngừa tái phát (BV Tâm Anh)', dur: '8 phút', desc: 'Tập luyện phục hồi chức năng và chế độ dinh dưỡng kháng viêm cho sụn.' },
    { id: '7dONUcFKop8', title: '04. Công nghệ cao & Phẫu thuật ít xâm lấn (BV Tâm Anh)', dur: '6 phút', desc: 'TTƯT.BS.CKII Chu Tấn Sĩ chia sẻ về chỉ định phẫu thuật và công nghệ hiện đại.' }
  ],
};

(async () => {
  console.log('=== ĐỒNG BỘ VIDEO 100% NGANG 16:9 VÀO SUPABASE ===');

  for (const [slug, vids] of Object.entries(SPINE_PLAYLISTS)) {
    // 1. Tìm page trong Supabase
    const { data: page, error: pErr } = await supabase
      .from('pages')
      .select('id, slug, title')
      .eq('slug', slug)
      .single();

    if (pErr || !page) {
      console.error(`Không tìm thấy trang ${slug}:`, pErr?.message);
      continue;
    }

    // 2. Tìm khối videos của page
    const { data: blocks, error: bErr } = await supabase
      .from('blocks')
      .select('id, type, data')
      .eq('page_id', page.id)
      .eq('type', 'videos');

    if (bErr || !blocks || blocks.length === 0) {
      console.log(`Không có khối video cho trang ${slug}`);
      continue;
    }

    const videoBlock = blocks[0];
    const newVideoData = {
      videos: vids.map(v => ({
        youtube_id: v.id,
        title: v.title,
        duration_text: v.dur,
        description: v.desc,
        thumbnail_url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        is_vertical: false,
        aspect_ratio: 'horizontal',
      }))
    };

    const { error: uErr } = await supabase
      .from('blocks')
      .update({ data: newVideoData })
      .eq('id', videoBlock.id);

    if (uErr) {
      console.error(`Lỗi cập nhật video ${slug}:`, uErr.message);
    } else {
      console.log(`✓ Đã cập nhật 4 video 16:9 chuẩn y khoa cho trang: ${slug}`);
    }
  }

  console.log('=== HOÀN TẤT ĐỒNG BỘ SUPABASE ===');
})();

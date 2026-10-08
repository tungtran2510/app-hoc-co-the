const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const mienDichData = {
  'hang-rao-phong-thu': {
    summary: `### 🛡️ Tóm tắt cốt lõi: Hàng rào phòng thủ & Hệ Miễn dịch bẩm sinh (Innate Immunity)
- **Hàng rào vật lý & hóa học (Tuyến phòng thủ số 1):** Lớp sừng của da với lớp màng axit pH 5.5, lớp chất nhầy niêm mạc đường thở bắt giữ bụi bẩn, enzyme Lysozyme trong nước mắt/nước bọt phá hủy vách tế bào vi khuẩn, và axit dịch vị dạ dày pH 1.5 tiêu diệt mầm bệnh theo đường ăn uống.
- **Phản ứng viêm cấp tính (Acute Inflammation):** Đáp ứng phòng thủ lành mạnh khi mô bị tổn thương. Tế bào Mast giải phóng Histamine làm giãn mạch, tăng tính thấm mao mạch giúp bổ thể và bạch cầu thoát mạch tràn vào ổ viêm tạo 4 dấu hiệu kinh điển: **Sưng – Nóng – Đỏ – Đau**.
- **Cơ chế sốt sinh lý (Fever):** Chất gây sốt nội sinh (Pyrogens như IL-1, TNF-alpha) tác động lên vùng dưới đồi nâng điểm đặt nhiệt độ cơ thể lên 38–38.5°C. Ở nhiệt độ này, tốc độ thực bào của bạch cầu tăng gấp đôi, gan tích trữ sắt để kìm hãm vi khuẩn nhân lên. Sốt sinh lý là vũ khí chữa lành, chỉ hạ sốt khi nhiệt độ vượt 38.5–39°C gây kiệt sức hoặc co giật ở trẻ nhỏ.
- **Hệ vi sinh vật thường trú:** Hàng tỷ vi khuẩn có lợi trên da và niêm mạc cạnh tranh chất dinh dưỡng và tiết Bacteriocin ngăn chặn hại khuẩn định cư.`,
    takeaways: [
      'Lớp màng axit tự nhiên trên da (pH 5.5) là tấm khiên vô hình chống vi khuẩn; lạm dụng xà phòng tẩy rửa mạnh làm tróc mất lớp màng bảo vệ sinh học này.',
      'Phản ứng viêm là nỗ lực của cơ thể để khoanh vùng và tiêu diệt mầm bệnh; lạm dụng thuốc kháng viêm quá sớm sẽ cản trở quá trình dọn dẹp ổ nhiễm trùng.',
      'Sốt nhẹ (37.8-38.5 độ C) là vũ khí miễn dịch tự nhiên giúp tăng tốc độ di chuyển của bạch cầu; không nên vội vã uống thuốc hạ sốt khi cơ thể vẫn tỉnh táo và đủ nước.',
      'Axit dạ dày tiêu diệt 99% vi sinh vật từ thức ăn; suy giảm độ toan dạ dày do thuốc ức chế axit làm tăng gấp 3 lần nguy cơ nhiễm khuẩn đường ruột.'
    ]
  },
  'te-bao-bach-cau': {
    summary: `### ⚔️ Tóm tắt cốt lõi: Đội quân Bạch cầu thực bào & Tế bào Diệt tự nhiên (NK Cells)
- **Nguồn gốc tạo máu tại tủy xương:** Tất cả các tế bào miễn dịch đều bắt nguồn từ Tế bào gốc tạo máu vạn năng (HSC) trong tủy xương, phân nhánh thành Dòng tủy (Bạch cầu hạt, Đại thực bào) và Dòng lympho (Tế bào T, B, NK).
- **Bạch cầu trung tính (Neutrophils – Lính xung kích):** Chiếm 60–70% tổng lượng bạch cầu trong máu, là lực lượng đầu tiên có mặt tại ổ viêm trong vài phút để nuốt vi khuẩn và giải phóng bẫy ngoại bào (NETs) rồi chết đi tạo thành mủ trắng.
- **Đại thực bào (Macrophages – Đội quân thiết giáp):** Biệt hóa từ tế bào Monocyte, có khả năng nuốt tới 100 vi khuẩn mà không chết, dọn dẹp xác tế bào già cỗi và đóng vai trò Tế bào trình diện kháng nguyên (APC) phát tín hiệu cầu cứu cho miễn dịch thích ứng.
- **Tế bào sát thủ tự nhiên (NK Cells):** Nhận diện các tế bào bị nhiễm virus hoặc tế bào ung thư bị đột biến mất dấu ấn MHC-I, giải phóng enzyme Perforin đục lỗ màng và Granzyme kích hoạt tế bào lạ tự sát theo chương trình (Apoptosis).
- **Histamine & Sốc phản vệ:** Tế bào Mast giải phóng Histamine ồ ạt khi tiếp xúc dị nguyên, gây giãn toàn bộ mạch máu ngoại vi làm tụt huyết áp trụy tim mạch và co thắt phế quản ngạt thở (sốc phản vệ đe dọa tử vong cần tiêm Adrenaline cấp cứu).`,
    takeaways: [
      'Bạch cầu trung tính là cảm tử quân lao vào ổ nhiễm trùng nuốt vi khuẩn; mủ tại vết thương thực chất là xác của hàng triệu bạch cầu trung tính đã hy sinh.',
      'Đại thực bào vừa là cỗ xe dọn rác khổng lồ vừa là sứ giả mang mảnh vỡ mầm bệnh đến hạch bạch huyết để kích hoạt đội quân miễn dịch thích ứng tinh nhuệ.',
      'Tế bào NK (Natural Killer) liên tục tuần tra để tiêu diệt các mầm mống ung thư mới chớm nở; thiếu ngủ và stress mạn tính làm suy giảm tới 70% hoạt tính của tế bào NK.',
      'Sốc phản vệ là phản ứng dị ứng tối khẩn cấp do Histamine làm sập huyết áp và co thắt đường thở; Adrenaline tiêm bắp là liều thuốc duy nhất cứu sống tính mạng.'
    ]
  },
  'mien-dich-thich-ung': {
    summary: `### 🎯 Tóm tắt cốt lõi: Miễn dịch thích ứng – Tế bào T, Tế bào B & Trí nhớ miễn dịch
- **Đặc trưng của Tuyến phòng thủ thứ 2:** Xuất hiện chậm hơn (cần 3–7 ngày) nhưng có tính **đặc hiệu tuyệt đối** với từng kháng nguyên và sở hữu **Trí nhớ miễn dịch (Immunological Memory)** kéo dài nhiều năm hoặc trọn đời.
- **Tế bào Lympho T (Miễn dịch qua trung gian tế bào):** Sinh ra từ tủy xương nhưng di chuyển lên **Tuyến ức (Thymus)** để được "huấn luyện" nhận biết kháng nguyên và loại bỏ các tế bào tự tấn công cơ thể:
  - *T-CD4+ (T hỗ trợ - T Helper):* Chỉ huy trưởng toàn bộ hệ thống; Th1 chống virus/vi khuẩn nội bào, Th2 chống ký sinh trùng, Treg dập tắt viêm chống tự miễn.
  - *T-CD8+ (T độc tế bào - Cytotoxic T):* Trực tiếp áp sát và tiêu diệt các tế bào nhiễm virus hoặc tế bào u.
- **Tế bào Lympho B & Thể dịch:** Khi được tế bào T hỗ trợ kích hoạt, tế bào B biến thành Tương bào (Plasma cells) sản xuất hàng nghìn phân tử kháng thể mỗi giây để khóa chặt kháng nguyên.
- **Lách & Tuyến ức:** Lách là "máy lọc máu" lớn nhất cơ thể, tủy đỏ lọc hồng cầu già, tủy trắng chứa đầy tế bào lympho để giám sát miễn dịch toàn bộ dòng máu.`,
    takeaways: [
      'Tế bào T-CD4+ là tổng công trình sư điều phối toàn bộ hệ thống miễn dịch; virus HIV tấn công chính tế bào này làm hệ miễn dịch sụp đổ hoàn toàn.',
      'Tuyến ức là trường học huấn luyện tế bào T nhưng teo nhỏ dần sau tuổi dậy thì; duy trì lối sống lành mạnh giúp các tế bào T trưởng thành hoạt động bền bỉ.',
      'Lách lọc sạch máu và bắt giữ vi khuẩn có vỏ bọc; người bị cắt lách sau chấn thương có nguy cơ nhiễm trùng máu cực cao, bắt buộc phải tiêm phòng phế cầu.',
      'Trí nhớ miễn dịch là nền tảng của vaccine: đưa mầm bệnh bất hoạt vào để tế bào B và T ghi nhớ, giúp cơ thể tiêu diệt virus thật chỉ trong vài giờ khi tiếp xúc.'
    ]
  },
  'khang-the-immunoglobulin': {
    summary: `### 🏹 Tóm tắt cốt lõi: 5 Lớp Kháng thể (IgG, IgA, IgM, IgE, IgD) & Khóa mục tiêu
- **Cấu trúc Kháng thể (Immunoglobulin - Ig):** Phân tử Protein hình chữ Y gồm 2 chuỗi nặng và 2 chuỗi nhẹ. Hai cánh tay chữ Y (vùng Fab) biến đổi linh hoạt để gắn khớp chính xác như chìa khóa tra vào ổ khóa với kháng nguyên; phần thân (vùng Fc) kích hoạt bổ thể và đại thực bào.
- **5 Lớp Kháng thể chính:**
  1. **IgM (Cấu trúc ngũ phân khổng lồ):** Kháng thể xuất hiện đầu tiên trong máu khi cơ thể mới nhiễm trùng cấp tính (tín hiệu nhận diện ca bệnh mới mắc).
  2. **IgG (Chiếm 75–80%):** Kháng thể dồi dào và bền vững nhất trong huyết thanh, tạo miễn dịch bảo vệ lâu dài. **IgG là kháng thể duy nhất xuyên qua được nhau thai** để bảo vệ thai nhi trong bụng mẹ.
  3. **IgA (Đặc biệt sIgA niêm mạc):** Chiếm ưu thế tại niêm mạc ruột, phế quản, sữa mẹ và nước bọt, tạo lớp áo giáp ngăn virus/vi khuẩn bám vào bề mặt biểu mô.
  4. **IgE:** Gắn trên màng tế bào Mast và bạch cầu ái toan, kích hoạt phản ứng chống giun sán và bệnh dị ứng/hen phế quản.
  5. **IgD:** Thụ thể bề mặt trên tế bào B chưa tiếp xúc kháng nguyên.
- **Cơ chế tiêu diệt của kháng thể:** Trung hòa độc tố vi khuẩn, ngưng kết vi sinh vật thành chùm, kích hoạt hệ thống bổ thể đục thủng màng và Opsonin hóa (đánh dấu mồi ngon cho đại thực bào đến xơi tái).`,
    takeaways: [
      'Kháng thể IgM xuất hiện sớm báo hiệu nhiễm trùng cấp tính; kháng thể IgG xuất hiện muộn hơn nhưng tồn tại nhiều năm tạo miễn dịch bảo vệ bền vững.',
      'IgG là món quà miễn dịch duy nhất mẹ truyền cho con qua nhau thai, bảo vệ bé trong 6 tháng đầu đời trước khi hệ miễn dịch của bé tự hoàn thiện.',
      'Kháng thể IgA tiết (sIgA) trên niêm mạc ruột và đường thở là tuyến chốt chặn đầu tiên; thiếu sIgA khiến bạn hay bị viêm họng và tiêu chảy tái diễn.',
      'Kháng thể tiêu diệt virus bằng cách khóa chặt các gai thụ thể, ngăn không cho virus bám và chui vào bên trong tế bào khỏe mạnh của cơ thể.'
    ]
  },
  'he-bach-huyet': {
    summary: `### 💧 Tóm tắt cốt lõi: Hệ Bạch huyết – Mạng lưới dẫn lưu & Trạm gác an ninh hạch
- **Tuần hoàn dịch bạch huyết:** Mỗi ngày có khoảng 20 lít dịch thoát ra từ mao mạch máu vào mô kẽ, 17 lít được tĩnh mạch tái hấp thu trực tiếp, còn lại **3 lít dịch bạch huyết** giàu protein, tế bào lạ và vi khuẩn được các mao mạch bạch huyết thu gom.
- **Đường dẫn truyền sinh học:** Dịch bạch huyết từ nửa dưới cơ thể tập trung về Bể dưỡng chấp (Cisterna Chyli) ở bụng, đi lên qua **Ống ngực (Thoracic Duct)** và đổ vào Tĩnh mạch dưới đòn trái để tái hòa nhập dòng máu tuần hoàn.
- **Trạm gác an ninh Hạch bạch huyết (Lymph Nodes):** Cơ thể có khoảng 600–700 hạch bạch huyết hình hạt đậu tập trung thành cụm ở cổ, nách, bẹn, mạc treo ruột. Hạch hoạt động như bộ lọc sinh học: dịch bạch huyết chảy chậm qua các xoang hạch chứa đầy đại thực bào và tế bào lympho để tiêu diệt mầm bệnh. Khi có viêm nhiễm tại chỗ, hạch tương ứng sẽ sưng to và đau (phản ứng hạch viêm bình thường).
- **Lưu thông hệ bạch huyết:** Hệ bạch huyết **không có tim để bơm**; dòng dịch chảy được hoàn toàn nhờ sự co thắt của cơ bắp xung quanh, nhịp thở sâu của cơ hoành và van một chiều chống chảy ngược. Lười vận động làm dòng bạch huyết ứ trệ gây phù nề và tích lũy độc chất.`,
    takeaways: [
      'Hạch bạch huyết sưng đau ở cổ khi bị viêm họng là dấu hiệu đáng mừng cho thấy đội quân miễn dịch tại hạch đang tập trung đánh bại vi khuẩn xâm nhập.',
      'Hệ bạch huyết không có quả tim bơm máu; vận động cơ bắp và hít thở sâu bằng cơ hoành là cách duy nhất để tống đẩy dòng dịch bạch huyết lưu thông.',
      'Bể dưỡng chấp ở ổ bụng thu gom toàn bộ chất béo Chylomicron từ ruột non đưa vào ống ngực; ăn chất béo lành mạnh giúp dòng dưỡng chấp lưu thông trơn tru.',
      'Massage dẫn lưu bạch huyết nhẹ nhàng theo chiều hướng về tim giúp giải phóng ứ trệ dịch gian bào, giảm phù chân và tăng tốc đào thải độc tố tế bào.'
    ]
  },
  'tang-cuong-de-khang': {
    summary: `### 🥦 Tóm tắt cốt lõi: Tăng cường Đề kháng tự nhiên & Cân bằng Miễn dịch
- **70% Hệ miễn dịch nằm tại Đường ruột (GALT):** Mô bạch huyết liên kết ruột (GALT - Peyer's patches) là nơi tập trung phần lớn tế bào lympho. Hệ vi sinh vật đường ruột đóng vai trò như người thầy huấn luyện hệ miễn dịch: dạy tế bào miễn dịch cách dung nạp thức ăn và chỉ tấn công vi khuẩn gây hại. Rò rỉ ruột là nguồn gốc sinh ra các bệnh tự miễn (Vẩy nến, Viêm khớp dạng thấp, Lupus).
- **Bộ ba Vi chất miễn dịch vàng:**
  - *Vitamin D3:* Điều hòa biểu hiện hơn 200 gen miễn dịch, kích thích đại thực bào sản sinh peptide kháng khuẩn Cathelicidin tiêu diệt vỏ virus.
  - *Vitamin C:* Tích tụ nồng độ cao trong bạch cầu, chống oxy hóa bảo vệ bạch cầu khỏi bị tự hủy khi chiến đấu với mầm bệnh.
  - *Kẽm (Zinc):* Co-factor của enzyme Thymulin giúp tế bào T trưởng thành; thiếu kẽm làm teo tuyến ức và suy giảm sức đề kháng nghiêm trọng.
- **Giấc ngủ & Nhịp sinh học:** Khi ngủ sâu, cơ thể giải phóng các Cytokine kháng viêm và hormone tăng trưởng GH giúp nhân đôi tế bào miễn dịch. Thiếu ngủ dưới 6 tiếng làm giảm 50% lượng kháng thể tạo ra sau khi tiếp xúc mầm bệnh.
- **Quản lý Stress:** Cortisol tăng cao mạn tính làm teo hạch bạch huyết và giết chết tế bào lympho; thực hành thiền, thở chậm và vận động thể lực điều độ là tấm khiên bảo vệ đề kháng tự nhiên.`,
    takeaways: [
      'Đường ruột là trường đào tạo 70% tế bào miễn dịch; chăm sóc hệ vi sinh đường ruột khỏe mạnh là bước đi cốt lõi nhất để nâng cao sức đề kháng toàn thân.',
      'Bệnh tự miễn xảy ra khi hệ miễn dịch bị mất phương hướng nhận nhầm tế bào cơ thể là kẻ thù; chữa lành niêm mạc ruột và giảm viêm là nền tảng phục hồi.',
      'Bộ ba Vitamin C, Vitamin D3 và Kẽm hiệp đồng tác dụng giúp các tế bào miễn dịch nhận diện và vô hiệu hóa virus đường hô hấp ngay từ cửa ngõ.',
      'Giấc ngủ sâu từ 22h đêm là lúc hệ miễn dịch được sạc pin và tái sinh đội quân bạch cầu; thức khuya triền miên làm sức đề kháng sụt giảm một nửa.'
    ]
  }
};

async function processMienDich() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'mien-dich').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: mien-dich`);
  for (const p of pages) {
    const data = mienDichData[p.slug];
    if (!data) {
      console.warn(`No data for page ${p.slug}`);
      continue;
    }
    
    // 1. Get all current blocks
    const { data: blocks } = await supabase.from('blocks').select('*').eq('page_id', p.id).order('sort_order');
    const vBlock = blocks.find(b => b.type === 'videos');
    
    // 2. Update videos takeaways
    if (vBlock && vBlock.data && vBlock.data.videos) {
      vBlock.data.videos = vBlock.data.videos.map((vid, idx) => {
        if (data.takeaways[idx]) {
          vid.description = data.takeaways[idx];
        }
        return vid;
      });
      await supabase.from('blocks').update({ data: vBlock.data }).eq('id', vBlock.id);
      console.log(`  [${p.slug}] Updated ${vBlock.data.videos.length} video takeaways`);
    }

    // 3. Delete redundant blocks
    const toDelete = blocks.filter(b => b.type !== 'videos');
    for (const b of toDelete) {
      await supabase.from('blocks').delete().eq('id', b.id);
    }
    console.log(`  [${p.slug}] Deleted ${toDelete.length} redundant blocks`);

    // 4. Insert single clean summary block
    await supabase.from('blocks').insert({
      workspace_id: 'default',
      page_id: p.id,
      type: 'text',
      display_style: 'y_nghia',
      sort_order: 2,
      is_visible: true,
      data: {
        title: 'Tóm tắt cốt lõi',
        text: data.summary
      }
    });
    console.log(`  [${p.slug}] Inserted clean single summary block`);
  }
  console.log('✅ TOPIC MIEN-DICH COMPLETED!');
}

processMienDich();

const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const cotSongData = {
  'tong-quan-ve-cot-song': {
    summary: `### 🦴 Tóm tắt cốt lõi: Giải phẫu hệ thống Cột sống & Đường cong chữ S sinh học
- **Cấu trúc trục chịu lực trung tâm:** Cột sống gồm 33–34 đốt sống chia làm 5 đoạn: 7 đốt sống cổ (C1–C7, nâng đỡ hộp sọ 5kg và linh hoạt nhất), 12 đốt sống ngực (T1–T12 gắn với xương sườn tạo lồng ngực), 5 đốt sống thắt lưng (L1–L5 to dày chịu lực nén tối đa), 5 đốt cùng dính liền (S1–S5) và 3–5 đốt cụt.
- **Ý nghĩa cơ học của đường cong chữ S:** Nhìn nghiêng có 4 đoạn cong sinh lý: ưỡn cổ (20–40°), gù ngực (20–40°), ưỡn thắt lưng (30–50°), cong cùng cụt. Theo công thức Euler $R = N^2 + 1$ (với $N=3$ đoạn cong động), cột sống tăng sức chịu lực nén gấp **10 lần** so với một thanh thẳng đứng.
- **Hệ quả của mất đường cong sinh lý:** Tật gù lưng, cổ rùa hoặc lưng phẳng làm mất cơ chế giảm chấn tự nhiên. Trọng lực dồn trực tiếp 100% lên các đĩa đệm và diện khớp liên mấu, đẩy nhanh tốc độ thoái hóa sụn khớp lên 300–500%.
- **Cấu tạo giải phẫu từng đốt sống:** Thân đốt phía trước chịu lực nén; cung đốt sống phía sau bao bọc lỗ đốt sống tạo thành ống tủy bảo vệ tủy sống; các cuống, mỏm gai, mỏm ngang là nơi bám của hệ thống dây chằng và cơ dựng sống.`,
    takeaways: [
      'Cột sống không phải là cột trụ thẳng đứng mà là một hệ thống giảm xóc đàn hồi chữ S. Giữ đúng đường cong sinh lý là chìa khóa then chốt để phân tán áp lực trọng trường.',
      'Đốt đội C1 và đốt trục C2 tạo nên trục xoay linh hoạt cho toàn bộ hộp sọ. Sai lệch tư thế cúi đầu bấm điện thoại (Text Neck) làm tăng tải trọng lên cột sống cổ từ 5kg lên đến 27kg.',
      'Cột sống thắt lưng (L1-L5) chịu toàn bộ trọng lượng nửa thân trên. Vùng chuyển tiếp L4-L5 và L5-S1 là điểm bản lề chịu lực cắt lớn nhất, dễ tổn thương và thoái hóa hàng đầu.',
      'Đường cong chữ S tăng sức chịu lực gấp 10 lần nhờ công thức Euler R = N² + 1. Mất đường cong tự nhiên do ngồi sai tư thế sẽ khiến đĩa đệm phải gánh tải trọng phá hủy liên tục.',
      'Thân đốt sống phía trước nâng đỡ trọng lực, cung đốt sống phía sau tạo buồng bảo vệ tủy sống. Bất kỳ sự xẹp lún thân đốt nào cũng đe dọa trực tiếp đến không gian của rễ thần kinh.'
    ]
  },
  'dia-dem': {
    summary: `### 💿 Tóm tắt cốt lõi: Phức hợp Đĩa đệm & Cơ chế dinh dưỡng thẩm thấu
- **Cấu tạo 3 thành phần của đĩa đệm:**
  1. *Nhân nhầy (Nucleus Pulposus):* Dạng gel Mucopolysaccharide, Proteoglycan và 80–88% là nước, hoạt động như đệm thủy lực phân phối đều lực nén theo định luật Pascal.
  2. *Vòng sợi (Anulus Fibrosus):* 15–20 lớp sợi Collagen Type I & II xếp đan chéo góc 30–60°. Vùng sau - bên mỏng và ít lớp hơn, tạo điểm yếu sinh học dễ bị xé rách gây thoát vị.
  3. *Mâm sụn đốt sống (Endplate):* Sụn hyaline dày ~1mm bao phủ mặt trên và dưới thân đốt sống.
- **Cơ chế dinh dưỡng thẩm thấu khuếch tán:** Đĩa đệm của người trưởng thành **hoàn toàn không có mạch máu nuôi dưỡng trực tiếp**. Đĩa đệm chỉ nhận oxy, glucose và nước thông qua cơ chế bơm - hút thẩm thấu khi cơ thể vận động nén - nhả nhịp nhàng.
- **Áp lực nội đĩa đệm theo tư thế (Nghiên cứu Nachemson):** Nằm ngửa = 25kg (25%); Đứng thẳng = 100kg (100%); Ngồi thẳng lưng = 140kg (140%); Ngồi gù lưng cúi người = 185kg (185%); Cúi gập lưng nâng vật nặng = 275kg (275%).
- **4 Giai đoạn bệnh lý đĩa đệm:** Phồng lồi đĩa đệm (Degeneration/Bulging) -> Rách vòng sợi (Torn anulus) -> Thoát vị thực thụ chèn rễ (Extrusion) -> Mảnh rời đĩa đệm rơi vào ống sống (Sequestration).`,
    takeaways: [
      'Nhân nhầy đĩa đệm hoạt động như một bọc thủy lực phân tán lực nén 360 độ. Mất nước theo tuổi tác làm nhân nhầy xẹp xuống, mất tính đàn hồi và dồn áp lực xé rách vòng sợi.',
      'Đĩa đệm người lớn không có mạch máu. Chỉ có vận động nhịp nhàng (đi bộ, kéo giãn) mới tạo áp lực bơm - hút đưa dịch dinh dưỡng qua mâm sụn để tái tạo mô đĩa đệm.',
      'Ngồi làm việc sai tư thế tạo áp lực nội đĩa đệm lên đến 185% so với đứng thẳng. Cần đứng dậy thay đổi tư thế mỗi 45-60 phút để giải phóng áp lực cho đĩa đệm thắt lưng.',
      'Vị trí sau - bên của vòng sợi là gót chân Achilles sinh học: lớp sợi mỏng nhất và dây chằng dọc sau không che phủ hết, khiến nhân nhầy dễ thoát ra chèn ép rễ thần kinh tọa.',
      'Vận động đúng cách là liều thuốc số 1 cho đĩa đệm: tập luyện các bài tập nén nhả trục dọc nhẹ nhàng giúp kích thích tế bào sụn tổng hợp Proteoglycan giữ nước cho nhân nhầy.'
    ]
  },
  'co-gan-day-chang': {
    summary: `### 🔗 Tóm tắt cốt lõi: Hệ thống Dây chằng, Cơ dựng sống & Hệ cơ cốt lõi (Core)
- **Hệ thống dây chằng trục:**
  - *Dây chằng dọc trước (ALL):* Bản rộng, rất chắc khỏe chạy dọc mặt trước thân đốt, ngăn ngừa cột sống ưỡn quá mức.
  - *Dây chằng dọc sau (PLL):* Hẹp dần ở thắt lưng, chạy mặt sau thân đốt, ngăn gập quá mức nhưng để hở góc sau - bên đĩa đệm.
  - *Dây chằng vàng (Ligamentum Flavum):* Giàu sợi Elastin co giãn màu vàng nối các cung đốt sống, dày lên gây hẹp ống sống ở người già.
- **Cơ chế co cứng cơ phòng vệ (Protective Muscle Spasm):** Khi đĩa đệm hoặc diện khớp bị tổn thương vi thể, các thụ thể thần kinh cảm giác sâu kích hoạt phản xạ co rút cấp tính nhóm cơ cạnh sống nhằm "nẹp cố định" đoạn cột sống tổn thương. Nếu không xử lý nguyên nhân gốc, co thắt mạn tính sẽ dẫn đến thiếu máu nuôi cơ và xơ hóa dải cơ.
- **Hệ cơ cốt lõi 3D (The Core Cylinder):** Gồm 4 bức tường: Cơ hoành (nắp trên), Cơ sàn chậu (đáy dưới), Cơ ngang bụng (bức tường vòng phía trước) và Cơ nhiều chân Multifidus (hệ cơ sâu bám từng đốt sống phía sau). Khi kích hoạt đồng bộ, áp lực ổ bụng tăng lên tạo lực nâng thủy tĩnh giảm 40% tải trọng cho cột sống thắt lưng.`,
    takeaways: [
      'Dây chằng vàng nối giữa các bản sống có tính đàn hồi cao. Quá trình lão hóa và viêm mạn làm dây chằng vàng dày phì đại, lồi vào lòng ống sống gây hẹp ống sống thắt lưng.',
      'Cơ nhiều chân (Multifidus) là nhóm cơ sâu quan trọng nhất kiểm soát ổn định từng đốt sống. Đau lưng làm cơ này teo biến thành mô mỡ nếu không được tập kích hoạt chuyên biệt.',
      'Co thắt cơ lưng là phản ứng tự vệ của cơ thể để khóa khớp tổn thương, không phải là nguyên nhân gốc rễ. Đấm bóp thô bạo vào chỗ co thắt cấp tính có thể làm rách thêm bao xơ đĩa đệm.',
      'Mất cân bằng cơ chéo dưới (Janda): cơ gập hông và cơ thắt lưng bị co ngắn trong khi cơ mông và cơ bụng bị ức chế yếu đi, kéo xương chậu đổ trước làm cột sống ưỡn quá mức.',
      'Tập cơ cốt lõi (Core) không phải gập bụng 6 múi mà là kiểm soát cơ ngang bụng và sàn chậu để tạo áp lực thủy tĩnh nội bụng (IAP), giảm tải 40% lực nén lên đĩa đệm L4-L5.'
    ]
  },
  'than-kinh': {
    summary: `### ⚡ Tóm tắt cốt lõi: Hệ thần kinh tủy sống, Đám rối thần kinh & Dấu hiệu Cờ đỏ (Red Flags)
- **Cấu trúc tủy sống và rễ thần kinh:** Tủy sống tận cùng ở đốt L1–L2 (nón tủy - Conus Medullaris), phía dưới chỉ còn chùm rễ thần kinh đuôi ngựa (Cauda Equina). Có 31 đôi dây thần kinh gai sống chui qua các lỗ liên hợp.
- **Đám rối cánh tay & Đau thần kinh tọa:**
  - *Đoạn cổ (C5–T1):* Tạo thành đám rối cánh tay chi phối vận động và cảm giác vai, cánh tay, cẳng tay và bàn tay. Chèn ép C6 gây yếu cơ nhị đầu và tê ngón cái; chèn ép C7 gây tê ngón trỏ và ngón giữa.
  - *Đoạn thắt lưng cùng (L4–S3):* Hợp thành dây thần kinh tọa (Sciatic Nerve) lớn nhất cơ thể, chạy qua mông xuống mặt sau đùi và cẳng chân. Thoát vị L4-L5 chèn ép rễ L5 gây tê mu bàn chân và yếu gấp mu ngón chân cái; L5-S1 chèn ép rễ S1 gây tê bờ ngoài bàn chân và mất phản xạ gân gót.
- **DẤU HIỆU CỜ ĐỎ CẤP CỨU (RED FLAGS):**
  1. *Hội chứng chùm đuôi ngựa:* Mất kiểm soát tiểu tiện/đại tiện (bí tiểu hoặc són phân), tê bì vùng yên ngựa (quanh hậu môn và sinh dục), liệt mềm hai chân tiến triển -> BẮT BUỘC PHẪU THUẬT GIẢI ÉP TRONG 24–48 GIỜ.
  2. Bàn chân rũ (Foot Drop) do liệt rễ L5.
  3. Đau lưng kèm sốt cao, sụt cân không rõ nguyên nhân (nghi ngờ lao cột sống hoặc u ác tính).`,
    takeaways: [
      'Tủy sống kết thúc ở bờ dưới L1-L2; từ L2 trở xuống là chùm rễ thần kinh đuôi ngựa bơi trong bể dịch não tủy. Tổn thương dưới L2 là tổn thương rễ thần kinh ngoại biên.',
      'Chèn ép rễ L5 gây mất khả năng đi bằng gót chân và tê mu bàn chân; chèn ép rễ S1 làm mất phản xạ gân gót và không thể nhón ngón chân đi bằng đầu mũi chân.',
      'Hội chứng chùm đuôi ngựa với tê bì vùng yên ngựa và mất chủ động đại tiểu tiện là cấp cứu ngoại thần kinh tối khẩn; can thiệp chậm trễ sau 48h sẽ để lại di chứng tàn phế vĩnh viễn.',
      'Cơn đau thần kinh tọa thực chất là phản ứng viêm hóa học do nhân nhầy thoát vị giải phóng phospholipase A2 và TNF-alpha gây kích ứng rễ thần kinh, bên cạnh chèn ép cơ học.',
      'Phục hồi thần kinh đòi hỏi thời gian vì sợi trục thần kinh ngoại biên chỉ tái sinh với tốc độ 1mm mỗi ngày trong điều kiện được giải áp và bổ sung đầy đủ vitamin nhóm B (B1, B6, B12).'
    ]
  },
  'tu-the-va-van-dong': {
    summary: `### 🚶 Tóm tắt cốt lõi: Công thái học 24/7 & Tái huấn luyện tư thế vận động sinh học
- **Tư thế ngồi chuẩn Ergonomic:**
  - Hai bàn chân đặt phẳng trên sàn, khớp gối vuông góc 90–100°.
  - Khớp háng mở góc 90–105°, xương chậu dựng thẳng (không ngửa xương chậu ra sau).
  - Có đệm nâng đỡ đường cong ưỡn thắt lưng L1–L5.
  - Màn hình ngang tầm mắt (cách 50–70cm) để giữ góc cổ 0–15°, tránh gập cổ cúi đầu.
- **Nguyên lý đòn bẩy khi nâng vật nặng:** Khi cúi gập lưng nhấc vật nặng 20kg với cánh tay đòn xa thân người, áp lực đè lên đĩa đệm thắt lưng nhân lên gấp 10–15 lần, tương đương gần 300kg lực nén cục bộ! Kỹ thuật nâng chuẩn: giữ vật sát người, gập khớp gối và khớp háng (Squat lift), giữ thẳng lưng và dùng lực cơ mông - đùi đẩy lên.
- **Tư thế ngủ bảo vệ trục sống:**
  - *Nằm ngửa:* Gối đầu cao vừa phải (7–10cm) duy trì độ cong cổ; đặt một gối nhỏ dưới khoeo chân để thư giãn cơ thắt lưng chậu (Psoas).
  - *Nằm nghiêng:* Gối đầu cao bằng khoảng cách từ tai đến mỏm cùng vai; kẹp gối giữa hai đầu gối để giữ xương chậu và cột sống thắt lưng không bị xoắn vặn.
  - Tuyệt đối tránh nằm sấp vì làm vặn xoắn đốt sống cổ cực hạn suốt đêm.`,
    takeaways: [
      'Ngồi tựa lưng với góc ngả 100-110 độ có đệm thắt lưng giúp phân tán áp lực lên đĩa đệm tốt hơn nhiều so với việc cố gắng ngồi thẳng đơ 90 độ liên tục suốt nhiều giờ.',
      'Khi nâng vật nặng, luôn biến cơ thể thành đòn bẩy chân gập (Leg Drive): ôm sát vật vào ngực, dùng sức mạnh cơ đùi và cơ mông thay vì cúi gập cong lưng chịu tải.',
      'Gối ngủ quá cao làm gập đốt sống cổ suốt 8 tiếng, chèn ép động mạch đốt sống thân nền gây thiếu máu não thức dậy chóng mặt, căng cứng cơ thang vai gáy.',
      'Nằm kẹp gối giữa hai đầu gối khi ngủ nghiêng giúp giữ xương chậu thăng bằng, ngăn ngừa khớp cùng chậu và cột sống thắt lưng bị vặn xoắn gây đau buốt lúc nửa đêm.',
      'Lối sống tĩnh tại ngồi lì trên 6 tiếng liên tục làm tê liệt phản xạ co cơ tự nhiên, khiến đĩa đệm mất nước và các dây chằng cột sống bị kéo căng dão mạn tính.'
    ]
  },
  'cac-van-de-thuong-gap': {
    summary: `### 🩺 Tóm tắt cốt lõi: Phân biệt Bệnh lý cột sống & Chiến lược điều trị bảo tồn
- **Đau lưng cấp tính vs Mạn tính:** Đau cấp (< 6 tuần) thường do giãn dây chằng hoặc co thắt cơ quá mức, 90% phục hồi tốt nếu nghỉ ngơi tương đối và vận động nhẹ. Đau mạn (> 12 tuần) liên quan đến thoái hóa đĩa đệm, viêm diện khớp hoặc biến đổi mô thần kinh trung ương (Central Sensitization).
- **Hội chứng Cổ - Vai - Cánh tay:** Do thoái hóa mỏm gai, gai xương thân đốt hoặc thoát vị đĩa đệm cổ chèn ép rễ thần kinh (thường gặp C5–C6, C6–C7), gây đau nhức từ cổ lan xuống vai gáy, cánh tay và tê bì bàn tay.
- **Vẹo cột sống (Scoliosis):** Cột sống bị cong lệch sang bên trên 10 độ (đo góc Cobb trên phim X-quang toàn trục). Cần tầm soát ở tuổi dậy thì bằng nghiệm pháp cúi người Adams (Forward Bend Test) để phát hiện sớm gồ sườn.
- **Trượt đốt sống (Spondylolisthesis):** Thân đốt sống trên trượt ra trước so với đốt sống dưới (phổ biến trượt L4 trên L5 hoặc L5 trên S1). Phân 4 độ theo Meyerding. Trượt độ 1–2 ưu tiên tập ổn định nhóm cơ cốt lõi; trượt độ 3–4 có nguy cơ hẹp ống sống nặng cần cân nhắc phẫu thuật hàn xương.
- **Nguyên tắc can thiệp bảo tồn:** 90–95% trường hợp thoát vị đĩa đệm và thoái hóa cột sống đáp ứng xuất sắc với phục hồi chức năng, chỉnh hình công thái học và dinh dưỡng phục hồi mâm sụn mà không cần mổ.`,
    takeaways: [
      'Đau lưng cấp tính không nên nằm bất động tại giường quá 48 giờ; nằm lì làm cơ bắp teo nhược và giảm tuần hoàn thẩm thấu nuôi dưỡng đĩa đệm khiến bệnh lâu khỏi hơn.',
      'Hội chứng cổ vai cánh tay thường bắt nguồn từ thoái hóa rễ C6-C7; cần phân biệt với viêm quanh khớp vai đơn thuần bằng cách kiểm tra tầm vận động xoay cổ (Spurling Test).',
      'Nghiệm pháp Adams cúi gập người là bài kiểm tra đơn giản và nhạy nhất để phát hiện sớm vẹo cột sống ở thanh thiếu niên nhờ phát hiện ụ gồ sườn không đối xứng.',
      'Trượt đốt sống độ 1 và 2 hoàn toàn có thể sống khỏe mạnh trọn đời nếu luyện tập cơ ngang bụng và cơ mông khỏe, tuyệt đối tránh các động tác ưỡn lưng quá mức (Hyperextension).',
      'Phẫu thuật cột sống chỉ là giải pháp cuối cùng khi có chèn ép thần kinh tiến triển hoặc hội chứng chùm đuôi ngựa; 95% trường hợp phục hồi bền vững nhờ bảo tồn tự nhiên.'
    ]
  }
};

async function processCotSong() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'cot-song').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: cot-song`);
  for (const p of pages) {
    const data = cotSongData[p.slug];
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
  console.log('✅ TOPIC COT-SONG COMPLETED!');
}

processCotSong();

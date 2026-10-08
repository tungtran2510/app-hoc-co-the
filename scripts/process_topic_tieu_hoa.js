const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const tieuHoaData = {
  'khoang-mieng-da-day': {
    summary: `### 👄 Tóm tắt cốt lõi: Khoang miệng & Dạ dày – Giai đoạn "CẮT" cơ học & hóa học
- **CẮT tại khoang miệng:** Răng nhai nghiền cơ học tăng diện tích tiếp xúc với enzyme; Amylase nước bọt (Ptyalin) bắt đầu thủy phân tinh bột chín thành đường đôi Maltose. Nhai kỹ không chỉ giảm tải cho dạ dày mà còn kích thích tiết nước bọt giàu Bicarbonate bảo vệ men răng.
- **Môi trường axit dạ dày (HCl pH 1.5 – 2.0):** Tế bào viền (Parietal cells) tiết Acid Clohydric (HCl) để biến tiền men Pepsinogen thành enzyme hoạt tính Pepsin (cắt liên kết peptide của đạm), đồng thời tiêu diệt 99% vi khuẩn theo thức ăn và kích hoạt Yếu tố nội (Intrinsic Factor) hấp thu Vitamin B12.
- **Hàng rào chất nhầy bảo vệ dạ dày:** Tế bào cổ tuyến tiết dịch nhầy giàu Bicarbonate (HCO3-) tạo lớp đệm dày 0.5–1mm ngăn cách HCl và Pepsin tự tiêu hóa niêm mạc dạ dày. Thuốc giảm đau NSAID và vi khuẩn H.pylori ức chế Prostaglandin làm mỏng lớp bảo vệ này.
- **Cơ chế trào ngược dạ dày thực quản (GERD):** Cơ thắt thực quản dưới (LES) bị suy yếu giãn mở bất thường, làm dịch vị axit và dịch mật trào ngược lên thực quản. Do niêm mạc thực quản không có lớp nhầy kiềm bảo vệ, axit gây bỏng rát (ợ nóng), viêm loét và có nguy cơ tiến triển thành Barrett thực quản.`,
    takeaways: [
      'Nhai kỹ là bước khởi đầu quyết định thành bại của hệ tiêu hóa: nhai 25-30 lần giúp thức ăn được nhuyễn mịn và thấm đẫm enzyme Amylase trước khi chạm dạ dày.',
      'Axit dạ dày pH 1.5-2.0 là hàng rào vô trùng số 1 của cơ thể. Uống thuốc ức chế axit (PPI) kéo dài làm giảm độ toan, tạo cơ hội cho vi khuẩn gây hại lọt xuống đường ruột.',
      'Trào ngược dạ dày thực quản không phải lúc nào cũng do thừa axit mà đa phần do áp lực ổ bụng tăng cao đẩy cơ thắt dưới thực quản (LES) mở ngược lên.',
      'Ăn tối sát giờ ngủ (dưới 3 tiếng) hoặc nằm ngay sau ăn khiến trọng lực không giữ được dịch vị, gây ợ chua đêm và viêm thanh quản mạn tính.'
    ]
  },
  'ruot-non-hap-thu': {
    summary: `### 🌾 Tóm tắt cốt lõi: Ruột non – Trung tâm "THẤM" & Diện tích bề mặt hấp thu khổng lồ
- **Cấu trúc nhung mao & Vi nhung mao:** Chiều dài ruột non 5–6 mét, nhưng nhờ hệ thống nếp gấp van Kerckring, nhung mao (Villi) và vi nhung mao (Microvilli) tạo thành bờ bàn chải (Brush Border), diện tích hấp thu được mở rộng lên tới **250–300 m²** (tương đương một sân tennis).
- **Cơ chế vận chuyển dưỡng chất qua tế bào biểu mô (Enterocytes):**
  - Đường đơn: Glucose và Galactose hấp thu tích cực thứ phát qua kênh SGLT-1 (đồng vận chuyển ion Na+); Fructose khuếch tán hỗ trợ qua kênh GLUT-5.
  - Axit amin & Peptide: Hấp thu qua kênh đồng vận chuyển PepT1.
  - Chất béo: Axit béo chuỗi dài được bao bọc bởi muối mật tạo hạt Micelle, đi vào tế bào ruột tái tổng hợp thành Chylomicron đưa vào hệ bạch huyết.
- **Hội chứng rò rỉ ruột (Leaky Gut Syndrome):** Bình thường các tế bào ruột gắn kết khít khao nhờ các mối nối chặt (Tight Junctions - protein Zonulin, Occludin, Claudin). Khi bị viêm do stress, kháng sinh hoặc độc tố, các mối nối bị toác rộng, cho phép đại phân tử protein chưa tiêu hóa và nội độc tố vi khuẩn (LPS) lọt vào máu kích hoạt bệnh tự miễn và viêm toàn thân.`,
    takeaways: [
      'Diện tích ruột non tương đương một sân tennis nhờ hàng triệu nhung mao. Bất kỳ tổn thương viêm nhiễm nào làm cùn nhung mao cũng gây hội chứng kém hấp thu và sụt cân.',
      'Hấp thu đường và nước tại ruột non bắt buộc phải có ion Natri đi kèm (kênh SGLT-1). Đó là lý do khi tiêu chảy cần uống Oresol có đủ cả muối và đường để bù nước cấp tốc.',
      'Chất béo sau khi hấp thu không đi thẳng vào máu mà đi vào hệ bạch huyết dưới dạng Chylomicron trước khi đổ vào tĩnh mạch dưới đòn để vào tim.',
      'Hội chứng rò rỉ ruột (Leaky Gut) cho phép độc tố vi khuẩn LPS lọt vào tuần hoàn máu, là nguồn cơn châm ngòi cho các bệnh viêm mạn tính và viêm khớp tự miễn.'
    ]
  },
  'dai-trang-bai-tiet': {
    summary: `### 💩 Tóm tắt cốt lõi: Đại tràng – Giai đoạn "ĐẨY" nhu động & Tái hấp thu nước
- **Giải phẫu & Sinh lý đại tràng:** Dài khoảng 1.5 mét, gồm manh tràng, đại tràng lên, đại tràng ngang, đại tràng xuống, đại tràng sigma và trực tràng. Đại tràng tiếp nhận 1.5–2 lít dưỡng chấp lỏng mỗi ngày từ hồi tràng, tái hấp thu tới 90% lượng nước và điện giải (khoảng 1.3–1.8 lít) để cô đặc phân.
- **Cơ chế nhu động & Phản xạ tống phân (Defecation Reflex):**
  - Chuyển động phân đoạn nhào trộn thức ăn.
  - Nhu động khối lượng lớn (Mass Movement): Xảy ra 1–3 lần mỗi ngày, thường mạnh nhất sau bữa ăn sáng nhờ Phản xạ dạ dày - đại tràng (Gastrocolic Reflex).
  - Phản xạ đi ngoài: Phân đi vào bóng trực tràng làm căng thụ thể áp lực, gửi tín hiệu thần kinh tủy sống làm giãn cơ thắt hậu môn trong (tự động) và kích hoạt cơ thắt ngoài (chủ động theo ý muốn).
- **Táo bón mạn tính & Biến chứng trĩ:** Thiếu chất xơ và nước làm phân khô cứng, tăng áp lực rặn khi đi ngoài làm căng giãn phình tĩnh mạch đệm hậu môn dẫn đến búi trĩ và rách nứt kẽ hậu môn.
- **Tầm soát Polyp đại trực tràng:** 95% ung thư đại trực tràng phát triển từ các khối polyp tuyến (Adenomatous polyp) âm thầm trong 5–10 năm. Nội soi đại tràng định kỳ sau tuổi 40 là tiêu chuẩn vàng phát hiện và cắt bỏ polyp sớm.`,
    takeaways: [
      'Đại tràng tái hấp thu gần 2 lít nước mỗi ngày. Nếu bạn uống không đủ nước, đại tràng sẽ rút kiệt nước từ chất thải khiến phân biến thành sỏi khô cứng gây táo bón.',
      'Phản xạ đi ngoài mạnh nhất vào buổi sáng ngay sau khi thức dậy nhờ phản xạ dạ dày - ruột. Hãy tập thói quen uống 1 ly nước ấm và đi vệ sinh cố định vào khung giờ này.',
      'Táo bón mạn tính làm tăng áp lực ổ bụng khi rặn, khiến các đám rối tĩnh mạch trĩ bị ứ máu phình to, dẫn đến sa búi trĩ và chảy máu tươi.',
      'Polyp đại tràng tiến triển hoàn toàn không có triệu chứng đau đớn. Chủ động nội soi định kỳ giúp loại bỏ polyp ngay từ giai đoạn lành tính, triệt tiêu nguy cơ ung thư.'
    ]
  },
  'he-vi-sinh-microbiome': {
    summary: `### 🦠 Tóm tắt cốt lõi: Hệ vi sinh đường ruột (Microbiome) & Trục Ruột – Não (Gut-Brain)
- **Quy mô của hệ vi sinh vật đường ruột:** Chứa hơn 100 nghìn tỷ vi sinh vật thuộc hơn 1,000 loài khác nhau, với số lượng gen gấp 150 lần bộ gen người. Tỷ lệ vàng sinh học lý tưởng là **85% lợi khuẩn (Probiotics) : 15% hại khuẩn**.
- **Axit béo chuỗi ngắn (SCFAs - Acetate, Propionate, Butyrate):** Lợi khuẩn lên men chất xơ hòa tan (Prebiotic) sản sinh ra SCFAs. Trong đó, Butyrate là nguồn năng lượng chính (70%) nuôi sống các tế bào biểu mô đại tràng, duy trì độ bền vững của niêm mạc và ức chế tế bào ung thư.
- **Trục Thần kinh Não - Ruột (Gut-Brain Axis):**
  - Ruột sở hữu Hệ thần kinh ruột (ENS) với hơn 500 triệu tế bào thần kinh, giao tiếp 2 chiều với não bộ qua Dây thần kinh phế vị (Vagus Nerve).
  - Hơn **90% lượng Serotonin** (hormone hạnh phúc điều hòa tâm trạng) và **50% lượng Dopamine** trong cơ thể được tổng hợp trực tiếp tại ruột bởi các tế bào nội tiết ruột (Enterochromaffin) dưới sự điều phối của hệ vi sinh.
- **Hội chứng loạn khuẩn (Dysbiosis):** Chế độ ăn nhiều đường tinh luyện, dầu chiên rán và lạm dụng kháng sinh tiêu diệt chủng vi khuẩn có lợi, tạo điều kiện cho nấm Candida và hại khuẩn bùng phát gây đầy bụng, mệt mỏi và trầm cảm.`,
    takeaways: [
      'Hệ vi sinh ruột tạo ra hơn 90% lượng Serotonin của toàn bộ cơ thể. Tâm trạng bất an, lo âu và trầm cảm thường bắt nguồn từ một đường ruột bị loạn khuẩn và viêm mạn.',
      'Chất xơ hòa tan là thức ăn thiết yếu nuôi dưỡng lợi khuẩn sản sinh Butyrate – nguồn năng lượng duy nhất để tái tạo và làm lành các tế bào biểu mô đại tràng.',
      'Sau mỗi đợt dùng kháng sinh, hệ vi sinh đường ruột có thể mất từ 3 đến 6 tháng mới hồi phục; bắt buộc phải bổ sung men vi sinh và thực phẩm lên men tự nhiên.',
      'Chế độ ăn đa dạng với hơn 30 loại thực phẩm nguồn gốc thực vật mỗi tuần là chìa khóa vàng giúp hệ vi sinh vật đường ruột phong phú và giàu sức đề kháng.'
    ]
  },
  'enzym-tieu-hoa': {
    summary: `### 🧪 Tóm tắt cốt lõi: Enzyme tiêu hóa – Chất xúc tác bẻ gãy dinh dưỡng sinh học
- **Ba nhóm Enzyme tiêu hóa trụ cột:**
  1. *Amylase:* Tiết từ tuyến nước bọt và tuyến tụy, bẻ gãy tinh bột thành đường Maltose và Glucose.
  2. *Protease (Pepsin, Trypsin, Chymotrypsin, Carboxypeptidase):* Tiết từ dạ dày và tụy, cắt đứt các liên kết peptide biến đại phân tử đạm thành tri-peptide, di-peptide và axit amin tự do.
  3. *Lipase:* Tiết từ tuyến tụy (được dịch mật hỗ trợ nhũ tương hóa), phân giải mỡ Triglyceride thành Monoglyceride và các axit béo tự do.
- **Quy luật kích hoạt dạng Tiền chất (Zymogen):** Để tránh việc enzyme tiêu hóa tự phá hủy các mô tiết ra chúng, tụy sản xuất Protease dưới dạng bất hoạt (Trypsinogen). Khi xuống tá tràng, enzyme Enterokinase tại bờ bàn chải ruột mới kích hoạt Trypsinogen thành Trypsin, kích hoạt dây chuyền các men còn lại.
- **Hệ quả của thiếu hụt enzyme:** Thức ăn không được phân cắt triệt để trôi xuống đại tràng bị hại khuẩn phân hủy tạo ra các khí độc (H2S, Amoniac, Indole) gây chướng bụng, sôi bụng, đi ngoài phân sống và mệt mỏi sau ăn.`,
    takeaways: [
      'Enzyme tiêu hóa suy giảm theo tuổi tác và sự suy kiệt tuyến tụy; bổ sung enzyme tự nhiên từ dứa (Bromelain) và đu đủ (Papain) giúp hỗ trợ phân giải đạm rất tốt.',
      'Cơ thể không thể hấp thu protein nguyên vẹn; nếu thiếu protease, đạm thô lọt xuống ruột già sẽ lên men thối rữa tạo ra mùi hôi khó chịu và độc tố cho gan.',
      'Enzyme Lipase của tụy chỉ hoạt động hiệu quả khi chất béo đã được dịch mật nhũ tương hóa thành các hạt siêu nhỏ; người cắt túi mật thường gặp khó khăn tiêu hóa mỡ.',
      'Không nên uống quá nhiều nước lạnh trong khi ăn vì sẽ làm loãng nồng độ enzyme tiêu hóa và giảm nhiệt độ tối ưu (37 độ C) của các phản ứng sinh hóa trong dạ dày.'
    ]
  },
  'benh-duong-ruot-thuong-gap': {
    summary: `### 🛡️ Tóm tắt cốt lõi: Nhận diện & Kiểm soát các bệnh lý đường ruột thường gặp
- **Vi khuẩn Helicobacter pylori (H.pylori):** Vi khuẩn xoắn khuẩn Gr(-) sống dưới lớp chất nhầy dạ dày nhờ tiết enzyme Urease trung hòa axit xung quanh. 80% người nhiễm không triệu chứng, nhưng là nguyên nhân hàng đầu gây viêm dạ dày mạn tính, loét dạ dày - tá tràng và ung thư biểu mô tuyến dạ dày.
- **Hội chứng ruột kích thích (IBS - Irritable Bowel Syndrome):** Rối loạn tương tác não - ruột đặc trưng bởi đau bụng tái diễn liên quan đến đi ngoài (IBS-C thể táo, IBS-D thể lỏng hoặc hỗn hợp) mà không có tổn thương cấu trúc trên nội soi. Yếu tố khởi phát chính là căng thẳng thần kinh và nhạy cảm với thực phẩm FODMAPs.
- **Viêm ruột từng vùng Crohn & Viêm loét đại tràng (IBD):** Bệnh lý tự miễn mạn tính gây loét sâu, chảy máu, tiêu chảy kéo dài và nguy cơ thủng ruột hoặc hẹp lòng ruột.
- **Chiến lược phục hồi 4R chuẩn y khoa:**
  1. *Remove (Loại bỏ):* Bỏ thực phẩm dị ứng, thức ăn rác, diệt khuẩn có hại.
  2. *Replace (Thay thế):* Bổ sung enzyme tiêu hóa, axit dạ dày sinh học.
  3. *Reinoculate (Cấy lại):* Bổ sung Probiotic và Prebiotic chất lượng cao.
  4. *Repair (Làm lành):* Dùng L-Glutamine, Kẽm Carnosine, Curcumin để tái tạo niêm mạc.`,
    takeaways: [
      'Nhiễm khuẩn HP không phải lúc nào cũng cần uống kháng sinh diệt trừ nếu không có vết loét hoặc tiền sử gia đình ung thư dạ dày; quản trị niêm mạc lành lặn là ưu tiên cốt lõi.',
      'Hội chứng ruột kích thích (IBS) gắn liền với căng thẳng tâm lý; giảm stress và áp dụng chế độ ăn Low-FODMAP là biện pháp can thiệp đầu tay mang lại hiệu quả cao.',
      'Phác đồ phục hồi đường ruột 4R (Remove - Replace - Reinoculate - Repair) là quy trình vàng giúp phục hồi niêm mạc ruột bị viêm loét từ gốc rễ sinh học.',
      'Dấu hiệu báo động đỏ đường tiêu hóa: đi ngoài ra máu đen hoặc đỏ tươi, sụt cân nhanh không rõ lý do, sốt kèm đau bụng ban đêm cần phải nội soi tiêu hóa khẩn cấp.'
    ]
  }
};

async function processTieuHoa() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'tieu-hoa').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: tieu-hoa`);
  for (const p of pages) {
    const data = tieuHoaData[p.slug];
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
  console.log('✅ TOPIC TIEU-HOA COMPLETED!');
}

processTieuHoa();

const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const coTheNguoiData = {
  'tong-quan-he-co-quan': {
    summary: `### 🧍 Tóm tắt cốt lõi: Tổng quan 11 Hệ cơ quan liên hoàn của Cơ thể người
- **Hệ thống điều phối tối cao:** Não bộ và hệ thần kinh trung ương hoạt động như tổng đài xử lý hàng tỷ tín hiệu điện toán mỗi giây, phân chia thành 4 thùy đại não: Thùy trán (tư duy logic, vận động chủ động), Thùy đỉnh (cảm giác xúc giác, không gian), Thùy thái dương (ngôn ngữ, thính giác, trí nhớ) và Thùy chẩm (thị giác).
- **Hệ tuần hoàn & Trao đổi khí:** Trái tim đập 100,000 nhịp mỗi ngày bơm 7,000 lít máu qua 100,000km mạng lưới mạch máu; phối hợp nhịp nhàng với phổi để tiếp nhận oxy sạch và đào thải khí carbonic độc hại ra khỏi cơ thể.
- **Hệ bạch huyết & Mạng lưới phòng thủ:** Vận chuyển dịch bạch huyết chứa các tế bào bạch cầu lympho, liên tục lọc vi khuẩn, virus và tế bào bất thường tại các hạch an ninh trước khi đổ về tuần hoàn máu.
- **Sự thống nhất sinh học nội môi:** Mọi hệ cơ quan (Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh, Cơ xương khớp, Bài tiết, Miễn dịch, Nội tiết) đều hoạt động tương hỗ chặt chẽ để duy trì hằng tính nội môi (Homeostasis). Rối loạn ở một hệ cơ quan sẽ kéo theo phản ứng dây chuyền làm suy giảm các hệ cơ quan còn lại.`,
    takeaways: [
      'Não bộ chia làm 4 thùy chuyên biệt: thùy trán kiểm soát cảm xúc và tư duy logic, thùy chẩm xử lý thị giác, thùy thái dương lưu giữ ký ức và thùy đỉnh định vị không gian.',
      'Hệ tuần hoàn và hệ hô hấp là cặp đôi sinh học sinh tử: tim bơm máu đến phế nang phổi để nạp đầy oxy trước khi phân phối nuôi dưỡng từng tế bào sống.',
      'Hệ bạch huyết không có máy bơm như tim; dịch bạch huyết chỉ lưu thông nhờ sự co bóp của cơ bắp khi vận động và nhịp thở sâu của cơ hoành.',
      '11 hệ cơ quan trong cơ thể kết nối chặt chẽ như một khối thống nhất; chăm sóc sức khỏe toàn diện đòi hỏi cân bằng cả giấc ngủ, dinh dưỡng, vận động và tinh thần.'
    ]
  },
  'he-co-xuong-khop': {
    summary: `### 🦴 Tóm tắt cốt lõi: Hệ Cơ - Xương - Khớp & Cơ chế vận động sinh học 3D
- **Cấu trúc bộ xương người:** Gồm 206 xương ở người trưởng thành, chia làm 5 nhóm hình thái: Xương dài (đòn bẩy vận động), Xương ngắn (cổ tay, cổ chân), Xương dẹt (bảo vệ cơ quan), Xương bất định (đốt sống) và Xương vừng (bánh chè giảm ma sát gân).
- **Khớp hoạt dịch (Synovial Joint):** Khớp động linh hoạt nhất, bao bọc bởi bao khớp chứa màng hoạt dịch tiết dịch bôi trơn và sụn hyaline đệm trượt không ma sát. Khớp gối chịu lực nén lớn nhất cơ thể, được gia cố bởi 4 dây chằng chính (ACL, PCL, MCL, LCL) và hai sụn chêm giảm xóc.
- **Cơ chế co cơ trượt sợi (Sliding Filament Theory):** Xung động thần kinh kích thích giải phóng Canxi ($Ca^{2+}$) từ lưới nội sinh chất, làm lộ vị trí bám trên sợi mỏng Actin. Đầu cầu của sợi dày Myosin dùng năng lượng ATP kéo trượt sợi Actin vào trong làm ngắn đơn vị co cơ (Sarcomere).
- **Cân bằng Tạo xương vs Hủy cốt bào (Loãng xương):** Xương là mô sống liên tục tái tạo nhờ Tạo cốt bào (Osteoblasts) tạo xương mới và Hủy cốt bào (Osteoclasts) tiêu hủy xương già cỗi. Sau tuổi 35 (đặc biệt phụ nữ mãn kinh suy giảm Estrogen), hủy xương vượt tạo xương dẫn đến loãng xương và gãy xương bệnh lý.`,
    takeaways: [
      '206 chiếc xương trong cơ thể liên tục thay mới; sau mỗi 10 năm bạn sẽ có một bộ xương hoàn toàn mới nhờ hoạt động nhịp nhàng của tạo cốt bào và hủy cốt bào.',
      'Sụn khớp hoạt dịch và sụn chêm khớp gối hoàn toàn không có mạch máu; chúng chỉ nhận dinh dưỡng khi khớp cử động nén nhả để dịch khớp thẩm thấu vào sụn.',
      'Quá trình co cơ bắp tiêu tốn năng lượng ATP và ion Canxi nội bào; thiếu canxi hoặc magie sẽ khiến các sợi cơ actin-myosin không thể nhả giãn, gây chuột rút đau đớn.',
      'Khớp gối chịu tải trọng gấp 3-4 lần trọng lượng cơ thể khi đi bộ và gấp 7 lần khi leo cầu thang; kiểm soát cân nặng là biện pháp hàng đầu bảo vệ khớp gối khỏi thoái hóa.',
      'Tập luyện kháng lực (tạ, bodyweight) tạo áp lực cơ học kích thích tạo cốt bào tăng mật độ xương, là phương thuốc phòng chống loãng xương hiệu quả nhất.'
    ]
  },
  'he-tuan-hoan-tim-mach': {
    summary: `### ❤️ Tóm tắt cốt lõi: Trái tim & Mạng lưới tuần hoàn máu nuôi cơ thể
- **Cấu trúc 4 buồng & Van tim một chiều:** Tim gồm 2 tâm nhĩ (nhận máu) và 2 tâm thất (bơm máu), ngăn cách bởi 4 van tim: van 2 lá, 3 lá, van động mạch chủ và van động mạch phổi. Tiếng tim đập $T_1, T_2$ chính là âm thanh đóng kín dứt khoát của các van tim.
- **Hai vòng tuần hoàn lớn nhỏ:**
  - *Tiểu tuần hoàn (Phổi):* Thất phải bơm máu nghèo oxy lên phổi trao đổi khí, máu đỏ tươi giàu oxy trở về nhĩ trái.
  - *Đại tuần hoàn (Hệ thống):* Thất trái với lớp cơ dày khỏe bơm máu áp lực cao vào động mạch chủ đi khắp các mô tế bào toàn thân.
- **Điều hòa huyết áp bằng Thụ thể áp lực (Baroreceptors):** Các cảm biến áp suất tại xoang cảnh và quai động mạch chủ liên tục gửi tín hiệu về hành não để điều chỉnh nhịp tim và giãn/co mạch tức thì khi ta thay đổi tư thế từ nằm sang đứng.
- **Suy giãn tĩnh mạch chi dưới:** Máu từ chân trở về tim phải thắng trọng lực nhờ van tĩnh mạch một chiều và sự co bóp của cơ bắp chân ("trái tim thứ hai"). Đứng lâu, ngồi nhiều làm van tĩnh mạch bị thoái hóa hở rộng, máu ứ trệ gây phù chân, nặng chân và nổi gân xanh ngoằn ngoèo.`,
    takeaways: [
      'Thất trái tim có thành cơ dày gấp 3 lần thất phải để tạo áp lực tống máu đi khắp 100,000km mạch máu; tăng huyết áp mạn tính buộc thất trái phì đại suy tim.',
      'Hồng cầu sống 120 ngày và chứa 270 triệu phân tử Hemoglobin; mỗi phân tử mang được 4 phân tử oxy ($O_2$) cung cấp năng lượng cho từng tế bào thở.',
      'Cơ bắp chân hoạt động như "trái tim thứ hai" ép các tĩnh mạch sâu tống máu ngược về tim; đi bộ thường xuyên là phương thuốc số 1 chống suy giãn tĩnh mạch chân.',
      'Thụ thể áp lực xoang cảnh giúp ổn định huyết áp tức thời khi đứng dậy; suy yếu phản xạ này gây tụt huyết áp tư thế khiến mắt tối sầm và choáng ngã ở người lớn tuổi.',
      'Chất Nitric Oxide (NO) do lớp nội mạc mạch máu tiết ra là chìa khóa làm giãn nở mạch máu tự nhiên, giữ cho huyết áp ổn định và ngăn ngừa cục máu đông.'
    ]
  },
  'he-ho-hap-phoi': {
    summary: `### 🫁 Tóm tắt cốt lõi: Hệ Hô hấp & Cơ chế trao đổi khí tại màng phế nang
- **Cơ học hô hấp & Cơ hoành:** Động tác hít vào là quá trình chủ động: Cơ hoành co hạ thấp xuống 1.5–7cm kết hợp cơ liên sườn ngoài nâng lồng ngực lên, làm giảm áp suất trong khoang màng phổi (áp suất âm) hút không khí tràn vào phổi (Định luật Boyle). Thở ra bình thường là quá trình thụ động do tính đàn hồi co hồi của nhu mô phổi.
- **Màng Phế nang - Mao mạch siêu mỏng:** Phổi có khoảng **300–500 triệu phế nang** với tổng diện tích bề mặt trao đổi khí lên tới **70–100 m²** (rộng bằng một căn hộ). Khoảng cách từ lòng phế nang đến hồng cầu mao mạch chỉ mỏng 0.5 micromet, cho phép Oxy và CO2 khuếch tán qua lại trong chớp mắt (0.25 giây).
- **Chất hoạt động bề mặt Surfactant:** Do tế bào phế nang type II tiết ra, làm giảm sức căng bề mặt chất lỏng trong lòng phế nang, ngăn không cho các phế nang nhỏ bị xẹp lép ở cuối thì thở ra.
- **Bệnh phổi tắc nghẽn mạn tính (COPD) & Ngưng thở khi ngủ:**
  - *COPD:* Hút thuốc lá mạn tính phá hủy thành phế nang (khí phế thủng) và làm viêm phù nề đường thở, khiến khí bị bẫy lại trong phổi không thở ra hết được.
  - *Hội chứng ngưng thở khi ngủ (OSA):* Cơ vùng hầu họng bị chùng nhão tụt ra sau bịt kín đường thở ban đêm, gây thiếu oxy não tái diễn, tăng huyết áp kháng trị và đột quỵ.`,
    takeaways: [
      'Cơ hoành là cơ hô hấp chính yếu; thở bằng ngực nông chỉ dùng được 20% dung tích phổi, trong khi thở cơ hoành (thở bụng) giúp thông khí sâu và kích hoạt đối giao cảm.',
      'Màng phế nang mỏng chỉ nửa micromet với diện tích bằng cả căn nhà; hít khói thuốc lá và bụi mịn PM2.5 làm phá hủy vĩnh viễn màng lọc mong manh này.',
      'Chất Surfactant là tấm đệm sinh học chống xẹp phế nang; thiếu surfactant ở trẻ sinh non gây hội chứng suy hô hấp cấp đe dọa tính mạng.',
      'Khí phế thủng trong COPD làm mất tính đàn hồi của phế nang khiến bệnh nhân không thể thở ra hết dưỡng khí cũ, dẫn đến lồng ngực biến dạng hình thùng.',
      'Hội chứng ngưng thở khi ngủ làm gián đoạn hô hấp hàng trăm lần mỗi đêm, làm sụt giảm oxy máu não trầm trọng và tăng gấp 3 lần nguy cơ nhồi máu cơ tim.'
    ]
  },
  'he-than-kinh-nao-bo': {
    summary: `### 🧠 Tóm tắt cốt lõi: Não bộ, 12 Đôi dây thần kinh sọ & Hàng rào máu não
- **Cấu trúc 12 đôi dây thần kinh sọ não (Cranial Nerves):** Xuất phát trực tiếp từ thân não và não bộ, chi phối các giác quan và vận động vùng đầu mặt cổ:
  - Dây I (Khứu giác), Dây II (Thị giác), Dây III-IV-VI (Vận nhãn), Dây V (Cảm giác tam thoa vùng mặt), Dây VII (Vận động cơ mặt biểu cảm), Dây VIII (Thính giác và Tiền đình thăng bằng), Dây X (Dây phế vị - nhạc trưởng đối giao cảm nội tạng).
- **Hàng rào máu não (Blood-Brain Barrier - BBB):** Cấu trúc bảo vệ tinh vi gồm các tế bào nội mô mạch máu liên kết cực khít (Tight Junctions), màng đáy dày và chân các tế bào hình sao (Astrocytes). Hàng rào này ngăn chặn 98% phân tử thuốc, vi khuẩn và độc chất từ máu xâm nhập vào mô thần kinh, chỉ cho phép Oxy, Glucose và các chất tan trong mỡ chọn lọc đi qua.
- **Cân bằng dẫn truyền GABA vs Glutamate:**
  - *Glutamate:* Chất dẫn truyền thần kinh kích thích chính yếu (80%), thúc đẩy học tập, ghi nhớ và tư duy.
  - *GABA:* Chất dẫn truyền ức chế chính yếu, làm dịu hoạt động nơron, giảm lo âu và đưa não vào giấc ngủ. Mất cân bằng gây co giật, căng thẳng cực độ và mất ngủ kinh niên.
- **Hệ thần kinh thực vật (ANS):** Giao cảm (Sympathetic - phản ứng chiến hay chạy, tăng nhịp tim, co mạch, tăng đường huyết) vs Đối giao cảm (Parasympathetic - nghỉ ngơi, tiêu hóa, phục hồi mô qua dây X).`,
    takeaways: [
      'Dây thần kinh số X (dây phế vị) là cầu nối dài nhất từ thân não đến tim, phổi và ruột; kích hoạt dây X qua hít thở sâu giúp hạ nhịp tim và ổn định tiêu hóa tức thì.',
      'Hàng rào máu não là lá chắn bảo vệ trung ương thần kinh; tình trạng viêm mạn tính và mất ngủ có thể làm rò rỉ hàng rào này, tạo điều kiện cho độc tố xâm nhập gây thoái hóa não.',
      'Glutamate kích thích tư duy còn GABA làm dịu thần kinh; tăng cường hoạt tính GABA tự nhiên giúp giải tỏa stress, làm êm dịu não bộ và cải thiện giấc ngủ sâu.',
      'Hệ giao cảm bị kích hoạt mạn tính do áp lực cuộc sống giữ cơ thể trong trạng thái báo động đỏ liên tục, làm teo hồi hải mã (trung tâm trí nhớ) và tăng huyết áp.',
      'Não bộ có tính mềm dẻo thần kinh (Neuroplasticity) trọn đời; học kỹ năng mới, tập thể dục nhịp điệu và ăn uống giàu Omega-3 giúp tạo thêm các synap kết nối nơron mới.'
    ]
  },
  'he-bai-tiet-than': {
    summary: `### 🫘 Tóm tắt cốt lõi: Hệ Bài tiết & Bộ lọc sinh học Nephron của Thận
- **Cấu trúc Nephron – Đơn vị lọc chức năng:** Mỗi quả thận chứa khoảng **1 triệu đơn vị Nephron**. Mỗi Nephron gồm cầu thận (Glomerulus - cuộn mao mạch lọc áp lực cao) và hệ thống ống thận (ống lượn gần, quai Henle, ống lượn xa và ống góp).
- **Công suất lọc khổng lồ:** Mỗi ngày, hai quả thận lọc khoảng **180 lít dịch lọc cầu thận** (tương đương toàn bộ lượng máu cơ thể được lọc tuần hoàn 30–60 lần). Tuy nhiên, **99% lượng nước và dưỡng chất (Glucose, axit amin, điện giải) được ống thận tái hấp thu**, chỉ có khoảng 1.5–2 lít nước tiểu chính thức chứa chất thải độc hại (Ure, Creatinin, Axit Uric) được bài xuất.
- **Điều hòa Huyết áp & Nội tiết của thận:**
  - Tiết hormone **Renin** kích hoạt hệ thống RAAS điều hòa huyết áp khi lưu lượng máu đến thận giảm.
  - Tiết hormone **Erythropoietin (EPO)** kích thích tủy xương sản sinh hồng cầu (suy thận gây thiếu máu nặng).
  - Hoạt hóa Vitamin D thành dạng hoạt tính sinh học Calcitriol (1,25-(OH)2-D3) để hấp thu canxi.
- **Cơ chế phản xạ bàng quang & Sàn chậu:** Bàng quang chứa 300–400ml nước tiểu bắt đầu kích hoạt thụ thể căng gửi tín hiệu về tủy cùng kích hoạt phản xạ buồn tiểu. Cơ sàn chậu suy yếu sau sinh hoặc tuổi già làm mất khả năng nâng đỡ cổ bàng quang, dẫn đến chứng tiểu són khi ho hoặc gắng sức.`,
    takeaways: [
      '1 triệu đơn vị Nephron trong mỗi quả thận lọc 180 lít dịch mỗi ngày; các nephron một khi đã xơ hóa hoại tử do tiểu đường hoặc huyết áp cao sẽ không thể tái sinh.',
      'Thận sản xuất hormone EPO kích thích tủy xương tạo hồng cầu; bệnh nhân suy thận mạn tính luôn bị thiếu máu nặng nề do thiếu hụt hormone này.',
      'Thói quen nhịn tiểu làm bàng quang bị giãn quá mức, nước tiểu ứ đọng tạo cơ hội cho vi khuẩn E.coli di chuyển ngược dòng gây viêm đài bể thận và nhiễm trùng huyết.',
      'Tập bài tập sàn chậu Kegel giúp gia cố nhóm cơ nâng đỡ đáy chậu, là giải pháp vàng không dùng thuốc để trị dứt điểm chứng tiểu không tự chủ khi gắng sức.'
    ]
  }
};

async function processCoTheNguoi() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'co-the-nguoi').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: co-the-nguoi`);
  for (const p of pages) {
    const data = coTheNguoiData[p.slug];
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
  console.log('✅ TOPIC CO-THE-NGUOI COMPLETED!');
}

processCoTheNguoi();

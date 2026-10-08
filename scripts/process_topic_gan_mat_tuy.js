const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const ganMatTuyData = {
  'nha-may-sinh-hoa-gan': {
    summary: `### 🏭 Tóm tắt cốt lõi: Gan – Nhà máy sinh hóa 500 chức năng & Tĩnh mạch môn
- **Cơ quan nội tạng lớn nhất:** Nặng 1.4 – 1.6kg, đảm nhiệm hơn 500 chức năng sinh hóa sống còn. Toàn bộ dòng máu mang chất dinh dưỡng tan trong nước từ ruột non đều theo Tĩnh mạch môn (Portal Vein) đổ thẳng về Gan để lọc và xử lý trước khi vào tuần hoàn chung.
- **Chức năng điều hòa đường huyết 24/7:** Gan chuyển hóa Glucose dư thừa thành Glycogen dự trữ (khoảng 100g tại gan). Khi nhịn đói hoặc hạ đường huyết, gan phân giải Glycogen thành Glucose phóng thích vào máu; khi cạn kiệt, gan thực hiện Tân tạo đường (Gluconeogenesis) từ axit amin và glycerol.
- **Tổng hợp Protein & Yếu tố đông máu:** Gan tổng hợp toàn bộ lượng Albumin huyết tương (duy trì áp lực keo chống phù nề) và các yếu tố đông máu thiết yếu (Fibrinogen, Prothrombin). Suy gan dẫn đến phù thũng báng bụng và xuất huyết dưới da.
- **Chuyển hóa đạm & Chu trình Urea:** Gan thu gom khí Amoniac (NH3) cực độc sinh ra từ quá trình thoái hóa protein, đưa vào Chu trình Urea biến thành hợp chất Urea vô hại để thận đào thải ra nước tiểu. Suy gan làm NH3 tích tụ trong máu tràn lên não gây Bệnh não gan (Hôn mê gan).`,
    takeaways: [
      'Tĩnh mạch môn đưa toàn bộ dinh dưỡng tan trong nước từ ruột về gan kiểm duyệt; suy giảm chức năng gan làm ứ trệ tuần hoàn cửa, gây trĩ và giãn vỡ tĩnh mạch thực quản.',
      'Gan là kho dự trữ Glycogen và duy trì đường huyết ổn định cả ngày lẫn đêm. Ăn uống thất thường hoặc nhịn đói kéo dài làm cạn kiệt năng lượng dự trữ tại gan.',
      'Gan sản xuất 100% Albumin và các yếu tố đông máu; khi gan suy yếu, áp lực keo giảm khiến nước tràn vào ổ bụng (cổ trướng) và dễ bầm tím chảy máu dưới da.',
      'Chu trình Urea tại gan là bức tường bảo vệ não bộ khỏi độc chất Amoniac (NH3); suy gan nặng làm NH3 ngấm vào tế bào thần kinh gây lơ mơ và hôn mê gan.'
    ]
  },
  'co-che-gan-thai-doc': {
    summary: `### 🧪 Tóm tắt cốt lõi: Hai giai đoạn giải độc gan (Phase 1 & Phase 2 Detoxification)
- **Bản chất của giải độc gan:** Hầu hết các độc chất (thuốc tây, rượu bia, thuốc trừ sâu, phụ gia thực phẩm) là hợp chất tan trong chất béo (Lipophilic), khó đào thải. Gan phải chuyển hóa chúng thành dạng tan trong nước (Hydrophilic) để tống ra ngoài qua nước tiểu (thận) hoặc dịch mật (phân).
- **Giai đoạn 1 (Phase 1 - Biến đổi sinh học):**
  - Thực hiện bởi họ enzyme **Cytochrome P450**.
  - Sử dụng các phản ứng oxy hóa, khử, thủy phân để tạo nhóm chức phân cực.
  - *Lưu ý quan trọng:* Sản phẩm trung gian của Giai đoạn 1 thường **độc hại và có tính oxy hóa mạnh gấp nhiều lần** chất ban đầu. Nếu Giai đoạn 2 bị tắc nghẽn, các gốc tự do này sẽ phá hủy màng tế bào gan.
- **Giai đoạn 2 (Phase 2 - Phản ứng liên hợp):**
  - Gắn các gốc sinh học hòa tan vào chất trung gian qua 6 con đường: Liên hợp Glutathione, Liên hợp Sulfate, Liên hợp Glycine, Glucuronidation, Methyl hóa và Acetyl hóa.
  - Đòi hỏi nguồn cung cấp liên tục các axit amin chứa lưu huỳnh (Cysteine, Methionine), Glutathione, Vitamin nhóm B, Selen và Kẽm.
- **Dấu hiệu gan quá tải độc chất:** Mề đay mẩn ngứa, hơi thở hôi, vàng da, mệt mỏi mạn tính, nước tiểu sẫm màu và khó tiêu chất béo.`,
    takeaways: [
      'Giai đoạn 1 của giải độc gan tạo ra các chất trung gian độc hại gấp nhiều lần; bắt buộc phải có đủ chất chống oxy hóa để bảo vệ tế bào gan khỏi bị tổn thương hoại tử.',
      'Giai đoạn 2 liên hợp đòi hỏi nguồn cung cấp axit amin chứa lưu huỳnh và Glutathione dồi dào; thiếu hụt protein chất lượng cao sẽ làm đình trệ toàn bộ quá trình đào thải độc tố.',
      'Thuốc giảm đau Paracetamol chuyển hóa ở gan tạo chất độc NAPQI làm cạn kiệt nguồn Glutathione; tuyệt đối không dùng quá liều hoặc dùng chung với rượu bia.',
      'Mề đay, mẩn ngứa ban đêm và mụn nhọt kéo dài là tiếng chuông cảnh báo gan đang quá tải độc tố và dòng dịch mật bài xuất bị ứ trệ.'
    ]
  },
  'tui-mat-dich-mat': {
    summary: `### 🟡 Tóm tắt cốt lõi: Túi mật & Cơ chế nhũ tương hóa chất béo
- **Sản xuất và lưu trữ dịch mật:** Gan sản xuất 500–1000ml dịch mật mỗi ngày và chuyển xuống túi mật. Túi mật có dung tích 30–50ml, đảm nhận vai trò cô đặc dịch mật lên 5–10 lần bằng cách rút bớt nước và ion điện giải.
- **Vai trò nhũ tương hóa của Muối mật (Bile Salts):** Dịch mật không chứa enzyme tiêu hóa, nhưng muối mật đóng vai trò như chất hoạt động bề mặt (xà phòng sinh học), bẻ gãy các giọt mỡ lớn thành các vi hạt Micelle siêu nhỏ, tăng diện tích tiếp xúc để enzyme Lipase của tụy phân giải chất béo.
- **Tuần hoàn ruột gan (Enterohepatic Circulation):** Khoảng **95% muối mật** được tái hấp thu tại đoạn cuối hồi tràng và theo tĩnh mạch môn quay trở lại gan để tái sử dụng. Chỉ 5% muối mật bị đào thải theo phân mỗi ngày (được gan bù đắp bằng cách tổng hợp mới từ Cholesterol).
- **Cơ chế hình thành Sỏi mật (Gallstones):** 80% là sỏi Cholesterol, hình thành khi có sự mất cân bằng trong bộ ba: Thừa Cholesterol, Thiếu Muối mật hoặc Thiếu Phospholipid (Lecithin), kết hợp với túi mật co bóp kém do nhịn ăn hoặc ăn kiêng kiêng khem chất béo quá mức.`,
    takeaways: [
      'Túi mật cô đặc dịch mật lên gấp 10 lần để sẵn sàng tống xuất khi chất béo chạm tới tá tràng; nhịn ăn sáng kéo dài làm mật bị ứ đọng cô đặc quá mức, dễ kết tủa thành sỏi mật.',
      'Muối mật nhũ tương hóa mỡ thành các hạt Micelle siêu nhỏ; không có muối mật, các vitamin tan trong dầu (A, D, E, K) và Omega-3 hoàn toàn không thể hấp thu vào cơ thể.',
      '95% lượng muối mật được tái hấp thu ở cuối ruột non để tái sử dụng. Chất xơ hòa tan trong bữa ăn giúp gắn kết và đào thải một phần muối mật, buộc gan tiêu hao Cholesterol để tạo mật mới.',
      'Người đã phẫu thuật cắt túi mật mất kho lưu trữ cô đặc mật; dịch mật chảy nhỏ giọt liên tục xuống ruột khiến họ dễ bị tiêu chảy phân mỡ khi ăn bữa ăn nhiều dầu mỡ.'
    ]
  },
  'tuyen-tuy-ngoai-tiet': {
    summary: `### 🧬 Tóm tắt cốt lõi: Tuyến tụy ngoại tiết & Dịch tụy tiêu hóa Bicarbonate
- **Vị trí và cấu tạo tuyến tụy:** Nằm vắt ngang sau phúc mạc, chia làm phần tụy ngoại tiết (chiếm 98% khối lượng mô) và các đảo tụy nội tiết Langerhans (2%).
- **Dịch tụy Bicarbonate (HCO3-):** Tụy tiết ra 1.5 – 2 lít dịch tụy mỗi ngày có tính kiềm rất cao (pH 8.0 – 8.3) nhờ nồng độ Bicarbonate đậm đặc. Chức năng sống còn là trung hòa dịch dưỡng chấp axit từ dạ dày đổ xuống tá tràng, đưa môi trường ruột về pH kiềm nhẹ tối ưu cho các enzyme hoạt động.
- **Các nhóm Enzyme tụy hùng mạnh:**
  - *Protease (Trypsin, Chymotrypsin, Elastase):* Tiết ra dạng tiền chất bất hoạt Zymogen để tránh ăn mòn tụy.
  - *Pancreatic Amylase:* Thủy phân tinh bột chín và sống.
  - *Pancreatic Lipase & Colipase:* Phân cắt 80% lượng mỡ trong thức ăn.
- **Bệnh cảnh Viêm tụy cấp (Acute Pancreatitis):** Xảy ra khi các enzyme tiêu hóa bị kích hoạt non ngay bên trong lòng tuyến tụy (do sỏi kẹt bóng Vater hoặc rượu bia kích thích), dẫn đến hiện tượng "tự ăn thịt chính mình" (Autodigestion), gây hoại tử mô tụy, đau bụng dữ dội xuyên ra sau lưng, đe dọa tử vong do sốc nhiễm độc.`,
    takeaways: [
      'Dịch tụy giàu Bicarbonate đóng vai trò dập tắt ngọn lửa axit từ dạ dày; nếu tụy không tiết đủ kiềm, axit dạ dày sẽ làm bỏng loét niêm mạc tá tràng và ức chế enzyme tiêu hóa.',
      'Viêm tụy cấp thường bùng phát sau một bữa ăn thịnh soạn nhiều rượu bia và mỡ động vật; triệu chứng đau bụng thượng vị dữ dội lan ra sau lưng kèm nôn ói liên tục.',
      'Sỏi mật rơi xuống làm tắc nghẽn ống mật tụy chung (bóng Vater) là thủ phạm hàng đầu gây viêm tụy cấp tắc nghẽn, cần phải can thiệp lấy sỏi nội soi ERCP cấp cứu.',
      'Suy tụy ngoại tiết mạn tính gây hội chứng đi ngoài phân mỡ (phân nổi bồng bềnh, váng dầu và mùi nồng nặc) do mỡ hoàn toàn không được enzyme Lipase phân giải.'
    ]
  },
  'gan-nhiem-mo': {
    summary: `### 🧈 Tóm tắt cốt lõi: Gan nhiễm mỡ (NAFLD) & Tiến trình xơ hóa tế bào gan
- **Định nghĩa Gan nhiễm mỡ:** Tình trạng lượng mỡ (chủ yếu là Triglyceride) tích tụ vượt quá **5% trọng lượng của gan**. Gan nhiễm mỡ không do rượu (NAFLD - nay gọi là MASLD) gắn liền với hội chứng kháng Insulin, béo phì trung tâm và chế độ ăn dư thừa đường Fructose.
- **Tiến trình 4 nấc thang tổn thương gan:**
  1. *Gan nhiễm mỡ đơn thuần (Steatosis):* Mỡ lắng đọng trong tế bào gan, chưa viêm, hoàn toàn đảo ngược được 100%.
  2. *Viêm gan thoái hóa mỡ (NASH):* Mỡ bị oxy hóa kích hoạt phản ứng viêm, men gan AST/ALT tăng cao, tế bào gan bắt đầu bị hoại tử.
  3. *Xơ hóa gan (Fibrosis):* Các tế bào hình sao (Stellate cells) tăng sinh tạo sẹo collagen xơ cứng quanh xoang tĩnh mạch.
  4. *Xơ gan & Ung thư gan (Cirrhosis & HCC):* Cấu trúc tiểu thùy gan bị biến dạng hoàn toàn, suy giảm chức năng gan vĩnh viễn.
- **Thủ phạm số 1 - Đường Fructose công nghiệp:** Khác với Glucose được chuyển hóa bởi mọi tế bào trong cơ thể, **100% đường Fructose (siro ngô cao phân tử HFCS trong nước ngọt) bắt buộc phải chuyển hóa tại gan**, biến thẳng thành mỡ nội tạng gây nhiễm mỡ cấp tốc.
- **Phương pháp đảo ngược tự nhiên:** Cắt giảm triệt để đường lỏng (nước ngọt, trà sữa), nhịn ăn gián đoạn 16/8 để kích hoạt Autophagy đốt mỡ nội tạng, tập kháng lực tăng độ nhạy Insulin.`,
    takeaways: [
      'Gan nhiễm mỡ độ 1 và độ 2 hoàn toàn có thể đảo ngược 100% nếu thay đổi lối sống; gan là cơ quan duy nhất có khả năng tự tái sinh thần kỳ nếu được giải phóng khỏi mỡ thừa.',
      'Đường Fructose trong nước ngọt và bánh kẹo là độc chất âm thầm hàng đầu gây gan nhiễm mỡ vì toàn bộ lượng đường này bị gan biến trực tiếp thành Triglyceride.',
      'Men gan bình thường không có nghĩa là gan khỏe mạnh; giai đoạn gan nhiễm mỡ đơn thuần men gan thường không tăng, cần siêu âm hoặc đo độ đàn hồi FibroScan.',
      'Giảm 7-10% trọng lượng cơ thể bằng cách cắt giảm tinh bột tinh chế và nhịn ăn gián đoạn giúp loại bỏ đáng kể mỡ nội tạng và dập tắt phản ứng viêm tại mô gan.'
    ]
  },
  'dinh-duong-bo-gan': {
    summary: `### 🌿 Tóm tắt cốt lõi: Dinh dưỡng sinh học & Hoạt chất thảo dược bảo vệ tế bào gan
- **Hoạt chất Silymarin (Chiết xuất Kế sữa - Milk Thistle):**
  - Chống oxy hóa màng tế bào gan, ức chế quá trình peroxy hóa lipid.
  - Kích thích RNA polymerase I, thúc đẩy tổng hợp protein và tái sinh mô gan mới.
  - Ức chế sự hoạt hóa của tế bào hình sao, làm chậm quá trình tạo sẹo xơ hóa.
- **Nghệ vàng Curcumin & Piperine:** Kháng viêm mạnh mẽ thông qua ức chế con đường NF-kB, làm giảm men gan AST, ALT và hỗ trợ lưu thông dòng chảy dịch mật (chống ứ mật).
- **Choline & Methionine – Xe cộ vận chuyển mỡ:** Choline là tiền chất tổng hợp Phosphatidylcholine – thành phần vỏ bọc của lipoprotein VLDL. Thiếu Choline, gan không thể đóng gói mỡ để xuất ra ngoài máu, khiến mỡ bị mắc kẹt lại làm gan nhiễm mỡ nặng nề.
- **Thói quen vàng cho lá gan khỏe mạnh:**
  - Không ăn khuya sau 20h để gan tập trung thải độc ban đêm thay vì tiêu hóa.
  - Bổ sung rau họ cải (bông cải xanh, cải xoăn) chứa Sulforaphane kích hoạt Phase 2 Detox.
  - Uống đủ 2–2.5 lít nước kiềm giàu khoáng mỗi ngày hỗ trợ thận bài tiết độc chất từ gan.`,
    takeaways: [
      'Silymarin trong cây kế sữa là tấm khiên sinh học bảo vệ màng tế bào gan trước độc tố thuốc tây và kích hoạt tế bào gan tái tạo cấu trúc mới nhanh chóng.',
      'Choline (có nhiều trong lòng đỏ trứng gà và gan bò) là chất vận chuyển bắt buộc để đưa mỡ ra khỏi gan; ăn kiêng thiếu choline làm mỡ ứ đọng trầm trọng trong gan.',
      'Sulforaphane trong mầm súp lơ xanh kích hoạt mạnh mẽ các enzyme giải độc Giai đoạn 2 của gan, giúp vô hiệu hóa các hợp chất gây ung thư.',
      'Ngủ sâu giấc trước 23h là khung giờ vàng để tuần hoàn máu dồn về gan thực hiện chu trình thanh lọc độc tố và tái tạo tế bào chất sinh học.'
    ]
  }
};

async function processGanMatTuy() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'gan-mat-tuy').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: gan-mat-tuy`);
  for (const p of pages) {
    const data = ganMatTuyData[p.slug];
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
  console.log('✅ TOPIC GAN-MAT-TUY COMPLETED!');
}

processGanMatTuy();

const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const nuocData = {
  'vai-tro-cua-nuoc': {
    summary: `### 💧 Tóm tắt cốt lõi: Nước – Dung môi của sự sống & Cân bằng dịch nội bào
- **Tỷ trọng sinh học:** Nước chiếm 60–70% trọng lượng cơ thể người trưởng thành, phân bổ thành 2 khoang chính: Dịch nội bào (ICF - 67%) và Dịch ngoại bào (ECF - 33%, bao gồm huyết tương và dịch gian bào).
- **Cơ chế trao đổi dịch Starling:** Sự dịch chuyển nước qua thành mao mạch phụ thuộc vào cân bằng giữa Áp lực thủy tĩnh (đẩy dịch ra) và Áp lực keo của Albumin (kéo dịch vào lòng mạch). Giảm Albumin hoặc ứ trệ tuần hoàn gây thoát dịch vào mô kẽ tạo phù nề.
- **Dung môi đệm thần kinh & Hàng rào máu não:** Dịch não tủy (CSF) chứa 99% nước, lưu thông liên tục 150ml để nâng đỡ, hấp thu xung chấn cơ học cho não bộ và tủy sống, đồng thời dẫn lưu các sản phẩm chuyển hóa độc hại ra khỏi tế bào thần kinh.
- **Tiêu chuẩn nước uống sạch:** Nước tinh khiết đạt chuẩn phải loại bỏ triệt để tạp chất rắn lơ lửng, kim loại nặng độc hại (Asen, Chì, Thủy ngân), hợp chất hữu cơ dễ bay hơi (VOCs, Clo dư) và vi sinh vật gây bệnh, đảm bảo an toàn tuyệt đối trước khi bổ sung khoáng chất sinh học.`,
    takeaways: [
      'Áp lực keo do Albumin quyết định khả năng giữ nước trong lòng mạch. Khi gan suy giảm tổng hợp Albumin hoặc thận rò rỉ đạm, nước tràn ra khoang gian bào gây phù chân và báng bụng.',
      'Dịch não tủy thay mới 4–5 lần mỗi ngày. Thiếu nước mạn tính làm giảm tốc độ thanh thải độc chất của hệ Glymphatic não trong khi ngủ, dẫn đến đau đầu âm ỉ và sương mù não.',
      'Nước sạch tinh khiết là điều kiện tiên quyết: loại bỏ hoàn toàn vi khuẩn, kim loại nặng và dư lượng hóa chất công nghiệp trước khi đánh giá các chỉ số sinh hóa nâng cao.',
      'Nước tốt cho sức khỏe cần hội tụ: độ sạch tuyệt đối, giàu Hydrogen hoạt tính chống oxy hóa tế bào, ORP âm sâu và phân tử nước cụm nhỏ giúp thẩm thấu nhanh qua kênh Aquaporin.'
    ]
  },
  'chat-dien-giai': {
    summary: `### ⚡ Tóm tắt cốt lõi: Điện giải Natri, Kali & Áp suất thẩm thấu sinh học
- **Bơm Natri - Kali (Na+/K+-ATPase):** Tiêu tốn 20–40% tổng năng lượng ATP của tế bào để bơm 3 ion Na+ ra ngoài và hút 2 ion K+ vào trong màng. Đây là nền tảng duy trì điện thế nghỉ, dẫn truyền xung động thần kinh và co bóp cơ tim.
- **Phân bổ ion ngoại bào vs nội bào:** Natri (Na+) là cation chủ đạo quyết định áp suất thẩm thấu ngoại bào (135–145 mEq/L). Kali (K+) là cation chủ đạo bên trong tế bào (3.5–5.0 mEq/L trong huyết thanh), điều hòa nhịp tim và trương lực cơ.
- **Cân bằng Canxi & Dẫn truyền thần kinh - cơ:** Canxi ion hóa (Ca2+) kiểm soát ngưỡng kích thích thần kinh và co sợi cơ actin-myosin. Hạ canxi máu gây co rút cơ liên tục (dấu hiệu Chvostek/Trousseau, co cứng bàn tay đỡ đẻ), trong khi tăng canxi gây sỏi thận và rối loạn nhịp.
- **Áp lực thẩm thấu huyết tương:** Dao động nghiêm ngặt ở mức 280–295 mOsm/kg. Thụ thể thẩm thấu tại vùng dưới đồi liên tục giám sát để điều tiết hormone ADH (Vasopressin) giữ nước hoặc thải nước qua ống thận.`,
    takeaways: [
      'Tăng Kali máu trên 5.5 mEq/L là cấp cứu khẩn cấp: làm thay đổi điện thế màng cơ tim, tạo sóng T cao nhọn trên điện tâm đồ và có nguy cơ gây ngừng tim đột ngột.',
      'Hạ Kali máu làm tăng phân cực màng tế bào cơ, dẫn đến yếu liệt cơ tứ chi, chướng bụng giảm nhu động ruột và phát sinh các cơn loạn nhịp tim nguy hiểm.',
      'Tăng Canxi máu kéo dài kích thích lắng đọng tinh thể Canxi Oxalate tại thận tạo sỏi và vôi hóa mạch máu, đồng thời ức chế dẫn truyền thần kinh cơ gây uể oải, táo bón.',
      'Hạ Canxi máu kích thích thần kinh quá mức gây co giật cơ, tê bì quanh miệng và ngón tay; cần bổ sung kèm Magie và Vitamin D3 để tái hấp thu canxi hiệu quả.'
    ]
  },
  'dau-hieu-thieu-nuoc': {
    summary: `### ⚠️ Tóm tắt cốt lõi: Dấu hiệu mất nước & Phương pháp kiểm chuẩn chất lượng nước
- **Các cấp độ mất nước tế bào:** Mất 1–2% trọng lượng nước làm giảm 20% hiệu suất nhận thức và gây khát; mất 4% gây đau đầu, khô miệng, tụt huyết áp tư thế; mất trên 10% đe dọa suy thận cấp và sốc tuần hoàn.
- **Vai trò thiết yếu của Magie (Mg2+):** Magie là cofactor cho hơn 300 phản ứng enzym, đặc biệt liên kết với ATP để giải phóng năng lượng. Thiếu Magie làm tăng tính hưng phấn cơ, gây chuột rút ban đêm, giật mí mắt và rối loạn giấc ngủ.
- **Ý nghĩa chỉ số TDS (Total Dissolved Solids):** TDS đo tổng lượng chất rắn hòa tan (khoáng chất, muối, kim loại) tính bằng mg/L (ppm). TDS cao không đồng nghĩa với nước tốt (có thể chứa kim loại nặng), TDS quá thấp (< 10 ppm) thiếu khoáng tự nhiên.
- **Điện phân kiểm tra nguồn nước:** Thử nghiệm điện phân sử dụng thanh sắt/nhôm để kết tủa các ion kim loại và tạp chất hòa tan, giúp trực quan hóa mức độ tồn dư cặn bẩn trong nguồn nước chưa qua xử lý chuẩn.`,
    takeaways: [
      'Chuột rút bắp chân và co giật cơ vô cớ thường là tín hiệu sớm của thiếu hụt Magie và mất nước tế bào, không thể chỉ bù đắp bằng nước lọc trơ khoáng thông thường.',
      'Thử nghiệm điện phân làm lộ rõ các ion kim loại và tạp chất hòa tan trong nước: nước chứa nhiều tạp chất công nghiệp sẽ kết tủa màu nâu đỏ, váng dầu và mùi nồng.',
      'Bút đo TDS chỉ phản ánh tổng hàm lượng chất rắn dẫn điện hòa tan, không phân biệt được đâu là ion khoáng sinh học có lợi hay kim loại nặng độc hại.',
      'Nồng độ Hydro hòa tan (ppb) và độ pH kiềm tính suy giảm rất nhanh sau khi rót khỏi máy; nước giàu Hydrogen cần được uống tươi trực tiếp trong vòng 15–30 phút.'
    ]
  },
  'nguyen-tac-uong-nuoc': {
    summary: `### 🥤 Tóm tắt cốt lõi: Nguyên tắc uống nước chuẩn sinh học & Công nghệ Hydro hoạt tính
- **Thời điểm vàng uống nước sinh học:** 1 ly (250–300ml) nước ấm ngay sau khi thức dậy bù dịch sau 8 tiếng ngủ và kích thích nhu động đại tràng; 1 ly trước bữa ăn 30 phút hỗ trợ tiết dịch vị; 1 ly trước khi tắm và trước khi đi ngủ ngăn ngừa đông máu cục bộ.
- **Quy tắc uống chậm từng ngụm:** Uống ừng ực lượng lớn làm căng dãn đột ngột dạ dày, ức chế ADH khiến thận thải nước tức thì ra bàng quang thay vì thẩm thấu vào tế bào; cần ngậm và nuốt chậm để kích hoạt thụ thể thần kinh tại khoang miệng.
- **Chỉ số chống oxy hóa ORP (Oxidation Reduction Potential):** Nước tốt có ORP âm sâu (-300mV đến -600mV), mang điện thế khử mạnh giúp trung hòa các gốc tự do Hydroxyl (*OH) nguy hại bên trong ty thể tế bào.
- **Phân tử Hydro (H2) sinh học:** Là chất chống oxy hóa nhỏ nhất trong vũ trụ, có khả năng xuyên qua màng sinh học kép, màng nhân và hàng rào máu não để bảo vệ DNA ty thể mà không can thiệp vào các gốc tự do có lợi cho miễn dịch.`,
    takeaways: [
      'Nước tinh khiết chuẩn RO dùng để nấu ăn, pha chế; nước ion kiềm giàu Hydro tự nhiên tối ưu để uống trực tiếp hỗ trợ giải phóng axit lactic và giảm stress oxy hóa.',
      'Uống nước kiềm chuẩn sinh học: không uống sát hoặc ngay sau bữa ăn chính vì độ kiềm làm loãng và trung hòa axit chlohydric (HCl) của dạ dày gây đầy bụng khó tiêu.',
      'ORP âm sâu (-300mV đến -600mV) và Hydrogen hòa tan cao là chỉ số vàng đo lường năng lực khử gốc tự do; nước có ORP dương là nước có tính oxy hóa tế bào.',
      'Bảo quản nước giàu Hydro trong bình thép không gỉ hoặc thủy tinh tối màu đậy kín; các phân tử H2 siêu nhỏ dễ dàng khuếch tán bay hơi qua bình nhựa mỏng.'
    ]
  },
  'nuoc-va-chuyen-hoa': {
    summary: `### 🔄 Tóm tắt cốt lõi: Nước trong thải độc, Tuần hoàn não & Công nghệ lọc hấp phụ
- **Tuần hoàn dịch não tủy (CSF Dynamics):** Dịch não tủy được sản xuất liên tục tại đám rối màng mạch (Choroid Plexus) trong các não thất, luân chuyển qua cống Sylvius xuống khoang dưới nhện và được hấp thu vào xoang tĩnh mạch màng cứng qua hạt Pacchioni.
- **Hệ thống Glymphatic và rửa não ban đêm:** Khi ngủ sâu, các tế bào thần kinh đệm (Astrocytes) co lại tới 60%, tạo khe hở cho dòng dịch não tủy tràn qua mô não để rửa trôi mảng bám protein độc hại Beta-Amyloid và Tau (nguyên nhân gây bệnh Alzheimer).
- **Cơ chế lọc hấp phụ của than hoạt tính (Activated Carbon):** Cấu trúc xốp với diện tích bề mặt khổng lồ (500–1500 m2/g) giúp bắt giữ và bẻ gãy các liên kết của Clo dư, hợp chất Trihalomethanes (THMs), thuốc trừ sâu và hóa chất hữu cơ bay hơi.
- **Quản trị dòng nước trong dinh dưỡng:** Nước tinh khiết giàu khoáng là môi trường hòa tan tối ưu để rửa trôi axit béo bão hòa, độc tố thức ăn và hỗ trợ thận bài tiết axit uric, ure, creatinin ra ngoài cơ thể.`,
    takeaways: [
      'Dịch não tủy luân chuyển 500ml mỗi ngày trong khoang dưới nhện. Uống đủ nước là điều kiện bắt buộc để duy trì áp lực nội sọ sinh lý và bảo vệ mô thần kinh mềm.',
      'Giấc ngủ sâu từ 23h đến 4h sáng là giai đoạn hệ Glymphatic dùng dịch não tủy dọn dẹp các mảng bám Beta-Amyloid gây thoái hóa thần kinh; mất nước làm đình trệ chu trình này.',
      'Ngâm rửa rau củ quả trong nước kiềm giàu hydrogen giúp bẻ gãy các liên kết hóa học của thuốc bảo vệ thực vật gốc dầu, giúp thực phẩm sạch và giữ trọn vi chất.',
      'Lõi lọc than hoạt tính khối đặc (Carbon Block) có khả năng hấp phụ vượt trội so với than hạt; cần thay thế định kỳ để tránh hiện tượng bão hòa nhả ngược độc chất vào nước.'
    ]
  },
  'can-bang-ph-mau': {
    summary: `### ⚖️ Tóm tắt cốt lõi: Cân bằng toan kiềm & Phân biệt Kiềm khoáng vs Kiềm nhân tạo
- **Dải pH máu sinh lý nghiêm ngặt:** pH máu động mạch luôn được giữ cố định ở mức 7.35 – 7.45. Lệch khỏi khoảng 6.8 – 7.8 sẽ gây ngừng tim hoặc tử vong. Ba hệ thống duy trì gồm: Hệ đệm Bicarbonate (HCO3-/H2CO3), Hệ hô hấp (thải CO2) và Hệ bài tiết thận (thải H+, tái hấp thu HCO3-).
- **Nhiễm toan chuyển hóa vs Nhiễm kiềm hô hấp:** Nhiễm toan chuyển hóa xảy ra khi tích tụ axit lactic, thể ceton (tiểu đường) hoặc suy thận không đào thải được H+; cơ thể bù trừ bằng cách thở nhanh sâu (kiểu thở Kussmaul) để tống bớt CO2.
- **Tính chất nước tinh khiết RO:** Quá trình lọc màng thẩm thấu ngược loại bỏ cả ion khoáng kiềm (Ca2+, Mg2+) và hòa tan một phần CO2 từ không khí tạo axit carbonic nhẹ (H2CO3), làm pH nước RO giảm xuống khoảng 5.5 – 6.5.
- **Bản chất Kiềm khoáng tự nhiên vs Kiềm hóa học:** Kiềm tự nhiên được tạo ra từ khoáng vi lượng sinh học (Magie, Canxi, Kali) qua điện phân phân tách ion nước; kiềm nhân tạo bổ sung muối nở (Sodium Bicarbonate công nghiệp) làm tăng gánh nặng Natri cho thận và tim mạch.`,
    takeaways: [
      'Hệ đệm Bicarbonate trong máu phản ứng trong vài giây để duy trì pH 7.40; uống nước ion kiềm tự nhiên hỗ trợ giảm tải gánh nặng đệm axit nội sinh của cơ thể.',
      'Nhiễm toan chuyển hóa khiến cơ thể phải huy động muối Canxi Phosphat từ xương để trung hòa axit trong máu, là nguyên nhân sâu xa dẫn đến thoái hóa xương và loãng xương.',
      'Nước qua màng RO trơ khoáng có tính axit nhẹ (pH 5.5-6.5); không nên dùng nước trơ khoáng lâu dài mà cần qua lõi tái tạo khoáng kiềm Magie, Canxi sinh học.',
      'Cảnh giác với nước kiềm đóng chai dùng hóa chất nâng pH nhân tạo; nước ion kiềm tươi chuẩn điện phân giàu ion H+ và OH- tự nhiên mới mang lại hoạt tính sinh học đích thực.'
    ]
  }
};

async function processNuoc() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'nuoc').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: nuoc`);
  for (const p of pages) {
    const data = nuocData[p.slug];
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
  console.log('✅ TOPIC NUOC COMPLETED!');
}

processNuoc();

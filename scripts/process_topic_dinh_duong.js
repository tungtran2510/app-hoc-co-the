const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const dinhDuongData = {
  'tong-quan-dinh-duong-hoc': {
    summary: `### 🥗 Tóm tắt cốt lõi: Dinh dưỡng mục tiêu & Cân bằng năng lượng sinh học
- **Định nghĩa Dinh dưỡng mục tiêu:** Dinh dưỡng không chỉ dừng lại ở việc "ăn no" hay "đếm calo" đơn thuần, mà là cung cấp chính xác các dưỡng chất tế bào cần theo từng mục tiêu thể trạng (giảm mỡ, tăng cơ, kháng viêm, phục hồi bệnh lý chuyển hóa).
- **5 Chìa khóa vàng duy trì sức khỏe bền vững:**
  1. *Cân bằng đa lượng:* Tỷ lệ Đạm (20–30%) – Chất béo tốt (25–35%) – Tinh bột chậm (40–50%).
  2. *Đủ vi chất & Nước kiềm giàu hydro:* Đảm bảo các co-factor khoáng chất và chống oxy hóa.
  3. *Tối ưu hóa hệ tiêu hóa (Cắt - Thấm - Đẩy - Giữ):* Đường ruột khỏe mạnh mới hấp thu được dinh dưỡng.
  4. *Kiểm soát dao động Insulin:* Tránh đường huyết tăng vọt gây viêm nội mạc và tích mỡ bụng.
  5. *Nhịp sinh học & Vận động:* Đồng bộ bữa ăn với nhịp ngày đêm và tập kháng lực kích thích trao đổi chất.
- **Quy tắc đĩa ăn cân bằng (Plate Method):** 1/2 đĩa là rau củ quả đa sắc màu (chất xơ & chất chống oxy hóa); 1/4 đĩa là protein chất lượng cao; 1/4 đĩa là tinh bột nguyên cám GI thấp; kèm 1 thìa chất béo tốt (dầu oliu, quả bơ, hạt).`,
    takeaways: [
      'Dinh dưỡng mục tiêu tập trung vào chất lượng dưỡng chất nuôi dưỡng tế bào thay vì chỉ đếm lượng calo thô nạp vào cơ thể.',
      'Bữa ăn lành mạnh cần cân đối bộ ba đa lượng: đạm chất lượng cao, chất béo không bão hòa và tinh bột chuyển hóa chậm giàu chất xơ.',
      'Kiểm soát nồng độ hormone Insulin sau ăn là chìa khóa then chốt để ngăn chặn quá trình tích tụ mỡ thừa nội tạng quanh ổ bụng.',
      'Quy tắc đĩa ăn một nửa là rau củ giúp kiểm soát lượng đường huyết ổn định và cung cấp enzyme tự nhiên cho hệ vi sinh đường ruột.'
    ]
  },
  'chat-dam-protein': {
    summary: `### 🥩 Tóm tắt cốt lõi: Chất đạm (Protein) – Nền tảng xây dựng cơ bắp & Miễn dịch
- **Vai trò sinh học của Protein:** Protein là vật liệu xây dựng mọi cấu trúc cơ thể: sợi cơ actin-myosin, kháng thể miễn dịch, enzyme xúc tác sinh hóa, hormone và collagen mô liên kết.
- **Ngưỡng Leucine & Tổng hợp đạm cơ (MPS):** Axit amin thiết yếu Leucine đóng vai trò như chiếc chìa khóa kích hoạt công tắc mTORC1 tổng hợp cơ bắp. Mỗi bữa ăn cần đạt ngưỡng **2.5 – 3.0g Leucine** (tương đương 25–30g đạm nguyên chất) để tối ưu hóa sự phục hồi cơ.
- **Nhu cầu đạm theo thể trạng:**
  - Người ít vận động: 1.0 – 1.2 g/kg trọng lượng/ngày.
  - Người cao tuổi (ngăn ngừa teo cơ Sarcopenia): 1.2 – 1.5 g/kg/ngày.
  - Người tập kháng lực, giảm mỡ giữ cơ: 1.6 – 2.2 g/kg/ngày.
- **Phối hợp đạm động vật vs thực vật:** Đạm động vật (trứng, cá, thịt gia cầm) có chỉ số giá trị sinh học DIAAS cao, đầy đủ 9 axit amin thiết yếu. Đạm thực vật (các loại đậu, hạt) giàu chất xơ, không chứa cholesterol xấu nhưng thường thiếu hụt methionine hoặc lysine; cần phối hợp đa dạng đậu và ngũ cốc để bổ khuyết axit amin.`,
    takeaways: [
      'Cơ bắp cần đạt ngưỡng 2.5-3.0g Leucine trong mỗi bữa ăn (khoảng 120-150g ức gà hoặc cá) để kích hoạt quá trình tổng hợp và phục hồi sợi cơ.',
      'Người cao tuổi có hiện tượng kháng đồng hóa; cần tăng lượng đạm lên 1.2-1.5g/kg mỗi ngày để chống lại hội chứng teo cơ mất sức (Sarcopenia).',
      'Phối hợp đạm động vật và thực vật theo tỷ lệ 50:50 là chiến lược tối ưu giúp vừa đủ axit amin thiết yếu vừa bảo vệ tim mạch và thận.',
      'Ăn thiếu đạm làm suy sụp hệ miễn dịch, rụng tóc, da nhăn nheo và vết thương lâu lành do cơ thể không đủ nguyên liệu tổng hợp kháng thể và collagen.'
    ]
  },
  'chat-beo-lipid': {
    summary: `### 🥑 Tóm tắt cốt lõi: Chất béo (Lipid) – Màng sinh học tế bào & Cân bằng nội tiết
- **Phân loại chất béo sinh học:**
  - *Chất béo không bão hòa đơn (MUFA - Axit Oleic):* Có trong dầu oliu, quả bơ, hạt mắc ca; làm tăng cholesterol tốt HDL và giảm LDL oxy hóa.
  - *Chất béo không bão hòa đa (PUFA - Omega-3 và Omega-6):* Axit béo thiết yếu cơ thể không tự tổng hợp được.
  - *Chất béo bão hòa (SFA):* Cần lượng vừa phải (dưới 10% tổng calo) từ dầu dừa, bơ động vật.
  - *Chất béo chuyển hóa (Trans Fat):* Chất béo nhân tạo bị hydro hóa trong dầu chiên rán đi chiên lại, bánh quy công nghiệp; là chất cực độc làm tăng xơ vữa động mạch.
- **Tỷ lệ vàng Omega-6 : Omega-3:** Tổ tiên loài người có tỷ lệ 1:1 đến 2:1. Chế độ ăn hiện đại chứa quá nhiều dầu đậu nành, dầu ngô công nghiệp đẩy tỷ lệ lên tới **15:1 – 20:1**, gây bùng phát phản ứng viêm mạn tính cấp tế bào. Cần bổ sung Omega-3 EPA/DHA từ cá béo để đưa tỷ lệ về dưới 4:1.
- **Giải mã Cholesterol:** 80% Cholesterol do gan tự sản xuất, là tiền chất bắt buộc để tạo màng tế bào, hormone sinh dục (Testosterone, Estrogen), hormone Cortisol và muối mật. Thủ phạm gây xơ vữa không phải cholesterol đơn thuần mà là các hạt **LDL bị oxy hóa (Ox-LDL)** và phản ứng viêm nội mạc mạch máu.`,
    takeaways: [
      'Chất béo chuyển hóa (Trans fat) trong dầu chiên đi chiên lại là thủ phạm nguy hiểm hàng đầu gây viêm nội mạc và xơ vữa mạch máu, cần loại bỏ triệt để.',
      'Tỷ lệ Omega-6/Omega-3 trong khẩu phần hiện đại bị lệch quá lớn; tăng cường cá béo (cá hồi, cá thu) giúp dập tắt viêm và bảo vệ tim mạch.',
      'Cholesterol là nguyên liệu tổng hợp màng tế bào và hormone sinh dục; tránh kiêng khem mù quáng mà cần tập trung hạ thấp mức độ oxy hóa của mỡ máu.',
      'Axit béo Omega-3 EPA và DHA có tác dụng bảo vệ tế bào thần kinh não bộ, cải thiện thị lực và giảm nguy cơ đông máu cục bộ nguy hiểm.'
    ]
  },
  'tinh-bot-carbohydrate': {
    summary: `### 🍚 Tóm tắt cốt lõi: Tinh bột (Carbohydrate), Chỉ số GI/GL & Nhịn ăn gián đoạn 16/8
- **Phân loại Carbohydrate & Chỉ số GI, GL:**
  - *Chỉ số đường huyết (GI - Glycemic Index):* Đo tốc độ làm tăng đường huyết sau ăn. Cơm trắng, bánh mì trắng, nước ngọt có GI cao (> 70) gây vọt đỉnh đường huyết và tụt dốc nhanh gây mệt mỏi.
  - *Tải lượng đường huyết (GL - Glycemic Load):* Đo lường tổng lượng carb thực tế nạp vào. Tinh bột nguyên cám (gạo lứt, khoai lang, yến mạch) có GI và GL thấp giúp năng lượng giải phóng ổn định.
- **Cơ chế tích mỡ khi thừa đường:** Khi đường huyết tăng cao, tuyến tụy tiết ồ ạt Insulin để lùa Glucose vào tế bào. Khi các kho dự trữ Glycogen tại gan và cơ bắp đã đầy, Insulin kích hoạt enzyme FAS (Fatty Acid Synthase) biến đường dư thừa thành Triglyceride tích vào mô mỡ dưới da và mỡ nội tạng.
- **Tinh bột kháng (Resistant Starch - RS3):** Tinh bột trong cơm hoặc khoai sau khi nấu chín và để nguội trong tủ lạnh (nghịch đảo tinh bột) sẽ không bị tiêu hóa tại ruột non, đi thẳng xuống đại tràng làm thức ăn thượng hạng cho lợi khuẩn sản sinh Butyrate.
- **Nhịn ăn gián đoạn 16/8 & Cơ chế Autophagy (Nobel Y học 2016):** Nhịn ăn 16 tiếng giúp nồng độ Insulin giảm sâu, cơ thể chuyển từ trạng thái đốt đường sang đốt mỡ thừa (Beta-Oxidation) và kích hoạt quá trình Tự thực bào (Autophagy) dọn dẹp các bào quan già cỗi, tế bào lỗi và protein bất thường.`,
    takeaways: [
      'Tinh bột chuyển hóa nhanh (GI cao) làm đường huyết tăng vọt, kích thích tụy xả ồ ạt Insulin – hormone chủ đạo khóa chặt kho mỡ và ép cơ thể tích trữ mỡ thừa.',
      'Nấu cơm hoặc khoai rồi để nguội trong tủ mát biến tinh bột thường thành tinh bột kháng RS3, giảm chỉ số đường huyết và nuôi dưỡng hệ lợi khuẩn đại tràng.',
      'Nhịn ăn gián đoạn 16/8 hạ thấp Insulin giúp cơ thể tiếp cận và đốt cháy mỡ nội tạng dự trữ, đồng thời kích hoạt quá trình tự dọn rác tế bào Autophagy.',
      'Chất xơ hòa tan (Beta-glucan, Pectin) tạo lớp gel nhớt làm chậm quá trình hấp thu đường và cholesterol, giữ cho năng lượng luôn tỉnh táo suốt cả ngày.'
    ]
  },
  'vitamin-khoang-chat': {
    summary: `### 💊 Tóm tắt cốt lõi: Bách khoa Vi chất – Vitamin & Khoáng chất sinh học
- **Hai nhóm Vitamin:**
  - *Vitamin tan trong dầu (A, D, E, K):* Cần chất béo để hấp thu và tích lũy tại gan; thừa có thể gây độc tính (đặc biệt Vitamin A và D tổng hợp liều cao).
  - *Vitamin tan trong nước (nhóm B và C):* Đóng vai trò Co-enzyme trong chuyển hóa năng lượng, đào thải qua nước tiểu mỗi ngày, cần bổ sung đều đặn.
- **Bộ ba tái tạo xương: Canxi + Vitamin D3 + Vitamin K2 (MK-7):**
  - *Canxi:* Vật liệu cấu trúc xương.
  - *Vitamin D3:* Mở cổng ruột cho Canxi hấp thu vào máu.
  - *Vitamin K2 (MK-7):* Kích hoạt Osteocalcin để **gắn Canxi chính xác vào xương**, đồng thời kích hoạt MGP ngăn Canxi lắng đọng vào thành động mạch gây vôi hóa mạch máu và sỏi thận.
- **Hai vi khoáng miễn dịch & tạo máu:**
  - *Kẽm (Zn):* Cần cho hơn 300 enzyme, phát triển tế bào lympho T miễn dịch và tái tạo niêm mạc.
  - *Sắt (Fe):* Thành phần lõi của Huyết sắc tố (Hemoglobin) mang oxy đến tế bào. Cần Vitamin C đi kèm để khử $Fe^{3+}$ thành $Fe^{2+}$ giúp ruột hấp thu tối đa.
- **Dấu hiệu thiếu hụt vi chất:** Khô mắt, rụng tóc (thiếu Biotin, Kẽm), chảy máu chân răng (thiếu Vitamin C), tê bì đầu chi (thiếu Vitamin B12, B1), co giật mí mắt (thiếu Magie).`,
    takeaways: [
      'Uống canxi bắt buộc phải đi kèm Vitamin D3 và K2 (MK-7); nếu thiếu K2, canxi tự do trong máu sẽ lắng đọng vào thành mạch gây xơ vữa và sỏi thận.',
      'Kẽm là vi khoáng sinh tử cho hệ miễn dịch và tái tạo niêm mạc ruột; ngậm kẽm khi chớm cảm cúm giúp rút ngắn thời gian mắc bệnh đường hô hấp rõ rệt.',
      'Sắt từ thực vật (sắt không Heme) hấp thu kém; kết hợp với thực phẩm giàu Vitamin C như ớt chuông, cam chanh giúp tăng tỷ lệ hấp thu sắt lên gấp 3-4 lần.',
      'Vitamin nhóm B tham gia vào chu trình Krebs tạo năng lượng ATP; thiếu hụt vitamin B1, B6, B12 khiến cơ thể thường xuyên uể oải, mất tập trung và tê bì tay chân.'
    ]
  },
  'dinh-duong-khang-viem': {
    summary: `### 🛡️ Tóm tắt cốt lõi: Dinh dưỡng kháng viêm tế bào & Chế độ ăn Địa Trung Hải
- **Bản chất của Viêm mạn tính cấp độ tế bào:** Khác với viêm cấp tính có sưng nóng đỏ đau giúp làm lành, viêm mạn tính là đám cháy âm ỉ kéo dài nhiều năm dưới tác động của Cytokine gây viêm (IL-6, TNF-alpha). Đây là nguồn gốc khởi phát của xơ vữa động mạch, tiểu đường, thoái hóa khớp và ung thư.
- **Các yếu tố kích hoạt viêm mạnh nhất:** Đường tinh luyện, siro ngô Fructose, dầu ăn hydro hóa giàu Omega-6 bị oxy hóa, thịt chế biến sẵn chứa Nitrit, thực phẩm chiên nướng nhiệt độ cao chứa hợp chất AGEs (Advanced Glycation End-products).
- **Chế độ ăn Địa Trung Hải (Mediterranean Diet) – Chuẩn mực kháng viêm:**
  - Nền tảng thực vật: Rau củ xanh, trái cây mọng (Polyphenol), đậu hạt nguyên cám.
  - Dầu oliu nguyên chất (Extra Virgin) làm nguồn chất béo chính chứa chất chống viêm Oleocanthal (hoạt tính tương tự Ibuprofen).
  - Ưu tiên protein từ cá béo biển sâu (giàu Omega-3) và gia cầm, hạn chế tối đa thịt đỏ.
- **Top thảo dược kháng viêm tự nhiên:** Nghệ vàng (Curcumin kết hợp Piperine), Gừng tươi (Gingerol), Trà xanh (EGCG), Tỏi già (Allicin) giúp ức chế con đường truyền tín hiệu gây viêm NF-kB.`,
    takeaways: [
      'Viêm mạn tính cấp tế bào là đám cháy âm ỉ không có triệu chứng rõ ràng nhưng là gốc rễ của mọi bệnh mạn tính nguy hiểm từ xơ vữa đến thoái hóa khớp.',
      'Dầu oliu nguyên chất chứa hoạt chất Oleocanthal có khả năng ức chế enzyme gây viêm COX-1 và COX-2 tương tự thuốc giảm đau nhưng hoàn toàn lành tính.',
      'Các loại quả mọng sẫm màu (việt quất, dâu tằm) chứa hàm lượng Anthocyanin khổng lồ giúp trung hòa gốc tự do và bảo vệ DNA tế bào khỏi hư hại.',
      'Cắt giảm đường tinh luyện và thực phẩm siêu chế biến là bước đi đầu tiên và quyền lực nhất để dập tắt ngọn lửa viêm mạn tính bên trong cơ thể.'
    ]
  }
};

async function processDinhDuong() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'dinh-duong').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: dinh-duong`);
  for (const p of pages) {
    const data = dinhDuongData[p.slug];
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
  console.log('✅ TOPIC DINH-DUONG COMPLETED!');
}

processDinhDuong();

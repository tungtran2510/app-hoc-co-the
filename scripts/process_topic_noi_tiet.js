const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const noiTietData = {
  'tong-quan-he-noi-tiet': {
    summary: `### 🧭 Tóm tắt cốt lõi: Hệ Nội tiết & Cơ chế truyền tin hormone toàn thân
- **Bản chất của Hệ nội tiết:** Mạng lưới các tuyến không có ống dẫn, tiết trực tiếp các phân tử hóa học (Hormone) vào dòng máu để đến tác động lên các tế bào đích mang thụ thể tương ứng ở khắp cơ thể.
- **Trục chỉ huy Vùng dưới đồi – Tuyến yên (HPA/HPT/HPG Axis):**
  - Vùng dưới đồi (Hypothalamus) là nhạc trưởng tối cao, tích hợp tín hiệu thần kinh và giải phóng các hormone kích thích (RH) hoặc ức chế (IH).
  - Tuyến yên (Pituitary Gland) là "tuyến chỉ huy phó", tiết các hormone kích thích tuyến đích: TSH (tuyến giáp), ACTH (vỏ thượng thận), LH/FSH (tuyến sinh dục), GH (tăng trưởng).
- **Cơ chế điều hòa ngược âm tính (Negative Feedback):** Khi nồng độ hormone tuyến đích trong máu đạt ngưỡng tối ưu, chúng sẽ phát tín hiệu ức chế ngược lại vùng dưới đồi và tuyến yên để ngừng tiết kích thích tố, giữ cho nội môi không bị thừa thãi hormone.
- **Phân loại hormone sinh học:** Hormone steroid (tan trong mỡ như Cortisol, Testosterone, Estrogen chui thẳng vào nhân tế bào tác động lên DNA) vs Hormone peptide/axit amin (tan trong nước như Insulin, Adrenaline gắn lên thụ thể bề mặt màng tế bào).`,
    takeaways: [
      'Hormone là các sứ giả sinh học lưu hành trong máu với nồng độ cực nhỏ (nanogram) nhưng có quyền năng chi phối toàn bộ năng lượng, tâm trạng và sinh sản.',
      'Cơ chế điều hòa ngược âm tính (Feedback âm) là van an toàn tự động bảo vệ cơ thể; lạm dụng thuốc hormone ngoại sinh (như corticoid) sẽ làm teo tuyến nội tiết tự nhiên.',
      'Trục vùng dưới đồi - tuyến yên là cầu nối biến những căng thẳng tâm lý thành các rối loạn nội tiết thực thể tại buồng trứng, tuyến giáp và thượng thận.',
      'Tuyến cận giáp nằm ép sau tuyến giáp tuy nhỏ bằng hạt gạo nhưng đóng vai trò sinh tử tiết hormone PTH điều hòa nồng độ canxi huyết tương 24/7.'
    ]
  },
  'tuyen-giap-chuyen-hoa': {
    summary: `### 🦋 Tóm tắt cốt lõi: Tuyến giáp – Nhạc trưởng điều hòa tốc độ chuyển hóa năng lượng
- **Giải phẫu & Hormone tuyến giáp:** Tuyến giáp hình cánh bướm nằm trước cổ, sản xuất hormone Thyroxine ($T_4$ - 80%) và Triiodothyronine ($T_3$ - 20%, dạng hoạt tính sinh học mạnh gấp 4 lần). Cần nguyên tố vi lượng **I-ốt** và **Selen** (để enzyme Deiodinase chuyển đổi $T_4$ thành $T_3$ tại gan và thận).
- **Vai trò chuyển hóa:** Tuyến giáp quyết định Tốc độ chuyển hóa cơ bản (BMR), điều hòa nhịp tim, thân nhiệt, tốc độ đốt cháy oxy của ty thể và sự phát triển trí não ở trẻ nhỏ.
- **Suy giáp (Hypothyroidism) vs Cường giáp (Hyperthyroidism):**
  - *Suy giáp (thường do viêm tuyến giáp tự miễn Hashimoto):* Thiếu $T_3/T_4$, chuyển hóa chậm chạp, mệt mỏi, sợ lạnh, tăng cân dù ăn ít, táo bón, rụng tóc, phù niêm, sương mù não.
  - *Cường giáp (thường do bệnh Basedow/Graves):* Kháng thể kích thích thụ thể TSH làm tuyến giáp tiết ồ ạt hormone, gây tim đập nhanh, hồi hộp, sụt cân cấp, sợ nóng, run tay, mắt lồi.
- **Tuyến cận giáp & Cường tuyến cận giáp:** 4 tuyến cận giáp tiết hormone PTH để kéo canxi từ xương vào máu khi canxi máu giảm. Cường cận giáp làm hủy hoại xương dẫn đến loãng xương nặng nề, sỏi thận tái phát nhiều lần.`,
    takeaways: [
      'Tuyến giáp quyết định tốc độ chuyển hóa của mọi tế bào; người bị suy giáp dù ăn rất ít vẫn tăng cân và luôn trong trạng thái kiệt sức, ớn lạnh.',
      'Gan là nơi chuyển đổi 60% lượng hormone T4 thụ động thành T3 hoạt tính sinh học; lá gan nhiễm mỡ hoặc suy yếu sẽ làm suy giảm chức năng tuyến giáp gián tiếp.',
      'Viêm tuyến giáp Hashimoto là bệnh tự miễn do hệ miễn dịch tấn công nhầm tuyến giáp; cần kiểm soát tình trạng rò rỉ ruột và bổ sung đủ Selen, Kẽm để giảm kháng thể.',
      'Cường cận giáp kéo canxi ồ ạt ra khỏi khung xương gây giòn xương và lắng đọng tạo sỏi thận; cần xét nghiệm canxi ion hóa và hormone PTH khi bị sỏi thận tái phát.'
    ]
  },
  'tuyen-thuong-than-stress': {
    summary: `### ⚡ Tóm tắt cốt lõi: Tuyến thượng thận, Cortisol & Phản ứng kiệt quệ Stress
- **Cấu trúc 2 phần của tuyến thượng thận:**
  - *Tủy thượng thận (Bên trong):* Tiết **Adrenaline** và **Noradrenaline** kích hoạt phản xạ "Chiến hay Chạy" tức thời (tăng nhịp tim, giãn phế quản, dồn máu tới cơ bắp).
  - *Vỏ thượng thận (Bên ngoài):* Tiết Aldosterone (giữ muối nước), Androgen (hormone sinh dục) và đặc biệt là **Cortisol** (Glucocorticoid - hormone sinh tồn dài hạn).
- **Nhịp sinh học tự nhiên của Cortisol:** Đỉnh cao nhất vào 6–8h sáng để đánh thức cơ thể và bơm năng lượng; giảm dần trong ngày và chạm đáy vào nửa đêm để nhường chỗ cho hormone giấc ngủ Melatonin.
- **Cơ chế Stress mạn tính & Kháng Cortisol:** Căng thẳng kéo dài làm Cortisol tăng cao liên tục, gây tăng đường huyết, tích mỡ nội tạng quanh bụng, ức chế miễn dịch, teo hồi hải mã não bộ và phá hủy giấc ngủ sâu.
- **Hội chứng kiệt quệ thượng thận (Adrenal Burnout):** Sau giai đoạn căng thẳng kéo dài quá mức, tuyến thượng thận rơi vào trạng thái suy kiệt không thể sản xuất đủ Cortisol, dẫn đến kiệt sức vào ban ngày nhưng thao thức ban đêm, tụt huyết áp tư thế và thèm đồ ngọt/muối dữ dội.`,
    takeaways: [
      'Cortisol tăng cao mạn tính do stress thúc đẩy quá trình tích tụ mỡ sâu nội tạng quanh eo và bẻ gãy các mô cơ nạc để chuyển hóa thành đường.',
      'Cortisol cao vào ban đêm sẽ trực tiếp ức chế tuyến tùng tiết Melatonin, gây ra hiện tượng mắt mở thao thức dù cơ thể vô cùng mệt mỏi.',
      'Lạm dụng cà phê và chất kích thích khi cơ thể đang kiệt quệ chỉ ép tuyến thượng thận vắt kiệt những giọt Adrenaline cuối cùng, đẩy nhanh tiến trình suy kiệt.',
      'Các bài tập thở chậm 4-7-8, tiếp xúc ánh nắng sớm và bổ sung thảo dược thích nghi (Ashwagandha, Rhodiola) giúp điều hòa lại trục HPA thượng thận.'
    ]
  },
  'tuyen-tuy-insulin': {
    summary: `### 🔑 Tóm tắt cốt lõi: Đảo tụy nội tiết, Insulin & Cơ chế Kháng Insulin
- **Đảo tụy Langerhans:** Chiếm 2% khối lượng tụy, gồm tế bào Alpha (tiết Glucagon nâng đường huyết) và tế bào Beta (tiết **Insulin** hạ đường huyết).
- **Insulin – Chiếc chìa khóa mở cổng tế bào:** Insulin gắn vào thụ thể trên màng tế bào cơ và mỡ, kích hoạt túi chứa kênh vận chuyển **GLUT-4** trồi lên màng để thu nạp Glucose từ máu vào trong tế bào tạo năng lượng.
- **Đái tháo đường Tuýp 1 vs Tuýp 2:**
  - *Tuýp 1 (Tự miễn):* Tế bào lympho T tấn công phá hủy hoàn toàn tế bào Beta tụy, cơ thể tuyệt đối không có Insulin, bắt buộc phải tiêm Insulin ngoại sinh suốt đời.
  - *Tuýp 2 (Kháng Insulin):* Chiếm 90–95% ca bệnh. Tụy tiết rất nhiều Insulin nhưng các thụ thể tại gan và cơ bắp bị "trơ/chai lì" do mỡ nội tạng chèn ép và stress oxy hóa. Đường không vào được tế bào khiến đường huyết tăng cao trong khi tế bào bị "đói năng lượng".
- **Tiến trình âm thầm 10–15 năm:** Kháng Insulin diễn ra âm thầm cả thập kỷ trước khi đường huyết lúc đói vượt ngưỡng chẩn đoán tiểu đường. Dấu hiệu sớm gồm: vệt gai đen ở cổ/nách (Acanthosis Nigricans), mụn thịt dư, vòng eo vượt 90cm ở nam và 80cm ở nữ.`,
    takeaways: [
      'Tiểu đường tuýp 2 bản chất là bệnh lý kháng Insulin do dư thừa năng lượng tích mỡ, không phải do tụy bị hỏng ngay từ ban đầu.',
      'Tập luyện phát triển cơ bắp là cách tốt nhất để chữa kháng Insulin vì mô cơ có thể hấp thu đường trực tiếp mà không cần phụ thuộc hoàn toàn vào Insulin.',
      'Dấu hiệu vệt da sẫm màu ở sau gáy hoặc nách (gai đen) là tín hiệu lâm sàng cảnh báo nồng độ Insulin trong máu đang tăng rất cao.',
      'Cắt giảm đường tinh chế và áp dụng khoảng nhịn giữa các bữa ăn giúp các thụ thể tế bào được nghỉ ngơi và lấy lại độ nhạy cảm tự nhiên với Insulin.'
    ]
  },
  'hormone-tang-truong-giac-ngu': {
    summary: `### 🌙 Tóm tắt cốt lõi: Tuyến tùng, Melatonin & Hormone tăng trưởng (GH)
- **Tuyến tùng & Hormone bóng đêm Melatonin:** Tuyến tùng nằm sâu giữa não bộ, nhạy cảm với ánh sáng qua đường dẫn truyền võng mạc - nhân trên chéo (SCN). Khi trời tối, nồng độ Melatonin tăng vọt, hạ thân nhiệt và đưa cơ thể vào trạng thái buồn ngủ. Ánh sáng xanh từ màn hình điện thoại ức chế tuyến tùng tiết Melatonin khiến nhịp sinh học bị đảo lộn.
- **Hormone Tăng trưởng (GH - Growth Hormone):** Tiết ra theo từng đợt xung nhịp, trong đó **70% lượng GH trong ngày được giải phóng trong giai đoạn Giấc ngủ sóng chậm (N3 - Deep Sleep)** từ 23h đến 2h sáng.
- **Vai trò phục hồi của GH ở người trưởng thành:** GH kích thích gan tiết IGF-1 để sửa chữa các vi tổn thương cơ bắp, đốt mỡ nội tạng, tái tạo collagen dưới da và phục hồi tế bào miễn dịch. Thức khuya làm sụt giảm GH khiến cơ thể nhanh lão hóa, chảy xệ da và khó giảm mỡ.
- **Vệ sinh giấc ngủ chuẩn sinh học:** Phòng ngủ tối hoàn toàn và mát mẻ (18–22°C); ngừng sử dụng thiết bị điện tử 60 phút trước khi ngủ; tắm nước ấm để kích hoạt phản xạ hạ nhiệt độ lõi cơ thể.`,
    takeaways: [
      'Ánh sáng xanh từ điện thoại đánh lừa não bộ rằng trời vẫn đang sáng, ức chế tuyến tùng tiết Melatonin và làm phá hủy hoàn toàn chất lượng giấc ngủ sâu.',
      'Hormone tăng trưởng GH tiết ra nhiều nhất lúc ngủ sâu từ 23h đêm đến 2h sáng; ngủ muộn sau 12h đêm làm mất đi cơ hội vàng để cơ thể sửa chữa và tái sinh mô nạc.',
      'Melatonin là một chất chống oxy hóa ty thể cực mạnh, có khả năng quét dọn gốc tự do và bảo vệ não bộ khỏi các bệnh thoái hóa thần kinh.',
      'Nhiệt độ phòng ngủ mát mẻ giúp nhiệt độ lõi cơ thể hạ xuống, kích hoạt phản xạ sinh học đưa hệ thần kinh nhanh chóng chìm vào trạng thái ngủ sâu phục hồi.'
    ]
  },
  'hoi-chung-chuyen-hoa': {
    summary: `### 🧬 Tóm tắt cốt lõi: Hội chứng Chuyển hóa, Bệnh Gút & Rối loạn tiền đình
- **Tiêu chuẩn Hội chứng Chuyển hóa (Metabolic Syndrome):** Chẩn đoán khi có ít nhất 3 trong 5 yếu tố:
  1. Béo bụng: Vòng eo > 90cm (nam) hoặc > 80cm (nữ).
  2. Triglyceride máu cao: $\\ge 150$ mg/dL (1.7 mmol/L).
  3. HDL-Cholesterol tốt thấp: $< 40$ mg/dL (nam) hoặc $< 50$ mg/dL (nữ).
  4. Huyết áp cao: $\\ge 130/85$ mmHg.
  5. Đường huyết lúc đói cao: $\\ge 100$ mg/dL (5.6 mmol/L).
- **Cơ chế Bệnh Gút (Thống phong):** Tăng Axit Uric máu kéo dài (do tăng thoái hóa Purin hoặc thận giảm đào thải) làm axit uric bão hòa kết tủa thành các tinh thể hình kim **Monosodium Urate** đâm vào màng hoạt dịch khớp (thường gặp khớp bàn ngón chân cái). Tinh thể này kích hoạt đại thực bào giải phóng Cytokine IL-1beta gây cơn viêm khớp gút cấp đau đớn tột cùng.
- **Rối loạn tiền đình và Tuần hoàn não:** Thiểu năng tuần hoàn não xuất phát từ thoái hóa cột sống cổ chèn ép động mạch đốt sống thân nền hoặc do mảng xơ vữa làm hẹp mạch máu nuôi tiểu não và ốc tai tiền đình, gây chóng mặt, mất thăng bằng, hoa mắt khi đổi tư thế.`,
    takeaways: [
      'Hội chứng chuyển hóa làm tăng gấp 3 lần nguy cơ nhồi máu cơ tim và đột quỵ; kiểm soát mỡ bụng và độ nhạy Insulin là mục tiêu phòng ngừa hàng đầu.',
      'Cơn gút cấp bắt nguồn từ tinh thể Urat hình kim đâm rách màng hoạt dịch khớp; uống bia và nước ngọt Fructose là hai thủ phạm hàng đầu làm tăng vọt Axit Uric máu.',
      'Rối loạn tiền đình ở người trung niên thường bắt nguồn từ thoái hóa đốt sống cổ chèn ép động mạch đốt sống; cần kết hợp chỉnh hình cột sống và tăng lưu thông máu não.',
      'Uống đủ nước kiềm giàu khoáng giúp kiềm hóa nước tiểu nhẹ nhàng, hỗ trợ thận tăng tốc độ đào thải tinh thể Axit Uric ra ngoài, ngăn ngừa sỏi Urat.'
    ]
  }
};

async function processNoiTiet() {
  const { data: topic } = await supabase.from('topics').select('id').eq('slug', 'noi-tiet-chuyen-hoa').single();
  const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', topic.id).order('sort_order');
  
  console.log(`Processing ${pages.length} pages in topic: noi-tiet-chuyen-hoa`);
  for (const p of pages) {
    const data = noiTietData[p.slug];
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
  console.log('✅ TOPIC NOI-TIET-CHUYEN-HOA COMPLETED!');
}

processNoiTiet();

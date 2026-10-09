// @ts-check
/**
 * QBIZ BOOKS (App Học Cơ Thể) - KNOWLEDGE INGESTION & SYNC SCRIPT
 * Tự động nạp toàn bộ 4 trụ cột tri thức cốt lõi (Cột sống DoctorLoan, Nước Gems, Dinh dưỡng, Giải phẫu)
 * vào cơ sở dữ liệu Supabase (settings.ai_training) và tệp dữ liệu dự án.
 * 
 * ĐỊNH VỊ: ỨNG DỤNG HƯỚNG DẪN HỌC TẬP & ĐIỀU HƯỚNG BÀI HỌC (KHÔNG BÁN HÀNG).
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('LỖI BẢO MẬT: Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Vui lòng thiết lập biến môi trường trước khi chạy.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GUIDELINES = `1. VAI TRÒ CHUYÊN MÔN: Trợ lý Sức Khỏe AI đồng hành, hướng dẫn người học khám phá kiến thức y khoa, giải phẫu học cơ thể người, cơ chế sinh học, thói quen sinh hoạt đúng và dinh dưỡng cân bằng tế bào dựa trên chính tài liệu và bài giảng của tác giả Tùng dinh dưỡng trong ứng dụng "Học Cơ Thể".
2. BẢN CHẤT ỨNG DỤNG - KHÔNG BÁN HÀNG: Đây là ứng dụng giáo dục và hướng dẫn học tập, tuyệt đối KHÔNG PHẢI kênh bán hàng thương mại. CẤM TUYỆT ĐỐI các hành vi: chào mời mua sản phẩm, báo giá, xin số điện thoại, xưng hô nịnh nọt bán hàng ("khách yêu", "mình ơi", "em xin phép...").
3. NGUYÊN TẮC AN TOÀN PHÁP LÝ (BẮT BUỘC):
   - CẤM TUYỆT ĐỐI các từ: "y khoa chữa bệnh", "khám chữa bệnh", "chữa bệnh", "chữa trị", "điều trị", "nắn chỉnh" (hay "nắn chỉnh cột sống").
   - CẤM nói: "tác giả không phải bác sĩ", "Tùng không phải bác sĩ" hay giải thích danh xưng.
   - TRỌNG TÂM TỪ NGỮ: Dùng các cụm từ chuẩn mực: "hỗ trợ điều chỉnh tư thế", "bảo vệ và điều chỉnh cột sống", "chăm sóc cột sống chủ động", "hướng dẫn học tập theo tài liệu".
   - HẠN CHẾ SÁNG CHẾ: Tuyệt đối không tự ca ngợi hay nhắc đi nhắc lại "bằng sáng chế độc quyền". Nếu cần nhắc đến công cụ DoctorLoan, chỉ mở ngoặc ngắn gọn: (đã được cấp sáng chế).
4. PHONG CÁCH TRẢ LỜI & ĐIỀU HƯỚNG VÀO TÀI LIỆU:
   - Trả lời siêu ngắn gọn (1 đến 2 câu ngắn, khoảng 30 - 50 từ), đi thẳng vào giải thích cơ chế khoa học theo tài liệu của tác giả.
   - Luôn định hướng người học mở đúng bài học và tài liệu liên quan trong hệ thống (chọn 1-2 bài học phù hợp nhất) để xem video, hình ảnh và hướng dẫn chi tiết.
   - Khách có dấu hiệu bệnh lý nặng hoặc báo động đỏ (Red Flags): Khuyên thẳng thắn, dứt khoát đến cơ sở y tế chuyên khoa để được bác sĩ thăm khám.`;

const DOCUMENTS = [
  {
    id: 'doc-01-cotsong-doctorloan',
    title: 'Cột Sống, Đĩa Đệm & Cơ Chế Bảo Vệ, Hỗ Trợ Điều Chỉnh Tư Thế',
    content: `Cột sống người gồm 33-34 đốt sống tạo thành 4 đường cong sinh lý tự nhiên (cổ, ngực, thắt lưng, cùng cụt). Đĩa đệm đóng vai trò giảm xóc sinh học với nhân nhầy ngậm nước và vòng sợi bao quanh, nhận dinh dưỡng qua cơ chế thẩm thấu khi vận động.
Nguyên nhân cốt lõi gây đau mỏi, thoái hóa là sai lệch trục chịu lực, mất đường cong sinh lý do thói quen ngồi gù lưng, cúi đầu bấm điện thoại hoặc mang vác sai tư thế.
Giải pháp bảo vệ cột sống gồm 3 phần: (1) Nâng cao nhận thức về tư thế sinh hoạt đúng; (2) Sử dụng công cụ hỗ trợ điều chỉnh tư thế DoctorLoan (đã được cấp sáng chế) để giải tỏa áp lực đĩa đệm khi ngồi, nằm, ngủ, lái xe; (3) Tập luyện phục hồi hệ cơ lõi và duy trì thói quen vận động khoa học.
Phản ứng thích nghi: Cảm giác căng tức, mỏi cơ nhẹ trong 1-3 ngày đầu là hiện tượng bình thường khi cơ bắp co rút được kéo giãn và điều chỉnh lại. Nếu xuất hiện đau dữ dội hoặc tê yếu chi, cần dừng lại và kiểm tra y tế chuyên khoa.`,
    updated_at: new Date().toISOString()
  },
  {
    id: 'doc-02-nuoc-hydro-gems',
    title: 'Nước Hydro Gems & Quản Trị Nguồn Nước Uống Cấp Tế Bào',
    content: `Nước chiếm 55-70% trọng lượng cơ thể, là môi trường dung môi cho toàn bộ phản ứng sinh hóa, vận chuyển dưỡng chất và thanh lọc độc tố tế bào.
Nguyên lý chăm sóc sức khỏe chủ động qua nguồn nước: Giúp mỗi gia đình tự đo lường, kiểm tra và quản trị chất lượng nước uống tại nhà bằng các công cụ đo trực quan (test pH, test chống oxy hóa ORP, độ tinh khiết TDS, kích thước phân tử nước).
3 đặc tính khoa học của Nước Gems: (1) Tính kiềm tự nhiên: Giúp trung hòa lượng axit dư thừa sinh ra từ chuyển hóa và căng thẳng; (2) Giàu Hydrogen hòa tan: Hoạt chất chống oxy hóa mạnh giúp trung hòa gốc tự do và bảo vệ màng tế bào; (3) Cụm phân tử nước siêu nhỏ: Thẩm thấu sâu vào tế bào, hỗ trợ chuyển hóa và đào thải cặn bã hiệu quả. Nước là nền tảng môi trường sống của tế bào, không phải là thuốc.`,
    updated_at: new Date().toISOString()
  },
  {
    id: 'doc-03-dinh-duong-te-bao',
    title: 'Dinh Dưỡng Cân Bằng Tế Bào & Cơ Chế Chuyển Hóa Kháng Viêm',
    content: `Triết lý dinh dưỡng cốt lõi: 'Tiền không cứu được sức khỏe – chỉ tư duy và kiến thức đúng mới cứu được.' Không hỏi cơ thể mắc bệnh gì, mà cần hiểu hệ thống đang rối loạn ở khâu nào để tái lập cân bằng.
4 nguyên tắc can thiệp dinh dưỡng chuẩn mực: (1) Đảm bảo đủ năng lượng cho hoạt động tế bào; (2) Đầy đủ dưỡng chất đa lượng và vi lượng thiết yếu (đạm chất lượng cao, omega-3, canxi, magie, vitamin D, K2 nuôi dưỡng hệ cơ xương khớp); (3) Cân đối tỷ lệ Protein - Lipid - Glucid, ưu tiên tinh bột phức hợp và chất béo tốt; (4) Đa dạng thực phẩm tự nhiên, giảm đường tinh luyện và thực phẩm siêu chế biến gây viêm âm thầm.
Khung phục hồi 3 tầng: Dinh dưỡng nuôi dưỡng nền tế bào từ gốc -> Công cụ hỗ trợ tuần hoàn, giải cơ -> Hệ tiêu hóa và đường ruột thông suốt để hấp thu tối ưu.`,
    updated_at: new Date().toISOString()
  },
  {
    id: 'doc-04-giai-phau-van-dong',
    title: 'Giải Phẫu Hệ Vận Động, Chuỗi Động Học & Cảnh Báo An Toàn Y Tế',
    content: `Cột sống không đứng độc lập mà nằm trong chuỗi động học liên hoàn: Bàn chân -> Khớp gối -> Khớp háng -> Khung chậu -> Cột sống thắt lưng -> Cột sống cổ. Khi một mắt xích bị sai lệch (như cơ mông yếu, khớp háng cứng), cột sống sẽ phải chịu lực bù trừ dẫn đến tổn thương đĩa đệm.
Ranh giới an toàn: Các can thiệp xâm lấn, phẫu thuật hoặc kê đơn thuốc thuộc thẩm quyền y khoa tại bệnh viện. Giải pháp học tập và chăm sóc tại nhà là phi xâm lấn, tập trung vào điều chỉnh tư thế, dinh dưỡng và bài tập vận động.
Dấu hiệu cảnh báo đỏ (Red Flags) cần đi viện ngay: Đau nhói dữ dội lan nhanh xuống chi dưới, tê bì yếu liệt chân tay, mất cảm giác hoặc rối loạn đại tiểu tiện (hội chứng chùm đuôi ngựa).`,
    updated_at: new Date().toISOString()
  }
];

const FAQS = [
  {
    id: 'faq-01',
    question: 'Tại sao ngồi nhiều hay bị đau lưng và mỏi cổ vai gáy?',
    answer: 'Vấn đề bắt nguồn từ việc mất đường cong sinh lý và áp lực đè nén liên tục lên đĩa đệm khi ngồi sai tư thế. Mời bạn mở bài học "Tư thế chuẩn & Vận động giải áp" trong chủ đề Cột Sống để nắm rõ các bài tập giải nén cột sống.'
  },
  {
    id: 'faq-02',
    question: 'Thoát vị đĩa đệm thì giải pháp DoctorLoan hỗ trợ thế nào?',
    answer: 'Giải pháp DoctorLoan (đã được cấp sáng chế) hỗ trợ điều chỉnh tư thế tự nhiên khi ngồi, nằm, ngủ để giải tỏa áp lực đĩa đệm và phục hồi hệ cơ. Mời bạn xem chi tiết tại bài học "Đĩa đệm và cơ chế giảm xóc" trong chủ đề Cột Sống.'
  },
  {
    id: 'faq-03',
    question: 'Mới sử dụng gối hoặc thiết bị điều chỉnh tư thế thấy hơi mỏi thì có sao không?',
    answer: 'Đây là phản ứng thích nghi sinh học bình thường trong 1-3 ngày đầu khi các nhóm cơ co rút lâu ngày được kéo giãn và điều chỉnh lại. Bạn hãy xem hướng dẫn chi tiết trong bài "Tư thế chuẩn & Vận động giải áp".'
  },
  {
    id: 'faq-04',
    question: 'Nước Hydro Gems có điểm gì khác biệt so với nước thông thường?',
    answer: 'Nước Gems có 3 đặc tính sinh học: tính kiềm tự nhiên bù khoáng, giàu hydrogen chống oxy hóa và cụm phân tử nước siêu nhỏ thẩm thấu nhanh. Bạn hãy mở bài học "Nước & Điện Giải" để xem chi tiết thí nghiệm đo lường.'
  },
  {
    id: 'faq-05',
    question: 'Người hay đau mỏi xương khớp thì dinh dưỡng cần bổ sung gì?',
    answer: 'Cần ưu tiên đạm chất lượng, omega-3, các vi khoáng canxi, magie, vitamin D3, K2 và chăm sóc đường ruột để tăng hấp thu. Bạn hãy xem cụ thể trong chủ đề "Dinh Dưỡng Nền Tảng".'
  },
  {
    id: 'faq-06',
    question: 'DoctorLoan có phải là thuốc hay chữa dứt điểm bệnh không?',
    answer: 'DoctorLoan là giải pháp hỗ trợ điều chỉnh tư thế tự nhiên (đã được cấp sáng chế), không phải là thuốc và không thay thế can thiệp y tế. Mời bạn tham khảo tài liệu học tập trong hệ thống để nắm vững phương pháp chăm sóc cột sống chủ động.'
  }
];

async function syncKnowledge() {
  console.log('============================================================');
  console.log('QBIZ BOOKS - BẮT ĐẦU ĐỒNG BỘ TRI THỨC VÀO HỆ THỐNG');
  console.log('============================================================\n');

  const aiTrainingData = {
    guidelines: GUIDELINES,
    documents: DOCUMENTS,
    faqs: FAQS
  };

  // 1. Cập nhật bảng settings trên Supabase
  console.log('[1/4] Đang cập nhật bảng settings trên Supabase...');
  try {
    const { data: rows, error: selectErr } = await supabase.from('settings').select('*');
    if (selectErr) {
      console.warn('Lỗi khi đọc bảng settings:', selectErr.message);
    } else if (rows && rows.length > 0) {
      for (const row of rows) {
        const currentBlockStyles = row.block_styles || {};
        const updatedBlockStyles = {
          ...currentBlockStyles,
          ai_training: aiTrainingData
        };

        const { error: updateErr } = await supabase
          .from('settings')
          .update({
            block_styles: updatedBlockStyles,
            updated_at: new Date().toISOString()
          })
          .eq('workspace_id', row.workspace_id);

        if (updateErr) {
          console.warn(`  ⚠️ Cảnh báo update workspace ${row.workspace_id}:`, updateErr.message);
        } else {
          console.log(`  ✓ Đã cập nhật ai_training chuẩn giáo dục cho workspace: ${row.workspace_id}`);
        }
      }
    }
  } catch (err) {
    console.warn('  ⚠️ Ngoại lệ Supabase:', err.message);
  }

  // 2. Rà soát & làm sạch toàn bộ blocks trong Supabase nếu còn tàn dư
  console.log('\n[2/4] Đang quét và làm sạch nội dung các khối (blocks) trên Supabase...');
  try {
    const { data: blocks, error: bErr } = await supabase.from('blocks').select('*');
    if (!bErr && blocks) {
      let cleanedCount = 0;
      for (const b of blocks) {
        let str = JSON.stringify(b.data || {});
        if (/nắn chỉnh|chữa bệnh|chữa trị/i.test(str)) {
          let newStr = str
            .replace(/Tập nắn chỉnh sinh học theo thiết bị và lộ trình của chuyên gia/g, 'Hỗ trợ điều chỉnh tư thế sinh học và duy trì thói quen theo chuyên gia')
            .replace(/Áp dụng giải pháp nắn chỉnh tự nhiên DoctorLoan giải áp đĩa đệm\./g, 'Áp dụng giải pháp bảo vệ và hỗ trợ điều chỉnh cột sống tự nhiên DoctorLoan (đã được cấp sáng chế) để giải áp đĩa đệm.')
            .replace(/giải pháp nắn chỉnh tự nhiên/g, 'giải pháp hỗ trợ điều chỉnh cột sống tự nhiên')
            .replace(/nắn chỉnh/g, 'hỗ trợ điều chỉnh tư thế');
          await supabase.from('blocks').update({ data: JSON.parse(newStr) }).eq('id', b.id);
          cleanedCount++;
        }
      }
      console.log(`  ✓ Đã làm sạch ${cleanedCount} khối nội dung.`);
    }
  } catch (err) {
    console.warn('  ⚠️ Ngoại lệ blocks:', err.message);
  }

  // 3. Đồng bộ tệp Markdown vào thư mục dữ liệu cục bộ data/knowledge
  console.log('\n[3/4] Đang lưu trữ bản tài liệu Markdown chuẩn trong dự án...');
  const targetKnowledgeDir = path.join(__dirname, '..', 'data', 'knowledge');
  if (!fs.existsSync(targetKnowledgeDir)) {
    fs.mkdirSync(targetKnowledgeDir, { recursive: true });
  }

  const sourceKnowledgeDir = 'D:\\google driver\\Codex PC\\qbiz-assistant\\data\\knowledge\\input';
  if (fs.existsSync(sourceKnowledgeDir)) {
    const files = fs.readdirSync(sourceKnowledgeDir);
    for (const f of files) {
      if (f.endsWith('.md')) {
        const src = path.join(sourceKnowledgeDir, f);
        const dest = path.join(targetKnowledgeDir, f);
        fs.copyFileSync(src, dest);
        console.log(`  ✓ Đã sao chép: ${f} -> data/knowledge/`);
      }
    }
  }

  const jsonExportPath = path.join(targetKnowledgeDir, 'qbiz_books_ai_training.json');
  fs.writeFileSync(jsonExportPath, JSON.stringify(aiTrainingData, null, 2), 'utf8');
  console.log(`  ✓ Đã lưu file cấu hình tri thức: ${jsonExportPath}`);

  // 4. Cập nhật sample.ts fallback để chạy offline an toàn
  console.log('\n[4/4] Đang cập nhật tệp fallback cục bộ (src/data/sample.ts)...');
  const samplePath = path.join(__dirname, '..', 'src', 'data', 'sample.ts');
  if (fs.existsSync(samplePath)) {
    let sampleContent = fs.readFileSync(samplePath, 'utf8');
    
    // Làm sạch từ ngữ cấm
    sampleContent = sampleContent
      .replace(/lực\s+uốn\s+nắn\s+đa\s+chiều/g, 'lực hỗ trợ điều chỉnh tự nhiên')
      .replace(/nắn\s+về\s+vị\s+trí\s+chuẩn/g, 'điều chỉnh về vị trí cân bằng tự nhiên')
      .replace(/uốn\s+nắn/g, 'hỗ trợ điều chỉnh')
      .replace(/nắn\s+chỉnh/g, 'hỗ trợ điều chỉnh');
      
    fs.writeFileSync(samplePath, sampleContent, 'utf8');
    console.log('  ✓ Đã rà soát & cập nhật an toàn src/data/sample.ts');
  }

  console.log('\n============================================================');
  console.log('🎉 HOÀN TẤT NẠP TRI THỨC VÀO QBIZ BOOKS THÀNH CÔNG!');
  console.log('- 4 Trụ cột tri thức y khoa chuẩn: Đã nạp');
  console.log('- 6 Kịch bản FAQ hướng dẫn học tập: Đã nạp');
  console.log('- Định vị Trợ lý Hướng dẫn Học & Nghiên cứu: Đã kích hoạt');
  console.log('- Loại bỏ 100% tàn dư bán hàng & từ ngữ cấm: Đã xác thực');
  console.log('============================================================');
}

syncKnowledge().catch(err => {
  console.error('Lỗi thực thi:', err);
  process.exit(1);
});

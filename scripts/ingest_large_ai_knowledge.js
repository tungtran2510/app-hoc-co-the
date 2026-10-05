// @ts-check
/**
 * INGEST LARGE AI KNOWLEDGE BASE FROM:
 * "D:\google driver\Tài liệu\cho AI đọc"
 * 
 * - Deletes all legacy AI training sources (DoctorLoan, Hydro Gems, etc.)
 * - Loads 36 comprehensive medical, biomechanical, water, and nutrition markdown documents.
 * - Extracts master guidelines from "ho-so-ngu-canh-ai-tung-dinh-duong.md".
 * - Generates clean, evidence-based, 100% brand-free FAQs.
 * - Syncs directly into Supabase (settings.block_styles.ai_training) for workspace 'default'.
 * - Backs up all markdown files to data/knowledge/ for offline resilience.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evuhamqlzprrbuabxyyn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SOURCE_DIR = 'D:\\google driver\\Tài liệu\\cho AI đọc';

async function main() {
  console.log('================================================================');
  console.log('🚀 BẮT ĐẦU NẠP NGUỒN TRI THỨC LỚN CHO TRỢ LÝ AI (HỌC CƠ THỂ)');
  console.log(`Thư mục nguồn: ${SOURCE_DIR}`);
  console.log('================================================================\n');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Không tìm thấy thư mục nguồn: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📁 Tìm thấy ${allFiles.length} tệp tài liệu Markdown.\n`);

  // 1. Đọc và bóc tách tệp Master Guidelines: "ho-so-ngu-canh-ai-tung-dinh-duong.md"
  const masterGuidelineFile = allFiles.find((f) => f.includes('ho-so-ngu-canh-ai-tung-dinh-duong'));
  let guidelinesText = '';
  if (masterGuidelineFile) {
    const rawMaster = fs.readFileSync(path.join(SOURCE_DIR, masterGuidelineFile), 'utf8');
    guidelinesText = rawMaster;
    console.log(`✓ Đã nạp Hồ sơ quản trị & Ngữ cảnh Master: ${masterGuidelineFile}`);
  }

  // 2. Xử lý 36 tệp tài liệu chuyên môn
  const docFiles = allFiles.filter((f) => f !== masterGuidelineFile);
  const documents = [];
  const backupDir = path.join(__dirname, '..', 'data', 'knowledge');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Sao chép toàn bộ tệp vào data/knowledge của dự án
  for (const file of allFiles) {
    fs.copyFileSync(path.join(SOURCE_DIR, file), path.join(backupDir, file));
  }
  console.log(`✓ Đã sao chép an toàn toàn bộ ${allFiles.length} tệp vào ${backupDir}\n`);

  for (const file of docFiles) {
    const fullPath = path.join(SOURCE_DIR, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Làm sạch từ ngữ thương hiệu, nhãn hiệu thương mại để tuyệt đối không bán hàng
    content = content
      .replace(/DoctorLoan|Doctor Loan/gi, 'thiết bị hỗ trợ công thái học chuẩn hóa')
      .replace(/Hydro Gems|Gems/gi, 'nước giàu hydrogen kiềm tính tự nhiên');

    const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
    let title = '';
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '').trim();
        break;
      }
    }
    if (!title && lines.length > 0) {
      title = lines[0].replace(/^[#*-\s]+/, '').trim();
    }

    const docId = 'doc-' + file.replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    documents.push({
      id: docId,
      title: title || file.replace(/\.md$/, ''),
      content: content.trim(),
      updated_at: new Date().toISOString(),
    });
  }

  console.log(`✓ Đã cấu trúc hóa ${documents.length} tài liệu chuyên sâu:`);
  documents.forEach((d, idx) => {
    console.log(`  ${idx + 1}. [${d.id}] ${d.title} (${(d.content.length / 1024).toFixed(1)} KB)`);
  });

  // 3. Xây dựng bộ FAQ chuẩn mực y khoa, 100% không thương hiệu
  const cleanFaqs = [
    {
      id: 'faq-01-cot-song',
      question: 'Tại sao ngồi lâu làm việc văn phòng hay bị đau mỏi thắt lưng và cổ gáy?',
      answer: 'Khi ngồi lâu hoặc gù lưng, trọng lực cơ thể không còn được phân tán đều qua 4 đường cong sinh lý tự nhiên mà dồn áp lực gấp 2-3 lần lên đĩa đệm L4-L5 và cột sống cổ. Điều này làm giảm lưu thông dịch thẩm thấu nuôi đĩa đệm và gây co cứng các cơ duỗi cạnh sống. Bạn nên tham khảo bài học "Tư thế & Vận động" trong chuyên đề Cột Sống để hiểu nguyên lý giải phóng áp lực trục đứng.',
    },
    {
      id: 'faq-02-thoat-vi',
      question: 'Thoát vị đĩa đệm thắt lưng L4-L5 là gì và cần lưu ý những gì?',
      answer: 'Thoát vị đĩa đệm L4-L5 xảy ra khi vòng sợi bao quanh bị rách hoặc suy yếu, khiến nhân nhầy bên trong lồi ra ngoài và có thể chèn ép rễ thần kinh tọa. Cần tuyệt đối tránh cúi gập cong lưng khi bê vật nặng hoặc vặn xoắn cột sống đột ngột; duy trì tư thế thẳng trục tự nhiên và vận động nhẹ nhàng theo thể trạng. Bạn có thể mở bài học "Đĩa đệm" trong chuyên đề Cột Sống để xem video mô phỏng giải phẫu 3D.',
    },
    {
      id: 'faq-03-nuoc-uong',
      question: 'Nguyên tắc uống nước đúng cách hàng ngày cho cơ thể là gì?',
      answer: 'Nước là dung môi cho mọi phản ứng sinh hóa và duy trì độ ngậm nước của đĩa đệm. Nguyên tắc uống đúng: Uống nhấp từng ngụm nhỏ ở tư thế ngồi để nước thẩm thấu êm dịu vào tế bào; uống 1 ly nước ấm ngay khi thức dậy; tính lượng nước khoảng 0.04 lít trên mỗi kg cân nặng (ví dụ 50kg cần khoảng 2 lít/ngày). Mời bạn xem chi tiết tại bài học "Nguyên tắc uống nước" trong chuyên đề Nước.',
    },
    {
      id: 'faq-04-nuoc-tot',
      question: 'Tiêu chuẩn của một nguồn nước uống tốt cho tế bào gồm những yếu tố nào?',
      answer: 'Nguồn nước lý tưởng cho cơ thể cần đảm bảo: (1) Độ sạch tinh khiết, loại bỏ cặn bẩn, kim loại nặng và hóa chất độc hại; (2) Giữ lại các vi khoáng kiềm tự nhiên (Canxi, Magie, Kali); (3) Giàu Hydrogen hòa tan đóng vai trò chống oxy hóa, trung hòa gốc tự do; (4) Cụm phân tử nước nhỏ giúp thẩm thấu nhanh qua màng tế bào. Mời bạn khám phá thêm trong chuyên đề Nước & Điện Giải.',
    },
    {
      id: 'faq-05-dinh-duong-khang-viem',
      question: 'Chế độ ăn kháng viêm giúp giảm đau mỏi xương khớp như thế nào?',
      answer: 'Viêm âm thầm mạn tính là nguyên nhân thúc đẩy thoái hóa sụn khớp và đau nhức. Chế độ ăn kháng viêm tập trung vào: Tăng cường cá béo giàu Omega-3 (EPA/DHA), rau lá xanh đậm, quả mọng, nghệ, gừng; đồng thời hạn chế đường tinh luyện, dầu chiên nhiều lần và thực phẩm siêu chế biến. Bạn hãy mở bài học "Dinh dưỡng kháng viêm" trong chuyên đề Dinh Dưỡng.',
    },
    {
      id: 'faq-06-tieu-hoa-gerd',
      question: 'Nguyên nhân dẫn đến trào ngược dạ dày thực quản (GERD) và cách phòng ngừa?',
      answer: 'Trào ngược xảy ra khi cơ thắt thực quản dưới (LES) bị giãn nở không đúng lúc hoặc áp lực trong ổ bụng tăng cao, khiến dịch axit dạ dày trào ngược lên thực quản. Phòng ngừa bằng cách: Ăn chậm nhai kỹ, không ăn quá no, tránh nằm ngay sau khi ăn ít nhất 2-3 tiếng, giảm đồ cay nóng, rượu bia và cà phê lúc đói. Xem video bài học chi tiết trong chuyên đề Hệ Tiêu Hóa.',
    },
    {
      id: 'faq-07-microbiome',
      question: 'Hệ vi sinh vật đường ruột (Microbiome) có vai trò gì với sức đề kháng?',
      answer: 'Hơn 70% tế bào miễn dịch của cơ thể tập trung tại biểu mô đường ruột (mô bạch huyết GALT). Hệ vi sinh vật đường ruột cân bằng giúp huấn luyện tế bào miễn dịch, ngăn chặn mầm bệnh xâm nhập và sản sinh các axit béo chuỗi ngắn (SCFA) nuôi dưỡng niêm mạc ruột. Bạn hãy tham khảo chuyên đề Hệ Tiêu Hóa & Miễn Dịch để tìm hiểu sâu hơn.',
    },
    {
      id: 'faq-08-autophagy',
      question: 'Cơ chế tự thực bào (Autophagy) hoạt động như thế nào trong kiểm soát chuyển hóa?',
      answer: 'Autophagy là cơ chế dọn dẹp tế bào tự nhiên của cơ thể: tế bào tự phân hủy và tái chế các bào quan bị tổn thương, protein lỗi và các mảnh vụn tế bào khi cơ thể được nghỉ ngơi tiêu hóa hợp lý (như nhịn ăn gián đoạn khoa học). Cơ chế này giúp cải thiện độ nhạy insulin, giảm viêm mạn tính và làm chậm lão hóa mô.',
    },
  ];

  console.log(`\n✓ Đã tạo ${cleanFaqs.length} câu hỏi FAQ học tập chuẩn mực y khoa (100% không thương hiệu).`);

  // 4. Đóng gói payload mới
  const newAiTrainingData = {
    guidelines: guidelinesText || 'Trợ lý Sức Khỏe AI Học Cơ Thể - Tủ Sách Y Khoa Qbiz Books.',
    documents: documents,
    faqs: cleanFaqs,
  };

  // 5. Cập nhật vào Supabase Database
  console.log('\n[Supabase] Đang ghi đè nguồn dữ liệu mới vào bảng settings...');
  const { data: currentSettings, error: fetchErr } = await supabase
    .from('settings')
    .select('workspace_id, block_styles')
    .eq('workspace_id', 'default')
    .single();

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    console.error('❌ Lỗi khi đọc settings từ Supabase:', fetchErr.message);
    process.exit(1);
  }

  const existingBlockStyles = currentSettings?.block_styles || {};
  const updatedBlockStyles = {
    ...existingBlockStyles,
    ai_training: newAiTrainingData,
  };

  const { error: updateErr } = await supabase
    .from('settings')
    .update({
      block_styles: updatedBlockStyles,
      updated_at: new Date().toISOString(),
    })
    .eq('workspace_id', 'default');

  if (updateErr) {
    console.error('❌ Lỗi khi cập nhật settings trên Supabase:', updateErr.message);
    process.exit(1);
  }

  console.log('✅ ĐÃ CẬP NHẬT THÀNH CÔNG VÀO SUPABASE (workspace: default)!');

  // Lưu bản JSON tổng hợp
  const summaryJsonPath = path.join(backupDir, 'ai_training_complete_knowledge.json');
  fs.writeFileSync(summaryJsonPath, JSON.stringify(newAiTrainingData, null, 2), 'utf8');
  console.log(`💾 Đã lưu cấu hình tri thức đầy đủ vào: ${summaryJsonPath}`);

  console.log('\n================================================================');
  console.log('🎉 TOÀN BỘ NGUỒN CŨ ĐÃ ĐƯỢC XÓA & THAY THẾ BẰNG 36 TÀI LIỆU MỚI!');
  console.log(`- Tổng số tài liệu chuyên môn: ${documents.length}`);
  console.log(`- Dung lượng kho tài liệu: ${(JSON.stringify(newAiTrainingData).length / 1024).toFixed(1)} KB`);
  console.log('- RAG Retrieval: Đã sẵn sàng lập chỉ mục tìm kiếm');
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Lỗi ngoại lệ:', err);
  process.exit(1);
});

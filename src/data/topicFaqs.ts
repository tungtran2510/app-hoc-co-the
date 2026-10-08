export interface MasterFaqItem {
  id: string;
  question: string;
  answer: string;
  badge?: string;
  key_takeaway?: string;
  related_lesson?: {
    slug: string;
    title: string;
    video_index?: number;
  };
}

export interface MasterFaqCategory {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  iconName?: string;
  colorTheme?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose';
  items: MasterFaqItem[];
}

export const TOPIC_MASTER_FAQS: Record<string, MasterFaqCategory[]> = {
  // ==========================================
  // 0. CHUYÊN ĐỀ CHUNG & TỔNG QUAN (chung)
  // ==========================================
  'chung': [
    {
      id: 'chung-muc-1',
      title: 'Mục 1: Nguyên lý Tự chữa lành & 4 Trụ cột Sức khỏe',
      subtitle: 'Tư duy y học tự thân, cân bằng chuyển hóa và loại bỏ gốc rễ bệnh',
      badge: 'Tổng quan',
      iconName: 'Sparkles',
      colorTheme: 'blue',
      items: [
        {
          id: 'chung-1-1',
          question: 'Cơ thể người có khả năng tự chữa lành thực sự không, và điều kiện cần là gì?',
          answer: '• Cơ chế sinh học: Hàng tỷ tế bào trong cơ thể liên tục phân chia và thay mới (tế bào niêm mạc ruột thay mới sau 3–5 ngày, bạch cầu sau vài ngày, hồng cầu sau 120 ngày, mô xương tái tạo sau vài năm). Cơ thể luôn mang sẵn bản năng tự chữa lành (Self-healing) kỳ diệu nếu được đáp ứng đủ 4 điều kiện: Dinh dưỡng tế bào đúng nguyên liệu, Nước & điện giải cân bằng áp suất thẩm thấu, Cột sống thông suốt dẫn truyền thần kinh và Giải tỏa tải lượng viêm mạn tính.\n• Ứng dụng thực tế: Đừng chỉ chú tâm uống thuốc dập tắt triệu chứng ngọn. Hãy tạo môi trường sinh học hoàn hảo bên trong để các cơ quan tự sửa chữa và phục hồi bền vững.',
          key_takeaway: 'Triệu chứng là tiếng chuông báo động; hãy giải quyết nguyên nhân gốc rễ thay vì chỉ tắt chuông báo động.',
        },
        {
          id: 'chung-1-2',
          question: '4 trụ cột sinh học cốt lõi quyết định sức khỏe và tuổi thọ sinh học là gì?',
          answer: '• 4 trụ cột chuẩn y khoa:\n1. Trục Cột sống & Cơ sinh học: Khung đỡ bảo vệ tủy sống và điều hòa hệ thần kinh thực vật.\n2. Nước & Cân bằng Điện giải: Dung môi duy trì huyết động, đào thải độc tố tế bào và dẫn truyền xung điện tim – não.\n3. Dinh dưỡng Chuyển hóa Nền tảng: Cung cấp đạm tinh chất, chất béo tốt và vitamin để tái tạo cấu trúc mô và sinh năng lượng ATP.\n4. Hệ Tiêu hóa & Miễn dịch: 70% sức đề kháng nằm ở đường ruột, bảo vệ cơ thể khỏi độc tố và vi khuẩn xâm nhập.',
          key_takeaway: 'Cột sống vững – Nước đủ – Dinh dưỡng sạch – Tiêu hóa khỏe là kiềng 4 chân của sức khỏe trường thọ.',
        },
        {
          id: 'chung-1-3',
          question: 'Khi nào cơn đau hoặc triệu chứng bất thường là "Cờ đỏ" cần đi cấp cứu ngay?',
          answer: '• Dấu hiệu cờ đỏ (Red Flags) cấp cứu ngoại khoa & nội khoa:\n1. Tim mạch: Đau thắt ngực trái lan lên hàm, bả vai, cánh tay trái kèm vã mồ hôi lạnh và khó thở.\n2. Đột quỵ não (F.A.S.T): Méo miệng, cười lệch một bên mặt, yếu tê liệt một cánh tay hoặc nói ngọng, nói khó.\n3. Thần kinh – Cột sống: Tê mất cảm giác vùng yên ngựa (quanh hậu môn/sinh môn) kèm bí tiểu cấp hoặc mất kiểm soát tiểu tiện.\n4. Tiêu hóa – Bụng cấp: Đau bụng dữ dội liên tục, sờ bụng cứng như gỗ, nôn ra máu hoặc đi ngoài phân đen mùi khắm.',
          key_takeaway: 'Khi xuất hiện dấu hiệu cờ đỏ, lập tức đến cơ sở y tế gần nhất; tuyệt đối không tự ý châm cứu, đắp thuốc hay cạo gió.',
        },
      ],
    },
    {
      id: 'chung-muc-2',
      title: 'Mục 2: Lộ trình Học & Ứng dụng Giải phẫu Cơ thể Thực tế',
      subtitle: 'Phương pháp tiếp thu kiến thức y khoa trực quan và tối ưu thói quen sống',
      badge: 'Phương pháp học',
      iconName: 'BookOpen',
      colorTheme: 'cyan',
      items: [
        {
          id: 'chung-2-1',
          question: 'Người mới bắt đầu nên học các chuyên đề theo thứ tự nào để thấy hiệu quả nhanh nhất?',
          answer: '• Lộ trình 3 giai đoạn tối ưu:\n• Giai đoạn 1 (Tuần 1–2): Cột sống & Nước. Chỉnh ngay tư thế ngồi, nằm ngủ và uống nước chuẩn để giải phóng cơn đau lưng mỏi cổ và hết uể oải ngay tức thì.\n• Giai đoạn 2 (Tuần 3–4): Dinh dưỡng & Hệ tiêu hóa. Nắm vững cách tính đạm, chất xơ và làm sạch đường ruột để tăng năng lượng chuyển hóa và ngủ sâu giấc.\n• Giai đoạn 3 (Tuần 5 trở đi): Hệ miễn dịch & Cơ thể người 3D. Quan sát đa chiều các khối cơ quan nội tạng để thấu hiểu trọn vẹn sự vận hành kỳ diệu của cỗ máy sinh học.',
          key_takeaway: 'Đi từ Cột sống & Nước -> Dinh dưỡng & Tiêu hóa -> Miễn dịch & Mô hình 3D để cảm nhận cơ thể thay đổi sau từng ngày.',
        },
        {
          id: 'chung-2-2',
          question: 'Tại sao hiểu giải phẫu 3D lại giúp tập luyện thể thao và yoga an toàn hơn?',
          answer: '• Kiểm soát cơ học khớp: Khi bạn biết rõ diện khớp cột sống cử động theo mặt phẳng nào, dây chằng chéo trước nằm ở đâu trong khớp gối, bạn sẽ tránh được hoàn toàn các tư thế xoắn vặn cưỡng bức gây rách sụn chêm hay thoát vị đĩa đệm. Bạn chủ động cảm nhận được nhóm cơ đích đang co rút thay vì dùng cơ bù trừ sai lệch.',
          key_takeaway: 'Tập luyện có hiểu biết giải phẫu giúp bạn tự làm bác sĩ trị liệu tốt nhất cho chính mình.',
        },
      ],
    },
  ],

  // ==========================================
  // 1. CHUYÊN ĐỀ CỘT SỐNG (cot-song)
  // ==========================================
  'cot-song': [
    {
      id: 'cs-muc-1',
      title: 'Mục 1: Thoát vị đĩa đệm & Đau thắt lưng (L4–L5, L5–S1)',
      subtitle: 'Cơ chế nén lệch tâm, giải phóng chèn ép rễ thần kinh',
      badge: 'Bệnh lý phổ biến',
      iconName: 'Activity',
      colorTheme: 'blue',
      items: [
        {
          id: 'cs-1-1',
          question: 'Tại sao nằm ngửa thẳng chân lại đau thắt lưng hơn nằm nghiêng co gối?',
          answer: '• Cơ chế cơ học: Khi nằm ngửa duỗi thẳng hai chân, cơ thắt lưng chậu (Psoas major) bị kéo căng, kéo mỏm ngang các đốt sống L4–L5 ưỡn ra trước làm tăng áp lực nén lên đĩa đệm và diện khớp sau.\n• Cách xử trí chuẩn: Kê một chiếc gối ôm mềm dưới khoeo chân khi nằm ngửa (tạo góc gập gối 30 độ), hoặc nằm nghiêng sang bên không đau và kẹp một chiếc gối giữa hai đầu gối để đưa cột sống về vị trí trung tính không tải lực.',
          key_takeaway: 'Kê gối dưới khoeo chân khi nằm ngửa giúp giảm 60% áp lực nén lên đĩa đệm thắt lưng.',
          related_lesson: {
            slug: 'dia-dem',
            title: 'Bài 02: Đĩa đệm và cơ chế giảm xóc',
            video_index: 1,
          },
        },
        {
          id: 'cs-1-2',
          question: 'Làm sao phân biệt triệu chứng chèn ép rễ thần kinh L5 và rễ S1?',
          answer: '• Rễ L5 (Thoát vị tầng L4–L5): Đau tê lan từ mông xuống mặt ngoài đùi, mặt ngoài cẳng chân ra mu bàn chân và ngón chân cái. Điển hình là yếu cơ cẳng chân trước khiến bệnh nhân khó đi bằng gót chân (Foot drop).\n• Rễ S1 (Thoát vị tầng L5–S1): Đau buốt dọc mặt sau bắp chân lan xuống gót chân, lòng bàn chân và ngón chân út. Bệnh nhân khó đi bằng mũi chân (nhón gót) và thường giảm hoặc mất phản xạ gân gót (Achilles).',
          key_takeaway: 'Chèn ép rễ L5 yếu đi bằng gót chân; chèn ép rễ S1 yếu đi bằng mũi chân.',
          related_lesson: {
            slug: 'co-gan-day-chang',
            title: 'Bài 03: Hệ thống cơ, gân và dây chằng cột sống',
            video_index: 1,
          },
        },
        {
          id: 'cs-1-3',
          question: 'Khi nào thoát vị đĩa đệm bắt buộc phải phẫu thuật cấp cứu?',
          answer: '• Dấu hiệu cấp cứu cờ đỏ (Hội chứng chùm đuôi ngựa - Cauda Equina Syndrome):\n1. Tê mất cảm giác vùng tầng sinh môn (vùng yên ngựa quanh hậu môn và đùi trong).\n2. Rối loạn cơ vòng bàng quang/ruột (bí tiểu cấp hoặc đại tiểu tiện không tự chủ).\n3. Yếu liệt hai chân tiến triển nhanh.\n• Các trường hợp còn lại: Hơn 90% bệnh nhân thoát vị đĩa đệm phục hồi tốt qua điều trị bảo tồn (vật lý trị liệu cơ sinh học, chỉnh cân bằng khung chậu và tập phục hồi nhóm cơ lõi Core).',
          key_takeaway: 'Mất kiểm soát tiểu tiện hoặc tê vùng yên ngựa là tình trạng cấp cứu ngoại khoa khẩn cấp.',
          related_lesson: {
            slug: 'tong-quan-ve-cot-song',
            title: 'Bài 01: Tổng quan cấu trúc và chức năng cột sống',
            video_index: 1,
          },
        },
      ],
    },
    {
      id: 'cs-muc-2',
      title: 'Mục 2: Đau Cổ – Vai – Gáy & Tê lan bàn tay',
      subtitle: 'Hội chứng thoái hóa rễ C5–C6–C7 và chèn ép mạch máu não',
      badge: 'Dân văn phòng',
      iconName: 'Stethoscope',
      colorTheme: 'cyan',
      items: [
        {
          id: 'cs-2-1',
          question: 'Phân biệt đau tê tay do thoái hóa đốt sống cổ với Hội chứng ống cổ tay?',
          answer: '• Hội chứng ống cổ tay: Dây thần kinh giữa bị chèn ép ngay tại dây chằng vòng cổ tay. Tê chỉ khu trú ở ngón 1, 2, 3 và nửa ngón 4. Không đau vùng cổ gáy. Gõ vào cổ tay (Test Tinel) thấy tê phóng điện vào các ngón.\n• Thoái hóa đốt sống cổ (Rễ C6–C7): Rễ thần kinh bị chèn ép tại lỗ liên hợp cột sống cổ. Đau buốt xuất phát từ gáy lan xuống bả vai, cánh tay rồi mới tới bàn tay. Vận động cổ (cúi, ngửa, nghiêng) làm tăng cơn đau rõ rệt.',
          key_takeaway: 'Ống cổ tay tê bàn tay không đau cổ; Thoái hóa cổ đau buốt phóng từ gáy dọc cánh tay.',
          related_lesson: {
            slug: 'co-gan-day-chang',
            title: 'Bài 03: Hệ thống cơ, gân và dây chằng cột sống',
            video_index: 2,
          },
        },
        {
          id: 'cs-2-2',
          question: 'Tại sao ngủ dậy hay bị cứng gáy và đau nhức buốt bả vai?',
          answer: '• Nguyên nhân sinh cơ học: Gối đầu quá cao hoặc quá cứng làm đốt sống cổ bị gập góc bất tự nhiên suốt 6–8 tiếng; hoặc nằm ngủ đối diện quạt/điều hòa lạnh làm các sợi cơ thang và cơ nâng vai co thắt bảo vệ cục bộ, gây thiếu máu vi tuần hoàn.\n• Biện pháp khắc phục: Chọn gối có độ cao vừa vặn (khoảng 8–10cm, nâng đỡ trọn vẹn đường cong hõm gáy), chườm ấm thư giãn cơ 15 phút sau khi thức dậy và thực hiện bài tập xoay cổ nhẹ nhàng.',
          key_takeaway: 'Gối quá cao là thủ phạm hàng đầu gây xơ cứng cơ nâng vai và gù đốt sống cổ C7.',
        },
      ],
    },
    {
      id: 'cs-muc-3',
      title: 'Mục 3: Đau thần kinh tọa & Sai lệch trục Khung chậu',
      subtitle: 'Phân biệt chèn ép cơ hình lê và sai lệch chức năng khớp cùng chậu',
      badge: 'Cơ sinh học',
      iconName: 'Compass',
      colorTheme: 'purple',
      items: [
        {
          id: 'cs-3-1',
          question: 'Đau thần kinh tọa do đĩa đệm khác gì so với Hội chứng cơ hình lê (Piriformis)?',
          answer: '• Đau do đĩa đệm cột sống: Khởi phát sau nâng vật nặng hoặc chấn thương. Cơn đau thắt lưng tăng dữ dội khi ho, hắt hơi, rặn hoặc ngồi cúi gập lưng.\n• Hội chứng cơ hình lê: Dây thần kinh tọa bị chèn ép cơ học dưới cơ hình lê ở sâu trong mông. Cột sống lưng không đau nhiều, nhưng đau nhức chói sâu trong mông khi ngồi ghế cứng lâu hoặc bắt chéo chân.',
          key_takeaway: 'Hội chứng cơ hình lê đau nhói vùng mông khi ngồi lâu, không đau tăng khi ho/hắt hơi.',
        },
        {
          id: 'cs-3-2',
          question: 'Hiện tượng chân dài chân ngắn giả tạo có phải do xương chân ngắn bẩm sinh không?',
          answer: '• Bản chất lâm sàng: 95% trường hợp là sai lệch chức năng do lệch xoay khung chậu (Pelvic Torsion). Một bên xương chậu bị xoay trước hoặc xoay sau khiến ổ cối bị chênh lệch cao thấp, kéo theo chiều dài chân hai bên không đều khi đo nằm ngửa.\n• Giải pháp tự nhiên: Cân chỉnh lại trục xương chậu và giải phóng co thắt cơ vuông thắt lưng (QL) và cơ thắt lưng chậu (Psoas) sẽ đưa hai chân về độ dài bằng nhau mà không cần phẫu thuật.',
          key_takeaway: 'Lệch khung chậu tạo ra chân ngắn giả tạo; cân chỉnh cơ mông và cơ chậu sẽ phục hồi thăng bằng.',
        },
      ],
    },
    {
      id: 'cs-muc-4',
      title: 'Mục 4: Thói quen bảo vệ cột sống & Dấu hiệu Cờ đỏ (Red Flags)',
      subtitle: 'Quy tắc lao động công thái học và các cảnh báo nguy hiểm',
      badge: 'Phòng ngừa',
      iconName: 'ShieldAlert',
      colorTheme: 'rose',
      items: [
        {
          id: 'cs-4-1',
          question: 'Quy tắc nâng nhấc vật nặng chuẩn công thái học để không bao giờ bị cụp lưng?',
          answer: '• Quy tắc vàng 3 điểm: \n1. Ngồi xổm hạ thấp trọng tâm (gập khớp gối và khớp háng), không bao giờ đứng thẳng chân rồi cúi gập lưng.\n2. Ôm sát vật nặng vào ngực để giảm tối đa cánh tay đòn cơ học.\n3. Giữ lưng ở độ cong sinh lý tự nhiên, dùng lực đẩy mạnh mẽ của nhóm cơ đùi và cơ mông để đứng lên.',
          key_takeaway: 'Cúi gập lưng bê đồ làm áp lực nén lên đĩa đệm tăng gấp 5 - 10 lần trọng lượng vật nặng.',
        },
        {
          id: 'cs-4-2',
          question: 'Những dấu hiệu đau lưng nào cảnh báo bệnh lý ác tính cần đi bệnh viện kiểm tra ngay?',
          answer: '• 5 Dấu hiệu Cờ đỏ (Red Flags y khoa):\n1. Đau lưng dữ dội về đêm không giảm khi nghỉ ngơi kèm sụt cân nhanh không rõ nguyên nhân (nghi ngờ u xương/di căn).\n2. Đau cột sống kèm sốt cao, rét run, tiền sử nhiễm trùng gần đây (viêm đĩa đệm đốt sống nhiễm khuẩn).\n3. Đau lưng nhói dữ dội sau chấn thương nhẹ ở người cao tuổi (gãy lún đốt sống do loãng xương).\n4. Mất tự chủ tiểu tiện/đại tiện hoặc tê mất cảm giác vùng yên ngựa (Hội chứng chùm đuôi ngựa).\n5. Yếu liệt hai chân tiến triển nhanh chóng trong vài ngày.',
          key_takeaway: 'Đau lưng về đêm kèm sốt hoặc sụt cân là dấu hiệu cờ đỏ bắt buộc phải khám chuyên khoa ngay.',
        },
      ],
    },
  ],

  // ==========================================
  // 2. CHUYÊN ĐỀ NƯỚC & ĐIỆN GIẢI (nuoc)
  // ==========================================
  'nuoc': [
    {
      id: 'nuoc-muc-1',
      title: 'Mục 1: Nhu cầu nước & Dấu hiệu khát nước tế bào',
      subtitle: 'Cân bằng áp suất thẩm thấu và tỷ lệ nước sinh học trong các mô',
      badge: 'Nền tảng sinh học',
      iconName: 'Droplets',
      colorTheme: 'blue',
      items: [
        {
          id: 'nuoc-1-1',
          question: 'Công thức tính lượng nước uống chuẩn xác mỗi ngày cho từng người?',
          answer: '• Công thức sinh học chuẩn: Nhu cầu nước (lít) = Cân nặng (kg) × 0.04 (hoặc 40ml nước trên mỗi kg thể trọng).\n• Ví dụ minh họa: Người nặng 55kg cần uống: 55 × 0.04 = 2.2 lít nước/ngày. Người nặng 70kg cần 2.8 lít/ngày.\n• Lưu ý khi bù nước: Khi làm việc ngoài trời nắng, tập thể dục ra nhiều mồ hôi hoặc thời tiết hanh khô, cần bổ sung thêm 300 - 500ml kèm điện giải để bù đắp lượng muối khoáng thất thoát.',
          key_takeaway: 'Chuẩn lâm sàng: 40ml nước cho mỗi 1kg cân nặng mỗi ngày.',
          related_lesson: {
            slug: 'vai-tro-cua-nuoc',
            title: 'Bài 01: Trao đổi mao mạch, áp lực keo và cơ chế phù nề',
            video_index: 1,
          },
        },
        {
          id: 'nuoc-1-2',
          question: 'Tại sao uống rất nhiều nước nhưng miệng vẫn khô, da khô và tế bào vẫn thiếu nước?',
          answer: '• Cơ chế tế bào học: Khi uống ừng ực một lượng lớn nước tinh khiết (nước trơ thiếu khoáng điện giải Natri, Kali, Magie), áp suất thẩm thấu huyết tương tụt giảm đột ngột. Thận nhận tín hiệu kích hoạt phản xạ bài niệu, tống tháo nước ra ngoài ngay lập tức trước khi nước kịp đi qua kênh Aquaporin vào trong tế bào.\n• Cách khắc phục: Uống từng ngụm nhỏ, giữ lại trong khoang miệng 2 giây rồi mới nuốt, chia nhỏ lượng nước đều suốt ngày và ưu tiên nguồn nước có khoáng tự nhiên.',
          key_takeaway: 'Uống dồn dập khiến thận xả nước ra ngoài; uống từng ngụm nhỏ giúp nước thẩm thấu vào tế bào.',
          related_lesson: {
            slug: 'vai-tro-cua-nuoc',
            title: 'Bài 01: Trao đổi mao mạch, áp lực keo và cơ chế phù nề',
            video_index: 1,
          },
        },
        {
          id: 'nuoc-1-3',
          question: 'Cách nhận biết cơ thể đủ hay thiếu nước chính xác qua màu nước tiểu?',
          answer: '• Màu rơm nhạt / vàng trong: Cơ thể đủ nước tối ưu, thận lọc độc tố thuận lợi.\n• Màu trong suốt như nước lã: Uống thừa nước quá mức, có nguy cơ pha loãng nồng độ chất điện giải trong máu.\n• Màu vàng sậm / hổ phách: Cơ thể đang thiếu nước nghiêm trọng, thận phải tái hấp thu nước tối đa làm cô đặc nước tiểu.\n• Màu đỏ / nâu trà đặc: Cảnh báo bệnh lý gan mật (tăng Bilirubin) hoặc có hồng cầu/đạm trong nước tiểu, cần đi khám xét nghiệm ngay.',
          key_takeaway: 'Màu nước tiểu vàng rơm nhạt là chỉ số trực quan tin cậy nhất của cơ thể đủ nước.',
        },
      ],
    },
    {
      id: 'nuoc-muc-2',
      title: 'Mục 2: Nước kiềm, Nước RO & Khoáng chất TDS',
      subtitle: 'Hiểu đúng về pH, khoáng chất sinh học và khí Hydrogen hòa tan',
      badge: 'Công nghệ lọc',
      iconName: 'Filter',
      colorTheme: 'cyan',
      items: [
        {
          id: 'nuoc-2-1',
          question: 'Uống nước lọc RO tinh khiết khử hết khoáng lâu ngày có gây hại cho cơ thể không?',
          answer: '• Cơ chế sinh học: Nước tinh khiết khử khoáng hoàn toàn (TDS ≈ 0) có tính trơ thẩm thấu cao. Khi vào lòng ruột, nước có xu hướng hòa tan và rút các ion khoáng Canxi và Magie từ dịch nhầy niêm mạc để tự cân bằng.\n• Tổ chức Y tế Thế giới (WHO) khuyến cáo: Nước uống tối ưu cho sức khỏe tim mạch và xương khớp cần duy trì chỉ số TDS từ 100 - 300 mg/L với hàm lượng Canxi (>20mg/L) và Magie (>10mg/L) sinh học tự nhiên.',
          key_takeaway: 'Nước lọc RO nên được bù khoáng chất lượng cao để tránh tình trạng rút khoáng mô cơ thể.',
          related_lesson: {
            slug: 'nuoc-tot-va-loc-nuoc',
            title: 'Bài 04: Nước tốt – Chỉ số TDS, pH, Hydrogen và cụm phân tử nhỏ',
            video_index: 1,
          },
        },
        {
          id: 'nuoc-2-2',
          question: 'Nước ion kiềm có bị axit dạ dày trung hòa làm mất tác dụng không?',
          answer: '• Cơ chế phản ứng nội mô: Khi nước ion kiềm nhẹ (pH 8.5–9.5) đi vào dạ dày, các tế bào thành dạ dày sẽ phản xạ tiết thêm HCl để duy trì pH tiêu hóa (1.5–2.5). Quá trình tổng hợp HCl này đồng thời sản sinh ion Bicarbonate (HCO3-) bơm vào dòng máu, giúp củng cố hệ đệm kiềm của cơ thể.\n• Giá trị cốt lõi: Lợi ích vượt trội nhất của nước điện giải tươi là giàu khí Hydrogen hòa tan (H2) - chất chống oxy hóa siêu nhỏ trung hòa chọn lọc gốc tự do hydroxyl độc hại (*OH), chứ không đơn thuần chỉ là độ pH.',
          key_takeaway: 'Giá trị quý nhất của nước điện giải tươi là nồng độ Hydrogen hòa tan (H2) chống oxy hóa tế bào.',
          related_lesson: {
            slug: 'nuoc-tot-va-loc-nuoc',
            title: 'Bài 04: Nước tốt – Chỉ số TDS, pH, Hydrogen và cụm phân tử nhỏ',
            video_index: 2,
          },
        },
        {
          id: 'nuoc-2-3',
          question: 'Chỉ số TDS cao trong nước có đồng nghĩa với việc nguồn nước bị bẩn không?',
          answer: '• Hiểu đúng về TDS (Total Dissolved Solids): TDS phản ánh tổng lượng chất rắn hòa tan trong nước, bao gồm cả khoáng chất có lợi (Canxi, Magie, Kali, Natri) lẫn các ion độc hại (Chì, Asen, Nitrat, Clo).\n• Nước khoáng tự nhiên chất lượng cao có TDS 200 - 350 mg/L là nguồn nước lý tưởng cho cơ thể. TDS chỉ nguy hiểm khi nguồn nước chưa qua hệ thống lọc chặn các kim loại nặng và độc tố hóa học độc hại.',
          key_takeaway: 'TDS cao do khoáng Canxi và Magie là rất tốt; TDS chỉ nguy hiểm khi chứa kim loại nặng.',
        },
      ],
    },
    {
      id: 'nuoc-muc-3',
      title: 'Mục 3: Thời điểm uống nước vàng & Thói quen khoa học',
      subtitle: 'Bốn thời điểm sinh tử giúp tuần hoàn máu lưu thông thông suốt',
      badge: 'Thói quen sống',
      iconName: 'Clock',
      colorTheme: 'amber',
      items: [
        {
          id: 'nuoc-3-1',
          question: 'Bốn thời điểm uống nước vàng quan trọng nhất trong ngày là khi nào?',
          answer: '• Ly 1 (Ngay khi thức dậy): 300 - 400ml nước ấm giúp làm loãng dòng máu bị cô đặc sau 8 tiếng ngủ, đánh thức nhu động đại tràng và hỗ trợ thận xả độc tố.\n• Ly 2 (Trước bữa ăn 30 phút): Cung cấp nước cho tế bào niêm mạc dạ dày tiết lớp màng nhầy nhầy bảo vệ khỏi axit dạ dày.\n• Ly 3 (Trước khi tắm): Giúp ổn định huyết áp, phòng ngừa cơn co thắt mạch máu do thay đổi nhiệt độ.\n• Ly 4 (Trước khi ngủ 30–45 phút): 150–200ml nước ấm giúp giảm nguy cơ đông máu và tai biến mạch máu não vào ban đêm.',
          key_takeaway: 'Ly nước ấm ngay sau khi thức dậy là ly nước sinh tử quý giá nhất trong ngày.',
        },
        {
          id: 'nuoc-3-2',
          question: 'Có nên uống nhiều nước trong khi đang ăn cơm không?',
          answer: '• Không nên: Uống nhiều nước trong bữa ăn sẽ làm loãng nồng độ axit dạ dày (HCl) và các enzyme tiêu hóa (Pepsin), khiến quá trình nhũ tương hóa thức ăn bị đình trệ, gây đầy trướng bụng, khó tiêu và tăng nguy cơ trào ngược.\n• Lời khuyên: Chỉ nên nhấp một vài ngụm nhỏ để làm mềm thức ăn khô, uống đủ lượng nước trước bữa ăn 30 phút hoặc đợi sau ăn 1 tiếng.',
          key_takeaway: 'Uống nhiều nước trong bữa ăn làm loãng axit dạ dày, gây đầy hơi và trào ngược thức ăn.',
        },
      ],
    },
    {
      id: 'nuoc-muc-4',
      title: 'Mục 4: Phù nề, Áp lực keo & Rối loạn điện giải',
      subtitle: 'Cân bằng Natri – Kali và vai trò của Albumin huyết tương',
      badge: 'Lâm sàng',
      iconName: 'AlertCircle',
      colorTheme: 'rose',
      items: [
        {
          id: 'nuoc-4-1',
          question: 'Tại sao ăn mặn nhiều muối lại gây tích nước phù chân và tăng huyết áp?',
          answer: '• Cơ chế Natri - Thẩm thấu: Natri (Na+) là ion chủ đạo giữ nước ở dịch gian bào ngoại bào. Khi ăn quá nhiều muối vượt khả năng bài tiết của thận, nồng độ Natri huyết tương tăng cao, cơ thể buộc phải giữ lại nước để cân bằng nồng độ thẩm thấu, làm thể tích máu tuần hoàn phình to -> gây phù chân tay và tăng áp lực lên thành mạch máu.',
          key_takeaway: 'Thừa muối làm tăng giữ nước ngoại bào, gây phù mắt cá chân và tăng huyết áp động mạch.',
          related_lesson: {
            slug: 'chat-dien-giai',
            title: 'Bài 02: Chất điện giải Natri, Kali & Cân bằng dịch thể',
            video_index: 1,
          },
        },
        {
          id: 'nuoc-4-2',
          question: 'Áp lực keo huyết tương (Albumin) ngăn ngừa cơ thể bị phù nề như thế nào?',
          answer: '• Vai trò sinh mạng của Albumin: Do gan tổng hợp, Albumin tạo nên 80% áp lực keo huyết tương, có nhiệm vụ "hút nước" giữ lại bên trong lòng mạch máu.\n• Khi gan suy yếu hoặc cơ thể thiếu đạm dinh dưỡng trầm trọng, lượng Albumin máu sụt giảm, áp lực keo suy kiệt khiến nước tự do thoát khỏi mao mạch tràn vào khoang gian bào, gây phù toàn thân và tích dịch màng bụng.',
          key_takeaway: 'Albumin máu giữ nước trong lòng mạch; thiếu đạm làm giảm áp lực keo gây phù nề.',
          related_lesson: {
            slug: 'vai-tro-cua-nuoc',
            title: 'Bài 01: Trao đổi mao mạch, áp lực keo và cơ chế phù nề',
            video_index: 1,
          },
        },
      ],
    },
  ],

  // ==========================================
  // 3. CHUYÊN ĐỀ DINH DƯỠNG NỀN TẢNG (dinh-duong)
  // ==========================================
  'dinh-duong': [
    {
      id: 'dd-muc-1',
      title: 'Mục 1: Chuyển hóa Đa lượng (Đạm – Đường – Béo)',
      subtitle: 'Tỷ lệ cân đối dưỡng chất nuôi cơ bắp và ổn định đường huyết',
      badge: 'Đa lượng',
      iconName: 'Utensils',
      colorTheme: 'blue',
      items: [
        {
          id: 'dd-1-1',
          question: 'Cách tính nhu cầu Protein (Đạm) chuẩn mỗi ngày để không bị teo cơ?',
          answer: '• Nhu cầu chuẩn sinh lý: 1.2g – 1.6g protein tinh chất trên mỗi kg cân nặng (người tập luyện kháng lực hoặc đang phục hồi sau phẫu thuật cần 1.6g – 2.0g/kg).\n• Lưu ý quan trọng: 100g ức gà hoặc thịt bò nạc chỉ chứa khoảng 22–25g protein tinh chất, không phải 100g thịt là 100g đạm. Nên kết hợp cân đối 50% đạm động vật và 50% đạm thực vật chất lượng cao (đậu nành lên men, các loại hạt).',
          key_takeaway: 'Tính nhu cầu đạm theo gram protein tinh chất: khoảng 1.2 - 1.5g/kg cân nặng mỗi ngày.',
        },
        {
          id: 'dd-1-2',
          question: 'Phân biệt Carbohydrate hấp thu nhanh và chậm qua chỉ số GI?',
          answer: '• Carb nhanh (GI cao > 70): Cơm trắng, bánh mì trắng, nước ngọt, đồ ngọt. Khi ăn vào, đường huyết vọt lên đỉnh điểm trong 30 phút, ép tụy tiết ồ ạt Insulin để tích mỡ, sau đó đường huyết tụt dốc gây cảm giác run rẩy đói cồn cào.\n• Carb chậm (GI thấp < 55): Yến mạch nguyên cám, gạo lứt, khoai lang, các loại đậu. Phóng thích glucose từ từ, cung cấp năng lượng bền bỉ suốt 3–4 tiếng, giúp duy trì đường huyết phẳng và giảm tích mỡ bụng.',
          key_takeaway: 'Carb GI thấp giữ đường huyết ổn định, ngăn chặn cơn đói ảo và tích tụ mỡ nội tạng.',
        },
      ],
    },
    {
      id: 'dd-muc-2',
      title: 'Mục 2: Vi chất, Vitamin & Khoáng chất thiết yếu',
      subtitle: 'Bộ ba Canxi – D3 – K2 và các vi khoáng chống suy nhược',
      badge: 'Vi chất',
      iconName: 'Sparkles',
      colorTheme: 'cyan',
      items: [
        {
          id: 'dd-2-1',
          question: 'Tại sao bổ sung Canxi bắt buộc phải đi kèm Vitamin D3 và Vitamin K2?',
          answer: '• Cơ chế phối hợp tam giác:\n1. Canxi: Là vật liệu xây dựng xương khớp.\n2. Vitamin D3: Mở cánh cửa tế bào niêm mạc ruột để hấp thu Canxi từ ống tiêu hóa vào máu.\n3. Vitamin K2 (dạng MK-7): Kích hoạt protein Osteocalcin để đưa Canxi từ máu "gắn thẳng vào tận trong xương và răng".\n• Cảnh báo: Uống Canxi liều cao mà thiếu K2 sẽ khiến Canxi lang thang trong máu và lắng đọng tại thành động mạch gây xơ vữa mạch máu và sỏi thận.',
          key_takeaway: 'Bổ sung Canxi thiếu D3 và K2 có nguy cơ gây vôi hóa động mạch và tạo sỏi thận.',
        },
        {
          id: 'dd-2-2',
          question: 'Những dấu hiệu điển hình cảnh báo cơ thể đang thiếu hụt Magie và Kẽm?',
          answer: '• Thiếu Magie: Hay bị chuột rút bắp chân về đêm, giật mí mắt liên tục, đau đầu căng thẳng, tim đập hồi hộp và mất ngủ trằn trọc.\n• Thiếu Kẽm: Vết thương hở lâu lành, móng tay giòn có đốm trắng, rụng tóc nhiều, suy giảm vị giác/khứu giác và hệ miễn dịch suy yếu thường xuyên ốm vặt tái phát.',
          key_takeaway: 'Chuột rút và giật cơ báo hiệu thiếu Magie; vết thương chậm lành và rụng tóc báo hiệu thiếu Kẽm.',
        },
      ],
    },
    {
      id: 'dd-muc-3',
      title: 'Mục 3: Nhịn ăn gián đoạn 16:8 & Cơ chế Autophagy',
      subtitle: 'Kích hoạt cơ chế tự dọn rác tế bào và phục hồi chuyển hóa',
      badge: 'Tự thực bào',
      iconName: 'Flame',
      colorTheme: 'amber',
      items: [
        {
          id: 'dd-3-1',
          question: 'Cơ chế tự thực bào (Autophagy) kích hoạt khi nào trong nhịn ăn gián đoạn?',
          answer: '• Cơ chế Nobel Y học 2016: Khi nhịn ăn liên tục từ 14–16 tiếng trở lên, nồng độ Insulin trong máu chạm đáy, tế bào bắt đầu kích hoạt quá trình dọn dẹp nội bào (Autophagy) — tự tiêu hóa và tái chế các protein lỗi hỏng, ty thể già nua, tế bào lão hóa để chuyển thành năng lượng sạch, giúp làm trẻ hóa mô và giảm nguy cơ ung bướu.',
          key_takeaway: 'Nhịn ăn từ 14 - 16 tiếng kích hoạt cơ chế Autophagy dọn sạch tế bào già cỗi và protein lỗi.',
        },
        {
          id: 'dd-3-2',
          question: 'Uống cà phê đen hoặc trà xanh trong khung giờ nhịn có phá vỡ nhịn ăn không?',
          answer: '• Hoàn toàn không: Cà phê đen nguyên chất không đường, trà xanh hoặc nước lọc không chứa calo và không kích thích tụy tiết Insulin. Thậm chí các polyphenol trong cà phê đen và trà xanh (như EGCG) còn thúc đẩy quá trình tự thực bào Autophagy diễn ra mạnh mẽ hơn.',
          key_takeaway: 'Cà phê đen nguyên chất và trà xanh không đường hỗ trợ thúc đẩy Autophagy hiệu quả.',
        },
      ],
    },
    {
      id: 'dd-muc-4',
      title: 'Mục 4: Kháng Insulin & Hội chứng chuyển hóa',
      subtitle: 'Căn nguyên gốc rễ của mỡ nội tạng, gan nhiễm mỡ và tiểu đường tuýp 2',
      badge: 'Chuyển hóa',
      iconName: 'HeartPulse',
      colorTheme: 'rose',
      items: [
        {
          id: 'dd-4-1',
          question: 'Những dấu hiệu nhận biết tình trạng Kháng Insulin sớm nhất trên cơ thể?',
          answer: '• Biểu hiện thực tế:\n1. Tích mỡ bụng trung tâm (vòng eo vượt quá 80cm ở nữ, 90cm ở nam).\n2. Xuất hiện vệt sạm da gai đen ở các nếp gấp cổ, nách (Acanthosis nigricans).\n3. Cơn buồn ngủ gục ập đến sau bữa trưa từ 1–2 giờ.\n4. Rất thèm ăn đồ ngọt, tinh bột sau bữa ăn và hay mệt mỏi đuối sức không rõ lý do.',
          key_takeaway: 'Mỡ bụng dưới và vệt đen ở gáy cổ là 2 dấu hiệu cảnh báo sớm nhất của Kháng Insulin.',
        },
        {
          id: 'dd-4-2',
          question: 'Trình tự ăn uống khoa học giúp đảo ngược kháng Insulin tự nhiên?',
          answer: '• Thứ tự ăn chuẩn y khoa: \n1. Ăn Rau chất xơ trước để tạo màng lưới chặn đường ruột.\n2. Ăn Protein (Thịt, cá, trứng, đậu) và chất béo tốt tiếp theo để kích hoạt hormone no GLP-1.\n3. Ăn Tinh bột (cơm, khoai, bún) ở bước cuối cùng.\n• Hiệu quả: Cách ăn này làm giảm tới 50% mức tăng đột ngột của đường huyết sau ăn so với ăn tinh bột trước.',
          key_takeaway: 'Ăn theo thứ tự Rau -> Đạm -> Tinh bột giúp hạ một nửa đỉnh đường huyết sau ăn.',
        },
      ],
    },
  ],

  // ==========================================
  // 4. CHUYÊN ĐỀ HỆ TIÊU HÓA (tieu-hoa)
  // ==========================================
  'tieu-hoa': [
    {
      id: 'th-muc-1',
      title: 'Mục 1: Trào ngược dạ dày (GERD) & Viêm loét HP',
      subtitle: 'Nghịch lý thiếu axit dịch vị và sự thật về vi khuẩn HP',
      badge: 'Dạ dày',
      iconName: 'Activity',
      colorTheme: 'blue',
      items: [
        {
          id: 'th-1-1',
          question: 'Tại sao đa số trường hợp trào ngược dạ dày thực chất là do THIẾU axit dịch vị?',
          answer: '• Nghịch lý y khoa: Khi dạ dày thiếu axit (pH dịch vị > 3.0), cơ vòng thực quản dưới (LES) không nhận đủ tín hiệu hóa học để co thắt đóng kín lại. Thức ăn lưu cữu lâu trong dạ dày bị lên men sinh hơi chướng khí, đẩy ngược lượng axit yếu lên thực quản gây bỏng rát cổ họng.\n• Sai lầm phổ biến: Uống thuốc giảm tiết axit (PPI) kéo dài làm dạ dày càng mất khả năng phân giải đạm, dẫn đến rối loạn khuẩn ruột và teo niêm mạc.',
          key_takeaway: 'Thiếu axit dạ dày khiến cơ vòng thực quản không đóng chặt, gây trào ngược thức ăn.',
        },
        {
          id: 'th-1-2',
          question: 'Nhiễm vi khuẩn HP có bắt buộc phải uống kháng sinh diệt trừ triệt để không?',
          answer: '• Quan điểm lâm sàng hiện đại: Hơn 70% người Việt Nam mang vi khuẩn Helicobacter pylori (HP) cộng sinh hòa bình mà không có triệu chứng. Chỉ cần phác đồ điều trị kháng sinh khi có tổn thương loét dạ dày tá tràng hoạt động, có triệu chứng khó tiêu dai dẳng hoặc gia đình có tiền sử ung thư dạ dày.',
          key_takeaway: 'HP thể cộng sinh không triệu chứng không nhất thiết phải dùng kháng sinh diệt trừ tràn lan.',
        },
      ],
    },
    {
      id: 'th-muc-2',
      title: 'Mục 2: Hội chứng ruột kích thích (IBS) & Hệ vi sinh',
      subtitle: 'Trục Não – Ruột và phương pháp bổ sung lợi khuẩn chuẩn sống',
      badge: 'Đại tràng',
      iconName: 'Brain',
      colorTheme: 'purple',
      items: [
        {
          id: 'th-2-1',
          question: 'Phân biệt Hội chứng ruột kích thích (IBS) với Viêm đại tràng thực thể?',
          answer: '• Hội chứng ruột kích thích (IBS): Là rối loạn chức năng của trục Não – Ruột. Khi nội soi, niêm mạc đại tràng hoàn toàn hồng hào lành lặn, không có vết loét. Triệu chứng đau bụng bùng phát khi lo âu căng thẳng, đi ngoài xong thường cảm thấy nhẹ nhõm.\n• Viêm đại tràng thực thể: Niêm mạc có ổ loét trợt, xung huyết, phân có lẫn máu tươi hoặc chất nhầy, sụt cân và có thể kèm sốt nhẹ.',
          key_takeaway: 'IBS là rối loạn chức năng không có tổn thương loét; Viêm đại tràng có loét thực thể chảy máu.',
        },
        {
          id: 'th-2-2',
          question: 'Bổ sung Men vi sinh (Probiotics) như thế nào để sống qua được bể axit dạ dày?',
          answer: '• Hướng dẫn sử dụng: Chọn sản phẩm có công nghệ bao màng vi nang kháng axit hoặc các bào tử lợi khuẩn chịu nhiệt (như *Bacillus subtilis*). Uống vào thời điểm ngay trước bữa ăn hoặc cùng bữa ăn nhẹ để lượng thức ăn làm đệm nâng độ pH dạ dày, giúp trên 90% lợi khuẩn đến được ruột non an toàn.',
          key_takeaway: 'Nên uống men vi sinh ngay trước bữa ăn để giảm thiểu tỷ lệ vi khuẩn bị axit dạ dày tiêu diệt.',
        },
      ],
    },
    {
      id: 'th-muc-3',
      title: 'Mục 3: Cơ chế "Cắt – Thấm – Đẩy – Giữ" & Làm sạch ruột',
      subtitle: 'Phương pháp nuôi dưỡng đường ruột sạch tự nhiên không lạm dụng thụt tháo',
      badge: 'Thải độc an toàn',
      iconName: 'ShieldCheck',
      colorTheme: 'emerald',
      items: [
        {
          id: 'th-3-1',
          question: 'Thụt tháo đại tràng (Enema) thường xuyên có gây nguy hiểm cho đường ruột không?',
          answer: '• Nguy cơ y khoa nghiêm trọng: Thụt tháo đại tràng bằng nước hoặc cà phê lặp lại nhiều lần sẽ rửa trôi toàn bộ lớp vi sinh vật bản địa, làm mất phản xạ rặn tự nhiên của bóng trực tràng, gây rối loạn điện giải và nguy cơ thủng loét niêm mạc đại tràng.\n• Thải độc đường ruột khoa học: Cung cấp đủ 25–30g chất xơ hòa tan (FOS, Inulin) kết hợp uống đủ nước để tạo khối phân mềm xốp, kích thích nhu động ruột tự nhiên đẩy cặn bã ra ngoài.',
          key_takeaway: 'Thụt tháo đại tràng liên tục làm mất phản xạ rặn tự nhiên và hủy hoại hệ vi sinh vật đường ruột.',
        },
      ],
    },
  ],

  // ==========================================
  // 5. CHUYÊN ĐỀ HỆ MIỄN DỊCH (mien-dich)
  // ==========================================
  'mien-dich': [
    {
      id: 'md-muc-1',
      title: 'Mục 1: Hàng rào phòng thủ tự nhiên & Hệ miễn dịch ruột',
      subtitle: 'Mô bạch huyết GALT và sức đề kháng bẩm sinh',
      badge: 'Phòng ngự',
      iconName: 'Shield',
      colorTheme: 'blue',
      items: [
        {
          id: 'md-1-1',
          question: 'Tại sao hơn 70% tế bào miễn dịch của cơ thể lại tập trung tại đường ruột?',
          answer: '• Mô bạch huyết GALT: Niêm mạc ruột có diện tích tiếp xúc khổng lồ (khoảng 32 mét vuông). Tại đây tập trung hàng tỷ tế bào miễn dịch (tế bào T, B, Đại thực bào) liên tục được huấn luyện để phân biệt giữa thức ăn lành tính và mầm bệnh nguy hiểm. Một đường ruột khỏe mạnh là bức tường thành vững chắc nhất của hệ miễn dịch.',
          key_takeaway: '70% sức đề kháng nằm ở đường ruột; đường ruột khỏe thì hệ miễn dịch mới vững vàng.',
        },
        {
          id: 'md-1-2',
          question: 'Sốt nhẹ có phải là dấu hiệu xấu cần uống thuốc hạ sốt ngay lập tức không?',
          answer: '• Phản ứng sinh tồn kỳ diệu: Sốt từ 37.5°C đến 38.5°C là phản ứng có lợi của cơ thể. Ở nhiệt độ này, tốc độ di chuyển và thực bào của Bạch cầu tăng gấp 2 - 3 lần, đồng thời ức chế sự nhân bản của virus. Chỉ nên dùng thuốc hạ sốt khi sốt cao trên 38.5°C hoặc khi người bệnh mệt mỏi kiệt sức.',
          key_takeaway: 'Sốt nhẹ là phản ứng có lợi giúp bạch cầu tiêu diệt vi khuẩn; không nên hạ sốt vội vàng.',
        },
      ],
    },
    {
      id: 'md-muc-2',
      title: 'Mục 2: Viêm mạn tính cấp thấp & Dinh dưỡng miễn dịch',
      subtitle: 'Bộ ba Kẽm – Vitamin C – Vitamin D3 và kiểm soát phản ứng viêm',
      badge: 'Kháng viêm',
      iconName: 'Zap',
      colorTheme: 'amber',
      items: [
        {
          id: 'md-2-1',
          question: 'Viêm mạn tính cấp thấp (Low-grade inflammation) âm thầm tàn phá cơ thể ra sao?',
          answer: '• Kẻ thù vô hình: Không gây đau sưng cấp tính, nhưng các chất trung gian gây viêm (IL-6, TNF-alpha, hs-CRP) liên tục lưu hành trong máu làm tổn thương lớp nội mạc mạch máu, là nguyên nhân gốc rễ của xơ vữa động mạch, tiểu đường tuýp 2, viêm khớp thoái hóa và lão hóa sớm.',
          key_takeaway: 'Viêm mạn tính âm thầm là nguyên nhân sâu xa của các bệnh lý tim mạch và thoái hóa chuyển hóa.',
        },
        {
          id: 'md-2-2',
          question: 'Bộ ba vi chất dinh dưỡng quan trọng nhất để kích hoạt hệ miễn dịch tối đa?',
          answer: '• Bộ ba vàng: Kẽm (Zinc), Vitamin D3 và Vitamin C.\n- Kẽm: Cần thiết cho sự nhân lên và biệt hóa của tế bào T và tế bào tiêu diệt tự nhiên (NK).\n- Vitamin D3: Kích thích đại thực bào sản sinh các peptide kháng khuẩn tự nhiên (Cathelicidin).\n- Vitamin C: Bảo vệ bạch cầu khỏi bị tự hủy bởi các gốc oxy hóa trong quá trình thực bào.',
          key_takeaway: 'Kẽm + Vitamin D3 + Vitamin C là kiềng 3 chân bảo vệ hệ miễn dịch tế bào vững chắc.',
        },
      ],
    },
  ],

  // ==========================================
  // 6. CHUYÊN ĐỀ CƠ THỂ NGƯỜI 3D (co-the-nguoi)
  // ==========================================
  'co-the-nguoi': [
    {
      id: 'ctn-muc-1',
      title: 'Mục 1: Cấu trúc Giải phẫu & Chức năng Hệ Cơ Xương',
      subtitle: '206 xương và chuỗi động học kết nối toàn bộ cơ thể',
      badge: 'Giải phẫu',
      iconName: 'Layers',
      colorTheme: 'blue',
      items: [
        {
          id: 'ctn-1-1',
          question: 'Cơ thể người có bao nhiêu xương và phân bổ như thế nào?',
          answer: '• Cấu trúc tổng thể: Người trưởng thành có 206 xương, chia làm hai hệ thống chính: Hệ xương trục (80 xương gồm sọ, cột sống, lồng ngực) bảo vệ não bộ và cơ quan nội tạng; Hệ xương chi (126 xương gồm tay, chân, đai vai, đai hông) đảm nhiệm chức năng vận động và lao động.',
          key_takeaway: '206 xương liên tục tái cấu trúc trong suốt cuộc đời nhờ chu trình Hủy cốt bào và Tạo cốt bào.',
        },
        {
          id: 'ctn-1-2',
          question: 'Tại sao cơ bắp được y học hiện đại coi là cơ quan nội tiết lớn nhất cơ thể?',
          answer: '• Bước đột phá y học: Khi cơ bắp co bóp khi vận động, các sợi cơ tiết ra hàng trăm phân tử tín hiệu sinh học gọi là Myokines (như Irisin, IL-6 cơ bắp). Các Myokines này truyền tín hiệu tới não bộ giúp tăng cường trí nhớ, tới tế bào mỡ giúp đốt cháy mỡ thừa và tới xương giúp tăng mật độ khoáng.',
          key_takeaway: 'Cơ bắp vận động giải phóng Myokines giúp bảo vệ não bộ và tăng cường chuyển hóa toàn thân.',
        },
      ],
    },
  ],
};

export function getTopicMasterFaqs(topicSlug: string): MasterFaqCategory[] {
  return TOPIC_MASTER_FAQS[topicSlug] || [];
}

export interface TopicFaqGroup {
  topicSlug: string;
  topicTitle: string;
  topicBadge: string;
  topicIcon: string;
  categories: MasterFaqCategory[];
  totalQuestions: number;
}

export const TOPIC_METADATA_MAP: Record<string, { title: string; badge: string; icon: string }> = {
  'chung': { title: 'Chung & Tổng quát', badge: 'Nền tảng', icon: '⭐' },
  'cot-song': { title: 'Cột sống', badge: 'Cơ xương khớp', icon: '🦴' },
  'nuoc': { title: 'Nước & Điện giải', badge: 'Cân bằng dịch', icon: '💧' },
  'dinh-duong': { title: 'Dinh dưỡng', badge: 'Chuyển hóa', icon: '🥗' },
  'tieu-hoa': { title: 'Hệ tiêu hóa', badge: 'Đường ruột', icon: '🧬' },
  'mien-dich': { title: 'Hệ miễn dịch', badge: 'Đề kháng', icon: '🛡️' },
  'co-the-nguoi': { title: 'Cơ thể người 3D', badge: 'Giải phẫu', icon: '👤' },
};

export function getAllTopicFaqGroups(): TopicFaqGroup[] {
  const slugs = ['chung', 'cot-song', 'nuoc', 'dinh-duong', 'tieu-hoa', 'mien-dich', 'co-the-nguoi'];
  return slugs.map((slug) => {
    const categories = TOPIC_MASTER_FAQS[slug] || [];
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    return {
      topicSlug: slug,
      topicTitle: TOPIC_METADATA_MAP[slug]?.title || slug,
      topicBadge: TOPIC_METADATA_MAP[slug]?.badge || 'Chuyên đề',
      topicIcon: TOPIC_METADATA_MAP[slug]?.icon || '📖',
      categories,
      totalQuestions,
    };
  });
}

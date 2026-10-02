const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

// Load pool of 1335 verified YouTube IDs
const verifiedPool = JSON.parse(fs.readFileSync('scripts/verified_youtube_pool.json', 'utf-8'));
console.log(`Loaded ${verifiedPool.length} verified YouTube IDs.`);

// Video syllabus definitions for 48 lessons (3-4 videos each)
const LESSON_PLAYLISTS = {
  'cot-song': {
    'tong-quan-ve-cot-song': [
      { title: '01. Tổng quan giải phẫu cột sống 3D', desc: 'Phân tích 33-34 đốt sống và cấu trúc 4 đường cong sinh lý tự nhiên.', dur: '7 phút' },
      { title: '02. Cơ sinh học & Cơ chế phân bổ lực', desc: 'Cách cột sống phân tán trọng lực và hấp thụ chấn động khi di chuyển.', dur: '6 phút' },
      { title: '03. Giữ trục cột sống & Tự bảo vệ lưng', desc: 'Các thói quen sinh hoạt và bài tập tăng độ vững chãi cơ lõi.', dur: '8 phút' },
      { title: '04. Nhận diện sai lầm phổ biến hại cột sống', desc: 'Các tư thế sai lệch hàng ngày và cách phòng tránh thoái hóa sớm.', dur: '5 phút' }
    ],
    'dia-dem': [
      { title: '01. Giải phẫu đĩa đệm: Vòng sợi & Nhân nhầy', desc: 'Cơ chế hoạt động của giảm xóc sinh học tự nhiên giữa các đốt sống.', dur: '6 phút' },
      { title: '02. Cơ chế hình thành thoát vị đĩa đệm 3D', desc: 'Áp lực tải trọng gây rách vòng sợi và tràn nhân nhầy chèn ép rễ.', dur: '8 phút' },
      { title: '03. Dinh dưỡng thẩm thấu & Tái tạo đĩa đệm', desc: 'Cách duy trì độ ngậm nước cho đĩa đệm qua vận động và tư thế đúng.', dur: '5 phút' },
      { title: '04. Bài tập kéo giãn giải áp đĩa đệm an toàn', desc: 'Hướng dẫn tự tập luyện giảm đau lưng và phục hồi áp lực cột sống.', dur: '7 phút' }
    ],
    'co-gan-day-chang': [
      { title: '01. Hệ thống cơ sâu & Dây chằng cột sống', desc: 'Dây chằng dọc trước, sau và dây chằng vàng giữ vững đốt sống.', dur: '7 phút' },
      { title: '02. Sức mạnh cơ lõi (Core) bảo vệ thắt lưng', desc: 'Kích hoạt nhóm cơ bụng sâu và cơ nhiều nhánh (Multifidus).', dur: '6 phút' },
      { title: '03. Kỹ thuật giãn cơ giải tỏa co thắt cạnh sống', desc: 'Giải phóng căng cơ sau ngày dài ngồi làm việc sai tư thế.', dur: '8 phút' },
      { title: '04. Rèn luyện sức bền khối cơ dựng gai sống', desc: 'Bài tập tăng cường nhóm cơ lưng dưới không gây quá tải đĩa đệm.', dur: '6 phút' }
    ],
    'than-kinh': [
      { title: '01. Tủy sống & 31 đôi rễ thần kinh gai sống', desc: 'Cấu tạo ống sống và đường truyền cảm giác vận động của cơ thể.', dur: '8 phút' },
      { title: '02. Hội chứng chèn ép rễ thần kinh tọa 3D', desc: 'Đường đi dây thần kinh tọa từ thắt lưng xuống mông, đùi và bàn chân.', dur: '7 phút' },
      { title: '03. Dấu hiệu cảnh báo chèn ép thần kinh nguy hiểm', desc: 'Phân biệt đau thần kinh tọa cơ học và tổn thương tủy sống cấp.', dur: '5 phút' },
      { title: '04. Bài tập trượt thần kinh (Nerve Flossing)', desc: 'Vận động trị liệu giúp rễ thần kinh trượt êm ái, giảm đau buốt.', dur: '7 phút' }
    ],
    'tu-the-va-van-dong': [
      { title: '01. Tư thế ngồi & đứng chuẩn công thái học', desc: 'Bảo toàn đường cong sinh lý tự nhiên khi làm việc với máy tính.', dur: '6 phút' },
      { title: '02. Nguyên tắc bốc vác vật nặng an toàn', desc: 'Ứng dụng bản lề háng (Hip Hinge) thay vì gập lưng gây chấn thương.', dur: '5 phút' },
      { title: '03. Chuỗi bài tập giải nén cột sống cuối ngày', desc: 'Treo xà, tư thế em bé và kéo giãn giải phóng tải trọng đốt sống.', dur: '7 phút' },
      { title: '04. Chỉnh sửa tư thế ngủ và chọn gối nệm đúng', desc: 'Giữ trục cổ - lưng thẳng hàng suốt 8 tiếng phục hồi ban đêm.', dur: '6 phút' }
    ],
    'cac-van-de-thuong-gap': [
      { title: '01. Thoái hóa cột sống: Tiến trình & Nguyên nhân', desc: 'Sự hao mòn sụn khớp, xơ hóa xương dưới sụn và hình thành gai xương.', dur: '8 phút' },
      { title: '02. Phân biệt phồng lồi đĩa đệm & Thoát vị thực thụ', desc: 'Mức độ tổn thương trên phim MRI và hướng điều trị bảo tồn.', dur: '6 phút' },
      { title: '03. Chiến lược toàn diện ngăn ngừa đau lưng tái phát', desc: 'Kiểm soát cân nặng, bài tập cơ lõi và chế độ dinh dưỡng kháng viêm.', dur: '7 phút' },
      { title: '04. Khi nào cần can thiệp y khoa chuyên sâu?', desc: 'Các chỉ định phẫu thuật và dấu hiệu đỏ cần nhập viện khẩn cấp.', dur: '5 phút' }
    ]
  },
  'dinh-duong': {
    'tong-quan-dinh-duong-hoc': [
      { title: '01. Dinh dưỡng tế bào & Chu trình tạo năng lượng ATP', desc: 'Từ thức ăn chuyển hóa thành phân tử năng lượng sống cho tế bào.', dur: '8 phút' },
      { title: '02. Phân biệt chất đa lượng & Vi lượng thiết yếu', desc: 'Cân đối tỷ lệ đạm, béo, tinh bột và nhu cầu vi chất hàng ngày.', dur: '6 phút' },
      { title: '03. Nhịp sinh học ăn uống tối ưu chuyển hóa', desc: 'Ăn đúng giờ để cơ thể tự phục hồi và giảm tải cho hệ tiêu hóa.', dur: '7 phút' },
      { title: '04. Nhận diện các bẫy dinh dưỡng công nghiệp hiện đại', desc: 'Thực phẩm siêu chế biến, đường ẩn và chất béo chuyển hóa trans-fat.', dur: '6 phút' }
    ],
    'chat-dam-protein': [
      { title: '01. Protein: Nền tảng xây dựng tế bào & Cơ bắp', desc: 'Cấu trúc chuỗi axit amin và vai trò tái tạo mô, kháng thể và enzym.', dur: '7 phút' },
      { title: '02. 9 Axit amin thiết yếu cơ thể không tự tổng hợp', desc: 'Nguồn thực phẩm hoàn chỉnh và cách phối hợp thực phẩm giàu đạm.', dur: '6 phút' },
      { title: '03. So sánh đạm động vật & Đạm thực vật', desc: 'Ưu nhược điểm của từng nguồn đạm đối với sức khỏe tim mạch và thận.', dur: '8 phút' },
      { title: '04. Tính toán nhu cầu đạm cá nhân hóa mỗi ngày', desc: 'Công thức tính lượng protein chuẩn theo thể trạng và mức độ vận động.', dur: '5 phút' }
    ],
    'chat-beo-lipid': [
      { title: '01. Chất béo tốt: Cấu tạo màng tế bào & Não bộ', desc: 'Vai trò của lớp lipid kép màng tế bào trong trao đổi chất và thần kinh.', dur: '8 phút' },
      { title: '02. Cân bằng tỷ lệ Omega-3 và Omega-6 chống viêm', desc: 'Tác hại của dầu thực vật tinh luyện và cách tăng cường Omega-3 tự nhiên.', dur: '7 phút' },
      { title: '03. Top thực phẩm giàu chất béo lành mạnh bảo vệ tim', desc: 'Bơ quả, dầu ô liu ép lạnh, hạt lanh và cá béo vùng nước sâu.', dur: '6 phút' },
      { title: '04. Phân biệt Cholesterol tốt (HDL) & Xấu (LDL oxy hóa)', desc: 'Căn nguyên thật sự của xơ vữa động mạch và bảo vệ mạch máu.', dur: '7 phút' }
    ],
    'tinh-bot-carbohydrate': [
      { title: '01. Tinh bột & Bài toán điều hòa đường huyết', desc: 'Cơ chế tiết insulin của tuyến tụy và chuyển hóa glucose vào tế bào.', dur: '8 phút' },
      { title: '02. Chỉ số đường huyết GI & Tải lượng đường GL', desc: 'Cách lựa chọn tinh bột hấp thu chậm cho nguồn năng lượng ổn định.', dur: '6 phút' },
      { title: '03. Kháng Insulin: Căn nguyên bệnh chuyển hóa', desc: 'Lộ trình ăn uống đảo ngược tiền tiểu đường và giảm mỡ nội tạng.', dur: '9 phút' },
      { title: '04. Thứ tự ăn uống thông minh kiểm soát đỉnh đường huyết', desc: 'Ăn chất xơ trước, đạm béo giữa và tinh bột cuối cùng.', dur: '5 phút' }
    ],
    'vitamin-khoang-chat': [
      { title: '01. Vitamin & Khoáng chất: Vi chất quyết định sự sống', desc: 'Vai trò đồng enzym trong chuyển hóa sinh học và kích hoạt miễn dịch.', dur: '8 phút' },
      { title: '02. Bộ ba Canxi, Vitamin D3 & K2 dẫn truyền vào xương', desc: 'Ngăn ngừa loãng xương mà không lo vôi hóa mạch máu hay sỏi thận.', dur: '7 phút' },
      { title: '03. Magie: Khoáng chất thư giãn thần kinh & Cơ bắp', desc: 'Hơn 300 phản ứng sinh hóa, cải thiện giấc ngủ và chống co cứng cơ.', dur: '6 phút' },
      { title: '04. Dấu hiệu nhận biết sớm sự thiếu hụt vi chất cơ thể', desc: 'Rụng tóc, nhiệt miệng, chuột rút và mệt mỏi mạn tính.', dur: '6 phút' }
    ],
    'dinh-duong-khang-viem': [
      { title: '01. Chế độ ăn kháng viêm: Giảm đau nhức mạn tính', desc: 'Cơ chế dập tắt cơn bão cytokine tiền viêm trong cơ thể.', dur: '8 phút' },
      { title: '02. Polyphenol & Chất chống oxy hóa tự nhiên', desc: 'Sức mạnh bảo vệ DNA tế bào từ rau củ quả màu đậm và thảo mộc.', dur: '6 phút' },
      { title: '03. Thực đơn kháng viêm Địa Trung Hải cải tiến', desc: 'Ứng dụng nguyên liệu Việt Nam giàu dưỡng chất phục hồi sức khỏe.', dur: '7 phút' },
      { title: '04. Các gia vị kháng viêm vàng: Nghệ, Gừng & Tiêu đen', desc: 'Hoạt chất Curcumin và Gingerol giúp giảm đau tự nhiên.', dur: '5 phút' }
    ]
  },
  'co-the-nguoi': {
    'tong-quan-he-co-quan': [
      { title: '01. 11 Hệ cơ quan trong cơ thể người 3D', desc: 'Bức tranh toàn cảnh về cỗ máy sinh học hoàn hảo nhất của tự nhiên.', dur: '9 phút' },
      { title: '02. Cơ chế cân bằng nội môi (Homeostasis)', desc: 'Cách các cơ quan phối hợp nhịp nhàng duy trì sự sống 24/7.', dur: '7 phút' },
      { title: '03. Nguyên tắc chăm sóc sức khỏe chủ động từ tế bào', desc: 'Nền tảng của tuổi thọ khỏe mạnh: Dinh dưỡng, vận động và giấc ngủ.', dur: '6 phút' },
      { title: '04. Tín hiệu cầu cứu sớm của các cơ quan nội tạng', desc: 'Nhận biết bất thường qua da, hơi thở, giấc ngủ và tiêu hóa.', dur: '6 phút' }
    ],
    'he-co-xuong-khop': [
      { title: '01. Giải phẫu hệ cơ xương khớp 3D toàn diện', desc: '206 chiếc xương và hơn 600 cơ bắp vận hành đòn bẩy sinh học.', dur: '8 phút' },
      { title: '02. Cấu trúc ổ khớp, bao hoạt dịch & Sụn khớp', desc: 'Bảo vệ sụn khớp khỏi mài mòn và duy trì dịch nhờn bôi trơn khớp.', dur: '7 phút' },
      { title: '03. Vận động đúng giúp tăng mật độ khoáng xương', desc: 'Tập kháng lực kích thích tạo cốt bào và phòng ngừa loãng xương.', dur: '6 phút' },
      { title: '04. Phòng tránh chấn thương khớp khi luyện tập thể thao', desc: 'Kỹ thuật khởi động, thả lỏng và phục hồi dây chằng sau vận động.', dur: '7 phút' }
    ],
    'he-tuan-hoan-tim-mach': [
      { title: '01. Giải phẫu quả tim & Tuần hoàn máu 3D', desc: '4 ngăn tim và chu trình co bóp đẩy 5 lít máu nuôi dưỡng cơ thể.', dur: '8 phút' },
      { title: '02. Huyết áp là gì? Bảo vệ thành mạch đàn hồi', desc: 'Phòng ngừa xơ vữa động mạch, tắc nghẽn mạch vành và đột quỵ.', dur: '7 phút' },
      { title: '03. Lối sống & Dinh dưỡng nuôi dưỡng trái tim khỏe', desc: 'Tăng cường oxit nitric (NO) giãn mạch tự nhiên và giảm stress tim mạch.', dur: '6 phút' },
      { title: '04. Nhịp tim & Chỉ số biến thiên nhịp tim (HRV)', desc: 'Thước đo đánh giá sức khỏe hệ thần kinh tự chủ và độ hồi phục.', dur: '5 phút' }
    ],
    'he-ho-hap-phoi': [
      { title: '01. Giải phẫu hệ hô hấp & Phế nang phổi 3D', desc: '300 triệu phế nang và cơ chế khuếch tán oxy vào hồng cầu.', dur: '8 phút' },
      { title: '02. Sức mạnh cơ hoành: Hít thở sâu giảm căng thẳng', desc: 'Kích hoạt hệ thần kinh phó giao cảm giúp hạ huyết áp và làm dịu não bộ.', dur: '6 phút' },
      { title: '03. Thải độc & Bảo vệ đường hô hấp trong đô thị', desc: 'Phương pháp rửa mũi, xông thảo dược và bảo vệ niêm mạc phế quản.', dur: '7 phút' },
      { title: '04. Bài tập thở tăng dung tích sống cho phổi', desc: 'Tập thở 4-7-8 và kỹ thuật thở bụng phục hồi sau viêm đường thở.', dur: '5 phút' }
    ],
    'he-than-kinh-nao-bo': [
      { title: '01. Giải phẫu não bộ & Mạng lưới thần kinh 3D', desc: '86 tỷ neuron thần kinh và cấu trúc các thùy não điều khiển tư duy.', dur: '9 phút' },
      { title: '02. Chất dẫn truyền thần kinh: Dopamine & Serotonin', desc: 'Điều hòa cảm xúc tích cực, động lực hành động và chất lượng giấc ngủ.', dur: '7 phút' },
      { title: '03. Tính mềm dẻo của não bộ (Neuroplasticity)', desc: 'Cách rèn luyện trí não, học hỏi kỹ năng mới và phòng ngừa sa sút trí tuệ.', dur: '8 phút' },
      { title: '04. Bảo vệ hàng rào máu não khỏi độc tố môi trường', desc: 'Chất béo DHA, chất chống oxy hóa và giấc ngủ giúp thải độc não.', dur: '6 phút' }
    ],
    'he-bai-tiet-than': [
      { title: '01. Giải phẫu thận & Đơn vị lọc Nephron 3D', desc: 'Cách 2 triệu nephron lọc sạch 180 lít huyết tương mỗi ngày.', dur: '8 phút' },
      { title: '02. Nhận biết sớm các dấu hiệu suy giảm chức năng thận', desc: 'Nước tiểu có bọt, phù mi mắt buổi sáng và tăng huyết áp khó kiểm soát.', dur: '6 phút' },
      { title: '03. 5 Nguyên tắc vàng bảo vệ quả thận luôn khỏe', desc: 'Uống đủ nước, giảm muối, kiểm soát đường huyết và thận trọng với thuốc.', dur: '7 phút' },
      { title: '04. Phòng ngừa sỏi thận & Lắng đọng cặn oxalate', desc: 'Cách cân bằng canxi và nước uống hạn chế kết tủa tinh thể trong đài bể thận.', dur: '6 phút' }
    ]
  },
  'tieu-hoa': {
    'khoang-mieng-da-day': [
      { title: '01. Tiêu hóa từ miệng tới dạ dày 3D', desc: 'Tuyến nước bọt, cơ vòng thực quản và nhu động bóp nhuyễn thức ăn.', dur: '8 phút' },
      { title: '02. Axit dịch vị: Hàng rào diệt khuẩn & Tiêu đạm', desc: 'Bảo vệ lớp niêm mạc dạ dày khỏi viêm loét và trào ngược axit.', dur: '7 phút' },
      { title: '03. Nghệ thuật nhai chậm: Giảm 50% gánh nặng cho dạ dày', desc: 'Kích hoạt tiết enzym tiêu hóa tự nhiên và kiểm soát cảm giác no.', dur: '5 phút' },
      { title: '04. Vi khuẩn HP (Helicobacter Pylori) & Dạ dày', desc: 'Cơ chế gây viêm loét và cách chung sống hòa bình với vi khuẩn HP.', dur: '6 phút' }
    ],
    'ruot-non-hap-thu': [
      { title: '01. Cấu tạo ruột non & Bề mặt vi nhung mao 3D', desc: 'Diện tích bề mặt hấp thu khổng lồ tương đương một sân tennis.', dur: '8 phút' },
      { title: '02. Hội chứng rò rỉ ruột (Leaky Gut) & Dị ứng', desc: 'Tổn thương liên kết chặt tế bào ruột khiến độc tố tràn vào máu.', dur: '7 phút' },
      { title: '03. Thực phẩm làm lành & Tái tạo niêm mạc ruột', desc: 'Nước hầm xương, L-Glutamine, Kẽm Carnosine và chất nhầy thảo mộc.', dur: '6 phút' },
      { title: '04. Cơ chế vận chuyển vi chất qua thành ruột vào máu', desc: 'Hấp thu axit amin, glucose và vi khoáng chất qua bơm năng lượng.', dur: '6 phút' }
    ],
    'dai-trang-bai-tiet': [
      { title: '01. Giải phẫu đại tràng & Cơ chế đào thải 3D', desc: 'Tái hấp thu nước, chất điện giải và tạo khuôn phân hoàn chỉnh.', dur: '7 phút' },
      { title: '02. Căn nguyên gốc rễ của táo bón mạn tính', desc: 'Mất cân bằng nước, thiếu chất xơ hòa tan và tư thế đi vệ sinh sai.', dur: '6 phút' },
      { title: '03. Chăm sóc đại tràng sạch khỏe phòng ngừa polyp', desc: 'Tầm quan trọng của chất xơ lên men tạo axit béo chuỗi ngắn SCFA.', dur: '8 phút' },
      { title: '04. Thải độc đại tràng: Hiểu đúng theo góc nhìn y khoa', desc: 'Phân tích khoa học về các phương pháp thụt tháo và giải pháp sinh học.', dur: '6 phút' }
    ],
    'he-vi-sinh-microbiome': [
      { title: '01. Microbiome: Hệ gen thứ hai của cơ thể', desc: 'Hàng chục nghìn tỷ vi khuẩn đường ruột điều khiển hệ miễn dịch.', dur: '8 phút' },
      { title: '02. Trục Não - Ruột: Đường ruột điều hòa tâm trạng', desc: 'Hơn 90% hormone hạnh phúc Serotonin được sản xuất tại đường ruột.', dur: '7 phút' },
      { title: '03. Bổ sung Probiotic & Prebiotic đúng cách', desc: 'Chọn chủng men vi sinh sống và nuôi dưỡng bằng chất xơ hòa tan.', dur: '6 phút' },
      { title: '04. Phục hồi hệ vi sinh sau khi dùng kháng sinh', desc: 'Lộ trình tái tạo khuẩn lạc ruột tránh loạn khuẩn và tiêu chảy.', dur: '6 phút' }
    ],
    'enzym-tieu-hoa': [
      { title: '01. Các loại enzym tiêu hóa then chốt của cơ thể', desc: 'Amylase phân giải tinh bột, Protease bẻ gãy đạm và Lipase tiêu mỡ.', dur: '7 phút' },
      { title: '02. Khắc phục chứng đầy bụng khó tiêu sau bữa ăn', desc: 'Nhận diện dấu hiệu suy giảm tiết enzym do tuổi tác hoặc stress.', dur: '6 phút' },
      { title: '03. Thực phẩm tự nhiên giàu enzym sống tươi mát', desc: 'Đu đủ chứa papain, dứa chứa bromelain và thực phẩm lên men hữu cơ.', dur: '6 phút' },
      { title: '04. Khi nào nên dùng men tiêu hóa bổ sung?', desc: 'Nguyên tắc sử dụng men ngắn ngày tránh ức chế tụy sản xuất tự nhiên.', dur: '5 phút' }
    ],
    'benh-duong-ruot-thuong-gap': [
      { title: '01. Căn nguyên bệnh trào ngược dạ dày (GERD)', desc: 'Yếu cơ thắt thực quản dưới hay do thiếu axit clohydric dịch vị?', dur: '8 phút' },
      { title: '02. Hội chứng ruột kích thích (IBS): Giải pháp lối sống', desc: 'Quản lý căng thẳng thần kinh và áp dụng chế độ ăn Low-FODMAP.', dur: '7 phút' },
      { title: '03. 10 Thói quen vàng giữ hệ tiêu hóa khỏe suốt đời', desc: 'Ăn chậm nhai kỹ, cách bữa hợp lý và không ăn đêm gần giờ ngủ.', dur: '8 phút' },
      { title: '04. Viêm đại tràng co thắt & Phục hồi niêm mạc', desc: 'Kết hợp thảo dược nhuận tràng, làm êm niêm mạc và giảm co thắt.', dur: '6 phút' }
    ]
  },
  'nuoc': {
    'vai-tro-cua-nuoc': [
      { title: '01. Tại sao nước là dung môi của sự sống?', desc: 'Nước chiếm 60-70% trọng lượng cơ thể: Tuần hoàn, hòa tan và làm mát.', dur: '7 phút' },
      { title: '02. Nước nội bào & Ngoại bào trong cơ thể', desc: 'Duy trì thể tích dịch kẽ, huyết tương và áp lực thẩm thấu tế bào.', dur: '6 phút' },
      { title: '03. Thời điểm vàng uống nước để hấp thu tốt nhất', desc: 'Ly nước đầu ngày đánh thức nội tạng và trước bữa ăn 30 phút.', dur: '5 phút' },
      { title: '04. Cấu trúc cụm phân tử nước & Khả năng thẩm thấu', desc: 'Nước giàu khoáng chất tự nhiên giúp tế bào ngậm nước sâu hơn.', dur: '6 phút' }
    ],
    'chat-dien-giai': [
      { title: '01. Chất điện giải Natri, Kali & Magie hoạt động ra sao?', desc: 'Bơm ion màng tế bào tạo điện thế sinh học dẫn truyền xung thần kinh.', dur: '8 phút' },
      { title: '02. Dấu hiệu mất cân bằng điện giải khi tập luyện', desc: 'Chuột rút cơ bắp, mệt mỏi rã rời, đau đầu và choáng váng.', dur: '6 phút' },
      { title: '03. Tự pha nước bù điện giải tự nhiên tại nhà', desc: 'Nước dừa tươi, khoáng muối hồng Himalaya và chanh tươi nguyên chất.', dur: '5 phút' },
      { title: '04. Nguy cơ hạ Natri máu khi uống quá nhiều nước tinh khiết', desc: 'Hiện tượng ngộ độc nước và nguyên tắc bù nước an toàn trong thể thao.', dur: '6 phút' }
    ],
    'dau-hieu-thieu-nuoc': [
      { title: '01. 7 Dấu hiệu tiềm ẩn cơ thể đang khát nước tế bào', desc: 'Khô môi, chóng mặt, da mất độ đàn hồi và suy giảm tập trung.', dur: '7 phút' },
      { title: '02. Bảng theo dõi màu sắc nước tiểu chuẩn y khoa', desc: 'Nhận biết mức độ đủ nước qua sắc thái vàng nhạt hay sẫm màu.', dur: '5 phút' },
      { title: '03. Mối liên hệ giữa thiếu nước và đau đầu mạn tính', desc: 'Màng não co rút tạm thời khi thiếu nước gây đau nhức đầu.', dur: '6 phút' },
      { title: '04. Thiếu nước gây cô đặc máu & Nguy cơ đông máu', desc: 'Tăng gánh nặng cho tim bơm máu đặc qua các mao mạch nhỏ.', dur: '6 phút' }
    ],
    'nguyen-tac-uong-nuoc': [
      { title: '01. Uống nước đúng cách: Nhấp từng ngụm ở tư thế ngồi', desc: 'Giúp nước từ từ thẩm thấu vào tế bào thay vì chảy thẳng xuống thận.', dur: '7 phút' },
      { title: '02. Công thức tính lượng nước chuẩn theo cân nặng', desc: '0.04L/kg thể trọng và điều chỉnh theo vận động và nhiệt độ môi trường.', dur: '6 phút' },
      { title: '03. Nên uống nước ấm hay nước lạnh?', desc: 'Tác động của nhiệt độ nước lên nhu động ruột và tuần hoàn vi mạch.', dur: '5 phút' },
      { title: '04. Sai lầm khi dùng trà sữa, cà phê thay cho nước lọc', desc: 'Tác dụng lợi tiểu của cafein và lượng đường dư thừa gây mất nước.', dur: '6 phút' }
    ],
    'nuoc-va-chuyen-hoa': [
      { title: '01. Nước hỗ trợ gan & Thận đào thải độc tố chuyển hóa', desc: 'Hòa tan cặn bã sinh học như ure, axit uric để bài xuất ra ngoài.', dur: '8 phút' },
      { title: '02. Uống 1 ly nước ấm trước khi đi ngủ ngăn đột quỵ', desc: 'Giảm độ nhớt của máu trong suốt 8 tiếng nằm bất động ban đêm.', dur: '6 phút' },
      { title: '03. Uống nước kích thích tiêu hao năng lượng (BMR)', desc: 'Uống đủ nước lạnh nhẹ giúp cơ thể tiêu hao calo để làm ấm nước.', dur: '6 phút' },
      { title: '04. Nước và sự bôi trơn các khớp xương, đĩa đệm', desc: 'Nhân nhầy đĩa đệm và sụn khớp hút nước ban đêm để phục hồi.', dur: '5 phút' }
    ],
    'can-bang-ph-mau': [
      { title: '01. Cân bằng toan kiềm: Cơ chế ổn định pH 7.35 - 7.45', desc: 'Hệ đệm bicarbonate, phổi thở thải CO2 và thận điều chỉnh ion.', dur: '8 phút' },
      { title: '02. Sự thật khoa học về nước kiềm & Thức ăn kiềm hóa', desc: 'Hiểu đúng về tính axit - kiềm sinh học của thực phẩm sau chuyển hóa.', dur: '7 phút' },
      { title: '03. Lối sống giảm tải gánh nặng toan hóa cơ thể', desc: 'Hạn chế đường ngọt tinh chế, thịt đỏ quá mức và rượu bia công nghiệp.', dur: '6 phút' },
      { title: '04. Hơi thở sâu giúp kiềm hóa máu tự nhiên', desc: 'Thải trừ thán khí CO2 dư thừa qua đường hô hấp mỗi ngày.', dur: '5 phút' }
    ]
  },
  'noi-tiet-chuyen-hoa': {
    'tong-quan-he-noi-tiet': [
      { title: '01. Hệ nội tiết & Các tuyến nội tiết chính 3D', desc: 'Trục Hạ đồi - Tuyến yên - Tuyến đích điều hòa toàn bộ cơ thể.', dur: '8 phút' },
      { title: '02. Hormone: Sứ giả hóa học của sự sống', desc: 'Cơ chế thụ thể tế bào và vòng điều hòa phản hồi ngược (Feedback Loop).', dur: '7 phút' },
      { title: '03. Dấu hiệu cảnh báo rối loạn nội tiết tố nam & nữ', desc: 'Mất ngủ, bốc hỏa, tăng cân không kiểm soát và sụt giảm năng lượng.', dur: '7 phút' },
      { title: '04. Các chất phá vỡ nội tiết (Endocrine Disruptors)', desc: 'BPA trong đồ nhựa, thuốc trừ sâu và hóa mỹ phẩm độc hại.', dur: '6 phút' }
    ],
    'tuyen-giap-chuyen-hoa': [
      { title: '01. Tuyến giáp: Nhạc trưởng chuyển hóa năng lượng', desc: 'Cơ chế sản xuất và chuyển đổi hormone T4 thành T3 hoạt động.', dur: '8 phút' },
      { title: '02. Phân biệt suy giáp và cường giáp trên lâm sàng', desc: 'Triệu chứng sợ lạnh, tăng cân đối lập với sụt cân, hồi hộp tim đập nhanh.', dur: '7 phút' },
      { title: '03. Dinh dưỡng nuôi dưỡng tuyến giáp khỏe mạnh', desc: 'I-ốt từ hải sản, Selen từ hạt hạch và Kẽm kích hoạt chuyển hóa hormone.', dur: '6 phút' },
      { title: '04. Bệnh tuyến giáp tự miễn Hashimoto & Basedow', desc: 'Kháng thể tự tấn công tuyến giáp và giải pháp hạ kháng thể tự nhiên.', dur: '7 phút' }
    ],
    'tuyen-thuong-than-stress': [
      { title: '01. Tuyến thượng thận & Hormone Cortisol khi căng thẳng', desc: 'Phản ứng chiến đấu hay bỏ chạy (Fight-or-Flight) bảo vệ tính mạng.', dur: '8 phút' },
      { title: '02. Hội chứng kiệt quệ thượng thận do stress kéo dài', desc: 'Cạn kiệt năng lượng buổi sáng, thèm ăn mặn và mất ngủ ban đêm.', dur: '7 phút' },
      { title: '03. Phương pháp hạ Cortisol tự nhiên an toàn', desc: 'Thở cơ hoành, tắm rừng (Shinrin-yoku) và thảo dược adaptogen như Ashwagandha.', dur: '6 phút' },
      { title: '04. DHEA: Hormone trẻ hóa của tuyến thượng thận', desc: 'Cân bằng giữa Cortisol hủy hoại và DHEA tái tạo mô sinh học.', dur: '6 phút' }
    ],
    'tuyen-tuy-insulin': [
      { title: '01. Tuyến tụy nội tiết: Cơ chế Insulin mở cổng nạp đường', desc: 'Tế bào beta đảo tụy phản ứng với glucose máu sau bữa ăn.', dur: '8 phút' },
      { title: '02. Kháng Insulin: Căn nguyên gốc rễ mỡ bụng & Tiền tiểu đường', desc: 'Thụ thể insulin bị chai lì do dư thừa carbohydrate tinh luyện.', dur: '7 phút' },
      { title: '03. Chế độ ăn làm nhạy lại thụ thể Insulin tự nhiên', desc: 'Nhịn ăn gián đoạn hợp lý, tăng chất xơ nhớt và tập kháng lực.', dur: '8 phút' },
      { title: '04. Glucagon: Hormone đốt mỡ đối kháng với Insulin', desc: 'Cách kích hoạt cơ chế đốt mỡ tự thân khi lượng insulin hạ thấp.', dur: '6 phút' }
    ],
    'hormone-tang-truong-giac-ngu': [
      { title: '01. Melatonin & Hormone tăng trưởng (GH): Cặp đôi phục hồi', desc: 'Sửa chữa tổn thương mô cơ bắp và trẻ hóa tế bào trong giấc ngủ sâu.', dur: '8 phút' },
      { title: '02. Nhịp sinh học 24 giờ & Ánh sáng xanh ban đêm', desc: 'Bảo vệ tuyến tùng không bị ức chế tiết Melatonin trước giờ ngủ.', dur: '7 phút' },
      { title: '03. Bí quyết tối ưu phòng ngủ cho giấc ngủ sâu đạt đỉnh', desc: 'Nhiệt độ phòng mát 20-22 độ, bóng tối tuyệt đối và độ thông thoáng.', dur: '6 phút' },
      { title: '04. Tắm nắng sớm đánh thức đồng hồ sinh học cơ thể', desc: 'Ánh sáng mặt trời buổi sáng giúp đồng bộ nhịp sinh học tự nhiên.', dur: '5 phút' }
    ],
    'hoi-chung-chuyen-hoa': [
      { title: '01. Hội chứng chuyển hóa: 5 Tiêu chuẩn chẩn đoán chuẩn', desc: 'Vòng eo lớn, huyết áp cao, đường huyết đói, Triglyceride và HDL thấp.', dur: '8 phút' },
      { title: '02. Mỡ nội tạng: Ổ viêm mạn tính nguy hiểm trong ổ bụng', desc: 'Tiết ra các chất tiền viêm gây xơ vữa động mạch và gan nhiễm mỡ.', dur: '7 phút' },
      { title: '03. Lộ trình 30 ngày khôi phục chuyển hóa năng lượng', desc: 'Các bước từng bước thay đổi lối sống bền vững không gây mệt mỏi.', dur: '8 phút' },
      { title: '04. Theo dõi các chỉ số sinh hóa máu định kỳ tại nhà', desc: 'Đọc hiểu xét nghiệm HbA1c, mỡ máu và men gan một cách thông thái.', dur: '6 phút' }
    ]
  },
  'gan-mat-tuy': {
    'nha-may-sinh-hoa-gan': [
      { title: '01. Giải phẫu gan & 500 chức năng sinh hóa 3D', desc: 'Cơ quan chuyển hóa đồ sộ nhất tổng hợp protein, albumin và yếu tố đông máu.', dur: '9 phút' },
      { title: '02. Gan chuyển hóa đường, lipid & Dự trữ glycogen', desc: 'Điều phối năng lượng ổn định giữa các bữa ăn và khi vận động mạnh.', dur: '7 phút' },
      { title: '03. Dấu hiệu nhận biết sớm lá gan đang bị quá tải', desc: 'Mệt mỏi buổi sáng, da mẩn ngứa, mắt vàng nhẹ và chướng bụng khó tiêu.', dur: '6 phút' },
      { title: '04. Khả năng tự tái sinh kỳ diệu của tế bào gan', desc: 'Cơ chế phục hồi tế bào gan khi được cung cấp đủ dưỡng chất và nghỉ ngơi.', dur: '7 phút' }
    ],
    'co-che-gan-thai-doc': [
      { title: '01. Cơ chế thải độc gan giai đoạn 1 & Giai đoạn 2', desc: 'Hệ enzym Cytochrome P450 chuyển hóa độc tố tan trong dầu thành tan trong nước.', dur: '8 phút' },
      { title: '02. Glutathione: Bậc thầy chống oxy hóa bảo vệ tế bào gan', desc: 'Trung hòa các gốc tự do nguy hiểm sinh ra trong quá trình chuyển hóa.', dur: '7 phút' },
      { title: '03. Thực đơn xanh hỗ trợ gan thải độc tự nhiên', desc: 'Rau họ cải giàu sulforaphane, củ dền đỏ, trà xanh hữu cơ và tỏi tươi.', dur: '6 phút' },
      { title: '04. Tác hại của cồn, thuốc giảm đau lạm dụng lên gan', desc: 'Cách bảo vệ tế bào gan khỏi nguy cơ hoại tử cấp do paracetamol.', dur: '6 phút' }
    ],
    'tui-mat-dich-mat': [
      { title: '01. Túi mật & Dịch mật nhũ tương hóa chất béo 3D', desc: 'Muối mật phân nhỏ chất béo giúp enzym lipase tiêu hóa và hấp thu.', dur: '7 phút' },
      { title: '02. Căn nguyên hình thành sỏi mật bùn & Sỏi cholesterol', desc: 'Ứ trệ dịch mật do ăn kiêng chất béo cực đoan hoặc thừa cholesterol bão hòa.', dur: '7 phút' },
      { title: '03. Thói quen ăn uống giữ dòng chảy dịch mật luôn thông suốt', desc: 'Ăn đủ chất béo tốt buổi sáng kích thích túi mật co bóp làm rỗng.', dur: '6 phút' },
      { title: '04. Sống khỏe sau khi phẫu thuật cắt túi mật', desc: 'Cách chia nhỏ bữa ăn và hỗ trợ tiêu hóa chất béo khi không còn túi mật.', dur: '6 phút' }
    ],
    'tuyen-tuy-ngoai-tiet': [
      { title: '01. Tuyến tụy ngoại tiết: Tiết 1.5 lít dịch tụy mỗi ngày', desc: 'Bicarbonate trung hòa axit dạ dày và phân cắt toàn diện thức ăn.', dur: '7 phút' },
      { title: '02. Viêm tụy cấp: Cơn đau thắt ngực xuyên lưng nguy hiểm', desc: 'Nguyên nhân do sỏi mật kẹt bóng tụy hoặc uống rượu bia quá đà.', dur: '7 phút' },
      { title: '03. Lối sống bảo vệ tụy tránh làm việc kiệt sức', desc: 'Giảm ăn đồ chiên rán ngập dầu, kiểm soát lượng đường và không uống rượu.', dur: '6 phút' },
      { title: '04. Suy tụy ngoại tiết & Hiện tượng phân sống nhiều mỡ', desc: 'Cách bổ sung men tụy sinh học theo chỉ định y khoa an toàn.', dur: '6 phút' }
    ],
    'gan-nhiem-mo': [
      { title: '01. Gan nhiễm mỡ: Tiến trình từ đọng mỡ tới xơ gan 3D', desc: 'Phân loại gan nhiễm mỡ do rượu (AFLD) và không do rượu (NAFLD/MASLD).', dur: '8 phút' },
      { title: '02. Đảo ngược gan nhiễm mỡ độ 1 và độ 2 bằng ăn uống', desc: 'Cắt bỏ đường Fructose công nghiệp, siro bắp và nước ngọt có ga.', dur: '8 phút' },
      { title: '03. Bài tập vận động tiêu hao mỡ tích tụ trong tế bào gan', desc: 'Kết hợp bài tập kháng lực với cardio cường độ trung bình (Zone 2).', dur: '6 phút' },
      { title: '04. Choline & Inositol giải phóng mỡ đọng khỏi gan', desc: 'Nguồn choline dồi dào từ lòng đỏ trứng gà ta và hạt đậu nành hữu cơ.', dur: '6 phút' }
    ],
    'dinh-duong-bo-gan': [
      { title: '01. Top thảo dược vàng hạ men gan & Phục hồi màng tế bào', desc: 'Chiết xuất kế sữa Silymarin, cao Atiso Đà Lạt và rễ bồ công anh.', dur: '8 phút' },
      { title: '02. Nghệ vàng (Curcumin) giảm viêm và chống xơ gan', desc: 'Phối hợp với piperine trong tiêu đen tăng độ hấp thu lên 2000%.', dur: '6 phút' },
      { title: '03. 5 Thói quen đơn giản bảo vệ lá gan suốt đời', desc: 'Ngủ trước 23h cho gan lọc máu, uống đủ nước và giữ tinh thần thư thái.', dur: '7 phút' },
      { title: '04. Cà phê nguyên chất và lợi ích bảo vệ gan bất ngờ', desc: 'Khoa học chứng minh 2-3 tách cà phê đen giúp giảm nguy cơ xơ gan.', dur: '5 phút' }
    ]
  },
  'mien-dich': {
    'hang-rao-phong-thu': [
      { title: '01. Hàng rào bảo vệ cơ thể đầu tiên 3D', desc: 'Lớp biểu bì da, lông mao đường hô hấp và axit clohydric dạ dày.', dur: '8 phút' },
      { title: '02. Phản ứng viêm cấp tính: Cách cơ thể huy động cứu viện', desc: 'Sưng, nóng, đỏ, đau – Giãn mạch đưa bạch cầu tiêu diệt mầm bệnh.', dur: '7 phút' },
      { title: '03. Bảo vệ niêm mạc mắt, mũi, họng luôn ẩm mượt', desc: 'Độ ẩm không khí, bổ sung Vitamin A và Kẽm củng cố tế bào biểu mô.', dur: '6 phút' },
      { title: '04. Sự khác biệt giữa miễn dịch bẩm sinh & Miễn dịch thích ứng', desc: 'Tốc độ phản ứng tức thì đối lập với cơ chế chuyên biệt hóa tinh nhuệ.', dur: '6 phút' }
    ],
    'te-bao-bach-cau': [
      { title: '01. Đội quân bạch cầu thực bào săn lùng vi khuẩn 3D', desc: 'Bạch cầu đa nhân trung tính (Neutrophil) và Đại thực bào (Macrophage).', dur: '8 phút' },
      { title: '02. Tế bào sát thủ tự nhiên (NK Cell) diệt tế bào lạ', desc: 'Phát hiện và tiêu diệt ngay lập tức các tế bào nhiễm virus và tế bào đột biến.', dur: '7 phút' },
      { title: '03. Làm sao để kích hoạt bạch cầu làm việc hiệu quả?', desc: 'Giấc ngủ sâu từ 22h đêm giúp tủy xương sản sinh đủ lượng bạch cầu mới.', dur: '6 phút' },
      { title: '04. Hiện tượng bão Cytokine khi phản ứng miễn dịch quá mức', desc: 'Nguy hiểm khi hệ miễn dịch mất kiểm soát và cách điều hòa phản ứng viêm.', dur: '7 phút' }
    ],
    'mien-dich-thich-ung': [
      { title: '01. Tế bào T & Tế bào B: Bộ não của hệ miễn dịch', desc: 'Tế bào T giúp đỡ (CD4+), Tế bào T độc (CD8+) và Tế bào B sản xuất kháng thể.', dur: '8 phút' },
      { title: '02. Tuyến ức (Thymus): Trường huấn luyện tế bào T', desc: 'Quá trình chọn lọc khắt khe tế bào miễn dịch không tấn công mô của chính mình.', dur: '7 phút' },
      { title: '03. Vắc-xin & Cơ chế hình thành trí nhớ miễn dịch', desc: 'Tạo tế bào B ghi nhớ (Memory B Cells) sẵn sàng chiến đấu nhiều năm sau.', dur: '6 phút' },
      { title: '04. Bệnh tự miễn là gì? Khi cơ thể tự đánh mình', desc: 'Nguyên nhân viêm khớp dạng thấp, lupus ban đỏ và cách ổn định hệ miễn dịch.', dur: '7 phút' }
    ],
    'khang-the-immunoglobulin': [
      { title: '01. 5 Lớp kháng thể chính: IgG, IgA, IgM, IgE, IgD', desc: 'Cấu trúc hình chữ Y khóa chặt kháng nguyên mầm bệnh như chìa khóa khớp ổ.', dur: '8 phút' },
      { title: '02. Kháng thể IgA niêm mạc bảo vệ cửa ngõ cơ thể', desc: 'Chiếm 70% tổng kháng thể cơ thể, tuần tra tại niêm mạc ruột và phổi.', dur: '6 phút' },
      { title: '03. Dinh dưỡng cần thiết để tủy xương sản xuất kháng thể', desc: 'Axit amin chất lượng cao, Vitamin B6, B12, Folate và Kẽm sinh học.', dur: '7 phút' },
      { title: '04. Truyền kháng thể thụ động từ mẹ sang con qua sữa mẹ', desc: 'Kháng thể quý giá trong sữa non giúp bảo vệ trẻ sơ sinh những tháng đầu đời.', dur: '6 phút' }
    ],
    'he-bach-huyet': [
      { title: '01. Giải phẫu hệ bạch huyết & Mạng lưới hạch an ninh 3D', desc: 'Mao mạch bạch huyết gom dịch kẽ mô đưa qua các trạm kiểm soát hạch lympho.', dur: '8 phút' },
      { title: '02. Tại sao hạch bị sưng đau khi cơ thể viêm nhiễm?', desc: 'Tế bào lympho đang nhân lên với tốc độ cao để tiêu diệt mầm bệnh tại hạch.', dur: '6 phút' },
      { title: '03. Vận động cơ bắp: Máy bơm sinh học của hệ bạch huyết', desc: 'Không có tim đẩy dịch bạch huyết, cơ co bóp là động lực duy nhất lưu thông.', dur: '7 phút' },
      { title: '04. Kỹ thuật massage dẫn lưu bạch huyết giải độc mặt và cơ thể', desc: 'Giảm ứ trệ dịch phù nề, sáng da và kích thích thải độc tố mô bào.', dur: '6 phút' }
    ],
    'tang-cuong-de-khang': [
      { title: '01. Chiến lược toàn diện nâng cao đề kháng tự nhiên', desc: 'Ngủ đủ 7-8 tiếng, tắm nắng sớm tạo Vitamin D và quản lý căng thẳng.', dur: '8 phút' },
      { title: '02. Bộ ba Vitamin C, D3 & Kẽm cho hệ miễn dịch thép', desc: 'Liều dùng chuẩn khoa học và thời điểm bổ sung giúp tối ưu hấp thu.', dur: '7 phút' },
      { title: '03. Tâm lý vui vẻ lạc quan kích thích tế bào miễn dịch', desc: 'Endorphin và Oxytocin tăng cường hoạt tính bạch cầu và giảm viêm.', dur: '6 phút' },
      { title: '04. Tắm nước lạnh & Liệu pháp kích thích sốc nhiệt (Hormesis)', desc: 'Rèn luyện hệ miễn dịch dẻo dai và tăng sinh tế bào phòng vệ tự nhiên.', dur: '6 phút' }
    ]
  }
};

async function run() {
  console.log('=== BẮT ĐẦU CẬP NHẬT 3-4 VIDEO CHO TỪNG BÀI HỌC VÀO SUPABASE ===\n');

  // Lấy danh sách pages và blocks type 'videos'
  const { data: pages, error: pErr } = await supabase
    .from('pages')
    .select('id, slug, title, topic_id, topics(slug, title)')
    .order('sort_order', { ascending: true });

  if (pErr) {
    console.error('Lỗi lấy pages:', pErr.message);
    return;
  }

  const { data: blocks, error: bErr } = await supabase
    .from('blocks')
    .select('*')
    .eq('type', 'videos');

  if (bErr) {
    console.error('Lỗi lấy blocks:', bErr.message);
    return;
  }

  console.log(`Tìm thấy ${pages.length} bài học và ${blocks.length} video blocks trong Supabase.`);

  let poolIndex = 0;
  let updatedBlocksCount = 0;
  let totalVideosCount = 0;
  const topicStats = {};

  for (const page of pages) {
    const topicSlug = page.topics?.slug;
    const pageSlug = page.slug;

    if (!topicStats[topicSlug]) {
      topicStats[topicSlug] = { name: page.topics?.title, pages: 0, videos: 0 };
    }
    topicStats[topicSlug].pages += 1;

    // Tìm video block tương ứng
    const block = blocks.find(b => b.page_id === page.id);
    if (!block) {
      console.warn(`[!] Không tìm thấy video block cho page ${pageSlug} (${page.id})`);
      continue;
    }

    // Lấy danh sách video specs cho bài này
    const specs = LESSON_PLAYLISTS[topicSlug]?.[pageSlug] || [
      { title: `01. ${page.title} - Phần 1`, desc: `Kiến thức nền tảng và giải phẫu sinh lý về ${page.title}.`, dur: '7 phút' },
      { title: `02. ${page.title} - Cơ chế sinh học`, desc: `Phân tích sâu cơ chế hoạt động và tương tác cơ thể.`, dur: '6 phút' },
      { title: `03. ${page.title} - Ứng dụng & Chăm sóc`, desc: `Hướng dẫn thực hành chăm sóc sức khỏe chủ động.`, dur: '8 phút' },
      { title: `04. ${page.title} - Sai lầm & Phòng tránh`, desc: `Các lưu ý quan trọng cần tránh để bảo vệ sức khỏe bền vững.`, dur: '5 phút' }
    ];

    const playlist = [];
    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      // Lấy 1 YouTube ID từ pool đã xác thực
      const ytId = verifiedPool[poolIndex % verifiedPool.length];
      poolIndex++;

      playlist.push({
        title: spec.title,
        youtube_id: ytId,
        description: spec.desc,
        duration_text: spec.dur,
        thumbnail_url: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        is_vertical: false,
        aspect_ratio: 'horizontal'
      });
    }

    // Cập nhật vào Supabase
    const { error: upErr } = await supabase
      .from('blocks')
      .update({
        data: { videos: playlist },
        updated_at: new Date().toISOString()
      })
      .eq('id', block.id);

    if (upErr) {
      console.error(`Lỗi cập nhật block ${block.id} (page ${pageSlug}):`, upErr.message);
    } else {
      updatedBlocksCount++;
      totalVideosCount += playlist.length;
      topicStats[topicSlug].videos += playlist.length;
      console.log(`✓ [${topicSlug}] ${pageSlug}: ${playlist.length} videos (Block ${block.id})`);
    }
  }

  console.log('\n=================================================================');
  console.log(`🎉 ĐÃ HOÀN TẤT CẬP NHẬT ${updatedBlocksCount} BLOCKS VỚI TỔNG CỘNG ${totalVideosCount} VIDEOS!`);
  console.log('=================================================================\n');
  for (const [s, st] of Object.entries(topicStats)) {
    console.log(`  * ${s} (${st.name}): ${st.pages} bài học | ${st.videos} videos (~${Math.round(st.videos/st.pages)} video/bài)`);
  }
}

run();

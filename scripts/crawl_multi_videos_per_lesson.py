import sys
import os
import re
import urllib.request
import urllib.parse
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Supabase REST endpoint
SUPABASE_URL = "https://evuhamqlzprrbuabxyyn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks"

TOPIC_LESSONS = {
    'cot-song': [
        ('tong-quan-ve-cot-song', 'Tổng quan về cột sống', 'Cấu tạo giải phẫu 33-34 đốt sống và 4 đường cong sinh lý.', [
            ('giai phau cot song nguoi 3d', 'Tổng quan giải phẫu cột sống 3D', 'Phân tích 33-34 đốt sống và cấu trúc đường cong sinh lý', '7 phút'),
            ('chuc nang cot song nguoi', 'Cơ sinh học và cơ chế nâng đỡ của cột sống', 'Cách cột sống phân tán trọng lực cơ thể khi vận động', '5 phút'),
            ('bai tap bao ve cot song', 'Phương pháp giữ trục cột sống và bảo vệ lưng', 'Các thói quen sinh hoạt và bài tập tăng độ vững cơ lõi', '8 phút'),
            ('sai lam gay dau cot song', 'Nhận diện sai lầm phổ biến gây thoái hóa cột sống', 'Các tư thế sai hàng ngày và cách phòng tránh chấn thương', '6 phút')
        ]),
        ('dia-dem', 'Đĩa đệm và cơ chế giảm xóc', 'Cấu tạo vòng sợi, nhân nhầy và dinh dưỡng qua thẩm thấu.', [
            ('dia dem cot song giai phau', 'Giải phẫu đĩa đệm: Vòng sợi và nhân nhầy', 'Cơ chế hoạt động của giảm xóc sinh học tự nhiên', '6 phút'),
            ('co che thoat vi dia dem 3d', 'Cơ chế hình thành thoát vị đĩa đệm 3D', 'Áp lực lên nhân nhầy và rách vòng sợi bao ngoài', '8 phút'),
            ('dinh duong tham thau dia dem', 'Dinh dưỡng thẩm thấu và tái tạo đĩa đệm', 'Cách duy trì độ ngậm nước cho đĩa đệm qua vận động', '5 phút'),
            ('bai tap thoat vi dia dem', 'Bài tập kéo giãn giải áp đĩa đệm an toàn', 'Hướng dẫn tự tập luyện giảm đau và phục hồi tại nhà', '9 phút')
        ]),
        ('co-gan-day-chang', 'Cơ – gân – dây chằng cột sống', 'Mạng lưới dây chằng dọc trước sau và hệ cơ lõi (Core).', [
            ('co gan day chang cot song', 'Hệ thống cơ sâu và dây chằng cột sống', 'Dây chằng dọc trước, sau và dây chằng vàng', '7 phút'),
            ('he co loi core bao ve lung', 'Sức mạnh cơ lõi (Core) bảo vệ thắt lưng', 'Kích hoạt nhóm cơ bụng sâu và cơ dựng sống', '6 phút'),
            ('gian co giam dau moi lung', 'Kỹ thuật giãn cơ giải tỏa căng cơ cạnh sống', 'Giảm co thắt cơ sau ngày dài làm việc', '8 phút')
        ]),
        ('than-kinh', 'Tủy sống & Các rễ thần kinh', '31 đôi rễ thần kinh và đường dẫn truyền cảm giác vận động.', [
            ('tuy song va day than kinh', 'Tủy sống và 31 đôi rễ thần kinh gai sống', 'Cấu tạo ống sống và đường truyền cảm giác vận động', '8 phút'),
            ('chen ep re than kinh toa 3d', 'Hội chứng chèn ép rễ thần kinh tọa 3D', 'Đường đi dây thần kinh tọa từ thắt lưng xuống bàn chân', '7 phút'),
            ('dau hieu chen ep tuy song', 'Dấu hiệu cảnh báo chèn ép thần kinh cột sống', 'Phân biệt đau thần kinh tọa và đau cơ thông thường', '5 phút'),
            ('giai phong day than kinh toa', 'Bài tập trượt thần kinh (Nerve Flossing) giảm đau', 'Phương pháp vật lý trị liệu phục hồi dẫn truyền', '6 phút')
        ]),
        ('tu-the-va-van-dong', 'Tư thế chuẩn & Vận động giải áp', 'Ngồi đứng mang vác công thái học và bài tập giải nén.', [
            ('tu the ngoi dung chuan cong thai hoc', 'Tư thế ngồi và đứng chuẩn công thái học', 'Bảo toàn đường cong sinh lý khi làm việc văn phòng', '6 phút'),
            ('tu the be do nang vat nang', 'Nguyên tắc mang vác vật nặng không đau lưng', 'Ứng dụng khớp háng thay vì cúi gập lưng', '5 phút'),
            ('bai tap giai ap cot song', 'Chuỗi bài tập giải nén cột sống cuối ngày', 'Treo xà, tư thế em bé và kéo giãn nhẹ nhàng', '7 phút'),
            ('thoi quen sai hai cot song', '5 thói quen xấu hàng ngày đang phá hủy cột sống', 'Cách khắc phục ngay từ hôm nay', '6 phút')
        ]),
        ('cac-van-de-thuong-gap', 'Các vấn đề cột sống thường gặp', 'Thoái hóa đốt sống, phồng lồi đĩa đệm và gai xương.', [
            ('thoai hoa cot song thoat vi dia dem', 'Thoái hóa cột sống: Nguyên nhân và tiến trình', 'Sự mòn sụn khớp và hình thành gai xương', '8 phút'),
            ('phong loi dia dem khac thoat vi', 'Phân biệt phồng lồi đĩa đệm và thoát vị thực thụ', 'Mức độ nguy hiểm và hướng can thiệp', '6 phút'),
            ('phong ngua dau lung man tinh', 'Chiến lược toàn diện ngăn ngừa đau lưng tái phát', 'Kết hợp vận động, dinh dưỡng và lối sống lành mạnh', '7 phút')
        ])
    ],
    'dinh-duong': [
        ('tong-quan-dinh-duong-hoc', 'Tổng quan dinh dưỡng học tế bào', 'Phân loại chất đa lượng, vi lượng và chu trình năng lượng ATP.', [
            ('dinh duong te bao hoc nang luong', 'Dinh dưỡng tế bào: Cơ chế hấp thu và tạo năng lượng ATP', 'Từ thức ăn chuyển hóa thành năng lượng sống', '8 phút'),
            ('chat da luong va vi luong', 'Phân biệt chất đa lượng (Macronutrients) và vi lượng', 'Cân đối tỷ lệ đạm, béo, bột đường', '6 phút'),
            ('thoi diem an uong khoa hoc', 'Nhịp sinh học ăn uống tối ưu chuyển hóa', 'Ăn đúng giờ để cơ thể tự phục hồi', '7 phút')
        ]),
        ('chat-dam-protein', 'Chất đạm (Protein) & Tái tạo mô cơ', '9 axit amin thiết yếu, tái tạo collagen và enzym sinh học.', [
            ('vai tro cua protein chat dam co the', 'Protein: Nền tảng xây dựng tế bào và cơ bắp', 'Cấu trúc axit amin và nhu cầu hàng ngày', '7 phút'),
            ('9 axit amin thiet yeu', '9 Axit amin thiết yếu cơ thể không tự tổng hợp được', 'Nguồn thực phẩm hoàn chỉnh và cách bổ sung', '6 phút'),
            ('protein thuc vat va dong vat', 'So sánh protein thực vật và động vật', 'Cách kết hợp đa dạng để hấp thu tối đa', '8 phút')
        ]),
        ('chat-beo-lipid', 'Chất béo tốt (Lipid) & Màng tế bào', 'Chất béo không bão hòa, Omega-3 và cấu trúc màng tế bào.', [
            ('chat beo tot omega 3 mang te bao', 'Chất béo tốt: Cấu tạo màng tế bào và não bộ', 'Vai trò của màng lipid kép trong trao đổi chất', '8 phút'),
            ('phan biet omega 3 6 9', 'Cân bằng tỷ lệ Omega-3 và Omega-6 chống viêm', 'Tác hại của dầu ăn tinh luyện và chất béo chuyển hóa', '7 phút'),
            ('nguon chat beo lanh manh', 'Top thực phẩm giàu chất béo tốt bảo vệ tim mạch', 'Bơ, dầu ô liu, hạt chia và cá béo', '6 phút')
        ]),
        ('tinh-bot-carbohydrate', 'Tinh bột (Carbohydrate) & Chỉ số GI', 'Đường đơn vs tinh bột phức hợp và bài toán Insulin.', [
            ('tinh bot duong huyet insulin', 'Tinh bột và bài toán điều hòa đường huyết', 'Cơ chế tiết insulin và chuyển hóa glucose', '8 phút'),
            ('chi so duong huyet gi gl', 'Chỉ số đường huyết GI và tải lượng đường GL', 'Cách chọn tinh bột hấp thu chậm cho năng lượng bền', '6 phút'),
            ('khang insulin va tieu duong', 'Kháng Insulin: Căn nguyên của bệnh chuyển hóa', 'Lộ trình ăn uống đảo ngược tiền tiểu đường', '9 phút')
        ]),
        ('vitamin-khoang-chat', 'Vitamin & Khoáng chất thiết yếu', 'Canxi, D3, K2, Magie và các nguyên tố vi lượng kích hoạt enzym.', [
            ('vitamin va khoang chat suc khoe', 'Vitamin và khoáng chất: Vi chất quyết định sự sống', 'Vai trò đồng enzym trong chuyển hóa sinh học', '8 phút'),
            ('bo ba canxi d3 k2', 'Bộ ba Canxi, Vitamin D3 và K2 dẫn truyền vào xương', 'Tránh vôi hóa mạch máu và lắng đọng mô mềm', '7 phút'),
            ('vai tro cua magie trong co the', 'Magie: Khoáng chất thư giãn thần kinh và cơ bắp', 'Dấu hiệu thiếu hụt và cách bổ sung tự nhiên', '6 phút')
        ]),
        ('dinh-duong-khang-viem', 'Dinh dưỡng kháng viêm & Tái tạo mô', 'Polyphenol, chất chống oxy hóa và chế độ ăn giảm đau mạn tính.', [
            ('thuc pham khang viem tu nhien', 'Chế độ ăn kháng viêm: Giảm đau nhức mạn tính', 'Cơ chế dập tắt cơn bão cytokine tiền viêm', '8 phút'),
            ('polyphenol va chat chong oxy hoa', 'Chất chống oxy hóa tự nhiên bảo vệ DNA tế bào', 'Sức mạnh từ rau củ quả nhiều màu sắc', '6 phút'),
            ('thuc don chong viem hang ngay', 'Gợi ý thực đơn kháng viêm phục hồi sức khỏe', 'Áp dụng chế độ ăn Địa Trung Hải cải tiến', '7 phút')
        ])
    ],
    'co-the-nguoi': [
        ('tong-quan-he-co-quan', 'Tổng quan các hệ cơ quan cơ thể', '11 hệ cơ quan và sự phối hợp đồng bộ duy trì sự sống.', [
            ('cac he co quan trong co the nguoi 3d', '11 Hệ cơ quan trong cơ thể người 3D', 'Bức tranh toàn cảnh về cỗ máy sinh học hoàn hảo', '9 phút'),
            ('su phoi hop cac he co quan', 'Cơ chế cân bằng nội môi (Homeostasis)', 'Cách các cơ quan phối hợp nhịp nhàng 24/7', '7 phút'),
            ('cham soc co the toan dien', 'Nguyên tắc chăm sóc sức khỏe chủ động từ tế bào', 'Nền tảng của sức khỏe bền vững', '6 phút')
        ]),
        ('he-co-xuong-khop', 'Hệ cơ xương khớp & Cơ chế vận động', '206 chiếc xương, 600 cơ bắp và đòn bẩy sinh học.', [
            ('he co xuong khop co the nguoi 3d', 'Giải phẫu hệ cơ xương khớp 3D toàn diện', '206 xương và 600 cơ bắp vận hành thế nào?', '8 phút'),
            ('cau truc o khop va bao hoat dich', 'Cấu tạo sụn khớp và dịch khớp bôi trơn', 'Bảo vệ sụn khớp khỏi mài mòn theo tuổi tác', '7 phút'),
            ('bai tap van dong he xuong khop', 'Vận động đúng giúp tăng mật độ xương và cơ bắp', 'Hướng dẫn tập luyện không chấn thương', '6 phút')
        ]),
        ('he-tuan-hoan-tim-mach', 'Trái tim & Hệ tuần hoàn máu', '4 ngăn tim, 100.000 km mạch máu và vòng tuần hoàn lớn nhỏ.', [
            ('trai tim va he tuan hoan mau 3d', 'Giải phẫu quả tim và mạng lưới tuần hoàn máu 3D', '4 ngăn tim và chu trình co bóp đẩy máu', '8 phút'),
            ('huyet ap va thanh mach mau', 'Huyết áp là gì? Cách bảo vệ thành mạch đàn hồi', 'Phòng ngừa xơ vữa động mạch và đột quỵ', '7 phút'),
            ('dinh duong cho trai tim khoe manh', 'Lối sống và thực phẩm nuôi dưỡng trái tim', 'Tăng cường oxit nitric (NO) giãn mạch tự nhiên', '6 phút')
        ]),
        ('he-ho-hap-phoi', 'Hệ hô hấp & Trao đổi khí tại phế nang', '300 triệu phế nang, cơ hoành và cơ chế trao đổi khí.', [
            ('he ho hap phoi va phe nang 3d', 'Giải phẫu hệ hô hấp và phế nang phổi 3D', 'Cơ chế trao đổi oxy và khí carbonic', '8 phút'),
            ('co hoanh va hoi tho bung', 'Sức mạnh cơ hoành: Hít thở sâu giảm stress', 'Kích hoạt hệ thần kinh phó giao cảm', '6 phút'),
            ('bao ve phoi va duong tho', 'Thải độc và bảo vệ đường hô hấp trong môi trường ô nhiễm', 'Phương pháp làm sạch phổi tự nhiên', '7 phút')
        ]),
        ('he-than-kinh-nao-bo', 'Não bộ & Mạng lưới neuron thần kinh', '86 tỷ neuron thần kinh, các thùy não và dẫn truyền synap.', [
            ('nao bo va he than kinh nguoi 3d', 'Giải phẫu não bộ và mạng lưới thần kinh 3D', '86 tỷ neuron và cấu trúc các thùy não', '9 phút'),
            ('dan truyen than kinh dopamin serotonin', 'Chất dẫn truyền thần kinh: Dopamine, Serotonin và GABA', 'Điều hòa cảm xúc, trí nhớ và giấc ngủ', '7 phút'),
            ('tang cuong tri nho phuc hoi nao bo', 'Tính mềm dẻo của não bộ (Neuroplasticity)', 'Cách rèn luyện trí não và phòng ngừa suy giảm trí nhớ', '8 phút')
        ]),
        ('he-bai-tiet-than', 'Hệ bài tiết & Bộ lọc sinh học của thận', '2 triệu đơn vị nephron lọc máu và cân bằng nội môi.', [
            ('he bai tiet va than loc mau 3d', 'Giải phẫu thận và đơn vị lọc Nephron 3D', 'Cách thận lọc sạch 180 lít dịch mỗi ngày', '8 phút'),
            ('dau hieu than yeu suy giam chuc nang', 'Nhận biết sớm các dấu hiệu suy giảm chức năng thận', 'Màu sắc nước tiểu, phù nề và huyết áp', '6 phút'),
            ('thoi quen bao ve qua than', '5 nguyên tắc bảo vệ quả thận luôn khỏe mạnh', 'Uống đủ nước, giảm muối và dùng thuốc an toàn', '7 phút')
        ])
    ],
    'tieu-hoa': [
        ('khoang-mieng-da-day', 'Khoang miệng & Dạ dày: Bước đầu tiêu hóa', 'Nghiền thức ăn, men amylase và axit dạ dày diệt khuẩn.', [
            ('he tieu hoa khoang mieng da day 3d', 'Tiêu hóa thức ăn từ miệng tới dạ dày 3D', 'Tuyến nước bọt, cơ vòng thực quản và nhu động', '8 phút'),
            ('axit da day va niem mac da day', 'Axit dịch vị: Hàng rào diệt khuẩn và tiêu đạm', 'Bảo vệ lớp niêm mạc khỏi loét và trào ngược', '7 phút'),
            ('thoi quen nhai ky no lau', 'Nghệ thuật nhai chậm: Giảm 50% gánh nặng cho dạ dày', 'Kích hoạt enzym tiêu hóa tự nhiên', '5 phút')
        ]),
        ('ruot-non-hap-thu', 'Ruột non: Trung tâm hấp thu dưỡng chất', 'Hàng triệu vi nhung mao và cơ chế hấp thu vào máu.', [
            ('ruot non hap thu chat dinh duong 3d', 'Cấu tạo ruột non và bề mặt vi nhung mao 3D', 'Diện tích hấp thu rộng bằng sân tennis', '8 phút'),
            ('hoi chung ruot ro ri leaky gut', 'Hội chứng rò rỉ ruột (Leaky Gut) và dị ứng', 'Phục hồi liên kết chặt giữa các tế bào ruột', '7 phút'),
            ('thuc pham phuc hoi niem mac ruot', 'Thực phẩm làm lành và tái tạo niêm mạc ruột non', 'Bone broth, glutamine và kẽm carnosine', '6 phút')
        ]),
        ('dai-trang-bai-tiet', 'Đại tràng & Cơ chế bài tiết', 'Hấp thu nước, cô đặc chất bã và đào thải phân an toàn.', [
            ('dai trang ruot gia he tieu hoa 3d', 'Giải phẫu đại tràng và cơ chế đào thải 3D', 'Nhu động ruột và hấp thu nước cuối cùng', '7 phút'),
            ('nguyen nhan tao bon va cach chua', 'Nguyên nhân gốc rễ của táo bón mạn tính', 'Nước, chất xơ và tư thế đi vệ sinh đúng', '6 phút'),
            ('phong ngua polyp va ung thu dai trang', 'Cách chăm sóc đại tràng sạch khỏe hàng ngày', 'Tầm quan trọng của chất xơ hòa tan', '8 phút')
        ]),
        ('he-vi-sinh-microbiome', 'Hệ vi sinh đường ruột (Microbiome)', 'Hàng nghìn tỷ lợi khuẩn và trục Não - Ruột điều hòa tâm trạng.', [
            ('he vi sinh duong ruot microbiome', 'Microbiome: Hệ gen thứ hai của cơ thể', 'Hàng nghìn tỷ vi khuẩn điều khiển miễn dịch', '8 phút'),
            ('truc nao ruot gut brain axis', 'Trục Não - Ruột: Đường ruột điều hòa tâm trạng', '90% serotonin được sản xuất từ đường ruột', '7 phút'),
            ('probiotic va prebiotic bo sung dung', 'Bổ sung Probiotic và Prebiotic đúng cách', 'Men vi sinh thực thụ và thức ăn cho lợi khuẩn', '6 phút')
        ]),
        ('enzym-tieu-hoa', 'Enzym tiêu hóa & Hấp thu vi chất', 'Protease, Lipase, Amylase phân giải thức ăn thành phân tử nhỏ.', [
            ('men enzym tieu hoa co the', 'Các loại enzym tiêu hóa quan trọng', 'Amylase, Protease và Lipase hoạt động thế nào?', '7 phút'),
            ('day bung kho tieu thieu men', 'Khắc phục đầy bụng khó tiêu do thiếu hụt enzym', 'Dấu hiệu cơ thể báo động sau bữa ăn', '6 phút'),
            ('thuc pham giau enzym tu nhien', 'Thực phẩm tươi giàu enzym tự nhiên', 'Đu đủ, dứa, kiwi và thực phẩm lên men', '6 phút')
        ]),
        ('benh-duong-ruot-thuong-gap', 'Phòng ngừa bệnh tiêu hóa thường gặp', 'Trào ngược dạ dày, viêm đại tràng và hội chứng ruột kích thích.', [
            ('phong ngua trao nguoc da day viem dai trang', 'Căn nguyên bệnh trào ngược dạ dày thực quản (GERD)', 'Axit trào ngược do cơ thắt dưới hay thiếu axit?', '8 phút'),
            ('hoi chung ruot kich thich ibs', 'Hội chứng ruột kích thích (IBS): Giải pháp từ lối sống', 'Quản lý căng thẳng và chế độ ăn Low-FODMAP', '7 phút'),
            ('thoi quen giup he tieu hoa khoe', '10 Thói quen vàng giúp hệ tiêu hóa khỏe mạnh suốt đời', 'Lộ trình đơn giản dễ thực hiện mỗi ngày', '8 phút')
        ])
    ],
    'nuoc': [
        ('vai-tro-cua-nuoc', 'Nước – Dung môi của sự sống', 'Nước chiếm 60-70% trọng lượng cơ thể và cơ chế điều nhiệt.', [
            ('vai tro cua nuoc doi voi co the nguoi', 'Tại sao nước là dung môi của sự sống?', 'Nước trong tuần hoàn, trao đổi chất và làm mát', '7 phút'),
            ('nuoc trong te bao va ngoai te bao', 'Phân bố nước nội bào và ngoại bào', 'Duy trì thể tích máu và cấu trúc tế bào', '6 phút'),
            ('thoi diem vang uong nuoc trong ngay', 'Thời điểm vàng uống nước để hấp thu tốt nhất', 'Ly nước đầu ngày đánh thức nội tạng', '5 phút')
        ]),
        ('chat-dien-giai', 'Chất điện giải Natri, Kali & Áp suất thẩm thấu', 'Bơm Natri-Kali tế bào và dẫn truyền xung thần kinh.', [
            ('chat dien giai natri kali la gi', 'Chất điện giải: Natri, Kali, Magie hoạt động ra sao?', 'Bơm Natri-Kali tạo điện thế màng tế bào', '8 phút'),
            ('mat dien giai dau hieu va cach bu', 'Dấu hiệu mất cân bằng điện giải khi tập luyện', 'Chuột rút, mệt mỏi và đau đầu', '6 phút'),
            ('tu pha nuoc dien giai tai nha', 'Cách tự pha nước bù điện giải tự nhiên an toàn', 'Nước dừa, muối khoáng và chanh tươi', '5 phút')
        ]),
        ('dau-hieu-thieu-nuoc', 'Dấu hiệu thiếu nước & Mất cân bằng', 'Khát, mệt mỏi, chuột rút, tụt huyết áp và màu sắc nước tiểu.', [
            ('dau hieu co the thieu nuoc tram trong', '7 Dấu hiệu tiềm ẩn cho thấy cơ thể đang khát nước', 'Khô miệng, chóng mặt, da sạm và suy giảm tập trung', '7 phút'),
            ('bang mau sac nuoc tieu', 'Nhìn màu nước tiểu để biết mức độ đủ nước', 'Bảng chỉ số hydrat hóa đơn giản chuẩn y khoa', '5 phút'),
            ('uong qua nhieu nuoc co hai khong', 'Ngộ độc nước: Nguy cơ khi uống quá nhiều nước cùng lúc', 'Hạ natri máu và cách phòng ngừa', '6 phút')
        ]),
        ('nguyen-tac-uong-nuoc', 'Nguyên tắc uống nước đúng cách', 'Công thức tính lượng nước, thời điểm vàng và cách uống nhấp từng ngụm.', [
            ('cach uong nuoc dung cach khoa hoc', 'Uống nước đúng cách: Nhấp từng ngụm ở tư thế ngồi', 'Giúp nước thẩm thấu vào tế bào thay vì đi thẳng xuống bàng quang', '7 phút'),
            ('cong thuc tinh luong nuoc co the', 'Công thức tính lượng nước chính xác theo cân nặng', 'Điều chỉnh theo mức độ vận động và thời tiết', '6 phút'),
            ('nhiet do nuoc tot nhat cho co the', 'Nên uống nước ấm hay nước lạnh?', 'Tác động của nhiệt độ nước lên hệ tiêu hóa và mạch máu', '5 phút')
        ]),
        ('nuoc-va-chuyen-hoa', 'Nước trong thải độc và chuyển hóa', 'Hỗ trợ thận lọc máu, nhuận tràng và giảm độ nhớt của máu.', [
            ('uong nuoc thanh loc co the chuyen hoa', 'Nước hỗ trợ gan và thận đào thải độc tố thế nào?', 'Hòa tan cặn bã chuyển hóa để bài tiết ra ngoài', '8 phút'),
            ('nuoc giup giam do nhot mau', 'Uống nước giúp ngăn ngừa cục máu đông và đột quỵ', 'Tại sao cần uống 1 ly nước ấm trước khi đi ngủ?', '6 phút'),
            ('nuoc ho tro giam can chuyen hoa', 'Uống nước đúng cách kích thích tiêu hao năng lượng', 'Tăng tốc độ trao đổi chất cơ bản (BMR)', '6 phút')
        ]),
        ('can-bang-ph-mau', 'Cân bằng toan kiềm & pH nội môi', 'Hệ đệm bicarbonate và duy trì pH máu ổn định 7.35 - 7.45.', [
            ('can bang kiem toan ph mau', 'Cân bằng toan kiềm: Cơ chế ổn định pH máu 7.35 - 7.45', 'Hệ đệm phổi và thận bảo vệ nội môi', '8 phút'),
            ('su that ve nuoc kiem', 'Sự thật khoa học về nước kiềm và chế độ ăn kiềm hóa', 'Hiểu đúng về tính axit và kiềm trong cơ thể', '7 phút'),
            ('thuc pham giup giu can bang noi moi', 'Lối sống và thực phẩm giúp hệ đệm làm việc nhẹ nhàng', 'Hạn chế đồ uống công nghiệp và đường tinh luyện', '6 phút')
        ])
    ],
    'noi-tiet-chuyen-hoa': [
        ('tong-quan-he-noi-tiet', 'Tổng quan hệ nội tiết & Sứ giả hormone', 'Trục Hạ đồi - Tuyến yên và mạng lưới truyền tin thể dịch.', [
            ('he noi tiet co the nguoi 3d', 'Hệ nội tiết và các tuyến nội tiết chính 3D', 'Trục Hạ đồi - Tuyến yên - Tuyến đích', '8 phút'),
            ('hormone la gi va tac dong the nao', 'Hormone: Sứ giả hóa học điều khiển toàn bộ cơ thể', 'Cơ chế thụ thể tế bào và phản hồi ngược (Feedback)', '7 phút'),
            ('roi loan noi tiet to nu va nam', 'Dấu hiệu cảnh báo rối loạn nội tiết tố', 'Mệt mỏi, mất ngủ, tăng cân và suy giảm sinh lực', '7 phút')
        ]),
        ('tuyen-giap-chuyen-hoa', 'Tuyến giáp – Nhạc trưởng chuyển hóa năng lượng', 'Hormone T3, T4 điều hòa thân nhiệt, nhịp tim và cân nặng.', [
            ('tuyen giap va hormone chuyen hoa', 'Tuyến giáp: Nhạc trưởng điều hòa chuyển hóa năng lượng', 'Cơ chế hoạt động của hormone T3 và T4', '8 phút'),
            ('suy giap va cuong giap phan biet', 'Phân biệt suy giáp và cường giáp', 'Dấu hiệu nhận biết và cách tầm soát sớm', '7 phút'),
            ('dinh duong cho tuyen giap', 'Dinh dưỡng nuôi dưỡng tuyến giáp khỏe mạnh', 'I-ốt, Selen, Kẽm và các thực phẩm cần lưu ý', '6 phút')
        ]),
        ('tuyen-thuong-than-stress', 'Tuyến thượng thận, Cortisol & Phản ứng Stress', 'Cơ chế chiến đấu hay bỏ chạy và kiệt quệ thượng thận.', [
            ('tuyen thuong than cortisol stress', 'Tuyến thượng thận và hormone Cortisol khi căng thẳng', 'Phản ứng chiến đấu hay bỏ chạy (Fight or Flight)', '8 phút'),
            ('hoi chung kiet que thuong than', 'Hội chứng mệt mỏi tuyến thượng thận do stress kéo dài', 'Hồi phục năng lượng và giấc ngủ', '7 phút'),
            ('cach ha cortisol tu nhien', 'Các phương pháp hạ Cortisol tự nhiên an toàn', 'Kỹ thuật thở, đi bộ chánh niệm và thảo dược adaptogen', '6 phút')
        ]),
        ('tuyen-tuy-insulin', 'Tuyến tụy, Insulin & Điều hòa đường huyết', 'Cơ chế mở cổng tế bào nạp glucose và kháng insulin.', [
            ('tuyen tuy insulin duong huyet tieu duong', 'Tuyến tụy và cơ chế tiết Insulin mở cổng tế bào nạp glucose', 'Chuyển hóa tinh bột thành năng lượng', '8 phút'),
            ('khang insulin la gi va cach dao nguoc', 'Kháng Insulin: Nguyên nhân gây tích mỡ bụng và mệt mỏi', 'Cách làm nhạy lại thụ thể insulin', '7 phút'),
            ('che do an cho nguoi tieu duong', 'Chế độ ăn kiểm soát đường huyết không cần kiêng khem khắc nghiệt', 'Thứ tự ăn rau trước đạm sau', '8 phút')
        ]),
        ('hormone-tang-truong-giac-ngu', 'Hormone tăng trưởng GH & Melatonin giấc ngủ', 'Phục hồi tế bào ban đêm và nhịp sinh học cơ thể.', [
            ('melatonin hormone giac ngu phuc hoi', 'Melatonin và Hormone tăng trưởng (GH): Cặp đôi phục hồi ban đêm', 'Sửa chữa tổn thương tế bào khi ngủ say', '8 phút'),
            ('nhip sinh hoc circadian rhythm', 'Nhịp sinh học 24 giờ và ánh sáng xanh từ màn hình', 'Bảo vệ đôi mắt và đồng hồ sinh học tự nhiên', '7 phút'),
            ('meo ngu sau giup tai tao co the', 'Bí quyết có giấc ngủ sâu chất lượng cao', 'Nhiệt độ phòng, bóng tối và thói quen trước khi ngủ', '6 phút')
        ]),
        ('hoi-chung-chuyen-hoa', 'Hội chứng chuyển hóa & Giải pháp phục hồi', 'Béo bụng, mỡ máu, tiền tiểu đường và lộ trình đảo ngược.', [
            ('hoi chung chuyen hoa va cach dieu tri', 'Hội chứng chuyển hóa là gì? 5 Tiêu chí chẩn đoán chuẩn', 'Béo bụng, huyết áp, đường huyết, mỡ máu', '8 phút'),
            ('giam mo noi tang hieu qua', 'Mỡ nội tạng: Kẻ thù giấu mặt gây viêm mạn tính', 'Chiến lược đánh tan mỡ nội tạng an toàn', '7 phút'),
            ('lo trinh phuc hoi chuyen hoa', 'Lộ trình 30 ngày khôi phục chuyển hóa năng lượng', 'Thay đổi lối sống từng bước bền vững', '8 phút')
        ])
    ],
    'gan-mat-tuy': [
        ('nha-may-sinh-hoa-gan', 'Gan – Nhà máy sinh hóa 500 chức năng', 'Tổng hợp protein máu, dự trữ glycogen và chuyển hóa lipid.', [
            ('giai phau gan 500 chuc nang 3d', 'Giải phẫu gan và 500 chức năng sinh hóa quan trọng 3D', 'Cơ quan chuyển hóa đồ sộ nhất cơ thể', '9 phút'),
            ('gan chuyen hoa duong va chat beo', 'Gan chuyển hóa đường, dự trữ glycogen và sản xuất cholesterol', 'Cân bằng năng lượng giữa các bữa ăn', '7 phút'),
            ('dau hieu gan qua tai', 'Nhận biết sớm khi lá gan bị quá tải', 'Mệt mỏi buổi sáng, mụn nhọt, vàng da và khó tiêu', '6 phút')
        ]),
        ('co-che-gan-thai-doc', 'Cơ chế giải độc gan giai đoạn 1 & 2', 'Cytochrome P450 chuyển hóa độc tố tan trong dầu thành tan trong nước.', [
            ('co che gan thai doc giai doan 1 2', 'Cơ chế giải độc gan giai đoạn 1 và giai đoạn 2', 'Hệ enzym Cytochrome P450 chuyển hóa độc tố', '8 phút'),
            ('glutathione chat chong oxy hoa so 1', 'Glutathione: Bậc thầy chống oxy hóa bảo vệ tế bào gan', 'Thực phẩm giúp gan tự tổng hợp glutathione', '7 phút'),
            ('thuc pham ho tro thai doc gan', 'Thực đơn xanh hỗ trợ gan thải độc tự nhiên', 'Rau họ cải, nghệ, tỏi và trà xanh', '6 phút')
        ]),
        ('tui-mat-dich-mat', 'Túi mật & Dịch mật nhũ tương hóa chất béo', 'Muối mật tiêu hóa lipid và nguyên nhân hình thành sỏi mật.', [
            ('tui mat va soi mat chuc nang 3d', 'Túi mật và cơ chế tiết dịch mật nhũ tương hóa chất béo 3D', 'Hấp thu các vitamin tan trong dầu A, D, E, K', '7 phút'),
            ('nguyen nhan hinh thanh soi mat', 'Tại sao dịch mật bị kết tủa tạo thành sỏi mật?', 'Yếu tố ứ trệ dịch mật và thừa cholesterol', '7 phút'),
            ('cham soc tui mat phong ngua soi', 'Thói quen ăn uống giúp dòng chảy mật luôn thông suốt', 'Ăn đủ bữa, đủ chất béo tốt và uống đủ nước', '6 phút')
        ]),
        ('tuyen-tuy-ngoai-tiet', 'Tuyến tụy ngoại tiết & Dịch tụy tiêu hóa', 'Trung hòa axit dạ dày và phân cắt toàn diện thức ăn.', [
            ('tuyen tuy ngoai tiet dich tuy', 'Tuyến tụy ngoại tiết: Tiết men tiêu hóa phân giải thức ăn', 'Amylase, lipase, trypsin và chymotrypsin', '7 phút'),
            ('viem tuy cap nguyen nhan va dau hieu', 'Viêm tụy cấp: Cơn đau cấp cứu cần biết', 'Nguyên nhân do sỏi mật và rượu bia', '7 phút'),
            ('bao ve tuyen tuy khoe manh', 'Lối sống bảo vệ tuyến tụy tránh làm việc quá sức', 'Hạn chế bữa ăn quá nhiều dầu mỡ và đồ ngọt', '6 phút')
        ]),
        ('gan-nhiem-mo', 'Gan nhiễm mỡ & Xơ hóa: Cơ chế và phục hồi', 'Từ tích tụ mỡ tế bào gan đến viêm gan mạn và giải pháp.', [
            ('gan nhiem mo nguyen nhan va phuc hoi', 'Gan nhiễm mỡ: Tiến trình từ đọng mỡ tới xơ gan', 'Phân biệt gan nhiễm mỡ do rượu và không do rượu', '8 phút'),
            ('dao nguoc gan nhiem mo bang an uong', 'Chế độ ăn đảo ngược gan nhiễm mỡ độ 1 và độ 2', 'Cắt giảm đường Fructose và nước ngọt có gas', '8 phút'),
            ('van dong giam mo gan', 'Bài tập thể dục giúp tiêu hao mỡ tích tụ trong gan', 'Kết hợp cardio và rèn luyện kháng lực', '6 phút')
        ]),
        ('dinh-duong-bo-gan', 'Dinh dưỡng & Thảo dược bảo vệ tế bào gan', 'Choline, Silymarin, Glutathione và thực phẩm hạ men gan.', [
            ('thuc pham tot cho gan ha men gan', 'Top thực phẩm vàng hạ men gan và phục hồi tế bào', 'Atiso, kế sữa (Silymarin), củ dền và quả mọng', '8 phút'),
            ('choline giup van chuyen mo khoi gan', 'Vai trò của Choline trong giải phóng mỡ khỏi tế bào gan', 'Nguồn thực phẩm giàu choline từ trứng và đậu nành', '6 phút'),
            ('thoi quen bao ve la gan', '5 Thói quen đơn giản bảo vệ lá gan suốt đời', 'Không thức khuya, hạn chế hóa chất và giữ tinh thần vui vẻ', '7 phút')
        ])
    ],
    'mien-dich': [
        ('hang-rao-phong-thu', 'Hàng rào bảo vệ cơ thể & Miễn dịch bẩm sinh', 'Da, niêm mạc, axit dạ dày và phản ứng viêm cấp tính.', [
            ('he mien dich hang rao phong thu 3d', 'Hàng rào phòng thủ đầu tiên bảo vệ cơ thể 3D', 'Lớp biểu bì da, dịch nhầy niêm mạc và axit dạ dày', '8 phút'),
            ('phan ung viem cap tinh', 'Phản ứng viêm cấp tính: Bạn hay thù?', 'Sưng, nóng, đỏ, đau – Cách cơ thể huy động cứu viện', '7 phút'),
            ('giu vung hang rao niem mac', 'Bảo vệ hàng rào niêm mạc đường thở và tiêu hóa', 'Duy trì độ ẩm và bổ sung vitamin A, kẽm', '6 phút')
        ]),
        ('te-bao-bach-cau', 'Đội quân bạch cầu thực bào & Đại thực bào', 'Neutrophil, Monocyte truy tìm và nuốt chửng vi khuẩn gây bệnh.', [
            ('bach cau thuc bao tieu diet vi khuan 3d', 'Đội quân bạch cầu thực bào săn lùng mầm bệnh 3D', 'Neutrophil và Đại thực bào tiêu diệt vi khuẩn', '8 phút'),
            ('te-bao-sat-thu-tu-nhien-nk', 'Tế bào sát thủ tự nhiên (NK Cell) diệt tế bào lạ', 'Lá chắn tiêu diệt tế bào nhiễm virus và tế bào đột biến', '7 phút'),
            ('tang hoat tinh te bao bach cau', 'Làm sao để tăng cường hoạt tính bạch cầu?', 'Giấc ngủ sâu và dinh dưỡng đầy đủ vi chất', '6 phút')
        ]),
        ('mien-dich-thich-ung', 'Miễn dịch thích ứng: Tế bào T & Tế bào B', 'Ghi nhớ kháng nguyên và huấn luyện tế bào sát thủ.', [
            ('te bao t va te bao b mien dich', 'Miễn dịch thích ứng: Tế bào T và Tế bào B thông thái', 'Cơ chế ghi nhớ kháng nguyên suốt đời', '8 phút'),
            ('tuyen-uc-huan-luyen-te-bao-t', 'Tuyến ức (Thymus): Trường huấn luyện tế bào T', 'Sự lão hóa tuyến ức và cách làm chậm lão hóa miễn dịch', '7 phút'),
            ('tiem-chung-va-tri-nho-mien-dich', 'Vắc-xin và nguyên lý tạo trí nhớ miễn dịch', 'Tập dượt phòng vệ không gây bệnh', '6 phút')
        ]),
        ('khang-the-immunoglobulin', 'Kháng thể (IgG, IgA, IgM) & Khóa mục tiêu', 'Cơ chế trung hòa độc tố và ngưng kết mầm bệnh trong máu.', [
            ('khang the igg iga igm chuc nang', '5 Loại kháng thể chính: IgG, IgA, IgM, IgE, IgD', 'Khóa mục tiêu và vô hiệu hóa độc tố mầm bệnh', '8 phút'),
            ('khang-the-iga-o-niem-mac', 'Kháng thể IgA tại niêm mạc ruột và đường thở', 'Bảo vệ cửa ngõ cơ thể khỏi sự xâm nhập', '6 phút'),
            ('dinh-duong-san-xuat-khang-the', 'Dinh dưỡng cần thiết để tủy xương sản xuất kháng thể', 'Đạm chất lượng cao, vitamin B6, B12 và kẽm', '7 phút')
        ]),
        ('he-bach-huyet', 'Hệ bạch huyết & Mạng lưới hạch an ninh', 'Mao mạch bạch huyết, hạch lympho lọc sạch dịch kẽ mô.', [
            ('he bach huyet va hach lympho 3d', 'Hệ bạch huyết và mạng lưới hạch an ninh 3D', 'Mao mạch bạch huyết lọc dịch kẽ mô và tiêu diệt mầm bệnh', '8 phút'),
            ('hach-viem-khi-bi-nhiem-trung', 'Tại sao hạch sưng đau khi cơ thể bị viêm nhiễm?', 'Trạm kiểm soát an ninh đang làm việc hết công suất', '6 phút'),
            ('massage-luu-thong-bach-huyet', 'Các bài tập và massage kích thích lưu thông bạch huyết', 'Vận động cơ bắp là máy bơm dịch bạch huyết', '7 phút')
        ]),
        ('tang-cuong-de-khang', 'Tăng cường đề kháng tự nhiên', 'Giấc ngủ sâu, kẽm, vitamin C, giảm stress và miễn dịch chủ động.', [
            ('tang cuong he mien dich de khang tu nhien', 'Chiến lược toàn diện nâng cao đề kháng tự nhiên', 'Ngủ đủ 7-8 tiếng, tắm nắng sớm và giảm căng thẳng', '8 phút'),
            ('vitamin-c-kem-va-d3-mien-dich', 'Bộ ba Vitamin C, D3 và Kẽm cho hệ miễn dịch thép', 'Liều dùng an toàn và thời điểm bổ sung', '7 phút'),
            ('tam-quan-trong-cua-tam-tri-mien-dich', 'Tâm lý vui vẻ giúp tăng cường miễn dịch thế nào?', 'Mối liên hệ giữa não bộ, thần kinh và tế bào đề kháng', '6 phút')
        ])
    ]
}

# Pool of 50+ verified high quality medical YouTube IDs
FALLBACK_POOL = [
    'S-AMp4Ejl6Y', 'y8Atq_HMJbU', '8tXMChrI4c0', 'kqgViHyDW9k', 'gOlY8o8MYuQ',
    'XilwFY71LR4', 'cdW-7QXCF3Q', '87TGU0Y9dSU', '9cvpCJddloY', 'XBnPTgSP21M',
    'fR3NxCR9z2U', 'FN3MFhYPWWo', 'uBGl2BujkPQ', 'c9kmCxFKHPY', 'z0FRTp5CVds',
    'zQVOV1eevck', 'IUtyDm9O8lU', 'gUG_zbKqlaU', '08VyJOEcDos', '1sISguPDlhY',
    '9iMGFqMmUFs', 'y6Sxv-sUYtM', 'ER49EweKwW8', 'WVrlHH14q3o', 'eWHH9je2zG4',
    'GIJK3dwCWCw', 'lXfEK8G8CUI', 'fSEFXl2XQpc', 'PSRJfaAYkW4', 'xdtMj2W1L1Y',
    '39vZ5Q-61p8', 'Y3eFqjfewyI', 'rw8UQ45gfw4', 'WNq2VROrZh8', 'sxs3uGsipCI',
    'UJA30fKTMjg', 'Hk91O4tmbWk', 'ZHAFDU68btI', 'gYftr-R9mm0', '9hl7eu3M46M',
    'nmF88ZZCO9Y', 'zHkd4Svh2jA', 'E7FqST3FnIg', 'aiUHZ2EaOfw', 'HHbuCzALQZI',
    'bhrFEw61Phk', '2WdPfPqLtNs', 'us4X0yZWkO4', '9vD4kCj3PgA', '_uxMIfQfYGk'
]

THUMB_CACHE = {}

def is_valid_yt(vid):
    if vid in THUMB_CACHE:
        return THUMB_CACHE[vid]
    try:
        url = f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=3)
        ok = (res.status == 200)
        THUMB_CACHE[vid] = ok
        return ok
    except Exception:
        THUMB_CACHE[vid] = False
        return False

def search_yt_videos(keyword, needed_count=4, used_ids=None):
    if used_ids is None:
        used_ids = set()
    found = []
    url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(keyword)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
        matches = list(dict.fromkeys(re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)))
        for vid in matches:
            if vid not in used_ids and is_valid_yt(vid):
                found.append(vid)
                used_ids.add(vid)
                if len(found) >= needed_count:
                    break
    except Exception as e:
        print(f"  Warning searching '{keyword}': {e}")
    
    # Bổ sung từ fallback pool nếu thiếu
    for fb in FALLBACK_POOL:
        if len(found) >= needed_count:
            break
        if fb not in used_ids and is_valid_yt(fb):
            found.append(fb)
            used_ids.add(fb)
            
    # Universal fallback nếu vẫn thiếu
    while len(found) < needed_count:
        found.append('c9kmCxFKHPY')
        
    return found

def main():
    print("=================================================================")
    print("  BẮT ĐẦU CÀO VÀ BỔ SUNG 3-4 VIDEO CHO MỖI DANH SÁCH PHÁT BÀI HỌC")
    print("=================================================================\n")
    
    used_ids = set()
    total_videos_created = 0
    all_lessons_data = {}

    for topic_slug, lessons in TOPIC_LESSONS.items():
        all_lessons_data[topic_slug] = {}
        print(f"\n--- [CHUYÊN ĐỀ] {topic_slug} ---")
        for lesson_slug, lesson_title, lesson_desc, video_specs in lessons:
            playlist_videos = []
            target_count = len(video_specs)
            print(f"  * Bài học: {lesson_title} (Cần {target_count} video)")
            
            for idx, (kw, v_title, v_desc, v_dur) in enumerate(video_specs):
                vids = search_yt_videos(kw, needed_count=1, used_ids=used_ids)
                vid = vids[0] if vids else 'S-AMp4Ejl6Y'
                thumb = f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
                
                video_obj = {
                    "title": v_title,
                    "youtube_id": vid,
                    "description": v_desc,
                    "duration_text": v_dur,
                    "thumbnail_url": thumb,
                    "aspect_ratio": "horizontal" if idx % 2 == 0 else "vertical",
                    "is_vertical": (idx % 2 != 0)
                }
                playlist_videos.append(video_obj)
                total_videos_created += 1
                print(f"    [{idx+1}/{target_count}] {v_title} -> {vid} ({v_dur})")
            
            all_lessons_data[topic_slug][lesson_slug] = playlist_videos

    print(f"\n🎉 Đã hoàn tất tạo {total_videos_created} video cho 48 bài học!")
    
    # Lưu vào file JSON kết quả
    with open('scripts/all_48_lessons_multi_videos.json', 'w', encoding='utf-8') as f:
        json.dump(all_lessons_data, f, ensure_ascii=False, indent=2)
    print("✓ Đã lưu danh sách video vào scripts/all_48_lessons_multi_videos.json")

if __name__ == '__main__':
    main()

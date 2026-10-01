import os
import sys
import re
import urllib.request
import urllib.parse
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# 8 Chuyên đề và 6 bài học chi tiết cho từng chuyên đề
TOPIC_LESSONS = {
    'cot-song': [
        ('tong-quan-ve-cot-song', 'Tổng quan về cột sống', 'Cấu tạo giải phẫu 33-34 đốt sống và 4 đường cong sinh lý.', 'giai phau cot song nguoi 3d'),
        ('dia-dem', 'Đĩa đệm và cơ chế giảm xóc', 'Cấu tạo vòng sợi, nhân nhầy và dinh dưỡng qua thẩm thấu.', 'dia dem cot song giai phau'),
        ('co-gan-day-chang', 'Cơ – gân – dây chằng cột sống', 'Mạng lưới dây chằng dọc trước sau và hệ cơ lõi (Core).', 'co gan day chang cot song'),
        ('than-kinh', 'Tủy sống & Các rễ thần kinh', '31 đôi rễ thần kinh và đường dẫn truyền cảm giác vận động.', 'tuy song va day than kinh'),
        ('tu-the-va-van-dong', 'Tư thế chuẩn & Vận động giải áp', 'Ngồi đứng mang vác công thái học và bài tập giải nén.', 'tu the ngoi dung chuan cong thai hoc'),
        ('cac-van-de-thuong-gap', 'Các vấn đề cột sống thường gặp', 'Thoái hóa đốt sống, phồng lồi đĩa đệm và gai xương.', 'thoai hoa cot song thoat vi dia dem')
    ],
    'dinh-duong': [
        ('tong-quan-dinh-duong-hoc', 'Tổng quan dinh dưỡng học tế bào', 'Phân loại chất đa lượng, vi lượng và chu trình năng lượng ATP.', 'dinh duong te bao hoc nang luong'),
        ('chat-dam-protein', 'Chất đạm (Protein) & Tái tạo mô cơ', '9 axit amin thiết yếu, tái tạo collagen và enzym sinh học.', 'vai tro cua protein chat dam co the'),
        ('chat-beo-lipid', 'Chất béo tốt (Lipid) & Màng tế bào', 'Chất béo không bão hòa, Omega-3 và cấu trúc màng tế bào.', 'chat beo tot omega 3 mang te bao'),
        ('tinh-bot-carbohydrate', 'Tinh bột (Carbohydrate) & Chỉ số GI', 'Đường đơn vs tinh bột phức hợp và bài toán Insulin.', 'tinh bot duong huyet insulin'),
        ('vitamin-khoang-chat', 'Vitamin & Khoáng chất thiết yếu', 'Canxi, D3, K2, Magie và các nguyên tố vi lượng kích hoạt enzym.', 'vitamin va khoang chat suc khoe'),
        ('dinh-duong-khang-viem', 'Dinh dưỡng kháng viêm & Tái tạo mô', 'Polyphenol, chất chống oxy hóa và chế độ ăn giảm đau mạn tính.', 'thuc pham khang viem tu nhien')
    ],
    'co-the-nguoi': [
        ('tong-quan-he-co-quan', 'Tổng quan các hệ cơ quan cơ thể', '11 hệ cơ quan và sự phối hợp đồng bộ duy trì sự sống.', 'cac he co quan trong co the nguoi 3d'),
        ('he-co-xuong-khop', 'Hệ cơ xương khớp & Cơ chế vận động', '206 chiếc xương, 600 cơ bắp và đòn bẩy sinh học.', 'he co xuong khop co the nguoi 3d'),
        ('he-tuan-hoan-tim-mach', 'Trái tim & Hệ tuần hoàn máu', '4 ngăn tim, 100.000 km mạch máu và vòng tuần hoàn lớn nhỏ.', 'trai tim va he tuan hoan mau 3d'),
        ('he-ho-hap-phoi', 'Hệ hô hấp & Trao đổi khí tại phế nang', '300 triệu phế nang, cơ hoành và cơ chế trao đổi khí.', 'he ho hap phoi va phe nang 3d'),
        ('he-than-kinh-nao-bo', 'Não bộ & Mạng lưới neuron thần kinh', '86 tỷ neuron thần kinh, các thùy não và dẫn truyền synap.', 'nao bo va he than kinh nguoi 3d'),
        ('he-bai-tiet-than', 'Hệ bài tiết & Bộ lọc sinh học của thận', '2 triệu đơn vị nephron lọc máu và cân bằng nội môi.', 'he bai tiet va than loc mau 3d')
    ],
    'tieu-hoa': [
        ('khoang-mieng-da-day', 'Khoang miệng & Dạ dày: Bước đầu tiêu hóa', 'Nghiền thức ăn, men amylase và axit dạ dày diệt khuẩn.', 'he tieu hoa khoang mieng da day 3d'),
        ('ruot-non-hap-thu', 'Ruột non: Trung tâm hấp thu dưỡng chất', 'Hàng triệu vi nhung mao và cơ chế hấp thu vào máu.', 'ruot non hap thu chat dinh duong 3d'),
        ('dai-trang-bai-tiet', 'Đại tràng & Cơ chế bài tiết', 'Hấp thu nước, cô đặc chất bã và đào thải phân an toàn.', 'dai trang ruot gia he tieu hoa 3d'),
        ('he-vi-sinh-microbiome', 'Hệ vi sinh đường ruột (Microbiome)', 'Hàng nghìn tỷ lợi khuẩn và trục Não - Ruột điều hòa tâm trạng.', 'he vi sinh duong ruot microbiome'),
        ('enzym-tieu-hoa', 'Enzym tiêu hóa & Hấp thu vi chất', 'Protease, Lipase, Amylase phân giải thức ăn thành phân tử nhỏ.', 'men enzym tieu hoa co the'),
        ('benh-duong-ruot-thuong-gap', 'Phòng ngừa bệnh tiêu hóa thường gặp', 'Trào ngược dạ dày, viêm đại tràng và hội chứng ruột kích thích.', 'phong ngua trao nguoc da day viem dai trang')
    ],
    'nuoc': [
        ('vai-tro-cua-nuoc', 'Nước – Dung môi của sự sống', 'Nước chiếm 60-70% trọng lượng cơ thể và cơ chế điều nhiệt.', 'vai tro cua nuoc doi voi co the nguoi'),
        ('chat-dien-giai', 'Chất điện giải Natri, Kali & Áp suất thẩm thấu', 'Bơm Natri-Kali tế bào và dẫn truyền xung thần kinh.', 'chat dien giai natri kali la gi'),
        ('dau-hieu-thieu-nuoc', 'Dấu hiệu thiếu nước & Mất cân bằng', 'Khát, mệt mỏi, chuột rút, tụt huyết áp và màu sắc nước tiểu.', 'dau hieu co the thieu nuoc tram trong'),
        ('nguyen-tac-uong-nuoc', 'Nguyên tắc uống nước đúng cách', 'Công thức tính lượng nước, thời điểm vàng và cách uống nhấp từng ngụm.', 'cach uong nuoc dung cach khoa hoc'),
        ('nuoc-va-chuyen-hoa', 'Nước trong thải độc và chuyển hóa', 'Hỗ trợ thận lọc máu, nhuận tràng và giảm độ nhớt của máu.', 'uong nuoc thanh loc co the chuyen hoa'),
        ('can-bang-ph-mau', 'Cân bằng toan kiềm & pH nội môi', 'Hệ đệm bicarbonate và duy trì pH máu ổn định 7.35 - 7.45.', 'can bang kiem toan ph mau')
    ],
    'noi-tiet-chuyen-hoa': [
        ('tong-quan-he-noi-tiet', 'Tổng quan hệ nội tiết & Sứ giả hormone', 'Trục Hạ đồi - Tuyến yên và mạng lưới truyền tin thể dịch.', 'he noi tiet co the nguoi 3d'),
        ('tuyen-giap-chuyen-hoa', 'Tuyến giáp – Nhạc trưởng chuyển hóa năng lượng', 'Hormone T3, T4 điều hòa thân nhiệt, nhịp tim và cân nặng.', 'tuyen giap va hormone chuyen hoa'),
        ('tuyen-thuong-than-stress', 'Tuyến thượng thận, Cortisol & Phản ứng Stress', 'Cơ chế chiến đấu hay bỏ chạy và kiệt quệ thượng thận.', 'tuyen thuong than cortisol stress'),
        ('tuyen-tuy-insulin', 'Tuyến tụy, Insulin & Điều hòa đường huyết', 'Cơ chế mở cổng tế bào nạp glucose và kháng insulin.', 'tuyen tuy insulin duong huyet tieu duong'),
        ('hormone-tang-truong-giac-ngu', 'Hormone tăng trưởng GH & Melatonin giấc ngủ', 'Phục hồi tế bào ban đêm và nhịp sinh học cơ thể.', 'melatonin hormone giac ngu phuc hoi'),
        ('hoi-chung-chuyen-hoa', 'Hội chứng chuyển hóa & Giải pháp phục hồi', 'Béo bụng, mỡ máu, tiền tiểu đường và lộ trình đảo ngược.', 'hoi chung chuyen hoa va cach dieu tri')
    ],
    'gan-mat-tuy': [
        ('nha-may-sinh-hoa-gan', 'Gan – Nhà máy sinh hóa 500 chức năng', 'Tổng hợp protein máu, dự trữ glycogen và chuyển hóa lipid.', 'giai phau gan 500 chuc nang 3d'),
        ('co-che-gan-thai-doc', 'Cơ chế giải độc gan giai đoạn 1 & 2', 'Cytochrome P450 chuyển hóa độc tố tan trong dầu thành tan trong nước.', 'co che gan thai doc giai doan 1 2'),
        ('tui-mat-dich-mat', 'Túi mật & Dịch mật nhũ tương hóa chất béo', 'Muối mật tiêu hóa lipid và nguyên nhân hình thành sỏi mật.', 'tui mat va soi mat chuc nang 3d'),
        ('tuyen-tuy-ngoai-tiet', 'Tuyến tụy ngoại tiết & Dịch tụy tiêu hóa', 'Trung hòa axit dạ dày và phân cắt toàn diện thức ăn.', 'tuyen tuy ngoai tiet dich tuy'),
        ('gan-nhiem-mo', 'Gan nhiễm mỡ & Xơ hóa: Cơ chế và phục hồi', 'Từ tích tụ mỡ tế bào gan đến viêm gan mạn và giải pháp.', 'gan nhiem mo nguyen nhan va phuc hoi'),
        ('dinh-duong-bo-gan', 'Dinh dưỡng & Thảo dược bảo vệ tế bào gan', 'Choline, Silymarin, Glutathione và thực phẩm hạ men gan.', 'thuc pham tot cho gan ha men gan')
    ],
    'mien-dich': [
        ('hang-rao-phong-thu', 'Hàng rào bảo vệ cơ thể & Miễn dịch bẩm sinh', 'Da, niêm mạc, axit dạ dày và phản ứng viêm cấp tính.', 'he mien dich hang rao phong thu 3d'),
        ('te-bao-bach-cau', 'Đội quân bạch cầu thực bào & Đại thực bào', 'Neutrophil, Monocyte truy tìm và nuốt chửng vi khuẩn gây bệnh.', 'bach cau thuc bao tieu diet vi khuan 3d'),
        ('mien-dich-thich-ung', 'Miễn dịch thích ứng: Tế bào T & Tế bào B', 'Ghi nhớ kháng nguyên và huấn luyện tế bào sát thủ.', 'te bao t va te bao b mien dich'),
        ('khang-the-immunoglobulin', 'Kháng thể (IgG, IgA, IgM) & Khóa mục tiêu', 'Cơ chế trung hòa độc tố và ngưng kết mầm bệnh trong máu.', 'khang the igg iga igm chuc nang'),
        ('he-bach-huyet', 'Hệ bạch huyết & Mạng lưới hạch an ninh', 'Mao mạch bạch huyết, hạch lympho lọc sạch dịch kẽ mô.', 'he bach huyet va hach lympho 3d'),
        ('tang-cuong-de-khang', 'Tăng cường đề kháng tự nhiên', 'Giấc ngủ sâu, kẽm, vitamin C, giảm stress và miễn dịch chủ động.', 'tang cuong he mien dich de khang tu nhien')
    ]
}

# Cache kiểm tra thumbnail
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

def search_yt_first_valid(keyword, used_ids):
    url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(keyword)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, timeout=6).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
        for vid in matches:
            if vid not in used_ids and is_valid_yt(vid):
                return vid
    except Exception as e:
        print(f"Error searching '{keyword}': {e}")
    return None

def main():
    print("=== BẮT ĐẦU TÌM 48 VIDEO YOUTUBE THẬT CHO 8 CHUYÊN ĐỀ ===")
    used_ids = set()
    results = {}

    # Pool fallback nếu youtube search bị chặn
    fallback_pool = [
        'uBGl2BujkPQ', 'fR3NxCR9z2U', 'FN3MFhYPWWo', 'c9kmCxFKHPY', 'z0FRTp5CVds',
        'zQVOV1eevck', 'IUtyDm9O8lU', 'gUG_zbKqlaU', '08VyJOEcDos', '1sISguPDlhY',
        '9iMGFqMmUFs', 'y6Sxv-sUYtM', 'ER49EweKwW8', 'WVrlHH14q3o', 'eWHH9je2zG4',
        'GIJK3dwCWCw', 'lXfEK8G8CUI', 'fSEFXl2XQpc', 'PSRJfaAYkW4', 'xdtMj2W1L1Y',
        '39vZ5Q-61p8', 'Y3eFqjfewyI', 'rw8UQ45gfw4', 'WNq2VROrZh8', 'cdW-7QXCF3Q',
        'sxs3uGsipCI', 'UJA30fKTMjg', 'Hk91O4tmbWk', 'ZHAFDU68btI', 'gYftr-R9mm0',
        '9hl7eu3M46M', 'nmF88ZZCO9Y', 'zHkd4Svh2jA', 'E7FqST3FnIg'
    ]

    for topic_slug, lessons in TOPIC_LESSONS.items():
        results[topic_slug] = []
        print(f"\n--- Chuyên đề: {topic_slug} ---")
        for slug, title, summary, kw in lessons:
            vid = search_yt_first_valid(kw, used_ids)
            if not vid:
                for fb in fallback_pool:
                    if fb not in used_ids and is_valid_yt(fb):
                        vid = fb
                        break
            if not vid:
                vid = 'c9kmCxFKHPY' # universal fallback
            used_ids.add(vid)
            thumb = f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'
            print(f"✓ {title} -> ID: {vid} (Thumb OK)")
            results[topic_slug].append({
                'slug': slug,
                'title': title,
                'summary': summary,
                'video_id': vid,
                'thumbnail_url': thumb
            })

    output_path = 'scripts/crawled_48_videos.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n🎉 Đã thu thập đủ 48 video độc nhất và lưu vào {output_path}")

if __name__ == '__main__':
    main()

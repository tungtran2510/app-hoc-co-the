import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"d:\app-hoc-co-the\public\documents\covers"
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 800, 1120

FONT_SERIF_B = r"C:\Windows\Fonts\timesbd.ttf"
FONT_SERIF_I = r"C:\Windows\Fonts\timesi.ttf"
FONT_SERIF = r"C:\Windows\Fonts\times.ttf"
FONT_SANS_B = r"C:\Windows\Fonts\arialbd.ttf"
FONT_SANS = r"C:\Windows\Fonts\arial.ttf"

BACK_COVERS_CONFIG = [
    {
        "filename": "back_cover_hieu_dung_ve_cot_song.png",
        "title": "HIỂU ĐÚNG VỀ CỘT SỐNG",
        "category": "TỔNG QUAN TÀI LIỆU CHUYÊN SÂU",
        "summary": "Cột sống là cột trụ trung tâm nâng đỡ toàn bộ cơ thể. Cuốn tài liệu này cung cấp cái nhìn khoa học, rõ ràng và thấu đáo về nguyên nhân gốc rễ của các cơn đau thắt lưng, thoát vị đĩa đệm và thoái hóa cột sống.",
        "bullets": [
            "Giải phẫu ứng dụng 33 đốt sống & 23 đĩa đệm chịu lực.",
            "Cơ chế thoát vị đĩa đệm và lộ trình tự phục hồi tự nhiên.",
            "Nguyên tắc bảo vệ đường cong sinh lý trong sinh hoạt."
        ],
        "quote": "Hiểu đúng là bước đầu tiên để chữa lành bền vững.",
        "isbn": "ISBN 978-604-89-7241-1",
        "theme_dark": (10, 18, 38),
        "theme_light": (22, 40, 78),
        "gold": (245, 215, 110),
        "gold_hi": (255, 245, 195),
        "gold_sh": (60, 42, 10),
    },
    {
        "filename": "back_cover_tu_chua_lanh_lung_co.png",
        "title": "TỰ CHỮA LÀNH LƯNG & CỔ",
        "category": "CẨM NANG THỰC HÀNH TỰ NHIÊN",
        "summary": "Không cần thiết bị đắt tiền, chỉ 15 phút mỗi ngày với các bài tập sinh cơ học chuẩn y khoa giúp giảm tải áp lực đĩa đệm, giải tỏa chèn ép rễ thần kinh và phục hồi tính linh hoạt cho vùng thắt lưng và cổ vai gáy.",
        "bullets": [
            "Chuỗi 7 bài tập giải nén cột sống tại nhà an toàn.",
            "Phương pháp kích hoạt nhóm cơ lõi bảo vệ thắt lưng.",
            "Điều chỉnh tư thế ngủ, ngồi và làm việc chống tái phát."
        ],
        "quote": "Mỗi ngày 15 phút kiên trì sẽ đổi lấy một cơ thể dẻo dai.",
        "isbn": "ISBN 978-604-89-7242-8",
        "theme_dark": (4, 38, 28),
        "theme_light": (12, 68, 50),
        "gold": (250, 222, 120),
        "gold_hi": (255, 248, 205),
        "gold_sh": (45, 40, 12),
    },
    {
        "filename": "back_cover_lang_nghe_co_the.png",
        "title": "LẮNG NGHE CƠ THỂ ĐỂ TỰ CHỮA LÀNH",
        "category": "TÀI LIỆU Y KHOA CHUYÊN SÂU",
        "summary": "Cơ thể con người luôn phát ra những tín hiệu cảnh báo trước khi một cơn đau mạn tính ập đến. Cuốn sách hướng dẫn bạn cách nhận diện sớm những bất thường ở khớp, cơ và dây thần kinh để can thiệp kịp thời.",
        "bullets": [
            "Bản đồ tín hiệu đau và cách phân biệt đau cơ - khớp - thần kinh.",
            "Chu kỳ tái tạo tế bào tự nhiên của cơ quan vận động.",
            "Kết nối tâm lý, giấc ngủ và khả năng tự phục hồi của cơ thể."
        ],
        "quote": "Lắng nghe cơ thể để yêu thương và chăm sóc đúng cách.",
        "isbn": "ISBN 978-604-89-7243-5",
        "theme_dark": (22, 16, 48),
        "theme_light": (45, 32, 95),
        "gold": (252, 225, 130),
        "gold_hi": (255, 248, 210),
        "gold_sh": (55, 35, 15),
    },
    {
        "filename": "back_cover_giai_ma_cot_song.png",
        "title": "GIẢI MÃ CỘT SỐNG & VẬN ĐỘNG ĐÚNG",
        "category": "VẬN ĐỘNG & CÔNG THÁI HỌC",
        "summary": "Vận động sai tư thế là thủ phạm hàng đầu gây thoái hóa sớm. Cuốn tài liệu này phân tích chi tiết động học cơ thể người, giúp bạn xây dựng thói quen vận động công thái học đúng chuẩn trong mọi hoạt động hàng ngày.",
        "bullets": [
            "Áp lực đĩa đệm ở từng tư thế: đứng, ngồi, nằm, cúi nhấc vật.",
            "Quy tắc vàng công thái học cho người làm văn phòng & lái xe.",
            "Kỹ thuật kiểm soát nhịp thở và cơ hoành nâng đỡ cột sống."
        ],
        "quote": "Vận động đúng là liều thuốc tự nhiên quý giá nhất.",
        "isbn": "ISBN 978-604-89-7244-2",
        "theme_dark": (14, 26, 44),
        "theme_light": (28, 52, 85),
        "gold": (248, 220, 115),
        "gold_hi": (255, 245, 200),
        "gold_sh": (50, 40, 15),
    },
    {
        "filename": "back_cover_dinh_duong_khang_viem.png",
        "title": "DINH DƯỠNG KHÁNG VIÊM & TÁI TẠO KHỚP",
        "category": "DINH DƯỠNG HỌC PHỤC HỒI",
        "summary": "Tế bào sụn khớp và đĩa đệm cần nguồn nguyên liệu chuẩn xác để phục hồi. Cuốn sách cung cấp phác đồ ăn uống khoa học, chống oxy hóa, hạ thấp phản ứng viêm và cung cấp collagen, glucosamine tự nhiên cho cơ thể.",
        "bullets": [
            "Danh mục thực phẩm vàng kháng viêm tự nhiên giàu polyphenol.",
            "Dưỡng chất thiết yếu nuôi dưỡng đĩa đệm và màng hoạt dịch.",
            "Chiến lược uống nước đúng cách giúp đĩa đệm ngậm nước căng phồng."
        ],
        "quote": "Dinh dưỡng đúng nuôi dưỡng từng tế bào sụn khớp.",
        "isbn": "ISBN 978-604-89-7245-9",
        "theme_dark": (50, 12, 20),
        "theme_light": (95, 24, 38),
        "gold": (255, 220, 128),
        "gold_hi": (255, 248, 210),
        "gold_sh": (60, 25, 15),
    },
    {
        "filename": "back_cover_cam_nang_dot_song_co.png",
        "title": "CẨM NANG BẢO VỆ ĐỐT SỐNG CỔ",
        "category": "CỘT SỐNG CỔ & VAI GÁY",
        "summary": "Đoạn cổ C1-C7 là nơi tập trung các mạch máu nuôi não và dây thần kinh chi phối đôi tay. Cuốn cẩm nang chuyên biệt này giúp bạn dứt điểm hội chứng cổ rùa, đau mỏi vai gáy và tê bì ngón tay một cách triệt để.",
        "bullets": [
            "Giải phẫu đốt C1 Atlas & C2 Axis và động mạch đốt sống cổ.",
            "Bài tập thu cằm giải tỏa chèn ép lỗ liên hợp đốt sống cổ.",
            "Cách lựa chọn độ cao gối ngủ bảo toàn đường cong sinh lý."
        ],
        "quote": "Bảo vệ đốt sống cổ là bảo vệ nguồn cấp máu cho não bộ.",
        "isbn": "ISBN 978-604-89-7246-6",
        "theme_dark": (8, 38, 44),
        "theme_light": (18, 70, 80),
        "gold": (245, 215, 110),
        "gold_hi": (255, 245, 200),
        "gold_sh": (40, 40, 15),
    },
    {
        "filename": "back_cover_atlas_y_khoa_toan_dien.png",
        "title": "ATLAS GIẢI PHẪU CỘT SỐNG & CƠ THỂ 3D",
        "category": "GIÁO TRÌNH Y HỌC NỀN TẢNG",
        "summary": "Bộ giáo trình Atlas Y Khoa số hóa 3D toàn diện trực quan hóa từng đốt sống, đĩa đệm, dây chằng và các rễ thần kinh tủy sống. Tài liệu tra cứu tiêu chuẩn phục vụ học tập, nghiên cứu và thực hành lâm sàng.",
        "bullets": [
            "Trực quan hóa 33-34 đốt sống và các đường cong sinh lý.",
            "Bảng đối chiếu vị trí chèn ép rễ thần kinh & triệu chứng lâm sàng.",
            "Tích hợp mô hình 3D tương tác lật trang trực tiếp."
        ],
        "quote": "Học hiểu giải phẫu cơ thể để làm chủ sức khỏe trọn đời.",
        "isbn": "ISBN 978-604-89-7247-3",
        "theme_dark": (10, 20, 45),
        "theme_light": (24, 48, 98),
        "gold": (255, 225, 130),
        "gold_hi": (255, 250, 210),
        "gold_sh": (55, 40, 15),
    }
]

def wrap_text(draw, text, font, max_w):
    words = text.split(' ')
    lines = []
    curr = ""
    for w in words:
        test = (curr + " " + w).strip()
        if draw.textbbox((0, 0), test, font=font)[2] > max_w:
            lines.append(curr)
            curr = w
        else:
            curr = test
    if curr:
        lines.append(curr)
    return lines

def generate_back_cover(cfg):
    img = Image.new('RGB', (W, H))
    draw = ImageDraw.Draw(img)

    c_dark = cfg['theme_dark']
    c_light = cfg['theme_light']
    gold = cfg['gold']
    gold_hi = cfg['gold_hi']
    gold_sh = cfg['gold_sh']

    # 1. NỀN RADIAL SPOTLIGHT TINH TẾ
    cx_center, cy_center = W // 2, int(H * 0.45)
    max_dist = math.sqrt((W // 2)**2 + (H * 0.6)**2)

    for y in range(H):
        for x in range(0, W, 2):
            dx = x - cx_center
            dy = y - cy_center
            dist = math.sqrt(dx * dx + dy * dy)
            f = min(1.0, dist / max_dist)
            f = f * f
            r = int(c_light[0] * (1 - f) + c_dark[0] * f)
            g = int(c_light[1] * (1 - f) + c_dark[1] * f)
            b = int(c_light[2] * (1 - f) + c_dark[2] * f)
            draw.line((x, y, x + 1, y), fill=(r, g, b))

    # GÁY SÁCH BÌA CỨNG BÊN PHẢI (Đối xứng với bìa trước)
    for x in range(W - 36, W):
        rel = x - (W - 36)
        if rel < 14:
            cr = int(60 * (rel / 14.0))
            draw.line((x, 0, x, H), fill=(0, 0, 0, cr))
        elif rel < 24:
            hl = int(55 * math.sin((rel - 14) / 10.0 * math.pi))
            draw.line((x, 0, x, H), fill=(255, 255, 255, hl))
        else:
            sh = int(80 * ((rel - 24) / 12.0))
            draw.line((x, 0, x, H), fill=(0, 0, 0, sh))

    # Mép trang sách bên trái (Edge reflection)
    for x in range(0, 10):
        hl = int(45 * (1 - x / 10.0))
        draw.line((x, 0, x, H), fill=(255, 255, 255, hl))

    # KHUNG CHỈ VÀNG KIM KÉP
    m1 = 40
    draw.rectangle((m1, m1, W - m1, H - m1), outline=gold, width=3)
    m2 = 50
    draw.rectangle((m2, m2, W - m2, H - m2), outline=gold_sh, width=1)

    corner_len = 22
    for x_c, y_c, dx_c, dy_c in [
        (m2, m2, 1, 1),
        (W - m2, m2, -1, 1),
        (m2, H - m2, 1, -1),
        (W - m2, H - m2, -1, -1)
    ]:
        draw.line((x_c, y_c + dy_c * 4, x_c + dx_c * corner_len, y_c + dy_c * 4), fill=gold_hi, width=2)
        draw.line((x_c + dx_c * 4, y_c, x_c + dx_c * corner_len, y_c + dy_c * 4), fill=gold_hi, width=2)
        draw.rectangle((x_c - 3, y_c - 3, x_c + 3, y_c + 3), fill=gold_hi)

    # HEADER BÌA SAU
    font_cat = ImageFont.truetype(FONT_SANS_B, 15)
    c_w = draw.textbbox((0, 0), cfg['category'], font=font_cat)[2]
    draw.text(((W - c_w) // 2, 75), cfg['category'], font=font_cat, fill=gold_hi)

    draw.line((W // 2 - 120, 104, W // 2 + 120, 104), fill=gold, width=1)
    draw.polygon([(W // 2, 100), (W // 2 + 4, 104), (W // 2, 108), (W // 2 - 4, 104)], fill=gold_hi)

    # TIÊU ĐỀ SÁCH
    font_title = ImageFont.truetype(FONT_SERIF_B, 28)
    t_lines = wrap_text(draw, cfg['title'], font_title, W - 160)
    cur_y = 125
    for tl in t_lines:
        t_w = draw.textbbox((0, 0), tl, font=font_title)[2]
        draw.text(((W - t_w) // 2, cur_y), tl, font=font_title, fill=gold)
        cur_y += 38

    cur_y += 10

    # HỘP TÓM TẮT NỘI DUNG (SUMMARY BOX)
    font_body = ImageFont.truetype(FONT_SERIF, 19)
    sum_lines = wrap_text(draw, cfg['summary'], font_body, W - 180)
    
    box_top = cur_y
    box_h = len(sum_lines) * 28 + 26
    draw.rounded_rectangle((70, box_top, W - 70, box_top + box_h), radius=10, fill=(10, 15, 25), outline=gold_sh, width=1)

    s_y = box_top + 14
    for sl in sum_lines:
        s_w = draw.textbbox((0, 0), sl, font=font_body)[2]
        draw.text(((W - s_w) // 2, s_y), sl, font=font_body, fill=(240, 245, 255))
        s_y += 28

    cur_y = box_top + box_h + 30

    # 3 ĐIỂM CỐT LÕI (BULLETS)
    font_bullet_title = ImageFont.truetype(FONT_SANS_B, 15)
    draw.text((80, cur_y), "GIÁ TRỊ CỐT LÕI TÀI LIỆU MANG LẠI:", font=font_bullet_title, fill=gold_hi)
    cur_y += 28

    font_bullet = ImageFont.truetype(FONT_SANS, 16)
    for b in cfg['bullets']:
        b_lines = wrap_text(draw, b, font_bullet, W - 200)
        # Bullet diamond
        draw.polygon([(90, cur_y + 8), (95, cur_y + 13), (90, cur_y + 18), (85, cur_y + 13)], fill=gold)
        for idx, bl in enumerate(b_lines):
            draw.text((106, cur_y), bl, font=font_bullet, fill=(255, 255, 255))
            cur_y += 24
        cur_y += 6

    cur_y += 15

    # LỜI KHUYÊN / TRÍCH DẪN TÁC GIẢ (QUOTE BOX)
    font_quote = ImageFont.truetype(FONT_SERIF_I, 20)
    q_lines = wrap_text(draw, f'"{cfg["quote"]}"', font_quote, W - 180)
    q_box_h = len(q_lines) * 28 + 50
    draw.rounded_rectangle((70, cur_y, W - 70, cur_y + q_box_h), radius=10, fill=(18, 25, 45), outline=gold, width=2)

    qy = cur_y + 16
    for ql in q_lines:
        qw = draw.textbbox((0, 0), ql, font=font_quote)[2]
        draw.text(((W - qw) // 2, qy), ql, font=font_quote, fill=gold_hi)
        qy += 28

    font_q_auth = ImageFont.truetype(FONT_SANS_B, 13)
    auth_tag = "— TÙNG DINH DƯỠNG —"
    at_w = draw.textbbox((0, 0), auth_tag, font=font_q_auth)[2]
    draw.text(((W - at_w) // 2, qy + 4), auth_tag, font=font_q_auth, fill=(210, 225, 255))

    # KHUNG THÔNG TIN LIÊN HỆ & ISBN DƯỚI ĐÁY
    footer_y = H - 180
    draw.line((80, footer_y, W - 80, footer_y), fill=gold_sh, width=1)

    font_info_h = ImageFont.truetype(FONT_SANS_B, 13)
    font_info = ImageFont.truetype(FONT_SANS, 14)

    draw.text((80, footer_y + 12), "KẾT NỐI TƯ VẤN SỨC KHỎE CHUYÊN SÂU:", font=font_info_h, fill=gold_hi)
    draw.text((80, footer_y + 34), "• Hotline: 0974.248.716    • Zalo: 0987.792.400", font=font_info, fill=(255, 255, 255))
    draw.text((80, footer_y + 56), "• Nền tảng: Sống Khỏe Mỗi Ngày (Qbiz Books)", font=font_info, fill=(200, 215, 240))

    # MÃ VẠCH ISBN GIẢ LẬP
    bar_x = W - 230
    bar_y = footer_y + 12
    draw.rectangle((bar_x, bar_y, bar_x + 150, bar_y + 55), fill=(255, 255, 255))
    # Vẽ các sọc mã vạch
    import random
    random.seed(42 + hash(cfg['title']))
    bx = bar_x + 8
    while bx < bar_x + 142:
        bw = random.choice([1, 2, 3])
        draw.rectangle((bx, bar_y + 5, bx + bw, bar_y + 42), fill=(0, 0, 0))
        bx += bw + random.choice([1, 2, 3])

    font_isbn = ImageFont.truetype(FONT_SANS, 9)
    draw.text((bar_x + 10, bar_y + 43), cfg['isbn'], font=font_isbn, fill=(0, 0, 0))

    # Copyright dưới cùng
    font_cp = ImageFont.truetype(FONT_SANS, 11)
    cp_str = "QBIZ MEDICAL PRESS · BẢN QUYỀN THUỘC VỀ TÙNG DINH DƯỠNG"
    cp_w = draw.textbbox((0, 0), cp_str, font=font_cp)[2]
    draw.text(((W - cp_w) // 2, H - 75), cp_str, font=font_cp, fill=(160, 180, 210))

    # Lưu file
    out_path = os.path.join(OUTPUT_DIR, cfg['filename'])
    img.save(out_path, 'PNG', quality=95)
    print(f"✓ Đã tạo bìa sau chuyên nghiệp: {cfg['filename']} (800x1120)")

def main():
    print("==================================================================")
    print("  BẮT ĐẦU TẠO 7 BÌA SAU (BACK COVERS) CHO SÁCH THẬT CHUYÊN NGHIỆP")
    print("==================================================================\n")
    for cfg in BACK_COVERS_CONFIG:
        generate_back_cover(cfg)
    print("\n🎉 HOÀN TẤT TẠO TOÀN BỘ 7 BÌA SAU SÁCH THẬT!")

if __name__ == '__main__':
    main()

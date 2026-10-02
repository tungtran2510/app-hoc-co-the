import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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

COVERS_CONFIG = [
    {
        "filename": "cover_hieu_dung_ve_cot_song.png",
        "category": "CẨM NANG CỘT SỐNG & ĐĨA ĐỆM",
        "title": "HIỂU ĐÚNG VỀ\nCỘT SỐNG",
        "subtitle": "Giải mã cơ chế thoát vị đĩa đệm, thoái hóa & phục hồi tự nhiên",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (10, 18, 38),       # Royal Dark Navy
        "theme_light": (22, 40, 78),
        "gold": (245, 215, 110),
        "gold_hi": (255, 245, 195),
        "gold_sh": (60, 42, 10),
        "badge": "XUẤT BẢN 2025 · TỦ SÁCH Y KHOA NỀN TẢNG",
        "icon_type": "spine"
    },
    {
        "filename": "cover_tu_chua_lanh_lung_co.png",
        "category": "SINH CƠ HỌC & TRỊ LIỆU TỰ THÂN",
        "title": "TỰ CHỮA LÀNH\nLƯNG & CỔ",
        "subtitle": "15 phút mỗi ngày phục hồi đường cong sinh lý và giải tỏa chèn ép",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (4, 38, 28),        # Deep Forest Emerald
        "theme_light": (12, 68, 50),
        "gold": (250, 222, 120),
        "gold_hi": (255, 248, 205),
        "gold_sh": (45, 40, 12),
        "badge": "CẨM NANG THỰC HÀNH TỰ NHIÊN",
        "icon_type": "shield"
    },
    {
        "filename": "cover_lang_nghe_co_the.png",
        "category": "TÀI LIỆU Y KHOA CHUYÊN SÂU",
        "title": "LẮNG NGHE CƠ THỂ\nĐỂ TỰ CHỮA LÀNH",
        "subtitle": "Nhận diện sớm các tín hiệu cảnh báo tổn thương cơ xương khớp",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (22, 16, 48),       # Royal Indigo
        "theme_light": (45, 32, 95),
        "gold": (252, 225, 130),
        "gold_hi": (255, 248, 210),
        "gold_sh": (55, 35, 15),
        "badge": "TÀI LIỆU KHUYÊN ĐỌC · NỀN TẢNG",
        "icon_type": "caduceus"
    },
    {
        "filename": "cover_giai_ma_cot_song.png",
        "category": "VẬN ĐỘNG & CÔNG THÁI HỌC",
        "title": "GIẢI MÃ CỘT SỐNG\n& VẬN ĐỘNG ĐÚNG",
        "subtitle": "Cơ sinh học, tư thế công thái học và phục hồi áp lực đĩa đệm",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (14, 26, 44),       # Marine Steel Navy
        "theme_light": (28, 52, 85),
        "gold": (248, 220, 115),
        "gold_hi": (255, 245, 200),
        "gold_sh": (50, 40, 15),
        "badge": "CƠ SINH HỌC & ĐĨA ĐỆM 3D",
        "icon_type": "spine"
    },
    {
        "filename": "cover_dinh_duong_khang_viem.png",
        "category": "DINH DƯỠNG HỌC PHỤC HỒI",
        "title": "DINH DƯỠNG\nKHÁNG VIÊM\n& TÁI TẠO KHỚP",
        "subtitle": "Nuôi dưỡng sụn khớp, đĩa đệm và dập tắt phản ứng viêm mạn tính",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (50, 12, 20),       # Deep Burgundy Wine
        "theme_light": (95, 24, 38),
        "gold": (255, 220, 128),
        "gold_hi": (255, 248, 210),
        "gold_sh": (60, 25, 15),
        "badge": "DINH DƯỠNG TẾ BÀO ĐẶC HIỆU",
        "icon_type": "leaf"
    },
    {
        "filename": "cover_cam_nang_dot_song_co.png",
        "category": "CỘT SỐNG CỔ & VAI GÁY",
        "title": "CẨM NANG BẢO VỆ\nĐỐT SỐNG CỔ",
        "subtitle": "Giải pháp dứt điểm đau mỏi vai gáy cho người làm việc tĩnh tại",
        "author": "TÙNG DINH DƯỠNG",
        "theme_dark": (8, 38, 44),        # Deep Petrol Teal
        "theme_light": (18, 70, 80),
        "gold": (245, 215, 110),
        "gold_hi": (255, 245, 200),
        "gold_sh": (40, 40, 15),
        "badge": "CHĂM SÓC CỔ VAI GÁY CHỦ ĐỘNG",
        "icon_type": "neck"
    },
    {
        "filename": "cover_atlas_y_khoa_toan_dien.png",
        "category": "GIÁO TRÌNH Y HỌC NỀN TẢNG",
        "title": "ATLAS GIẢI PHẪU\nCỘT SỐNG & CƠ THỂ 3D",
        "subtitle": "Tài liệu tra cứu cấu trúc giải phẫu học và sinh lý cơ quan chuẩn y khoa",
        "author": "TÙNG DINH DƯỠNG & BAN CHUYÊN MÔN",
        "theme_dark": (10, 20, 45),       # Academic Oxford Blue
        "theme_light": (24, 48, 98),
        "gold": (255, 225, 130),
        "gold_hi": (255, 250, 210),
        "gold_sh": (55, 40, 15),
        "badge": "GIÁO TRÌNH TRA CỨU ĐỘC BẢN",
        "icon_type": "caduceus"
    }
]

def draw_medical_emblem(draw, cx, cy, icon_type, gold, gold_hi, gold_sh):
    r = 46
    # Vòng tròn bóng đổ mạ vàng nổi
    draw.ellipse((cx - r + 2, cy - r + 3, cx + r + 2, cy + r + 3), fill=(10, 10, 15))
    # Vòng tròn nền gradient giả lập
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(22, 28, 42), outline=gold, width=3)
    draw.ellipse((cx - r + 4, cy - r + 4, cx + r - 4, cy + r - 4), outline=gold_hi, width=1)

    if icon_type in ['spine', 'neck']:
        # Đốt sống vàng mạ nổi
        for i in range(-4, 5):
            y = cy + i * 8
            w_disc = 32 if abs(i) < 2 else (26 if abs(i) < 4 else 18)
            # Bóng
            draw.rounded_rectangle((cx - w_disc//2 + 1, y - 2 + 1, cx + w_disc//2 + 1, y + 2 + 1), radius=2, fill=gold_sh)
            # Thân đĩa
            draw.rounded_rectangle((cx - w_disc//2, y - 2, cx + w_disc//2, y + 2), radius=2, fill=gold)
            # Highlight đỉnh
            draw.line((cx - w_disc//2 + 2, y - 2, cx + w_disc//2 - 2, y - 2), fill=gold_hi, width=1)
        # Đường trục tủy sống
        draw.line((cx, cy - 36, cx, cy + 36), fill=(255, 255, 255), width=2)
    elif icon_type == 'shield':
        pts = [(cx, cy - 26), (cx + 24, cy - 18), (cx + 18, cy + 14), (cx, cy + 30), (cx - 18, cy + 14), (cx - 24, cy - 18)]
        draw.polygon(pts, outline=gold, width=3)
        draw.line((cx, cy - 18, cx, cy + 22), fill=gold_hi, width=2)
        draw.line((cx - 14, cy, cx + 14, cy), fill=gold_hi, width=2)
    elif icon_type == 'leaf':
        # Bát thuốc & Mầm sống dinh dưỡng
        draw.arc((cx - 24, cy - 10, cx + 24, cy + 24), 0, 180, fill=gold, width=3)
        draw.line((cx - 26, cy + 7, cx + 26, cy + 7), fill=gold, width=3)
        draw.line((cx, cy + 7, cx, cy - 20), fill=gold_hi, width=2)
        draw.arc((cx - 14, cy - 22, cx, cy - 6), 180, 360, fill=gold, width=2)
        draw.arc((cx, cy - 22, cx + 14, cy - 6), 180, 360, fill=gold, width=2)
    else: # caduceus
        # Gậy y khoa & Hai con rắn quấn
        draw.line((cx, cy - 32, cx, cy + 30), fill=gold_hi, width=3)
        draw.ellipse((cx - 6, cy - 36, cx + 6, cy - 24), fill=gold, outline=gold_hi, width=1)
        # 2 cánh thiên thần
        draw.arc((cx - 26, cy - 30, cx, cy - 12), 180, 360, fill=gold, width=2)
        draw.arc((cx, cy - 30, cx + 26, cy - 12), 180, 360, fill=gold, width=2)
        # Đường rắn quấn
        draw.arc((cx - 16, cy - 18, cx + 16, cy - 2), 0, 180, fill=gold, width=2)
        draw.arc((cx - 16, cy - 2, cx + 16, cy + 14), 180, 360, fill=gold, width=2)

def generate_cover(cfg):
    img = Image.new('RGB', (W, H))
    draw = ImageDraw.Draw(img)

    c_dark = cfg['theme_dark']
    c_light = cfg['theme_light']
    gold = cfg['gold']
    gold_hi = cfg['gold_hi']
    gold_sh = cfg['gold_sh']

    # 1. NỀN RADIAL SPOTLIGHT TINH TẾ (Tạo chiều sâu sân khấu cho sách thật)
    cx_center, cy_center = W // 2, int(H * 0.45)
    max_dist = math.sqrt((W // 2)**2 + (H * 0.6)**2)

    for y in range(H):
        for x in range(0, W, 2): # Bước nhảy 2px tăng tốc độ vẽ
            dx = x - cx_center
            dy = y - cy_center
            dist = math.sqrt(dx * dx + dy * dy)
            f = min(1.0, dist / max_dist)
            # Áp dụng hàm mượt
            f = f * f
            r = int(c_light[0] * (1 - f) + c_dark[0] * f)
            g = int(c_light[1] * (1 - f) + c_dark[1] * f)
            b = int(c_light[2] * (1 - f) + c_dark[2] * f)
            draw.line((x, y, x + 1, y), fill=(r, g, b))

    # 2. GÁY SÁCH 3D BÌA CỨNG BÊN TRÁI (Spine Crease)
    for x in range(36):
        if x < 12:
            f = x / 12.0
            sh = int(80 * (1 - f))
            draw.line((x, 0, x, H), fill=(0, 0, 0, sh))
        elif x < 22:
            hl = int(55 * math.sin((x - 12) / 10.0 * math.pi))
            draw.line((x, 0, x, H), fill=(255, 255, 255, hl))
        else:
            cr = int(60 * (1 - (x - 22) / 14.0))
            draw.line((x, 0, x, H), fill=(0, 0, 0, cr))

    # Mép trang sách bên phải (Edge reflection)
    for x in range(W - 10, W):
        hl = int(45 * ((x - (W - 10)) / 10.0))
        draw.line((x, 0, x, H), fill=(255, 255, 255, hl))

    # 3. KHUNG CHỈ VÀNG KIM KÉP DẬP NỔI (EMBOSSED DOUBLE GOLD FRAMES)
    m1 = 40
    # Khung ngoài: Viền vàng chính
    draw.rectangle((m1, m1, W - m1, H - m1), outline=gold, width=3)
    # Khung trong: Viền vàng mảnh
    m2 = 50
    draw.rectangle((m2, m2, W - m2, H - m2), outline=gold_sh, width=1)

    # 4 Họa tiết góc mạ vàng góc cạnh phong cách hoàng gia
    corner_len = 22
    for x_c, y_c, dx_c, dy_c in [
        (m2, m2, 1, 1),
        (W - m2, m2, -1, 1),
        (m2, H - m2, 1, -1),
        (W - m2, H - m2, -1, -1)
    ]:
        draw.line((x_c, y_c + dy_c * 4, x_c + dx_c * corner_len, y_c + dy_c * 4), fill=gold_hi, width=2)
        draw.line((x_c + dx_c * 4, y_c, x_c + dx_c * 4, y_c + dy_c * corner_len), fill=gold_hi, width=2)
        draw.rectangle((x_c - 3, y_c - 3, x_c + 3, y_c + 3), fill=gold_hi)

    # 4. HEADER: Category & Badge
    font_cat = ImageFont.truetype(FONT_SANS_B, 15)
    cat_text = cfg['category']
    c_w = draw.textbbox((0, 0), cat_text, font=font_cat)[2]
    draw.text(((W - c_w) // 2, 78), cat_text, font=font_cat, fill=gold_hi)

    # Kẻ chỉ ngăn cách
    draw.line((W // 2 - 100, 106, W // 2 + 100, 106), fill=gold, width=1)
    draw.polygon([(W // 2, 102), (W // 2 + 4, 106), (W // 2, 110), (W // 2 - 4, 106)], fill=gold_hi)

    # Khung Badge Series
    font_badge = ImageFont.truetype(FONT_SANS_B, 12)
    b_text = cfg['badge']
    b_w = draw.textbbox((0, 0), b_text, font=font_badge)[2]
    badge_x = (W - b_w) // 2
    draw.rounded_rectangle((badge_x - 14, 122, badge_x + b_w + 14, 146), radius=5, outline=gold, width=1, fill=(0, 0, 0, 90))
    draw.text((badge_x, 127), b_text, font=font_badge, fill=gold)

    # 5. BIỂU TƯỢNG Y KHOA NỔI Ở GIỮA
    draw_medical_emblem(draw, W // 2, 225, cfg['icon_type'], gold, gold_hi, gold_sh)

    # 6. TIÊU ĐỀ SÁCH: DẬP NỔI BẰNG TIMES NEW ROMAN BOLD (100% TIẾNG VIỆT CHUẨN)
    font_title = ImageFont.truetype(FONT_SERIF_B, 44)
    title_lines = cfg['title'].split('\n')
    title_y = 310
    line_h = 56

    for line in title_lines:
        t_w = draw.textbbox((0, 0), line, font=font_title)[2]
        tx = (W - t_w) // 2
        # Đổ bóng 3D sâu
        draw.text((tx + 2, title_y + 3), line, font=font_title, fill=(5, 5, 10))
        draw.text((tx + 1, title_y + 2), line, font=font_title, fill=gold_sh)
        # Nền vàng
        draw.text((tx, title_y), line, font=font_title, fill=gold)
        # Vệt sáng đỉnh chữ (Highlights)
        draw.text((tx, title_y - 1), line, font=font_title, fill=gold_hi)
        title_y += line_h

    # Kẻ chỉ vàng kép dưới tiêu đề
    title_y += 18
    draw.line((W // 2 - 140, title_y, W // 2 + 140, title_y), fill=gold, width=2)
    draw.line((W // 2 - 90, title_y + 4, W // 2 + 90, title_y + 4), fill=gold_sh, width=1)
    # Kim cương trung tâm
    draw.polygon([(W // 2, title_y - 6), (W // 2 + 6, title_y), (W // 2, title_y + 6), (W // 2 - 6, title_y)], fill=gold_hi)

    # 7. PHỤ ĐỀ (SUBTITLE): TIMES NEW ROMAN ITALIC
    font_sub = ImageFont.truetype(FONT_SERIF_I, 21)
    sub_words = cfg['subtitle'].split(' ')
    sub_lines = []
    curr = ""
    for w in sub_words:
        test = (curr + " " + w).strip()
        if draw.textbbox((0, 0), test, font=font_sub)[2] > W - 180:
            sub_lines.append(curr)
            curr = w
        else:
            curr = test
    if curr:
        sub_lines.append(curr)

    sub_y = title_y + 32
    for s_line in sub_lines:
        s_w = draw.textbbox((0, 0), s_line, font=font_sub)[2]
        draw.text(((W - s_w) // 2, sub_y), s_line, font=font_sub, fill=(240, 245, 255))
        sub_y += 30

    # 8. CON DẤU CHỨNG NHẬN CHUYÊN SÂU
    seal_cy = sub_y + 70
    draw.ellipse((W // 2 - 46, seal_cy - 46, W // 2 + 46, seal_cy + 46), outline=gold_sh, width=1)
    draw.ellipse((W // 2 - 42, seal_cy - 42, W // 2 + 42, seal_cy + 42), outline=gold, width=2)
    font_seal1 = ImageFont.truetype(FONT_SANS_B, 11)
    font_seal2 = ImageFont.truetype(FONT_SANS_B, 10)
    s1 = "CHUẨN Y KHOA"
    s2 = "★ CHUYÊN SÂU ★"
    w1 = draw.textbbox((0, 0), s1, font=font_seal1)[2]
    w2 = draw.textbbox((0, 0), s2, font=font_seal2)[2]
    draw.text(((W - w1) // 2, seal_cy - 14), s1, font=font_seal1, fill=gold_hi)
    draw.text(((W - w2) // 2, seal_cy + 4), s2, font=font_seal2, fill=(255, 255, 255))

    # 9. CHÂN BÌA: TÁC GIẢ & NHÀ XUẤT BẢN
    font_auth = ImageFont.truetype(FONT_SANS_B, 22)
    font_pub = ImageFont.truetype(FONT_SANS, 13)

    auth_str = f"TÁC GIẢ: {cfg['author']}"
    a_w = draw.textbbox((0, 0), auth_str, font=font_auth)[2]
    # Bóng tác giả
    draw.text(((W - a_w) // 2 + 1, H - 150 + 1), auth_str, font=font_auth, fill=(0, 0, 0))
    draw.text(((W - a_w) // 2, H - 150), auth_str, font=font_auth, fill=gold_hi)

    # Đường chỉ ngăn cách
    draw.line((W // 2 - 160, H - 116, W // 2 + 160, H - 116), fill=gold, width=1)

    pub_str = "QBIZ MEDICAL PUBLISHING · TỦ SÁCH CHĂM SÓC SỨC KHỎE CHỦ ĐỘNG"
    p_w = draw.textbbox((0, 0), pub_str, font=font_pub)[2]
    draw.text(((W - p_w) // 2, H - 98), pub_str, font=font_pub, fill=(195, 210, 235))

    # Lưu file
    out_path = os.path.join(OUTPUT_DIR, cfg['filename'])
    img.save(out_path, 'PNG', quality=95)
    print(f"✓ Đã tạo bìa sách chuyên nghiệp: {cfg['filename']} (800x1120)")

def main():
    print("==================================================================")
    print("  BẮT ĐẦU TẠO 7 BÌA SÁCH THẬT CHUẨN VIỆT HOÁ & ĐẲNG CẤP Y KHOA")
    print("==================================================================\n")
    for cfg in COVERS_CONFIG:
        generate_cover(cfg)
    print("\n🎉 HOÀN TẤT TẠO TOÀN BỘ 7 BÌA SÁCH THẬT!")

if __name__ == '__main__':
    main()

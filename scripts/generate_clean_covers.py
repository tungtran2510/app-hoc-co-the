import os
import sys
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = r"d:\app-hoc-co-the\public\documents\covers"
os.makedirs(OUTPUT_DIR, exist_ok=True)
W, H = 800, 1120

configs = [
    {
        'filename': 'clean_cover_navy.png',
        'c_dark': (10, 18, 38),
        'c_light': (20, 42, 85),
        'gold': (245, 215, 110),
        'gold_hi': (255, 245, 195),
        'gold_sh': (60, 42, 10),
    },
    {
        'filename': 'clean_cover_emerald.png',
        'c_dark': (4, 38, 28),
        'c_light': (12, 68, 50),
        'gold': (250, 222, 120),
        'gold_hi': (255, 248, 205),
        'gold_sh': (45, 40, 12),
    },
    {
        'filename': 'clean_cover_burgundy.png',
        'c_dark': (50, 12, 20),
        'c_light': (95, 24, 38),
        'gold': (255, 220, 128),
        'gold_hi': (255, 248, 210),
        'gold_sh': (60, 25, 15),
    },
    {
        'filename': 'clean_cover_slate.png',
        'c_dark': (14, 20, 32),
        'c_light': (28, 42, 66),
        'gold': (248, 220, 115),
        'gold_hi': (255, 245, 200),
        'gold_sh': (50, 40, 15),
    },
    {
        'filename': 'clean_cover_pure_frame.png',
        'c_dark': (10, 16, 32),
        'c_light': (18, 34, 68),
        'gold': (240, 210, 105),
        'gold_hi': (255, 245, 190),
        'gold_sh': (50, 38, 10),
    }
]

for cfg in configs:
    img = Image.new('RGB', (W, H))
    draw = ImageDraw.Draw(img)
    c_dark = cfg['c_dark']
    c_light = cfg['c_light']
    gold = cfg['gold']
    gold_hi = cfg['gold_hi']
    gold_sh = cfg['gold_sh']

    cx_center, cy_center = W // 2, int(H * 0.42)
    max_dist = math.sqrt((W // 2)**2 + (H * 0.58)**2)

    for y in range(H):
        for x in range(0, W, 2):
            dx = x - cx_center
            dy = y - cy_center
            dist = math.sqrt(dx*dx + dy*dy)
            factor = min(1.0, dist / max_dist)
            factor = factor ** 1.3
            r = int(c_light[0] * (1 - factor) + c_dark[0] * factor)
            g = int(c_light[1] * (1 - factor) + c_dark[1] * factor)
            b = int(c_light[2] * (1 - factor) + c_dark[2] * factor)
            draw.point((x, y), fill=(r, g, b))
            draw.point((x + 1, y), fill=(r, g, b))

    # Gáy sách 3D bên trái
    for x in range(22):
        hl = int(120 * (1 - abs(x - 9) / 10.0)) if abs(x - 9) < 10 else 0
        draw.line((x, 0, x, H), fill=(hl, hl, hl + 20))
    for x in range(22, 36):
        cr = int(50 * (1 - (x - 22) / 14.0))
        draw.line((x, 0, x, H), fill=(0, 0, 0))

    # Viền vàng kim kép
    m1 = 40
    draw.rectangle((m1, m1, W - m1, H - m1), outline=gold, width=3)
    m2 = 50
    draw.rectangle((m2, m2, W - m2, H - m2), outline=gold_sh, width=1)

    # 4 góc hoàng gia
    c_len = 24
    for xc, yc, dx, dy in [(m2, m2, 1, 1), (W - m2, m2, -1, 1), (m2, H - m2, 1, -1), (W - m2, H - m2, -1, -1)]:
        draw.line((xc, yc + dy*4, xc + dx*c_len, yc + dy*4), fill=gold_hi, width=2)
        draw.line((xc + dx*4, yc, xc + dx*4, yc + dy*c_len), fill=gold_hi, width=2)
        draw.rectangle((xc - 3, yc - 3, xc + 3, yc + 3), fill=gold_hi)

    # Họa tiết đỉnh đầu tinh tế
    draw.line((W // 2 - 120, 110, W // 2 + 120, 110), fill=gold, width=1)
    draw.polygon([(W // 2, 106), (W // 2 + 5, 110), (W // 2, 114), (W // 2 - 5, 110)], fill=gold_hi)

    out_file = os.path.join(OUTPUT_DIR, cfg['filename'])
    img.save(out_file, format='PNG', quality=95)
    print(f"Generated clean cover: {cfg['filename']}")

print("All 5 clean luxury covers generated successfully!")

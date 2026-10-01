import os
import cv2
import numpy as np
from PIL import Image

SRC_DIR = 'public/images/topics'
OUT_DIR = 'public/images/topics_transparent'
os.makedirs(OUT_DIR, exist_ok=True)

files = [
    'cot-song.png',
    'dinh-duong.png',
    'nuoc.png',
    'tieu-hoa.png',
    'co-the-nguoi.png',
    'noi-tiet-chuyen-hoa.png',
    'gan-mat-tuy.png',
    'mien-dich.png'
]

for filename in files:
    src_path = os.path.join(SRC_DIR, filename)
    img_bgr = cv2.imread(src_path)
    if img_bgr is None:
        print(f"Cannot read {src_path}")
        continue
    
    # img is 1024x1024
    h, w, _ = img_bgr.shape
    
    # Convert to grayscale
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
    # Threshold dark background (exterior black)
    # Most exterior pixels are < 15
    # We do a floodfill from corners to only remove background, not dark spots inside organ
    mask = np.zeros((h + 2, w + 2), np.uint8)
    
    # FloodFill from all 4 corners and midpoints of edges
    seed_points = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)
    ]
    
    bg_mask = np.zeros((h, w), np.uint8)
    for pt in seed_points:
        if gray[pt[1], pt[0]] < 30:
            # floodfill in copy of gray
            cv2.floodFill(gray.copy(), mask, pt, 255, loDiff=15, upDiff=15, flags=4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8))
            
    # mask has 1-pixel border, extract center
    bg_detected = mask[1:h+1, 1:w+1]
    
    # In addition, for glowy or soft black edges, calculate continuous alpha
    # Lum = max(B, G, R)
    max_c = np.max(img_bgr, axis=2).astype(float)
    
    # For pixels detected as background or very dark:
    # Alpha = 0 if max_c <= 8
    # Alpha ramps up smoothly from 8 to 45
    alpha = np.clip((max_c - 6.0) / 38.0 * 255.0, 0, 255).astype(np.uint8)
    
    # Combine with floodfill mask: if not in floodfill background and max_c > 20, keep high alpha
    # Where bg was definitely found, enforce smooth alpha
    # Convert BGR to RGBA
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    rgba = np.dstack((img_rgb, alpha))
    
    # Find bounding box where alpha > 10
    non_zero = np.where(alpha > 12)
    if len(non_zero[0]) > 0:
        min_y, max_y = np.min(non_zero[0]), np.max(non_zero[0])
        min_x, max_x = np.min(non_zero[1]), np.max(non_zero[1])
        # Add 4px padding safely
        min_y = max(0, min_y - 4)
        min_x = max(0, min_x - 4)
        max_y = min(h, max_y + 4)
        max_x = min(w, max_x + 4)
        cropped_rgba = rgba[min_y:max_y, min_x:max_x]
    else:
        cropped_rgba = rgba
        
    out_im = Image.fromarray(cropped_rgba, 'RGBA')
    out_path = os.path.join(OUT_DIR, filename)
    out_im.save(out_path, format='PNG', optimize=True)
    print(f"Saved {filename}: cropped from (1024, 1024) to {out_im.size}")

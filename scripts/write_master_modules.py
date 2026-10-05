import os, sys, shutil

sys.stdout.reconfigure(encoding='utf-8')

GDRIVE_DIR = r'D:\google driver\Tài liệu\cho AI đọc'
NHAP_DIR = os.path.join(GDRIVE_DIR, 'nháp')
DOCX_PDF_DIR = os.path.join(GDRIVE_DIR, 'file pdf, doc')
LOCAL_KNOWLEDGE_DIR = r'd:\app-hoc-co-the\data\knowledge'

# Helper to read file from nhap
def read_nhap_file(filename):
    p = os.path.join(NHAP_DIR, filename)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

# Load extracted texts
full_dd_path = r'd:\app-hoc-co-the\scripts\dinh_duong_chuyen_sau_full.md'
with open(full_dd_path, 'r', encoding='utf-8') as f:
    full_dd_lines = f.readlines()

def get_slice(start_idx, end_idx):
    return "".join(full_dd_lines[start_idx:end_idx]).strip()

magie_text = get_slice(0, 1018)
protein_text = get_slice(1018, 3396)
kem_text = get_slice(3396, 3609)
canxi_text = get_slice(3609, 3883)
sat_text = get_slice(3883, 4117)
carb_text = get_slice(4117, 4588)

# Fat & Omega-3
fat_full = get_slice(4588, 5666)
# Split fat vs omega-3 rating
omega_split_idx = fat_full.find("TIÊU CHÍ CHUẨN LỰA CHỌN OMEGA-3")
if omega_split_idx != -1:
    fat_text = fat_full[:omega_split_idx].strip()
    omega_text = fat_full[omega_split_idx:].strip()
else:
    fat_text = fat_full
    omega_text = ""

vitc_text = get_slice(5666, 6128)
vitb_text = get_slice(6128, 6792)
vitd_text = get_slice(6792, 7090)
vita_text = get_slice(7090, 7185)
vite_text = get_slice(7185, 7280)
vitk_text = get_slice(7280, 7839)
bioactive_no_text = get_slice(7839, 9745)
autophagy_text = get_slice(9745, 11041)
fasting_text = get_slice(11041, 12112)
clean_gut_text = get_slice(12112, len(full_dd_lines))

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from extract_docx import docx_to_markdown
chat_dd_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Chất dinh dưỡng.docx'))
loi_thoai_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Lời thoại Tiêu hóa.docx'))
dao_tao_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Đào tạo dinh dưỡng.docx'))

print("Đang biên soạn 9 Chuyên đề Khổng lồ...")

modules = {}

# MODULE 1
modules['01_DA_LUONG_VA_CHUYEN_HOA_NANG_LUONG.md'] = f"""# CHUYÊN ĐỀ 01: CHUYỂN HÓA ĐA LƯỢNG (PROTEIN, CARBOHYDRATE, LIPID) & NĂNG LƯỢNG TẾ BÀO
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Đạm (Protein), Đường bột (Carbohydrate), Chất béo (Lipid), Ngưỡng Leucine, Tinh bột kháng RS3, Quá trình đốt mỡ Beta-Oxidation và Dấu hiệu Thừa - Thiếu lâm sàng.

---

## PHẦN I: CHUYỂN HÓA ĐẠM (PROTEIN) TOÀN DIỆN

{protein_text}

---

## PHẦN II: CHUYỂN HÓA ĐƯỜNG BỘT (CARBOHYDRATE) TOÀN DIỆN

{carb_text}

---

## PHẦN III: CHUYỂN HÓA CHẤT BÉO (LIPID) & NĂNG LƯỢNG

{fat_text}
"""

# MODULE 2
modules['02_BACH_KHOA_VITAMIN_TOAN_DIEN.md'] = f"""# CHUYÊN ĐỀ 02: BÁCH KHOA TOÀN THƯ 13 VITAMIN THIẾT YẾU (A, B-COMPLEX, C, D, E, K)
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Toàn bộ 13 Vitamin thiết yếu, cơ chế sinh hóa, biểu hiện thiếu theo thời gian (ngắn - trung - dài hạn), hệ quả khi thừa, liều dùng khuyến nghị, thực phẩm giàu và dạng bổ sung có sinh khả dụng cao nhất.

---

## 1. VITAMIN A (RETINOL & BETA-CAROTENE)
{vita_text}

---

## 2. VITAMIN D (D3 CHOLECALCIFEROL)
{vitd_text}

---

## 3. VITAMIN E (ALPHA-TOCOPHEROL)
{vite_text}

---

## 4. VITAMIN K (K1 & K2 MK-7)
{vitk_text}

---

## 5. VITAMIN C (AXIT ASCORBIC)
{vitc_text}

---

## 6. PHỨC HỢP 8 VITAMIN NHÓM B (B-COMPLEX: B1, B2, B3, B5, B6, B7, B9, B12)
{vitb_text}
"""

# MODULE 3
modules['03_BACH_KHOA_KHOANG_CHAT_VI_KHOANG.md'] = f"""# CHUYÊN ĐỀ 03: BÁCH KHOA TOÀN THƯ KHOÁNG CHẤT & VI KHOÁNG THIẾT YẾU
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Magie, Canxi, Sắt, Kẽm, Đồng, Kali, Natri, I-ốt, Selen; Tương tác cạnh tranh Kẽm vs Đồng, Bộ hiệp trợ Canxi - Magie - D3 - K2, Cân bằng bơm Na+/K+ và Bảng tra thực phẩm giàu khoáng chất.

---

## 1. MAGIE (Mg) – KHOÁNG CHẤT NỀN TẢNG THẦN KINH CƠ & NĂNG LƯỢNG
{magie_text}

---

## 2. CANXI (Ca) – TRỤ CỘT XƯƠNG KHỚP & DẪN TRUYỀN TẾ BÀO
{canxi_text}

---

## 3. SẮT (Fe) – TẠO MÁU, VẬN CHUYỂN OXY & NÃO BỘ
{sat_text}

---

## 4. KẼM (Zn) – TĂNG TRƯỞNG, MIỄN DỊCH & LÀNH TỔN THƯƠNG
{kem_text}

---

## 5. TƯƠNG TÁC ĐỒNG VÀ BỘ VI KHOÁNG HIỆP TRỢ LÂM SÀNG
- **Kẽm (Zn) vs Đồng (Cu):** Kẽm liều cao >50mg/ngày cạnh tranh protein Metallothionein làm đào thải Đồng -> Gây thiếu máu nhược sắc thứ phát và giảm bạch cầu trung tính.
- **Bộ 4 hiệp trợ xương Ca - Mg - D3 - K2 (MK-7):** Canxi tạo cốt, Magie hoạt hóa Vitamin D và kích thích Calcitonin, D3 tăng hấp thu Canxi từ ruột, K2 kích hoạt Osteocalcin gắn Canxi vào màng xương và ức chế protein MGP ngăn vôi hóa động mạch.
- **Kali (K) & Natri (Na):** Cân bằng điện giải nội bào và ngoại bào. Ăn mặn thừa Natri làm tăng huyết áp và phù nề; Kali giúp làm giãn mạch máu, hạ huyết áp tự nhiên và chống loạn nhịp tim.
"""

# MODULE 4
modules['04_HOAT_CHAT_SINH_HOC_NO_THANH_MACH_OMEGA3.md'] = f"""# CHUYÊN ĐỀ 04: HOẠT CHẤT SINH HỌC (BIOACTIVE), OXIT NITRIC (NO), SỨC KHỎE THÀNH MẠCH & BỘ TIÊU CHUẨN OMEGA-3
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Hoạt chất sinh học (Polyphenol, Flavonoid, Anthocyanin), Oxit Nitric (NO), Sức khỏe lớp nội mạc mạch máu, Tiêu chuẩn chọn Omega-3 chuẩn Y khoa và Bảng chấm điểm 100 điểm.

---

## PHẦN I: HOẠT CHẤT SINH HỌC, NO & BẢO VỆ THÀNH MẠCH
{bioactive_no_text}

---

## PHẦN II: TIÊU CHUẨN CHỌN OMEGA-3 CHUẨN Y KHOA & BẢNG CHẤM ĐIỂM
{omega_text}
"""

# MODULE 5
old_gi_1 = read_nhap_file('07-GI-Giai-Phau-Va-Sinh-Ly-Ong-Tieu-Hoa.md')
old_gi_2 = read_nhap_file('08-GI-Bo-Ba-Gan-Mat-Tuy-Va-Con-Duong-Hap-Thu.md')
old_gi_3 = read_nhap_file('10-GI-Benh-Hoc-Tieu-Hoa-GERD-IBS-Hp-Mat.md')
old_gi_4 = read_nhap_file('11-GI-Microbiome-Probiotics-Chuan-Chung-Lam-Sang.md')

modules['05_HE_TIEU_HOA_BENH_HOC_VA_LAM_SACH_RUOT.md'] = f"""# CHUYÊN ĐỀ 05: HỆ TIÊU HÓA, BỆNH HỌC LÂM SÀNG & QUY TRÌNH LÀM SẠCH ĐƯỜNG RUỘT 4 TUẦN
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Giải phẫu sinh lý ống tiêu hóa, Bộ ba Gan - Mật - Tụy, Trào ngược dạ dày GERD, Viêm loét Hp, Ruột kích thích IBS, Sau cắt túi mật, Hệ vi sinh Microbiome và Quy trình làm sạch đường ruột khoa học.

---

## PHẦN I: GIẢI PHẪU & SINH LÝ ỐNG TIÊU HÓA
{old_gi_1}

---

## PHẦN II: BỘ BA GAN - MẬT - TỤY VÀ HẤP THU
{old_gi_2}

---

## PHẦN III: BỆNH HỌC TIÊU HÓA CHUYÊN SÂU (GERD, HP, RUỘT KÍCH THÍCH IBS, HỘI CHỨNG SAU CẮT TÚI MẬT)
{old_gi_3}

---

## PHẦN IV: HỆ VI SINH VẬT ĐƯỜNG RUỘT (MICROBIOME) & PROBIOTICS CHUẨN CHỦNG
{old_gi_4}

---

## PHẦN V: QUY TRÌNH LÀM SẠCH ĐƯỜNG RUỘT 4 TUẦN KHOA HỌC
{clean_gut_text}
"""

# MODULE 6
modules['06_LOI_THOAI_TU_VAN_THUC_CHIEN_TIEU_HOA.md'] = f"""# CHUYÊN ĐỀ 06: LỜI THOẠI & KỊCH BẢN TƯ VẤN THỰC CHIẾN TIÊU HÓA - TÁC GIẢ TÙNG DINH DƯỠNG
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Kịch bản lời thoại thực chiến, giải thích 5 lý do cốt lõi vì sao người bệnh tiêu hóa chữa mãi không dứt, kỹ năng tư vấn chạm đến tâm lý và phương pháp đồng hành cùng người bệnh.

---

## PHẦN I: LỜI THOẠI TIÊU HÓA THỰC CHIẾN
{loi_thoai_text}

---

## PHẦN II: KHUNG ĐÀO TẠO & GIẢI QUYẾT BỆNH LÝ
{dao_tao_text}
"""

# MODULE 7
old_nutr_plate = read_nhap_file('15-NUTR-Thiet-Ke-Bua-An-Va-Thuc-Pham-Viet-Nam.md')

modules['07_THIET_KE_BUA_AN_NHIN_AN_16_8_AUTOPHAGY.md'] = f"""# CHUYÊN ĐỀ 07: THIẾT KẾ BỮA ĂN Y SINH HỌC, NHỊN ĂN GIÁN ĐOẠN 16/8 & TỰ THỰC BÀO (AUTOPHAGY)
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Mô hình đĩa ăn 1/2 - 1/4 - 1/4, Trình tự ăn hạ đường huyết (Meal Sequencing), Nhịn ăn 16/8 chuẩn 12 tuần, 10 mẫu thực đơn theo ca bệnh và Phác đồ kích hoạt tự thực bào (Autophagy) 4 tuần.

---

## PHẦN I: THIẾT KẾ BỮA ĂN CHUẨN Y SINH & TRÌNH TỰ ĂN
{old_nutr_plate}

---

## PHẦN II: NHỊN ĂN GIÁN ĐOẠN 16/8 CHUẨN KHOA HỌC & CÁCH THIẾT KẾ BỮA ĂN
{fasting_text}

---

## PHẦN III: CƠ CHẾ TỰ THỰC BÀO (AUTOPHAGY) & PHÁC ĐỒ 4 TUẦN
{autophagy_text}
"""

# MODULE 8
old_msk_1 = read_nhap_file('01-MSK-Giai-Phau-Sinh-Ly-Cot-Song-Co-That-Lung.md')
old_msk_2 = read_nhap_file('02-MSK-Sinh-Ly-Truc-Chau-Cung-Va-Khung-Chiu-Luc.md')
old_msk_3 = read_nhap_file('03-MSK-Co-Che-Benh-Sinh-Va-Ban-Do-Re-Than-Kinh.md')
old_msk_4 = read_nhap_file('04-MSK-Chan-Doan-Phan-Biet-Va-Dau-Hieu-Co-Do.md')
old_imm_1 = read_nhap_file('18-IMM-He-Thong-Mien-Dich-Bam-Sinh-Va-Thich-Ung.md')
old_water = read_nhap_file('20-IMM-Thuy-Hop-Sinh-Hoc-Nuoc-Va-Governance-OS.md')
old_water_bio = read_nhap_file('y-sinh-hoc-nuoc-va-doc-hoc-nguon-nuoc.md')

modules['08_COT_SONG_CO_XUONG_KHOP_MIEN_DICH_VA_NUOC.md'] = f"""# CHUYÊN ĐỀ 08: CỘT SỐNG, CƠ SINH HỌC KHUNG CHẬU, HỆ MIỄN DỊCH & Y SINH HỌC NƯỚC
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** Giải phẫu và cơ sinh học cột sống, đĩa đệm L4-L5, cơ sinh học khung chậu, dấu hiệu cờ đỏ, nguyên tắc tư thế chuẩn 24/7, hệ thống miễn dịch bẩm sinh và thích ứng, y sinh học nước và điện giải tế bào.

---

## PHẦN I: GIẢI PHẪU & SINH LÝ CỘT SỐNG THẮT LƯNG, ĐĨA ĐỆM
{old_msk_1}

---

## PHẦN II: CƠ SINH HỌC TRỤC CHẬU - CÙNG VÀ KHUNG CHỊU LỰC
{old_msk_2}

---

## PHẦN III: CƠ CHẾ BỆNH SINH THOÁT VỊ ĐĨA ĐỆM & BẢN ĐỒ RỄ THẦN KINH
{old_msk_3}

---

## PHẦN IV: CHẨN ĐOÁN PHÂN BIỆT & DẤU HIỆU CỜ ĐỎ
{old_msk_4}

---

## PHẦN V: HỆ THỐNG MIỄN DỊCH BẨM SINH VÀ THÍCH ỨNG
{old_imm_1}

---

## PHẦN VI: Y SINH HỌC VỀ NƯỚC, ĐIỆN GIẢI & HYDRAT HÓA TẾ BÀO
{old_water}

{old_water_bio}
"""

# MODULE 9
modules['09_BANG_THANH_PHAN_100G_THUC_PHAM_VIET_NAM.md'] = f"""# CHUYÊN ĐỀ 09: BẢNG THÀNH PHẦN DINH DƯỠNG 100G THỰC PHẨM BẢN ĐỊA VIỆT NAM
> **Nguồn tri thức:** Tác giả Tùng Dinh Dưỡng - Tủ Sách Y Khoa Qbiz Books.
> **Phạm vi:** 29 bảng dữ liệu hàm lượng dinh dưỡng tính theo 100g phần ăn được: Rau lá xanh, Củ quả, Quả chín, Đậu đỗ, Hạt dinh dưỡng, Ngũ cốc, Thịt gia súc gia cầm, Cá sông cá biển, Trứng, Thảo mộc và Gia vị kháng sinh tự nhiên.

---

{chat_dd_text}
"""

print(f"Tổng số Module biên soạn: {len(modules)}")

# Write to both GDRIVE_DIR and LOCAL_KNOWLEDGE_DIR
for fname, content in modules.items():
    gdrive_dest = os.path.join(GDRIVE_DIR, fname)
    local_dest = os.path.join(LOCAL_KNOWLEDGE_DIR, fname)
    
    with open(gdrive_dest, 'w', encoding='utf-8') as f:
        f.write(content)
        
    with open(local_dest, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"✓ Đã xuất module: {fname} ({len(content):,} ký tự)")

print("\nHOÀN THÀNH TẤT CẢ 9 MODULE KHỔNG LỒ!")

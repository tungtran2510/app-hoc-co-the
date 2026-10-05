import os, sys, re, docx
from extract_docx import docx_to_markdown

sys.stdout.reconfigure(encoding='utf-8')

GDRIVE_DIR = r'D:\google driver\Tài liệu\cho AI đọc'
NHAP_DIR = os.path.join(GDRIVE_DIR, 'nháp')
DOCX_PDF_DIR = os.path.join(GDRIVE_DIR, 'file pdf, doc')
LOCAL_KNOWLEDGE_DIR = r'd:\app-hoc-co-the\data\knowledge'

# Load full extracted text from Dinh duong chuyen sau
full_dd_path = r'd:\app-hoc-co-the\scripts\dinh_duong_chuyen_sau_full.md'
if not os.path.exists(full_dd_path):
    print("Extracting Dinh duong chuyen sau docx...")
    dd_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Dinh dưỡng chuyên sâu.docx'))
    with open(full_dd_path, 'w', encoding='utf-8') as f:
        f.write(dd_text)
else:
    with open(full_dd_path, 'r', encoding='utf-8') as f:
        dd_text = f.read()

# Extract Chat dinh duong docx (tables)
chat_dd_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Chất dinh dưỡng.docx'))

# Extract Loi thoai Tieu hoa docx
loi_thoai_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Lời thoại Tiêu hóa.docx'))

# Extract Dao tao dinh duong docx
dao_tao_text = docx_to_markdown(os.path.join(DOCX_PDF_DIR, 'Đào tạo dinh dưỡng.docx'))

print("Đã tải xong toàn bộ dữ liệu nguồn từ các file Word và PDF.")
print(f"  - Dinh dưỡng chuyên sâu: {len(dd_text)} ký tự")
print(f"  - Bảng thành phần thực phẩm: {len(chat_dd_text)} ký tự")
print(f"  - Lời thoại tiêu hóa: {len(loi_thoai_text)} ký tự")
print(f"  - Đào tạo dinh dưỡng: {len(dao_tao_text)} ký tự")

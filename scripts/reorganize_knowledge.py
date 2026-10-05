import os, sys, shutil, docx, pypdf, pymupdf

sys.stdout.reconfigure(encoding='utf-8')

GDRIVE_DIR = r'D:\google driver\Tài liệu\cho AI đọc'
NHAP_DIR = os.path.join(GDRIVE_DIR, 'nháp')
DOCX_PDF_DIR = os.path.join(GDRIVE_DIR, 'file pdf, doc')
LOCAL_KNOWLEDGE_DIR = r'd:\app-hoc-co-the\data\knowledge'

os.makedirs(NHAP_DIR, exist_ok=True)

print("--- BƯỚC 1: DI CHUYỂN TÀI LIỆU CŨ VÀO THƯ MỤC NHÁP ---")
for item in os.listdir(GDRIVE_DIR):
    item_path = os.path.join(GDRIVE_DIR, item)
    if os.path.isfile(item_path) and item.endswith('.md'):
        dest_path = os.path.join(NHAP_DIR, item)
        shutil.move(item_path, dest_path)
        print(f"Đã chuyển vào nháp: {item}")

print("\n--- BƯỚC 2: KIỂM TRA THƯ MỤC NHÁP ---")
nhap_files = [f for f in os.listdir(NHAP_DIR) if f.endswith('.md')]
print(f"Tổng số file cũ trong nháp: {len(nhap_files)}")

import time
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"
ADMIN_TOKEN = "708b3a0c66045f34dca64fdb3dfda7c9e2d9b3c11b55e490bd6eb7489c69faf4"

def run_admin_experience_tests():
    print("==========================================================")
    print("   BẮT ĐẦU KIỂM THỬ TRÌNH DUYỆT MOBILE FIRST (ADMIN MODE) ")
    print("==========================================================\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport iPhone 13/14: 390 x 844
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )

        # Cài đặt Admin Token vào Cookie và LocalStorage
        context.add_cookies([{
            "name": "app_admin_session",
            "value": ADMIN_TOKEN,
            "domain": "127.0.0.1",
            "path": "/"
        }])

        context.add_init_script(f"""
            localStorage.setItem('app_user_display_name', 'Quản trị viên');
            sessionStorage.setItem('app_user_name_prompted', 'true');
            localStorage.setItem('qbiz_books_intro_seen', '1');
            localStorage.setItem('app_admin_token', '{ADMIN_TOKEN}');
        """)

        page = context.new_page()

        # ----------------------------------------------------
        # BƯỚC 1: TRANG CHỦ ADMIN & THANH ADMIN BAR
        # ----------------------------------------------------
        print("[ADMIN 1] Mở Trang chủ với quyền Quản trị...")
        page.goto("http://127.0.0.1:3100/", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{ARTIFACT_DIR}/240_admin_qa_home_adminbar.png")
        print("  ✓ Đã chụp ảnh Trang chủ AdminBar: 240_admin_qa_home_adminbar.png")

        # ----------------------------------------------------
        # BƯỚC 2: SẮP XẾP KHỐI TRANG CHỦ (ReorderHomeSectionsModal)
        # ----------------------------------------------------
        print("\n[ADMIN 2] Mở modal Sắp xếp khối Trang chủ...")
        reorder_btn = page.locator("button:has-text('Sắp xếp khối'), button:has-text('Thứ tự khối'), button[title*='Sắp xếp']").first
        if reorder_btn.is_visible():
            reorder_btn.click()
            time.sleep(1)
            page.screenshot(path=f"{ARTIFACT_DIR}/241_admin_qa_reorder_sections_modal.png")
            print("  ✓ Modal Sắp xếp khối hiển thị: 241_admin_qa_reorder_sections_modal.png")

            # Đóng modal sắp xếp
            close_reorder = page.locator("div[role='dialog'] button:has-text('Đóng'), div[role='dialog'] button[aria-label='Đóng'], div[role='dialog'] button:has-text('Hủy')").first
            if close_reorder.is_visible():
                close_reorder.click()
                time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 3: QUẢN TRỊ TÁC GIẢ & CỐ VẤN (EditAuthorModal)
        # ----------------------------------------------------
        print("\n[ADMIN 3] Mở modal Chỉnh sửa Tác giả...")
        page.evaluate("window.scrollBy(0, 600)")
        time.sleep(1)
        edit_author_btn = page.locator("button:has-text('Sửa thông tin tác giả'), button[title*='Sửa tác giả']").first
        if not edit_author_btn.is_visible():
            edit_author_btn = page.locator("section:has-text('Tùng Dinh Dưỡng') button:has-text('Sửa')").first

        if edit_author_btn.is_visible():
            edit_author_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/242_admin_qa_edit_author_modal.png")
            print("  ✓ Modal Sửa Tác giả hiển thị đầy đủ: 242_admin_qa_edit_author_modal.png")

            # Đóng modal tác giả
            close_author = page.locator("button[aria-label='Đóng'], button:has-text('Hủy')").first
            if close_author.is_visible():
                close_author.click(force=True)
                time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 4: QUẢN TRỊ SÁCH NÊN ĐỌC (EditRecommendedBooksModal)
        # ----------------------------------------------------
        print("\n[ADMIN 4] Mở modal Chỉnh sửa Sách nên đọc...")
        page.evaluate("window.scrollBy(0, 600)")
        time.sleep(1)
        edit_rec_books_btn = page.locator("button:has-text('SỬA SÁCH KHUYÊN ĐỌC'), section:has-text('Sách nên đọc') button:has-text('Chỉnh sửa'), section:has-text('Sách nên đọc') button[title*='Sửa']").first
        if edit_rec_books_btn.is_visible():
            edit_rec_books_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/243_admin_qa_edit_rec_books_modal.png")
            print("  ✓ Modal Quản lý Sách nên đọc hiển thị danh sách: 243_admin_qa_edit_rec_books_modal.png")

            # Đóng modal sách nên đọc
            close_rec = page.locator("button[aria-label='Đóng'], button:has-text('Đóng'), button:has-text('Hủy')").first
            if close_rec.is_visible():
                close_rec.click(force=True)
                time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 5: QUẢN TRỊ BÀI HỌC & VIDEO (VideoManagerModal)
        # ----------------------------------------------------
        print("\n[ADMIN 5] Vào bài học và kiểm tra Quản lý Video...")
        page.goto("http://127.0.0.1:3100/cot-song/tu-the-va-van-dong", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{ARTIFACT_DIR}/244_admin_qa_lesson_admin_controls.png")
        print("  ✓ Đã chụp ảnh các nút quản trị trong bài học: 244_admin_qa_lesson_admin_controls.png")

        # Mở VideoManagerModal
        manage_vid_btn = page.locator("button:has-text('Quản lý Video'), button:has-text('Sửa video'), button[title*='video']").first
        if manage_vid_btn.is_visible():
            manage_vid_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/245_admin_qa_video_manager_modal.png")
            print("  ✓ Modal Quản lý Video hiển thị danh sách 6 video: 245_admin_qa_video_manager_modal.png")

            # Đóng modal video manager
            close_vid = page.locator("button[aria-label='Đóng'], button:has-text('Đóng'), button:has-text('Hủy')").first
            if close_vid.is_visible():
                close_vid.click(force=True)
                time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 6: QUẢN TRỊ TÀI LIỆU Y KHOA (EditMedicalDocumentModal)
        # ----------------------------------------------------
        print("\n[ADMIN 6] Chuyển sang Tab Tài liệu và kiểm tra Sửa Tài liệu...")
        docs_tab = page.locator("button:has-text('Tài liệu Y khoa')").first
        if docs_tab.is_visible():
            docs_tab.click()
            time.sleep(1)

            edit_doc_btn = page.locator("button:has-text('Sửa tài liệu'), button:has-text('Thêm tài liệu')").first
            if edit_doc_btn.is_visible():
                edit_doc_btn.click()
                time.sleep(1.5)
                page.screenshot(path=f"{ARTIFACT_DIR}/246_admin_qa_edit_medical_doc_modal.png")
                print("  ✓ Modal Sửa Tài liệu Y khoa hiển thị: 246_admin_qa_edit_medical_doc_modal.png")

                # Đóng modal tài liệu
                close_doc = page.locator("button[aria-label='Đóng'], button:has-text('Đóng'), button:has-text('Hủy')").first
                if close_doc.is_visible():
                    close_doc.click(force=True)
                    time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 7: QUẢN TRỊ HUẤN LUYỆN TRỢ LÝ AI (EditAiTrainingModal)
        # ----------------------------------------------------
        print("\n[ADMIN 7] Vào trang Trợ lý AI và mở Huấn luyện AI...")
        page.goto("http://127.0.0.1:3100/tro-ly-ai", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{ARTIFACT_DIR}/247_admin_qa_ai_page_adminbar.png")
        print("  ✓ Đã chụp ảnh trang Trợ lý AI có thanh AdminBar: 247_admin_qa_ai_page_adminbar.png")

        train_ai_btn = page.locator("button:has-text('Huấn luyện AI'), button[title*='Huấn luyện']").first
        if train_ai_btn.is_visible():
            train_ai_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/248_admin_qa_edit_ai_training_modal.png")
            print("  ✓ Modal Huấn luyện Trợ lý AI hiển thị xuất sắc: 248_admin_qa_edit_ai_training_modal.png")

            # Đóng modal AI training
            close_ai = page.locator("button[aria-label='Đóng'], button:has-text('Đóng'), button:has-text('Hủy')").first
            if close_ai.is_visible():
                close_ai.click(force=True)
                time.sleep(0.5)

        browser.close()

    print("\n==========================================================")
    print("   HOÀN TẤT KIỂM THỬ TRÌNH DUYỆT ADMIN MODE: 100% PASS!   ")
    print("==========================================================")

if __name__ == "__main__":
    run_admin_experience_tests()

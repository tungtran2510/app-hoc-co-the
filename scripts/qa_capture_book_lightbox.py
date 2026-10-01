import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 390, "height": 844})
    page = context.new_page()

    page.goto("http://127.0.0.1:3100")
    page.evaluate("""() => {
        localStorage.setItem('app_user_display_name', 'Bác sĩ Tùng');
        localStorage.setItem('app_user_profile', JSON.stringify({ name: 'Dr. Tùng', role: 'admin' }));
        localStorage.setItem('app_onboarding_done', 'true');
        sessionStorage.setItem('app_user_name_prompted', 'true');
    }""")
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Scroll to recommended books
    page.evaluate("window.scrollTo(0, 1600)")
    page.wait_for_timeout(500)

    # Click first book card
    book_card = page.locator("text='Lắng Nghe Cơ Thể Để Tự Chữa Lành'").first
    if book_card.count() > 0:
        book_card.click()
        page.wait_for_timeout(800)

        # 1. Click 'Đọc thử sách 3D'
        flip_btn = page.locator("button:has-text('Đọc thử sách 3D')").first
        if flip_btn.count() > 0:
            flip_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=os.path.join(output_dir, "201_qa_flipbook_3d_modal.png"))
            print("✓ Đã chụp 201_qa_flipbook_3d_modal.png")

            # Click Zoom In in flipbook
            zoom_in = page.locator("button[title*='Phóng to']").first
            if zoom_in.count() > 0:
                zoom_in.click()
                page.wait_for_timeout(300)
                zoom_in.click()
                page.wait_for_timeout(300)
                page.screenshot(path=os.path.join(output_dir, "202_qa_flipbook_zoomed_150.png"))
                print("✓ Đã chụp 202_qa_flipbook_zoomed_150.png")

            # Close flipbook
            close_flip = page.locator("button[title*='Đóng']").first
            if close_flip.count() > 0:
                close_flip.click()
                page.wait_for_timeout(500)

        # 2. Click gallery image inside modal
        modal_img = page.locator(".fixed.inset-0 img[alt*='Trang']").first
        if modal_img.count() > 0:
            modal_img.click()
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(output_dir, "203_qa_book_lightbox_zoom.png"))
            print("✓ Đã chụp 203_qa_book_lightbox_zoom.png")

    browser.close()

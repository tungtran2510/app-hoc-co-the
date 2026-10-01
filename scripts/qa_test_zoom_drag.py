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
    page.goto("http://127.0.0.1:3100", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Scroll to recommended books
    page.evaluate("window.scrollTo(0, 1500)")
    page.wait_for_timeout(600)

    # Click first book card
    book_card = page.locator("text='Lắng Nghe Cơ Thể Để Tự Chữa Lành'").first
    if book_card.count() > 0:
        book_card.click()
        page.wait_for_timeout(800)

        # In BookDetailModal: Click 'Đọc sách 3D' or similar
        doc_btn = page.locator("button:has-text('Đọc sách 3D'), button:has-text('Đọc thử'), button:has-text('Xem sách')").first
        if doc_btn.count() > 0:
            doc_btn.click()
            page.wait_for_timeout(1000)

            # Check if flipbook viewer is open
            zoom_in = page.locator("button[title*='Phóng to']").first
            if zoom_in.count() > 0:
                print("✓ Đã tìm thấy nút Phóng to trong Flipbook Viewer")
                # Click zoom in twice -> 1.5x
                zoom_in.click()
                page.wait_for_timeout(300)
                zoom_in.click()
                page.wait_for_timeout(300)

                # Capture zoomed in
                page.screenshot(path=os.path.join(output_dir, "196_qa_flipbook_zoomed_150_no_flip.png"))
                print("✓ Đã chụp 196_qa_flipbook_zoomed_150_no_flip.png")

                # Perform horizontal drag on canvas
                canvas = page.locator("canvas").first
                if canvas.count() > 0:
                    box = canvas.bounding_box()
                    if box:
                        start_x = box['x'] + box['width'] * 0.8
                        start_y = box['y'] + box['height'] * 0.5
                        end_x = box['x'] + box['width'] * 0.2
                        end_y = box['y'] + box['height'] * 0.5
                        
                        page.mouse.move(start_x, start_y)
                        page.mouse.down()
                        page.mouse.move(end_x, end_y, steps=10)
                        page.mouse.up()
                        page.wait_for_timeout(500)

                        page.screenshot(path=os.path.join(output_dir, "197_qa_flipbook_drag_pan_success.png"))
                        print("✓ Đã drag khi zoom và chụp 197_qa_flipbook_drag_pan_success.png")

    browser.close()

from playwright.sync_api import sync_playwright
import os

output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 375, "height": 812})
    page = context.new_page()
    page.goto("http://127.0.0.1:3100")
    page.wait_for_timeout(1000)
    page.evaluate("window.scrollTo(0, 1400)")
    page.wait_for_timeout(600)
    
    # Click on recommended book or author book
    book_btn = page.locator("button:has-text('Xem chi tiết'), div[role='button']").first
    if book_btn.count() == 0:
        book_btn = page.locator("img[alt*='Dinh dưỡng'], img[alt*='sách']").first
    
    if book_btn.count() > 0:
        book_btn.click()
        page.wait_for_timeout(800)
        
        # Click Đọc thử 3D
        read_btn = page.locator("button:has-text('Đọc thử'), button:has-text('3D')").first
        if read_btn.count() > 0:
            read_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=os.path.join(output_dir, "182_qa_flipbook_zoom_and_single_speaker.png"))
            print("Captured 182_qa_flipbook_zoom_and_single_speaker.png")
            
            # Click zoom in twice
            zoom_in = page.locator("button[title*='Phóng to']").first
            if zoom_in.count() > 0:
                zoom_in.click()
                page.wait_for_timeout(300)
                zoom_in.click()
                page.wait_for_timeout(500)
                page.screenshot(path=os.path.join(output_dir, "183_qa_flipbook_zoomed_150.png"))
                print("Captured 183_qa_flipbook_zoomed_150.png")
        else:
            print("read_btn not found")
    else:
        print("book_btn not found")
    browser.close()

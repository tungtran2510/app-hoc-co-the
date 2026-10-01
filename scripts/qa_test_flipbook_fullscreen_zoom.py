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

    # Pre-set localStorage to avoid welcome modals
    page.goto("http://127.0.0.1:3100")
    page.evaluate("""() => {
        localStorage.setItem('app_user_profile', JSON.stringify({ name: 'Dr. Tùng', role: 'admin' }));
        localStorage.setItem('app_onboarding_done', 'true');
    }""")

    # Go to lesson page
    page.goto("http://127.0.0.1:3100/dinh-duong/tong-quan-dinh-duong-hoc-te-bao", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Scroll to Flipbook block
    page.evaluate("""() => {
        const el = document.querySelector('canvas');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }""")
    page.wait_for_timeout(500)

    # Click [⤢ Mở rộng]
    expand_btn = page.locator("button:has-text('Mở rộng')").first
    if expand_btn.count() > 0:
        expand_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "198_qa_flipbook_fullscreen_modal.png"))
        print("✓ Đã mở Flipbook toàn màn hình: 198_qa_flipbook_fullscreen_modal.png")

        # Zoom in
        zoom_in_btn = page.locator("button[title*='Phóng to']").first
        if zoom_in_btn.count() > 0:
            zoom_in_btn.click()
            page.wait_for_timeout(300)
            zoom_in_btn.click()
            page.wait_for_timeout(300)
            page.screenshot(path=os.path.join(output_dir, "199_qa_flipbook_zoomed_in_reading.png"))
            print("✓ Đã phóng to tài liệu 150%: 199_qa_flipbook_zoomed_in_reading.png")

    browser.close()

import os
import sys
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

def run_qa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport 375x812 (iPhone standard)
        context = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        )
        page = context.new_page()

        # Set localStorage for login as admin & dark mode or normal
        page.goto("http://127.0.0.1:3100")
        page.evaluate("""() => {
            localStorage.setItem('admin_token', 'mock_admin_token');
            localStorage.setItem('qbiz_admin_session', 'true');
        }""")
        page.reload()
        page.wait_for_timeout(1000)

        # 1. Capture Item 2: Admin Top Bar on Home Page (Mobile 1 line)
        page.screenshot(path=os.path.join(output_dir, "177_qa_admin_bar_1_line_mobile.png"))
        print("Captured 177_qa_admin_bar_1_line_mobile.png")

        # 2. Capture Item 4: AI Assistant Page (/tro-ly-ai)
        page.goto("http://127.0.0.1:3100/tro-ly-ai")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "178_qa_tro_ly_ai_compact_friendly.png"))
        print("Captured 178_qa_tro_ly_ai_compact_friendly.png")

        # 3. Capture Item 3: Search Page (/tim-kiem) with query 'cột sống'
        page.goto("http://127.0.0.1:3100/tim-kiem")
        page.wait_for_timeout(800)
        page.fill("input[aria-label='Nhập từ khóa tìm kiếm']", "cột sống")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "179_qa_tim_kiem_flycy_cards.png"))
        print("Captured 179_qa_tim_kiem_flycy_cards.png")

        # 4. Capture Item 5: Book Detail Modal with sleek blue close button
        page.goto("http://127.0.0.1:3100")
        page.wait_for_timeout(1000)
        # Scroll down to books section
        page.evaluate("window.scrollTo(0, 1200)")
        page.wait_for_timeout(600)
        
        # Click on first book card
        book_card = page.locator("h4, .book-card, img[alt*='Dinh dưỡng'], img[alt*='sách']").first
        if book_card.count() > 0:
            book_card.click()
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(output_dir, "180_qa_book_detail_blue_close_button.png"))
            print("Captured 180_qa_book_detail_blue_close_button.png")
            
            # Test back button: press back in browser
            page.go_back()
            page.wait_for_timeout(600)
            print("Current URL after back:", page.url)
            page.screenshot(path=os.path.join(output_dir, "181_qa_stay_on_home_after_back.png"))
            print("Captured 181_qa_stay_on_home_after_back.png")

        # 5. Capture Item 1: Flipbook 3D reader with 1 speaker button and zoom controls
        # Open a lesson page that has flipbook or open flipbook from book modal
        page.goto("http://127.0.0.1:3100/cot-song/tu-the-va-van-dong?v=1")
        page.wait_for_timeout(1000)
        # Look for flipbook or open fullscreen button
        fullscreen_btn = page.locator("button:has-text('Mở rộng'), button:has-text('Toàn màn hình')").first
        if fullscreen_btn.count() > 0:
            fullscreen_btn.click()
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(output_dir, "182_qa_flipbook_zoom_and_single_speaker.png"))
            print("Captured 182_qa_flipbook_zoom_and_single_speaker.png")

        browser.close()

if __name__ == "__main__":
    run_qa()

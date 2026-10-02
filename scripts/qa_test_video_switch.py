import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"
BASE_URL = "http://127.0.0.1:3100"

def test_video_switch():
    print("Testing video switch in playlist...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )
        context.add_init_script("""
            localStorage.setItem('qbiz_books_intro_seen', '1');
            localStorage.setItem('app_user_display_name', 'Học viên Y khoa');
            localStorage.setItem('has_seen_welcome_guide', 'true');
        """)
        page = context.new_page()

        # Mở bài 1 Cột Sống
        page.goto(f"{BASE_URL}/cot-song/tong-quan-ve-cot-song", wait_until='networkidle')
        page.wait_for_timeout(1500)
        page.evaluate("window.scrollTo(0, 350)")
        page.wait_for_timeout(500)

        # Click vào BÀI 02 trong playlist
        print("Clicking Bài 02 card...")
        card_02 = page.locator("text=02. Cơ sinh học & Cơ chế phân bổ lực").first
        card_02.click(force=True)
        page.wait_for_timeout(1000)

        # Chụp ảnh sau khi chuyển sang video 2
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "252_qa_lesson_playlist_switching_video.png"))
        print("✓ Captured 252_qa_lesson_playlist_switching_video.png")

        # Click vào nút Play trên player để mở video iframe
        print("Clicking play overlay button...")
        play_btn = page.locator("button:has(svg.lucide-play)").first
        if play_btn.is_visible():
            play_btn.click(force=True)
            page.wait_for_timeout(1200)
            page.screenshot(path=os.path.join(ARTIFACT_DIR, "255_qa_inplace_video_playing.png"))
            print("✓ Captured 255_qa_inplace_video_playing.png")

        browser.close()

if __name__ == '__main__':
    test_video_switch()

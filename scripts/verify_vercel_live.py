import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

def verify_vercel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        # Load live Vercel
        print("Navigating to live Vercel...")
        page.goto("https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song", wait_until="domcontentloaded")
        time.sleep(3)

        # Scroll to the flipbook element
        flipbook_elem = page.locator("text=GIÁO TRÌNH & ATLAS Y KHOA 3D").first
        if flipbook_elem.is_visible():
            flipbook_elem.scroll_into_view_if_needed()
            time.sleep(1)

        shot1 = os.path.join(ARTIFACT_DIR, "433_qa_live_vercel_cover_overlay.png")
        page.screenshot(path=shot1, full_page=False)
        print(f"Captured live Vercel cover: {shot1}")

        # Click to open book reader
        open_btn = page.locator("text=Chạm để mở đọc sách").first
        if open_btn.is_visible():
            open_btn.click()
            time.sleep(2)
            shot2 = os.path.join(ARTIFACT_DIR, "434_qa_live_vercel_reader_page1.png")
            page.screenshot(path=shot2, full_page=False)
            print(f"Captured live Vercel reader page 1: {shot2}")

        browser.close()
        print("Vercel Live Verification Finished!")

if __name__ == "__main__":
    verify_vercel()

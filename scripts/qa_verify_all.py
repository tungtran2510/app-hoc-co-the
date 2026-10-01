import os
import sys
import asyncio

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.async_api import async_playwright

ARTIFACTS_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15"
        )
        page = await context.new_page()

        # 1. Chụp ảnh Tab Tài Liệu trên bài học chuẩn
        print("Đang truy cập /cot-song/tong-quan-ve-cot-song...")
        await page.goto("http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        # Click vào Tab "Tài liệu"
        doc_tab = page.locator("button:has-text('Tài liệu')").first
        if await doc_tab.count() > 0:
            await doc_tab.click()
            await page.wait_for_timeout(1000)

        shot1 = os.path.join(ARTIFACTS_DIR, "125_qa_tab_tai_lieu_real_pdfs.png")
        await page.screenshot(path=shot1, full_page=False)
        print(f" -> Đã chụp Tab Tài Liệu: {shot1}")

        # 2. Mở Modal Đọc tài liệu của file đầu tiên để kiểm tra trình xem PDF A4
        read_btn = page.locator("button:has-text('Đọc tài liệu')").first
        if await read_btn.count() > 0:
            await read_btn.click()
            await page.wait_for_timeout(1200)
            shot2 = os.path.join(ARTIFACTS_DIR, "126_qa_modal_doc_pdf_real.png")
            await page.screenshot(path=shot2, full_page=False)
            print(f" -> Đã chụp Modal xem PDF thật: {shot2}")

        await browser.close()
        print("\n=== HOÀN TẤT KIỂM THỬ XÁC MINH ===")

if __name__ == "__main__":
    asyncio.run(main())

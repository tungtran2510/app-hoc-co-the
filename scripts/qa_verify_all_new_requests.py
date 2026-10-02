import asyncio
from playwright.async_api import async_playwright
import os

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # 1. KIỂM THỬ TRÊN MOBILE (iPhone 14: 390 x 844)
        # -------------------------------------------------------------
        mobile_ctx = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        )
        page_m = await mobile_ctx.new_page()

        print("[Mobile] Navigating to http://localhost:3100/ ...")
        await page_m.goto("http://localhost:3100/", wait_until="domcontentloaded")
        
        # Bỏ qua splash nếu có
        skip_btn = page_m.locator("button:has-text('Khám phá ngay')").first
        if await skip_btn.count() > 0:
            await skip_btn.click()
        await page_m.wait_for_timeout(1000)

        # Bỏ qua modal nếu có
        de_sau = page_m.locator("button:has-text('Để sau')").first
        if await de_sau.count() > 0:
            await de_sau.click()
            await page_m.wait_for_timeout(400)

        # Chụp ảnh Header Mobile: Hi, Dr. Tùng! [🔔] (Chỉ 1 biểu tượng chuông cạnh tên, không có vỗ tay)
        shot_mobile_home = os.path.join(ARTIFACT_DIR, "339_qa_mobile_header_single_bell_icon.png")
        await page_m.screenshot(path=shot_mobile_home)
        print(f"Saved: {shot_mobile_home}")

        # Điều hướng vào trang bài học: /cot-song/tong-quan-ve-cot-song
        print("[Mobile] Navigating to lesson page...")
        await page_m.goto("http://localhost:3100/cot-song/tong-quan-ve-cot-song", wait_until="domcontentloaded")
        await page_m.wait_for_timeout(1500)

        # Cuộn xuống khối sách lật (bìa da sang trọng)
        book_section = page_m.locator("section:has-text('trang')").first
        if await book_section.count() > 0:
            await book_section.scroll_into_view_if_needed()
            await page_m.wait_for_timeout(800)
            shot_mobile_book = os.path.join(ARTIFACT_DIR, "340_qa_mobile_luxury_book_casing.png")
            await page_m.screenshot(path=shot_mobile_book)
            print(f"Saved: {shot_mobile_book}")

            # Thử click vào tiêu đề sách để sửa tiêu đề
            title_elem = book_section.locator("h3").first
            if await title_elem.count() > 0:
                await title_elem.click()
                await page_m.wait_for_timeout(400)
                input_elem = book_section.locator("input[placeholder*='tiêu đề']").first
                if await input_elem.count() > 0:
                    await input_elem.fill("Atlas Y Khoa · Cột Sống Toàn Diện")
                    save_btn = book_section.locator("button:has-text('Lưu')").first
                    await save_btn.click()
                    await page_m.wait_for_timeout(600)
                    shot_mobile_title_saved = os.path.join(ARTIFACT_DIR, "341_qa_mobile_custom_book_title_saved.png")
                    await page_m.screenshot(path=shot_mobile_title_saved)
                    print(f"Saved: {shot_mobile_title_saved}")

        await mobile_ctx.close()

        # -------------------------------------------------------------
        # 2. KIỂM THỬ TRÊN IPAD (Tablet: 820 x 1180 - iPad Air Portrait)
        # -------------------------------------------------------------
        ipad_ctx = await browser.new_context(
            viewport={"width": 820, "height": 1180},
            user_agent="Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        )
        page_ipad = await ipad_ctx.new_page()

        print("[iPad] Navigating to http://localhost:3100/ ...")
        await page_ipad.goto("http://localhost:3100/", wait_until="domcontentloaded")
        skip_btn = page_ipad.locator("button:has-text('Khám phá ngay')").first
        if await skip_btn.count() > 0:
            await skip_btn.click()
        await page_ipad.wait_for_timeout(1000)
        de_sau = page_ipad.locator("button:has-text('Để sau')").first
        if await de_sau.count() > 0:
            await de_sau.click()
            await page_ipad.wait_for_timeout(400)

        shot_ipad_home = os.path.join(ARTIFACT_DIR, "342_qa_ipad_home_layout_820px.png")
        await page_ipad.screenshot(path=shot_ipad_home)
        print(f"Saved: {shot_ipad_home}")

        # Vào bài học trên iPad
        print("[iPad] Navigating to lesson page...")
        await page_ipad.goto("http://localhost:3100/cot-song/tong-quan-ve-cot-song", wait_until="domcontentloaded")
        await page_ipad.wait_for_timeout(1500)
        book_ipad = page_ipad.locator("section:has-text('trang')").first
        if await book_ipad.count() > 0:
            await book_ipad.scroll_into_view_if_needed()
            await page_ipad.wait_for_timeout(800)
            shot_ipad_book = os.path.join(ARTIFACT_DIR, "343_qa_ipad_lesson_luxury_book.png")
            await page_ipad.screenshot(path=shot_ipad_book)
            print(f"Saved: {shot_ipad_book}")

        await ipad_ctx.close()

        # -------------------------------------------------------------
        # 3. KIỂM THỬ TRÊN PC (Desktop: 1280 x 800 - Khớp 1:1 tỉ lệ với iPad)
        # -------------------------------------------------------------
        pc_ctx = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page_pc = await pc_ctx.new_page()

        print("[PC] Navigating to http://localhost:3100/ ...")
        await page_pc.goto("http://localhost:3100/", wait_until="domcontentloaded")
        skip_btn = page_pc.locator("button:has-text('Khám phá ngay')").first
        if await skip_btn.count() > 0:
            await skip_btn.click()
        await page_pc.wait_for_timeout(1000)
        de_sau = page_pc.locator("button:has-text('Để sau')").first
        if await de_sau.count() > 0:
            await de_sau.click()
            await page_pc.wait_for_timeout(400)

        shot_pc_home = os.path.join(ARTIFACT_DIR, "344_qa_pc_home_matching_ipad_ratio.png")
        await page_pc.screenshot(path=shot_pc_home)
        print(f"Saved: {shot_pc_home}")

        # Vào bài học trên PC
        print("[PC] Navigating to lesson page...")
        await page_pc.goto("http://localhost:3100/cot-song/tong-quan-ve-cot-song", wait_until="domcontentloaded")
        await page_pc.wait_for_timeout(1500)
        book_pc = page_pc.locator("section:has-text('trang')").first
        if await book_pc.count() > 0:
            await book_pc.scroll_into_view_if_needed()
            await page_pc.wait_for_timeout(800)
            shot_pc_book = os.path.join(ARTIFACT_DIR, "345_qa_pc_lesson_luxury_book.png")
            await page_pc.screenshot(path=shot_pc_book)
            print(f"Saved: {shot_pc_book}")

        await pc_ctx.close()
        await browser.close()
        print("ALL QA SCREENSHOTS COMPLETED SUCCESSFULLY.")

if __name__ == "__main__":
    asyncio.run(run())

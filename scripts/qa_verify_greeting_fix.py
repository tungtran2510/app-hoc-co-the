import asyncio
from playwright.async_api import async_playwright
import os

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport iPhone 14 (390 x 844)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        )
        page = await context.new_page()

        # 1. Truy cập trang chủ
        print("Navigating to http://localhost:3100/ ...")
        await page.goto("http://localhost:3100/", wait_until="domcontentloaded")
        
        # Click nút Khám phá ngay để đóng splash screen tức thì
        skip_btn = page.locator("button:has-text('Khám phá ngay')").first
        if await skip_btn.count() > 0:
            await skip_btn.click()
            print("Skipped splash screen.")
        
        await page.wait_for_timeout(1000)

        # Kiểm tra nội dung text của Header
        header_text = await page.locator("header").first.inner_text()
        print("Header detected successfully.")

        # Nếu có modal nhập tên tự động mở lên, bấm "Để sau" để chụp màn hình trang chủ trước
        de_sau_btn = page.locator("button:has-text('Để sau')").first
        if await de_sau_btn.count() > 0:
            await de_sau_btn.click()
            await page.wait_for_timeout(400)

        # Chụp ảnh header trang chủ kiểm chứng Hi, Dr. Tùng!
        shot1 = os.path.join(ARTIFACT_DIR, "336_qa_home_hi_greeting_fixed.png")
        await page.screenshot(path=shot1)
        print(f"Saved screenshot 1: {shot1}")

        # 2. Thử nghiệm tương tác đổi tên
        # Click vào nút chứa lời chào
        greeting_btn = page.locator("button:has-text('Hi,')").first
        if await greeting_btn.count() > 0:
            print("Clicking on greeting button to open name modal...")
            await greeting_btn.click()
            await page.wait_for_timeout(600)

            # Chụp ảnh modal nhập tên
            shot_modal = os.path.join(ARTIFACT_DIR, "337_qa_name_modal_opened.png")
            await page.screenshot(path=shot_modal)
            print(f"Saved modal screenshot: {shot_modal}")

            # Nhập tên mới "Bác sĩ Tùng"
            name_input = page.locator("input[placeholder*='Hoàng, Bác sĩ Minh']").first
            if await name_input.count() > 0:
                await name_input.fill("Bác sĩ Tùng")
                save_btn = page.locator("button:has-text('Lưu tên')").first
                await save_btn.click()
                await page.wait_for_timeout(600)

                # Chụp ảnh sau khi đổi tên
                shot2 = os.path.join(ARTIFACT_DIR, "338_qa_home_custom_name_saved.png")
                await page.screenshot(path=shot2)
                print(f"Saved screenshot 2: {shot2}")

        await browser.close()
        print("Done QA verify greeting fix.")

if __name__ == "__main__":
    asyncio.run(run())

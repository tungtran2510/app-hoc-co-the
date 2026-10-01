import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport standard iPhone / Android
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
        )
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:3100 ...")
        await page.goto("http://127.0.0.1:3100", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Chụp ảnh khối Tác giả trên trang chủ
        author_section = page.locator("section:has-text('Tùng Dinh Dưỡng'), section:has-text('Tùng dinh dưỡng')").first
        if await author_section.count() > 0:
            await author_section.scroll_into_view_if_needed()
            await page.wait_for_timeout(800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/127_qa_home_author_avatar_updated.png"
            )
            print("Captured 127_qa_home_author_avatar_updated.png")

        # 2. Bấm vào nút "Chi tiết" hoặc card sách để mở BookDetailModal
        detail_btn = page.locator("span:has-text('Chi tiết')").first
        if await detail_btn.count() > 0:
            await detail_btn.click()
            await page.wait_for_timeout(1000)
            
            # Chụp ảnh BookDetailModal phần trên (Hero sách với nút Đọc thử 3D to nổi bật)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/128_qa_book_detail_modal_big_3d_btn.png"
            )
            print("Captured 128_qa_book_detail_modal_big_3d_btn.png")

            # Cuộn xuống để chụp phần Video và phần Hình ảnh (nhấn để phóng to) 1 dòng
            modal_scroll = page.locator("div.overflow-y-auto").last
            if await modal_scroll.count() > 0:
                await modal_scroll.evaluate("el => el.scrollBy(0, 350)")
                await page.wait_for_timeout(800)
                await page.screenshot(
                    path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/129_qa_book_detail_video_and_images_1line.png"
                )
                print("Captured 129_qa_book_detail_video_and_images_1line.png")

            # 3. Bấm vào nút "Đọc Thử Sách 3D" to nổi bật trong modal
            big_3d_btn = page.locator("button:has-text('Đọc Thử Sách 3D')").first
            if await big_3d_btn.count() > 0:
                await big_3d_btn.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(
                    path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/130_qa_flipbook_opened_from_big_btn.png"
                )
                print("Captured 130_qa_flipbook_opened_from_big_btn.png")

        await browser.close()
        print("Done QA testing!")

if __name__ == '__main__':
    asyncio.run(main())

import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport standard iPhone / Android 390x844
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
        )
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:3100 ...")
        await page.goto("http://127.0.0.1:3100", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Cuộn tới section Sách nên đọc
        books_section = page.locator("section:has-text('Sách nên đọc')").first
        await books_section.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)

        # Chụp ảnh Lookbook ban đầu
        await page.screenshot(
            path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/132_qa_rec_books_lookbook_mode.png"
        )
        print("Captured 132_qa_rec_books_lookbook_mode.png")

        # 2. Bấm nút chuyển sang Grid 2 cột
        grid_btn = page.locator("button[aria-label='Xem dạng lưới 2 cột']").first
        if await grid_btn.count() > 0:
            await grid_btn.click()
            await page.wait_for_timeout(800)
            await books_section.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/131_qa_rec_books_grid_flash_category.png"
            )
            print("Captured 131_qa_rec_books_grid_flash_category.png")

        # 3. Bấm vào nút Đọc thử 3D của cuốn sách đầu tiên ngay trên thẻ Grid
        read_3d_btn = page.locator("button:has-text('Đọc thử 3D')").first
        if await read_3d_btn.count() > 0:
            print("Clicking Doc thu 3D button directly on card...")
            await read_3d_btn.click()
            await page.wait_for_timeout(1800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/133_qa_rec_books_flipbook_opened.png"
            )
            print("Captured 133_qa_rec_books_flipbook_opened.png")

            # Đóng Flipbook
            close_flipbook = page.locator("button:has-text('Đóng')").first
            if await close_flipbook.count() > 0:
                await close_flipbook.click()
                await page.wait_for_timeout(800)

        # 4. Đăng nhập Admin để mở Modal Sửa sách kiểm tra các trường Category & Flash Tag
        print("Logging in as admin to verify EditRecommendedBooksModal...")
        await page.evaluate("""() => {
            localStorage.setItem('app_admin_token', 'Admin@2026!');
        }""")
        await page.reload(wait_until="networkidle")
        await page.wait_for_timeout(1500)

        books_section = page.locator("section:has-text('Sách nên đọc')").first
        await books_section.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)

        edit_books_btn = page.locator("button:has-text('Sửa sách')").first
        if await edit_books_btn.count() > 0:
            await edit_books_btn.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/134_qa_rec_books_admin_modal_fields.png"
            )
            print("Captured 134_qa_rec_books_admin_modal_fields.png")

        await browser.close()
        print("QA Script completed successfully!")

if __name__ == '__main__':
    asyncio.run(main())

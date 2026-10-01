import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
        )
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:3100 ...")
        await page.goto("http://127.0.0.1:3100", wait_until="networkidle")
        await page.wait_for_timeout(2500)

        # 1. Chụp khối Tác giả (Avatar to sát khung, phông chữ xịn đẹp, triết lý, sách tác giả với nút vàng Champagne Gold + xem thử)
        author_section = page.locator("section:has-text('Tùng Dinh Dưỡng'), section:has-text('Tùng dinh dưỡng')").first
        if await author_section.count() > 0:
            await author_section.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/136_qa_author_profile_avatar_and_font.png"
            )
            print("Captured 136_qa_author_profile_avatar_and_font.png")

        # 2. Cuộn xuống Sách tác phẩm đã làm để chụp nút Đọc thử 3D vàng kim + xem thử
        author_books = page.locator("section:has-text('Sách & Tác phẩm đã làm')").first
        if await author_books.count() > 0:
            await author_books.scroll_into_view_if_needed()
            await page.wait_for_timeout(800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/137_qa_author_books_gold_btn.png"
            )
            print("Captured 137_qa_author_books_gold_btn.png")

        # 3. Cuộn xuống Sách nên đọc ở chế độ Lookbook (Tag Ruby Red nhỏ gọn không che chữ, nút vàng Champagne Gold + xem thử)
        rec_books = page.locator("section:has-text('Sách nên đọc')").first
        if await rec_books.count() > 0:
            await rec_books.scroll_into_view_if_needed()
            await page.wait_for_timeout(800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/138_qa_rec_books_lookbook_ruby_tag.png"
            )
            print("Captured 138_qa_rec_books_lookbook_ruby_tag.png")

            # Chuyển sang Grid 2 cột
            grid_btn = rec_books.locator("button[aria-label='Xem dạng lưới 2 cột']").first
            if await grid_btn.count() > 0:
                await grid_btn.click()
                await page.wait_for_timeout(800)
                await rec_books.scroll_into_view_if_needed()
                await page.screenshot(
                    path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/139_qa_rec_books_grid_ruby_tag.png"
                )
                print("Captured 139_qa_rec_books_grid_ruby_tag.png")

        # 4. Mở BookDetailModal để kiểm tra:
        # - Nút Đọc thử sách 3D vàng kim 1 dòng to đẹp + xem thử
        # - Dưới phần ảnh: Khung màu xanh "Đặt sách liên hệ Zalo"
        detail_btn = page.locator("span:has-text('Chi tiết')").first
        if await detail_btn.count() > 0:
            await detail_btn.click()
            await page.wait_for_timeout(1200)

            # Chụp phần trên của modal (Hero + nút Đọc thử sách 3D)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/140_qa_book_detail_gold_btn_1line.png"
            )
            print("Captured 140_qa_book_detail_gold_btn_1line.png")

            # Cuộn xuống đáy modal để chụp khung xanh Đặt sách liên hệ Zalo dưới ảnh
            modal_scroll = page.locator("div.overflow-y-auto").last
            if await modal_scroll.count() > 0:
                await modal_scroll.evaluate("el => el.scrollBy(0, 900)")
                await page.wait_for_timeout(800)
                await page.screenshot(
                    path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/141_qa_book_detail_zalo_blue_btn.png"
                )
                print("Captured 141_qa_book_detail_zalo_blue_btn.png")

        await browser.close()
        print("All visual QA screenshots captured successfully!")

if __name__ == '__main__':
    asyncio.run(main())

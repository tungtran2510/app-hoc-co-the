import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 390, 'height': 844})
        page = await context.new_page()

        await page.goto('http://127.0.0.1:3100/dang-nhap')
        await page.wait_for_timeout(1000)

        pw_input = page.locator('input[type="password"]').first
        if await pw_input.count() > 0:
            await pw_input.fill('Admin@2026!')
            submit_btn = page.locator('button[type="submit"]').first
            await submit_btn.click()
            await page.wait_for_timeout(1500)

        await page.goto('http://127.0.0.1:3100', wait_until='networkidle')
        await page.wait_for_timeout(1500)

        books_section = page.locator("section:has-text('Sách nên đọc')").first
        await books_section.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)

        edit_books_btn = books_section.locator("button:has-text('Sửa sách')").first
        if await edit_books_btn.count() > 0:
            await edit_books_btn.click()
            await page.wait_for_timeout(1200)

            # Cuộn form xuống để thấy rõ form chi tiết Cuốn #1 với Đầu mục và Thẻ Flash
            modal_form = page.locator("form.overflow-y-auto").last
            if await modal_form.count() > 0:
                await modal_form.evaluate("el => el.scrollBy(0, 520)")
                await page.wait_for_timeout(600)

            await page.screenshot(
                path='C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/135_qa_rec_books_admin_modal_scrolled_inputs.png'
            )
            print('Successfully captured 135_qa_rec_books_admin_modal_scrolled_inputs.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

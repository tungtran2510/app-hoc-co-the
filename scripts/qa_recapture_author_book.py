import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
        )
        page = await context.new_page()

        await page.goto("http://127.0.0.1:3100", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Cuộn tới Sách & Tác phẩm đã làm và cuộn thêm 120px để thấy trọn vẹn chân thẻ sách
        author_books = page.locator("section:has-text('Sách & Tác phẩm đã làm')").first
        if await author_books.count() > 0:
            await author_books.scroll_into_view_if_needed()
            await page.evaluate("window.scrollBy(0, 100)")
            await page.wait_for_timeout(800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/137_qa_author_books_gold_btn.png"
            )
            print("Recaptured 137_qa_author_books_gold_btn.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

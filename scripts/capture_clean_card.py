import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)',
            device_scale_factor=2
        )
        page = await context.new_page()
        await page.goto('http://127.0.0.1:3100/', wait_until='networkidle')
        await page.wait_for_timeout(1200)
        
        de_sau_btn = page.locator("button:has-text('Để sau')")
        if await de_sau_btn.count() > 0:
            await de_sau_btn.first.click()
            await page.wait_for_timeout(500)

        card = page.locator("section:has-text('Tùng Dinh Dưỡng')").first
        await card.scroll_into_view_if_needed()
        await page.wait_for_timeout(600)
        await page.screenshot(path='C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/214_qa_author_tung_card_clean_perfect.png')
        await browser.close()
        print('Captured 214')

if __name__ == '__main__':
    asyncio.run(main())

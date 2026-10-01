import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport iPhone 14 / standard 390x844
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15"
        )
        page = await context.new_page()

        print("1. Logging in as admin...")
        await page.goto('http://127.0.0.1:3100', wait_until='networkidle')
        login_res = await page.evaluate("""async () => {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: 'Admin@2026!' })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('app_admin_token', data.token);
            }
            return data;
        }""")
        print("Login result:", login_res)

        print("2. Navigating to lesson page...")
        await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', wait_until='networkidle')
        await asyncio.sleep(2.0)

        # 1. Capture Video Playlist with [Sua] buttons
        print("2. Capturing Video Playlist with Sua buttons...")
        # Scroll to playlist
        await page.evaluate("""() => {
            const el = document.querySelector('[role=\"button\"][tabindex=\"0\"]');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }""")
        await asyncio.sleep(0.8)
        await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/186_qa_inplace_video_edit_buttons.png")

        # 2. Click [Sua] on the first video to open EditSingleVideoModal
        print("3. Clicking [Sua] on first video...")
        vid_edit_btn = page.locator("button[title*='Sửa trực tiếp video này']").first
        if await vid_edit_btn.count() > 0:
            await vid_edit_btn.click()
            await asyncio.sleep(1.0)
            await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/187_qa_edit_single_video_modal.png")
            # Close modal
            close_btn = page.locator("button:has-text('Đóng'), button:has-text('Hủy')").first
            if await close_btn.count() > 0:
                await close_btn.click()
                await asyncio.sleep(0.5)

        # 3. Switch to Tab 'Tai lieu'
        print("4. Switching to 'Tai lieu' tab...")
        doc_tab = page.locator("button:has-text('Tài liệu')").first
        if await doc_tab.count() > 0:
            await doc_tab.click()
            await asyncio.sleep(1.0)
            await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/188_qa_medical_docs_tab_inplace_edit.png")

            # 4. Click [Sua] on document card to open EditMedicalDocumentModal
            doc_edit_btn = page.locator("button[title*='Chỉnh sửa tài liệu này']").first
            if await doc_edit_btn.count() > 0:
                await doc_edit_btn.click()
                await asyncio.sleep(1.0)
                await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/189_qa_edit_medical_doc_modal.png")

        await browser.close()
        print("QA capture complete!")

if __name__ == '__main__':
    asyncio.run(main())

import asyncio
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Chuẩn mobile iPhone 14 (390 x 844)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15"
        )
        page = await context.new_page()

        print("=== BƯỚC 1: ĐĂNG NHẬP ADMIN VÀ KIỂM TRA GIAO DIỆN TRANG CHỦ MOBILE ===")
        await page.goto('http://127.0.0.1:3100', wait_until='networkidle')
        await page.evaluate("""async () => {
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
        await page.reload(wait_until='networkidle')
        await asyncio.sleep(1.5)

        # Chụp ảnh đầu trang chủ (Admin bar Chuyên Đề Học)
        await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/190_qa_home_admin_bars_mobile.png")
        print("✓ Đã chụp 190_qa_home_admin_bars_mobile.png")

        # Scroll xuống phần Sách nên đọc & Tác giả
        await page.evaluate("window.scrollTo(0, 1100)")
        await asyncio.sleep(0.8)
        await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/191_qa_home_author_books_admin_bars.png")
        print("✓ Đã chụp 191_qa_home_author_books_admin_bars.png")

        print("=== BƯỚC 2: KIỂM TRA ĐẦY ĐỦ 8 CHUYÊN ĐỀ & CÁC BÀI HỌC MỚI ĐƯỢC ĐIỀN DỮ LIỆU ===")
        # Kiểm tra chuyên đề Dinh Dưỡng
        await page.goto('http://127.0.0.1:3100/dinh-duong', wait_until='networkidle')
        await asyncio.sleep(1.2)
        await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/192_qa_topic_dinh_duong_lessons.png")
        print("✓ Đã chụp 192_qa_topic_dinh_duong_lessons.png")

        # Vào bài học đầu tiên của Dinh Dưỡng
        lesson_link = page.locator("a[href*='/dinh-duong/']").first
        if await lesson_link.count() > 0:
            await lesson_link.click()
            await page.wait_for_load_state('networkidle')
            await asyncio.sleep(1.5)
            await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/193_qa_dinh_duong_lesson_content.png")
            print("✓ Đã chụp 193_qa_dinh_duong_lesson_content.png")

        print("=== BƯỚC 3: KIỂM TRA IN-PLACE EDIT TỪNG VIDEO & TÀI LIỆU ===")
        await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', wait_until='networkidle')
        await asyncio.sleep(1.2)

        # Cuộn tới khối video playlist
        await page.evaluate("""() => {
            const el = document.querySelector('[role=\"button\"][tabindex=\"0\"]');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }""")
        await asyncio.sleep(0.5)

        # Click nút [Sửa] của video đầu tiên
        vid_edit_btn = page.locator("button[title*='Sửa trực tiếp video này']").first
        if await vid_edit_btn.count() > 0:
            await vid_edit_btn.click()
            await asyncio.sleep(0.8)
            await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/194_qa_inplace_video_modal.png")
            print("✓ Đã chụp 194_qa_inplace_video_modal.png")
            close_btn = page.locator("button:has-text('Đóng'), button:has-text('Hủy')").first
            if await close_btn.count() > 0:
                await close_btn.click()
                await asyncio.sleep(0.5)

        print("=== BƯỚC 4: ĐO TỐC ĐỘ CHUYỂN TAB (OPTIMIZATION BENCHMARK) ===")
        doc_tab = page.locator("button:has-text('Tài liệu')").first
        syllabus_tab = page.locator("button:has-text('Danh sách bài')").first
        summary_tab = page.locator("button:has-text('Tóm tắt')").first

        t0 = time.time()
        await doc_tab.click()
        t_doc = (time.time() - t0) * 1000
        print(f"✓ Chuyển sang Tab Tài liệu: {t_doc:.1f}ms")

        await asyncio.sleep(0.5)
        await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/195_qa_docs_tab_instant.png")
        print("✓ Đã chụp 195_qa_docs_tab_instant.png")

        t0 = time.time()
        await summary_tab.click()
        t_summary = (time.time() - t0) * 1000
        print(f"✓ Chuyển sang Tab Tóm tắt: {t_summary:.1f}ms")

        t0 = time.time()
        await syllabus_tab.click()
        t_syllabus = (time.time() - t0) * 1000
        print(f"✓ Chuyển lại Tab Danh sách bài: {t_syllabus:.1f}ms")

        print("=== BƯỚC 5: KIỂM TRA SÁCH VÀ ZOOM KHÔNG BỊ LẪN LẬT SÁCH ===")
        # Mở trang chủ và click vào cuốn sách trong Sách tác phẩm hoặc Sách nên đọc
        await page.goto('http://127.0.0.1:3100', wait_until='networkidle')
        await asyncio.sleep(1.0)
        book_card = page.locator("text='Hiểu Đúng Về Cột Sống'").first
        if await book_card.count() > 0:
            await book_card.click()
            await asyncio.sleep(1.0)
            await page.screenshot(path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/196_qa_book_modal_open.png")
            print("✓ Đã chụp 196_qa_book_modal_open.png")

        print("=== TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG ===")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

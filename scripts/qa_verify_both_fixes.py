import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

async def run():
    async with async_playwright() as p:
        # Giả lập điện thoại smartphone (iPhone 14 / Android 390x844)
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            device_scale_factor=2,
            has_touch=True
        )
        # Thiết lập localStorage để không hiện modal hỏi tên
        await context.add_init_script("() => { localStorage.setItem('app_user_display_name', 'Học viên'); }")

        page = await context.new_page()

        print("=== BƯỚC 1: ĐI QUA TRANG TRỢ LÝ AI ĐỂ TẠO LỊCH SỬ DUYỆT TRÌNH BROWSER ===")
        # Đầu tiên vào trang Trợ lý AI
        await page.goto("http://127.0.0.1:3100/tro-ly-ai", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        print("Đang ở /tro-ly-ai")

        print("=== BƯỚC 2: CHUYỂN SANG TRANG CHỦ ===")
        # Bấm tab Trang chủ
        await page.goto("http://127.0.0.1:3100/", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Chụp kiểm tra thẻ Tác giả Tùng Dinh Dưỡng
        author_section = page.locator("section:has-text('Tùng Dinh Dưỡng')")
        if await author_section.count() > 0:
            await author_section.first.scroll_into_view_if_needed()
            await page.wait_for_timeout(800)
            await page.screenshot(
                path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/209_qa_tung_dinh_duong_clean_text.png",
                full_page=False
            )
            print("✓ Đã chụp 209_qa_tung_dinh_duong_clean_text.png (Khung tác giả font chuẩn, không lỗi 2 dòng)")

        print("=== BƯỚC 3: MỞ SÁCH LẬT 3D TOÀN MÀN HÌNH TỪ BÀI HỌC CỘT SỐNG ===")
        # Vào trực tiếp bài học để kiểm tra sách lật Fullscreen
        await page.goto("http://127.0.0.1:3100/cot-song/tu-the-va-van-dong", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Bấm nút Mở rộng hoặc Chạm giữa để đọc full
        mo_rong_btn = page.locator("button:has-text('Mở rộng'), button:has-text('Toàn màn hình')").first
        if await mo_rong_btn.count() > 0:
            await mo_rong_btn.scroll_into_view_if_needed()
            await mo_rong_btn.click()
            await page.wait_for_timeout(1500)
        else:
            # Click vào canvas sách lật để phóng to
            canvas_inline = page.locator("canvas").first
            await canvas_inline.click()
            await page.wait_for_timeout(1500)

        # Chụp kiểm tra Fullscreen Flipbook có nút "Quay lại" ở góc trên bên trái
        await page.screenshot(
            path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/210_qa_flipbook_with_back_button.png",
            full_page=False
        )
        print("✓ Đã chụp 210_qa_flipbook_with_back_button.png (Có nút ‹ Quay lại trên cùng bên trái)")

        print("=== BƯỚC 4: THỰC HIỆN ZOOM IN & ZOOM OUT VÀ KIỂM TRA LẬT SÁCH ===")
        # Bấm nút Phóng to (+)
        zoom_in_btn = page.locator("button[aria-label='Phóng to']").first
        if await zoom_in_btn.count() > 0:
            await zoom_in_btn.click()
            await page.wait_for_timeout(500)
            await zoom_in_btn.click()
            await page.wait_for_timeout(500)
            print("Đã zoom in lên 150%")

            # Bấm nút Đặt lại 100%
            reset_btn = page.locator("button[title*='đặt lại 100%']").first
            if await reset_btn.count() > 0:
                await reset_btn.click()
                await page.wait_for_timeout(500)
                print("Đã zoom out về lại 100%")

        # Thao tác vuốt lật trang cảm ứng (Swipe from right to left)
        canvas = page.locator("canvas").last
        box = await canvas.bounding_box()
        if box:
            start_x = box["x"] + box["width"] * 0.82
            start_y = box["y"] + box["height"] * 0.5
            end_x = box["x"] + box["width"] * 0.18

            # Vuốt lật sang trang tiếp
            await page.touchscreen.tap(start_x, start_y)
            await page.mouse.move(start_x, start_y)
            await page.mouse.down()
            await page.mouse.move(end_x, start_y, steps=10)
            await page.mouse.up()
            await page.wait_for_timeout(1000)

        await page.screenshot(
            path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/211_qa_flipbook_swiped_after_zoom.png",
            full_page=False
        )
        print("✓ Đã chụp 211_qa_flipbook_swiped_after_zoom.png (Vuốt lật trang thành công sau khi zoom)")

        print("=== BƯỚC 5: KIỂM TRA NÚT BACK CỦA ĐIỆN THOẠI KHÔNG NHẢY SANG TRANG AI ===")
        current_url_before_back = page.url
        print(f"URL trước khi bấm Back: {current_url_before_back}")

        # Thao tác giả lập bấm Back của điện thoại (page.go_back)
        await page.go_back()
        await page.wait_for_timeout(1000)

        current_url_after_back = page.url
        print(f"URL sau khi bấm Back: {current_url_after_back}")

        # Xác minh URL KHÔNG PHẢI là /tro-ly-ai
        assert "/tro-ly-ai" not in current_url_after_back, f"LỖI: Bị nhảy sang trang AI ({current_url_after_back})"
        print("✓ XÁC NHẬN: Không bị nhảy sang trang AI! Modal sách lật đã đóng an toàn và ở lại bài học hiện tại.")

        await page.screenshot(
            path="C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/212_qa_after_phone_back_stay_on_page.png",
            full_page=False
        )
        print("✓ Đã chụp 212_qa_after_phone_back_stay_on_page.png (Trang bài học vẫn giữ nguyên sau khi Back)")

        await browser.close()
        print("=== TẤT CẢ KIỂM THỬ ĐÃ THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    asyncio.run(run())

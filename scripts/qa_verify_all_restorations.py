import time
import os
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mô phỏng iPhone 14
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
        )
        page = context.new_page()

        print("1. Kiểm tra trang chuyên đề Cột sống (/cot-song)...")
        page.goto("http://127.0.0.1:3100/cot-song", wait_until="networkidle")
        time.sleep(1)

        # Chụp ảnh danh sách bài học
        shot1 = os.path.join(artifact_dir, "330_qa_cot_song_restored_videos.png")
        page.screenshot(path=shot1, full_page=False)
        print(f"-> Đã chụp: {shot1}")

        print("2. Kiểm tra bên trong bài học (/cot-song/tong-quan-ve-cot-song)...")
        page.goto("http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song", wait_until="networkidle")
        time.sleep(1)

        # Chụp ảnh đầu trang bài học có video huấn luyện
        shot2 = os.path.join(artifact_dir, "331_qa_lesson_video_player.png")
        page.screenshot(path=shot2, full_page=False)
        print(f"-> Đã chụp: {shot2}")

        # Cuộn xuống xem các khối tài liệu, chú ý, ghi chú
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(0.5)
        shot3 = os.path.join(artifact_dir, "332_qa_lesson_documents_and_notes.png")
        page.screenshot(path=shot3, full_page=False)
        print(f"-> Đã chụp: {shot3}")

        print("3. Kiểm tra trang chủ và tiêu đề sách ngắn gọn...")
        page.goto("http://127.0.0.1:3100/", wait_until="networkidle")
        time.sleep(1)

        # Cuộn tới khối Sách Y Khoa
        rec_sec = page.locator("text=Tài Liệu Y Khoa").first
        if rec_sec.is_visible():
            rec_sec.scroll_into_view_if_needed()
            time.sleep(0.5)
            shot4 = os.path.join(artifact_dir, "333_qa_home_recommended_books_clean_header.png")
            page.screenshot(path=shot4, full_page=False)
            print(f"-> Đã chụp: {shot4}")

        print("4. Kiểm tra trang Trợ Lý AI (/tro-ly-ai)...")
        page.goto("http://127.0.0.1:3100/tro-ly-ai", wait_until="networkidle")
        time.sleep(1)

        shot5 = os.path.join(artifact_dir, "334_qa_ai_assistant_instant.png")
        page.screenshot(path=shot5, full_page=False)
        print(f"-> Đã chụp: {shot5}")

        # Bấm thử câu hỏi gợi ý đầu tiên
        prompt_btn = page.locator("button:has-text('Thoát vị đĩa đệm')").first
        if prompt_btn.is_visible():
            prompt_btn.click()
            time.sleep(1.5)
            shot6 = os.path.join(artifact_dir, "335_qa_ai_response_instant.png")
            page.screenshot(path=shot6, full_page=False)
            print(f"-> Đã chụp: {shot6}")

        browser.close()
        print("TẤT CẢ KIỂM THỬ ĐÃ HOÀN TẤT!")

if __name__ == "__main__":
    run()

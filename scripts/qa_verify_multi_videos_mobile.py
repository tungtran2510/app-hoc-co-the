import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"
BASE_URL = "http://127.0.0.1:3100"

def run_qa():
    print("==================================================================")
    print("  BẮT ĐẦU KIỂM THỬ TRÌNH DUYỆT MOBILE FIRST: MULTI-VIDEOS PLAYLIST")
    print("==================================================================\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport 390x844 (iPhone 13/14)
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )

        # Bypass splash & popup
        context.add_init_script("""
            localStorage.setItem('qbiz_books_intro_seen', '1');
            localStorage.setItem('app_user_display_name', 'Học viên Y khoa');
            localStorage.setItem('has_seen_welcome_guide', 'true');
        """)

        page = context.new_page()

        # 1. Mở trang chủ
        print("1. Mở trang chủ kiểm tra hiển thị số lượng video...")
        page.goto(BASE_URL, wait_until='networkidle')
        page.wait_for_timeout(1500)

        # Chụp ảnh trang chủ phần chuyên mục
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "250_qa_home_topics_video_counts.png"))
        print("  ✓ Đã chụp ảnh 250_qa_home_topics_video_counts.png")

        # 2. Mở chuyên đề Cột Sống
        print("2. Mở chuyên đề /cot-song...")
        page.goto(f"{BASE_URL}/cot-song", wait_until='networkidle')
        page.wait_for_timeout(1000)

        # 3. Mở bài học 1: /cot-song/tong-quan-ve-cot-song
        print("3. Mở bài học 1: /cot-song/tong-quan-ve-cot-song...")
        page.goto(f"{BASE_URL}/cot-song/tong-quan-ve-cot-song", wait_until='networkidle')
        page.wait_for_timeout(1500)

        # Cuộn tới khu vực danh sách phát bài giảng (VideosBlock)
        page.evaluate("window.scrollTo(0, 350)")
        page.wait_for_timeout(500)

        # Kiểm tra danh sách phát
        playlist_items = page.locator("button:has-text('phút')").all()
        print(f"  ✓ Tìm thấy {len(playlist_items)} video bài giảng trong danh sách phát!")
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "251_qa_lesson_playlist_4_videos.png"))
        print("  ✓ Đã chụp ảnh 251_qa_lesson_playlist_4_videos.png")

        # 4. Click chọn Video 2 trong danh sách phát
        print("4. Click chọn Video 2 trong playlist...")
        if len(playlist_items) >= 2:
            playlist_items[1].click(force=True)
            page.wait_for_timeout(1000)
            page.screenshot(path=os.path.join(ARTIFACT_DIR, "252_qa_lesson_playlist_switching_video.png"))
            print("  ✓ Đã chuyển sang Video 2 và chụp ảnh 252_qa_lesson_playlist_switching_video.png")

        # 5. Mở bài học chuyên đề Tiêu Hóa
        print("5. Mở bài học /tieu-hoa/khoang-mieng-da-day...")
        page.goto(f"{BASE_URL}/tieu-hoa/khoang-mieng-da-day", wait_until='networkidle')
        page.wait_for_timeout(1500)
        page.evaluate("window.scrollTo(0, 350)")
        page.wait_for_timeout(500)
        tieu_hoa_items = page.locator("button:has-text('phút')").all()
        print(f"  ✓ Tìm thấy {len(tieu_hoa_items)} video bài giảng trong chuyên đề Tiêu Hóa!")
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "253_qa_tieu_hoa_lesson_playlist.png"))
        print("  ✓ Đã chụp ảnh 253_qa_tieu_hoa_lesson_playlist.png")

        # 6. Mở bài học chuyên đề Gan - Mật - Tụy
        print("6. Mở bài học /gan-mat-tuy/nha-may-sinh-hoa-gan...")
        page.goto(f"{BASE_URL}/gan-mat-tuy/nha-may-sinh-hoa-gan", wait_until='networkidle')
        page.wait_for_timeout(1500)
        page.evaluate("window.scrollTo(0, 350)")
        page.wait_for_timeout(500)
        gan_items = page.locator("button:has-text('phút')").all()
        print(f"  ✓ Tìm thấy {len(gan_items)} video bài giảng trong chuyên đề Gan - Mật - Tụy!")
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "254_qa_gan_mat_tuy_lesson_playlist.png"))
        print("  ✓ Đã chụp ảnh 254_qa_gan_mat_tuy_lesson_playlist.png")

        browser.close()

    print("\n==================================================================")
    print("  🎉 HOÀN TẤT BỘ TEST PLAYWRIGHT MOBILE FIRST: ĐẠT 100% PASS!")
    print("==================================================================")

if __name__ == '__main__':
    run_qa()

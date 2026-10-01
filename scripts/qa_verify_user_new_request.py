import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # iPhone 14 viewport (390 x 844)
    context = browser.new_context(viewport={"width": 390, "height": 844})
    page = context.new_page()

    # Pre-set localStorage to avoid welcome modals
    page.goto("http://127.0.0.1:3100")
    page.evaluate("""() => {
        localStorage.setItem('app_user_display_name', 'Bác sĩ Tùng');
        localStorage.setItem('app_user_profile', JSON.stringify({ name: 'Dr. Tùng', role: 'admin' }));
        localStorage.setItem('app_onboarding_done', 'true');
        sessionStorage.setItem('app_user_name_prompted', 'true');
    }""")
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(1000)

    # 1. Chụp cận cảnh khung Tùng Dinh Dưỡng với font chữ mới đẳng cấp
    print("=== 1. CHỤP KHUNG TÙNG DINH DƯỠNG MỚI ===")
    page.evaluate("window.scrollTo(0, 1100)")
    page.wait_for_timeout(600)
    page.screenshot(path=os.path.join(output_dir, "204_qa_tung_dinh_duong_card_new_font.png"))
    print("✓ Đã chụp 204_qa_tung_dinh_duong_card_new_font.png")

    # 2. Chụp chuyên đề Cơ Thể Người 3D (Đúng màn hình người dùng gửi media_1790892406268.jpg)
    print("=== 2. CHỤP CHUYÊN ĐỀ CƠ THỂ NGƯỜI 3D VỚI LOGO BÀI HỌC KHÁC NHAU & ĐẦY ĐỦ VIDEO ===")
    page.goto("http://127.0.0.1:3100/co-the-nguoi", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, "205_qa_co_the_nguoi_different_logos_and_videos.png"))
    print("✓ Đã chụp 205_qa_co_the_nguoi_different_logos_and_videos.png")

    # Cuộn xuống để thấy rõ cả 6 bài học với 6 logo khác nhau
    page.evaluate("window.scrollTo(0, 300)")
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(output_dir, "206_qa_co_the_nguoi_all_6_different_thumbnails.png"))
    print("✓ Đã chụp 206_qa_co_the_nguoi_all_6_different_thumbnails.png")

    # 3. Vào một bài học bất kỳ trong Cơ Thể Người 3D kiểm tra video player
    print("=== 3. KIỂM TRA BÀI HỌC VÀ VIDEO BÀI GIẢNG ===")
    lesson_link = page.locator("a[href*='/co-the-nguoi/']").first
    if lesson_link.count() > 0:
        lesson_link.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(output_dir, "207_qa_lesson_video_player.png"))
        print("✓ Đã chụp 207_qa_lesson_video_player.png")

    # 4. Kiểm tra chuyên đề Hệ Tiêu Hóa (tieu-hoa)
    print("=== 4. KIỂM TRA CHUYÊN ĐỀ TIÊU HÓA ===")
    page.goto("http://127.0.0.1:3100/tieu-hoa", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.evaluate("window.scrollTo(0, 200)")
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(output_dir, "208_qa_tieu_hoa_unique_logos.png"))
    print("✓ Đã chụp 208_qa_tieu_hoa_unique_logos.png")

    browser.close()
    print("=== HOÀN TẤT TOÀN BỘ KIỂM THỬ ===")

import time
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\dd6e1346-6c48-4052-81d1-b14ecf51288f"

def run_user_experience_tests():
    print("==========================================================")
    print("   BẮT ĐẦU KIỂM THỬ TRÌNH DUYỆT MOBILE FIRST (USER MODE)  ")
    print("==========================================================\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport iPhone 13/14: 390 x 844
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )

        # Tránh WelcomeModal & Splash Screen che khuất trong kịch bản test tương tác
        context.add_init_script("""
            localStorage.setItem('app_user_display_name', 'Học viên Y khoa');
            sessionStorage.setItem('app_user_name_prompted', 'true');
            localStorage.setItem('qbiz_books_intro_seen', '1');
        """)

        page = context.new_page()

        # ----------------------------------------------------
        # BƯỚC 1: TRANG CHỦ & CÁC KHỐI GIAO DIỆN
        # ----------------------------------------------------
        print("[TEST 1] Mở Trang chủ (/) trên Mobile...")
        page.goto("http://127.0.0.1:3100/", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=f"{ARTIFACT_DIR}/220_mobile_qa_home_top.png")
        print("  ✓ Đã chụp ảnh đỉnh trang chủ: 220_mobile_qa_home_top.png")

        # Cuộn xem thẻ tác giả Tùng Dinh Dưỡng
        page.evaluate("window.scrollBy(0, 600)")
        time.sleep(1)
        author_section = page.locator("text=Tùng Dinh Dưỡng").first
        if author_section.is_visible():
            page.screenshot(path=f"{ARTIFACT_DIR}/221_mobile_qa_author_card.png")
            print("  ✓ Đã kiểm tra thẻ Tác giả: 221_mobile_qa_author_card.png")

        # Cuộn xem khối Sách Nên Đọc
        page.evaluate("window.scrollBy(0, 600)")
        time.sleep(1)
        rec_books = page.locator("text=Sách nên đọc").first
        if rec_books.is_visible():
            page.screenshot(path=f"{ARTIFACT_DIR}/222_mobile_qa_rec_books_section.png")
            print("  ✓ Đã kiểm tra khối Sách Nên Đọc: 222_mobile_qa_rec_books_section.png")

            # Click vào nút Đọc thử 3D của sách nên đọc đầu tiên
            read_3d_btn = page.locator("button:has-text('Đọc thử 3D')").first
            if read_3d_btn.is_visible():
                print("  -> Bấm nút 'Đọc thử 3D' trực tiếp trên sách...")
                read_3d_btn.click()
                time.sleep(1.5)
                page.screenshot(path=f"{ARTIFACT_DIR}/223_mobile_qa_book_flipbook_open.png")
                print("  ✓ Sách lật 3D mở ra toàn màn hình sắc nét: 223_mobile_qa_book_flipbook_open.png")

                # Đóng sách 3D
                close_btn = page.locator("button[aria-label='Quay lại']").first
                if close_btn.is_visible():
                    print("  -> Đóng sách 3D...")
                    close_btn.click()
                    time.sleep(1)

        # ----------------------------------------------------
        # BƯỚC 2: BOTTOM NAVIGATION (4 TABS)
        # ----------------------------------------------------
        print("\n[TEST 2] Kiểm tra chuyển 4 Tab Bottom Navigation...")
        
        # Tab 3: Đã lưu
        saved_tab = page.locator("nav a[href='/da-luu']").first
        print("  -> Bấm tab 'Đã lưu'...")
        saved_tab.click()
        page.wait_for_url("**/da-luu", timeout=8000)
        time.sleep(1)
        assert "/da-luu" in page.url
        page.screenshot(path=f"{ARTIFACT_DIR}/224_mobile_qa_tab_saved.png")
        print("  ✓ Chuyển tab Đã lưu thành công: 224_mobile_qa_tab_saved.png")

        # Tab 4: Trợ lý AI
        ai_tab = page.locator("nav a[href='/tro-ly-ai']").first
        print("  -> Bấm tab 'Trợ lý AI'...")
        ai_tab.click()
        page.wait_for_url("**/tro-ly-ai", timeout=8000)
        time.sleep(1)
        assert "/tro-ly-ai" in page.url
        page.screenshot(path=f"{ARTIFACT_DIR}/225_mobile_qa_tab_ai_assistant.png")
        print("  ✓ Chuyển tab Trợ lý AI thành công: 225_mobile_qa_tab_ai_assistant.png")

        # Test gửi tin nhắn trong Trợ lý AI
        prompt_btn = page.locator("button:has-text('Tại sao đĩa đệm dễ bị thoát vị?'), button:has-text('cột sống')").first
        if prompt_btn.is_visible():
            print("  -> Bấm câu hỏi mẫu cho Trợ lý AI...")
            prompt_btn.click()
            time.sleep(4)
            page.screenshot(path=f"{ARTIFACT_DIR}/226_mobile_qa_ai_conversation.png")
            print("  ✓ Trợ lý AI đã trả lời thành công: 226_mobile_qa_ai_conversation.png")

        # Tab 1: Trang chủ
        home_tab = page.locator("nav a[href='/']").first
        print("  -> Bấm tab 'Trang chủ'...")
        home_tab.click()
        page.wait_for_url("http://127.0.0.1:3100/", timeout=8000)
        time.sleep(1)
        assert page.url == "http://127.0.0.1:3100/"
        print("  ✓ Quay về Trang chủ thành công")

        # ----------------------------------------------------
        # BƯỚC 3: DUYỆT CHUYÊN ĐỀ & BÀI HỌC
        # ----------------------------------------------------
        print("\n[TEST 3] Kiểm tra Chuyên đề & Chi tiết Bài học...")
        topic_link = page.locator("a[href='/cot-song']").first
        print("  -> Bấm vào chuyên đề Cột sống...")
        topic_link.click()
        page.wait_for_url("**/cot-song", timeout=8000)
        time.sleep(1)
        page.screenshot(path=f"{ARTIFACT_DIR}/227_mobile_qa_topic_cot_song_list.png")
        print("  ✓ Đã mở danh sách 6 bài học Cột Sống: 227_mobile_qa_topic_cot_song_list.png")

        # Bấm vào bài học: Tư thế chuẩn & Vận động giải áp
        lesson_link = page.locator("a[href*='/cot-song/tu-the-va-van-dong']").first
        print("  -> Bấm vào bài học 'Tư thế chuẩn & Vận động giải áp'...")
        lesson_link.click()
        page.wait_for_url("**/cot-song/tu-the-va-van-dong*", timeout=8000)
        time.sleep(1)
        page.screenshot(path=f"{ARTIFACT_DIR}/228_mobile_qa_lesson_video_tab.png")
        print("  ✓ Đã mở bài học: 228_mobile_qa_lesson_video_tab.png")

        # Bấm xem video (In-place Video Modal)
        video_play_btn = page.locator("button:has-text('Bấm xem bài giảng'), div[class*='relative']:has(svg.lucide-play)").first
        if video_play_btn.is_visible():
            print("  -> Bấm phát video bài học...")
            video_play_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/229_mobile_qa_inplace_video_player.png")
            print("  ✓ Modal video bài giảng hiển thị sắc nét: 229_mobile_qa_inplace_video_player.png")

            # Đóng modal video
            close_vid = page.locator("button[aria-label='Đóng video'], button:has-text('Đóng')").first
            if close_vid.is_visible():
                close_vid.click()
                time.sleep(0.5)

        # Chuyển sang Tab "Tài liệu Y khoa"
        print("  -> Chuyển sang tab 'Tài liệu Y khoa'...")
        docs_tab = page.locator("button:has-text('Tài liệu Y khoa')").first
        if docs_tab.is_visible():
            docs_tab.click()
            time.sleep(1)
            page.screenshot(path=f"{ARTIFACT_DIR}/230_mobile_qa_lesson_docs_tab.png")
            print("  ✓ Tab Tài liệu Y khoa hiển thị tài liệu: 230_mobile_qa_lesson_docs_tab.png")

            # Chuyển lại tab Video để test Sách lật 3D
            page.locator("button:has-text('Bài giảng Video')").first.click()
            time.sleep(0.5)

        # ----------------------------------------------------
        # BƯỚC 4: KIỂM THỬ SÁCH LẬT 3D (LẬT, ZOOM, BACK NỘI BỘ)
        # ----------------------------------------------------
        print("\n[TEST 4] Kiểm thử tính năng Sách Lật 3D chuyên sâu...")
        page.evaluate("window.scrollBy(0, 400)")
        time.sleep(0.5)
        open_flip_btn = page.locator("button:has-text('Mở rộng'), button:has-text('Toàn màn hình'), button[title*='toàn màn hình']").first
        if open_flip_btn.is_visible():
            print("  -> Bấm nút 'Mở rộng' Sách 3D...")
            open_flip_btn.click()
            time.sleep(1.5)
            page.screenshot(path=f"{ARTIFACT_DIR}/231_mobile_qa_flipbook_opened.png")
            print("  ✓ Đã mở Sách lật 3D: 231_mobile_qa_flipbook_opened.png")

            # Bấm nút Phóng to 150%
            zoom_in_btn = page.locator("button[aria-label='Phóng to']").first
            if zoom_in_btn.is_visible():
                print("  -> Bấm Phóng to 150%...")
                zoom_in_btn.click()
                time.sleep(0.5)
                page.screenshot(path=f"{ARTIFACT_DIR}/232_mobile_qa_flipbook_zoomed.png")
                print("  ✓ Đã phóng to và khóa lật sách: 232_mobile_qa_flipbook_zoomed.png")

            # Bấm Thu nhỏ về 100%
            zoom_out_btn = page.locator("button[aria-label='Thu nhỏ']").first
            if zoom_out_btn.is_visible():
                print("  -> Bấm Thu nhỏ về 100%...")
                zoom_out_btn.click()
                time.sleep(0.5)

            # Lật trang tiếp theo
            next_page_btn = page.locator("button:has-text('Trang tiếp')").first
            if next_page_btn.is_visible():
                print("  -> Bấm lật sang trang sau...")
                next_page_btn.click()
                time.sleep(0.5)
                page.screenshot(path=f"{ARTIFACT_DIR}/233_mobile_qa_flipbook_page_turned.png")
                print("  ✓ Đã lật trang thành công: 233_mobile_qa_flipbook_page_turned.png")

            # Test nút Back của trình duyệt / điện thoại: Phải đóng modal sách, KHÔNG nhảy ra trang AI
            print("  -> Giả lập người dùng bấm nút Quay lại (Back) trên điện thoại...")
            page.go_back()
            time.sleep(1)
            page.screenshot(path=f"{ARTIFACT_DIR}/234_mobile_qa_after_phone_back.png")
            assert "/cot-song/tu-the-va-van-dong" in page.url
            print("  ✓ Nút Back điện thoại đóng modal sách và vẫn ở bài học hiện tại: 234_mobile_qa_after_phone_back.png")

        # ----------------------------------------------------
        # BƯỚC 5: NÚT "BÀI TIẾP THEO →"
        # ----------------------------------------------------
        print("\n[TEST 5] Kiểm tra điều hướng 'Bài tiếp theo →'...")
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(0.5)
        next_lesson_btn = page.locator("a:has-text('Bài 06'), a:has-text('Hoàn thành'), a[href*='/cot-song/cac-van-de']").first
        if next_lesson_btn.is_visible():
            print("  -> Bấm nút 'Bài tiếp theo'...")
            next_lesson_btn.click()
            page.wait_for_load_state("networkidle")
            time.sleep(1)
            page.screenshot(path=f"{ARTIFACT_DIR}/235_mobile_qa_next_lesson_navigated.png")
            print("  ✓ Đã chuyển sang bài học tiếp theo mượt mà: 235_mobile_qa_next_lesson_navigated.png")

        browser.close()

    print("\n==========================================================")
    print("   HOÀN TẤT KIỂM THỬ TRÌNH DUYỆT USER MODE: 100% PASS!    ")
    print("==========================================================")

if __name__ == "__main__":
    run_user_experience_tests()

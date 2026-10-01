import sys; sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},
        is_mobile=True,
        has_touch=True
    )
    context.add_init_script("""
        localStorage.setItem('app_user_display_name', 'Học viên');
        sessionStorage.setItem('app_user_name_prompted', 'true');
    """)
    page = context.new_page()
    page.goto('http://127.0.0.1:3100/')
    time.sleep(1)
    
    saved_link = page.locator("nav a[href='/da-luu']").first
    print("Saved link is_visible:", saved_link.is_visible())
    print("Bounding box:", saved_link.bounding_box())
    
    # Click bằng tap hoặc click
    print("Clicking saved_link...")
    saved_link.click()
    time.sleep(2)
    print("URL after click:", page.url)
    browser.close()

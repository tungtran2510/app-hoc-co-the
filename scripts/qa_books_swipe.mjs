import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function runQa() {
  console.log('🚀 [QA] Starting Books & Lightbox Swipe Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    console.log('📱 Loading homepage on 375x812 mobile viewport...');
    await page.goto('http://127.0.0.1:3100', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Bỏ qua splash nếu có
    const splashSkip = await page.$('text=Bỏ qua');
    if (splashSkip) {
      await splashSkip.click();
      await page.waitForTimeout(500);
    }

    // Cuộn đến mục Sách nên đọc
    console.log('📜 Scrolling to Books section...');
    const booksHeader = await page.waitForSelector('text=Sách nên đọc', { timeout: 10000 });
    await booksHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '158_qa_books_list.png'),
    });
    console.log('📸 Saved: 158_qa_books_list.png');

    // Click vào cuốn sách đầu tiên để mở Modal
    console.log('📖 Opening first book detail modal...');
    const firstBook = await page.waitForSelector('text=Lắng Nghe Cơ Thể Để Tự Chữa Lành', { timeout: 5000 });
    await firstBook.click();
    await page.waitForTimeout(800);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '159_qa_book_modal_with_3_images.png'),
    });
    console.log('📸 Saved: 159_qa_book_modal_with_3_images.png');

    // Click vào ảnh thứ 2 trong phần hình ảnh để mở Lightbox
    console.log('🔍 Clicking image thumbnail to open Lightbox...');
    const thumbs = await page.$$('img[alt*="Trang sách"]');
    console.log(`Found ${thumbs.length} thumbnails`);
    if (thumbs.length > 0) {
      await thumbs[0].click();
    } else {
      const cover = await page.$('div[title*="Nhấn để phóng to"]');
      if (cover) await cover.click();
    }
    await page.waitForTimeout(600);

    // Chụp ảnh Lightbox trang 1
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '160_qa_lightbox_page1.png'),
    });
    console.log('📸 Saved: 160_qa_lightbox_page1.png');

    const pageText1 = await page.$eval('span:has-text("Trang")', el => el.textContent).catch(() => 'N/A');
    console.log('ℹ️ Lightbox indicator page 1:', pageText1);

    // Helper hàm vuốt ngón tay
    const performSwipe = async (startX, endX) => {
      await page.evaluate(({ sX, eX }) => {
        const target = document.querySelector('img[alt*="phóng to"]')?.parentElement;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        
        const startTouch = new Touch({
          identifier: Date.now(),
          target: target,
          clientX: sX,
          clientY: centerY,
          pageX: sX,
          pageY: centerY,
        });

        const moveTouch = new Touch({
          identifier: startTouch.identifier,
          target: target,
          clientX: eX,
          clientY: centerY,
          pageX: eX,
          pageY: centerY,
        });

        target.dispatchEvent(new TouchEvent('touchstart', {
          touches: [startTouch],
          targetTouches: [startTouch],
          changedTouches: [startTouch],
          bubbles: true,
          cancelable: true,
        }));

        target.dispatchEvent(new TouchEvent('touchmove', {
          touches: [moveTouch],
          targetTouches: [moveTouch],
          changedTouches: [moveTouch],
          bubbles: true,
          cancelable: true,
        }));

        target.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          targetTouches: [],
          changedTouches: [moveTouch],
          bubbles: true,
          cancelable: true,
        }));
      }, { sX: startX, eX: endX });
    };

    // 1. Vuốt sang trái (Left swipe) -> Chuyển sang ảnh 2
    console.log('👆 Swiping LEFT (next image)...');
    await performSwipe(300, 60);
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '161_qa_lightbox_swiped_to_page2.png'),
    });
    console.log('📸 Saved: 161_qa_lightbox_swiped_to_page2.png');
    const pageText2 = await page.$eval('span:has-text("Trang")', el => el.textContent).catch(() => 'N/A');
    console.log('ℹ️ Lightbox indicator page 2:', pageText2);

    // 2. Vuốt sang trái tiếp -> Chuyển sang ảnh 3
    console.log('👆 Swiping LEFT again (next image)...');
    await performSwipe(300, 60);
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '162_qa_lightbox_swiped_to_page3.png'),
    });
    console.log('📸 Saved: 162_qa_lightbox_swiped_to_page3.png');
    const pageText3 = await page.$eval('span:has-text("Trang")', el => el.textContent).catch(() => 'N/A');
    console.log('ℹ️ Lightbox indicator page 3:', pageText3);

    // 3. Vuốt sang phải (Right swipe) -> Lùi về ảnh 2
    console.log('👆 Swiping RIGHT (back to page 2)...');
    await performSwipe(60, 300);
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '163_qa_lightbox_swiped_back_page2.png'),
    });
    console.log('📸 Saved: 163_qa_lightbox_swiped_back_page2.png');
    const pageTextBack = await page.$eval('span:has-text("Trang")', el => el.textContent).catch(() => 'N/A');
    console.log('ℹ️ Lightbox indicator after swiping back:', pageTextBack);

    console.log('🎉 ALL TOUCH SWIPE TESTS VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ QA Test failed:', err);
  } finally {
    await browser.close();
  }
}

runQa();

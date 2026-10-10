import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3270';

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  console.log('1. Mở bài học tổng quan cột sống...');
  await page.goto(`${BASE_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate((el) => {
    const parentCard = el.closest('.rounded-2xl') || el;
    parentCard.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -10);
  });
  await page.waitForTimeout(3000);

  // 1. C5 mặc định: Khung 3D sạch bóng, KHÔNG HIỆN THẺ TÊN LÊNH BỀNH
  console.log('2. Chụp C5 sạch không có chữ...');
  const shot1 = path.join(ARTIFACTS_DIR, '311_spine_c5_clean_no_text.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved:', shot1);

  // 2. Chạm vào tâm ngắm: Hiện tên Đốt sống C5
  console.log('3. Chạm vào tâm ngắm để hiện tên...');
  const targetDot = page.locator('button[title="Chạm vào để hiện / ẩn tên giải phẫu"]').first();
  if (await targetDot.count() > 0) {
    await targetDot.click();
    await page.waitForTimeout(600);
    const shot2 = path.join(ARTIFACTS_DIR, '312_spine_c5_clicked_shows_name.png');
    await page.screenshot({ path: shot2 });
    console.log('Saved:', shot2);
  }

  // 3. Bấm chọn Đĩa đệm: Khung sạch, nhìn từ sau thấy đĩa đệm
  console.log('4. Bấm chọn Đĩa đệm...');
  await page.locator('button:has-text("Đĩa đệm")').click();
  await page.waitForTimeout(3000);
  const shot3 = path.join(ARTIFACTS_DIR, '313_spine_disc_clean_no_text.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved:', shot3);

  // 4. Chạm vào tâm ngắm Đĩa đệm: Hiện thẻ tên Đĩa đệm L4 - L5
  if (await targetDot.count() > 0) {
    await targetDot.click();
    await page.waitForTimeout(600);
    const shot4 = path.join(ARTIFACTS_DIR, '314_spine_disc_clicked_shows_name.png');
    await page.screenshot({ path: shot4 });
    console.log('Saved:', shot4);
  }

  // 5. Bấm chọn C1 - C7: Phải nhìn từ PHÍA SAU CỔ (Mặt sau), không nhìn thanh quản/răng
  console.log('5. Bấm chọn C1 - C7...');
  await page.locator('button:has-text("C1 - C7")').click();
  await page.waitForTimeout(3000);
  const shot5 = path.join(ARTIFACTS_DIR, '315_spine_c1c7_posterior_clean.png');
  await page.screenshot({ path: shot5 });
  console.log('Saved:', shot5);

  // 6. Bấm chọn T1 - T12: Phải nhìn từ PHÍA SAU NGỰC (Mặt sau), không có màng gian sườn che
  console.log('6. Bấm chọn T1 - T12...');
  await page.locator('button:has-text("T1 - T12")').click();
  await page.waitForTimeout(3000);
  const shot6 = path.join(ARTIFACTS_DIR, '316_spine_t1t12_posterior_clean.png');
  await page.screenshot({ path: shot6 });
  console.log('Saved:', shot6);

  // 7. Thử kéo/vuốt xoay mô hình 3D trong khung để xác minh popup #selectionCard KHÔNG BAO GIỜ hiện
  console.log('7. Vuốt xoay mô hình 3D kiểm tra không popup...');
  const iframeBox = await page.locator('iframe').first().boundingBox();
  if (iframeBox) {
    const cx = iframeBox.x + iframeBox.width / 2;
    const cy = iframeBox.y + iframeBox.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(1000);
  }
  const shot7 = path.join(ARTIFACTS_DIR, '317_spine_drag_no_popup.png');
  await page.screenshot({ path: shot7 });
  console.log('Saved:', shot7);

  await browser.close();
}

runTest().catch((e) => {
  console.error(e);
  process.exit(1);
});

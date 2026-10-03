const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function verify() {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile viewport - Light Mode
  const contextLight = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  
  const pageLight = await contextLight.newPage();
  // Set localStorage to bypass welcome modal and greeting prompt
  await pageLight.addInitScript(() => {
    localStorage.setItem('has_visited_app', 'true');
    localStorage.setItem('welcome_modal_dismissed', 'true');
    localStorage.setItem('pwa_welcome_seen', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify({ name: 'Học viên', phone: '0988888888' }));
    localStorage.setItem('ten_nguoi_dung', 'Học viên');
    localStorage.setItem('so_dien_thoai', '0988888888');
    sessionStorage.removeItem('pwa_banner_dismissed');
  });

  console.log('Navigating to https://app-hoc-co-the.vercel.app ...');
  await pageLight.goto('https://app-hoc-co-the.vercel.app', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await pageLight.waitForTimeout(3500);

  // Check if PWA banner is visible
  const banner = await pageLight.$('aside[aria-label="Thông báo cài đặt ứng dụng"]');
  console.log('Production PWA Banner found:', !!banner);
  if (banner) {
    const bannerImg = await banner.$('img');
    const src = await bannerImg?.getAttribute('src');
    console.log('Production PWA Banner icon src:', src);
    
    // Check install button classes and style
    const installBtn = await banner.$('button:has-text("Cài đặt")');
    const btnClass = await installBtn?.getAttribute('class');
    console.log('Production Install button classes:', btnClass);
  }

  // Screenshot light mode top with PWA banner & Hoạt động gần đây
  const lightPath = path.join(ARTIFACTS_DIR, 'qa_pwa_banner_light_verified.png');
  await pageLight.screenshot({ path: lightPath, fullPage: false });
  console.log('Saved Light screenshot to:', lightPath);

  // 2. Mobile viewport - Dark Mode
  const contextDark = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  
  const pageDark = await contextDark.newPage();
  await pageDark.addInitScript(() => {
    localStorage.setItem('has_visited_app', 'true');
    localStorage.setItem('welcome_modal_dismissed', 'true');
    localStorage.setItem('pwa_welcome_seen', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify({ name: 'Học viên', phone: '0988888888' }));
    localStorage.setItem('ten_nguoi_dung', 'Học viên');
    localStorage.setItem('so_dien_thoai', '0988888888');
    sessionStorage.removeItem('pwa_banner_dismissed');
  });
  console.log('Navigating Dark mode to https://app-hoc-co-the.vercel.app ...');
  await pageDark.goto('https://app-hoc-co-the.vercel.app', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await pageDark.waitForTimeout(2000);

  const exploreBtnDark = await pageDark.$('button:has-text("Khám phá ngay"), a:has-text("Khám phá ngay"), button:has-text("Mở sách")');
  if (exploreBtnDark) {
    await exploreBtnDark.click();
    await pageDark.waitForTimeout(1000);
  }

  const deSauDark = await pageDark.$('button:has-text("Để sau")');
  if (deSauDark) {
    await deSauDark.click();
    await pageDark.waitForTimeout(800);
  }

  const darkPath = path.join(ARTIFACTS_DIR, 'qa_pwa_banner_dark_verified.png');
  await pageDark.screenshot({ path: darkPath, fullPage: false });
  console.log('Saved Dark screenshot to:', darkPath);

  // 3. Inspect DOM elements for any blue styles
  const blueElements = await pageLight.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const detected = [];
    all.forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const border = style.borderColor;
      const color = style.color;
      // check for deep blue (#1E3A8A = rgb(30, 58, 138), #2563EB = rgb(37, 99, 235), #1D4ED8 = rgb(29, 78, 216))
      const isBlue = (val) => {
        if (!val) return false;
        if (val.includes('30, 58, 138') || val.includes('37, 99, 235') || val.includes('29, 78, 216') || val.includes('13, 89, 214') || val.includes('0, 102, 255')) {
          return true;
        }
        return false;
      };
      if (isBlue(bg) || isBlue(border) || isBlue(color)) {
        detected.push({
          tag: el.tagName,
          id: el.id,
          class: el.className,
          bg,
          border,
          color,
          text: el.textContent?.slice(0, 30)
        });
      }
    });
    return detected;
  });
  console.log('Computed blue elements found:', blueElements.length);
  if (blueElements.length > 0) {
    console.log(JSON.stringify(blueElements, null, 2));
  }

  await browser.close();
  console.log('Verification finished successfully!');
}

verify().catch(console.error);

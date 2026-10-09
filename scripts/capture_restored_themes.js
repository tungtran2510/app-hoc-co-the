const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });

  // 1. Phục hồi CHÀM Y KHOA: Bìa sách 3D tím chàm đậm, huy hiệu vàng như ảnh anh gửi
  await page.evaluate(() => {
    localStorage.setItem('qbiz_theme_palette', 'indigo');
    localStorage.setItem('giao_dien', 'light');
    document.documentElement.classList.remove('theme-navy-luxury', 'theme-minimal', 'dark');

    const style = document.createElement('style');
    style.id = 'demo-restored-cards';
    style.innerHTML = `
      .topic-card-container .topic-card-glow {
        background: linear-gradient(135deg, #231652 0%, #1A0E3F 50%, #100629 100%) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.25) !important;
        border-right: 1px solid rgba(0, 0, 0, 0.6) !important;
        border-bottom: 2px solid rgba(0, 0, 0, 0.8) !important;
        border-left: 4px solid #4A2D9E !important;
        color: #ffffff !important;
        border-radius: 0 12px 14px 14px !important;
        box-shadow: 3px 8px 18px rgba(0, 0, 0, 0.45) !important;
      }
      .topic-card-container .topic-card-glow h3 {
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge {
        background-color: #FCE38A !important;
        color: #190E33 !important;
        border: none !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        padding: 3px 8px !important;
        border-radius: 4px !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge span:first-child {
        display: none !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge span:last-child {
        text-transform: uppercase !important;
        font-weight: 900 !important;
      }
      .topic-card-container .topic-card-glow [class*='text-slate-400'] {
        color: rgba(221, 214, 254, 0.9) !important;
      }
      .topic-card-container .topic-card-glow [class*='text-slate-400'] span:first-child {
        background-color: #A78BFA !important;
      }
    `;
    document.head.appendChild(style);
  });

  await page.waitForTimeout(600);
  await page.mouse.wheel(0, 220);
  await page.waitForTimeout(400);

  const shotPathCham = path.join(ARTIFACT_DIR, '231_khoi_phuc_bia_sach_3d_dam_nen_sang.png');
  await page.screenshot({ path: shotPathCham });
  console.log('Saved 231:', shotPathCham);

  // 2. Phục hồi XANH NAVY HOÀNG GIA: Bìa sách 3D Navy sâu thẳm quyền lực, huy hiệu vàng gold hoặc cyan
  await page.evaluate(() => {
    localStorage.setItem('qbiz_theme_palette', 'navy_luxury');
    document.documentElement.classList.add('theme-navy-luxury');

    const style = document.getElementById('demo-restored-cards');
    style.innerHTML = `
      .topic-card-container .topic-card-glow {
        background: linear-gradient(135deg, #0E2A5C 0%, #0A1F45 50%, #06142E 100%) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.28) !important;
        border-right: 1px solid rgba(6, 20, 46, 0.6) !important;
        border-bottom: 2px solid rgba(6, 20, 46, 0.85) !important;
        border-left: 4px solid #1E4697 !important;
        color: #ffffff !important;
        border-radius: 0 12px 14px 14px !important;
        box-shadow: 0 10px 24px -4px rgba(10, 31, 69, 0.42), 0 4px 8px rgba(0, 0, 0, 0.2) !important;
      }
      .topic-card-container .topic-card-glow h3 {
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge {
        background: linear-gradient(135deg, #FDE047 0%, #EAB308 100%) !important;
        color: #07142E !important;
        border: none !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        padding: 3px 8px !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 6px rgba(234, 179, 8, 0.4) !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge span:first-child {
        display: none !important;
      }
      .topic-card-container .topic-card-glow .topic-card-badge span:last-child {
        text-transform: uppercase !important;
        font-weight: 900 !important;
      }
      .topic-card-container .topic-card-glow [class*='text-slate-400'] {
        color: #93C5FD !important;
      }
      .topic-card-container .topic-card-glow [class*='text-slate-400'] span:first-child {
        background-color: #38BDF8 !important;
      }
    `;
  });

  await page.waitForTimeout(600);
  const shotPathNavy = path.join(ARTIFACT_DIR, '232_khoi_phuc_navy_bia_sach_3d_sang_trong.png');
  await page.screenshot({ path: shotPathNavy });
  console.log('Saved 232:', shotPathNavy);

  await browser.close();
  console.log('ALL DONE COMPARING');
})();

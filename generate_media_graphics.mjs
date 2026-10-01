import { chromium } from 'playwright';
import path from 'path';

const OUTPUT_DIR = 'D:/google driver/APP – GIẢI PHẪU 3D/ANATOMY ATLAS/public/images/atlas';

const MEDIA_GRAPHICS = [
  {
    id: 'med_skin',
    title: 'CẤU TRÚC LÀN DA',
    subtitle: 'Biểu bì • Thân bì • Hạ bì',
    color1: '#f43f5e',
    color2: '#be123c',
    icon: `<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#fff"/>`
  },
  {
    id: 'med_skeleton',
    title: 'HỆ XƯƠNG KHỚP',
    subtitle: 'Khung nâng đỡ & Sinh máu',
    color1: '#0ea5e9',
    color2: '#0369a1',
    icon: `<path d="M12 3v18M8 8l8 0M6 13l12 0M8 18l8 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`
  },
  {
    id: 'med_muscles',
    title: 'CÁC LOẠI MÔ CƠ',
    subtitle: 'Cơ vân • Cơ trơn • Cơ tim',
    color1: '#e11d48',
    color2: '#881337',
    icon: `<path d="M4 12c4-8 12-8 16 0-4 8-12 8-16 0z" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="12" cy="12" r="3" fill="#fff"/>`
  },
  {
    id: 'med_bone_repair',
    title: 'QUÁ TRÌNH LIỀN XƯƠNG',
    subtitle: 'Can xương & Tái tạo mô',
    color1: '#f59e0b',
    color2: '#b45309',
    icon: `<path d="M12 2v20M5 7l14 10M5 17L19 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`
  },
  {
    id: 'med_soft_tissue',
    title: 'TÁI TẠO MÔ MỀM',
    subtitle: 'Gân cơ & Dây chằng',
    color1: '#10b981',
    color2: '#047857',
    icon: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fff"/>`
  },
  {
    id: 'quiz_identify',
    title: 'TRẮC NGHIỆM ĐỊNH DANH 3D',
    subtitle: 'Chạm đúng cấu trúc giải phẫu',
    color1: '#38bdf8',
    color2: '#0284c7',
    icon: `<circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" fill="#fff"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#fff" stroke-width="2"/>`
  },
  {
    id: 'quiz_fsrs',
    title: 'THẺ GHI NHỚ THÔNG MINH FSRS',
    subtitle: 'Ôn tập lặp lại ngắt quãng khoa học',
    color1: '#8b5cf6',
    color2: '#6d28d9',
    icon: `<rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" stroke-width="2" fill="none"/><line x1="7" y1="9" x2="17" y2="9" stroke="#fff" stroke-width="2"/><line x1="7" y1="13" x2="13" y2="13" stroke="#fff" stroke-width="2"/>`
  },
  {
    id: 'quiz_clinical_cases',
    title: 'BÁC SĨ CẤP CỨU ẢO',
    subtitle: 'Ứng dụng giải phẫu vào ca lâm sàng',
    color1: '#ec4899',
    color2: '#be185d',
    icon: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#fff"/>`
  }
];

async function generateMediaGraphics() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 340, height: 200 } });

  for (const m of MEDIA_GRAPHICS) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 340px;
            height: 200px;
            background: radial-gradient(circle at 50% 35%, #182846 0%, #0a1120 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
            position: relative;
            overflow: hidden;
          }
          .glow-circle {
            position: absolute;
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, ${m.color1}44 0%, transparent 70%);
            filter: blur(12px);
          }
          .icon-badge {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            background: linear-gradient(135deg, ${m.color1}, ${m.color2});
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px ${m.color2}66;
            margin-bottom: 12px;
            z-index: 2;
          }
          .icon-badge svg {
            width: 32px;
            height: 32px;
          }
          .title {
            font-size: 13.5px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #f8fafc;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            z-index: 2;
            text-align: center;
          }
          .subtitle {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
            z-index: 2;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="glow-circle"></div>
        <div class="icon-badge">
          <svg viewBox="0 0 24 24">${m.icon}</svg>
        </div>
        <div class="title">${m.title}</div>
        <div class="subtitle">${m.subtitle}</div>
      </body>
      </html>
    `;

    await page.setContent(html);
    const outPath = path.join(OUTPUT_DIR, `${m.id}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`✓ Saved media graphic: ${m.id}.png`);
  }

  await browser.close();
  console.log('🎉 All media & quiz graphic cards created!');
}

generateMediaGraphics().catch(console.error);

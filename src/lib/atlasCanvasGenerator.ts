/**
 * Bộ tạo ảnh trang sách y khoa độ phân giải cao cho Flipbook 3D
 * Render trực tiếp trên HTML5 Canvas để tạo trang sách chân thực với đồ họa vector sắc nét
 */

import { FlipbookPage } from '../components/FlipbookViewer';

export function renderPageToCanvas(page: FlipbookPage, totalPages: number): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  // Kích thước chuẩn tỷ lệ sách giáo trình y khoa 3:4 (Retina 2x resolution: 800 x 1120)
  const W = 800;
  const H = 1120;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Nền trang giấy trắng ngà cao cấp
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Viền trang sách tinh tế
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Gáy sách bên trái (Đổ bóng nhẹ tạo chiều sâu 3D như sách thật)
  const spineGrad = ctx.createLinearGradient(20, 0, 80, 0);
  spineGrad.addColorStop(0, 'rgba(0,0,0,0.12)');
  spineGrad.addColorStop(0.3, 'rgba(0,0,0,0.04)');
  spineGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spineGrad;
  ctx.fillRect(20, 20, 60, H - 40);

  // Mép lật bên phải (Ánh sáng nhẹ)
  const edgeGrad = ctx.createLinearGradient(W - 60, 0, W - 20, 0);
  edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
  edgeGrad.addColorStop(1, 'rgba(0,0,0,0.06)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(W - 60, 20, 40, H - 40);

  // 2. HEADER: Category & Badge Trang
  const padX = 70;
  let curY = 65;

  // Badge chuyên mục trên cùng
  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText((page.category || 'TÀI LIỆU Y KHOA NỀN TẢNG').toUpperCase(), padX, curY);

  // Số trang bên phải
  const pageBadgeText = `TRANG ${String(page.pageNum).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const badgeWidth = ctx.measureText(pageBadgeText).width;
  ctx.fillText(pageBadgeText, W - padX - badgeWidth, curY);

  // Đường kẻ ngăn cách mảnh
  curY += 15;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, curY);
  ctx.lineTo(W - padX, curY);
  ctx.stroke();

  curY += 45;

  // 3. TIÊU ĐỀ CHÍNH CỦA TRANG
  const heading = page.content?.heading || page.title;
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  // Tự động ngắt dòng cho tiêu đề dài
  const words = heading.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > W - padX * 2 && n > 0) {
      ctx.fillText(line, padX, curY);
      line = words[n] + ' ';
      curY += 36;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, padX, curY);
  curY += 25;

  // 4. TIÊU ĐỀ PHỤ (SUBHEADING)
  if (page.content?.subheading) {
    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(page.content.subheading, padX, curY);
    curY += 35;
  }

  // 5. NỘI DUNG ĐOẠN VĂN (PARAGRAPHS)
  if (page.content?.paragraphs) {
    ctx.fillStyle = '#334155';
    ctx.font = 'normal 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    for (const p of page.content.paragraphs) {
      const pWords = p.split(' ');
      let pLine = '';
      for (let n = 0; n < pWords.length; n++) {
        const testLine = pLine + pWords[n] + ' ';
        if (ctx.measureText(testLine).width > W - padX * 2 && n > 0) {
          ctx.fillText(pLine, padX, curY);
          pLine = pWords[n] + ' ';
          curY += 26;
        } else {
          pLine = testLine;
        }
      }
      ctx.fillText(pLine, padX, curY);
      curY += 32;
    }
  }

  // 6. KHỐI MINH HỌA SƠ ĐỒ Y KHOA ĐẶC BIỆT THEO LOẠI BỆNH
  curY += 10;
  const diagramBoxH = 260;
  const diagramBoxW = W - padX * 2;

  // Khung chứa sơ đồ y khoa có đổ bóng nhẹ
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  roundRect(ctx, padX, curY, diagramBoxW, diagramBoxH, 16);
  ctx.fill();
  ctx.stroke();

  // Vẽ hình minh họa y khoa sinh học trực quan
  drawAnatomyDiagram(ctx, padX, curY, diagramBoxW, diagramBoxH, page.content?.diagramType || 'spine_overview', page.pageNum);

  curY += diagramBoxH + 30;

  // 7. DANH SÁCH Ý CHÍNH (BULLETS)
  if (page.content?.bullets && page.content.bullets.length > 0) {
    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    for (const bullet of page.content.bullets.slice(0, 4)) {
      // Bullet dot
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(padX + 8, curY - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Bullet text
      ctx.fillStyle = '#1E293B';
      const bWords = bullet.split(' ');
      let bLine = '';
      let firstLine = true;
      for (let n = 0; n < bWords.length; n++) {
        const testLine = bLine + bWords[n] + ' ';
        if (ctx.measureText(testLine).width > W - padX * 2 - 25 && n > 0) {
          ctx.fillText(bLine, padX + 22, curY);
          bLine = bWords[n] + ' ';
          curY += 24;
          firstLine = false;
        } else {
          bLine = testLine;
        }
      }
      ctx.fillText(bLine, padX + 22, curY);
      curY += 26;
    }
  }

  // 8. HỘP ĐIỂM NHẤN LÂM SÀNG (HIGHLIGHT BOX)
  if (page.content?.highlight) {
    const boxY = Math.max(curY + 15, H - 180);
    const boxH = 95;
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    roundRect(ctx, padX, boxY, W - padX * 2, boxH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('💡 ĐIỂM CỐT LÕI CẦN GHI NHỚ:', padX + 18, boxY + 28);

    ctx.fillStyle = '#78350F';
    ctx.font = 'normal 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const hWords = page.content.highlight.split(' ');
    let hLine = '';
    let hy = boxY + 54;
    for (let n = 0; n < hWords.length; n++) {
      const testLine = hLine + hWords[n] + ' ';
      if (ctx.measureText(testLine).width > W - padX * 2 - 36 && n > 0) {
        ctx.fillText(hLine, padX + 18, hy);
        hLine = hWords[n] + ' ';
        hy += 22;
      } else {
        hLine = testLine;
      }
    }
    ctx.fillText(hLine, padX + 18, hy);
  }

  // 9. FOOTER DƯỚI CÙNG
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('QBIZ BOOKS · TỦ SÁCH Y KHOA GIẢI PHẪU & CHĂM SÓC CƠ THỂ', padX, H - 40);

  const copyrightText = 'TÀI LIỆU HỌC TẬP CHUYÊN SÂU';
  ctx.fillText(copyrightText, W - padX - ctx.measureText(copyrightText).width, H - 40);

  return canvas.toDataURL('image/jpeg', 0.92);
}

// Hàm vẽ hộp bo góc trên Canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Vẽ sơ đồ minh họa y khoa trên Canvas theo chủ đề từng trang
function drawAnatomyDiagram(
  ctx: CanvasRenderingContext2D,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  type: string,
  pageNum: number
) {
  const cX = boxX + boxW / 2;
  const cY = boxY + boxH / 2;

  ctx.save();

  if (pageNum === 1) {
    // Trang 1: Bìa sách Atlas Cột Sống & Khớp
    const grad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    grad.addColorStop(0, '#1E3A8A');
    grad.addColorStop(0.5, '#172554');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    roundRect(ctx, boxX + 4, boxY + 4, boxW - 8, boxH - 8, 12);
    ctx.fill();

    ctx.fillStyle = '#F8DF7B';
    ctx.font = '900 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ATLAS GIẢI PHẪU Y HỌC', cX, cY - 45);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText('CỘT SỐNG & HỆ THỐNG XƯƠNG KHỚP', cX, cY - 10);

    ctx.fillStyle = '#93C5FD';
    ctx.font = 'normal 15px -apple-system, sans-serif';
    ctx.fillText('Phiên bản lật sách 3D chân thực · Minh họa giải phẫu chi tiết', cX, cY + 25);

    // Huy hiệu chứng nhận vàng
    ctx.strokeStyle = '#F8DF7B';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cX - 100, cY + 50, 200, 32, 16);
    ctx.stroke();
    ctx.fillStyle = '#F8DF7B';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText('★ CHUẨN Y KHOA LÂM SÀNG ★', cX, cY + 71);
  } else if (pageNum === 10 || type === 'ergonomics') {
    // Trang 10: XƯƠNG KHỚP - 25y TẠO XƯƠNG & HUỶ XƯƠNG (Khớp gối, Dây chằng, Dinh dưỡng như ảnh người dùng gửi)
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, boxX + 6, boxY + 6, boxW - 12, boxH - 12, 12);
    ctx.fill();

    // Tiêu đề đỏ nổi bật
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 20px -apple-system, sans-serif';
    ctx.fillText('XƯƠNG KHỚP: CƠ CHẾ SINH HỌC & TÁI TẠO', boxX + 25, boxY + 35);

    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillText('25y TẠO XƯƠNG — HUỶ XƯƠNG', boxX + 25, boxY + 60);

    // Vẽ mô phỏng khớp xương & sụn đệm bên trái
    const jointX = boxX + 110;
    const jointY = boxY + 160;

    // Xương trên
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(jointX, jointY - 45, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lớp sụn đệm (Cartilage) màu xanh dương ngọc
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.ellipse(jointX, jointY - 18, 40, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Khe khớp & Dịch khớp (Synovial fluid)
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.ellipse(jointX, jointY, 35, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lớp sụn dưới
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.ellipse(jointX, jointY + 18, 40, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Xương dưới
    ctx.fillStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.ellipse(jointX, jointY + 50, 48, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dây chằng bọc hai bên
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(jointX - 45, jointY - 45);
    ctx.quadraticCurveTo(jointX - 55, jointY, jointX - 45, jointY + 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(jointX + 45, jointY - 45);
    ctx.quadraticCurveTo(jointX + 55, jointY, jointX + 45, jointY + 50);
    ctx.stroke();

    // Chú thích các thành phần vi chất bên phải (Omega 3, Glucosamine, Canxi...)
    const textStartX = boxX + 240;
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText('• Glucosamine & Chondroitin: Tái tạo sụn khớp', textStartX, boxY + 95);
    ctx.fillText('• Acid Hyaluronic: Tăng độ nhờn bôi trơn ổ khớp', textStartX, boxY + 125);
    ctx.fillText('• Canxi & Magie: Củng cố mật độ khoáng xương', textStartX, boxY + 155);
    ctx.fillText('• Collagen Type II: Tăng độ dẻo dai dây chằng', textStartX, boxY + 185);
    ctx.fillText('• Omega 3: Kháng viêm tự nhiên, giảm đau mỏi', textStartX, boxY + 215);
  } else {
    // Các trang giải phẫu cột sống khác: Vẽ mô phỏng cột sống 3D với đĩa đệm và rễ thần kinh
    ctx.fillStyle = '#0F172A';
    roundRect(ctx, boxX + 6, boxY + 6, boxW - 12, boxH - 12, 12);
    ctx.fill();

    // Vẽ 3 thân đốt sống (Vertebrae)
    const vW = 140;
    const vH = 42;
    const discH = 16;
    const startY = boxY + 45;

    for (let i = 0; i < 3; i++) {
      const y = startY + i * (vH + discH);

      // Thân đốt sống
      ctx.fillStyle = '#CBD5E1';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      roundRect(ctx, cX - vW / 2, y, vW, vH, 8);
      ctx.fill();
      ctx.stroke();

      // Mỏm gai sau
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(cX + vW / 2, y + 10);
      ctx.lineTo(cX + vW / 2 + 35, y + vH / 2);
      ctx.lineTo(cX + vW / 2, y + vH - 10);
      ctx.closePath();
      ctx.fill();

      // Nhãn đốt sống
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const vName = i === 0 ? 'ĐỐT L3' : i === 1 ? 'ĐỐT L4' : 'ĐỐT L5';
      ctx.fillText(vName, cX, y + 26);

      // Đĩa đệm (Disc) ở giữa các đốt
      if (i < 2) {
        const discY = y + vH;
        // Vòng sợi ngoài (Annulus Fibrosus)
        ctx.fillStyle = '#0284C7';
        roundRect(ctx, cX - (vW - 10) / 2, discY, vW - 10, discH, 6);
        ctx.fill();

        // Nhân nhầy trong (Nucleus Pulposus)
        ctx.fillStyle = '#38BDF8';
        roundRect(ctx, cX - 25, discY + 2, 50, discH - 4, 4);
        ctx.fill();

        // Rễ thần kinh tỏa ra 2 bên
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cX - (vW - 10) / 2, discY + discH / 2);
        ctx.quadraticCurveTo(cX - (vW / 2) - 30, discY, cX - (vW / 2) - 50, discY + 30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cX + (vW - 10) / 2, discY + discH / 2);
        ctx.quadraticCurveTo(cX + (vW / 2) + 30, discY, cX + (vW / 2) + 50, discY + 30);
        ctx.stroke();
      }
    }

    // Chú thích sơ đồ
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText('■ Đĩa đệm thủy lực', boxX + 25, boxY + boxH - 25);

    ctx.fillStyle = '#FACC15';
    ctx.fillText('— Rễ thần kinh tủy sống', boxX + 175, boxY + boxH - 25);

    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('□ Thân đốt sống chịu lực', boxX + 360, boxY + boxH - 25);
  }

  ctx.restore();
}

'use client';

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';

export interface SideBooksFlipEngineRef {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (pageIdx: number) => void;
}

export interface SideBooksFlipEngineProps {
  pageImages: string[];
  currentPage: number; // 1-indexed
  onPageChange: (newPage: number) => void;
  onFlipSound?: () => void;
  onCenterClick?: () => void;
  isFullscreen?: boolean;
  className?: string;
  disableFlip?: boolean;
}

const SideBooksFlipEngine = forwardRef<SideBooksFlipEngineRef, SideBooksFlipEngineProps>(
  (
    {
      pageImages,
      currentPage,
      onPageChange,
      onFlipSound,
      onCenterClick,
      isFullscreen = false,
      className = '',
      disableFlip = false,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cache các đối tượng HTMLImageElement đã tải
    const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

    // Trạng thái lật trang hiện tại
    const stateRef = useRef<{
      isAnimating: boolean;
      isDragging: boolean;
      direction: 'next' | 'prev';
      progress: number;
      fromIdx: number;
      toIdx: number;
      startX: number;
      startY: number;
      startTime: number;
      lastX: number;
      lastTime: number;
      velocityX: number;
      dragDistance: number;
      animId: number | null;
    }>({
      isAnimating: false,
      isDragging: false,
      direction: 'next',
      progress: 0,
      fromIdx: 0,
      toIdx: 0,
      startX: 0,
      startY: 0,
      startTime: 0,
      lastX: 0,
      lastTime: 0,
      velocityX: 0,
      dragDistance: 0,
      animId: null,
    });

    const totalPages = pageImages.length;

    // Tải trước hình ảnh vào cache
    useEffect(() => {
      pageImages.forEach((url) => {
        if (url && !imageCacheRef.current.has(url)) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            // Khi ảnh tải xong, vẽ lại trang tĩnh nếu đang hiển thị
            drawStatic();
          };
          imageCacheRef.current.set(url, img);
        }
      });
    }, [pageImages]);

    // Lấy đối tượng Image từ cache hoặc tạo mới
    const getImage = useCallback(
      (idx: number): HTMLImageElement | null => {
        if (idx < 0 || idx >= totalPages) return null;
        const url = pageImages[idx];
        if (!url) return null;
        let img = imageCacheRef.current.get(url);
        if (!img) {
          img = new Image();
          img.src = url;
          imageCacheRef.current.set(url, img);
        }
        return img;
      },
      [pageImages, totalPages]
    );

    // Kích thước canvas thực tế (pixel CSS)
    const getCanvasDimensions = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return { width: 360, height: 500 };
      const rect = canvas.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : (isFullscreen ? 480 : 360);
      const height = rect.height > 0 ? rect.height : (isFullscreen ? 680 : 500);
      return { width, height };
    }, [isFullscreen]);

    // Đồng bộ DPI của Canvas với màn hình Retina / High-DPI
    const resizeCanvasDPR = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height } = getCanvasDimensions();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Giới hạn dpr để tối ưu hiệu năng
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
    }, [getCanvasDimensions]);

    // =========================================================================
    // HÀM RENDER SIDEBOOKS 3D CYLINDRICAL CURL
    // Chuẩn xác mô phỏng cơ chế cuộn tròn hình trụ 3D của ứng dụng SideBooks
    // =========================================================================
    const renderCurl = useCallback(
      (
        fromIdx: number,
        toIdx: number,
        direction: 'next' | 'prev',
        progress: number
      ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width: W, height: H } = getCanvasDimensions();
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const fromImg = getImage(fromIdx);
        const toImg = getImage(toIdx);

        // Trường hợp trang tĩnh hoặc chưa lật
        if (progress <= 0 || !toImg || !fromImg) {
          if (fromImg && fromImg.complete) {
            ctx.drawImage(fromImg, 0, 0, W, H);
          }
          // Đổ bóng gáy sách mép trái
          const spineGrad = ctx.createLinearGradient(0, 0, 16, 0);
          spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
          spineGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
          spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = spineGrad;
          ctx.fillRect(0, 0, 16, H);

          ctx.restore();
          return;
        }

        // Trường hợp lật hoàn tất 100%
        if (progress >= 1) {
          if (toImg && toImg.complete) {
            ctx.drawImage(toImg, 0, 0, W, H);
          }
          const spineGrad = ctx.createLinearGradient(0, 0, 16, 0);
          spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
          spineGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
          spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = spineGrad;
          ctx.fillRect(0, 0, 16, H);

          ctx.restore();
          return;
        }

        // Các thông số vật lý của cuộn tròn hình trụ 3D (Cylindrical Roll)
        const R = Math.min(38, W * 0.12); // Bán kính cuộn tròn
        const curlW = R * Math.PI * 0.85; // Chiều rộng cuộn trên màn hình
        const arcH = 14 * Math.sin(progress * Math.PI); // Độ cong 3D của mép trên và mép dưới
        const tilt = 18 * Math.sin(progress * Math.PI); // Góc nghiêng hình nón tự nhiên của tờ giấy

        if (direction === 'prev') {
          // ===================================================================
          // LẬT NGƯỢC LẠI (PREV: Trang trước mở sang phải đè lên trang hiện tại)
          // ĐÚNG NHƯ ẢNH 2 & ẢNH 3 CỦA SIDEBOOKS MÀ NGƯỜI DÙNG CUNG CẤP
          // ===================================================================
          const xCurl = (W + curlW) * progress - curlW * 0.5;
          const xTop = xCurl + tilt;
          const xBottom = xCurl - tilt;

          // 1. Vẽ trang hiện tại nằm ở lớp đáy (From page)
          if (fromImg.complete) {
            ctx.drawImage(fromImg, 0, 0, W, H);
          }

          // 2. Bóng đổ mềm mại (Drop Shadow) phủ lên trang hiện tại bên phải nếp cuộn
          const shadowStartTop = Math.max(0, xTop + curlW);
          const shadowStartBottom = Math.max(0, xBottom + curlW);
          if (shadowStartTop < W || shadowStartBottom < W) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(shadowStartTop, 0);
            ctx.lineTo(shadowStartTop + 45, 0);
            ctx.lineTo(shadowStartBottom + 45, H);
            ctx.lineTo(shadowStartBottom, H);
            ctx.closePath();
            ctx.clip();

            const dropShadow = ctx.createLinearGradient(
              (xTop + xBottom) / 2 + curlW,
              0,
              (xTop + xBottom) / 2 + curlW + 45,
              0
            );
            dropShadow.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
            dropShadow.addColorStop(0.3, 'rgba(0, 0, 0, 0.16)');
            dropShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = dropShadow;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
          }

          // 3. Vẽ phần phẳng đã lật sang của trang đích (To page) từ mép trái đến nếp gấp
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(xTop, 0);
          ctx.lineTo(xBottom, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.clip();
          if (toImg.complete) {
            ctx.drawImage(toImg, 0, 0, W, H);
          }
          ctx.restore();

          // 4. Vẽ khối cuộn tròn hình trụ 3D (Cylinder Roll - Mặt sau in bóng mờ xuyên thấu)
          ctx.save();
          ctx.beginPath();
          // Mép trên uốn cong 3D parabol
          ctx.moveTo(xTop, 0);
          ctx.quadraticCurveTo((xTop + xBottom) / 2 + curlW * 0.45, -arcH, xTop + curlW, 0);
          ctx.lineTo(xBottom + curlW, H);
          // Mép dưới uốn cong 3D parabol
          ctx.quadraticCurveTo((xTop + xBottom) / 2 + curlW * 0.45, H - arcH, xBottom, H);
          ctx.closePath();
          ctx.clip();

          // 4a. Lớp nền giấy trắng tinh tế
          ctx.fillStyle = '#FCFCFA';
          ctx.fill();

          // 4b. Mặt sau lật ngược (Mirrored Text) với độ xuyên thấu mờ nhẹ (Bleed-through 28%)
          ctx.save();
          ctx.translate(xTop + xBottom + curlW, 0);
          ctx.scale(-1, 1);
          ctx.globalAlpha = 0.28;
          if (toImg.complete) {
            ctx.drawImage(toImg, 0, 0, W, H);
          }
          ctx.restore();

          // 4c. Ánh sáng hình trụ 3D (Bóng đổ nếp gấp + Điểm sáng Specular Highlight + Đổ bóng viền cong)
          const cylGrad = ctx.createLinearGradient(
            (xTop + xBottom) / 2,
            0,
            (xTop + xBottom) / 2 + curlW,
            0
          );
          cylGrad.addColorStop(0, 'rgba(0, 0, 0, 0.24)'); // Nếp gấp gáy trong
          cylGrad.addColorStop(0.15, 'rgba(0, 0, 0, 0.04)');
          cylGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.65)'); // Điểm phản xạ ánh sáng đỉnh ống cuộn
          cylGrad.addColorStop(0.80, 'rgba(0, 0, 0, 0.08)');
          cylGrad.addColorStop(1, 'rgba(0, 0, 0, 0.28)'); // Bóng đổ mép uốn ra sau
          ctx.fillStyle = cylGrad;
          ctx.fill();

          // 4d. Đường viền phản chiếu ánh sáng mảnh ở sống mép cuộn
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xTop + curlW, 0);
          ctx.lineTo(xBottom + curlW, H);
          ctx.stroke();

          ctx.restore();
        } else {
          // ===================================================================
          // LẬT TIẾP SANG TRANG SAU (NEXT: Trang hiện tại cuộn sang trái để lộ trang sau)
          // ===================================================================
          const xCurl = W * (1 - progress);
          const xTop = xCurl - tilt;
          const xBottom = xCurl + tilt;

          // 1. Vẽ trang đích (To page) nằm ở lớp đáy
          if (toImg.complete) {
            ctx.drawImage(toImg, 0, 0, W, H);
          }

          // 2. Bóng đổ mềm mại lên trang đích bên phải nếp cuộn
          const shadowStartTop = Math.max(0, xTop);
          const shadowStartBottom = Math.max(0, xBottom);
          if (shadowStartTop < W || shadowStartBottom < W) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(shadowStartTop, 0);
            ctx.lineTo(shadowStartTop + 45, 0);
            ctx.lineTo(shadowStartBottom + 45, H);
            ctx.lineTo(shadowStartBottom, H);
            ctx.closePath();
            ctx.clip();

            const dropShadow = ctx.createLinearGradient(
              (xTop + xBottom) / 2,
              0,
              (xTop + xBottom) / 2 + 45,
              0
            );
            dropShadow.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
            dropShadow.addColorStop(0.3, 'rgba(0, 0, 0, 0.16)');
            dropShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = dropShadow;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
          }

          // 3. Vẽ phần phẳng chưa lật của trang hiện tại (From page) bên trái
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(xTop, 0);
          ctx.lineTo(xBottom, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.clip();
          if (fromImg.complete) {
            ctx.drawImage(fromImg, 0, 0, W, H);
          }
          ctx.restore();

          // 4. Vẽ cuộn tròn hình trụ 3D (Mặt sau của trang hiện tại lật úp)
          const rollStartTop = Math.max(0, xTop);
          const rollStartBottom = Math.max(0, xBottom);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(rollStartTop, 0);
          ctx.quadraticCurveTo((rollStartTop + rollStartBottom) / 2 + curlW * 0.45, -arcH, rollStartTop + curlW, 0);
          ctx.lineTo(rollStartBottom + curlW, H);
          ctx.quadraticCurveTo((rollStartTop + rollStartBottom) / 2 + curlW * 0.45, H - arcH, rollStartBottom, H);
          ctx.closePath();
          ctx.clip();

          // Lớp nền giấy trắng
          ctx.fillStyle = '#FCFCFA';
          ctx.fill();

          // Mặt sau lật ngược (Mirrored Text) của From page
          ctx.save();
          ctx.translate(rollStartTop + rollStartBottom + curlW, 0);
          ctx.scale(-1, 1);
          ctx.globalAlpha = 0.28;
          if (fromImg.complete) {
            ctx.drawImage(fromImg, 0, 0, W, H);
          }
          ctx.restore();

          // Ánh sáng hình trụ 3D
          const cylGrad = ctx.createLinearGradient(
            (rollStartTop + rollStartBottom) / 2,
            0,
            (rollStartTop + rollStartBottom) / 2 + curlW,
            0
          );
          cylGrad.addColorStop(0, 'rgba(0, 0, 0, 0.24)');
          cylGrad.addColorStop(0.15, 'rgba(0, 0, 0, 0.04)');
          cylGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.65)');
          cylGrad.addColorStop(0.80, 'rgba(0, 0, 0, 0.08)');
          cylGrad.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
          ctx.fillStyle = cylGrad;
          ctx.fill();

          // Sống mép cuộn mảnh
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rollStartTop + curlW, 0);
          ctx.lineTo(rollStartBottom + curlW, H);
          ctx.stroke();

          ctx.restore();
        }

        // Bóng đổ gáy sách cố định mép trái
        const spineGrad = ctx.createLinearGradient(0, 0, 16, 0);
        spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
        spineGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
        spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spineGrad;
        ctx.fillRect(0, 0, 16, H);

        ctx.restore();
      },
      [getCanvasDimensions, getImage]
    );

    // Vẽ trang tĩnh hiện tại
    const drawStatic = useCallback(() => {
      const state = stateRef.current;
      if (state.isAnimating || state.isDragging) return;
      resizeCanvasDPR();
      renderCurl(currentPage - 1, currentPage - 1, 'next', 0);
    }, [currentPage, resizeCanvasDPR, renderCurl]);

    // Lắng nghe thay đổi kích thước container để vẽ lại
    useEffect(() => {
      drawStatic();
      const handleResize = () => {
        resizeCanvasDPR();
        drawStatic();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [drawStatic, resizeCanvasDPR]);

    // Cập nhật khi currentPage thay đổi từ bên ngoài (slider, click...)
    useEffect(() => {
      drawStatic();
    }, [currentPage, drawStatic]);

    // =========================================================================
    // HOẠT ẢNH HOÀN TẤT LẬT TRANG (ANIMATE TO TARGET PAGE)
    // =========================================================================
    const animateToTarget = useCallback(
      (
        direction: 'next' | 'prev',
        fromIdx: number,
        toIdx: number,
        startProgress: number,
        duration: number = 320
      ) => {
        const state = stateRef.current;
        if (state.animId) cancelAnimationFrame(state.animId);

        state.isAnimating = true;
        state.isDragging = false;
        state.direction = direction;
        state.fromIdx = fromIdx;
        state.toIdx = toIdx;

        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);
          // Easing function: Ease-out cubic mượt mà
          const eased = startProgress + (1 - startProgress) * (1 - Math.pow(1 - t, 3));
          state.progress = eased;

          renderCurl(fromIdx, toIdx, direction, eased);

          if (t < 1) {
            state.animId = requestAnimationFrame(tick);
          } else {
            // Hoàn tất lật trang
            state.isAnimating = false;
            state.animId = null;
            state.progress = 0;
            onPageChange(toIdx + 1);
            onFlipSound?.();
          }
        };

        state.animId = requestAnimationFrame(tick);
      },
      [onPageChange, onFlipSound, renderCurl]
    );

    // =========================================================================
    // HOẠT ẢNH BẬT HỒI LẠI TRANG CŨ KHI BUÔNG TAY QUÁ SỚM (CANCEL FLIP)
    // =========================================================================
    const animateCancel = useCallback(
      (
        direction: 'next' | 'prev',
        fromIdx: number,
        toIdx: number,
        startProgress: number,
        duration: number = 200
      ) => {
        const state = stateRef.current;
        if (state.animId) cancelAnimationFrame(state.animId);

        state.isAnimating = true;
        state.isDragging = false;

        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);
          // Easing back to 0
          const eased = startProgress * Math.pow(1 - t, 2);
          state.progress = eased;

          renderCurl(fromIdx, toIdx, direction, eased);

          if (t < 1) {
            state.animId = requestAnimationFrame(tick);
          } else {
            state.isAnimating = false;
            state.animId = null;
            state.progress = 0;
            drawStatic();
          }
        };

        state.animId = requestAnimationFrame(tick);
      },
      [drawStatic, renderCurl]
    );

    // =========================================================================
    // ĐIỀU KHIỂN IMPERATIVE CHO REF (NÚT BẤM, BÀN PHÍM, SLIDER)
    // =========================================================================
    useImperativeHandle(
      ref,
      () => ({
        flipNext: () => {
          if (currentPage >= totalPages) return;
          animateToTarget('next', currentPage - 1, currentPage, 0, 360);
        },
        flipPrev: () => {
          if (currentPage <= 1) return;
          animateToTarget('prev', currentPage - 1, currentPage - 2, 0, 360);
        },
        turnToPage: (targetIdx: number) => {
          if (targetIdx === currentPage - 1) return;
          if (targetIdx > currentPage - 1) {
            animateToTarget('next', currentPage - 1, targetIdx, 0, 360);
          } else {
            animateToTarget('prev', currentPage - 1, targetIdx, 0, 360);
          }
        },
      }),
      [currentPage, totalPages, animateToTarget]
    );

    // =========================================================================
    // XỬ LÝ CỬ CHỈ CHẠM VUỐT NHẠY CỰC ĐỘ (POINTER / TOUCH GESTURES)
    // ĐẶC BIỆT: Khắc phục triệt để lỗi zoom lẫn lật sách!
    // Khi người dùng chạm >= 2 ngón tay (Pinch to Zoom) hoặc disableFlip === true:
    // CẤM TUYỆT ĐỐI không cho phép lật sách, hủy toàn bộ trạng thái kéo.
    // =========================================================================
    const isPointerDownRef = useRef<boolean>(false);
    const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

    // Đảm bảo khi trạng thái phóng to (disableFlip) bật hoặc tắt, dọn dẹp sạch toàn bộ con trỏ
    useEffect(() => {
      activePointersRef.current.clear();
      isPointerDownRef.current = false;
      const state = stateRef.current;
      if (state.isDragging && !state.isAnimating) {
        state.isDragging = false;
        state.progress = 0;
        drawStatic();
      }
    }, [disableFlip, drawStatic]);

    // Lắng nghe sự kiện nhấc tay/hủy chạm trên toàn bộ window
    // KHẮC PHỤC TRIỆT ĐỂ: Khi người dùng phóng to (canvas nhận pointer-events: none),
    // việc nhấc tay ngoài canvas sẽ không làm kẹt lại con trỏ trong activePointersRef!
    useEffect(() => {
      const handleGlobalPointerEnd = (e: PointerEvent) => {
        activePointersRef.current.delete(e.pointerId);
        if (activePointersRef.current.size === 0) {
          isPointerDownRef.current = false;
        }
      };

      const handleGlobalTouchEnd = (e: TouchEvent) => {
        if (e.touches.length === 0) {
          activePointersRef.current.clear();
          isPointerDownRef.current = false;
        }
      };

      window.addEventListener('pointerup', handleGlobalPointerEnd, { passive: true });
      window.addEventListener('pointercancel', handleGlobalPointerEnd, { passive: true });
      window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
      window.addEventListener('touchcancel', handleGlobalTouchEnd, { passive: true });

      return () => {
        window.removeEventListener('pointerup', handleGlobalPointerEnd);
        window.removeEventListener('pointercancel', handleGlobalPointerEnd);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
        window.removeEventListener('touchcancel', handleGlobalTouchEnd);
      };
    }, []);

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      // Nếu đang trong chế độ phóng to: không thao tác lật sách
      if (disableFlip) return;

      // Đăng ký con trỏ đang chạm
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Nếu có từ 2 ngón tay chạm trở lên (thao tác pinch zoom): HỦY LẬT SÁCH NGAY LẬP TỨC
      if (activePointersRef.current.size >= 2) {
        const state = stateRef.current;
        if (state.isDragging) {
          state.isDragging = false;
          state.progress = 0;
          drawStatic();
        }
        isPointerDownRef.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        return;
      }

      const state = stateRef.current;
      if (state.isAnimating) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      isPointerDownRef.current = true;
      state.startX = x;
      state.startY = y;
      state.startTime = performance.now();
      state.lastX = x;
      state.lastTime = performance.now();
      state.velocityX = 0;
      state.dragDistance = 0;
      // Chỉ tự động setPointerCapture trong chế độ Fullscreen
      // Trong chế độ Inline, không setPointerCapture ngay để trình duyệt cuộn trang dọc tự nhiên
      if (isFullscreen) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {}
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activePointersRef.current.has(e.pointerId)) {
        activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Nếu đang phóng to hoặc thao tác đa điểm: Tuyệt đối không lật sách
      if (disableFlip || activePointersRef.current.size >= 2 || !isPointerDownRef.current) {
        const state = stateRef.current;
        if (state.isDragging) {
          state.isDragging = false;
          state.progress = 0;
          drawStatic();
        }
        return;
      }
      const state = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - state.startX;
      const dy = y - state.startY;
      state.dragDistance = Math.hypot(dx, dy);

      // Tính vận tốc tức thời theo trục X
      const now = performance.now();
      const dt = now - state.lastTime;
      if (dt > 8) {
        state.velocityX = (x - state.lastX) / dt;
        state.lastX = x;
        state.lastTime = now;
      }

      const { width: W } = getCanvasDimensions();

      // Trong chế độ Inline, nếu người dùng vuốt dọc (dy > dx), ưu tiên cuộn trang dọc của trình duyệt
      if (!isFullscreen && !state.isDragging) {
        if (Math.abs(dy) > Math.abs(dx) * 1.1 && Math.abs(dy) > 5) {
          isPointerDownRef.current = false;
          return;
        }
      }

      // Bắt đầu kéo khi dịch chuyển ngang đủ lớn và dx vượt trội hơn dy
      const threshold = isFullscreen ? 6 : 12;
      if (!state.isDragging && Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (!isFullscreen) {
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch {}
        }
        if (dx < 0 && currentPage < totalPages) {
          // Vuốt sang trái -> Lật tiếp (Next)
          state.isDragging = true;
          state.direction = 'next';
          state.fromIdx = currentPage - 1;
          state.toIdx = currentPage;
        } else if (dx > 0 && currentPage > 1) {
          // Vuốt sang phải -> Lật ngược lại (Prev)
          state.isDragging = true;
          state.direction = 'prev';
          state.fromIdx = currentPage - 1;
          state.toIdx = currentPage - 2;
        }
      }

      if (state.isDragging) {
        let p = 0;
        if (state.direction === 'next') {
          p = Math.min(1, Math.max(0, -dx / (W * 0.85)));
        } else {
          p = Math.min(1, Math.max(0, dx / (W * 0.85)));
        }
        state.progress = p;
        renderCurl(state.fromIdx, state.toIdx, state.direction, p);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      activePointersRef.current.delete(e.pointerId);

      if (disableFlip) {
        isPointerDownRef.current = false;
        return;
      }

      if (activePointersRef.current.size > 0) {
        isPointerDownRef.current = false;
        const state = stateRef.current;
        if (state.isDragging) {
          state.isDragging = false;
          state.progress = 0;
          drawStatic();
        }
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        return;
      }
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      const state = stateRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {}
      }

      const { width: W } = getCanvasDimensions();
      const rect = canvas ? canvas.getBoundingClientRect() : { left: 0 };
      const x = e.clientX - rect.left;

      // TRƯỜNG HỢP 1: CHẠM / CLICK NHANH (KHÔNG KÉO)
      if (!state.isDragging && state.dragDistance < 10) {
        const leftZone = W * 0.22;
        const rightZone = W * 0.78;

        if (x < leftZone) {
          // Chạm mép trái -> Lật về trang trước
          if (currentPage > 1) {
            animateToTarget('prev', currentPage - 1, currentPage - 2, 0, 320);
          }
          return;
        } else if (x > rightZone) {
          // Chạm mép phải -> Lật sang trang tiếp
          if (currentPage < totalPages) {
            animateToTarget('next', currentPage - 1, currentPage, 0, 320);
          }
          return;
        } else {
          // Chạm ở giữa màn hình sách -> Mở Full màn hình
          onCenterClick?.();
          return;
        }
      }

      // TRƯỜNG HỢP 2: KÉO HOẶC VUỐT BÚNG NHANH (FLICK GESTURE)
      if (state.isDragging) {
        const p = state.progress;
        const v = state.velocityX;

        if (state.direction === 'next') {
          // Điều kiện lật sang trang sau:
          // 1. Vuốt búng nhanh sang trái (v < -0.28 px/ms) HOẶC
          // 2. Kéo chậm đã qua 16% chiều rộng trang (p > 0.16)
          if ((v < -0.28 || p > 0.16) && currentPage < totalPages) {
            animateToTarget('next', state.fromIdx, state.toIdx, p, 300);
          } else {
            animateCancel('next', state.fromIdx, state.toIdx, p, 180);
          }
        } else if (state.direction === 'prev') {
          // Điều kiện lật ngược về trang trước:
          // 1. Vuốt búng nhanh sang phải (v > 0.28 px/ms) HOẶC
          // 2. Kéo chậm đã qua 16% chiều rộng trang (p > 0.16)
          if ((v > 0.28 || p > 0.16) && currentPage > 1) {
            animateToTarget('prev', state.fromIdx, state.toIdx, p, 300);
          } else {
            animateCancel('prev', state.fromIdx, state.toIdx, p, 180);
          }
        }
      }
    };

    return (
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center select-none ${
          disableFlip ? 'pointer-events-none' : isFullscreen ? 'touch-none' : 'touch-pan-y'
        } ${className}`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-[12px] shadow-sm transition-transform"
          style={{
            touchAction: disableFlip ? 'auto' : isFullscreen ? 'none' : 'pan-y',
            pointerEvents: disableFlip ? 'none' : 'auto',
          }}
        />
      </div>
    );
  }
);

SideBooksFlipEngine.displayName = 'SideBooksFlipEngine';

export default SideBooksFlipEngine;

'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface Spine3DFocusedWidgetProps {
  onOpenFull3D?: () => void;
}

interface SpinePoint {
  id: string;
  name: string;
  code: string;
  pinLabel: string;
  camFront: string;
  camBack: string;
  clinicalDesc: string;
  warningNote: string;
}

const SPINE_POINTS: SpinePoint[] = [
  {
    id: 'c5',
    name: 'Đốt Sống Cổ C5',
    code: 'C5 (Cổ)',
    pinLabel: 'Đốt sống C5',
    camFront: '0,1.47,0.30,0,1.47,-0.02',
    camBack: '0,1.47,-0.30,0,1.47,-0.02',
    clinicalDesc: 'Nằm ở trung tâm đoạn cong sinh lý cột sống cổ, là điểm chịu lực uốn gập nhiều nhất của cổ khi xoay và ngửa đầu.',
    warningNote: 'Chèn ép rễ thần kinh C5 gây đau buốt từ sau gáy lan sang bả vai, tê yếu cơ delta và khó nâng cánh tay lên cao.',
  },
  {
    id: 'disc',
    name: 'Đĩa Đệm L4 - L5 (Giảm xóc)',
    code: 'Đĩa đệm',
    pinLabel: 'Đĩa đệm L4 - L5',
    camFront: '0,0.998,0.30,0,0.998,-0.01',
    camBack: '0,0.998,-0.30,0,0.998,-0.02',
    clinicalDesc: 'Tấm đệm sợi sụn đàn hồi nằm giữa hai thân đốt sống, chứa nhân nhầy ngậm nước hoạt động như bộ giảm xóc thủy lực bảo vệ cột sống.',
    warningNote: 'Tư thế cúi vặn người bê nặng dễ làm rách bao xơ, thoát vị đĩa đệm L4-L5 chèn ép dây thần kinh tọa gây tê buốt lan xuống chân.',
  },
  {
    id: 'cervical',
    name: 'Đoạn Cổ C1 - C7',
    code: 'C1 - C7',
    pinLabel: '',
    camFront: '0,1.46,0.44,0,1.46,-0.02',
    camBack: '0,1.46,-0.44,0,1.46,-0.02',
    clinicalDesc: 'Gồm 7 đốt sống cổ nâng đỡ hộp sọ (~5kg), là đoạn linh hoạt nhất của trục cơ thể cho phép đầu xoay 180° và gập ngửa.',
    warningNote: 'Tư thế cúi 60° xem điện thoại làm tăng tải trọng lên đĩa đệm cổ tới 27kg, gây thoái hóa và mất đường cong sinh lý.',
  },
  {
    id: 'thoracic',
    name: 'Đoạn Ngực T1 - T12',
    code: 'T1 - T12',
    pinLabel: '',
    camFront: '0,1.26,0.75,0,1.26,-0.04',
    camBack: '0,1.26,-0.75,0,1.26,-0.04',
    clinicalDesc: '12 đốt liên kết cùng xương sườn bao bọc tim phổi. Đoạn này có độ cứng vững cao nhất để bảo vệ nội tạng lồng ngực.',
    warningNote: 'Ngồi gù làm chèn ép dây thần kinh liên sườn, gây cảm giác đau nhói tức ngực nhầm lẫn với đau tim và hạn chế thở sâu.',
  },
  {
    id: 'full',
    name: 'Toàn Bộ Cột Sống (33 đốt)',
    code: '33 đốt',
    pinLabel: '',
    camFront: '0,1.18,1.50,0,1.18,-0.04',
    camBack: '0,1.18,-1.50,0,1.18,-0.04',
    clinicalDesc: 'Hệ thống giảm xóc tự nhiên với 4 đoạn cong sinh lý chữ S cân bằng hoàn hảo, bảo vệ tủy sống và tạo trục vận động toàn thân.',
    warningNote: 'Sai lệch tư thế kéo dài làm mòn đĩa đệm, gai xương và biến dạng trục khớp toàn thân.',
  },
];

export default function Spine3DFocusedWidget({ onOpenFull3D }: Spine3DFocusedWidgetProps) {
  const [selectedPoint, setSelectedPoint] = useState<SpinePoint>(SPINE_POINTS[0]); // Mặc định C5
  const [isFrontView, setIsFrontView] = useState(false); // Mặc định nhìn sau để thấy toàn bộ cột sống
  const [showPinLabel, setShowPinLabel] = useState(false); // Mặc định khung 3D sạch hoàn toàn, trừ khi ấn vào mới hiện tên
  const [keyCounter, setKeyCounter] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Lắng nghe thay đổi theme Sáng / Tối từ trang cha
  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const handleSelectPoint = (pt: SpinePoint) => {
    playTapSound();
    setSelectedPoint(pt);
    setShowPinLabel(false); // Reset để khung 3D luôn sạch sẽ, không tự ý hiện tên
    setKeyCounter((k) => k + 1);
  };

  const handleToggleDirection = () => {
    playTapSound();
    setIsFrontView(!isFrontView);
    setKeyCounter((k) => k + 1);
  };

  const activeCam = isFrontView ? selectedPoint.camFront : selectedPoint.camBack;
  const themeParam = isDark ? 'dark' : 'light';
  const iframeUrl = `/3d/index.html?widget=1&theme=${themeParam}&pt=${selectedPoint.id}&dir=${isFrontView ? 'front' : 'back'}#sys=skeletal,joints&cam=${activeCam}`;

  return (
    <section
      aria-label="Khối Mô Hình 3D Cột Sống Tinh Gọn"
      className="w-full my-5 rounded-[20px] bg-white dark:bg-[#0A0F1D] border border-slate-200/90 dark:border-blue-900/40 shadow-sm dark:shadow-xl overflow-hidden text-slate-800 dark:text-white transition-colors duration-200"
    >
      {/* 1. Header tinh gọn 1 dòng - Chuẩn màu nền Sáng / Tối */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 dark:bg-[#0E1528] border-b border-slate-200/80 dark:border-blue-900/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-400/50 flex items-center justify-center text-[12px] shrink-0">
            🦴
          </span>
          <span className="text-[13px] font-black text-slate-900 dark:text-white whitespace-nowrap">
            Mô hình 3D Cột sống
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 text-[8.5px] font-black uppercase">
            360°
          </span>
        </div>

        {onOpenFull3D && (
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onOpenFull3D();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 dark:text-blue-200 dark:border-transparent text-[10.5px] font-bold cursor-pointer transition-all active:scale-95"
            title="Mở toàn màn hình Atlas 3D"
          >
            <Maximize2 size={11} strokeWidth={2.5} />
            <span>Atlas đầy đủ</span>
          </button>
        )}
      </div>

      {/* 2. KHUNG CHÍNH XEM: DÀI ĐỨNG TỶ LỆ 3x5 (ASPECT 3:5) */}
      <div className="relative w-full max-w-[340px] aspect-[3/5] mx-auto bg-slate-100 dark:bg-[#070B14] overflow-hidden select-none border-y border-slate-200/80 dark:border-slate-800/80">
        <iframe
          key={`${selectedPoint.id}-${isFrontView ? 'front' : 'back'}-${keyCounter}-${themeParam}`}
          src={iframeUrl}
          title={`Mô hình 3D ${selectedPoint.name}`}
          className="w-full h-full border-0 pointer-events-auto"
          allow="fullscreen; accelerometer; gyroscope"
        />

        {/* CHỈ ĐIỂM GIẢI PHẪU: Mặc định khung 3D sạch bóng, CHỈ HIỆN TÊN KHI NGƯỜI DÙNG BẤM VÀO */}
        {selectedPoint.pinLabel && (
          <div className="absolute top-1/2 left-1/2 z-10 transition-all duration-300">
            {/* Tâm ngắm giải phẫu: Chạm vào để bật/tắt thẻ tên */}
            <button
              type="button"
              onClick={() => {
                playTapSound();
                setShowPinLabel(!showPinLabel);
              }}
              className="absolute -top-3.5 -left-3.5 w-7 h-7 flex items-center justify-center pointer-events-auto cursor-pointer group"
              title="Chạm vào để hiện / ẩn tên giải phẫu"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDark ? 'bg-cyan-400' : 'bg-blue-500'
                }`} />
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white shadow-md transition-transform group-hover:scale-125 ${
                  isDark ? 'bg-cyan-400' : 'bg-blue-600'
                }`} />
              </span>
            </button>

            {/* Thẻ tên vị trí: CHỈ HIỆN KHI ẤN VÀO (showPinLabel === true) */}
            {showPinLabel && (
              <div className="absolute top-[-12px] left-3 flex items-center animate-fade-in pointer-events-none">
                <div className={`w-4 sm:w-6 h-[1.5px] shadow-xs ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-500/80'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`} />
                <div className={`px-2.5 py-0.5 rounded-full shadow-lg text-[10px] font-black tracking-wide whitespace-nowrap ${
                  isDark
                    ? 'bg-slate-950/95 backdrop-blur-xs border border-cyan-400 text-cyan-200'
                    : 'bg-white/95 backdrop-blur-xs border border-blue-500 text-blue-950'
                }`}>
                  📍 {selectedPoint.pinLabel}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. DƯỚI KHUNG: CÁC KHUNG KHÁC ĐÚNG MÀU NỀN SÁNG / TỐI & BỐ CỤC CHUẨN KHÔNG CẮT CHỮ */}
      <div className="p-3 bg-slate-50/90 dark:bg-[#0B101E] border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
        {/* Hàng chọn đốt sống: Toàn bộ chiều rộng, không bị chèn nút xoay */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
          {SPINE_POINTS.map((pt) => {
            const isActive = selectedPoint.id === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => handleSelectPoint(pt)}
                className={`flex items-center justify-center px-3 py-1.5 rounded-full text-[11.5px] font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-300'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white border border-slate-200/90 dark:border-slate-700/60 shadow-2xs'
                }`}
              >
                <span>{pt.code}</span>
              </button>
            );
          })}
        </div>

        {/* 4. THẺ MÔ TẢ & LÝ GIẢI Y KHOA: ĐÚNG MÀU NỀN SÁNG / TỐI & ĐẦY ĐỦ TIÊU ĐỀ */}
        <div className="p-3 rounded-[14px] bg-white dark:bg-slate-950/60 border border-slate-200/90 dark:border-blue-900/30 shadow-2xs dark:shadow-none flex flex-col gap-2 text-left">
          {/* Thanh tiêu đề thẻ + Nút đổi góc nhìn Mặt trước / Mặt sau */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11.5px] font-black text-blue-600 dark:text-cyan-400 shrink-0">
                🎯 Điểm chỉ:
              </span>
              <span className="text-[12.5px] font-black text-slate-900 dark:text-white">
                {selectedPoint.name}
              </span>
            </div>

            {/* Nút đổi hướng nhìn trước/sau xếp tại đây gọn gàng */}
            <button
              type="button"
              onClick={handleToggleDirection}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-cyan-300 border border-slate-300/80 dark:border-cyan-500/40 text-[10.5px] font-black shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              title="Đổi góc nhìn mặt trước / sau"
            >
              <RotateCcw size={11} strokeWidth={2.5} />
              <span>{isFrontView ? 'Nhìn sau lưng' : 'Nhìn trước'}</span>
            </button>
          </div>

          <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {selectedPoint.clinicalDesc}
          </p>

          <div className="p-2 rounded-[10px] bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-1.5 text-[11.5px] leading-snug">
            <span className="shrink-0 font-bold text-amber-800 dark:text-amber-300">⚠️ Cơ chế:</span>
            <span className="text-amber-950 dark:text-amber-200/90">{selectedPoint.warningNote}</span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right pt-0.5">
            (Chạm trực tiếp vào mô hình 3D để xoay 360°)
          </div>
        </div>
      </div>
    </section>
  );
}

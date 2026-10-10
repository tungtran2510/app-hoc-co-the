'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface Spine3DFocusedWidgetProps {
  onOpenFull3D?: () => void;
}

interface SubPointDetail {
  code: string;
  name: string;
  badge?: string;
  desc: string;
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
  subDetails?: SubPointDetail[];
}

const SPINE_POINTS: SpinePoint[] = [
  {
    id: 'cervical',
    name: 'Đoạn Cổ C1 - C7 (7 Đốt Sống Cổ)',
    code: 'C1 - C7',
    pinLabel: '',
    camFront: '0,1.46,0.44,0,1.46,-0.02',
    camBack: '0,1.46,-0.44,0,1.46,-0.02',
    clinicalDesc: 'Gồm 7 đốt sống cổ nâng đỡ trọn vẹn hộp sọ (~5kg), là đoạn có biên độ cử động linh hoạt nhất của trục cơ thể với cấu tạo chuyên biệt từng đốt.',
    warningNote: 'Tư thế cúi 60° bấm điện thoại làm tăng tải trọng nén lên đĩa đệm cổ từ 5kg vọt lên tới 27kg, gây biến dạng và mất đường cong sinh lý.',
    subDetails: [
      {
        code: 'C1',
        name: 'Đốt Đội (Atlas)',
        badge: 'Nâng sọ',
        desc: 'Không có thân đốt sống và mỏm gai, hình vòng nhẫn. 2 diện khớp trên đỡ lồi cầu chẩm cho phép động tác gật đầu ("Đồng ý").',
      },
      {
        code: 'C2',
        name: 'Đốt Trục (Axis)',
        badge: 'Trục xoay',
        desc: 'Có mỏm răng (dens) dựng đứng cắm vào cung trước C1 làm trục xoay, giúp đầu quay ngang trái/phải 180° ("Lắc đầu").',
      },
      {
        code: 'C3-C5',
        name: 'Đoạn Uốn Lực & Hô Hấp',
        badge: 'TK hoành',
        desc: 'Nơi phát xuất của thần kinh hoành (C3, 4, 5) chỉ huy nhịp thở cơ hoành. Đốt C5 là đỉnh uốn cong chịu tải nhiều nhất.',
      },
      {
        code: 'C7',
        name: 'Đốt Sống Lồi (C7 Prominens)',
        badge: 'Mốc chuẩn',
        desc: 'Mỏm gai dài nhất sau gáy sờ thấy cục xương nổi gồ rõ khi cúi đầu, là mốc lâm sàng chuẩn xác để bác sĩ đếm các đốt sống.',
      },
    ],
  },
  {
    id: 'thoracic',
    name: 'Đoạn Ngực T1 - T12 (12 Đốt Ngực)',
    code: 'T1 - T12',
    pinLabel: '',
    camFront: '0,1.26,0.75,0,1.26,-0.04',
    camBack: '0,1.26,-0.75,0,1.26,-0.04',
    clinicalDesc: '12 đốt sống ngực khớp động với 12 đôi xương sườn tạo thành lồng ngực bảo vệ trái tim và phổi với độ vững chắc cao nhất.',
    warningNote: 'Ngồi gù khom lưng chèn ép dây thần kinh liên sườn, gây cảm giác đau nhói tức ngực vòng quanh mạn sườn dễ nhầm với cơn đau thắt ngực.',
    subDetails: [
      {
        code: 'T1-T12',
        name: 'Khung Lồng Ngực (Thoracic Cage)',
        desc: 'Thân đốt dày hình trái tim, có các diện khớp sườn tiếp khớp với chỏm và củ sườn tạo buồng ngực bảo vệ tim phổi.',
      },
      {
        code: 'Mỏm gai',
        name: 'Cấu trúc xếp ngói (Spinous Process)',
        desc: 'Mỏm gai chúc dốc sâu xuống dưới che chắn mặt sau ống sống, hạn chế động tác ngửa để bảo vệ nội tạng.',
      },
      {
        code: 'Đặc tính',
        name: 'Độ vững chắc cao & Biên độ hẹp',
        desc: 'Đoạn cột sống ít vận động uốn gập nhất nhằm duy trì thể tích cố định cho hoạt động hô hấp của hai lá phổi.',
      },
    ],
  },
  {
    id: 'lumbar',
    name: 'Đoạn Thắt Lưng L1 - L5 (5 Đốt Thắt Lưng)',
    code: 'L1 - L5',
    pinLabel: '',
    camFront: '0,0.98,0.48,0,0.98,-0.02',
    camBack: '0,0.98,-0.48,0,0.98,-0.02',
    clinicalDesc: '5 đốt sống thắt lưng có thân đốt to dày nhất, là trụ cột chịu lực nâng đỡ toàn bộ thân trên và hấp thu xung lực khi đứng, chạy nhảy.',
    warningNote: 'Cúi gập xoay người bê vật nặng tạo áp lực đè nén lên đĩa đệm tới 300–400kg, gây rách bao xơ, thoát vị đĩa đệm chèn ép dây thần kinh tọa.',
    subDetails: [
      {
        code: 'L1-L3',
        name: 'Trụ Chịu Tải Thắt Lưng Trên',
        desc: 'Thân đốt sống to dày hình quả thận, cuống sống khỏe giúp nâng đỡ trọng lượng nửa trên thân thể.',
      },
      {
        code: 'L4-L5',
        name: 'Bản Lề Vận Động Trọng Yếu',
        desc: 'Vùng chuyển tiếp động lực học, chịu lực uốn gập và xoắn vặn lớn nhất trong sinh hoạt hàng ngày.',
      },
      {
        code: 'Thần kinh',
        name: 'Rễ Thần Kinh Tọa (Sciatica)',
        desc: 'Lỗ gian đốt cho các rễ thần kinh L4, L5, S1 thoát ra tạo thành dây thần kinh tọa điều khiển chân.',
      },
    ],
  },
  {
    id: 'disc',
    name: 'Hệ Thống Đĩa Đệm Giảm Xóc',
    code: 'Đĩa đệm',
    pinLabel: '',
    camFront: '0.16,0.99,0.36,0,0.99,-0.01',
    camBack: '0,0.99,0.36,0,0.99,-0.01',
    clinicalDesc: 'Các khối đệm sụn sợi đàn hồi nằm giữa hai thân đốt sống, chứa nhân nhầy hoạt động như viên bi thủy lực giảm chấn cho toàn thân.',
    warningNote: 'Cúi gập xoay người bê vật nặng tạo áp lực đè nén lên đĩa đệm tới 300–400kg, dễ rách bao xơ gây thoát vị đĩa đệm chèn ép dây thần kinh tọa.',
    subDetails: [
      {
        code: 'Bao xơ',
        name: 'Vòng sợi (Annulus Fibrosus)',
        desc: 'Gồm 15–25 lớp phiến collagen đan chéo so le góc 60°, chịu lực xé vặn xoắn cực đại khi cúi gập và xoay thân.',
      },
      {
        code: 'Nhân nhầy',
        name: 'Nhân tủy (Nucleus Pulposus)',
        desc: 'Chứa 80% nước và gel proteoglycan, hoạt động như quả cầu thủy lực phân tán lực đều 360° sang các hướng.',
      },
      {
        code: 'Chịu tải',
        name: 'Bản lề L4 - L5 - S1',
        desc: 'Điểm chuyển tiếp giữa thắt lưng cử động và khung chậu cố định, hấp thu hơn 80% xung lực trọng lượng thân trên.',
      },
    ],
  },
  {
    id: 'full',
    name: 'Toàn Bộ Cột Sống (33-34 Đốt)',
    code: 'Trục 33-34 đốt',
    pinLabel: '',
    camFront: '0,1.18,1.55,0,1.18,-0.04',
    camBack: '0,1.18,-1.55,0,1.18,-0.04',
    clinicalDesc: 'Hệ thống giảm chấn tự nhiên hoàn hảo gồm 33-34 đốt sống xếp chồng với 4 đường cong sinh lý chữ S bảo vệ tủy sống toàn thân.',
    warningNote: 'Sai lệch tư thế kéo dài làm mòn đĩa đệm, gai xương, mất đường cong sinh lý và biến dạng trục khớp vận động toàn thân.',
    subDetails: [
      {
        code: 'Phân đoạn',
        name: '5 Nhóm Đốt Sống Trục',
        desc: '7 đốt cổ (C1-C7) + 12 đốt ngực (T1-T12) + 5 đốt thắt lưng (L1-L5) + 5 đốt cùng (hàn xương) + 4-5 đốt cụt.',
      },
      {
        code: 'Đường cong',
        name: '4 Đường Cong Sinh Lý Chữ S',
        desc: 'Ưỡn cổ - Gù ngực - Ưỡn thắt lưng - Gù cùng cụt: tăng sức chịu tải nén đàn hồi gấp 10 lần so với cột thẳng (R = N² + 1).',
      },
      {
        code: 'Bảo vệ',
        name: 'Ống Sống & Tủy Gai',
        desc: 'Bảo vệ toàn vẹn tủy sống và 31 đôi dây thần kinh tủy gai truyền dẫn tín hiệu thần kinh trung ương đi toàn thân.',
      },
    ],
  },
];

export default function Spine3DFocusedWidget({ onOpenFull3D }: Spine3DFocusedWidgetProps) {
  const [selectedPoint, setSelectedPoint] = useState<SpinePoint>(SPINE_POINTS[0]); // Mặc định C1 - C7
  const [isFrontView, setIsFrontView] = useState(false); // Mặc định nhìn sau lưng để thấy toàn bộ cột sống
  const [isDark, setIsDark] = useState(false);
  const [is3DActive, setIs3DActive] = useState(false); // Chống kẹt ngón tay khi cuộn trang điện thoại
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

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

  // Gửi postMessage chuyển camera và làm sáng đốt sống/đĩa đệm tức thì (KHÔNG reload iframe)
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const activeCam = isFrontView ? selectedPoint.camFront : selectedPoint.camBack;
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'NAVIGATE_SPINE',
          hl: selectedPoint.id,
          cam: activeCam,
          dir: isFrontView ? 'front' : 'back',
        }, '*');
      } catch (e) {}
    }
  }, [selectedPoint, isFrontView]);

  const handleSelectPoint = (pt: SpinePoint) => {
    playTapSound();
    setSelectedPoint(pt);
    // Khi chọn Đĩa đệm, tự động quay ra mặt trước vì đĩa đệm nằm ở mặt trước thân đốt sống
    if (pt.id === 'disc') {
      setIsFrontView(true);
    }
  };

  const handleToggleDirection = () => {
    playTapSound();
    setIsFrontView(!isFrontView);
  };

  const activeCam = isFrontView ? selectedPoint.camFront : selectedPoint.camBack;
  const themeParam = isDark ? 'dark' : 'light';
  const iframeUrl = `/3d/index.html?widget=1&theme=${themeParam}&pt=${selectedPoint.id}&hl=${selectedPoint.id}&dir=${isFrontView ? 'front' : 'back'}#sys=skeletal,joints&cam=${activeCam}&hl=${selectedPoint.id}`;

  return (
    <section
      aria-label="Khối Mô Hình 3D Cột Sống Tinh Gọn"
      className="w-full my-5 rounded-[20px] bg-white dark:bg-[#0A0F1D] border border-slate-200/90 dark:border-blue-900/40 shadow-sm dark:shadow-xl overflow-hidden text-slate-800 dark:text-white transition-colors duration-200"
    >
      {/* 1. Header tinh gọn 1 dòng: Điều khiển Xoay 3D trực tiếp trên Header, KHUNG 3D SẠCH 100% */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 dark:bg-[#0E1528] border-b border-slate-200/80 dark:border-blue-900/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-400/50 flex items-center justify-center text-[12px] shrink-0">
            🦴
          </span>
          <span className="text-[13px] font-black text-slate-900 dark:text-white whitespace-nowrap">
            Mô hình 3D Cột sống
          </span>

          {/* Nút bật/tắt xoay 3D đặt gọn gàng trên Header: Giải quyết triệt để vấn đề che chữ lên mô hình */}
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setIs3DActive(!is3DActive);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase transition-all cursor-pointer ${
              is3DActive
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-300'
                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-700/60'
            }`}
            title={is3DActive ? 'Đang bật xoay 3D - Bấm để khóa cuộn trang' : 'Bấm để bật chế độ xoay 3D 360°'}
          >
            <span>{is3DActive ? '✓ Đang xoay' : '360°'}</span>
          </button>
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

      {/* 2. KHUNG CHÍNH XEM: DÀI ĐỨNG TỶ LỆ 3x5 (ASPECT 3:5) - TUYỆT ĐỐI SẠCH BÓNG, CẤM MỌI CHỮ CHE KHUNG */}
      <div className="relative w-full max-w-[340px] aspect-[3/5] mx-auto bg-slate-100 dark:bg-[#070B14] overflow-hidden select-none border-y border-slate-200/80 dark:border-slate-800/80">
        <iframe
          ref={iframeRef}
          key={`spine-viewer-${themeParam}`}
          src={iframeUrl}
          title={`Mô hình 3D ${selectedPoint.name}`}
          className={`w-full h-full border-0 transition-opacity ${is3DActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          allow="fullscreen; accelerometer; gyroscope"
        />

        {/* Lớp bảo vệ vuốt cuộn trang vô hình: Khi is3DActive === false, chạm vào sẽ kích hoạt xoay nhẹ nhàng KHÔNG HIỆN CHỮ CHE MÀN HÌNH */}
        {!is3DActive && (
          <div
            onClick={() => {
              playTapSound();
              setIs3DActive(true);
            }}
            className="absolute inset-0 z-10 cursor-pointer bg-transparent"
            title="Chạm để xoay mô hình 3D"
          />
        )}
      </div>

      {/* 3. DƯỚI KHUNG: CÁC KHUNG KHÁC ĐÚNG MÀU NỀN SÁNG / TỐI & BỐ CỤC CHUẨN KHÔNG CẮT CHỮ */}
      <div className="p-3 bg-slate-50/90 dark:bg-[#0B101E] border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
        {/* Hàng chọn đốt sống: Toàn bộ chiều rộng, chuẩn giải phẫu C -> T -> L -> Đĩa đệm -> 33-34 đốt */}
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
        <div className="p-3 rounded-[14px] bg-white dark:bg-slate-950/60 border border-slate-200/90 dark:border-blue-900/30 shadow-2xs dark:shadow-none flex flex-col gap-2.5 text-left">
          {/* Thanh tiêu đề thẻ + Nút đổi góc nhìn Mặt trước / Mặt sau */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11.5px] font-black text-blue-600 dark:text-cyan-400 shrink-0">
                🎯 Điểm chỉ:
              </span>
              <span className="text-[12.5px] font-black text-slate-900 dark:text-white truncate">
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

          {/* DANH SÁCH CHI TIẾT CÁC ĐỐT SỐNG & Ý NGHĨA BÀI HỌC Y KHOA */}
          {selectedPoint.subDetails && selectedPoint.subDetails.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>📖 Chi tiết các đốt sống trong bài học:</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-300 font-black">
                  {selectedPoint.subDetails.length} cấu trúc
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedPoint.subDetails.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-[10px] bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-0.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[9.5px] font-black shrink-0">
                          {sub.code}
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-900 dark:text-white truncate">
                          {sub.name}
                        </span>
                      </div>
                      {sub.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-[9px] font-bold shrink-0">
                          {sub.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {sub.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hộp cảnh báo cơ chế bệnh sinh */}
          <div className="p-2 rounded-[10px] bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-1.5 text-[11.5px] leading-snug">
            <span className="shrink-0 font-bold text-amber-800 dark:text-amber-300">⚠️ Cơ chế:</span>
            <span className="text-amber-950 dark:text-amber-200/90">{selectedPoint.warningNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

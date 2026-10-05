'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, BookOpen } from 'lucide-react';

interface QbizBooksOpeningSplashProps {
  onFinish?: () => void;
  forceShow?: boolean;
}

// Cờ theo dõi trong bộ nhớ phiên làm việc của tab để khi người dùng đang lướt bài học rồi ấn quay về Trang chủ không bị hiện lại liên tục
let hasShownIntroInSession = false;

// Đánh dấu đã chiếu intro trong LẦN MỞ APP HIỆN TẠI (sessionStorage + window + module).
// Không lưu vĩnh viễn: mỗi lần mở app mới thì hiệu ứng chiếu lại đúng 1 lần.
export function markIntroAsSeenPermanent() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('qbiz_books_intro_seen', '1');
    }
    if (typeof window !== 'undefined') {
      (window as any).__qbiz_books_intro_seen = true;
    }
    hasShownIntroInSession = true;
  } catch {}
}

// Kiểm tra xem lần mở app hiện tại đã chiếu intro chưa
export function hasSeenIntroAnywhere(): boolean {
  try {
    if (hasShownIntroInSession) return true;
    if (typeof window !== 'undefined' && (window as any).__qbiz_books_intro_seen) return true;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('qbiz_books_intro_seen') === '1') return true;
  } catch {}
  return false;
}

export default function QbizBooksOpeningSplash({
  onFinish,
  forceShow = false,
}: QbizBooksOpeningSplashProps) {
  // Mặc định false để SSR không bị lệch hydration
  const [isVisible, setIsVisible] = useState(false);
  const [isBookOpened, setIsBookOpened] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Quyết định "có chiếu hay không" chỉ tính 1 lần cho mỗi lần gắn component
  const decidedRef = React.useRef<boolean | null>(null);
  // Tỉ lệ thu nhỏ khi sách mở ra để cả bìa trái + trang phải luôn nằm gọn trong màn hình điện thoại
  const [openScale, setOpenScale] = useState(1);

  useEffect(() => {
    try {
      setOpenScale(Math.max(0.6, Math.min(1, (window.innerWidth - 24) / 640)));
    } catch {}

    let shouldShow = false;

    try {
      if (decidedRef.current === null) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('skip_intro') === '1') {
          markIntroAsSeenPermanent();
          decidedRef.current = false;
        } else {
          const force = urlParams.get('intro') === '1' || forceShow;
          // Chỉ chiếu khi lần mở app này CHƯA chiếu (hoặc bị ép xem lại)
          if (!force && hasSeenIntroAnywhere()) {
            decidedRef.current = false;
          } else {
            // Đánh dấu NGAY để mọi thao tác sau đó (quay lại Trang chủ, chuyển trang, tải lại) không chiếu lần 2
            markIntroAsSeenPermanent();
            decidedRef.current = true;
          }
        }
      }
      shouldShow = decidedRef.current === true;
      setIsVisible(shouldShow);
    } catch {
      setIsVisible(false);
      return;
    }

    if (!shouldShow) return;

    // 1. Sau 400ms: Bìa sách 3D mở ra
    const tOpen = setTimeout(() => {
      setIsBookOpened(true);
    }, 400);

    // 2. Sau 1800ms: Bắt đầu tan biến dần vào trang chủ
    const tFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // 3. Sau 2200ms: Đóng hoàn toàn
    const tFinish = setTimeout(() => {
      markIntroAsSeenPermanent();
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 2200);

    // Bảo hiểm an toàn tuyệt đối: Luôn tắt sau 2500ms để không bao giờ chắn màn hình
    const tSafety = setTimeout(() => {
      markIntroAsSeenPermanent();
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(tOpen);
      clearTimeout(tFade);
      clearTimeout(tFinish);
      clearTimeout(tSafety);
    };
  }, [forceShow, onFinish]);

  // Lắng nghe sự kiện replay nếu người dùng muốn xem lại từ menu
  useEffect(() => {
    let tOpen: NodeJS.Timeout;
    let tFade: NodeJS.Timeout;
    let tFinish: NodeJS.Timeout;

    const handleReplay = () => {
      setIsVisible(true);
      setIsBookOpened(false);
      setIsFadingOut(false);
      tOpen = setTimeout(() => setIsBookOpened(true), 400);
      tFade = setTimeout(() => setIsFadingOut(true), 1800);
      tFinish = setTimeout(() => {
        markIntroAsSeenPermanent();
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 2200);
    };

    window.addEventListener('replay_qbiz_books_intro', handleReplay);
    return () => {
      window.removeEventListener('replay_qbiz_books_intro', handleReplay);
      clearTimeout(tOpen);
      clearTimeout(tFade);
      clearTimeout(tFinish);
    };
  }, [onFinish]);

  const handleDismiss = () => {
    markIntroAsSeenPermanent();
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 250);
  };

  if (!isVisible) return null;

  return (
    <div
      id="qbiz-books-3d-splash"
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-500 cursor-pointer ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#060A14',
        backgroundImage: `
          radial-gradient(circle at 50% 38%, rgba(217, 119, 6, 0.18) 0%, rgba(30, 58, 138, 0.25) 45%, transparent 75%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)
        `,
      }}
    >
      {/* Nút Khám phá ngay ở góc trên bên phải */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-amber-200 border border-amber-400/30 text-[12px] font-bold tracking-wide backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          <span>Khám phá ngay</span>
          <ChevronRight size={14} className="text-amber-300" />
        </button>
      </div>

      {/* Đom đóm / hạt bụi vàng kim bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-2 h-2 rounded-full bg-amber-300/40 blur-[1px] top-1/4 left-1/5 animate-pulse" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/50 blur-[1px] top-1/3 right-1/4 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-400/30 blur-[2px] bottom-1/3 left-1/3 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-white/60 top-2/3 right-1/5 animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      {/* TIÊU ĐỀ LUXURY TRÊN ĐẦU */}
      <div className="mb-4 sm:mb-6 flex flex-col items-center text-center px-4 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-[0.2em] shadow-xs mb-1.5">
          <Sparkles size={12} className="text-amber-400" />
          <span>TỦ SÁCH Y KHOA ĐIỆN TỬ</span>
          <Sparkles size={12} className="text-amber-400" />
        </div>
        <h1 className="text-[26px] sm:text-[32px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
          QBIZ BOOKS
        </h1>
        <p className="text-[12px] sm:text-[13px] text-slate-300/80 font-medium tracking-wide max-w-[280px] sm:max-w-none">
          Hiểu Về Cơ Thể · Kiến Thức Đúng · Sức Khỏe Bền Vững
        </p>
      </div>

      {/* KHÔNG GIAN 3D CỦA CUỐN SÁCH */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          perspective: '1400px',
          width: '320px',
          height: '420px',
        }}
      >
        {/* Bóng đổ thực tế dưới sàn */}
        <div
          className="absolute -bottom-6 w-[280px] h-[35px] rounded-[100%] bg-black/80 blur-xl transition-all duration-1000 pointer-events-none"
          style={{
            transform: isBookOpened
              ? 'scaleX(1.2) scaleY(1.3) translateY(8px) opacity-70'
              : 'scaleX(0.9) scaleY(0.9) opacity-50',
          }}
        />

        {/* Ánh sáng vàng rực từ trong lòng sách tỏa ra khi mở */}
        <div
          className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-amber-500/0 via-amber-400/35 to-yellow-300/0 blur-2xl pointer-events-none transition-all duration-1000"
          style={{
            opacity: isBookOpened ? 1 : 0,
            transform: isBookOpened ? 'scale(1.2) translateY(-10px)' : 'scale(0.8)',
          }}
        />

        {/* KHUNG THÂN CUỐN SÁCH 3D */}
        <div
          className="relative w-[260px] h-[370px] sm:w-[280px] sm:h-[400px] transition-transform duration-1000 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isBookOpened
              ? `rotateY(-6deg) rotateX(4deg) scale(${openScale}) translateX(130px) translateY(-8px)`
              : 'rotateY(-18deg) rotateX(12deg) translateY(0px)',
          }}
        >
          {/* GÁY SÁCH (BOOK SPINE - BÊN TRÁI) */}
          <div
            className="absolute top-0 bottom-0 w-[30px] rounded-l-[5px] flex flex-col items-center justify-between py-5 text-amber-300 shadow-2xl z-10"
            style={{
              left: '-28px',
              transformOrigin: 'right center',
              transform: 'rotateY(-85deg)',
              background: 'linear-gradient(to right, #091326 0%, #15274d 40%, #0d1a36 100%)',
              borderLeft: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            <div className="w-4 h-[2px] bg-amber-400/70" />
            <div
              className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/90 [writing-mode:vertical-rl] rotate-180"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              QBIZ BOOKS
            </div>
            <div className="w-4 h-[2px] bg-amber-400/70" />
          </div>

          {/* CẠNH GIẤY DÀY (STACK OF CREAMY PAGES - BÊN PHẢI) */}
          <div
            className="absolute top-2 bottom-2 right-[-14px] w-[20px] rounded-r-[4px] pointer-events-none z-10"
            style={{
              transformOrigin: 'left center',
              transform: 'rotateY(85deg)',
              background: 'repeating-linear-gradient(to bottom, #FFFDF0 0px, #FFFDF0 2px, #D4AF37 3px, #F0E6D2 4px)',
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.4)',
              borderRight: '1px solid rgba(212, 175, 55, 0.6)',
            }}
          />

          {/* TRANG LÕI BÊN PHẢI (RIGHT INNER PAGE - NẰM TRONG SÁCH) */}
          <div
            className="book-inner-page absolute inset-0 rounded-r-[12px] rounded-l-[4px] p-5 flex flex-col justify-between overflow-hidden shadow-2xl z-0"
            style={{
              backgroundColor: '#FAF7F0',
              backgroundImage: `
                radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.1) 0%, transparent 70%),
                linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.02) 8%, transparent 15%)
              `,
              border: '1px solid rgba(217, 119, 6, 0.35)',
              boxShadow: 'inset 0 0 25px rgba(217, 119, 6, 0.12), 0 15px 35px rgba(0,0,0,0.6)',
            }}
          >
            {/* Đường viền trang trí cổ điển dát vàng */}
            <div className="absolute inset-2 border border-amber-700/20 rounded-[8px] pointer-events-none" />
            <div className="absolute inset-3 border border-amber-700/10 rounded-[6px] pointer-events-none" />

            {/* Phần đầu trang trong */}
            <div className="flex flex-col items-center text-center mt-2 relative z-10">
              <span
                className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                style={{ color: '#92400E' }}
              >
                PHIÊN BẢN ĐIỆN TỬ TƯƠNG TÁC
              </span>
              <div className="w-12 h-12 rounded-[14px] bg-[#0C152B] border border-amber-400/60 p-0.5 shadow-md flex items-center justify-center mb-1.5">
                <img
                  src="/app_logo.png"
                  alt="Qbiz Books"
                  className="w-full h-full object-cover rounded-[11px]"
                />
              </div>
              <h3
                className="text-[17px] font-black tracking-tight leading-tight"
                style={{ color: '#0F172A' }}
              >
                CƠ THỂ NGƯỜI
              </h3>
              <p
                className="text-[11px] font-bold uppercase tracking-wider mt-0.5"
                style={{ color: '#B45309' }}
              >
                KHOA HỌC & GIẢI PHẪU 3D
              </p>
            </div>

            {/* Nội dung trang trí ở giữa */}
            <div className="flex flex-col items-center text-center py-1 relative z-10">
              <div className="flex items-center gap-1.5 text-amber-600/70 text-[10px] mb-2">
                <span>✦</span>
                <span className="w-12 h-[1px] bg-amber-400/50" />
                <span>❖</span>
                <span className="w-12 h-[1px] bg-amber-400/50" />
                <span>✦</span>
              </div>
              <p
                className="text-[11.5px] italic leading-relaxed font-serif px-2"
                style={{ color: '#334155' }}
              >
                "Hiểu rõ cấu trúc là chìa khóa để bảo vệ cột sống và chăm sóc sức khỏe chủ động trọn đời."
              </p>
              <span
                className="text-[10px] font-black uppercase tracking-widest mt-2"
                style={{ color: '#64748B' }}
              >
                — DR. TÙNG DINH DƯỠNG —
              </span>
            </div>

            {/* Nút bấm Khám Phá Ngay ở đáy trang */}
            <div className="flex flex-col items-center relative z-10 mb-1">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2.5 px-3 rounded-[10px] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-black text-[12px] tracking-wide shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/40"
              >
                <span>Mở sách & Học ngay</span>
                <ChevronRight size={14} className="stroke-[3]" />
              </button>
            </div>
          </div>

          {/* BÌA TRƯỚC CỦA SÁCH (THE 3D HARDCOVER - LẬT MỞ TRONG KHÔNG GIAN) */}
          <div
            onClick={() => {
              if (!isBookOpened) setIsBookOpened(true);
              else handleDismiss();
            }}
            className="absolute inset-0 rounded-r-[12px] rounded-l-[4px] cursor-pointer origin-left transition-transform duration-1000 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              zIndex: isBookOpened ? 5 : 40,
              transform: isBookOpened ? 'rotateY(-145deg)' : 'rotateY(0deg)',
              boxShadow: isBookOpened
                ? '-10px 10px 25px rgba(0,0,0,0.5)'
                : '12px 18px 30px rgba(0,0,0,0.65), 0 0 25px rgba(245, 158, 11, 0.25)',
            }}
          >
            {/* MẶT TRƯỚC BÌA SÁCH (FRONT COVER FACE) - ĐẬM ĐẶC 100% KHÔNG TRUYỀN ÁNH SÁNG */}
            <div
              className="absolute inset-0 rounded-r-[12px] rounded-l-[4px] p-5 flex flex-col justify-between overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                backgroundColor: '#091326',
                backgroundImage: 'linear-gradient(135deg, #091326 0%, #122448 45%, #182F5E 75%, #0B162C 100%)',
                border: '2px solid rgba(245, 158, 11, 0.75)',
                boxShadow: 'inset 0 0 25px rgba(0,0,0,0.85)',
              }}
            >
              {/* 4 Góc dát vàng hoa văn kim loại */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* Khung viền mạ vàng kép */}
              <div className="absolute inset-3 border border-amber-400/40 rounded-[6px] pointer-events-none" />
              <div className="absolute inset-4 border border-amber-400/20 rounded-[4px] pointer-events-none" />

              {/* Phần đỉnh bìa */}
              <div className="flex flex-col items-center text-center mt-3 relative z-10">
                <span className="text-[8.5px] font-black tracking-[0.3em] uppercase text-amber-300/80 drop-shadow-sm">
                  EDITION 2026 · INTERACTIVE
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-1" />
              </div>

              {/* Trung tâm bìa: Logo 3D dát vàng & Tên QBIZ BOOKS */}
              <div className="flex flex-col items-center justify-center my-auto relative z-10">
                {/* Huy hiệu 3D vàng kim cực sắc nét */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] p-[2.5px] bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-600 shadow-[0_8px_25px_rgba(245,158,11,0.5)] mb-3 relative overflow-hidden">
                  <img
                    src="/app_logo.png"
                    alt="Qbiz Books"
                    className="w-full h-full object-cover rounded-[19px]"
                  />
                </div>

                {/* Chữ QBIZ BOOKS mạ vàng nổi 3D */}
                <h2
                  className="text-[24px] sm:text-[27px] font-black tracking-tight leading-none text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #FFFDF0 0%, #FDE047 35%, #D97706 70%, #92400E 100%)',
                    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.8))',
                  }}
                >
                  QBIZ BOOKS
                </h2>

                <div className="flex items-center gap-2 my-1.5">
                  <span className="text-amber-400 text-[9px]">✦</span>
                  <span className="w-16 h-[1.5px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-sm" />
                  <span className="text-amber-400 text-[9px]">✦</span>
                </div>

                <p className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase text-amber-200/90 text-center">
                  TỦ SÁCH Y KHOA ĐIỆN TỬ
                </p>
                <p className="text-[9px] text-slate-300/70 font-medium text-center mt-0.5">
                  Khám Phá Cột Sống & Cơ Thể Người
                </p>
              </div>

              {/* Phần đáy bìa */}
              <div className="flex flex-col items-center text-center mb-2 relative z-10">
                <span className="text-[8.5px] font-black tracking-[0.2em] text-amber-300/70 uppercase">
                  TÁC GIẢ: DR. TÙNG DINH DƯỠNG
                </span>
                <span className="text-[7.5px] text-slate-400/60 mt-0.5">
                  CHẠM ĐỂ MỞ SÁCH • TOUCH TO OPEN
                </span>
              </div>
            </div>

            {/* MẶT SAU BÌA SÁCH (KHI MỞ SÁCH LẬT RA SAU) */}
            <div
              className="absolute inset-0 rounded-l-[12px] rounded-r-[4px] p-5 flex flex-col justify-center items-center text-center"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: '#091326',
                backgroundImage: 'linear-gradient(135deg, #101E38 0%, #0A1428 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.85)',
              }}
            >
              <div className="w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 shadow-sm">
                <BookOpen size={20} />
              </div>
              <span className="text-[13px] font-bold text-amber-200">Lời Nói Đầu</span>
              <p className="text-[11px] text-slate-300/85 italic mt-1.5 leading-relaxed px-3 font-serif">
                "Mỗi trang sách là một bước đi thấu hiểu kỳ quan cơ thể con người."
              </p>
              <div className="mt-3 flex items-center gap-1 text-[9px] text-amber-300/60 uppercase tracking-widest">
                <span>✦</span>
                <span>DR. TÙNG</span>
                <span>✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHỈ DẪN NHẸ Ở DƯỚI CÙNG */}
      <div className="mt-5 sm:mt-7 flex items-center gap-2 text-slate-400/80 text-[11.5px] font-medium z-20">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>Đang mở trang sách tri thức...</span>
      </div>
    </div>
  );
}

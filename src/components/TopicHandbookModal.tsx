'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, Phone, ArrowRight, Share2, BookOpen } from 'lucide-react';
import QRCode from 'qrcode';
import { Topic, Page, Block } from '../lib/types';
import { getUserPhone, syncUserProgress } from '../lib/userSync';
import { playTapSound, playSuccessChime } from '../lib/audioFeedback';

interface TopicHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  pages: Array<{ page: Page; orderNumber: number; videoCount?: number }>;
  blocksByPage?: Record<string, Block[]>;
}

export default function TopicHandbookModal({
  isOpen,
  onClose,
  topic,
  pages,
  blocksByPage = {},
}: TopicHandbookModalProps) {
  const [phone, setPhone] = useState('');
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [isGeneratingQr, setIsGeneratingQr] = useState(true);

  // Khởi tạo và kiểm tra số điện thoại người dùng đã lưu
  useEffect(() => {
    if (!isOpen) return;
    const existing = getUserPhone();
    if (existing) {
      setSavedPhone(existing);
      setPhone(existing);
    }
  }, [isOpen]);

  // Tạo mã QR chất lượng cao cho từng bài học trong cẩm nang
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    const generateAllQr = async () => {
      setIsGeneratingQr(true);
      const host = typeof window !== 'undefined' ? window.location.origin : 'https://app-hoc-co-the.vercel.app';
      const results: Record<string, string> = {};

      for (const item of pages) {
        if (isCancelled) break;
        const pageUrl = `${host}/${topic.slug}/${item.page.slug}`;
        try {
          const qrData = await QRCode.toDataURL(pageUrl, {
            width: 240,
            margin: 1,
            color: {
              dark: '#0F172A',
              light: '#FFFFFF',
            },
            errorCorrectionLevel: 'M',
          });
          results[item.page.id] = qrData;
        } catch {
          // Bỏ qua lỗi tạo QR
        }
      }

      if (!isCancelled) {
        setQrMap(results);
        setIsGeneratingQr(false);
      }
    };

    generateAllQr();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, topic.slug, pages]);

  if (!isOpen) return null;

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 9 || clean.length > 11) {
      setPhoneError('Vui lòng nhập số điện thoại hợp lệ (9 đến 11 số)');
      return;
    }
    setIsSubmittingPhone(true);
    setPhoneError('');
    try {
      const res = await syncUserProgress(clean, 'sync');
      if (res.success) {
        setSavedPhone(clean);
        setPhoneSuccess(true);
        playSuccessChime();
        setTimeout(() => setPhoneSuccess(false), 3000);
      } else {
        setPhoneError(res.error || 'Chưa thể lưu số, vui lòng thử lại');
      }
    } catch (err: any) {
      setPhoneError(err.message || 'Lỗi kết nối khi lưu số');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handlePrint = () => {
    playTapSound();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:overflow-visible">
      {/* Container chính */}
      <div className="w-full max-w-[820px] max-h-[95vh] bg-white dark:bg-[#120B24] rounded-t-[24px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-purple-900/60 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header điều khiển (Ẩn khi In) */}
        <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-[#1A1033] border-b border-slate-200 dark:border-purple-900/50 shrink-0 no-print">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[16px] font-black text-slate-900 dark:text-white leading-tight truncate">
                Cẩm Nang Y Khoa & Mã QR
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-purple-300 truncate">
                Bản in màu A4 chất lượng cao · Quét QR mở bài học tức thì
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-[12px] shadow-xs transition-all cursor-pointer"
              title="In ra giấy hoặc Lưu dưới dạng file PDF"
            >
              <Printer size={14} />
              <span>In cẩm nang / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-purple-900/60 text-slate-600 dark:text-purple-200 hover:bg-slate-300 dark:hover:bg-purple-800 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Đóng"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Khung cuộn nội dung */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 print:overflow-visible print:p-0">
          
          {/* Form Thu nhận SĐT Zalo (Ẩn khi In) */}
          <div className="p-3 rounded-[14px] bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-[#1E1342] dark:to-[#170E33] border border-blue-200 dark:border-purple-800/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5 no-print">
            <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-black text-[11px] shadow-xs shrink-0">
                Zalo
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[12.5px] sm:text-[13px] font-black text-slate-900 dark:text-white truncate">
                  Đăng ký nhận cẩm nang qua Zalo
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-purple-300 truncate">
                  {savedPhone ? `Đang kết nối: ${savedPhone}` : 'Nhập SĐT để nhận bản in và cập nhật mới'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePhone} className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại Zalo..."
                className="h-8 px-3 rounded-[9px] border border-slate-300 dark:border-purple-700 bg-white dark:bg-[#120A28] text-[12px] font-bold text-ink flex-1 sm:w-[170px] focus:outline-hidden focus:border-blue-600"
                disabled={isSubmittingPhone}
              />
              <button
                type="submit"
                disabled={isSubmittingPhone}
                className="h-8 px-3 rounded-[9px] bg-[#0068FF] hover:bg-[#0055D4] active:scale-95 text-white font-black text-[11.5px] shrink-0 shadow-xs transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {isSubmittingPhone ? 'Đang lưu...' : savedPhone ? 'Cập nhật' : 'Nhận cẩm nang'}
              </button>
            </form>

            {phoneError && (
              <p className="text-[11px] font-bold text-red-600 dark:text-red-400 w-full">
                {phoneError}
              </p>
            )}
            {phoneSuccess && (
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 w-full">
                ✓ Đã lưu thành công số điện thoại Zalo!
              </p>
            )}
          </div>

          {/* VÙNG IN CẨM NANG Y KHOA CHUẨN HOÁ (PRINT-READY DOCUMENT) */}
          <div id="handbook-printable-area" className="flex flex-col gap-6 text-slate-900 bg-white p-2 sm:p-6 rounded-[16px] print:p-0 print:rounded-none">
            
            {/* 1. TRANG BÌA CẨM NANG (COVER PAGE) */}
            <div className="p-4 sm:p-7 rounded-[18px] bg-gradient-to-b from-blue-900 to-[#0F172A] text-white flex flex-col items-center text-center relative overflow-hidden shadow-md print:bg-white print:text-black print:border-b-2 print:border-black print:p-4">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/20 text-[10px] font-black uppercase tracking-wider mb-2 print:border-black print:text-black">
                <span>📚 Tủ Sách Sống Khỏe Mỗi Ngày</span>
              </div>
              <h1 className="text-[20px] sm:text-[28px] font-black tracking-tight leading-tight max-w-[650px] uppercase">
                CẨM NANG Y KHOA: {topic.title}
              </h1>
              {topic.description && (
                <p className="text-[12px] sm:text-[14px] text-blue-100 max-w-[600px] mt-1.5 font-medium leading-snug print:text-slate-700 line-clamp-2">
                  {topic.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-3 text-[11px] sm:text-[12px] text-blue-200 font-semibold print:text-slate-800">
                <span className="whitespace-nowrap">Chuyên gia: Thầy Tùng Dinh Dưỡng</span>
                <span className="opacity-60">•</span>
                <span className="whitespace-nowrap">Quy mô: {pages.length} bài</span>
                <span className="opacity-60">•</span>
                <span className="whitespace-nowrap">Xuất bản: 2026</span>
              </div>
            </div>

            {/* 2. LỜI MỞ ĐẦU & HƯỚNG DẪN DÙNG MÃ QR */}
            <div className="p-4 rounded-[14px] bg-slate-50 border border-slate-200 text-[13px] leading-relaxed flex items-start gap-3 page-break-avoid">
              <div className="text-[20px] leading-none shrink-0">📱</div>
              <div className="flex-1">
                <strong className="text-slate-900 block mb-0.5 font-bold">
                  Cách học cùng Cẩm nang thông minh:
                </strong>
                <p className="text-slate-700">
                  Mỗi bài học trong cẩm nang này được trang bị một <strong>Mã QR trực tiếp</strong>. Bạn chỉ cần mở ứng dụng máy ảnh điện thoại hoặc camera Zalo quét mã QR để mở ngay video bài giảng và thực hành trực quan cùng Thầy Tùng.
                </p>
              </div>
            </div>

            {/* 3. MỤC LỤC CHUYÊN ĐỀ */}
            <div className="border border-slate-200 rounded-[14px] p-4 bg-white page-break-avoid">
              <h3 className="text-[15px] font-black uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Mục lục {pages.length} bài học trọng tâm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
                {pages.map((item, idx) => (
                  <div key={item.page.id} className="flex items-baseline gap-2 text-slate-800 font-medium">
                    <span className="font-mono font-bold text-blue-700 shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="line-clamp-1">{item.page.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. CHI TIẾT TỪNG BÀI HỌC VỚI MÃ QR TƯƠNG ỨNG */}
            <div className="flex flex-col gap-5">
              {pages.map((item, idx) => {
                const qrUrl = qrMap[item.page.id];
                const pageBlocks = blocksByPage[item.page.id] || [];
                const keyPointsBlock = pageBlocks.find(
                  (b): b is Extract<Block, { type: 'text' }> =>
                    b.type === 'text' && (b.display_style === 'diem_can_nho' || b.display_style === 'y_nghia')
                );

                return (
                  <div
                    key={item.page.id}
                    className="p-3 sm:p-4 rounded-[14px] border border-slate-200/90 bg-white flex flex-row gap-3 items-center justify-between page-break-avoid shadow-2xs print:border-black print:shadow-none"
                  >
                    {/* Phần nội dung bài học bên trái */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded-[5px] bg-blue-100 text-blue-800 font-black text-[10px] font-mono print:border print:border-black">
                          BÀI {String(idx + 1).padStart(2, '0')}
                        </span>
                        {item.videoCount ? (
                          <span className="text-[11px] text-slate-500 font-medium">
                            · {item.videoCount} video
                          </span>
                        ) : null}
                      </div>

                      <h4 className="text-[14px] sm:text-[16px] font-black text-slate-900 leading-snug line-clamp-2">
                        {item.page.title}
                      </h4>

                      {item.page.summary && (
                        <p className="text-[11.5px] sm:text-[12.5px] text-slate-600 mt-0.5 leading-snug font-normal line-clamp-2">
                          {item.page.summary}
                        </p>
                      )}

                      {/* Điểm cốt lõi nếu có */}
                      {keyPointsBlock?.data?.lines && keyPointsBlock.data.lines.length > 0 && (
                        <div className="mt-1.5 pt-1 border-t border-slate-100 hidden sm:block">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                            {keyPointsBlock.data.title || 'Điểm cốt lõi cần nhớ'}:
                          </span>
                          <ul className="list-disc pl-4 text-[11.5px] text-slate-800 space-y-0.5">
                            {keyPointsBlock.data.lines.slice(0, 2).map((line: string, lIdx: number) => (
                              <li key={lIdx}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Khung Mã QR bên phải - Tinh gọn, sắc nét */}
                    <div className="w-[84px] sm:w-[96px] flex flex-col items-center text-center shrink-0 bg-slate-50 p-1.5 rounded-[10px] border border-slate-200 print:bg-white print:border-black">
                      {qrUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={qrUrl}
                          alt={`QR ${item.page.title}`}
                          className="w-[70px] h-[70px] sm:w-[82px] sm:h-[82px] object-contain rounded-[4px]"
                        />
                      ) : (
                        <div className="w-[70px] h-[70px] bg-slate-200 rounded-[4px] flex items-center justify-center text-[9px] text-slate-500">
                          Đang tạo...
                        </div>
                      )}
                      <span className="text-[8.5px] font-bold text-slate-700 mt-1 leading-tight whitespace-nowrap">
                        Quét mở video
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5. PHẦN CHÂN TRANG & KHUYẾN CÁO Y KHOA */}
            <div className="mt-4 p-4 rounded-[14px] bg-slate-100 border border-slate-200 text-center text-[11.5px] text-slate-600 page-break-avoid">
              <p className="font-bold text-slate-800 mb-0.5">
                © Tủ Sách Sống Khỏe Mỗi Ngày · Cố vấn chuyên môn Thầy Tùng Dinh Dưỡng
              </p>
              <p>
                Khuyến cáo: Cẩm nang này được biên soạn cho mục đích giáo dục kiến thức sức khỏe cộng đồng. Mọi can thiệp điều trị bệnh lý cần được tư vấn bởi bác sĩ chuyên khoa.
              </p>
              <p className="font-mono text-[10.5px] text-blue-700 mt-1">
                https://app-hoc-co-the.vercel.app
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions (Ẩn khi In) */}
        <div className="p-3.5 px-6 bg-slate-50 dark:bg-[#1A1033] border-t border-slate-200 dark:border-purple-900/50 flex items-center justify-between no-print shrink-0">
          <span className="hidden sm:inline-block text-[12px] text-slate-500 dark:text-purple-300">
            💡 Gợi ý: Chọn máy in "Lưu dưới dạng PDF" để tải file về máy
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-[12px] bg-slate-200 dark:bg-purple-900/60 text-slate-700 dark:text-purple-200 font-bold text-[13px] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-10 px-5 rounded-[12px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-[13px] shadow-sm transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>In cẩm nang / Tải PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global CSS for Print Optimization */}
      <style jsx global>{`
        @media print {
          /* Ẩn tất cả các phần ngoài vùng cẩm nang */
          body > *:not(.fixed) {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          /* Đưa modal về dòng in phẳng */
          .fixed {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          #handbook-printable-area {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

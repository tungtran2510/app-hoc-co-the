'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, RotateCw, Sparkles, BookOpen } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  tip: string;
}

// Bộ thẻ ghi nhớ cốt lõi theo từng bài hoặc chuyên đề
const TOPIC_FLASHCARDS: Record<string, FlashcardItem[]> = {
  'cot-song': [
    {
      id: 'cs-1',
      question: 'Đĩa đệm nhận chất dinh dưỡng theo cơ chế nào?',
      answer: 'Theo cơ chế THẨM THẤU sinh học khi vận động nhịp nhàng (nén - nhả), vì đĩa đệm người trưởng thành không có mạch máu nuôi trực tiếp.',
      tip: 'Chính vì vậy, ngồi bất động quá 60 phút sẽ làm đĩa đệm nhanh bị thoái hóa!',
    },
    {
      id: 'cs-2',
      question: 'Khi nhấc vật nặng, tư thế nào bảo vệ cột sống tốt nhất?',
      answer: 'Luôn gập gối, hạ thấp hông, giữ lưng thẳng và dùng lực cơ đùi để nâng lên (tuyệt đối không cúi gập cong lưng).',
      tip: 'Giữ vật càng sát thân mình càng giảm áp lực lên đốt sống thắt lưng L4-L5.',
    },
    {
      id: 'cs-3',
      question: 'Dấu hiệu "Cờ đỏ" cảnh báo đĩa đệm cần can thiệp y tế ngay?',
      answer: 'Đau lan nhanh xuống bàn chân, tê bì yếu liệt cơ hoặc xuất hiện rối loạn đại tiểu tiện (hội chứng chùm đuôi ngựa).',
      tip: 'Khi có dấu hiệu này, cần đến ngay bệnh viện chuyên khoa để chụp MRI kiểm tra.',
    },
  ],
  'nuoc': [
    {
      id: 'w-1',
      question: 'Thời điểm vàng nào trong ngày cần uống nước ấm ngay?',
      answer: 'Ngay sau khi thức dậy vào buổi sáng: Uống 250 - 300ml nước ấm từng ngụm nhỏ để kích hoạt nhu động ruột và thanh lọc tế bào.',
      tip: 'Giúp bù lại lượng nước bị hao hụt qua hô hấp và bài tiết suốt đêm dài.',
    },
    {
      id: 'w-2',
      question: 'Tại sao cụm phân tử nước nhỏ lại quan trọng với tế bào?',
      answer: 'Cụm phân tử nước siêu nhỏ thẩm thấu xuyên qua kênh Aquaporin của màng tế bào nhanh hơn gấp nhiều lần, tăng hiệu quả chuyển hóa.',
      tip: 'Nước tốt không chỉ là nước sạch, mà còn phải dễ dàng hấp thu vào sâu bên trong tế bào.',
    },
  ],
  'dinh-duong': [
    {
      id: 'dd-1',
      question: 'Triết lý cốt lõi về dinh dưỡng phục hồi tế bào là gì?',
      answer: 'Cơ thể có khả năng tự phục hồi mạnh mẽ nếu được cung cấp đủ nguyên liệu chuẩn: đạm sạch, chất béo tốt (Omega-3), vitamin & khoáng chất.',
      tip: 'Giảm tối đa đường tinh luyện và thực phẩm siêu chế biến gây viêm âm thầm.',
    },
  ],
};

interface LessonFlashcardsProps {
  topicSlug: string;
  pageTitle: string;
}

export default function LessonFlashcards({ topicSlug, pageTitle }: LessonFlashcardsProps) {
  const cards = TOPIC_FLASHCARDS[topicSlug] || TOPIC_FLASHCARDS['cot-song'];
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [rememberedIds, setRememberedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`qbiz_flashcards_${topicSlug}`);
      if (stored) {
        setRememberedIds(JSON.parse(stored));
      }
    } catch {}
  }, [topicSlug]);

  const toggleFlip = (id: string) => {
    playTapSound();
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRemembered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound();
    const updated = { ...rememberedIds, [id]: !rememberedIds[id] };
    setRememberedIds(updated);
    try {
      localStorage.setItem(`qbiz_flashcards_${topicSlug}`, JSON.stringify(updated));
    } catch {}
  };

  const rememberedCount = cards.filter((c) => rememberedIds[c.id]).length;

  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-[#170E33] dark:via-[#140B2D] dark:to-[#0E0720] border border-indigo-200/80 dark:border-purple-800/50 p-3 sm:p-3.5 shadow-2xs mt-3">
      {/* Header thanh lịch chuẩn 1 dòng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-2xs">
            🧠
          </span>
          <span className="text-[12.5px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
            Ôn Tập 1 Chạm · Ghi Nhớ Sâu
          </span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-purple-900/60 text-indigo-700 dark:text-purple-300 border border-indigo-200/80 shrink-0 whitespace-nowrap">
          Đã nhớ: {rememberedCount}/{cards.length}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
        Chạm vào thẻ để kiểm tra phản xạ và xem giải thích cốt lõi:
      </p>

      {/* Danh sách Flashcards */}
      <div className="flex flex-col gap-2 pt-0.5">
        {cards.map((card, idx) => {
          const isFlipped = Boolean(flippedIds[card.id]);
          const isRemembered = Boolean(rememberedIds[card.id]);

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className={`p-3 rounded-[14px] border transition-all cursor-pointer select-none active:scale-[0.99] flex flex-col gap-2 ${
                isFlipped
                  ? 'bg-white dark:bg-[#1D1240] border-indigo-400 dark:border-purple-500 shadow-xs'
                  : 'bg-white/80 dark:bg-[#160D32]/80 border-slate-200 dark:border-purple-800/40 hover:border-indigo-300'
              }`}
            >
              {/* Mặt trên / Câu hỏi */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10.5px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-purple-950 text-slate-700 dark:text-purple-300 shrink-0">
                    Câu {idx + 1}
                  </span>
                  <span className="text-[12px] font-extrabold text-slate-900 dark:text-white leading-snug">
                    {card.question}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => toggleRemembered(card.id, e)}
                    className={`p-1 rounded-full transition-colors ${
                      isRemembered
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={isRemembered ? 'Đã thuộc câu này' : 'Đánh dấu đã thuộc'}
                  >
                    <CheckCircle2 size={16} strokeWidth={isRemembered ? 2.8 : 2} />
                  </button>
                  <RotateCw
                    size={13}
                    className={`text-slate-400 transition-transform ${isFlipped ? 'rotate-180 text-indigo-600' : ''}`}
                  />
                </div>
              </div>

              {/* Mặt dưới / Đáp án khi lật */}
              {isFlipped ? (
                <div className="pt-2 border-t border-slate-100 dark:border-purple-800/40 flex flex-col gap-1 animate-in fade-in duration-150">
                  <p className="text-[11.5px] font-semibold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    💡 <strong className="text-slate-900 dark:text-white">Cốt lõi:</strong> {card.answer}
                  </p>
                  {card.tip && (
                    <p className="text-[10.5px] text-slate-500 dark:text-purple-300/70 italic">
                      Lưu ý: {card.tip}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-[10.5px] font-bold text-indigo-600 dark:text-purple-300">
                  <span>Chạm để lật đáp án y khoa</span>
                  <span>Chạm 1 giây ↵</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

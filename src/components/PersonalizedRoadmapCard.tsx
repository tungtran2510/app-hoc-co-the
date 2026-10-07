'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, ChevronRight, RotateCcw, ArrowRight } from 'lucide-react';

interface QuestionOption {
  id: string;
  label: string;
  icon: string;
}

const QUESTIONS = [
  {
    step: 1,
    title: 'Thói quen chính hằng ngày của bạn?',
    options: [
      { id: 'office', label: 'Ngồi văn phòng nhiều', icon: '💻' },
      { id: 'driving', label: 'Lái xe / Di chuyển liên tục', icon: '🚗' },
      { id: 'active', label: 'Vận động / Đứng nhiều', icon: '🏃' },
    ],
  },
  {
    step: 2,
    title: 'Vùng cơ thể bạn hay mỏi nhất?',
    options: [
      { id: 'neck', label: 'Cổ vai gáy âm ỉ', icon: '💆' },
      { id: 'lumbar', label: 'Thắt lưng & Cột sống', icon: '🧘' },
      { id: 'joints', label: 'Khớp gối & Vận động', icon: '🦵' },
      { id: 'water', label: 'Uể oải & Thiếu nước', icon: '💧' },
    ],
  },
  {
    step: 3,
    title: 'Mục tiêu học tập hiện tại của bạn?',
    options: [
      { id: 'prevent', label: 'Phòng ngừa & Chỉnh tư thế', icon: '🛡️' },
      { id: 'relieve', label: 'Giảm mỏi nhức cấp tốc', icon: '⚡' },
      { id: 'family', label: 'Chăm sóc sức khỏe người thân', icon: '👨‍👩‍👧' },
    ],
  },
];

interface RecommendedLesson {
  title: string;
  topicSlug: string;
  pageSlug: string;
  tag: string;
  reason: string;
}

// Bảng đề xuất 3 bài học tối ưu theo vùng mỏi & thói quen (hỗ trợ tùy chỉnh từ Tùng Dinh Dưỡng)
function getRecommendations(
  area: string,
  habit: string,
  customRoadmap?: Record<string, RecommendedLesson[]> | null
): RecommendedLesson[] {
  if (customRoadmap && customRoadmap[area] && customRoadmap[area].length >= 3) {
    return customRoadmap[area];
  }

  if (area === 'water') {
    return [
      {
        title: 'Vai trò tối thượng của nước với tế bào',
        topicSlug: 'chuyen-de-nuoc',
        pageSlug: 'vai-tro-cua-nuoc-voi-co-the',
        tag: 'Bài 01',
        reason: 'Trao đổi chất',
      },
      {
        title: 'Nước và sức khỏe đĩa đệm cột sống',
        topicSlug: 'chuyen-de-nuoc',
        pageSlug: 'nuoc-va-dia-dem-cot-song',
        tag: 'Bài 02',
        reason: 'Nuôi đĩa đệm',
      },
      {
        title: 'Quy tắc bổ sung nước & điện giải',
        topicSlug: 'chuyen-de-nuoc',
        pageSlug: 'uong-nuoc-dung-cach',
        tag: 'Bài 03',
        reason: 'Thực hành hằng ngày',
      },
    ];
  }

  if (area === 'lumbar' || habit === 'driving') {
    return [
      {
        title: 'Cấu tạo cơ bản đốt sống thắt lưng',
        topicSlug: 'chuyen-de-cot-song',
        pageSlug: 'cau-tao-co-ban-dot-song',
        tag: 'Bài 01',
        reason: 'Trục chịu lực',
      },
      {
        title: 'Đĩa đệm và cơ chế giảm xóc cột sống',
        topicSlug: 'chuyen-de-cot-song',
        pageSlug: 'dia-dem-va-chuc-nang-giam-xoc',
        tag: 'Bài 02',
        reason: 'Bảo vệ đĩa đệm',
      },
      {
        title: 'Tư thế ngồi và giảm tải cột sống',
        topicSlug: 'chuyen-de-cot-song',
        pageSlug: 'tu-the-va-van-dong',
        tag: 'Bài 03',
        reason: 'Ứng dụng thực tế',
      },
    ];
  }

  // Mặc định hoặc Cổ vai gáy
  return [
    {
      title: 'Đốt sống cổ và góc áp lực đầu cúi',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'cau-tao-co-ban-dot-song',
      tag: 'Bài 01',
      reason: 'Bảo vệ cổ gáy',
    },
    {
      title: 'Cơ gân & dây chằng vùng cổ gáy',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'co-gan-va-day-chang',
      tag: 'Bài 02',
      reason: 'Giải tỏa co thắt',
    },
    {
      title: 'Tư thế làm việc văn phòng chuẩn',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'tu-the-va-van-dong',
      tag: 'Bài 03',
      reason: 'Chỉnh dáng làm việc',
    },
  ];
}

export default function PersonalizedRoadmapCard() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<{ habit?: string; area?: string; goal?: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [customRoadmap, setCustomRoadmap] = useState<Record<string, RecommendedLesson[]> | null>(null);

  // Đọc cài đặt Bật/Tắt & Dữ liệu khảo sát & Tùy chỉnh lộ trình
  useEffect(() => {
    try {
      const savedRoadmapSetting = localStorage.getItem('qbiz_enable_personalized_roadmap');
      if (savedRoadmapSetting === 'false') {
        setIsEnabled(false);
      }

      const savedCustom = localStorage.getItem('qbiz_custom_roadmap');
      if (savedCustom) {
        setCustomRoadmap(JSON.parse(savedCustom));
      }

      const savedAnswers = localStorage.getItem('qbiz_personalized_answers');
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        if (parsed?.habit && parsed?.area && parsed?.goal) {
          setAnswers(parsed);
          setIsCompleted(true);
        }
      }
    } catch {}

    const handleSettingChange = (e: any) => {
      if (e?.detail?.enabled !== undefined) {
        setIsEnabled(e.detail.enabled);
      } else {
        const saved = localStorage.getItem('qbiz_enable_personalized_roadmap');
        setIsEnabled(saved !== 'false');
      }
    };

    const handleCustomChange = (e: any) => {
      if (e?.detail?.roadmap) {
        setCustomRoadmap(e.detail.roadmap);
      } else {
        try {
          const saved = localStorage.getItem('qbiz_custom_roadmap');
          if (saved) setCustomRoadmap(JSON.parse(saved));
        } catch {}
      }
    };

    window.addEventListener('qbiz_roadmap_setting_changed', handleSettingChange);
    window.addEventListener('qbiz_custom_roadmap_changed', handleCustomChange);
    return () => {
      window.removeEventListener('qbiz_roadmap_setting_changed', handleSettingChange);
      window.removeEventListener('qbiz_custom_roadmap_changed', handleCustomChange);
    };
  }, []);

  if (!isEnabled) return null;

  const handleSelectOption = (optionId: string) => {
    if (currentStep === 1) {
      setAnswers((prev) => ({ ...prev, habit: optionId }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setAnswers((prev) => ({ ...prev, area: optionId }));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const finalAnswers = { ...answers, goal: optionId };
      setAnswers(finalAnswers);
      setIsCompleted(true);
      try {
        localStorage.setItem('qbiz_personalized_answers', JSON.stringify(finalAnswers));
      } catch {}
    }
  };

  const handleResetSurvey = () => {
    setIsCompleted(false);
    setCurrentStep(1);
    setAnswers({});
    try {
      localStorage.removeItem('qbiz_personalized_answers');
    } catch {}
  };

  const recommendations = getRecommendations(answers.area || 'neck', answers.habit || 'office', customRoadmap);

  return (
    <section className="flex flex-col gap-2 p-3.5 sm:p-4 rounded-[20px] bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-[#0B1528] dark:via-[#09101F] dark:to-[#060D1A] border border-slate-200/90 dark:border-blue-900/50 shadow-xs relative overflow-hidden transition-all">
      {/* Vệt sáng xanh Navy trang trí tinh tế */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Đầu thẻ: Icon La bàn Xanh Navy + Tiêu đề + Nút Làm lại */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-[11px] bg-gradient-to-br from-[#0E2A5C] via-[#1E3A8A] to-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Compass size={17} className="animate-spin-slow text-sky-200" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-[13px] font-black text-[#0E2A5C] dark:text-sky-100 truncate">
              {isCompleted ? 'Gợi ý lộ trình' : 'Định hướng lộ trình'}
            </h3>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#0E2A5C] bg-blue-50 border border-blue-200 dark:text-sky-300 dark:bg-blue-950/70 dark:border-blue-800 px-1.5 py-0.2 rounded-md shrink-0">
              Demo
            </span>
          </div>
        </div>

        {isCompleted && (
          <button
            type="button"
            onClick={handleResetSurvey}
            className="flex items-center gap-1 text-[11px] font-extrabold text-[#0E2A5C] dark:text-sky-300 hover:text-blue-900 bg-blue-50/90 dark:bg-blue-950/60 px-2.5 py-1 rounded-[10px] shrink-0 cursor-pointer border border-blue-200/80 dark:border-blue-800/80 transition-colors"
            title="Làm lại khảo sát"
          >
            <RotateCcw size={11} />
            <span className="whitespace-nowrap">Đổi nhu cầu</span>
          </button>
        )}
      </div>

      {/* Nội dung 1: Khi chưa hoàn tất khảo sát (Hiển thị từng câu hỏi 1 chạm) */}
      {!isCompleted ? (
        <div className="flex flex-col gap-2.5 pt-1 relative z-10">
          <div className="flex items-center justify-between text-[11.5px] font-bold text-slate-500 dark:text-slate-400">
            <span className="truncate">Bước {currentStep}/3: {QUESTIONS[currentStep - 1].title}</span>
            <span className="shrink-0 text-[#0E2A5C] dark:text-sky-400 font-extrabold">{currentStep * 33}%</span>
          </div>

          {/* Thanh tiến độ bước - Tông Xanh Navy sang trọng */}
          <div className="w-full h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0E2A5C] via-[#1E3A8A] to-[#0284C7] transition-all duration-300 rounded-full"
              style={{ width: `${currentStep * 33.33}%` }}
            />
          </div>

          {/* Danh sách lựa chọn 1 chạm (Button Card tinh gọn Xanh Navy) */}
          <div className="grid grid-cols-1 gap-1.5 pt-0.5">
            {QUESTIONS[currentStep - 1].options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className="h-10 px-3 rounded-[12px] bg-white dark:bg-[#0E1A33] border border-slate-200/90 dark:border-blue-900/50 hover:border-[#0284C7] dark:hover:border-sky-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[15px] shrink-0">{opt.icon}</span>
                  <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0E2A5C] dark:group-hover:text-sky-300">
                    {opt.label}
                  </span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-[#0284C7] transition-transform group-hover:translate-x-0.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Nội dung 2: Đã hoàn tất khảo sát -> Ghim ngay 3 bài học tối ưu */
        <div className="flex flex-col gap-2 pt-1 relative z-10">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span className="truncate">Đã tối ưu theo thể trạng và thói quen sinh hoạt của bạn:</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {recommendations.map((lesson, idx) => (
              <Link
                key={idx}
                href={`/${lesson.topicSlug}/${lesson.pageSlug}`}
                className="p-2.5 rounded-[14px] bg-white dark:bg-[#0E1A33] border border-slate-200/80 dark:border-blue-900/50 hover:border-[#0284C7] hover:bg-blue-50/40 dark:hover:bg-blue-950/40 flex items-center justify-between gap-2.5 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-[8px] bg-blue-100 dark:bg-blue-950 text-[#0E2A5C] dark:text-sky-300 text-[11px] font-black flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-black text-slate-900 dark:text-white truncate group-hover:text-[#0E2A5C] dark:group-hover:text-sky-300 transition-colors">
                      {lesson.title}
                    </span>
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                      {lesson.tag} · {lesson.reason}
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-[#0284C7] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

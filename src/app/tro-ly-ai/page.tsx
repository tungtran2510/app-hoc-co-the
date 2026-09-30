'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Send,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Loader2,
  Bot,
  User,
  HelpCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { checkAdminStatus } from '../../lib/adminAuth';
import { AiTrainingConfig } from '../../lib/types';
import EditAiTrainingModal from '../../components/admin/EditAiTrainingModal';

interface SuggestedPage {
  title: string;
  topic_title: string;
  topic_slug: string;
  page_slug: string;
  reason?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggested_pages?: SuggestedPage[];
  follow_up_questions?: string[];
  timestamp: number;
}

const QUICK_PROMPTS = [
  'Thoát vị đĩa đệm có tập xà đơn được không?',
  'Đau thắt lưng lan xuống chân thì nên học bài nào?',
  'Bài tập giảm đau mỏi cổ vai gáy cho dân văn phòng?',
  'Bị thoái hóa khớp gối có nên đi bộ không?',
  'Chế độ dinh dưỡng phục hồi sụn khớp và đĩa đệm?',
  'Tư thế ngủ đúng giúp bảo vệ cột sống?',
];

// Hàm format text markdown đơn giản (bold, bullet) siêu gọn gàng
function renderFormattedText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Xử lý gạch đầu dòng
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
    const cleanLine = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

    // Xử lý **in đậm**
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-extrabold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={idx} className="flex items-start gap-1.5 my-0.5 text-ink text-[13px] leading-snug">
          <span className="text-primary font-black shrink-0 mt-0.5 text-[10px]">•</span>
          <span className="flex-1 min-w-0">{renderedParts}</span>
        </div>
      );
    }

    if (!line.trim()) {
      return <div key={idx} className="h-1" />;
    }

    return (
      <p key={idx} className="text-ink text-[13px] leading-snug my-0.5">
        {renderedParts}
      </p>
    );
  });
}

export default function AiAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<AiTrainingConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTrainingConfig = () => {
    fetch('/api/ai/training')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ai_training) {
          setTrainingConfig(data.ai_training);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkAdminStatus().then(({ isAdmin: adminOk }) => {
      setIsAdmin(adminOk);
      if (adminOk) {
        fetchTrainingConfig();
      }
    });
  }, []);

  // Load lịch sử chat từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_assistant_chat_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem('ai_assistant_chat_v1', JSON.stringify(newMessages));
    } catch {
      // ignore
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (confirm('Bạn có muốn làm mới cuộc trò chuyện với Trợ lý AI?')) {
      saveMessages([]);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi máy chủ khi phản hồi');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'Xin lỗi bạn, mình chưa thể xử lý câu trả lời lúc này.',
        suggested_pages: data.suggested_pages || [],
        follow_up_questions: data.follow_up_questions || [],
        timestamp: Date.now(),
      };

      saveMessages([...updatedMessages, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'Xin lỗi bạn, kết nối tới Trợ lý AI bị gián đoạn một chút. Bạn vui lòng thử lại hoặc bấm vào các chủ đề bài học ngoài trang chủ nhé!',
        timestamp: Date.now(),
      };
      saveMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* 1. THANH TIÊU ĐỀ TRÊN CÙNG (STICKY) */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-line shadow-2xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-2 flex items-center justify-center text-ink hover:bg-surface-3 transition-colors cursor-pointer shrink-0"
            aria-label="Về trang chủ"
          >
            <ArrowLeft size={17} />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Sparkles size={16} className="animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="text-[14.5px] sm:text-[16px] font-extrabold text-ink leading-tight truncate">
                <span>Trợ lý Sức Khỏe AI</span>
              </h1>
              <span className="text-[10.5px] sm:text-[11px] text-muted font-medium truncate">
                Tư vấn chăm sóc sức khỏe chủ động
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowTrainingModal(true)}
              className="flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-[9px] bg-primary-soft hover:bg-primary/20 text-primary border border-primary/25 text-[11.5px] font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
              title="Cài đặt & Huấn luyện tri thức AI"
            >
              <Sliders size={12} strokeWidth={2.5} />
              <span>Cài đặt AI</span>
              {(trainingConfig?.documents?.length || 0) > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[9.5px] font-bold">
                  {trainingConfig?.documents?.length}
                </span>
              )}
            </button>
          )}

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center gap-1 h-8 px-2 rounded-[9px] bg-surface-2 hover:bg-surface-3 text-muted hover:text-ink text-[11.5px] font-bold transition-colors cursor-pointer shrink-0"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG TIN NHẮN */}
      <main className="flex-1 flex flex-col px-3.5 sm:px-4 pt-2.5 pb-36 max-w-[640px] w-full mx-auto gap-3">
        {/* BANNER QUẢN TRỊ VIÊN: HUẤN LUYỆN KIẾN THỨC AI (SIÊU GỌN 1 DÒNG) */}
        {isAdmin && (
          <div className="px-3 py-1.5 rounded-[12px] bg-primary-soft/80 border border-primary/25 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Sparkles size={11} />
              </span>
              <span className="text-[11.5px] font-extrabold text-primary truncate">
                Quản trị AI: {trainingConfig?.documents?.length || 0} tài liệu • {trainingConfig?.faqs?.length || 0} hỏi đáp
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowTrainingModal(true)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-[7px] bg-primary hover:bg-primary-dark text-white text-[11px] font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
            >
              <Sliders size={11} />
              <span>Nạp tri thức</span>
            </button>
          </div>
        )}

        {/* MÀN HÌNH CHÀO MỪNG NẾU CHƯA CÓ TIN NHẮN */}
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3.5 pt-1 animate-in fade-in duration-300">
            {/* Thẻ giới thiệu Trợ lý */}
            <div className="p-3.5 sm:p-4 rounded-[18px] bg-gradient-to-br from-primary-soft/40 via-white to-white border border-primary/20 shadow-2xs flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-ink leading-snug">
                    Xin chào! Bạn cần tìm hiểu gì hôm nay?
                  </h2>
                  <p className="text-[11.5px] text-muted truncate">
                    Trợ lý Sức Khỏe AI đồng hành 24/7
                  </p>
                </div>
              </div>

              <p className="text-[12.5px] text-ink/85 leading-snug pt-1 border-t border-primary/10">
                Hỏi về cấu trúc cơ thể, thói quen sinh hoạt đúng, bài tập an toàn hoặc tìm kiếm bài học hướng dẫn trong ứng dụng!
              </p>
            </div>

            {/* Gợi ý câu hỏi nhanh */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted px-1 flex items-center gap-1.5">
                <HelpCircle size={13} className="text-primary" />
                <span>Câu hỏi thường gặp (Chạm để hỏi ngay):</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left p-2.5 rounded-[12px] bg-white hover:bg-primary-soft/50 border border-line hover:border-primary/40 text-[12.5px] font-bold text-ink leading-snug transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-2"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <ChevronRight size={14} className="text-muted group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DANH SÁCH TIN NHẮN ĐÃ TRAO ĐỔI */
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 ${
                    isUser ? 'items-end' : 'items-start'
                  } animate-in fade-in duration-200`}
                >
                  {/* Bong bóng tin nhắn */}
                  <div
                    className={`max-w-[94%] sm:max-w-[88%] shadow-2xs transition-all ${
                      isUser
                        ? 'px-3.5 py-2 rounded-[16px] rounded-br-[4px] bg-primary text-white text-[13.5px] font-medium leading-snug'
                        : 'p-3 sm:p-3.5 rounded-[16px] rounded-tl-[4px] bg-gradient-to-br from-[#F2F8F6] via-white to-white border border-primary/25 text-ink'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div>
                        {/* Mini Header AI */}
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-primary/15 text-[11px] font-extrabold text-primary">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                              <Bot size={10} />
                            </span>
                            <span className="tracking-wide uppercase text-[10.5px]">Trợ lý Sức Khỏe AI</span>
                          </div>
                          <span className="text-[10px] text-primary/70 font-semibold">Tài liệu tác giả</span>
                        </div>

                        {/* Nội dung trả lời */}
                        <div>{renderFormattedText(msg.text)}</div>
                      </div>
                    )}
                  </div>

                  {/* THẺ BÀI HỌC GỢI Ý ĐI KÈM CỦA AI (THIẾT KẾ DÒNG NGANG SIÊU GỌN GÀNG) */}
                  {!isUser && msg.suggested_pages && msg.suggested_pages.length > 0 && (
                    <div className="w-full max-w-[94%] sm:max-w-[88%] flex flex-col gap-1.5 mt-0.5">
                      <div className="flex items-center gap-1.5 px-0.5 text-[10.5px] font-black text-primary uppercase tracking-wider">
                        <BookOpen size={12} />
                        <span>Bài học đề xuất nên xem:</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {msg.suggested_pages.map((sp, sIdx) => {
                          const cleanPageSlug = sp.page_slug
                            .replace(new RegExp(`^${sp.topic_slug}/`), '')
                            .replace(/^\//, '');
                          const lessonUrl = `/${sp.topic_slug}/${cleanPageSlug}`;

                          return (
                            <Link
                              key={sIdx}
                              href={lessonUrl}
                              className="group flex items-center gap-2.5 p-2 rounded-[12px] bg-gradient-to-r from-primary-soft/40 via-white to-white hover:from-primary-soft/80 border border-primary/25 hover:border-primary shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-[7px] bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                                <BookOpen size={13} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-[9.5px] font-extrabold uppercase text-primary tracking-wider truncate">
                                  {sp.topic_title}
                                </div>
                                <h4 className="text-[12.5px] font-extrabold text-ink leading-tight truncate group-hover:text-primary transition-colors">
                                  {sp.title}
                                </h4>
                                {sp.reason && (
                                  <p className="text-[11px] text-muted leading-tight truncate mt-0.5">
                                    {sp.reason}
                                  </p>
                                )}
                              </div>

                              <div className="shrink-0 flex items-center gap-0.5 text-[10px] font-extrabold text-primary bg-primary-soft/90 group-hover:bg-primary group-hover:text-white px-2 py-1 rounded-[6px] transition-colors whitespace-nowrap">
                                <span>Học ngay</span>
                                <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CÂU HỎI GỢI Ý TIẾP THEO (FOLLOW UP) */}
                  {!isUser && msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                    <div className="w-full max-w-[94%] sm:max-w-[88%] flex flex-col gap-1 mt-0.5">
                      <span className="text-[10.5px] font-bold text-muted px-0.5 flex items-center gap-1">
                        <span>💡</span>
                        <span>Gợi ý hỏi tiếp:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.follow_up_questions.map((fq, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleSendMessage(fq)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-primary hover:text-white border border-primary/20 hover:border-primary text-[11px] font-bold text-ink-2 hover:text-white text-left transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1 leading-tight group"
                          >
                            <span className="text-primary group-hover:text-white text-[10px]">💬</span>
                            <span className="line-clamp-1">{fq}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* TRẠNG THÁI ĐANG TRẢ LỜI */}
            {isLoading && (
              <div className="flex items-center gap-2 max-w-[85%] p-2 px-3 rounded-[12px] bg-white border border-primary/20 shadow-2xs text-[12px] text-muted animate-in fade-in duration-200">
                <Loader2 size={13} className="animate-spin text-primary shrink-0" />
                <span className="truncate">Trợ lý Sức Khỏe đang tra cứu bài học...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 3. THANH NHẬP CÂU HỎI Ở ĐÁY MÀN HÌNH (CỐ ĐỊNH TRÊN BOTTOM NAV) */}
      <div className="fixed bottom-[72px] sm:bottom-[76px] left-0 right-0 z-20 flex justify-center bg-white/95 backdrop-blur-md border-t border-line px-3 sm:px-4 py-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[640px] flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về cơ thể, thói quen đúng, bài tập..."
              disabled={isLoading}
              className="w-full h-10 sm:h-11 pl-3.5 pr-9 rounded-[14px] bg-surface border border-line text-[13.5px] sm:text-[14px] text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-hidden transition-all shadow-inner-xs"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[12px] font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            aria-label="Gửi câu hỏi"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>

      {/* 4. THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
      <BottomNav />

      {/* 5. MODAL HUẤN LUYỆN KIẾN THỨC CHO AI (DÀNH CHO ADMIN) */}
      {isAdmin && (
        <EditAiTrainingModal
          isOpen={showTrainingModal}
          initialConfig={trainingConfig}
          onClose={() => setShowTrainingModal(false)}
          onSaved={(newConfig) => {
            setTrainingConfig(newConfig);
            const sysMsg: ChatMessage = {
              id: `sys-${Date.now()}`,
              role: 'assistant',
              text: '✨ **Đã cập nhật kho tri thức huấn luyện AI thành công!** Mình đã ghi nhớ toàn bộ tài liệu và nguyên tắc mới bạn vừa nạp. Hãy thử đặt câu hỏi liên quan để kiểm tra câu trả lời nhé!',
              timestamp: Date.now(),
            };
            saveMessages([...messages, sysMsg]);
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Play,
  Mic,
  MicOff,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { checkAdminStatus } from '../../lib/adminAuth';
import { AiTrainingConfig } from '../../lib/types';
import EditAiTrainingModal from '../../components/admin/EditAiTrainingModal';
import { playTapSound } from '../../lib/audioFeedback';

interface SuggestedPage {
  title: string;
  topic_title: string;
  topic_slug: string;
  page_slug: string;
  video_index?: number;
  video_title?: string;
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

const DEFAULT_QUICK_PROMPTS = [
  'Tại sao ngồi nhiều hay bị đau lưng và mỏi cổ vai gáy?',
  'Thoát vị đĩa đệm và trượt đốt sống thì nguyên tắc bảo tồn ra sao?',
  'Uống nước như thế nào để đĩa đệm và sụn khớp không bị khô?',
  'Tại sao hay bị đầy bụng khó tiêu sau bữa ăn?',
];

// GỢI Ý CÂU HỎI THỰC TẾ BÁM ĐUỔI THEO TỪNG CHUYÊN ĐỀ Y KHOA (ĐÚNG TRỌNG TÂM)
const TOPIC_QUICK_PROMPTS: Record<string, string[]> = {
  'cot-song': [
    'Cấu tạo đĩa đệm và cơ chế gây đau thắt lưng, thoái hóa?',
    'Nguyên tắc tư thế nằm, ngồi chuẩn để bảo vệ cột sống?',
    'Thoát vị đĩa đệm và trượt đốt sống cần chú ý điều gì?',
    'Cong vẹo cột sống ảnh hưởng thế nào đến nội tạng và tuần hoàn?',
  ],
  'nuoc': [
    '4 thời điểm vàng uống nước để hấp thu tối đa cho cơ thể?',
    'Nước nội bào và ngoại bào khác nhau thế nào, tại sao cần bù khoáng?',
    'Uống nước sai lầm gây gánh nặng gì cho thận và tế bào?',
    'Cách tính lượng nước uống chuẩn theo cân nặng hàng ngày?',
  ],
  'tieu-hoa': [
    'Trục ruột - não và vai trò của 100 nghìn tỷ vi khuẩn đường ruột?',
    'Nguyên nhân gây trào ngược dạ dày, đầy hơi khó tiêu sau ăn?',
    'Thời gian tiêu hóa thức ăn qua dạ dày và ruột non là bao lâu?',
    'Chế độ ăn như thế nào để phục hồi niêm mạc ruột tự nhiên?',
  ],
  'he-tieu-hoa': [
    'Trục ruột - não và vai trò của 100 nghìn tỷ vi khuẩn đường ruột?',
    'Nguyên nhân gây trào ngược dạ dày, đầy hơi khó tiêu sau ăn?',
    'Thời gian tiêu hóa thức ăn qua dạ dày và ruột non là bao lâu?',
    'Chế độ ăn như thế nào để phục hồi niêm mạc ruột tự nhiên?',
  ],
  'noi-tiet-chuyen-hoa': [
    'Cơ chế đề kháng Insulin dẫn đến tiểu đường tuýp 2?',
    'Tại sao mỡ nội tạng lại nguy hiểm hơn mỡ dưới da?',
    'Nhịp sinh học ăn uống giúp tối ưu chuyển hóa năng lượng ATP?',
    'Dấu hiệu rối loạn chuyển hóa đường huyết sớm cần nhận biết?',
  ],
  'gan-mat-tuy': [
    'Cơ chế giải độc 2 pha (Phase 1 & Phase 2) của gan là gì?',
    'Dịch mật giữ vai trò gì trong việc nhũ hóa chất béo và tiêu hóa?',
    'Làm sao để bảo vệ tuyến tụy không bị quá tải đường và cồn?',
    'Thực phẩm tự nhiên hỗ trợ phục hồi và hạ men gan hiệu quả?',
  ],
  'mien-dich': [
    'Tại sao 70% hệ miễn dịch của cơ thể lại nằm ở đường ruột?',
    'Bạch cầu và cơ chế tiêu diệt vi khuẩn, virus xâm nhập?',
    'Những yếu tố hàng đầu làm suy giảm kháng thể tự nhiên?',
    'Dinh dưỡng và giấc ngủ giúp tăng cường miễn dịch ra sao?',
  ],
  'dinh-duong': [
    'Cân đối tỷ lệ đạm, chất béo tốt và tinh bột theo nhu cầu cơ thể?',
    'Dinh dưỡng học tế bào và chu trình tạo năng lượng ATP?',
    'Nhận diện các bẫy dinh dưỡng công nghiệp và đường ẩn?',
    'Các vi chất và vitamin thiết yếu cơ thể không tự tổng hợp được?',
  ],
  'co-the-nguoi': [
    'Tổng quan 11 hệ cơ quan phối hợp nhịp nhàng trong cơ thể người?',
    'Tuần hoàn máu và vai trò cung cấp oxy nuôi dưỡng tế bào não?',
    'Cân bằng nội môi (Homeostasis) là gì và tầm quan trọng?',
    'Cơ chế tự phục hồi và tái tạo tế bào tự nhiên của cơ thể?',
  ],
};

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
        <div key={idx} className="flex items-start gap-1.5 my-0.5 text-ink text-[13.5px] leading-relaxed">
          <span className="text-primary font-black shrink-0 mt-1 text-[10px]">•</span>
          <span className="flex-1 min-w-0">{renderedParts}</span>
        </div>
      );
    }

    if (!line.trim()) {
      return <div key={idx} className="h-1.5" />;
    }

    return (
      <p key={idx} className="text-ink text-[13.5px] leading-relaxed my-0.5">
        {renderedParts}
      </p>
    );
  });
}

function AiAssistantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const pageParam = searchParams.get('page');
  const topicTitleParam = searchParams.get('topicTitle');
  const pageTitleParam = searchParams.get('pageTitle');
  const qParam = searchParams.get('q');

  const [activeLesson, setActiveLesson] = useState<{
    topic_slug: string;
    topic_title: string;
    page_slug?: string;
    page_title?: string;
    page_summary?: string;
  } | null>(null);

  // Đọc ngữ cảnh bài học từ URL Params hoặc sessionStorage để AI bám đuổi
  useEffect(() => {
    if (topicParam) {
      const defaultTopicTitles: Record<string, string> = {
        'cot-song': 'Cột Sống',
        'nuoc': 'Nước & Điện Giải',
        'tieu-hoa': 'Hệ Tiêu Hóa',
        'he-tieu-hoa': 'Hệ Tiêu Hóa',
        'noi-tiet-chuyen-hoa': 'Nội Tiết & Chuyển Hóa',
        'gan-mat-tuy': 'Gan - Mật - Tụy',
        'mien-dich': 'Hệ Miễn Dịch',
        'dinh-duong': 'Dinh Dưỡng Nền Tảng',
        'co-the-nguoi': 'Cơ Thể Người Toàn Diện',
      };
      const ctx = {
        topic_slug: topicParam,
        topic_title: topicTitleParam || defaultTopicTitles[topicParam] || topicParam,
        page_slug: pageParam || undefined,
        page_title: pageTitleParam || undefined,
      };
      setActiveLesson(ctx);
      try {
        sessionStorage.setItem('qbiz_current_lesson', JSON.stringify(ctx));
      } catch {}
      return;
    }

    try {
      const raw = sessionStorage.getItem('qbiz_current_lesson');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.topic_slug) {
          setActiveLesson(parsed);
        }
      }
    } catch {}
  }, [topicParam, pageParam, topicTitleParam, pageTitleParam]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyMessages, setHistoryMessages] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<AiTrainingConfig | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trạng thái Micro nghe liên tục (Continuous Speech Recognition)
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef('');
  const currentInputRef = useRef(input);

  useEffect(() => {
    currentInputRef.current = input;
  }, [input]);

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Trình duyệt chưa hỗ trợ nhận diện giọng nói. Vui lòng mở bằng Google Chrome, Safari hoặc Edge.');
      setTimeout(() => setSpeechError(''), 4500);
      return;
    }

    try {
      playTapSound();
      setSpeechError('');
      baseTextRef.current = currentInputRef.current;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const sessionTranscript = (finalTranscript + ' ' + interimTranscript).trim();
        const base = baseTextRef.current ? (baseTextRef.current.trim() + ' ') : '';
        const newText = base + sessionTranscript;
        setInput(newText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setSpeechError('Vui lòng cấp quyền truy cập Micro trên trình duyệt để sử dụng tính năng nói.');
          setTimeout(() => setSpeechError(''), 5000);
        } else if (event.error === 'no-speech') {
          // Bỏ qua lỗi ngắt câu để tiếp tục nghe liên tục
        }
      };

      recognition.onend = () => {
        // Tự động khởi động lại phiên nhận diện mới để duy trì "Nghe liên tục" không bị ngắt quãng
        if (isListeningRef.current) {
          try {
            baseTextRef.current = currentInputRef.current;
            recognition.start();
          } catch (e) {
            setTimeout(() => {
              if (isListeningRef.current) {
                try {
                  baseTextRef.current = currentInputRef.current;
                  recognition.start();
                } catch (retryErr) {
                  isListeningRef.current = false;
                  setIsListening(false);
                }
              }
            }, 300);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch (err: any) {
      console.error('Không thể mở SpeechRecognition:', err);
      isListeningRef.current = false;
      setIsListening(false);
      setSpeechError('Không thể mở micro: ' + (err?.message || 'vui lòng thử lại.'));
      setTimeout(() => setSpeechError(''), 4500);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      playTapSound();
      stopListening();
    } else {
      startListening();
    }
  };

  // Dọn dẹp micro khi rời trang
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setLoadingStep(0);
      timer = setTimeout(() => {
        setLoadingStep(1);
      }, 2200);
    } else {
      setLoadingStep(0);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

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
    fetchTrainingConfig();
    checkAdminStatus().then(({ isAdmin: adminOk }) => {
      setIsAdmin(adminOk);
    });
  }, []);

  interface PromptOption {
    icon: string;
    title: string;
    fullQuery: string;
  }

  // GỢI Ý CÂU HỎI TRỌNG TÂM TRÊN ĐỈNH ĐẦU (ĐÚNG YÊU CẦU: GỌN GÀNG, BÀI HỌC RÚT RA, SAI LẦM, ỨNG DỤNG)
  const topSuggestedPrompts = React.useMemo<PromptOption[]>(() => {
    if (activeLesson?.page_title) {
      const pTitle = activeLesson.page_title;
      return [
        {
          icon: '💡',
          title: `Bài học rút ra từ bài này là gì?`,
          fullQuery: `Bài học rút ra từ bài học "${pTitle}" là gì? Tóm tắt thật ngắn gọn các điểm cốt lõi nhất.`,
        },
        {
          icon: '🎯',
          title: `Ý nghĩa cốt lõi của ${pTitle.toLowerCase()}?`,
          fullQuery: `Ý nghĩa cốt lõi và cơ chế hoạt động của ${pTitle.toLowerCase()} đối với cơ thể là gì?`,
        },
        {
          icon: '⚠️',
          title: `Sai lầm cần tránh liên quan đến bài này?`,
          fullQuery: `Những sai lầm phổ biến nhất trong sinh hoạt cần tránh liên quan đến ${pTitle.toLowerCase()}?`,
        },
        {
          icon: '🌿',
          title: `Ứng dụng vào thực tế hàng ngày ra sao?`,
          fullQuery: `Cách ứng dụng kiến thức bài "${pTitle}" vào thói quen sinh hoạt và chăm sóc sức khỏe hàng ngày?`,
        },
      ];
    }

    if (activeLesson?.topic_title) {
      const tTitle = activeLesson.topic_title;
      return [
        {
          icon: '💡',
          title: `Bài học rút ra từ chuyên đề ${tTitle}?`,
          fullQuery: `Bài học và nguyên tắc quan trọng nhất rút ra từ chuyên đề ${tTitle} là gì?`,
        },
        {
          icon: '🎯',
          title: `Cơ chế cốt lõi của ${tTitle.toLowerCase()}?`,
          fullQuery: `Cơ chế sinh lý học cốt lõi của ${tTitle.toLowerCase()} đối với sức khỏe cơ thể?`,
        },
        {
          icon: '⚠️',
          title: `Những sai lầm hay gặp nhất?`,
          fullQuery: `Những sai lầm phổ biến nhất gây tổn hại đến ${tTitle.toLowerCase()} và cách phòng tránh?`,
        },
        {
          icon: '🌿',
          title: `Thói quen chăm sóc đúng hàng ngày?`,
          fullQuery: `Chế độ ăn uống và thói quen sinh hoạt tốt nhất cho ${tTitle.toLowerCase()}?`,
        },
      ];
    }

    return [
      {
        icon: '💡',
        title: 'Tư thế nằm, ngồi chuẩn cho cột sống?',
        fullQuery: 'Nguyên tắc tư thế nằm, ngồi chuẩn để bảo vệ đĩa đệm và cột sống?',
      },
      {
        icon: '💧',
        title: '4 thời điểm vàng uống nước trong ngày?',
        fullQuery: '4 thời điểm vàng uống nước để hấp thu tối đa cho cơ thể?',
      },
      {
        icon: '🌿',
        title: 'Trục ruột - não và hệ vi sinh đường ruột?',
        fullQuery: 'Trục ruột - não và vai trò của 100 nghìn tỷ vi khuẩn đường ruột?',
      },
      {
        icon: '🔥',
        title: 'Cơ chế kháng Insulin & mỡ nội tạng?',
        fullQuery: 'Cơ chế đề kháng Insulin dẫn đến tiểu đường và cách giảm mỡ nội tạng?',
      },
    ];
  }, [activeLesson?.page_title, activeLesson?.topic_title]);

  // Load lịch sử chat từ localStorage vào historyMessages (giữ màn hình mở đầu sạch sẽ, thoáng đãng)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_assistant_chat_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized: ChatMessage[] = parsed.map((m: any) => {
            if (m.role === 'assistant' && typeof m.text === 'string') {
              let cleaned = m.text
                .replace(/(?:tác giả\s+)?(?:tùng\s+)?(?:dinh dưỡng\s+)?(?:không phải|chưa phải)(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
                .replace(/tôi không phải(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
                .replace(/\bkhông phải bác sĩ\b/gi, '')
                .trim();
              if (cleaned.length > 0) {
                cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
              }
              return {
                ...m,
                text: cleaned,
              };
            }
            return m;
          });
          setHistoryMessages(sanitized);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showHistory]);

  const saveMessages = (newSessionMessages: ChatMessage[]) => {
    setMessages(newSessionMessages);
    setHistoryMessages((prev) => {
      const merged = [...prev];
      for (const sm of newSessionMessages) {
        if (!merged.some((m) => m.id === sm.id)) {
          merged.push(sm);
        }
      }
      try {
        localStorage.setItem('ai_assistant_chat_v1', JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const handleClearChat = () => {
    if (messages.length === 0 && historyMessages.length === 0) return;
    if (confirm('Bạn có muốn làm mới cuộc trò chuyện với Trợ lý AI?')) {
      setMessages([]);
      setHistoryMessages([]);
      setShowHistory(false);
      try {
        localStorage.removeItem('ai_assistant_chat_v1');
      } catch {}
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    if (isListeningRef.current) {
      stopListening();
    }
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
      const historyPayload = [...historyMessages, ...messages, userMsg].slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: historyPayload,
          context: activeLesson ? {
            topic_slug: activeLesson.topic_slug,
            topic_title: activeLesson.topic_title,
            page_slug: activeLesson.page_slug,
            page_title: activeLesson.page_title,
            page_summary: activeLesson.page_summary,
          } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi máy chủ khi phản hồi');
      }

      const data = await res.json();

      let cleanAnswer = (data.answer || 'Xin lỗi bạn, mình chưa thể xử lý câu trả lời lúc này.')
        .replace(/(?:tác giả\s+)?(?:tùng\s+)?(?:dinh dưỡng\s+)?(?:không phải|chưa phải)(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
        .replace(/tôi không phải(?:\s+là)?\s+bác sĩ[.,;:\-—–]?\s*/gi, '')
        .replace(/\bkhông phải bác sĩ\b/gi, '')
        .trim();
      if (cleanAnswer.length > 0) {
        cleanAnswer = cleanAnswer.charAt(0).toUpperCase() + cleanAnswer.slice(1);
      }

      const rawFollowUps: string[] = Array.isArray(data.follow_up_questions) ? data.follow_up_questions : [];
      const cleanFollowUps = rawFollowUps.filter((fq: string) => {
        if (!fq || typeof fq !== 'string') return false;
        const lq = fq.toLowerCase();
        return !(
          lq.includes('doctorloan') ||
          lq.includes('doctor loan') ||
          lq.includes('hydro gems') ||
          lq.includes('gems') ||
          lq.includes('thiết bị') ||
          lq.includes('sản phẩm') ||
          lq.includes('thương hiệu') ||
          lq.includes('nhãn hiệu') ||
          lq.includes('gối') ||
          lq.includes('ghế') ||
          lq.includes('bài tập') ||
          lq.includes('tập gì') ||
          lq.includes('tập luyện') ||
          lq.includes('nằm ngủ') ||
          lq.includes('tư thế ngủ')
        );
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: cleanAnswer || data.answer,
        suggested_pages: data.suggested_pages || [],
        follow_up_questions: cleanFollowUps,
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

  // Xử lý nạp sẵn câu hỏi nếu có tham số q (nhưng không tự động gửi để tránh màn hình bị ngợp chữ)
  useEffect(() => {
    if (qParam && !input) {
      setInput(qParam);
    }
  }, [qParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Hàm render danh sách tin nhắn chat đẹp mắt, chuyên nghiệp
  const renderMessageList = (msgList: ChatMessage[]) => {
    return msgList.map((msg) => {
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
                ? 'px-3.5 py-2 rounded-[16px] rounded-br-[4px] bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-[13.5px] font-medium leading-snug'
                : 'p-3 sm:p-3.5 rounded-[16px] rounded-tl-[4px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 text-slate-900 dark:text-white'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{msg.text}</p>
            ) : (
              <div>
                {/* Mini Header AI */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-purple-800/30 text-[11px] font-extrabold text-primary dark:text-[#F8DF7B]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4.5 h-4.5 rounded-[5px] bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles size={10} className="text-amber-300" />
                    </span>
                    <span className="tracking-wide uppercase text-[10.5px]">Trợ lý Sức Khỏe AI</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-purple-300/70 font-semibold">Tài liệu tác giả</span>
                </div>

                {/* Nội dung trả lời */}
                <div>{renderFormattedText(msg.text)}</div>

                {/* Dòng lưu ý y khoa siêu ngắn gọn, khuất tầm nhìn, đúng 1-2 dòng */}
                <div className="mt-1.5 pt-1 border-t border-slate-100/60 dark:border-purple-800/20 flex items-center gap-1 text-[9.5px] sm:text-[10px] text-slate-400/80 dark:text-purple-300/50 italic">
                  <span className="shrink-0 not-italic text-[9px] opacity-70">⚕️</span>
                  <span className="line-clamp-2 leading-tight">
                    * Thông tin tham khảo, không thay thế chẩn đoán y khoa.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* THẺ BÀI HỌC GỢI Ý ĐI KÈM CỦA AI */}
          {!isUser && msg.suggested_pages && msg.suggested_pages.length > 0 && (
            <div className="w-full max-w-[96%] sm:max-w-[90%] flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-1.5 px-0.5 text-[11px] font-black text-primary dark:text-[#F8DF7B] uppercase tracking-wider">
                <BookOpen size={13} strokeWidth={2.5} />
                <span>Bài học đề xuất nên xem:</span>
              </div>

              <div className="flex flex-col gap-2">
                {msg.suggested_pages.map((sp, sIdx) => {
                  const cleanPageSlug = sp.page_slug
                      .replace(new RegExp(`^${sp.topic_slug}/`), '')
                      .replace(/^\//, '');
                  const vQuery = sp.video_index ? `v=${sp.video_index}&` : '';
                  const lessonUrl = `/${sp.topic_slug}/${cleanPageSlug}?${vQuery}autoplay=1`;
                  const topicIcon = `/images/topics/${sp.topic_slug}.png`;
                  const displayTitle = sp.video_title || sp.title;

                  return (
                    <Link
                      key={sIdx}
                      href={lessonUrl}
                      className="group flex items-center gap-3 p-2.5 rounded-[15px] bg-white hover:bg-primary-soft dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 hover:border-primary/50 dark:hover:border-[#F8DF7B]/60 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[11px] bg-slate-50 dark:bg-purple-950/70 border border-slate-200 dark:border-purple-800/50 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={topicIcon}
                          alt={sp.topic_title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-primary dark:text-[#F8DF7B]">
                          <BookOpen size={16} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] sm:text-[10.5px] font-black uppercase text-primary dark:text-[#F8DF7B] tracking-wider truncate max-w-[140px]">
                            {sp.topic_title}
                          </span>
                          {sp.video_index ? (
                            <span className="px-1.5 py-0.5 rounded-[5px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9.5px] font-black tracking-tight">
                              Video {sp.video_index < 10 ? `0${sp.video_index}` : sp.video_index}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-primary dark:group-hover:text-[#F8DF7B] transition-colors mt-0.5">
                          {displayTitle}
                        </h4>
                        {sp.reason && (
                          <p className="text-[11.5px] text-slate-500 dark:text-purple-300/80 leading-tight truncate mt-0.5 font-medium">
                            {sp.reason}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-[11px] sm:text-[11.5px] font-black text-primary bg-primary-soft group-hover:bg-primary group-hover:text-white dark:bg-purple-950/80 dark:text-[#F8DF7B] dark:group-hover:bg-[#F8DF7B] dark:group-hover:text-slate-900 px-2.5 py-1.5 rounded-[8px] border border-primary/25 dark:border-purple-800/50 transition-colors whitespace-nowrap shadow-2xs">
                        <Play size={11} fill="currentColor" />
                        <span>Phát ngay</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CÂU HỎI GỢI Ý TIẾP THEO (FOLLOW UP) */}
          {!isUser && msg.follow_up_questions && msg.follow_up_questions.length > 0 && (() => {
            const cleanList = msg.follow_up_questions.filter((fq) => {
              if (!fq || typeof fq !== 'string') return false;
              const lq = fq.toLowerCase();
              return !(
                lq.includes('doctorloan') ||
                lq.includes('doctor loan') ||
                lq.includes('hydro gems') ||
                lq.includes('gems') ||
                lq.includes('thiết bị') ||
                lq.includes('sản phẩm') ||
                lq.includes('thương hiệu') ||
                lq.includes('nhãn hiệu') ||
                lq.includes('gối') ||
                lq.includes('ghế') ||
                lq.includes('bài tập') ||
                lq.includes('tập gì') ||
                lq.includes('tập luyện') ||
                lq.includes('nằm ngủ') ||
                lq.includes('tư thế ngủ')
              );
            });
            if (cleanList.length === 0) return null;
            return (
              <div className="w-full max-w-[94%] sm:max-w-[88%] flex flex-col gap-1 mt-0.5">
                <span className="text-[10.5px] font-bold text-muted px-0.5 flex items-center gap-1">
                  <span>💡</span>
                  <span>Gợi ý hỏi tiếp:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {cleanList.map((fq, fIdx) => (
                    <button
                      key={fIdx}
                      type="button"
                      onClick={() => handleSendMessage(fq)}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-[#160D30] hover:bg-primary hover:text-white border border-primary/20 dark:border-purple-800/40 hover:border-primary text-[11px] font-bold text-ink-2 hover:text-white text-left transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1 leading-tight group"
                    >
                      <span className="text-primary group-hover:text-white text-[10px]">💬</span>
                      <span className="line-clamp-1">{fq}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 1. THANH TIÊU ĐỀ TRÊN CÙNG (STICKY) */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-white/95 dark:bg-[#100922]/95 backdrop-blur-md border-b border-line dark:border-[#2A184D] shadow-2xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-2 flex items-center justify-center text-ink hover:bg-surface-3 transition-colors cursor-pointer shrink-0"
            aria-label="Về trang chủ"
          >
            <ArrowLeft size={17} />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-50 dark:bg-purple-950/60 text-amber-700 dark:text-[#F8DF7B] flex items-center justify-center shrink-0 border border-amber-200 dark:border-purple-800/40">
              <Sparkles size={16} className="animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#160D30]" />
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

          {(messages.length > 0 || historyMessages.length > 0) && (
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

      {/* THANH BÁM ĐUỔI NGỮ CẢNH BÀI HỌC (STICKY DƯỚI HEADER) */}
      {activeLesson && (activeLesson.page_title || activeLesson.topic_title) && (
        <div className="sticky top-[53px] sm:top-[57px] z-19 bg-gradient-to-r from-blue-50 via-indigo-50/80 to-purple-50 dark:from-purple-950/90 dark:to-indigo-950/70 border-b border-blue-200/80 dark:border-purple-800/60 px-3.5 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-purple-600 text-white flex items-center justify-center shrink-0 text-[11px] shadow-2xs font-black animate-pulse">
              🎯
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase text-blue-700 dark:text-[#F8DF7B] tracking-wider">
                  Đang bám sát bài học
                </span>
                {activeLesson.topic_title && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-purple-900/60 text-blue-800 dark:text-purple-200 text-[9.5px] font-extrabold truncate max-w-[130px]">
                    {activeLesson.topic_title}
                  </span>
                )}
              </div>
              <span className="text-[12.5px] font-black text-slate-900 dark:text-white truncate">
                {activeLesson.page_title || activeLesson.topic_title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeLesson.topic_slug && activeLesson.page_slug && (
              <Link
                href={`/${activeLesson.topic_slug}/${activeLesson.page_slug}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white dark:bg-[#1E1342] hover:bg-blue-50 dark:hover:bg-purple-900/60 text-blue-700 dark:text-[#F8DF7B] border border-blue-200 dark:border-purple-800/60 text-[11px] font-extrabold shadow-2xs transition-all active:scale-95 whitespace-nowrap"
              >
                <span>‹ Về bài học</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveLesson(null);
                try {
                  sessionStorage.removeItem('qbiz_current_lesson');
                } catch {}
              }}
              className="w-6 h-6 rounded-full bg-slate-200/80 dark:bg-purple-900/50 hover:bg-slate-300 dark:hover:bg-purple-800 text-slate-600 dark:text-purple-300 flex items-center justify-center text-[11px] font-bold transition-colors cursor-pointer"
              title="Thoát bám đuổi để hỏi tự do toàn bộ chủ đề"
              aria-label="Thoát bám đuổi bài học"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. KHUNG NỘI DUNG TIN NHẮN */}
      <main className="flex-1 flex flex-col px-3.5 sm:px-4 pt-2.5 pb-36 max-w-[640px] w-full mx-auto gap-2.5">
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

        {/* GỢI Ý CÂU HỎI TRÊN ĐỈNH ĐẦU (GỌN GÀNG, ĐẸP MẮT THEO ĐÚNG YÊU CẦU) */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-purple-300/80 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>Gợi ý câu hỏi:</span>
            </span>

            {/* Nút xem lịch sử trò chuyện cũ nếu có */}
            {historyMessages.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-[#F8DF7B] hover:underline cursor-pointer active:scale-95 transition-all"
              >
                <span>{showHistory ? 'Ẩn lịch sử cũ ▴' : `Lịch sử cũ (${historyMessages.length}) ▾`}</span>
              </button>
            )}
          </div>

          {/* 4 thẻ gợi ý câu hỏi gọn gàng trên đỉnh đầu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {topSuggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt.fullQuery)}
                className="text-left px-3 py-2 rounded-[12px] bg-white dark:bg-[#160D30] hover:bg-blue-50/80 dark:hover:bg-purple-900/40 border border-slate-200/90 dark:border-purple-800/40 hover:border-blue-400/60 dark:hover:border-purple-500/50 shadow-2xs transition-all cursor-pointer group flex items-center justify-between gap-2 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] shrink-0">{prompt.icon}</span>
                  <span className="text-[12px] sm:text-[12.5px] font-bold text-slate-700 dark:text-purple-100 group-hover:text-blue-700 dark:group-hover:text-[#F8DF7B] truncate">
                    {prompt.title}
                  </span>
                </div>
                <ChevronRight size={13} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#F8DF7B] shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* LỊCH SỬ TIN NHẮN CŨ (KHI ĐƯỢC BẬT MỞ) */}
        {showHistory && historyMessages.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2 pb-2 border-b border-dashed border-slate-200 dark:border-purple-800/40">
            <div className="text-center text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-purple-400 py-1">
              📜 Lịch sử các cuộc trò chuyện trước ({historyMessages.length} tin nhắn)
            </div>
            {renderMessageList(historyMessages)}
            <div className="text-center text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-purple-400 py-1">
              --- Cuộc trò chuyện hiện tại ---
            </div>
          </div>
        )}

        {/* TIN NHẮN PHIÊN HIỆN TẠI HOẶC MÀN HÌNH TRẮNG THOÁNG ĐÃNG */}
        {messages.length > 0 ? (
          <div className="flex flex-col gap-3 pt-1">
            {renderMessageList(messages)}
          </div>
        ) : !showHistory ? (
          /* MÀN HÌNH GẦN NHƯ TRẮNG, THOÁNG ĐÃNG, RỘNG RÃI THEO ĐÚNG YÊU CẦU CỦA NGƯỜI DÙNG */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] text-center px-4 py-8 select-none pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-slate-100/80 dark:bg-purple-950/40 border border-slate-200/60 dark:border-purple-800/30 flex items-center justify-center text-slate-400 dark:text-purple-300 mb-2.5 opacity-60">
              <Bot size={22} />
            </div>
            <p className="text-[13px] text-slate-400 dark:text-purple-300/70 font-medium max-w-[280px]">
              {activeLesson?.page_title
                ? `Chọn câu hỏi gợi ý phía trên hoặc gõ câu hỏi bất kỳ về "${activeLesson.page_title}" bên dưới`
                : 'Sẵn sàng giải đáp mọi thắc mắc sức khỏe & giải phẫu của bạn'}
            </p>
          </div>
        ) : null}

        {/* TRẠNG THÁI ĐANG TRẢ LỜI */}
        {isLoading && (
          <div className="flex items-start sm:items-center gap-2.5 max-w-[92%] p-2.5 px-3.5 rounded-[14px] bg-white dark:bg-[#160D30] border border-primary/25 dark:border-purple-800/50 shadow-xs text-[12px] sm:text-[12.5px] text-ink-2 dark:text-purple-200 animate-in fade-in duration-200 leading-snug">
            <Loader2 size={15} className="animate-spin text-primary shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-medium">
              {loadingStep === 0
                ? '🔍 Trợ lý AI đang tra cứu kho tài liệu y khoa chuyên sâu...'
                : '⏳ Câu hỏi chuyên sâu, vui lòng chờ trong giây lát để AI tổng hợp giải pháp y khoa chuẩn xác nhất...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 3. THANH NHẬP CÂU HỎI Ở ĐÁY MÀN HÌNH (CỐ ĐỊNH TRÊN BOTTOM NAV) */}
      <div className="fixed bottom-[72px] sm:bottom-[76px] left-0 right-0 z-20 flex flex-col items-center bg-white/95 dark:bg-[#100922]/95 backdrop-blur-md border-t border-line dark:border-[#2A184D] px-3 sm:px-4 py-2">
        {/* Banner trạng thái Micro đang nghe liên tục */}
        {isListening && (
          <div className="w-full max-w-[640px] mb-1.5 flex items-center justify-between px-3 py-1 rounded-[10px] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 text-[11.5px] font-bold text-red-600 dark:text-red-300">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="truncate">Đang nghe liên tục... Hãy nói tự nhiên</span>
            </span>
            <button
              type="button"
              onClick={stopListening}
              className="text-[11px] underline font-extrabold hover:text-red-700 dark:hover:text-red-200 cursor-pointer shrink-0 ml-2"
            >
              Dừng nghe
            </button>
          </div>
        )}

        {speechError && (
          <div className="w-full max-w-[640px] mb-1.5 px-3 py-1.5 rounded-[10px] bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-[11.5px] font-semibold text-amber-800 dark:text-amber-200">
            ⚠️ {speechError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[640px] flex items-center gap-1.5 sm:gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? "Đang nghe bạn nói liên tục..."
                  : activeLesson?.page_title
                  ? `Hỏi về ${activeLesson.page_title} (hoặc hỏi rộng tự do)...`
                  : activeLesson?.topic_title
                  ? `Hỏi về ${activeLesson.topic_title} (hoặc hỏi rộng tự do)...`
                  : "Hỏi về cơ thể, thói quen đúng, bài tập..."
              }
              disabled={isLoading}
              className={`w-full h-10 sm:h-11 pl-3.5 pr-9 rounded-[14px] bg-surface dark:bg-[#160D30] border ${
                isListening
                  ? 'border-red-500 ring-2 ring-red-400/40'
                  : 'border-line dark:border-purple-900/50'
              } text-[13.5px] sm:text-[14px] text-ink placeholder:text-muted focus:border-primary dark:focus:bg-[#160D30] focus:outline-hidden transition-all shadow-inner-xs`}
            />
            {input && !isListening && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[12px] font-bold p-1"
                aria-label="Xóa văn bản"
              >
                ✕
              </button>
            )}
            {isListening && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>

          {/* Nút Micro Nghe liên tục (đặt cạnh nút gửi theo đúng yêu cầu) */}
          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-md shadow-red-500/40 ring-2 ring-red-400 animate-pulse'
                : 'bg-white dark:bg-[#1E1342] text-slate-700 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40 hover:bg-slate-50 dark:hover:bg-purple-900/40 shadow-xs'
            }`}
            title={isListening ? 'Đang nghe liên tục (Bấm để dừng)' : 'Bật Micro nghe liên tục'}
            aria-label={isListening ? 'Dừng nghe liên tục' : 'Bật Micro nghe liên tục'}
          >
            {isListening ? (
              <MicOff size={18} strokeWidth={2.3} className="text-white" />
            ) : (
              <Mic size={18} strokeWidth={2.3} className="text-slate-700 dark:text-purple-200" />
            )}
          </button>

          {/* Nút Gửi câu hỏi */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-900/20 shrink-0 cursor-pointer active:scale-95"
            aria-label="Gửi câu hỏi"
            title="Gửi câu hỏi"
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

export default function AiAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="flex items-center gap-2 text-ink-2 font-bold text-[14px]">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span>Đang tải Trợ lý AI...</span>
          </div>
        </div>
      }
    >
      <AiAssistantContent />
    </Suspense>
  );
}

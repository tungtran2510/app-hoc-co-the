'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Upload,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Layers,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ZoomIn,
  ZoomOut,
  Edit2,
  Check,
  Type,
  Crop,
} from 'lucide-react';
import { checkIsAdminClient } from '../lib/adminAuth';
import { renderPageToCanvas } from '../lib/atlasCanvasGenerator';
import SideBooksFlipEngine, { SideBooksFlipEngineRef } from './SideBooksFlipEngine';
import { getBookFlipbookPages, BookInfoInput } from '../lib/bookFlipbookData';
import { uploadImageFile } from '../lib/storageUpload';
import ImageCropModal from './admin/ImageCropModal';

export interface FlipbookPage {
  id: string;
  pageNum: number;
  title: string;
  badge?: string;
  imageUrl?: string;
  category?: string;
  content?: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    bullets?: string[];
    highlight?: string;
    diagramType?: 'spine_overview' | 'cervical' | 'thoracic' | 'lumbar' | 'sacrum' | 'disc_anatomy' | 'ligaments' | 'herniation' | 'ergonomics';
  };
}

// 11 trang giáo trình Atlas Y Khoa Cột Sống & Khớp (Trang 1 là bìa thật Retina cao cấp, trang cuối là bìa sau)
export const DEFAULT_ANATOMY_PAGES: FlipbookPage[] = [
  {
    id: 'page-1',
    pageNum: 1,
    title: 'Lời Mở Đầu & Cấu Trúc Trục Cột Sống',
    category: 'GIÁO TRÌNH Y HỌC NỀN TẢNG',
    badge: 'Y KHOA LÂM SÀNG',
    content: {
      heading: 'Lời Mở Đầu & Mục Lục Chuyên Đề',
      subheading: 'Cột trụ nâng đỡ cơ thể và bảo vệ tủy sống trung ương',
      paragraphs: [
        'Cột sống là trục cơ học trung tâm nâng đỡ toàn bộ nửa trên thân mình và bảo vệ tủy sống - đường dẫn truyền xung thần kinh quan trọng nhất cơ thể.',
        'Cuốn tài liệu này tổng hợp toàn diện cấu trúc 33-34 đốt sống, 23 đĩa đệm sinh học, mạng lưới cơ - dây chằng và các nguyên tắc bảo tồn vận động chuẩn y khoa.',
      ],
      bullets: [
        'Chương 1: Phân đoạn giải phẫu 33-34 đốt sống & 4 đường cong sinh lý.',
        'Chương 2: Cột sống cổ C1-C7 và cơ chế vận động xoay 180° của đầu.',
        'Chương 3: Cột sống ngực T1-T12 và khung lồng ngực bảo vệ nội tạng.',
        'Chương 4: Trục thắt lưng L1-L5, xương cùng chậu và đĩa đệm giảm chấn.',
      ],
      highlight: 'Hiểu rõ cấu trúc giải phẫu là nền tảng đầu tiên để bảo vệ cột sống và phòng ngừa thoát vị đĩa đệm.',
      diagramType: 'spine_overview',
    },
  },
  {
    id: 'page-2',
    pageNum: 2,
    title: 'Tổng Quan 33-34 Đốt Sống & 4 Đường Cong',
    category: 'PHÂN ĐOẠN CỘT SỐNG',
    badge: 'ĐOẠN CONG SINH LÝ',
    content: {
      heading: '1. Cột trụ chịu lực trung tâm cơ thể',
      subheading: '4 đường cong hấp thụ lực xóc gấp 10 lần cột thẳng',
      paragraphs: [
        'Cột sống người trưởng thành dài trung bình 70-75cm ở nam và 60-65cm ở nữ, gồm 5 phân đoạn giải phẫu liên hoàn.',
        '4 đường cong sinh lý xen kẽ: Cong ưỡn cổ (Lordosis), Gù ngực (Kyphosis), Ưỡn thắt lưng (Lordosis) và Gù cùng cụt.',
      ],
      bullets: [
        'Đoạn Cổ (C1 - C7): Linh hoạt nhất, điều khiển cử động đầu xoay 180°.',
        'Đoạn Ngực (T1 - T12): Gắn với 12 đôi xương sườn, bảo vệ tim phổi.',
        'Đoạn Thắt Lưng (L1 - L5): To dày nhất, chịu tải trọng chính của thân mình.',
        'Xương Cùng (S1 - S5 dính liền) & Xương Cụt (3 - 5 đốt).',
      ],
      highlight: 'Sự phối hợp giữa các đốt sống và đĩa đệm tạo nên độ bền và tính dẻo dai tuyệt vời cho con người.',
      diagramType: 'spine_overview',
    },
  },
  {
    id: 'page-3',
    pageNum: 3,
    title: 'Đoạn Cổ (C1 - C7) & Khớp Đội - Trục',
    category: 'GIẢI PHẪU ĐOẠN CỔ',
    badge: 'VẬN ĐỘNG LINH HOẠT',
    content: {
      heading: '2. Cột sống cổ & Cặp đốt đặc biệt C1-C2',
      subheading: 'Đốt Đội (Atlas) nâng đỡ hộp sọ - Đốt Trục (Axis) làm trục xoay',
      paragraphs: [
        'Đốt đội C1 không có thân đốt sống mà gồm cung trước và cung sau với hai khối bên nâng đỡ lồi cầu xương chẩm.',
        'Đốt trục C2 có mỏm răng (Dens) nhô lên khớp với hố răng của C1, được cố định bởi dây chằng ngang cực kỳ vững chắc.',
      ],
      bullets: [
        'Động mạch đốt sống chui qua các lỗ mỏm ngang từ C6 lên C1 để cấp máu cho não bộ.',
        'Gai đốt sống cổ (C2 - C6) thường chẻ đôi, riêng C7 có gai sau dài nhất (đốt sống lồi dễ sờ thấy sau gáy).',
      ],
      highlight: 'Cảnh báo: Thoát vị đĩa đệm cổ thường gây đau lan ra vai, tê ngón tay và chóng mặt do chèn ép động mạch.',
      diagramType: 'cervical',
    },
  },
  {
    id: 'page-4',
    pageNum: 4,
    title: 'Đoạn Ngực (T1 - T12) & Lồng Ngực',
    category: 'GIẢI PHẪU ĐOẠN NGỰC',
    badge: 'BẢO VỆ TẠNG NỘI',
    content: {
      heading: '3. Cột sống ngực & Khớp sườn - đốt',
      subheading: 'Khung vững chắc bảo vệ tim, phổi và trung thất',
      paragraphs: [
        '12 đốt sống ngực có hố sườn trên thân đốt và mỏm ngang để khớp với chỏm và củ xương sườn.',
        'Mỏm gai các đốt ngực dài, nhọn và chúc xuôi xuống dưới như ngói lợp, hạn chế động tác ngửa nhưng bảo vệ tủy sống tối đa.',
      ],
      bullets: [
        'Biên độ vận động gập duỗi hẹp nhất so với các đoạn khác do ràng buộc của lồng ngực.',
        'Cung cấp điểm bám cho các cơ liên sườn và cơ hô hấp chính.',
      ],
      highlight: 'Ít bị thoát vị đĩa đệm nhất nhưng dễ gặp tình trạng gù lưng do sai tư thế ngồi làm việc văn phòng.',
      diagramType: 'thoracic',
    },
  },
  {
    id: 'page-5',
    pageNum: 5,
    title: 'Đoạn Thắt Lưng (L1 - L5) - Trục Chịu Tải',
    category: 'GIẢI PHẪU THẮT LƯNG',
    badge: 'VÙNG NGUY CƠ CAO',
    content: {
      heading: '4. Thắt lưng: Trung tâm tải trọng cơ thể',
      subheading: 'Đốt sống to dày hình quả thận, lỗ tủy sống hình tam giác',
      paragraphs: [
        'Thân đốt sống thắt lưng có kích thước lớn nhất để gánh chịu toàn bộ trọng lượng phần trên cơ thể.',
        'Đoạn L4-L5 và L5-S1 là hai vị trí chịu áp lực cơ học cao nhất và là nơi xảy ra hơn 90% các ca thoát vị đĩa đệm.',
      ],
      bullets: [
        'Mỏm gai hình chữ nhật, nằm ngang, cho phép chọc dò tủy sống an toàn qua khoang L3-L4 hoặc L4-L5.',
        'Mỏm khớp định hướng đứng dọc, thuận lợi cho gập - duỗi nhưng hạn chế xoay.',
      ],
      highlight: 'Áp lực lên đĩa đệm L4-L5 khi ngồi gù lưng gấp 2.5 lần so với tư thế nằm ngửa thư giãn.',
      diagramType: 'lumbar',
    },
  },
  {
    id: 'page-6',
    pageNum: 6,
    title: 'Khối Xương Cùng (S1-S5) & Xương Cụt',
    category: 'VÙNG CHẬU & HÔNG',
    badge: 'TRUYỀN LỰC XUỐNG CHÂN',
    content: {
      heading: '5. Nền móng xương cùng & Khớp cùng chậu',
      subheading: 'Khối 5 đốt sống gắn kết tạo hình nêm vững chắc',
      paragraphs: [
        'Xương cùng có hình tam giác đáy quay lên trên khớp với L5 qua ụ nhô (Promontorium).',
        'Khớp cùng - chậu (Sacroiliac Joint) truyền tải toàn bộ lực từ cột sống sang hai xương chậu và xuống chi dưới.',
      ],
      bullets: [
        '4 đôi lỗ cùng trước và sau cho các nhánh thần kinh chùm đuôi ngựa đi ra chi phối vùng chậu và chân.',
        'Xương cụt là phần thoái hóa của đuôi động vật, cung cấp điểm bám cho cơ nâng hậu môn.',
      ],
      highlight: 'Đau khớp cùng chậu thường bị nhầm lẫn với đau thần kinh tọa hoặc thoát vị đĩa đệm thắt lưng.',
      diagramType: 'sacrum',
    },
  },
  {
    id: 'page-7',
    pageNum: 7,
    title: 'Cấu Tạo Đĩa Đệm: Vòng Sợi & Nhân Nhầy',
    category: 'GIẢI PHẪU VI THỂ',
    badge: 'ĐỆM THỦY LỰC SINH HỌC',
    content: {
      heading: '6. Cấu trúc vi thể 23 đĩa đệm cột sống',
      subheading: 'Hệ thống đệm chống sốc kỳ diệu của tạo hóa',
      paragraphs: [
        'Đĩa đệm dày từ 3mm ở cổ đến 9-10mm ở thắt lưng, chiếm 1/4 tổng chiều cao cột sống.',
        'Bao gồm 2 thành phần chính hoạt động theo cơ chế thủy lực nén - giãn:',
      ],
      bullets: [
        'Vòng sợi (Annulus Fibrosus): Gồm 15-25 lớp lá collagen đan chéo nhau góc 30-60° cực kỳ dẻo dai bao bọc xung quanh.',
        'Nhân nhầy (Nucleus Pulposus): Khối gel chứa 80-85% nước và proteoglycans nằm ở trung tâm đóng vai trò giảm chấn.',
        'Mâm sụn gian đốt: Cung cấp dinh dưỡng cho đĩa đệm thông qua cơ chế thẩm thấu khuếch tán.',
      ],
      highlight: 'Đĩa đệm không có mạch máu riêng ở người trưởng thành, chỉ được nuôi dưỡng khi cơ thể vận động nhẹ nhàng.',
      diagramType: 'disc_anatomy',
    },
  },
  {
    id: 'page-8',
    pageNum: 8,
    title: 'Hệ Thống 5 Dây Chằng Cột Sống',
    category: 'HỆ THỐNG DÂY CHẰNG',
    badge: 'GIỮ VỮNG ĐỐT SỐNG',
    content: {
      heading: '7. Mạng lưới dây chằng neo giữ cột sống',
      subheading: 'Bảo vệ đĩa đệm không bị trượt và chống gập xoay quá mức',
      paragraphs: [
        'Hệ thống dây chằng cột sống phối hợp chặt chẽ với cơ cạnh sống để giữ ổn định trục cơ thể.',
      ],
      bullets: [
        'Dây chằng dọc trước (ALL): Chạy suốt mặt trước thân đốt, chống ưỡn quá mức.',
        'Dây chằng dọc sau (PLL): Nằm trong ống sống mặt sau thân đốt, chống gập quá mức (mỏng dần ở thắt lưng nên dễ thoát vị ra sau).',
        'Dây chằng vàng (Ligamentum Flavum): Nối các mảnh đốt sống, chứa nhiều sợi chun co giãn đàn hồi cao.',
        'Dây chằng liên gai & trên gai: Nối các mỏm gai đốt sống.',
      ],
      highlight: 'Dây chằng dọc sau mỏng dần ở vùng L4-L5 khiến nhân nhầy dễ thoát ra phía sau bên, chèn ép rễ thần kinh.',
      diagramType: 'ligaments',
    },
  },
  {
    id: 'page-9',
    pageNum: 9,
    title: 'Cơ Chế Thoát Vị Đĩa Đệm & Thần Kinh Tọa',
    category: 'BỆNH HỌC LÂM SÀNG',
    badge: 'CHÈN ÉP RỄ THẦN KINH',
    content: {
      heading: '8. 4 giai đoạn tiến triển thoát vị đĩa đệm',
      subheading: 'Từ phình đĩa đệm đến thoát vị di trú chèn ép tủy',
      paragraphs: [
        'Thoát vị đĩa đệm xảy ra khi vòng sợi bị rách nứt, cho phép nhân nhầy thoát ra ngoài chèn ép vào tủy sống hoặc rễ thần kinh.',
      ],
      bullets: [
        'Giai đoạn 1 (Phình đĩa đệm): Vòng sợi suy yếu, nhân nhầy hơi lệch nhưng chưa rách.',
        'Giai đoạn 2 (Lồi đĩa đệm): Vòng sợi rách một phần, nhân nhầy nhô ra chèn nhẹ rễ thần kinh.',
        'Giai đoạn 3 (Thoát vị thực thụ): Rách hoàn toàn vòng sợi, nhân nhầy tràn vào ống sống gây đau tê thần kinh tọa.',
        'Giai đoạn 4 (Thoát vị có mảnh rời): Khối nhân nhầy tách rời khỏi đĩa đệm, nguy cơ chèn ép chùm đuôi ngựa.',
      ],
      highlight: 'Dấu hiệu cấp cứu: Hội chứng chùm đuôi ngựa (mất tự chủ tiểu tiện, tê vùng đáy chậu) cần mổ giải áp trong 48h.',
      diagramType: 'herniation',
    },
  },
  {
    id: 'page-10',
    pageNum: 10,
    title: 'Xương Khớp: Cơ Chế Sinh Học & Dinh Dưỡng',
    category: 'XƯƠNG KHỚP & TÁI TẠO',
    badge: '25y TẠO XƯƠNG',
    content: {
      heading: '9. Xương khớp: Cơ chế sinh học & Tái tạo mô',
      subheading: 'Cân bằng tạo xương - huỷ xương & Dinh dưỡng sụn khớp',
      paragraphs: [
        'Hệ thống khớp chịu ma sát liên tục trong suốt đời người. Sau 25 tuổi, tốc độ thoái hóa sụn và hủy xương bắt đầu vượt quá tốc độ tái tạo.',
      ],
      bullets: [
        'Dây chằng và bao khớp giữ vững trục khớp chống lệch vẹo.',
        'Dịch khớp & Acid Hyaluronic cung cấp bôi trơn giảm ma sát mài mòn.',
        'Bổ sung Glucosamine, Chondroitin, Collagen Type II giúp bảo tồn màng hoạt dịch.',
        'Vận động đúng cách kích thích tuần hoàn máu nuôi khớp.',
      ],
      highlight: 'Chăm sóc sớm từ năm 25 tuổi giúp duy trì hệ xương khớp dẻo dai đến tuổi già.',
      diagramType: 'ergonomics',
    },
  },
  {
    id: 'page-11',
    pageNum: 11,
    title: 'Bản Quyền Xuất Bản & Bìa Sau',
    imageUrl: '/documents/covers/back_cover_atlas_y_khoa_toan_dien.png',
  },
];

export const CLEAN_COVER_PRESETS = [
  {
    id: 'navy',
    name: 'Xanh Navy Hoàng Gia',
    url: '/documents/covers/clean_cover_navy.png',
    desc: 'Mẫu chuẩn Y Khoa sang trọng, viền vàng kim dập nổi',
  },
  {
    id: 'emerald',
    name: 'Lục Bảo Phục Hồi',
    url: '/documents/covers/clean_cover_emerald.png',
    desc: 'Y học phục hồi tự nhiên, xanh ngọc quý phái',
  },
  {
    id: 'burgundy',
    name: 'Đỏ Rượu Dinh Dưỡng',
    url: '/documents/covers/clean_cover_burgundy.png',
    desc: 'Dinh dưỡng tế bào & kháng viêm, sang trọng',
  },
  {
    id: 'slate',
    name: 'Đêm Midnight Cột Sống',
    url: '/documents/covers/clean_cover_slate.png',
    desc: 'Cơ sinh học & cột sống 3D công nghệ cao',
  },
  {
    id: 'pure_frame',
    name: 'Khung Vàng Tối Giản',
    url: '/documents/covers/clean_cover_pure_frame.png',
    desc: 'Nền sạch 100% khung vàng kim thanh lịch',
  },
];

export const isOldOrBrokenCover = (url?: string | null) => {
  if (!url || !url.trim()) return true;
  if (url.startsWith('blob:')) return true;
  if (url === '/images/book_cover_blank.jpg') return true;
  if (url.includes('/documents/covers/cover_')) return true;
  if (url.includes('8345656d-8d0f-4f15-b943-6efd775e4ec7')) return true;
  if (url.includes('/images/lessons/') || url.includes('/lessons/')) return true;
  return false;
};

export interface FlipbookViewerProps {
  initialPages?: FlipbookPage[];
  book?: BookInfoInput | null;
  title?: string;
  topicTitle?: string;
  pageTitle?: string;
  coverUrl?: string;
  onUpdateCover?: (newCoverUrl: string) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onOpenEditBlockModal?: () => void;
  isAdmin?: boolean;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  /** Khối sách trong bài học: chỉ hiển thị file PDF admin đã nạp (không dùng trang mẫu) */
  blockMode?: boolean;
  pdfUrl?: string;
  mode?: 'inline' | 'modal-only';
  isOpen?: boolean;
  onClose?: () => void;
}

const makeCoverPageFor = (title: string, coverUrl?: string): FlipbookPage => ({
  id: 'cover-only',
  pageNum: 1,
  title: title || 'Tài liệu',
  category: 'BÌA SÁCH',
  badge: 'BÌA',
  imageUrl: coverUrl || '',
});

export default function FlipbookViewer({
  initialPages,
  book,
  title = 'Tài liệu tham khảo',
  topicTitle = 'Cột Sống & Đĩa Đệm',
  pageTitle = 'Giải Phẫu',
  coverUrl,
  onUpdateCover,
  onUpdateTitle,
  onOpenEditBlockModal,
  isAdmin: propIsAdmin,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  blockMode = false,
  pdfUrl,
  mode = 'inline',
  isOpen,
  onClose,
}: FlipbookViewerProps) {
  const makeCoverPage = () => makeCoverPageFor(title, coverUrl);
  const [pages, setPages] = useState<FlipbookPage[]>(() => {
    let p: FlipbookPage[];
    if (blockMode) p = [makeCoverPage()];
    else if (initialPages && initialPages.length > 0) p = initialPages;
    else if (book) p = getBookFlipbookPages(book);
    else if (title && title !== 'Tài liệu tham khảo' && title !== 'Đọc thử sách 3D' && title !== 'Đọc thử tài liệu 3D') {
      const cleanTitle = title.replace(/^Đọc thử:\s*/i, '').replace(/^Đọc thử tài liệu 3D:\s*/i, '');
      p = getBookFlipbookPages({ title: cleanTitle });
    } else {
      p = DEFAULT_ANATOMY_PAGES;
    }
    return p;
  });

  // Tự động đồng bộ danh sách trang khi initialPages, book, title thay đổi
  useEffect(() => {
    let p: FlipbookPage[] = [];
    if (blockMode) {
      if (pdfUrl) return;
      p = [makeCoverPage()];
    } else if (initialPages && initialPages.length > 0) {
      p = [...initialPages];
    } else if (book) {
      p = getBookFlipbookPages(book);
    } else if (title && title !== 'Tài liệu tham khảo' && title !== 'Đọc thử sách 3D' && title !== 'Đọc thử tài liệu 3D') {
      const cleanTitle = title.replace(/^Đọc thử:\s*/i, '').replace(/^Đọc thử tài liệu 3D:\s*/i, '');
      p = getBookFlipbookPages({ title: cleanTitle });
    } else {
      p = [...DEFAULT_ANATOMY_PAGES];
    }
    setPages(p);
  }, [initialPages, book, title, blockMode, pdfUrl, coverUrl]);

  // Đọc file PDF admin đã nạp vào khối sách và dựng thành các trang lật
  useEffect(() => {
    if (!blockMode || !pdfUrl) return;
    let cancelled = false;
    (async () => {
      setIsLoadingPdf(true);
      setPdfProgressText('Đang tải tài liệu...');
      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Không thể tải PDF.js'));
            document.head.appendChild(script);
          });
        }
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        const total = Math.min(pdf.numPages, 80);
        const out: FlipbookPage[] = [];
        for (let i = 1; i <= total; i++) {
          if (cancelled) return;
          setPdfProgressText('Đang dựng trang ' + i + ' / ' + total + '...');
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.4 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          out.push({
            id: 'pdf-' + i,
            pageNum: i,
            title: 'Trang ' + i,
            category: 'TÀI LIỆU PDF',
            badge: 'TRANG ' + i,
            imageUrl: canvas.toDataURL('image/jpeg', 0.82),
          });
        }
        if (!cancelled && out.length > 0) {
          setPages(out);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Không đọc được PDF', err);
        if (!cancelled) setPdfProgressText('');
      } finally {
        if (!cancelled) {
          setIsLoadingPdf(false);
          setPdfProgressText('');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockMode, pdfUrl]);

  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(mode === 'modal-only' ? Boolean(isOpen) : false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(propIsAdmin ?? false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');

  // Tiêu đề sách: Tự sinh hoặc do người dùng tự điền
  const defaultAutoTitle = (() => {
    if (title && title !== 'Tài liệu tham khảo' && title !== 'Đọc thử sách 3D' && title !== 'Đọc thử tài liệu 3D') return title;
    if (book?.title) return book.title;
    if (pageTitle && pageTitle.trim()) return `Atlas Giải Phẫu · ${pageTitle.trim()}`;
    if (topicTitle && topicTitle.trim()) return `Atlas Y Khoa · ${topicTitle.trim()}`;
    return 'Atlas Giải Phẫu & Sức Khỏe 3D';
  })();

  const [bookTitle, setBookTitle] = useState<string>(defaultAutoTitle);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingTitleInFullscreen, setIsEditingTitleInFullscreen] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>(defaultAutoTitle);
  const [tempTitle, setTempTitle] = useState<string>(defaultAutoTitle);

  useEffect(() => {
    try {
      const storageKey = `custom_book_casing_title_${pageTitle || topicTitle || 'default'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved && saved.trim()) {
        setBookTitle(saved.trim());
        setTitleInput(saved.trim());
        setTempTitle(saved.trim());
      } else {
        setBookTitle(defaultAutoTitle);
        setTitleInput(defaultAutoTitle);
        setTempTitle(defaultAutoTitle);
      }
    } catch {
      setBookTitle(defaultAutoTitle);
      setTitleInput(defaultAutoTitle);
      setTempTitle(defaultAutoTitle);
    }
  }, [pageTitle, topicTitle, title, defaultAutoTitle]);

  const handleSaveTitle = (val: string) => {
    const trimmed = val.trim();
    const finalVal = trimmed || defaultAutoTitle;
    setBookTitle(finalVal);
    setTitleInput(finalVal);
    setTempTitle(finalVal);
    setIsEditingTitle(false);
    try {
      const storageKey = `custom_book_casing_title_${pageTitle || topicTitle || 'default'}`;
      if (trimmed && trimmed !== defaultAutoTitle) {
        localStorage.setItem(storageKey, trimmed);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
    if (onUpdateTitle) {
      onUpdateTitle(finalVal);
    }
  };

  // Quản lý ảnh bìa sách sạch & sang trọng (Clean Luxury Cover Image)
  const defaultCoverUrl = '/documents/covers/clean_cover_navy.png';
  const coverStorageKey = `custom_book_cover_${pageTitle || topicTitle || 'default'}`;
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string>(() => {
    if (coverUrl && !isOldOrBrokenCover(coverUrl)) return coverUrl.trim();
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(coverStorageKey);
        if (saved && !isOldOrBrokenCover(saved)) {
          return saved.trim();
        }
      } catch {}
    }
    return defaultCoverUrl;
  });

  const [tempCoverUrl, setTempCoverUrl] = useState<string>(currentCoverUrl);
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false);
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [isCropCoverOpen, setIsCropCoverOpen] = useState<boolean>(false);

  // Tự động nhận diện tỷ lệ khung hình thật của ảnh bìa (đứng, vuông hay ngang)
  const [coverAspect, setCoverAspect] = useState<number | null>(null);

  useEffect(() => {
    if (!currentCoverUrl) return;
    const img = new Image();
    img.src = currentCoverUrl;
    const updateAspect = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setCoverAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    if (img.complete && img.naturalWidth > 0) {
      updateAspect();
    } else {
      img.onload = updateAspect;
    }
  }, [currentCoverUrl]);

  useEffect(() => {
    if (coverUrl && !isOldOrBrokenCover(coverUrl)) {
      setCurrentCoverUrl(coverUrl.trim());
      setTempCoverUrl(coverUrl.trim());
    } else {
      try {
        const saved = localStorage.getItem(coverStorageKey);
        if (saved && !isOldOrBrokenCover(saved)) {
          setCurrentCoverUrl(saved.trim());
          setTempCoverUrl(saved.trim());
        } else {
          setCurrentCoverUrl(defaultCoverUrl);
          setTempCoverUrl(defaultCoverUrl);
        }
      } catch {
        setCurrentCoverUrl(defaultCoverUrl);
        setTempCoverUrl(defaultCoverUrl);
      }
    }
  }, [coverUrl, coverStorageKey, defaultCoverUrl]);

  const handleSaveCover = (newUrl: string) => {
    const finalUrl = newUrl.trim() || defaultCoverUrl;
    setCurrentCoverUrl(finalUrl);
    setTempCoverUrl(finalUrl);
    try {
      if (finalUrl === defaultCoverUrl) {
        localStorage.removeItem(coverStorageKey);
      } else {
        localStorage.setItem(coverStorageKey, finalUrl);
      }
    } catch {}
    if (onUpdateCover) {
      onUpdateCover(finalUrl === defaultCoverUrl ? '' : finalUrl);
    }
  };

  // Tránh chặn thao tác vuốt cuộn trang trên mobile khi chạm vào bìa sách
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isScrollingRef = useRef(false);

  const onCoverTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      isScrollingRef.current = false;
    }
  };

  const onCoverTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || e.touches.length !== 1) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (dx > 6 || dy > 6) {
      // Người dùng đang cầm tay vuốt cuộn trang -> Đánh dấu không phải click mở sách
      isScrollingRef.current = true;
    }
  };

  const onCoverTouchEnd = () => {
    setTimeout(() => {
      isScrollingRef.current = false;
      touchStartPos.current = null;
    }, 120);
  };

  const handleCoverClick = () => {
    if (isScrollingRef.current) {
      // Người dùng vừa vuốt qua bìa sách để cuộn trang, không mở toàn màn hình
      return;
    }
    setIsFullscreen(true);
  };

  // 1. Trạng thái Đọc Thuyết Minh Y Khoa Tiếng Việt (Text-to-Speech)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 2. Trạng thái Tự Động Ẩn / Mờ Giao Diện Khi Đọc Toàn Màn Hình (Immersive Reader Mode)
  const [isChromeVisible, setIsChromeVisible] = useState<boolean>(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer tự động làm mờ thanh công cụ trên & dưới sau 3.5 giây không tương tác
  const resetChromeTimer = useCallback(() => {
    setIsChromeVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsChromeVisible(false);
    }, 3500);
  }, []);

  // 3. Trạng thái Phóng to / Thu nhỏ (Zoom in / Zoom out) và Di chuyển (Pan) khi đọc
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingPanRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1.0);
  const lastTapRef = useRef<number>(0);

  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
    resetChromeTimer();
  }, [resetChromeTimer]);

  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 1.0);
      if (next <= 1.08) {
        setPanPosition({ x: 0, y: 0 });
        return 1.0;
      }
      return next;
    });
    resetChromeTimer();
  }, [resetChromeTimer]);

  const handleResetZoom = useCallback(() => {
    setZoomScale(1.0);
    setPanPosition({ x: 0, y: 0 });
    resetChromeTimer();
  }, [resetChromeTimer]);

  const handleToggleZoom = useCallback(() => {
    setZoomScale((prev) => {
      if (prev > 1.0) {
        setPanPosition({ x: 0, y: 0 });
        return 1.0;
      }
      return 1.75;
    });
    resetChromeTimer();
  }, [resetChromeTimer]);

  // Đặt lại zoom khi lật sang trang khác hoặc khi thoát fullscreen
  useEffect(() => {
    setZoomScale(1.0);
    setPanPosition({ x: 0, y: 0 });
  }, [currentPage, isFullscreen]);

  // Dừng phát âm thanh thuyết minh
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Đọc to nội dung trang sách hiện tại bằng giọng tiếng Việt
  const speakCurrentPage = useCallback((pageNum: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng đọc thuyết minh.');
      return;
    }

    window.speechSynthesis.cancel();

    const targetPage = pages[pageNum - 1];
    if (!targetPage) return;

    let textToRead = '';
    if (targetPage.content) {
      const parts: string[] = [];
      if (targetPage.title) parts.push(targetPage.title);
      if (targetPage.content.heading) parts.push(targetPage.content.heading);
      if (targetPage.content.subheading) parts.push(targetPage.content.subheading);
      if (targetPage.content.paragraphs?.length) {
        parts.push(targetPage.content.paragraphs.join('. '));
      }
      if (targetPage.content.bullets?.length) {
        parts.push(targetPage.content.bullets.join('. '));
      }
      if (targetPage.content.highlight) {
        parts.push(`Điểm lưu ý: ${targetPage.content.highlight}`);
      }
      textToRead = parts.join('. ');
    } else {
      textToRead = `Trang ${pageNum}: ${targetPage.title || 'Tài liệu giáo trình y khoa'}`;
    }

    if (!textToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Tốc độ tự nhiên, rõ ràng
    utterance.pitch = 1.0;

    // Tìm giọng đọc tiếng Việt chất lượng cao nếu có
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(
      (v) =>
        v.lang.startsWith('vi') ||
        v.lang.toLowerCase().includes('vietnam') ||
        v.lang.includes('vi-VN')
    );
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [pages]);

  // Bật/tắt đọc thuyết minh
  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakCurrentPage(currentPage);
    }
  }, [isSpeaking, currentPage, speakCurrentPage, stopSpeech]);

  // Khi lật trang nếu đang bật chế độ đọc thì tự động đọc trang mới
  useEffect(() => {
    if (isSpeaking) {
      speakCurrentPage(currentPage);
    }
  }, [currentPage]);

  // Dọn dẹp âm thanh thuyết minh và timer khi đóng hoặc unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode === 'modal-only') {
      setIsFullscreen(Boolean(isOpen));
    }
  }, [mode, isOpen]);

  // Khi mở Fullscreen, kích hoạt bộ hẹn giờ ẩn thanh công cụ
  useEffect(() => {
    if (isFullscreen) {
      resetChromeTimer();
    } else {
      stopSpeech();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isFullscreen, resetChromeTimer, stopSpeech]);

  // Quản lý lịch sử trình duyệt (Browser History & PopState) khi đọc toàn màn hình
  // Giúp nút Quay lại của điện thoại (Android Back gesture/button) đóng sách lật an toàn
  // TUYỆT ĐỐI KHÔNG ĐỂ NHẢY SANG TRANG KHÁC (như Trang AI)
  const hasPushedFullscreenHistoryRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleCloseFullscreen = useCallback(() => {
    stopSpeech();
    if (hasPushedFullscreenHistoryRef.current && typeof window !== 'undefined' && window.location.hash.includes('doc-sach-3d')) {
      hasPushedFullscreenHistoryRef.current = false;
      try {
        window.history.back();
      } catch {
        setIsFullscreen(false);
        onCloseRef.current?.();
      }
    } else {
      hasPushedFullscreenHistoryRef.current = false;
      setIsFullscreen(false);
      onCloseRef.current?.();
    }
  }, [stopSpeech]);

  useEffect(() => {
    if (!isFullscreen) {
      if (hasPushedFullscreenHistoryRef.current && typeof window !== 'undefined' && window.location.hash.includes('doc-sach-3d')) {
        hasPushedFullscreenHistoryRef.current = false;
        try {
          window.history.back();
        } catch {}
      }
      return;
    }

    // Khi vào Fullscreen, đẩy 1 hash vào history nếu chưa có
    if (!hasPushedFullscreenHistoryRef.current && typeof window !== 'undefined') {
      hasPushedFullscreenHistoryRef.current = true;
      try {
        const nextState = {
          ...(window.history.state || {}),
          qbiz_flipbook_fullscreen: true,
        };
        const currentHash = window.location.hash || '';
        const newHash = currentHash ? `${currentHash}_doc-sach-3d` : '#doc-sach-3d';
        window.history.pushState(
          nextState,
          '',
          window.location.pathname + window.location.search + newHash
        );
      } catch {}
    }

    const handlePopState = () => {
      // Khi người dùng bấm nút Back của điện thoại / vuốt mép màn hình:
      // Đóng sách lật toàn màn hình và giữ người dùng tại trang hiện tại!
      hasPushedFullscreenHistoryRef.current = false;
      stopSpeech();
      setIsFullscreen(false);
      onCloseRef.current?.();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (hasPushedFullscreenHistoryRef.current && typeof window !== 'undefined' && window.location.hash.includes('doc-sach-3d')) {
        hasPushedFullscreenHistoryRef.current = false;
        try {
          window.history.back();
        } catch {}
      }
    };
  }, [isFullscreen, stopSpeech]);

  // References cho SideBooksFlipEngine (Inline và Fullscreen)
  const inlineFlipRef = useRef<SideBooksFlipEngineRef>(null);
  const fullscreenFlipRef = useRef<SideBooksFlipEngineRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const totalPages = pages.length;

  // Xác thực quyền Admin
  useEffect(() => {
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
    } else {
      checkIsAdminClient().then(setIsAdmin);
    }
  }, [propIsAdmin]);

  // Kiểm tra tài liệu tùy biến đã lưu trong localStorage cho bài học này
  useEffect(() => {
    if (mode === 'modal-only') return;
    try {
      const storageKey = `flipbook_doc_${topicTitle}_${pageTitle}`;
      const savedDoc = localStorage.getItem(storageKey);
      if (savedDoc) {
        const parsed = JSON.parse(savedDoc);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPages(parsed);
        }
      }
    } catch {}
  }, [topicTitle, pageTitle, mode]);

  // Sinh ảnh chất lượng cao cho các trang tài liệu
  useEffect(() => {
    const images: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (p.imageUrl) {
        images.push(p.imageUrl);
      } else {
        const imgData = renderPageToCanvas(p, pages.length);
        images.push(imgData);
      }
    }
    setPageImages(images);
  }, [pages]);

  // Âm thanh tiếng lật giấy sột soạt bằng Web Audio API
  const playPageFlipSound = useCallback(() => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const duration = 0.16;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.sin((t / duration) * Math.PI) * Math.exp(-t * 12);
        const noise = (Math.random() * 2 - 1) * 0.7;
        const tone = Math.sin(2 * Math.PI * 480 * t) * 0.3;
        data[i] = (noise + tone) * envelope * 0.45;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration);
      filter.Q.value = 1.2;
      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
    } catch {}
  }, [isSoundEnabled]);

  // Điều khiển lật trang kế tiếp (SideBooks 3D Curl)
  const handleFlipNext = () => {
    const activeFlip = isFullscreen ? fullscreenFlipRef.current : inlineFlipRef.current;
    if (activeFlip) {
      activeFlip.flipNext();
    } else if (currentPage < totalPages) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      playPageFlipSound();
    }
  };

  // Điều khiển lật ngược về trang trước (SideBooks 3D Curl)
  const handleFlipPrev = () => {
    const activeFlip = isFullscreen ? fullscreenFlipRef.current : inlineFlipRef.current;
    if (activeFlip) {
      activeFlip.flipPrev();
    } else if (currentPage > 1) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
      playPageFlipSound();
    }
  };

  // Chuyển trang trực tiếp bằng slider
  const handleJumpToPage = (targetNum: number) => {
    const pageIdx = Math.max(0, Math.min(targetNum - 1, totalPages - 1));
    const activeFlip = isFullscreen ? fullscreenFlipRef.current : inlineFlipRef.current;
    if (activeFlip) {
      activeFlip.turnToPage(pageIdx);
    } else {
      setCurrentPage(pageIdx + 1);
      playPageFlipSound();
    }
  };

  // Bàn phím điều khiển (Mũi tên trái/phải & Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleFlipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handleFlipPrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        handleCloseFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Xử lý nạp PDF (CHỈ DÀNH CHO ADMIN)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingPdf(true);
    setPdfProgressText('Đang nạp file PDF...');

    try {
      if (!(window as any).pdfjsLib) {
        setPdfProgressText('Đang tải công cụ giải mã PDF...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Không thể tải PDF.js'));
          document.head.appendChild(script);
        });
      }

      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      setPdfProgressText('Đang đọc các trang PDF...');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const newPages: FlipbookPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        setPdfProgressText(`Đang xử lý trang 3D ${i} / ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.8 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
          newPages.push({
            id: `pdf-page-${i}-${Date.now()}`,
            pageNum: i,
            title: `Trang ${i}: ${file.name.replace(/\.[^/.]+$/, '')}`,
            category: 'TÀI LIỆU PDF',
            badge: `TRANG ${i}`,
            imageUrl,
          });
        }
      }

      if (newPages.length > 0) {
        setPages(newPages);
        setCurrentPage(1);
        setShowUploadModal(false);
        playPageFlipSound();
        try {
          const storageKey = `flipbook_doc_${topicTitle}_${pageTitle}`;
          localStorage.setItem(storageKey, JSON.stringify(newPages));
        } catch {}
      }
    } catch (err: any) {
      alert(`Không thể trích xuất PDF: ${err?.message || 'Vui lòng thử lại'}`);
    } finally {
      setIsLoadingPdf(false);
      setPdfProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Xử lý nạp ảnh (CHỈ DÀNH CHO ADMIN)
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const readPromises = fileList.map((file, idx) => {
      return new Promise<FlipbookPage>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `img-page-${idx + 1}-${Date.now()}`,
            pageNum: idx + 1,
            title: file.name.replace(/\.[^/.]+$/, ''),
            category: 'BỘ ẢNH TẢI LÊN',
            badge: `ẢNH ${idx + 1}`,
            imageUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newPages) => {
      if (newPages.length > 0) {
        setPages(newPages);
        setCurrentPage(1);
        setShowUploadModal(false);
        playPageFlipSound();
        try {
          const storageKey = `flipbook_doc_${topicTitle}_${pageTitle}`;
          localStorage.setItem(storageKey, JSON.stringify(newPages));
        } catch {}
      }
      if (imagesInputRef.current) imagesInputRef.current.value = '';
    });
  };

  // Đặt lại tài liệu mặc định
  const handleResetDefault = () => {
    if (confirm('Khôi phục tài liệu Atlas Giải Phẫu mặc định ban đầu?')) {
      setPages(DEFAULT_ANATOMY_PAGES);
      setCurrentPage(1);
      setShowUploadModal(false);
      try {
        const storageKey = `flipbook_doc_${topicTitle}_${pageTitle}`;
        localStorage.removeItem(storageKey);
      } catch {}
    }
  };

  // Nếu là modal-only mode mà không mở fullscreen -> return null
  if (mode === 'modal-only' && !isFullscreen) {
    return null;
  }

  // Nếu khối bị ẩn và không phải Admin -> Không render gì
  if (mode !== 'modal-only' && isHidden && !isAdmin) {
    return null;
  }

  return (
    <>
      {/* =========================================================================
          KHỐI QUYỂN SÁCH DA SANG TRỌNG (LUXURY HARDCOVER BOOK CASING)
          MÔ PHỎNG ĐẠI TỪ ĐIỂN / ATLAS Y KHOA DÁT VÀNG HOÀNG GIA
          ========================================================================= */}
      {mode !== 'modal-only' && (
      <section
        style={{ touchAction: 'pan-y' }}
        className={`w-full flex flex-col rounded-[20px] sm:rounded-[24px] bg-white dark:bg-gradient-to-b dark:from-[#0F172A] dark:via-[#131E36] dark:to-[#0A0F1D] text-slate-900 dark:text-white border border-amber-400/50 p-2 sm:p-3 my-3 transition-all relative overflow-hidden group/book shadow-md dark:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.6)] touch-pan-y ${
          isHidden ? 'opacity-70 border-dashed border-amber-500' : ''
        }`}
      >
        {/* THANH ĐIỀU KHIỂN QUẢN TRỊ (CHO PHÉP DI CHUYỂN, ẨN/HIỆN KHỐI - CHỈ HIỆN VỚI ADMIN) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-amber-400/20 relative z-20">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider bg-amber-100 dark:bg-black/50 border border-amber-400/60 dark:border-amber-400/40 px-2 py-0.5 rounded-[6px]">
                Quản trị khối sách
              </span>
              {isHidden && (
                <span className="text-[10px] font-bold text-red-300 bg-red-950/80 border border-red-500/50 px-1.5 py-0.5 rounded-[6px]">
                  Đang ẩn
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 flex-wrap justify-end">
              {onMoveUp && (
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={onMoveUp}
                  className="w-6 h-6 rounded-[6px] bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-30 cursor-pointer shadow-2xs"
                  title="Di chuyển khối lên trên"
                >
                  <ArrowUp size={12} />
                </button>
              )}
              {onMoveDown && (
                <button
                  type="button"
                  disabled={isLast}
                  onClick={onMoveDown}
                  className="w-6 h-6 rounded-[6px] bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-30 cursor-pointer shadow-2xs"
                  title="Di chuyển khối xuống dưới"
                >
                  <ArrowDown size={12} />
                </button>
              )}
              {onToggleVisibility && (
                <button
                  type="button"
                  onClick={onToggleVisibility}
                  className={`w-6 h-6 rounded-[6px] flex items-center justify-center cursor-pointer shadow-2xs ${
                    isHidden
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white'
                  }`}
                  title={isHidden ? 'Hiện khối với học viên' : 'Ẩn khối với học viên'}
                >
                  {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              )}
              {onOpenEditBlockModal && (
                <button
                  type="button"
                  onClick={onOpenEditBlockModal}
                  className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer shadow-xs whitespace-nowrap"
                  title="Sửa cấu hình khối và ảnh bìa"
                >
                  <Edit2 size={10} />
                  <span>Sửa</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-slate-100 dark:bg-white/15 border border-slate-300 dark:border-white/25 text-slate-700 dark:text-white text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-white/25 cursor-pointer shadow-xs whitespace-nowrap"
                title="Nạp file PDF hoặc bộ ảnh mới"
              >
                <Upload size={10} />
                <span>Nạp file</span>
              </button>
            </div>
          </div>
        )}

        {/* THANH CÔNG CỤ ĐỈNH KHỐI SÁCH: BIỂU TƯỢNG CUỐN SÁCH + HUY HIỆU + ÂM THANH + MỞ RỘNG (KHÔNG ĐỂ TIÊU ĐỀ 3 CHẤM CẮT CỤT) */}
        <div className="flex items-center justify-between gap-2 pb-1.5 px-1 relative z-20">
          <div className="flex items-center gap-2 min-w-0">
            {/* Biểu tượng cuốn sách dát vàng */}
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-slate-950 flex items-center justify-center shrink-0 shadow-md border border-amber-200">
              <BookOpen size={15} strokeWidth={2.5} />
            </div>

            <span className="text-[10.5px] font-black text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs whitespace-nowrap">
              {totalPages} trang
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút Bật/Tắt âm thanh lật sách */}
            <button
              type="button"
              onClick={() => {
                const nextSound = !isSoundEnabled;
                setIsSoundEnabled(nextSound);
                if (nextSound) playPageFlipSound();
              }}
              className="w-7 h-7 rounded-[8px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-amber-400/60 text-amber-700 dark:text-amber-300 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
              title={isSoundEnabled ? 'Tắt âm thanh lật sách' : 'Bật âm thanh lật sách (sột soạt)'}
              aria-label="Âm thanh"
            >
              {isSoundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>

            {/* Nút Mở rộng toàn màn hình */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-[11px] cursor-pointer shadow-md transition-transform active:scale-95"
              title="Mở rộng xem toàn màn hình để lật sách chân thực"
            >
              <Maximize2 size={11} strokeWidth={2.5} />
              <span className="hidden sm:inline">Toàn màn hình</span>
              <span className="sm:hidden">Mở rộng</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            LỚP PHỦ ẢNH BÌA SÁCH (COVER OVERLAY)
            - Nền sạch sang trọng (Clean Cover) không in chữ sẵn
            - Tiêu đề {bookTitle} hiển thị động bằng typography mạ vàng sắc nét
            - Cho phép Admin sửa tiêu đề tại chỗ hoặc thay ảnh nền bìa
            - Chạm vào lớp phủ để mở cuốn sách đọc các trang bên trong
            ========================================================================= */}
        <div
          className="w-full aspect-square max-w-[480px] mx-auto rounded-[18px] bg-[#0c1626] relative overflow-hidden flex items-center justify-center group shadow-2xl my-2 cursor-pointer touch-pan-y border border-amber-500/30 select-none"
          style={{
            touchAction: 'pan-y',
          }}
          onTouchStart={onCoverTouchStart}
          onTouchMove={onCoverTouchMove}
          onTouchEnd={onCoverTouchEnd}
          onClick={handleCoverClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsFullscreen(true); }}
          aria-label={`Mở đọc: ${bookTitle}`}
        >
          {/* Nút Quản Trị Admin: Sửa tiêu đề & Thay ảnh bìa (Góc trên bên phải) */}
          {isAdmin && (
            <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 pointer-events-auto">
              {/* Nút Sửa Tiêu Đề Trực Tiếp */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                  setTitleInput(bookTitle);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-extrabold text-[11px] shadow-lg border border-amber-400/60 cursor-pointer backdrop-blur-xs transition-transform active:scale-95"
                title="Sửa tiêu đề sách trên bìa"
              >
                <Edit2 size={12} strokeWidth={2.5} />
                <span>Sửa tiêu đề</span>
              </button>

              {/* Nút Thay Ảnh Bìa */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCoverModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow-lg border border-amber-300 cursor-pointer backdrop-blur-xs transition-transform active:scale-95"
                title="Chọn mẫu bìa sạch hoặc tải ảnh bìa mới"
              >
                <ImageIcon size={12} strokeWidth={2.5} />
                <span>Thay bìa</span>
              </button>

              {/* Nút Cắt & Căn Khung Ảnh Bìa */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCropCoverOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#1E3A8A] hover:bg-[#172554] text-amber-200 font-black text-[11px] shadow-lg border border-blue-400/40 cursor-pointer backdrop-blur-xs transition-transform active:scale-95"
                title="Cắt và căn khung ảnh bìa theo ý muốn"
              >
                <Crop size={12} strokeWidth={2.5} />
                <span>Cắt bìa</span>
              </button>
            </div>
          )}

          {/* Ảnh nền bìa sách sạch sang trọng (Tràn viền tự nhiên) */}
          <img
            src={currentCoverUrl}
            alt=""
            role="presentation"
            loading="eager"
            onError={(e) => {
              const fallback = '/documents/covers/clean_cover_navy.png';
              if (e.currentTarget.src !== window.location.origin + fallback) {
                e.currentTarget.src = fallback;
              }
            }}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
            draggable={false}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />

          {/* Lớp phủ chuyển sắc nhẹ đảm bảo chữ luôn nổi rõ 100% */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 z-1 pointer-events-none" />

          {/* LỚP PHỦ NỘI DUNG BÌA (TYPOGRAPHY DYNAMIC) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 sm:px-14 text-center pointer-events-none">
            {/* Nhãn loại tài liệu trên đầu */}
            <div className="text-[10px] sm:text-[11.5px] font-black tracking-[0.2em] text-amber-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-1.5 sm:mb-2.5">
              ✦ GIÁO TRÌNH & ATLAS Y KHOA 3D ✦
            </div>

            {/* Tiêu đề sách: Cho phép sửa inline hoặc hiển thị chữ vàng kim sang trọng */}
            {isEditingTitle ? (
              <div
                className="w-full max-w-[90%] sm:max-w-[80%] flex flex-col items-center gap-2 z-30 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <textarea
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  rows={2}
                  className="w-full text-center text-amber-200 font-serif font-black text-[16px] sm:text-[20px] bg-slate-950/90 border-2 border-amber-400 rounded-[12px] p-2 focus:outline-none shadow-2xl"
                  placeholder="Nhập tiêu đề sách..."
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveTitle(titleInput)}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-[8px] text-[12px] shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Lưu tiêu đề</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTitle(false);
                      setTitleInput(bookTitle);
                    }}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-bold rounded-[8px] text-[12px] cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-amber-100 font-serif font-black text-[17px] sm:text-[23px] md:text-[26px] leading-tight tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-[92%] line-clamp-3">
                {bookTitle}
              </h2>
            )}

            {/* Hoa văn ngăn cách mạ vàng sang trọng */}
            <div className="flex items-center justify-center gap-2 my-2 sm:my-3">
              <div className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
              <span className="text-amber-400 text-[10px] sm:text-[12px]">◆</span>
              <div className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-amber-400/80 to-transparent" />
            </div>

            {/* Dòng phụ đề chuẩn y khoa */}
            <p className="text-amber-200/90 italic font-serif text-[11.5px] sm:text-[13px] font-medium max-w-[85%] line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              Tài liệu tra cứu cấu trúc giải phẫu học và sinh lý cơ quan chuẩn y khoa
            </p>
          </div>

          {/* NÚT GỌI MỞ ĐỌC SÁCH NỔI BẬT Ở ĐÁY BÌA */}
          <div className="absolute bottom-3.5 sm:bottom-4 inset-x-0 flex justify-center z-20 pointer-events-none">
            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[12px] sm:text-[13.5px] font-black border border-amber-300 shadow-2xl flex items-center gap-2 group-hover:scale-105 group-hover:brightness-110 transition-all">
              <BookOpen size={16} strokeWidth={2.5} />
              <span>Chạm để mở đọc sách</span>
            </div>
          </div>
        </div>

        {/* THANH ĐIỀU KHIỂN DƯỚI GỌN GÀNG: Nút Trước - Slider trang - Nút Tiếp */}
        <div className="flex items-center justify-between gap-2 pt-1.5 text-[12.5px] font-bold relative z-20">
          <button
            type="button"
            onClick={handleFlipPrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-amber-400/60 text-amber-800 dark:text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs font-extrabold"
          >
            <ChevronLeft size={14} />
            <span>Trước</span>
          </button>

          <div className="flex items-center gap-2 flex-1 max-w-[200px] px-1">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handleJumpToPage(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-black/60 rounded-lg border border-amber-400/30"
            />
            <span className="text-[12px] font-black text-amber-700 dark:text-amber-300 whitespace-nowrap shrink-0">
              {currentPage} / {totalPages}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFlipNext}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer shadow-xs font-black"
          >
            <span>Tiếp</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </section>
      )}

      {/* =========================================================================
          CHẾ ĐỘ ĐỌC TOÀN MÀN HÌNH (FULLSCREEN 3D FLIPBOOK OVERLAY)
          HIỆN THỊ HẲN PHUN TOÀN MÀN HÌNH & HIỆU ỨNG LẬT TRANG CHUẨN ẢNH 2, 3, 4
          ========================================================================= */}
      {isFullscreen && (
        <div
          onMouseMove={resetChromeTimer}
          onTouchStart={resetChromeTimer}
          onPointerDown={resetChromeTimer}
          className="fixed inset-0 z-[9999] bg-black/95 text-white flex flex-col justify-between p-0 sm:p-3 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
        >
          {/* TOP BAR FULLSCREEN (Tự động mờ ẩn khi đọc để tập trung vào sách) */}
          <div
            className={`flex items-center justify-between px-3 sm:px-4 pt-2.5 pb-2 border-b border-white/10 shrink-0 transition-all duration-500 ease-in-out ${
              isChromeVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-6 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* Nút Quay Lại nổi bật ở góc trên bên trái */}
              <button
                type="button"
                onClick={handleCloseFullscreen}
                className="flex items-center gap-1 h-8 px-2.5 rounded-[9px] bg-white/20 hover:bg-white/30 text-white font-extrabold text-[12.5px] cursor-pointer transition-all active:scale-95 shrink-0 shadow-sm border border-white/15"
                title="Quay lại (Đóng sách)"
                aria-label="Quay lại"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
                <span>Quay lại</span>
              </button>

              <div className="w-8 h-8 rounded-[9px] bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 hidden sm:flex">
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                {isEditingTitleInFullscreen ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="h-8 px-2.5 rounded-[8px] bg-slate-900 border border-amber-400 text-amber-200 text-[13px] font-serif font-bold focus:outline-none max-w-[220px] sm:max-w-[320px]"
                      placeholder="Tiêu đề sách..."
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveTitle(tempTitle);
                        setIsEditingTitleInFullscreen(false);
                      }}
                      className="h-8 px-2.5 rounded-[8px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[12px] cursor-pointer"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitleInFullscreen(false)}
                      className="h-8 px-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-[12px] cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="text-[13.5px] sm:text-[16px] font-black text-white truncate font-serif">
                      {bookTitle || title}
                    </h3>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempTitle(bookTitle);
                          setIsEditingTitleInFullscreen(true);
                        }}
                        className="p-1 rounded-[6px] bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer shrink-0"
                        title="Sửa tiêu đề sách ngay tại đây"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>
                )}
                <span className="text-[10.5px] sm:text-[11.5px] text-amber-300 font-bold block truncate">
                  Trang {currentPage} / {totalPages} · Chạm trang để ẩn/hiện thanh công cụ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Thanh điều khiển Zoom Phóng to / Thu nhỏ (Zoom In / Zoom Out / Reset 100%) */}
              <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/15">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1.0}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/20 cursor-pointer transition-colors"
                  title="Thu nhỏ (-)"
                  aria-label="Thu nhỏ"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-1.5 h-7 flex items-center justify-center text-[11px] font-black text-amber-300 hover:text-white cursor-pointer select-none"
                  title="Bấm để đặt lại 100%"
                >
                  {Math.round(zoomScale * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3.0}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/20 cursor-pointer transition-colors"
                  title="Phóng to (+)"
                  aria-label="Phóng to"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* 1 Nút Loa Duy Nhất - Bật/Tắt Âm Thanh Lật Sách & Phản Hồi Âm Thanh Chuẩn */}
              <button
                type="button"
                onClick={() => {
                  const nextSound = !isSoundEnabled;
                  setIsSoundEnabled(nextSound);
                  if (nextSound) {
                    playPageFlipSound();
                  }
                }}
                className={`flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSoundEnabled
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white/50'
                }`}
                title={isSoundEnabled ? 'Tắt âm thanh lật sách' : 'Bật âm thanh lật sách (tiếng sột soạt)'}
                aria-label="Bật tắt âm thanh"
              >
                {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="hidden sm:inline">
                  {isSoundEnabled ? 'Bật âm' : 'Tắt âm'}
                </span>
              </button>

              {/* Nút Đóng Fullscreen */}
              <button
                type="button"
                onClick={handleCloseFullscreen}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[9px] bg-white/20 hover:bg-white/30 text-white font-extrabold text-[12.5px] cursor-pointer transition-colors"
              >
                <X size={16} />
                <span>Đóng</span>
              </button>
            </div>
          </div>

          {/* NÚT QUAY LẠI NỔI LUÔN HIỆN DIỆN KHI THANH CÔNG CỤ ẨN (Để người dùng không bị bối rối) */}
          {!isChromeVisible && (
            <button
              type="button"
              onClick={handleCloseFullscreen}
              className="fixed top-3 left-3 z-50 flex items-center gap-1 h-8 px-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white font-extrabold text-[12px] cursor-pointer border border-white/25 backdrop-blur-xs shadow-lg transition-all animate-in fade-in"
              title="Quay lại"
              aria-label="Quay lại"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              <span>Quay lại</span>
            </button>
          )}

          {/* KHUNG SÁCH LẬT 3D TOÀN MÀN HÌNH CÓ HỖ TRỢ ZOOM & KÉO PAN ĐỌC CHI TIẾT */}
          <div
            className={`flex-1 w-full flex items-center justify-center relative overflow-hidden py-2 ${
              zoomScale > 1.0 ? 'cursor-grab active:cursor-grabbing touch-none' : ''
            }`}
            onMouseDown={(e) => {
              if (zoomScale <= 1.0) return;
              isDraggingPanRef.current = true;
              panStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
            }}
            onMouseMove={(e) => {
              if (!isDraggingPanRef.current || zoomScale <= 1.0) return;
              setPanPosition({
                x: e.clientX - panStartRef.current.x,
                y: e.clientY - panStartRef.current.y,
              });
            }}
            onMouseUp={() => {
              isDraggingPanRef.current = false;
            }}
            onTouchStart={(e) => {
              resetChromeTimer();
              if (e.touches.length === 2) {
                const dist = Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                );
                initialPinchDistRef.current = dist;
                initialPinchScaleRef.current = zoomScale;
              } else if (e.touches.length === 1) {
                const now = performance.now();
                if (now - lastTapRef.current < 280) {
                  // Chạm đúp (Double Tap) trên màn hình cảm ứng để phóng to/thu nhỏ nhanh
                  handleToggleZoom();
                  lastTapRef.current = 0;
                  return;
                }
                lastTapRef.current = now;

                if (zoomScale > 1.0) {
                  isDraggingPanRef.current = true;
                  panStartRef.current = {
                    x: e.touches[0].clientX - panPosition.x,
                    y: e.touches[0].clientY - panPosition.y,
                  };
                }
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 2 && initialPinchDistRef.current) {
                const dist = Math.hypot(
                  e.touches[0].clientX - e.touches[1].clientX,
                  e.touches[0].clientY - e.touches[1].clientY
                );
                const ratio = dist / initialPinchDistRef.current;
                const newScale = Math.min(Math.max(initialPinchScaleRef.current * ratio, 1.0), 3.0);
                const roundedScale = Number(newScale.toFixed(2));
                if (roundedScale <= 1.08) {
                  setZoomScale(1.0);
                  setPanPosition({ x: 0, y: 0 });
                } else {
                  setZoomScale(roundedScale);
                }
              } else if (e.touches.length === 1 && isDraggingPanRef.current && zoomScale > 1.0) {
                setPanPosition({
                  x: e.touches[0].clientX - panStartRef.current.x,
                  y: e.touches[0].clientY - panStartRef.current.y,
                });
              }
            }}
            onTouchEnd={(e) => {
              isDraggingPanRef.current = false;
              initialPinchDistRef.current = null;
              // Nếu không còn ngón tay nào và tỷ lệ zoom <= 1.12x thì tự động snap về đúng 1.0
              if (e.touches.length === 0) {
                setZoomScale((prev) => {
                  if (prev <= 1.12) {
                    setPanPosition({ x: 0, y: 0 });
                    return 1.0;
                  }
                  return prev;
                });
              }
            }}
          >
            {/* Huy hiệu thông báo trạng thái đang phóng to (Chạm để reset) */}
            {zoomScale > 1.0 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-[11px] font-black shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition-all animate-in fade-in slide-in-from-top-2"
                title="Bấm để đưa về 100%"
              >
                <span>🔍 Phóng to {Math.round(zoomScale * 100)}% · Kéo rê để đọc · Chạm để về 100%</span>
              </button>
            )}

            <div
              style={{
                transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                transformOrigin: 'center center',
                transition: isDraggingPanRef.current ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-full h-full max-w-[950px] flex items-center justify-center pointer-events-auto"
              onDoubleClick={handleToggleZoom}
            >
              <SideBooksFlipEngine
                ref={fullscreenFlipRef}
                pageImages={pageImages}
                currentPage={currentPage}
                onPageChange={(newPage) => {
                  setCurrentPage(newPage);
                  resetChromeTimer();
                }}
                onFlipSound={playPageFlipSound}
                onCenterClick={() => {
                  if (zoomScale === 1.0) {
                    setIsChromeVisible((prev) => !prev);
                  }
                }}
                isFullscreen={true}
                disableFlip={zoomScale > 1.0}
                className="w-full h-full max-w-[950px]"
              />
            </div>

            {/* Nút lật trang trước: Mờ 50%, dịch xuống góc dưới, thu nhỏ để không che chữ sách */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFlipPrev();
                resetChromeTimer();
              }}
              disabled={currentPage <= 1}
              className={`absolute left-3 sm:left-6 bottom-3 sm:bottom-5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 flex items-center justify-center shadow-md hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-500 cursor-pointer z-20 ${
                isChromeVisible ? 'opacity-50 hover:opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              title="Trang trước"
              aria-label="Trang trước"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Nút lật trang sau: Mờ 50%, dịch xuống góc dưới, thu nhỏ để không che chữ sách */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFlipNext();
                resetChromeTimer();
              }}
              disabled={currentPage >= totalPages}
              className={`absolute right-3 sm:right-6 bottom-3 sm:bottom-5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 flex items-center justify-center shadow-md hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-500 cursor-pointer z-20 ${
                isChromeVisible ? 'opacity-50 hover:opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              title="Trang sau"
              aria-label="Trang sau"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* BOTTOM BAR FULLSCREEN: ĐIỀU HƯỚNG TRANG & SLIDER (Tự động mờ ẩn khi đọc) */}
          <div
            className={`flex items-center justify-between gap-3 px-3 sm:px-4 pb-2.5 pt-2 border-t border-white/10 shrink-0 max-w-[700px] w-full mx-auto transition-all duration-500 ease-in-out ${
              isChromeVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                handleFlipPrev();
                resetChromeTimer();
              }}
              disabled={currentPage <= 1}
              className="flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-3.5 rounded-[10px] bg-white/15 hover:bg-white/25 text-white disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-[12.5px] sm:text-[13px] cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Trang trước</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[320px]">
              <input
                type="range"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  handleJumpToPage(Number(e.target.value));
                  resetChromeTimer();
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-white/20 rounded-lg"
              />
              <span className="text-[12.5px] sm:text-[13px] font-black text-amber-300 whitespace-nowrap">
                {currentPage} / {totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                handleFlipNext();
                resetChromeTimer();
              }}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-3.5 rounded-[10px] bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed font-black text-[12.5px] sm:text-[13px] cursor-pointer shadow-md"
            >
              <span>Trang tiếp</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL QUẢN TRỊ VIÊN NẠP FILE PDF / BỘ ẢNH (CHỈ DÀNH CHO ADMIN)
          ========================================================================= */}
      {isAdmin && showUploadModal && (
        <div className="fixed inset-0 z-[10000] bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-[440px] rounded-[22px] bg-white dark:bg-[#1C123D] border border-slate-200 dark:border-purple-800 shadow-2xl p-5 flex flex-col gap-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 flex items-center justify-center font-bold">
                  <Upload size={16} />
                </div>
                <div>
                  <h3 className="text-[16px] font-black">Nạp Tài Liệu Sách Lật 3D</h3>
                  <span className="text-[12px] text-slate-500 dark:text-purple-300">
                    Chỉ Quản trị viên mới có quyền thay đổi
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white cursor-pointer hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            {isLoadingPdf ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 size={32} className="animate-spin text-amber-500" />
                <p className="text-[14px] font-bold text-amber-600 dark:text-amber-400">
                  {pdfProgressText || 'Đang xử lý tài liệu...'}
                </p>
                <span className="text-[12px] text-slate-500">
                  Hệ thống đang chuyển đổi từng trang sang định dạng 3D siêu nét
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Lựa chọn 1: Nạp file PDF */}
                <label className="flex items-center gap-3 p-3.5 rounded-[14px] border-2 border-dashed border-amber-300 dark:border-purple-600/60 bg-amber-50/40 dark:bg-purple-950/30 hover:bg-amber-50 hover:border-amber-500 cursor-pointer transition-all">
                  <div className="w-10 h-10 rounded-[10px] bg-amber-100 dark:bg-purple-900/60 text-amber-800 dark:text-purple-200 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-black text-slate-900 dark:text-white">
                      Nạp từ file PDF
                    </span>
                    <span className="text-[12px] text-slate-500 dark:text-purple-300">
                      Tự động trích xuất các trang thành sách lật 3D
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>

                {/* Lựa chọn 2: Nạp bộ ảnh (JPG, PNG, WebP) */}
                <label className="flex items-center gap-3 p-3.5 rounded-[14px] border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-all">
                  <div className="w-10 h-10 rounded-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-black text-slate-900 dark:text-white">
                      Nạp nhiều file Ảnh
                    </span>
                    <span className="text-[12px] text-slate-500 dark:text-purple-300">
                      Chọn nhiều ảnh cùng lúc để ghép thành các trang sách
                    </span>
                  </div>
                  <input
                    ref={imagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                  />
                </label>

                {/* Nút Đặt lại mặc định */}
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="flex items-center justify-center gap-2 h-10 rounded-[12px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-purple-200 text-[13px] font-bold hover:bg-slate-200 cursor-pointer mt-1"
                >
                  <RotateCcw size={14} />
                  <span>Khôi phục tài liệu Atlas mặc định</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL CÀI ĐẶT BÌA & TIÊU ĐỀ SÁCH (CHO ADMIN TÙY BIẾN TIÊU ĐỀ, MẪU BÌA SẠCH HOẶC TẢI LÊN)
          ========================================================================= */}
      {showCoverModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowCoverModal(false)}
        >
          <div
            className="w-full max-w-[500px] rounded-[24px] bg-white dark:bg-[#0F172A] border border-amber-400/50 p-4 sm:p-5 text-slate-900 dark:text-white shadow-2xl flex flex-col gap-4 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-amber-800 dark:text-amber-200 leading-tight">
                    Cài đặt Bìa & Tiêu đề Sách
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Tùy biến lớp phủ bìa ngoài và tiêu đề sách
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                title="Đóng"
              >
                <X size={16} />
              </button>
            </div>

            {/* Xem trước bìa trực quan */}
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
              <div
                onClick={() => setIsCropCoverOpen(true)}
                className="w-24 h-24 rounded-[10px] bg-slate-900 border border-amber-400/50 overflow-hidden relative shrink-0 shadow-md flex items-center justify-center cursor-pointer group hover:border-amber-300 transition-colors"
                title="Nhấn để cắt và chỉnh khung ảnh bìa"
              >
                <img
                  src={tempCoverUrl || currentCoverUrl}
                  alt="Xem trước bìa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-20">
                  <Crop size={18} className="text-amber-300" />
                </div>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-1 text-center">
                  <span className="text-[9px] font-serif font-black text-amber-200 line-clamp-3 leading-tight drop-shadow">
                    {tempTitle || bookTitle}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                  Xem trước lớp phủ bìa
                </span>
                <p className="text-[13px] text-slate-900 dark:text-slate-100 font-serif font-bold line-clamp-2">
                  {tempTitle || bookTitle}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCropCoverOpen(true)}
                  className="mt-2 h-7 px-2.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Crop size={12} strokeWidth={2.5} />
                  <span>Cắt & căn khung ảnh này</span>
                </button>
              </div>
            </div>

            {/* Phần 1: Tiêu đề sách */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-extrabold text-slate-800 dark:text-amber-100 flex items-center gap-1.5">
                <Type size={14} className="text-amber-400" />
                <span>1. Tiêu đề sách (hiển thị trên bìa & trong sách):</span>
              </label>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Nhập tiêu đề sách (vd: Atlas Giải Phẫu Cột Sống 3D)..."
                className="w-full h-10 px-3 rounded-[10px] bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder-slate-400 text-[13px] font-serif font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phần 2: Chọn mẫu bìa nền sạch có sẵn */}
            <div className="flex flex-col gap-2">
              <label className="text-[12.5px] font-extrabold text-slate-800 dark:text-amber-100 flex items-center gap-1.5">
                <Layers size={14} className="text-amber-400" />
                <span>2. Chọn mẫu nền bìa sạch hoàng gia (Không in chữ sẵn):</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {CLEAN_COVER_PRESETS.map((preset) => {
                  const isSelected = (tempCoverUrl || currentCoverUrl) === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setTempCoverUrl(preset.url)}
                      className={`flex flex-col items-center gap-1 p-1 rounded-[10px] border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/20 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-[6px] overflow-hidden bg-slate-900 border border-black/20">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-center leading-tight line-clamp-1 text-slate-700 dark:text-slate-200">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phần 3: Hoặc tải ảnh riêng từ máy */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Upload size={13} className="text-amber-400" />
                <span>3. Hoặc tải ảnh nền riêng từ máy:</span>
              </label>
              <label className="w-full h-10 rounded-[10px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold text-[12px] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]">
                {isUploadingCover ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-amber-400" />
                    <span>Đang tải ảnh lên...</span>
                  </>
                ) : (
                  <>
                    <Upload size={15} className="text-amber-400" />
                    <span>Chọn ảnh nền riêng (JPG, PNG, WebP)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingCover}
                  className="hidden"
                  onChange={async (e) => {
                    const input = e.target;
                    const file = input.files?.[0];
                    if (!file) return;
                    try {
                      setIsUploadingCover(true);
                      const res = await uploadImageFile(file);
                      setTempCoverUrl(res.url);
                    } catch (err: any) {
                      alert(err?.message || 'Không tải được ảnh lên. Vui lòng thử lại.');
                    } finally {
                      setIsUploadingCover(false);
                      input.value = '';
                    }
                  }}
                />
              </label>
            </div>

            {/* Phần 4: Hoặc dán link ảnh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                4. Hoặc dán đường dẫn ảnh nền bìa:
              </label>
              <input
                type="url"
                value={tempCoverUrl}
                onChange={(e) => setTempCoverUrl(e.target.value)}
                placeholder="https://example.com/anh-bia-sach.jpg..."
                className="w-full h-9 px-3 rounded-[8px] bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder-slate-400 text-[12px] focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Nút hành động Lưu & Dùng mặc định */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTempCoverUrl(defaultCoverUrl);
                  setTempTitle(defaultAutoTitle);
                }}
                className="text-[12px] text-amber-700 dark:text-amber-400/80 hover:text-amber-600 dark:hover:text-amber-300 font-bold underline cursor-pointer"
              >
                Đặt lại mẫu gốc
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCoverModal(false)}
                  className="h-9 px-3.5 rounded-[10px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-[12.5px] font-bold cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tempTitle && tempTitle.trim() !== bookTitle) {
                      handleSaveTitle(tempTitle);
                    }
                    handleSaveCover(tempCoverUrl || currentCoverUrl);
                    setShowCoverModal(false);
                  }}
                  className="h-9 px-4 rounded-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 text-[12.5px] font-black cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Lưu cài đặt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal cắt và căn khung ảnh bìa sách */}
      {isCropCoverOpen && (tempCoverUrl || currentCoverUrl) && (
        <ImageCropModal
          isOpen={isCropCoverOpen}
          imageUrl={tempCoverUrl || currentCoverUrl}
          title="Cắt & Căn Khung Ảnh Bìa Sách"
          defaultAspect="1:1"
          onClose={() => setIsCropCoverOpen(false)}
          onCropSaved={async (newUrl) => {
            setTempCoverUrl(newUrl);
            handleSaveCover(newUrl);
            setIsCropCoverOpen(false);
          }}
        />
      )}
    </>
  );
}

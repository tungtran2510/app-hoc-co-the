export type AccessMode = 'OPEN' | 'GUIDED' | 'LOCKED';

export interface AuthorBook {
  id: string;
  title: string;
  cover_url?: string | null;
  description: string;
  year?: string;
  youtube_url?: string | null;
  gallery_images?: string[];
  flipbook_pages?: string[];
  file_url?: string | null;
  file_name?: string | null;
  pdf_url?: string | null;
  is_visible?: boolean;
}

export interface AuthorProfile {
  name: string;
  title: string;
  avatar_url?: string | null;
  bio: string;
  intro_image_url?: string | null;
  intro_video_url?: string | null;
  books: AuthorBook[];
  books_title?: string | null;
  books_subtitle?: string | null;
  contact_title?: string | null;
  contact_subtitle?: string | null;
  extra_title?: string;
  extra_content?: string;
  contact_note?: string;
  phone?: string | null;
  zalo_url?: string | null;
  email?: string | null;
  facebook_url?: string | null;
  address?: string | null;
}

export interface RecommendedBook {
  id: string;
  title: string;
  category?: string | null;
  badge_tag?: string | null;
  cover_url: string | null;
  description: string;
  author?: string | null;
  link_url?: string | null;
  tag?: string | null;
  color_theme?: string | null;
  youtube_url?: string | null;
  gallery_images?: string[];
  flipbook_pages?: string[];
  file_url?: string | null;
  file_name?: string | null;
  pdf_url?: string | null;
  is_visible?: boolean;
}

export interface AiKnowledgeDoc {
  id: string;
  title: string;
  content: string;
  updated_at?: string;
}

export interface AiFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AiTrainingConfig {
  guidelines?: string;
  documents?: AiKnowledgeDoc[];
  faqs?: AiFaqItem[];
}

export interface Settings {
  workspace_id: string;
  app_name: string;
  app_subtitle?: string | null;
  brand_tagline?: string | null;
  logo_url: string | null;
  primary_color: string;
  access_mode: AccessMode;
  block_styles: Record<string, { label: string | null; icon: string | null; bg: string | null; fg: string }>;
  zalo_consult_url?: string | null;
  hotline?: string | null;
  expert_title?: string | null;
  zalo_url?: string | null;
  author_profile?: AuthorProfile | null;
  home_greeting?: string | null;
  home_title?: string | null;
  search_placeholder?: string | null;
  topics_title?: string | null;
  recommended_books_title?: string | null;
  recommended_books_subtitle?: string | null;
  recommended_books?: RecommendedBook[];
  recommended_books_layout?: 'grid' | 'lookbook' | null;
  flat_books_title?: string | null;
  flat_books?: RecommendedBook[];
  home_sections_order?: string[] | null;
  hidden_home_sections?: string[] | null;
  ai_training?: AiTrainingConfig | null;
  welcome_title?: string | null;
  welcome_message?: string | null;
  welcome_video_url?: string | null;
  home_custom_blocks?: Record<string, CustomHtmlBlockData> | null;
}

/** Khối tùy biến ở Trang chủ: tiêu đề + ảnh + văn bản thường + HTML */
export interface CustomHtmlBlockData {
  title?: string;
  images?: { url: string; caption?: string }[];
  text?: string;
  html?: string;
}

export interface Topic {
  id: string;
  workspace_id: string;
  slug: string;
  title: string;
  description: string | null;
  meta_note: string | null;
  cover_url: string | null;
  icon: string | null;
  color_bg: string;
  color_fg: string;
  sort_order: number;
  is_visible: boolean;
}

export interface Page {
  id: string;
  workspace_id: string;
  topic_id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  sort_order: number;
  is_visible: boolean;
  status: 'draft' | 'published';
  access_mode: AccessMode | null;
}

export interface Image {
  url: string;
  thumb_url?: string;
  caption?: string;
  alt?: string;
}

export interface Video {
  youtube_id: string;
  title: string;
  description?: string;
  duration_text?: string;
  thumbnail_url?: string;
  is_vertical?: boolean;
  aspect_ratio?: 'horizontal' | 'vertical' | '9:16' | '16:9';
}

export interface FileItem {
  url: string;
  name: string;
  size_bytes?: number;
}

export type Block =
  | {
      id: string;
      page_id: string;
      type: 'text';
      display_style: string;
      sort_order: number;
      is_visible: boolean;
      data: {
        title?: string;
        title_color?: string;
        mode?: 'text' | 'html';
        html?: string;
        font_size?: string;
        text_color?: string;
        text_align?: 'left' | 'center' | 'right' | 'justify';
        lines: string[];
        format?: 'paragraph' | 'numbered' | 'bullet';
        images?: Image[];
        files?: FileItem[];
        videos?: Video[];
      };
    }
  | {
      id: string;
      page_id: string;
      type: 'images';
      display_style: 'single' | 'gallery';
      sort_order: number;
      is_visible: boolean;
      data: { images: Image[] };
    }
  | {
      id: string;
      page_id: string;
      type: 'videos';
      display_style: 'single' | 'playlist';
      sort_order: number;
      is_visible: boolean;
      data: { videos: Video[] };
    }
  | {
      id: string;
      page_id: string;
      type: 'links';
      display_style: 'related' | 'external';
      sort_order: number;
      is_visible: boolean;
      data: { items: { page_id?: string; url?: string; label?: string }[] };
    }
  | {
      id: string;
      page_id: string;
      type: 'files';
      display_style: 'pdf' | 'flipbook' | string;
      sort_order: number;
      is_visible: boolean;
      data: { files: FileItem[]; cover_url?: string; title?: string };
    }
  | {
      id: string;
      page_id: string;
      type: 'comparison';
      display_style: 'two_column';
      sort_order: number;
      is_visible: boolean;
      data: {
        left_title?: string;
        left_lines: string[];
        right_title?: string;
        right_lines: string[];
      };
    }
  | {
      id: string;
      page_id: string;
      type: 'faq';
      display_style: 'accordion' | 'card' | string;
      sort_order: number;
      is_visible: boolean;
      data: {
        title?: string;
        items: Array<{
          id: string;
          question: string;
          answer: string;
        }>;
      };
    };

export interface ContinueInfo {
  topic_slug: string;
  topic_title: string;
  page_slug: string;
  page_title: string;
  video_index: number;
  video_total: number;
  video_title: string;
  page_order_label: string;
}

export interface UserProgressSyncData {
  phone: string;
  xem_tiep?: any;
  tien_do?: Record<string, { last_video: number; watched: number[] }>;
  bai_da_luu?: Array<{
    page_id: string;
    topic_slug: string;
    topic_title: string;
    page_slug: string;
    page_title: string;
    page_number: number;
    saved_at: number;
  }>;
  da_hoan_thanh?: string[];
  updated_at?: string;
}

export interface InstructorAccount {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: 'instructor' | 'admin';
  allowed_topic_ids: string[];
  is_active: boolean;
  created_at?: string;
}

export interface AdminUserSession {
  phone: string;
  name: string;
  role: 'super_admin' | 'admin' | 'instructor';
  allowed_topic_ids?: string[];
  workspace_id?: string;
}

export interface WorkspaceTenant {
  id: string; // Mã slug định danh workspace, vd: 'bs-tuan'
  name: string; // Tên app/phòng khám, vd: 'Cột Sống Khỏe - Bs. Tuấn'
  owner_name?: string; // Tên người sở hữu
  owner_phone: string; // Số điện thoại quản trị
  admin_password?: string; // Mật khẩu quản trị
  custom_domain?: string | null; // Tên miền riêng nếu có
  subdomain?: string | null; // Subdomain riêng nếu có
  is_active: boolean; // Trạng thái hoạt động
  created_at: string; // Ngày tạo
  expires_at?: string | null; // Ngày hết hạn dịch vụ
  copied_template?: boolean; // Đã sao chép khóa học mẫu
  note?: string; // Ghi chú hợp đồng / thanh toán
}


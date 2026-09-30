export type AccessMode = 'OPEN' | 'GUIDED' | 'LOCKED';

export interface AuthorBook {
  id: string;
  title: string;
  cover_url?: string | null;
  description: string;
  year?: string;
  youtube_url?: string | null;
}

export interface AuthorProfile {
  name: string;
  title: string;
  avatar_url?: string | null;
  bio: string;
  intro_image_url?: string | null;
  intro_video_url?: string | null;
  books: AuthorBook[];
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
  cover_url: string | null;
  description: string;
  author?: string | null;
  link_url?: string | null;
  tag?: string | null;
  color_theme?: string | null;
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
  home_sections_order?: string[] | null;
  ai_training?: AiTrainingConfig | null;
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
      display_style: 'pdf';
      sort_order: number;
      is_visible: boolean;
      data: { files: FileItem[] };
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

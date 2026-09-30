export type AccessMode = 'OPEN' | 'GUIDED' | 'LOCKED';

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

import React from 'react';
import { Block, Video } from '../lib/types';
import TextBlock from './blocks/TextBlock';
import VideosBlock from './blocks/VideosBlock';
import ImagesBlock from './blocks/ImagesBlock';
import LinksBlock from './blocks/LinksBlock';
import FilesBlock from './blocks/FilesBlock';
import ComparisonBlock from './blocks/ComparisonBlock';
import FaqBlock from './blocks/FaqBlock';
import { FontSizeOption } from './PageHeaderBar';

interface BlockRendererProps {
  block: Block;
  fontSizeMode?: FontSizeOption;
  defaultActiveVideoIndex?: number;
  isAdmin?: boolean;
  onOpenVideoManager?: () => void;
  onSaveVideos?: (newVideos: Video[]) => void;
  pageId?: string;
  topicSlug?: string;
  topicTitle?: string;
  pageSlug?: string;
  pageTitle?: string;
  pageNumber?: number;
  pageCoverUrl?: string | null;
  pageSlugMap?: Record<string, { slug: string; topicSlug: string; title: string; cover_url?: string }>;
  nextPage?: { slug: string; title: string; orderNumber: number } | null;
  summaryContent?: React.ReactNode;
  progressAction?: React.ReactNode;
  resourcesContent?: React.ReactNode;
  activeTab?: 'syllabus' | 'summary' | 'resources';
  onTabChange?: (tab: 'syllabus' | 'summary' | 'resources') => void;
}

export default function BlockRenderer({
  block,
  fontSizeMode = 'normal',
  defaultActiveVideoIndex = 0,
  isAdmin = false,
  onOpenVideoManager,
  onSaveVideos,
  pageId,
  topicSlug,
  topicTitle,
  pageSlug,
  pageTitle,
  pageNumber,
  pageCoverUrl,
  pageSlugMap,
  nextPage,
  summaryContent,
  progressAction,
  resourcesContent,
  activeTab,
  onTabChange,
}: BlockRendererProps) {
  const blockId = `block-${block.id}`;

  switch (block.type) {
    case 'text':
      return (
        <TextBlock
          blockId={blockId}
          displayStyle={block.display_style}
          title={block.data.title}
          titleColor={block.data.title_color}
          mode={block.data.mode}
          html={block.data.html}
          lines={block.data.lines}
          format={block.data.format}
          fontSizeMode={fontSizeMode}
          fontSize={block.data.font_size}
          textColor={block.data.text_color}
          textAlign={block.data.text_align}
          images={block.data.images}
          files={block.data.files}
          videos={block.data.videos}
        />
      );

    case 'videos':
      return (
        <VideosBlock
          blockId={blockId}
          videos={block.data.videos}
          displayStyle={block.display_style}
          defaultActiveIndex={defaultActiveVideoIndex}
          isAdmin={isAdmin}
          onOpenVideoManager={onOpenVideoManager}
          onSaveVideos={onSaveVideos}
          pageId={pageId}
          topicSlug={topicSlug}
          topicTitle={topicTitle}
          pageSlug={pageSlug}
          pageTitle={pageTitle}
          pageNumber={pageNumber}
          pageCoverUrl={pageCoverUrl}
          nextPage={nextPage}
          summaryContent={summaryContent}
          progressAction={progressAction}
          resourcesContent={resourcesContent}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      );

    case 'images':
      return (
        <ImagesBlock
          blockId={blockId}
          displayStyle={block.display_style}
          images={block.data.images}
        />
      );

    case 'links':
      return (
        <LinksBlock
          blockId={blockId}
          displayStyle={block.display_style}
          items={block.data.items}
          topicSlug={topicSlug}
          pageSlugMap={pageSlugMap}
        />
      );

    case 'files':
      return (
        <FilesBlock
          blockId={blockId}
          files={block.data.files}
        />
      );

    case 'comparison':
      return (
        <ComparisonBlock
          blockId={blockId}
          leftTitle={block.data.left_title}
          leftLines={block.data.left_lines}
          rightTitle={block.data.right_title}
          rightLines={block.data.right_lines}
          fontSizeMode={fontSizeMode}
        />
      );

    case 'faq':
      return (
        <FaqBlock
          blockId={blockId}
          title={block.data.title}
          items={block.data.items}
          fontSizeMode={fontSizeMode}
        />
      );

    default:
      return null;
  }
}

import React from 'react';
import { Block } from '../lib/types';
import TextBlock from './blocks/TextBlock';
import VideosBlock from './blocks/VideosBlock';
import ImagesBlock from './blocks/ImagesBlock';
import LinksBlock from './blocks/LinksBlock';
import FilesBlock from './blocks/FilesBlock';
import ComparisonBlock from './blocks/ComparisonBlock';
import { FontSizeOption } from './PageHeaderBar';

interface BlockRendererProps {
  block: Block;
  fontSizeMode?: FontSizeOption;
  defaultActiveVideoIndex?: number;
  isAdmin?: boolean;
  onOpenVideoManager?: () => void;
  pageId?: string;
  topicSlug?: string;
  topicTitle?: string;
  pageSlug?: string;
  pageTitle?: string;
  pageNumber?: number;
  pageCoverUrl?: string | null;
  nextPage?: { slug: string; title: string; orderNumber: number } | null;
}

export default function BlockRenderer({
  block,
  fontSizeMode = 'normal',
  defaultActiveVideoIndex = 0,
  isAdmin = false,
  onOpenVideoManager,
  pageId,
  topicSlug,
  topicTitle,
  pageSlug,
  pageTitle,
  pageNumber,
  pageCoverUrl,
  nextPage,
}: BlockRendererProps) {
  const blockId = `block-${block.id}`;

  switch (block.type) {
    case 'text':
      return (
        <TextBlock
          blockId={blockId}
          displayStyle={block.display_style}
          lines={block.data.lines}
          format={block.data.format}
          fontSizeMode={fontSizeMode}
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
          pageId={pageId}
          topicSlug={topicSlug}
          topicTitle={topicTitle}
          pageSlug={pageSlug}
          pageTitle={pageTitle}
          pageNumber={pageNumber}
          pageCoverUrl={pageCoverUrl}
          nextPage={nextPage}
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

    default:
      return null;
  }
}

import React from 'react';
import { Block } from '../lib/types';
import TextBlock from './blocks/TextBlock';
import VideosBlock from './blocks/VideosBlock';
import ImagesBlock from './blocks/ImagesBlock';
import LinksBlock from './blocks/LinksBlock';
import FilesBlock from './blocks/FilesBlock';
import { FontSizeOption } from './PageHeaderBar';

interface BlockRendererProps {
  block: Block;
  fontSizeMode?: FontSizeOption;
  defaultActiveVideoIndex?: number;
  isAdmin?: boolean;
  onOpenVideoManager?: () => void;
}

export default function BlockRenderer({
  block,
  fontSizeMode = 'normal',
  defaultActiveVideoIndex = 0,
  isAdmin = false,
  onOpenVideoManager,
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

    default:
      return null;
  }
}

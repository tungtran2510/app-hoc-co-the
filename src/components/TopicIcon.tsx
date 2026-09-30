import React from 'react';

interface TopicIconProps {
  name: string | null;
  className?: string;
  size?: number;
}

export default function TopicIcon({ name, className = '', size = 40 }: TopicIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 56 56',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (name) {
    case 'spine':
      return (
        <svg {...props}>
          <rect x="20" y="4" width="16" height="9" rx="3" />
          <rect x="19" y="17" width="18" height="9" rx="3" />
          <rect x="18" y="30" width="20" height="9" rx="3" />
          <rect x="19" y="43" width="18" height="9" rx="3" />
        </svg>
      );
    case 'bowl':
      return (
        <svg {...props}>
          <path d="M8 30h40a20 20 0 0 1-40 0z" />
          <path d="M28 24c0-9 6-14 14-14 0 8-6 14-14 14z" />
          <path d="M28 24c-1-5-4-8-9-9" />
        </svg>
      );
    case 'droplet':
      return (
        <svg {...props}>
          <path d="M28 5C28 5 12 23 12 34a16 16 0 0 0 32 0C44 23 28 5 28 5z" />
          <path d="M20 36a8 8 0 0 0 8 8" />
        </svg>
      );
    case 'stomach':
      return (
        <svg {...props}>
          <path d="M22 5v10c0 5-9 7-9 18 0 10 8 17 18 17 9 0 15-7 15-14 0-8-8-11-13-8-4 2-4 7-1 9" />
        </svg>
      );
    case 'body':
      return (
        <svg {...props}>
          <circle cx="28" cy="10" r="6" />
          <path d="M28 17v17" />
          <path d="M14 24l14 4 14-4" />
          <path d="M20 51l8-17 8 17" />
        </svg>
      );
    case 'molecule':
      return (
        <svg {...props}>
          <circle cx="15" cy="16" r="6" />
          <circle cx="41" cy="20" r="6" />
          <circle cx="26" cy="41" r="6" />
          <path d="M21 17l14 2" />
          <path d="M18 22l5 13" />
          <path d="M37 25l-7 11" />
        </svg>
      );
    case 'liver':
      return (
        <svg {...props}>
          <path d="M7 22c0-8 10-12 24-12s18 6 16 14c-2 10-14 20-26 20-4 0-4-6-2-10-6 0-12-4-12-12z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M28 6l18 6v14c0 12-8 20-18 24-10-4-18-12-18-24V12z" />
          <path d="M20 28l6 6 10-12" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="28" cy="28" r="20" />
        </svg>
      );
  }
}

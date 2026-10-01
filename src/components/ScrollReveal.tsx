'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'bubble-pop' | 'slide-left' | 'slide-right' | 'book-cascade';
  delay?: number; // Độ trễ chuyển động theo mili-giây
  className?: string;
  as?: React.ElementType;
}

export default function ScrollReveal({
  children,
  animation = 'bubble-pop',
  delay = 0,
  className = '',
  as: Component = 'div',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Ngắt theo dõi ngay lập tức để tiết kiệm tối đa RAM và pin (Zero-Jank)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case 'bubble-pop':
        return 'animate-bubble-pop';
      case 'slide-left':
        return 'animate-slide-left';
      case 'slide-right':
        return 'animate-slide-right';
      case 'book-cascade':
        return 'animate-book-cascade';
      default:
        return 'animate-bubble-pop';
    }
  };

  return (
    <Component
      ref={elementRef}
      className={`${className} ${
        isVisible ? getAnimationClass() : 'opacity-0 translate-y-3'
      } transition-opacity`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

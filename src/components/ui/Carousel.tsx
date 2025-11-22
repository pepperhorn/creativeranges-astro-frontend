'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CarouselProps {
  children: ReactNode;
  className?: string;
  showControls?: boolean;
  scrollStep?: number;
  gap?: number;
}

export default function Carousel({
  children,
  className,
  showControls = true,
  scrollStep = 300,
  gap = 24,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -scrollStep : scrollStep;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative', className)}>
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg',
              'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm',
              'hover:bg-white dark:hover:bg-gray-900',
              !canScrollLeft && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg',
              'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm',
              'hover:bg-white dark:hover:bg-gray-900',
              !canScrollRight && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </Button>
        </>
      )}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: showControls ? '48px' : '0',
          paddingRight: showControls ? '48px' : '0',
        }}
      >
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
          }}
        >
          {children}
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}



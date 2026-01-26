'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioCompany } from '@/types/database'

type PortfolioCarouselProps = {
  companies: PortfolioCompany[]
}

export function PortfolioCarousel({ companies }: PortfolioCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 280 // approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 rounded-full bg-background border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 rounded-full bg-background border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {companies.map((company) => (
          <a
            key={company.id}
            href={company.website_url || '#'}
            target={company.website_url ? '_blank' : undefined}
            rel={company.website_url ? 'noopener noreferrer' : undefined}
            className={`flex-shrink-0 w-[260px] rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20 ${
              company.website_url ? 'cursor-pointer' : 'cursor-default'
            }`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-center h-16 mb-3">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg font-semibold text-muted-foreground">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold">{company.name}</h3>
              {company.tagline && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {company.tagline}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

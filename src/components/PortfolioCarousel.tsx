'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioCompany } from '@/types/database'

type PortfolioCarouselProps = {
  companies: PortfolioCompany[]
}

function CompanyCard({ company }: { company: PortfolioCompany }) {
  return (
    <a
      href={company.website_url || '#'}
      target={company.website_url ? '_blank' : undefined}
      rel={company.website_url ? 'noopener noreferrer' : undefined}
      className={`block rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20 h-[170px] flex flex-col ${
        company.website_url ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="flex items-center justify-center h-16 mb-3 flex-shrink-0">
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
      <div className="text-center flex-1 flex flex-col justify-start">
        <h3 className="font-semibold text-sm">{company.name}</h3>
        {company.tagline && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {company.tagline}
          </p>
        )}
      </div>
    </a>
  )
}

export function PortfolioCarousel({ companies }: PortfolioCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [visibleWidth, setVisibleWidth] = useState<number | null>(null)

  const COLUMN_WIDTH = 280
  const GAP = 16

  // Group companies into pairs for 2-row display
  const columns: PortfolioCompany[][] = []
  for (let i = 0; i < companies.length; i += 2) {
    columns.push(companies.slice(i, i + 2))
  }

  const calculateVisibleWidth = () => {
    if (containerRef.current) {
      // Get the actual content width (subtract some buffer for safety)
      const containerWidth = containerRef.current.clientWidth - 20
      // Calculate how many complete columns fit
      const columnsVisible = Math.max(1, Math.floor(containerWidth / (COLUMN_WIDTH + GAP)))
      // Width = columns * columnWidth + gaps between them
      const width = columnsVisible * COLUMN_WIDTH + (columnsVisible - 1) * GAP
      setVisibleWidth(width)
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    // Small delay to ensure layout is complete
    const timer = setTimeout(() => {
      calculateVisibleWidth()
      checkScroll()
    }, 0)

    const handleResize = () => {
      calculateVisibleWidth()
      checkScroll()
    }

    window.addEventListener('resize', handleResize)

    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      if (ref) {
        ref.removeEventListener('scroll', checkScroll)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current && visibleWidth) {
      const columnsVisible = Math.floor((visibleWidth + GAP) / (COLUMN_WIDTH + GAP))
      const scrollAmount = columnsVisible * (COLUMN_WIDTH + GAP)
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div ref={containerRef} className="relative group">
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

      {/* Carousel Container - clips to show only full columns */}
      <div
        className="mx-auto"
        style={{
          width: visibleWidth ? `${visibleWidth}px` : '100%',
          overflow: 'hidden'
        }}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className="flex-shrink-0 flex flex-col gap-4"
              style={{
                width: `${COLUMN_WIDTH}px`,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always'
              }}
            >
              {column.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

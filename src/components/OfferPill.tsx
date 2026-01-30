'use client'

import { useState, useRef, useEffect } from 'react'

interface OfferPillProps {
  label: string
  description: string
}

export function OfferPill({ label, description }: OfferPillProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={pillRef}>
      <button
        type="button"
        className="px-4 py-2 rounded-full bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-expanded={isOpen}
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-72 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-sm text-muted-foreground z-50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
          <p className="relative">{description}</p>
        </div>
      )}
    </div>
  )
}

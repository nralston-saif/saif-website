'use client'

import { useState } from 'react'

interface OfferPillProps {
  label: string
  description: string
}

export function OfferPill({ label, description }: OfferPillProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      <span
        className="px-4 py-2 rounded-full bg-white text-sm font-medium cursor-default hover:bg-gray-50 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {label}
      </span>
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-sm text-muted-foreground z-50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
          <p className="relative">{description}</p>
        </div>
      )}
    </div>
  )
}

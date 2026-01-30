'use client'

import { useEffect, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down'
}

export function ScrollReveal({ children, className = '', direction = 'up' }: ScrollRevealProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setIsScrolled(true)
      } else if (window.scrollY <= 10) {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // For 'down' direction: hero content fades up and out
  if (direction === 'down') {
    return (
      <div
        className={`transition-all duration-1000 ease-out ${
          isScrolled
            ? 'opacity-0 -translate-y-32'
            : 'opacity-100 translate-y-0'
        } ${className}`}
      >
        {children}
      </div>
    )
  }

  // For 'up' direction: content slides up from below
  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        isScrolled
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-[30vh]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Collapsible hero wrapper that shrinks when scrolled
export function CollapsibleHero({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setIsScrolled(true)
      } else if (window.scrollY <= 10) {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      className={`transition-all duration-1000 ease-out overflow-hidden ${
        isScrolled
          ? 'min-h-0 h-0'
          : 'min-h-[calc(100vh-80px)]'
      } flex items-center ${className}`}
    >
      {children}
    </div>
  )
}

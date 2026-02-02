'use client'

import { useEffect, useState, useRef } from 'react'

// Global state to keep all components in sync
let isScrolledGlobal = false
let listeners: Set<(value: boolean) => void> = new Set()

function setScrolledState(value: boolean) {
  if (isScrolledGlobal === value) return
  isScrolledGlobal = value
  listeners.forEach(fn => fn(value))
}

function useScrollState() {
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    // Sync with global state on mount
    setIsScrolled(isScrolledGlobal)

    const listener = (value: boolean) => setIsScrolled(value)
    listeners.add(listener)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollingDown = scrollY > lastScrollY.current

      // Scrolling down: trigger at threshold
      if (scrollingDown && scrollY > 50 && !isScrolledGlobal) {
        setScrolledState(true)
      }
      // Scrolling up: reset when near top
      else if (!scrollingDown && scrollY < 20 && isScrolledGlobal) {
        setScrolledState(false)
      }

      lastScrollY.current = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      listeners.delete(listener)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isScrolled
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down'
}

export function ScrollReveal({ children, className = '', direction = 'up' }: ScrollRevealProps) {
  const isScrolled = useScrollState()

  if (direction === 'down') {
    return (
      <div
        className={`transition-all duration-700 ease-out ${
          isScrolled
            ? 'opacity-0 -translate-y-16 pointer-events-none'
            : 'opacity-100 translate-y-0'
        } ${className}`}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isScrolled
          ? 'opacity-100 pt-48'
          : 'opacity-0 pt-0 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Fixed hero that stays in place - content scrolls over it
export function CollapsibleHero({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const isScrolled = useScrollState()

  return (
    <>
      {/* Fixed hero background */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 flex items-center justify-center -translate-y-12 z-0 transition-opacity duration-700 ease-out ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${className}`}
      >
        {children}
      </div>
      {/* Spacer that collapses when scrolled */}
      <div
        className={`transition-all duration-700 ease-out ${
          isScrolled ? 'h-0' : 'h-[calc(100vh-80px)]'
        }`}
      />
    </>
  )
}

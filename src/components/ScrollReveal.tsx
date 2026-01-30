'use client'

import { useEffect, useState, useRef } from 'react'

// How many pixels of scroll to complete the transition when scrolling up
const SCROLL_DISTANCE = 300

function useScrollState() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [progress, setProgress] = useState(0) // 0 = hero visible, 1 = hero hidden
  const lastScrollY = useRef(0)
  const wasScrolled = useRef(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const scrollY = window.scrollY
      const scrollingDown = scrollY > lastScrollY.current

      if (scrollingDown) {
        // Scrolling down: threshold-based trigger
        if (scrollY > 30 && !wasScrolled.current) {
          setIsScrolled(true)
          setProgress(1)
          wasScrolled.current = true
        }
      } else {
        // Scrolling up: progress-based animation
        if (wasScrolled.current) {
          // Calculate progress based on how close to top
          const newProgress = Math.min(1, Math.max(0, scrollY / SCROLL_DISTANCE))
          setProgress(newProgress)

          if (scrollY < 5) {
            setIsScrolled(false)
            wasScrolled.current = false
          }
        }
      }

      lastScrollY.current = scrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { isScrolled, progress }
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down'
}

export function ScrollReveal({ children, className = '', direction = 'up' }: ScrollRevealProps) {
  const { isScrolled, progress } = useScrollState()

  // For 'down' direction: hero content fades up and out
  if (direction === 'down') {
    // When scrolling down (isScrolled just became true), use CSS transition
    // When scrolling up (progress < 1), use scroll-linked animation
    const useTransition = isScrolled && progress === 1

    return (
      <div
        className={`${useTransition ? 'transition-all duration-700 ease-out' : ''} ${className}`}
        style={{
          opacity: 1 - progress,
          transform: `translateY(${-progress * 64}px)`,
        }}
      >
        {children}
      </div>
    )
  }

  // For 'up' direction: content fades in with top padding
  const useTransition = isScrolled && progress === 1

  return (
    <div
      className={`${useTransition ? 'transition-all duration-700 ease-out' : ''} ${className}`}
      style={{
        opacity: progress,
        paddingTop: `${progress * 192}px`,
      }}
    >
      {children}
    </div>
  )
}

// Collapsible hero wrapper
export function CollapsibleHero({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const { isScrolled, progress } = useScrollState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use CSS calc for height to avoid hydration mismatch
  const useTransition = isScrolled && progress === 1

  // Before mount, use CSS-based height; after mount, use calculated height
  if (!mounted) {
    return (
      <div
        className={`overflow-hidden flex items-center ${className}`}
        style={{
          height: 'calc(100vh - 80px)',
        }}
      >
        {children}
      </div>
    )
  }

  const maxHeight = window.innerHeight - 80
  const currentHeight = maxHeight * (1 - progress)

  return (
    <div
      className={`overflow-hidden flex items-center ${useTransition ? 'transition-all duration-700 ease-out' : ''} ${className}`}
      style={{
        height: progress >= 1 ? '0px' : `${currentHeight}px`,
      }}
    >
      {children}
    </div>
  )
}

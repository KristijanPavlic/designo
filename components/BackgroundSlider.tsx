'use client'

import { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'

// Define the new slide type with both desktop and mobile images.
export interface BackgroundSlide {
  desktop: StaticImageData
  mobile?: StaticImageData
  alt: string
}

interface BackgroundSliderProps {
  slides: BackgroundSlide[]
  /** Breakpoint below which the mobile version is used */
  mobileBreakpoint?: number
}

export default function BackgroundSlider({
  slides,
  mobileBreakpoint = 768,
}: BackgroundSliderProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [animateNext, setAnimateNext] = useState(false)
  const [firstImageLoaded, setFirstImageLoaded] = useState(false) // spinner state
  const [isMobile, setIsMobile] = useState(false)

  // Set mounted flag and initial mobile state on first render.
  useEffect(() => {
    setHasMounted(true)
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
  }, [mobileBreakpoint])

  // Listen for window resize events to update the mobile state.
  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileBreakpoint])

  // --- Slider Transition Logic ---
  const triggerTransition = useCallback(() => {
    if (slides.length < 2) return
    const upcomingIndex = (currentIndex + 1) % slides.length
    setNextIndex(upcomingIndex)
  }, [currentIndex, slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const interval = setInterval(() => {
      if (nextIndex === null) {
        triggerTransition()
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [slides.length, triggerTransition, nextIndex])

  useEffect(() => {
    if (nextIndex !== null) {
      const startTimer = setTimeout(() => {
        setAnimateNext(true)
      }, 100)
      const finishTimer = setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex(null)
        setAnimateNext(false)
      }, 1050)
      return () => {
        clearTimeout(startTimer)
        clearTimeout(finishTimer)
      }
    }
  }, [nextIndex])

  if (!hasMounted || slides.length === 0) {
    return null
  }

  // Helper function that returns the correct image src based on the viewport.
  const getSlideSrc = (slide: BackgroundSlide) => {
    if (isMobile && slide.mobile) {
      return slide.mobile.src
    }
    return slide.desktop.src
  }

  return (
    <div className="absolute inset-0 top-[-5rem] max-h-svh min-h-full overflow-x-hidden lg:top-[-5.5rem]">
      {/* Current image */}
      <div className="absolute inset-0">
        <Image
          src={getSlideSrc(slides[currentIndex]) || '/placeholder.svg'}
          alt={slides[currentIndex].alt}
          fill
          style={{ objectFit: 'cover', filter: 'brightness(85%)' }}
          priority
          onLoadingComplete={() => {
            if (currentIndex === 0) {
              setFirstImageLoaded(true)
            }
          }}
        />
      </div>

      {/* Spinner overlay for the first image */}
      {currentIndex === 0 && !firstImageLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-white"></div>
        </div>
      )}

      {/* Next image slides in from the right */}
      {nextIndex !== null && (
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            animateNext ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Image
            src={getSlideSrc(slides[nextIndex]) || '/placeholder.svg'}
            alt={slides[nextIndex].alt}
            fill
            style={{ objectFit: 'cover', filter: 'brightness(85%)' }}
            priority
          />
        </div>
      )}
    </div>
  )
}

'use client'

import { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { BackgroundImage } from '@/types/images'

interface BackgroundSliderProps {
  images: BackgroundImage[]
  /** Breakpoint below which the mobile version is used */
  mobileBreakpoint?: number
}

export default function BackgroundSlider({
  images,
  mobileBreakpoint = 768,
}: BackgroundSliderProps) {
  // Always call hooks in the same order.
  const [hasMounted, setHasMounted] = useState(false)
  const [sliderImages, setSliderImages] = useState<BackgroundImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [animateNext, setAnimateNext] = useState(false)

  // Set mounted flag after first render.
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Returns images in the correct order.
  // On mobile, this returns [weddingsMobile, familyDesktopMobile, christeningDesktopMobile, birthdaysMobile].
  // On desktop, it returns [weddingsDesktop, familyDesktopMobile, christeningDesktopMobile, birthdaysDesktop].
  const getOrderedImages = useCallback((): BackgroundImage[] => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < mobileBreakpoint
      if (isMobile) {
        return [images[1], images[2], images[3], images[5]].filter(Boolean)
      } else {
        return [images[0], images[2], images[3], images[4]].filter(Boolean)
      }
    }
    // Fallback for SSR (desktop order)
    return [images[0], images[2], images[3], images[4]].filter(Boolean)
  }, [images, mobileBreakpoint])

  // Update slider images once mounted.
  useEffect(() => {
    if (hasMounted) {
      const ordered = getOrderedImages()
      setSliderImages(ordered)
      setCurrentIndex(0)
    }
  }, [hasMounted, getOrderedImages])

  // Handle window resize to recalc ordering.
  useLayoutEffect(() => {
    const updateOnResize = () => {
      const newImages = getOrderedImages()
      const currentImage = sliderImages[currentIndex]
      let newIndex = 0
      if (currentImage) {
        const idx = newImages.findIndex((img) => img.src === currentImage.src)
        if (idx !== -1) newIndex = idx
      }
      setSliderImages(newImages)
      setCurrentIndex(newIndex)
      setNextIndex(null)
    }
    window.addEventListener('resize', updateOnResize)
    return () => window.removeEventListener('resize', updateOnResize)
  }, [getOrderedImages, sliderImages, currentIndex])

  // --- Slider Transition Logic ---
  const triggerTransition = useCallback(() => {
    if (sliderImages.length < 2) return
    const upcomingIndex = (currentIndex + 1) % sliderImages.length
    setNextIndex(upcomingIndex)
  }, [currentIndex, sliderImages])

  useEffect(() => {
    if (sliderImages.length < 2) return
    const interval = setInterval(() => {
      if (nextIndex === null) {
        triggerTransition()
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [sliderImages, triggerTransition, nextIndex])

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

  // Until we've mounted and set the slider images, render nothing.
  if (!hasMounted || sliderImages.length === 0) {
    return null
  }

  return (
    <div className="absolute inset-0 top-[-5rem] max-h-svh min-h-full overflow-x-hidden lg:top-[-5.5rem]">
      {/* Current image */}
      <div className="absolute inset-0">
        <Image
          src={sliderImages[currentIndex].src || '/placeholder.svg'}
          alt={sliderImages[currentIndex].alt}
          fill
          style={{ objectFit: 'cover', filter: 'brightness(85%)' }}
          priority
        />
      </div>

      {/* Next image slides in from the right */}
      {nextIndex !== null && (
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            animateNext ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Image
            src={sliderImages[nextIndex].src || '/placeholder.svg'}
            alt={sliderImages[nextIndex].alt}
            fill
            style={{ objectFit: 'cover', filter: 'brightness(85%)' }}
            priority
          />
        </div>
      )}
    </div>
  )
}

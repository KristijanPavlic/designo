'use client'

import { useLayoutEffect, useState, useCallback, useEffect, useRef } from 'react'
import Image, { StaticImageData } from 'next/image'

// Define the new slide type with both desktop and mobile images.
export interface BackgroundSlide {
  desktop: StaticImageData | string
  mobile?: StaticImageData | string
  alt: string
}

interface BackgroundSliderProps {
  slides: BackgroundSlide[]
  /** Breakpoint below which the mobile version is used */
  mobileBreakpoint?: number
  /** Optional callback fired when the first background image is loaded */
  onLoad?: () => void
  /** Transition duration between slides in ms */
  transitionDuration?: number
}

export default function BackgroundSlider({
  slides,
  mobileBreakpoint = 768,
  onLoad,
  transitionDuration = 800, // Reduced from 1200ms for faster feel
}: BackgroundSliderProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [shuffledSlides, setShuffledSlides] = useState<BackgroundSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [animateNext, setAnimateNext] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [shownIndices, setShownIndices] = useState<Set<number>>(new Set([0])) // Track shown slides, start with first
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set()) // Track loaded images
  const [currentImageLoadTime, setCurrentImageLoadTime] = useState<number | null>(null) // Track when current image loaded
  
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Shuffle array function
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // Shuffle slides when they change and set random starting index
  useEffect(() => {
    if (slides.length === 0) {
      setShuffledSlides([])
      return
    }

    const newShuffledSlides = shuffleArray(slides)
    setShuffledSlides(newShuffledSlides)
    
    // Set random starting index
    const randomStartIndex = Math.floor(Math.random() * newShuffledSlides.length)
    setCurrentIndex(randomStartIndex)
    
    // Reset other states
    setNextIndex(null)
    setAnimateNext(false)
    setImageErrors(new Set())
  }, [slides, shuffleArray])

  // Set mounted flag and initial mobile state on first render.
  useEffect(() => {
    setHasMounted(true)
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
  }, [mobileBreakpoint])

  // Simplified preloading - just preload the next image
  const preloadNextImage = useCallback(() => {
    if (shuffledSlides.length < 2) return
    
    const nextIndex = (currentIndex + 1) % shuffledSlides.length
    const slide = shuffledSlides[nextIndex]
    if (!slide) return
    
    const img = new window.Image()
    const src = isMobile && slide.mobile 
      ? (typeof slide.mobile === 'string' ? slide.mobile : slide.mobile.src)
      : (typeof slide.desktop === 'string' ? slide.desktop : slide.desktop.src)
    
    img.src = src // Just preload, don't track state to avoid loops
  }, [currentIndex, shuffledSlides, isMobile])
  
  // Preload next image when current index changes
  useEffect(() => {
    const timeoutId = setTimeout(preloadNextImage, 500)
    return () => clearTimeout(timeoutId)
  }, [currentIndex, preloadNextImage])

  // Listen for window resize events to update the mobile state.
  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileBreakpoint])

  // --- Slider Transition Logic with No-Repeat Guarantee ---
  const triggerTransition = useCallback(() => {
    if (shuffledSlides.length < 2) return
    
    // Clear any existing interval when starting transition
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    let upcomingIndex: number
    
    // If we've shown all images, reset and start over
    if (shownIndices.size >= shuffledSlides.length) {
      setShownIndices(new Set([currentIndex])) // Reset with current image
      upcomingIndex = (currentIndex + 1) % shuffledSlides.length
    } else {
      // Find next unshown image
      upcomingIndex = (currentIndex + 1) % shuffledSlides.length
      
      // Keep looking for an unshown image
      while (shownIndices.has(upcomingIndex) && shownIndices.size < shuffledSlides.length) {
        upcomingIndex = (upcomingIndex + 1) % shuffledSlides.length
      }
    }
    
    setNextIndex(upcomingIndex)
  }, [currentIndex, shuffledSlides.length, shownIndices])

  // Auto-advance slides - start timer only after image is loaded and transition complete
  useEffect(() => {
    if (shuffledSlides.length < 2) return
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Only start timer if current image is loaded and we're not in transition
    if (loadedImages.has(currentIndex) && nextIndex === null) {
      // Start timer immediately if image was already loaded, or when image loads
      const startTime = currentImageLoadTime || Date.now()
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(3000 - elapsed, 0) // Ensure at least 3 seconds from load time
      
      intervalRef.current = setTimeout(() => {
        triggerTransition()
      }, remainingTime)
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [shuffledSlides.length, triggerTransition, nextIndex, loadedImages, currentIndex, currentImageLoadTime])

  // Handle transition animation
  useEffect(() => {
    if (nextIndex !== null) {
      const startTimer = setTimeout(() => {
        setAnimateNext(true)
      }, 100)
      
      const finishTimer = setTimeout(() => {
        setCurrentIndex(nextIndex)
        setShownIndices(prev => new Set(prev).add(nextIndex)) // Track the newly shown image
        
        // Reset current image load time - will be set when image loads
        setCurrentImageLoadTime(null)
        
        setNextIndex(null)
        setAnimateNext(false)
      }, transitionDuration)
      
      transitionTimeoutRef.current = finishTimer
      
      return () => {
        clearTimeout(startTimer)
        clearTimeout(finishTimer)
      }
    }
  }, [nextIndex, transitionDuration])

  // Handle image loading and errors
  const handleImageLoad = useCallback((index: number) => {
    const loadTime = Date.now()
    
    setLoadedImages(prev => new Set(prev).add(index))
    
    // If this is the current image, record when it loaded
    if (index === currentIndex) {
      setCurrentImageLoadTime(loadTime)
    }
    
    // Call onLoad immediately for static images - don't wait for loading
    if (index === 0 && onLoad) {
      onLoad() 
    }
  }, [onLoad, currentIndex])

  // Reset shown indices when slides change (new dynamic images added)
  useEffect(() => {
    setShownIndices(new Set([currentIndex])) // Reset tracking when slides change
    setLoadedImages(new Set()) // Reset loaded images tracking
    setCurrentImageLoadTime(null) // Reset load time
  }, [shuffledSlides.length, currentIndex])

  // Call onLoad immediately on mount for static slides - no waiting
  useEffect(() => {
    if (onLoad && shuffledSlides.length > 0) {
      onLoad()
    }
  }, [onLoad, shuffledSlides.length])
  
  const handleImageError = useCallback((index: number) => {
    console.warn(`Failed to load slide image at index ${index}`)
    setImageErrors(prev => new Set(prev).add(index))
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  if (!hasMounted || shuffledSlides.length === 0) {
    return null
  }

  // Helper function that returns the correct image src based on the viewport.
  const getSlideSrc = (slide: BackgroundSlide) => {
    if (isMobile && slide.mobile) {
      return typeof slide.mobile === 'string' ? slide.mobile : slide.mobile.src
    }
    return typeof slide.desktop === 'string' ? slide.desktop : slide.desktop.src
  }

  return (
    <div className="absolute inset-0 top-[-4rem] max-h-svh min-h-full overflow-x-hidden select-none">
      {/* Current image */}
      <div className="absolute inset-0">
        <Image
          src={getSlideSrc(shuffledSlides[currentIndex]) || '/placeholder.svg'}
          alt={shuffledSlides[currentIndex].alt}
          fill
          style={{ 
            objectFit: 'cover', 
            filter: 'brightness(85%)',
            transition: 'opacity 0.3s ease-in-out'
          }}
          priority
          quality={85} // Slightly lower quality for better performance
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => handleImageError(currentIndex)}
          sizes="100vw"
        />
      </div>

      {/* Next image slides in from the right */}
      {nextIndex !== null && (
        <div
          className={`absolute inset-0 transition-transform ease-in-out ${
            animateNext ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            '--transition-duration': `${transitionDuration}ms`,
            transitionDuration: 'var(--transition-duration)'
          } as React.CSSProperties}
        >
          <Image
            src={getSlideSrc(shuffledSlides[nextIndex]) || '/placeholder.svg'}
            alt={shuffledSlides[nextIndex].alt}
            fill
            style={{ 
              objectFit: 'cover', 
              filter: 'brightness(85%)',
              transition: 'opacity 0.3s ease-in-out'
            }}
            priority
            quality={85}
            onLoad={() => handleImageLoad(nextIndex)}
            onError={() => handleImageError(nextIndex)}
            sizes="100vw"
          />
        </div>
      )}
      
      {/* Optional: Show slide counter for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
          {currentIndex + 1} / {shuffledSlides.length}
          {imageErrors.size > 0 && (
            <div className="text-red-300 text-[10px] mt-1">
              {imageErrors.size} errors
            </div>
          )}
        </div>
      )}
    </div>
  )
}

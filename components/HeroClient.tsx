'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Frank_Ruhl_Libre } from 'next/font/google'
import { Navigation } from './Navigation'
import ScrollBtn from '@/components/ScrollBtn'
import BackgroundSlider from './BackgroundSlider'
import { fetchAllCategoryImages, fetchInitialImages } from '@/app/actions/gallery-actions'

// Import images
import weddingsDesktop from '../public/images/slider_desktop_weddings.jpg'
import weddingsMobile from '../public/images/slider_mobile_weddings.jpg'
import christeningDesktopMobile from '../public/images/slider_desktop_mobile_christening.jpg'
import newbornDesktop from '../public/images/slider_desktop_newborn.jpg'
import newbornMobile from '../public/images/slider_mobile_newborn.jpg'
import birthdaysDesktop from '../public/images/slider_desktop_birthdays.jpg'
import birthdaysMobile from '../public/images/slider_mobile_birthdays.jpg'
import { StaticImageData } from 'next/image'
import { Translations } from '@/types/translations'
import { CloudinaryResource } from '@/types/cloudinary'

// Define a type for each slide
interface BackgroundSlide {
  desktop: StaticImageData | string
  mobile?: StaticImageData | string
  alt: string
}

// Create an array of static slides with both desktop and mobile images (if available)
const staticSlides: BackgroundSlide[] = [
  {
    desktop: weddingsDesktop,
    mobile: weddingsMobile,
    alt: 'Weddings',
  },
  {
    desktop: christeningDesktopMobile,
    // Only one version provided; use the desktop image on both devices.
    alt: 'Christening',
  },
  {
    desktop: newbornDesktop,
    mobile: newbornMobile,
    alt: 'Newborn',
  },
  {
    desktop: birthdaysDesktop,
    mobile: birthdaysMobile,
    alt: 'Birthdays',
  },
]

// Function to create optimized Cloudinary URLs
const optimizeCloudinaryUrl = (url: string, isMobile: boolean): string => {
  if (!url.includes('cloudinary')) return url
  
  // Add aggressive Cloudinary transformations for maximum performance
  const transformations = isMobile 
    ? 'w_600,h_900,c_fill,f_auto,q_auto:low,fl_progressive' // Mobile: smaller, faster load
    : 'w_1600,h_900,c_fill,f_auto,q_auto:low,fl_progressive' // Desktop: lower quality for speed
  
  return url.replace('/upload/', `/upload/${transformations}/`)
}

// Function to create slides from CloudinaryResource with better mixing
const createDynamicSlides = (resources: CloudinaryResource[], isMobile: boolean): BackgroundSlide[] => {
  return resources.map((resource, index) => {
    const optimizedUrl = optimizeCloudinaryUrl(resource.secure_url, isMobile)
    return {
      desktop: optimizedUrl,
      mobile: optimizedUrl,
      alt: `Gallery ${resource.public_id.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'Image'} ${index + 1}`,
    }
  })
}

// Function to mix static and dynamic slides with better distribution
const mixSlides = (staticSlides: BackgroundSlide[], dynamicSlides: BackgroundSlide[]): BackgroundSlide[] => {
  const mixed: BackgroundSlide[] = []
  const maxStatic = staticSlides.length
  const maxDynamic = dynamicSlides.length
  const totalSlides = maxStatic + maxDynamic
  
  // Always start with first static slide for consistency
  mixed.push(staticSlides[0])
  
  let staticIndex = 1
  let dynamicIndex = 0
  
  for (let i = 1; i < totalSlides && mixed.length < 24; i++) { // Limit to 24 total slides
    // Alternate between static and dynamic, but favor dynamic after initial static slides
    if (i % 3 === 0 && staticIndex < maxStatic) {
      mixed.push(staticSlides[staticIndex])
      staticIndex++
    } else if (dynamicIndex < maxDynamic) {
      mixed.push(dynamicSlides[dynamicIndex])
      dynamicIndex++
    } else if (staticIndex < maxStatic) {
      mixed.push(staticSlides[staticIndex])
      staticIndex++
    }
  }
  
  return mixed
}

// Cache for dynamic images to avoid refetching
const imageCache = new Map<string, { horizontal: CloudinaryResource[]; portrait: CloudinaryResource[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const frankRuhlLibre = Frank_Ruhl_Libre({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

interface HeroClientProps {
  translations: Translations
  lang: string
}

export default function HeroClient({ translations, lang }: HeroClientProps) {
  const [heroLoaded, setHeroLoaded] = useState(true) // Start as true - no loading spinner
  const [slides, setSlides] = useState<BackgroundSlide[]>(staticSlides) // Start with static slides
  const [isMobile, setIsMobile] = useState(false)
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false)
  const [dynamicError, setDynamicError] = useState<string | null>(null)
  
  const hasStartedFetch = useRef(false)

  // Fix scroll position on mount
  useEffect(() => {
    // Ensure page starts at the top
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  // Detect mobile breakpoint with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 150)
    }
    
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Fast background loading - load dynamic images completely separately from static ones
  useEffect(() => {
    if (hasStartedFetch.current) return
    hasStartedFetch.current = true

    const loadDynamicImages = async () => {
      // Give plenty of time for static slides to render and be visible first
      await new Promise(resolve => setTimeout(resolve, 3000)) // 3 seconds delay
      
      setIsLoadingDynamic(true)
      
      try {
        // Fetch just 1 image per category for speed
        const result = await fetchInitialImages()
        
        if (result.success) {
          const { horizontal, portrait } = result.data
          const selectedImages = isMobile ? portrait : horizontal
          
          if (selectedImages.length > 0) {
            // Take only first 2 images for immediate addition (very conservative)
            const quickImages = selectedImages.slice(0, 2)
            const dynamicSlides = createDynamicSlides(quickImages, isMobile)
            
            // Add dynamic images to existing static slides without disrupting them
            setSlides(prevSlides => {
              const combined = [...prevSlides, ...dynamicSlides]
              return combined.slice(0, 10) // Keep total slides reasonable
            })
            
            // Load more images much later in background
            setTimeout(() => {
              loadMoreImages()
            }, 5000) // 5 seconds after first dynamic load
          }
        } else {
          setDynamicError(result.error || 'Failed to load gallery images')
        }
      } catch (error) {
        console.error('Failed to fetch dynamic images:', error)
        setDynamicError('Network error loading gallery images')
      } finally {
        setIsLoadingDynamic(false)
      }
    }

    loadDynamicImages()
  }, [isMobile])

  // Background function to load more images very gradually
  const loadMoreImages = async () => {
    try {
      const result = await fetchAllCategoryImages(1) // Only 1 image per category
      
      if (result.success) {
        const { horizontal, portrait } = result.data
        const selectedImages = isMobile ? portrait : horizontal
        
        if (selectedImages.length > 0) {
          // Add only 2-3 more images gradually
          const additionalSlides = createDynamicSlides(selectedImages.slice(0, 3), isMobile)
          setSlides(prevSlides => {
            const combined = [...prevSlides, ...additionalSlides]
            // Keep total slides conservative to maintain performance
            return combined.slice(0, 12)
          })
        }
      }
    } catch (error) {
      console.error('Failed to load additional images:', error)
    }
  }

  return (
    <>
      <Navigation lang={lang} translations={translations} />
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundSlider slides={slides} onLoad={() => setHeroLoaded(true)} />

        {/* Minimal loading overlay - only for initial static images */}
        {!heroLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black select-none">
            <div className="absolute inset-0 animate-pulse bg-gray-700" />
            <div className="z-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white mb-3 mx-auto" />
              <div className="text-white/70 text-sm">
                Loading...
              </div>
              {dynamicError && (
                <div className="text-yellow-200 text-xs mt-2 max-w-xs">
                  {dynamicError}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="relative overflow-hidden pb-28 text-center lg:text-left select-none">
          {heroLoaded && (
            <div className="animate-fadeInUp container mx-auto min-h-[60svh] px-4">
              <h1
                className={`${frankRuhlLibre.className} pb-40 pt-16 text-[2.5rem] text-[var(--white)] [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)] md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}
              >
                {translations.hero.title1} <br /> {translations.hero.title2}
              </h1>

              <ScrollBtn
                text={translations.hero.cta}
                className="group absolute bottom-0 left-0 right-0 mx-auto w-fit cursor-pointer text-center text-[1.5rem] font-light text-[var(--white)] [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)] md:text-[2rem] lg:left-4 lg:right-auto lg:mx-0 lg:w-auto lg:text-left lg:text-[2.5rem] xl:text-[3rem]"
                scrollTo="gallery-section"
                underline={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

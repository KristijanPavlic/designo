'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Translations } from '@/types/translations'

import weddingsImg from 'public/images/slider_mobile_weddings.jpg'
import familyKidsImg from 'public/images/slider_desktop_mobile_family.jpg'
import christeningImg from 'public/images/slider_desktop_mobile_christening.jpg'
import birthdaysImg from 'public/images/slider_mobile_birthdays.jpg'

interface GalleryCategoriesProps {
  translations: Translations
}

type Category = 'weddings' | 'family_kids' | 'christening' | 'birthdays'

interface CategoryData {
  id: Category
  name: string
  images: StaticImageData[]
}

export default function GalleryCategories({
  translations,
}: GalleryCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('weddings')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const categories: CategoryData[] = [
    {
      id: 'weddings',
      name: translations.dashboard.categories.weddings,
      images: [weddingsImg],
    },
    {
      id: 'family_kids',
      name: translations.dashboard.categories.family_kids,
      images: [familyKidsImg],
    },
    {
      id: 'christening',
      name: translations.dashboard.categories.christening,
      images: [christeningImg],
    },
    {
      id: 'birthdays',
      name: translations.dashboard.categories.birthdays,
      images: [birthdaysImg],
    },
  ]

  const categoryOrder = categories.map((cat) => cat.id)

  const getNextCategory = (current: Category): Category => {
    const currentIndex = categoryOrder.indexOf(current)
    const nextIndex = (currentIndex + 1) % categoryOrder.length
    return categoryOrder[nextIndex]
  }

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category)
    setLoadingProgress(0)
    setCurrentImageIndex(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    startLoading()
  }

  const startLoading = useCallback(() => {
    const startTime = Date.now()
    const duration = 4000 // 4 seconds

    const animateLoading = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setLoadingProgress(progress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateLoading)
      } else {
        setActiveCategory((prevCategory) => getNextCategory(prevCategory))
        setLoadingProgress(0)
        startLoading() // Restart the loading animation
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateLoading)
  }, [setActiveCategory]) // Removed getNextCategory from dependency array

  useEffect(() => {
    startLoading()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [startLoading]) // Added startLoading to the dependency array

  const getCurrentCategory = () => {
    return categories.find((cat) => cat.id === activeCategory) || categories[0]
  }

  const currentCategory = getCurrentCategory()
  const currentImage =
    currentCategory.images[currentImageIndex % currentCategory.images.length]

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-8 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
      {/* Categories list */}
      <div className="w-full space-y-12 lg:w-1/3">
        {categories.map((category) => (
          <div key={category.id} className="relative">
            <motion.h2
              className="cursor-pointer text-5xl font-light transition-colors duration-500 ease-in-out sm:text-6xl md:text-[5rem]"
              style={{
                backgroundImage:
                  category.id === activeCategory
                    ? `linear-gradient(to right, #000000 ${loadingProgress * 100}%, #8e8e8e ${loadingProgress * 100}%)`
                    : 'none',
                WebkitBackgroundClip:
                  category.id === activeCategory ? 'text' : 'unset',
                WebkitTextFillColor:
                  category.id === activeCategory ? 'transparent' : '#8e8e8e',
                color: category.id === activeCategory ? '#000000' : '#8e8e8e',
              }}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </motion.h2>
          </div>
        ))}
      </div>

      {/* Image container */}
      <div className="relative h-[50vh] w-full overflow-hidden rounded-lg sm:h-[60vh] md:h-[70vh] lg:h-[80vh] lg:w-3/6">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeCategory}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="absolute h-full w-full"
          >
            <Image
              src={currentImage || '/placeholder.svg'}
              alt={currentCategory.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

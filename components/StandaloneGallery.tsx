'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'weddings' | 'family_kids' | 'christening' | 'birthdays'

interface CategoryData {
  id: Category
  name: string
  images: string[]
}

export default function StandaloneGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('weddings')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Sample images for each category - replace with your actual images
  const categories: CategoryData[] = [
    {
      id: 'weddings',
      name: 'Weddings',
      images: [
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400',
      ],
    },
    {
      id: 'family_kids',
      name: 'Family & kids',
      images: [
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400',
      ],
    },
    {
      id: 'christening',
      name: 'Christening',
      images: [
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400',
      ],
    },
    {
      id: 'birthdays',
      name: 'Birthdays',
      images: [
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400',
      ],
    },
  ]

  // Get the order of categories
  const categoryOrder = categories.map((cat) => cat.id)

  // Function to get the next category in the rotation
  const getNextCategory = (current: Category): Category => {
    const currentIndex = categoryOrder.indexOf(current) 
    const nextIndex = (currentIndex + 1) % categoryOrder.length
    return categoryOrder[nextIndex]
  }

  // Reset loading progress when category changes
  useEffect(() => {
    setLoadingProgress(0)
    setCurrentImageIndex(0)
  }, [activeCategory])

  // Handle category rotation and loading animation
  useEffect(() => {
    const startTime = Date.now()
    const duration = 4000 // 4 seconds

    // Animation function for smooth loading progress
    const animateLoading = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setLoadingProgress(progress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateLoading)
      }
    }

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(animateLoading)

    // Set up interval to change category every 4 seconds
    intervalRef.current = setInterval(() => {
      setActiveCategory(getNextCategory(activeCategory))
    }, duration)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeCategory])

  // Function to get the current category data
  const getCurrentCategory = () => {
    return categories.find((cat) => cat.id === activeCategory) || categories[0]
  }

  // Get current category and image
  const currentCategory = getCurrentCategory()
  const currentImage =
    currentCategory.images[currentImageIndex % currentCategory.images.length]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row">
      {/* Categories list */}
      <div className="w-full space-y-8 md:w-1/3">
        {categories.map((category) => (
          <div key={category.id} className="relative">
            <h2
              className={`font-serif text-5xl transition-colors duration-500 ease-in-out ${
                category.id === activeCategory
                  ? `text-[#000000]`
                  : `text-[#8e8e8e]`
              }`}
              style={{
                color:
                  category.id === activeCategory
                    ? `rgb(${Math.round(142 + (0 - 142) * loadingProgress)}, ${Math.round(142 + (0 - 142) * loadingProgress)}, ${Math.round(142 + (0 - 142) * loadingProgress)})`
                    : '#8e8e8e',
              }}
            >
              {category.name}
            </h2>

            {/* Loading indicator for active category */}
            {category.id === activeCategory && (
              <div className="mt-2 h-1 w-full overflow-hidden bg-[#bbbbbb]">
                <div
                  className="h-full bg-[#000000]"
                  style={{ width: `${loadingProgress * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image container */}
      <div className="relative h-[600px] w-full overflow-hidden rounded-lg md:w-2/3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative h-full w-full"
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

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface GalleryCategory {
  name: string
  image: string
}

interface GalleryProps {
  categories: GalleryCategory[]
}

export function GalleryCategories({ categories }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState(0)
  const [progress, setProgress] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(Date.now())
  const [isPaused, setIsPaused] = useState(false)

  const INITIAL_COLOR = '#8e8e8e'
  const ACTIVE_COLOR = '#000000'

  // Reset animation when category changes
  useEffect(() => {
    setProgress(0)
    lastUpdateTimeRef.current = Date.now()
  }, [activeCategory]) // Added activeCategory to dependencies

  // Handle category rotation and progress animation
  useEffect(() => {
    const updateProgress = () => {
      if (!isPaused) {
        const now = Date.now()
        const deltaTime = now - lastUpdateTimeRef.current
        lastUpdateTimeRef.current = now

        setProgress((prev) => {
          const newProgress = prev + (deltaTime / 4000) * 100

          if (newProgress >= 100) {
            const nextCategory = (activeCategory + 1) % categories.length
            setActiveCategory(nextCategory)
            return 0
          }

          return newProgress
        })
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }

    animationFrameRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [categories, isPaused, activeCategory]) // Added activeCategory to dependencies

  const handleMouseEnter = (index: number) => {
    if (index === activeCategory) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const getTextColor = (index: number) => {
    if (index === activeCategory) {
      return `linear-gradient(to right, ${ACTIVE_COLOR} ${progress}%, ${INITIAL_COLOR} ${progress}%)`
    }
    return INITIAL_COLOR
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:gap-16">
        {/* Categories */}
        <div className="mb-8 lg:mb-0 lg:w-1/3">
          <ul className="space-y-8">
            {categories.map((category, index) => (
              <li
                key={category.name}
                className="cursor-pointer text-5xl font-light transition-colors duration-300 hover:text-black"
                style={{
                  color: INITIAL_COLOR,
                  backgroundImage: getTextColor(index),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setActiveCategory(index)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Images */}
        <div className="relative h-[600px] w-full overflow-hidden lg:w-2/3">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === activeCategory
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
            >
              <Image
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

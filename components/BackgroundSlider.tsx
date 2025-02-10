'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'

interface BackgroundImage {
  src: StaticImageData
  alt: string
}

interface BackgroundSliderProps {
  images: BackgroundImage[]
}

export default function BackgroundSlider({ images }: BackgroundSliderProps) {
  // The index of the image that is currently shown.
  const [currentIndex, setCurrentIndex] = useState(0)
  // When a transition is triggered, nextIndex holds the upcoming image's index.
  // When not transitioning, nextIndex remains null.
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  // Controls the CSS animation: false = off-screen (translate-x-full),
  // true = slid in (translate-x-0)
  const [animateNext, setAnimateNext] = useState(false)

  // Trigger a transition to the next image.
  const triggerTransition = useCallback(() => {
    if (images.length < 2) return

    const upcomingIndex = (currentIndex + 1) % images.length
    setNextIndex(upcomingIndex)
  }, [currentIndex, images])

  // Automatically trigger a transition every 5 seconds.
  useEffect(() => {
    if (images.length < 2) return

    const interval = setInterval(() => {
      // Only trigger a new transition if one isn't already in progress.
      if (nextIndex === null) {
        triggerTransition()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [images, triggerTransition, nextIndex])

  // When nextIndex is set, the new image is mounted.
  // We use a short delay (50ms) to trigger the CSS transition so that
  // the element initially renders off-screen (translate-x-full)
  // and then animates in.
  useEffect(() => {
    if (nextIndex !== null) {
      const startTimer = setTimeout(() => {
        setAnimateNext(true)
      }, 50)

      // Once the slide-in animation (1s) completes, update the current image.
      const finishTimer = setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex(null)
        setAnimateNext(false)
      }, 1050) // 50ms delay + 1000ms animation

      return () => {
        clearTimeout(startTimer)
        clearTimeout(finishTimer)
      }
    }
  }, [nextIndex])

  if (images.length === 0) {
    console.warn('No images provided to BackgroundSlider')
    return null
  }

  return (
    <div className="absolute inset-0 top-[-5rem] max-h-svh min-h-full overflow-x-hidden">
      {/* Current image remains static in the background */}
      <div className="absolute inset-0">
        <Image
          src={images[currentIndex].src || '/placeholder.svg'}
          alt={images[currentIndex].alt}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Next image slides in from the right on top of the current image */}
      {nextIndex !== null && (
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            animateNext ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Image
            src={images[nextIndex].src || '/placeholder.svg'}
            alt={images[nextIndex].alt}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  )
}

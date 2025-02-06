'use client'

import { useCallback } from 'react'

interface ScrollCTAProps {
  text: string
}

export default function ScrollCTA({ text }: ScrollCTAProps) {
  const handleScroll = useCallback(() => {
    const categoriesSection = document.getElementById('categories-section')
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <span
      className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-center text-[1.5rem] font-light text-[var(--white)] underline-offset-4 hover:underline md:text-[2rem] lg:left-auto lg:-translate-x-0 lg:text-left lg:text-[2.5rem] xl:text-[3rem]"
      onClick={handleScroll}
    >
      {text}
    </span>
  )
}

'use client'

import { useCallback } from 'react'

interface ScrollCTAProps {
  text: string
}

export default function ScrollCTA({ text }: ScrollCTAProps) {
  const handleScroll = useCallback(() => {
    const categoriesSection = document.getElementById('gallery-section')
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <span
      onClick={handleScroll}
      className="group absolute bottom-0 left-0 right-0 mx-auto w-fit cursor-pointer text-center text-[1.5rem] font-light text-[var(--white)] md:text-[2rem] lg:left-4 lg:right-auto lg:mx-0 lg:w-auto lg:text-left lg:text-[2.5rem] xl:text-[3rem]"
    >
      {text}
      {/* Underline element */}
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--white)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </span>
  )
}

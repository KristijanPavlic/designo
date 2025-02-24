'use client'

import { useCallback } from 'react'

interface ScrollBtnProps {
  text: string
  scrollTo: string
  className: string
  underline: boolean
  id?: string
  onclick?: () => void
}

export default function ScrollBtn({
  text,
  scrollTo,
  className,
  underline,
  id,
  onclick,
}: ScrollBtnProps) {
  const handleScroll = useCallback(() => {
    if (onclick) {
      onclick()
    }
    const categoriesSection = document.getElementById(scrollTo)
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollTo, onclick])

  return (
    <span onClick={handleScroll} key={id} className={className}>
      {text}
      {/* Underline element */}
      {underline && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--white)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
      )}
    </span>
  )
}

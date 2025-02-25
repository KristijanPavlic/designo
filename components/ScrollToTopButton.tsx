'use client'

import React, { useEffect, useState } from 'react'

import arrowTop from '@/public/images/arrow_top.svg'
import Image from 'next/image'

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false)

  // Toggle button visibility based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 450) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  // Scroll smoothly to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-10 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gray)] text-[var(--white)] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[var(--black)] lg:right-10 lg:h-12 lg:w-12 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Image src={arrowTop} alt="Arrow top" className="h-6 w-6" />
    </button>
  )
}

export default ScrollToTopButton

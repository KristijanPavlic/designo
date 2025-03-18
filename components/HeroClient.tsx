'use client'

import { useState } from 'react'
import { Frank_Ruhl_Libre } from 'next/font/google'
import { Navigation } from './Navigation'
import ScrollBtn from '@/components/ScrollBtn'
import BackgroundSlider from './BackgroundSlider'

// Import images
import weddingsDesktop from '../public/images/slider_desktop_weddings.jpg'
import weddingsMobile from '../public/images/slider_mobile_weddings.jpg'
import christeningDesktopMobile from '../public/images/slider_desktop_mobile_christening.jpg'
import newbornDesktop from '../public/images/slider_desktop_newborn.jpg'
import newbornMobile from '../public/images/slider_mobile_newborn.jpg'
import birthdaysDesktop from '../public/images/slider_desktop_birthdays.jpg'
import birthdaysMobile from '../public/images/slider_mobile_birthdays.jpg'
import { StaticImageData } from 'next/image'

// Define a type for each slide
interface BackgroundSlide {
  desktop: StaticImageData
  mobile?: StaticImageData
  alt: string
}

// Create an array of slides with both desktop and mobile images (if available)
const slides: BackgroundSlide[] = [
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
  translations: any // adjust type as needed
  lang: string
}

export default function HeroClient({ translations, lang }: HeroClientProps) {
  const [heroLoaded, setHeroLoaded] = useState(false)

  return (
    <>
      <Navigation lang={lang} translations={translations} />
      <div className="relative min-h-svh">
        <BackgroundSlider slides={slides} onLoad={() => setHeroLoaded(true)} />

        {/* Skeleton loading overlay until background images are loaded */}
        {!heroLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            {/* Pulsing skeleton background */}
            <div className="absolute inset-0 animate-pulse bg-gray-700" />
            {/* Centered spinner */}
            <div className="z-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
            </div>
          </div>
        )}

        <div className="relative overflow-hidden pb-28 text-center lg:text-left">
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

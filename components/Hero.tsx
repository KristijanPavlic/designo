import { Translations } from '@/types/translations'
import { getTranslations } from '@/lib/getTranslations'
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

export default async function Hero({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  return (
    <>
      <Navigation lang={lang} translations={translations} />
      <div className="relative min-h-svh">
        <BackgroundSlider slides={slides} />
        <div className="relative overflow-hidden pb-28 text-center lg:text-left">
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
        </div>
      </div>
    </>
  )
}

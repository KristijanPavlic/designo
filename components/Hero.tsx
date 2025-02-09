import { getTranslations } from '@/lib/getTranslations'
import { Frank_Ruhl_Libre } from 'next/font/google'
import { Translations } from '@/types/translations'
import ScrollCta from '@/components/ScrollCta'
import { Navigation } from './Navigation'
import BackgroundSlider from './BackgroundSlider'

import type { BackgroundImage } from '@/types/images'

import image1 from '../public/images/image.jpg'
import image2 from '../public/images/image2.jpg'
import image3 from '../public/images/image3.jpg'
import image4 from '../public/images/image4.jpg'

const backgroundImages: BackgroundImage[] = [
  {
    src: image1,
    alt: 'Background 1',
  },
  {
    src: image2,
    alt: 'Background 2',
  },
  {
    src: image3,
    alt: 'Background 3',
  },
  {
    src: image4,
    alt: 'Background 4',
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
    <div className="relative min-h-svh">
      <Navigation lang={lang} translations={translations} />
      <BackgroundSlider images={backgroundImages} />
      <div className="relative overflow-hidden pb-10 text-center lg:text-left">
        <div className="animate-fadeInUp container mx-auto min-h-[60svh] px-4">
          <h1
            className={`${frankRuhlLibre.className} pb-40 pt-20 text-[2.5rem] text-[var(--white)] md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}
          >
            {translations.hero.title1} <br /> {translations.hero.title2}
          </h1>
          <ScrollCta text={translations.hero.cta} />
        </div>
      </div>
    </div>
  )
}

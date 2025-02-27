import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../types/translations'
import { Frank_Ruhl_Libre } from 'next/font/google'
import BackgroundLines from './ui/BackgroundLines'
import { GalleryCategories } from './GalleryCategories'

import weddingsImg from 'public/images/slider_mobile_weddings.jpg'
import familyKidsImg from 'public/images/slider_desktop_mobile_family.jpg'
import christeningImg from 'public/images/slider_desktop_mobile_christening.jpg'
import birthdaysImg from 'public/images/slider_mobile_birthdays.jpg'

const frankRuhlLibre = Frank_Ruhl_Libre({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export default async function Gallery({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  const categories = [
    {
      name: 'Weddings',
      image: weddingsImg,
    },
    {
      name: 'Family & kids',
      image: familyKidsImg,
    },
    {
      name: 'Christening',
      image: christeningImg,
    },
    {
      name: 'Birthdays',
      image: birthdaysImg,
    },
  ]

  return (
    <section
      id="gallery-section"
      className={`${frankRuhlLibre.className} container relative mx-auto pt-20 -mt-20 scroll-m-24 px-4`}
    >
      <BackgroundLines />
      <GalleryCategories
        categories={categories}
        translations={translations.categories}
      />
    </section>
  )
}

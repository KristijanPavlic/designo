import { getTranslations } from '@/lib/getTranslations'
/* import type { Translations } from '../types/translations' */
import { Frank_Ruhl_Libre } from 'next/font/google'
import BackgroundLines from './ui/BackgroundLines'
import { GalleryCategories } from './GalleryCategories'

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
  /* const translations: Translations =  */ await getTranslations(lang)

  const categories = [
    {
      name: 'Weddings',
      image: '/placeholder.svg?height=600&width=800',
    },
    {
      name: 'Family & kids',
      image: '/placeholder.svg?height=600&width=800',
    },
    {
      name: 'Christening',
      image: '/placeholder.svg?height=600&width=800',
    },
    {
      name: 'Birthdays',
      image: '/placeholder.svg?height=600&width=800',
    },
  ]

  return (
    <section
      id="gallery-section"
      className={`${frankRuhlLibre.className} container relative mx-auto -mt-20 scroll-m-24 px-4`}
    >
      <BackgroundLines />
      <GalleryCategories categories={categories} />
    </section>
  )
}

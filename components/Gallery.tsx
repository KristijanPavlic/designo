import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../types/translations'
import { Frank_Ruhl_Libre } from 'next/font/google'
import BackgroundLines from './ui/BackgroundLines'

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

  return (
    <section
      id="gallery-section"
      className={`${frankRuhlLibre.className} container relative mx-auto -mt-20 h-[1000px] scroll-m-24 px-4`}
    >
      <BackgroundLines />
      <h1>{translations.categories.weddings}</h1>
    </section>
  )
}

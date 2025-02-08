import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../types/translations'
import { Frank_Ruhl_Libre } from 'next/font/google'

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
      className={`${frankRuhlLibre.className} flex min-h-screen border-2 border-red-600 px-4 pb-16`}
    >
      <h1>{translations.categories.weddings}</h1>
    </section>
  )
}

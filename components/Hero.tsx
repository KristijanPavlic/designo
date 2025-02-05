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

export default async function Hero({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)
  return (
    <div className="container mx-auto flex min-h-[60svh] flex-col justify-between px-4">
      <h1
        className={`${frankRuhlLibre.className} text-center text-[2.5rem] text-[var(--white)] md:text-[4rem] lg:text-left lg:text-[5rem] xl:max-w-[900px] xl:text-[6rem]`}
      >
        {translations.hero.title}
      </h1>
      <p className="text-center text-2xl font-light text-[var(--white)] lg:text-left">
        {translations.hero.cta}
      </p>
    </div>
  )
}

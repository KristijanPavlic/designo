import { getTranslations } from '@/lib/getTranslations'

import { Frank_Ruhl_Libre } from 'next/font/google'
import { Translations } from '@/types/translations'

import ScrollCta from '@/components/ScrollCta'

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
    <div className="container relative mx-auto min-h-[70svh] px-4 text-center lg:text-left">
      <h1
        className={`${frankRuhlLibre.className} mt-20 text-[2.5rem] text-[var(--white)] md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}
      >
        {translations.hero.title1} <br /> {translations.hero.title2}
      </h1>
      <ScrollCta text={translations.hero.cta} />
    </div>
  )
}

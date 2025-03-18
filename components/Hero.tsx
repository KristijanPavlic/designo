// Hero.tsx (Server Component)
import { Translations } from '@/types/translations'
import { getTranslations } from '@/lib/getTranslations'
import HeroClient from './HeroClient'

export default async function Hero({ params }: { params: { lang: string } }) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  return <HeroClient translations={translations} lang={lang} />
}

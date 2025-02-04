import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../../types/translations'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  return (
    <main>
      <h1>{translations.hero.title}</h1>
      <p>{translations.hero.cta}</p>
    </main>
  )
}

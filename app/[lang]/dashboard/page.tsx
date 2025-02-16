import { Translations } from '@/types/translations'
import { getTranslations } from '@/lib/getTranslations'

import Link from 'next/link'

import ClientUserInfo from '@/components/ClientUserInfo'

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  return (
    <main className="container mx-auto">
      <h1>{translations.dashboard.title}</h1>
      <ClientUserInfo />
      <Link href="/">Go back</Link>
    </main>
  )
}

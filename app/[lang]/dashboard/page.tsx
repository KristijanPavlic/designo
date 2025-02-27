import type { Translations } from '@/types/translations'
import { getTranslations } from '@/lib/getTranslations'
import ClientUserInfo from '@/components/ClientUserInfo'
import { Navigation } from '@/components/Navigation'
import Footer from '@/components/Footer'
import BackgroundLines from '@/components/ui/BackgroundLines'
import Greeting from '@/components/ui/Greeting'

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navigation lang={lang} translations={translations} />

      {/* Vertical Lines Container */}
      <BackgroundLines />

      <main className="container relative mx-auto min-h-screen px-4 py-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg text-[var(--dark-gray)] md:text-xl xl:text-3xl">
            <Greeting translations={translations.dashboard} />
          </h3>
          <ClientUserInfo />
        </div>
      </main>

      <Footer params={params} />
    </div>
  )
}

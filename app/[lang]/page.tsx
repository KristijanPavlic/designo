import { getTranslations } from '@/lib/getTranslations'

import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  await getTranslations(lang)

  return (
    <main>
      <Hero params={params} />
      <Gallery params={params} />
      <Footer params={params} />
    </main>
  )
}

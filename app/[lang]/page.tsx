import { getTranslations } from '@/lib/getTranslations'

import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { Toaster } from 'sonner'

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
      <About params={params} />
      <Contact params={params} />
      <Footer params={params} />
      <ScrollToTopButton />
      <Toaster theme="light" />
    </main>
  )
}

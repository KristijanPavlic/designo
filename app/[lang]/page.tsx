import { getTranslations } from '@/lib/getTranslations'

import { Navigation } from '@/components/Navigation'
import BackgroundSlider from '@/components/BackgroundSlider'
import type { BackgroundImage } from '@/types/images'

import image1 from '../../public/images/image.jpg'
import image2 from '../../public/images/image2.jpg'
import image3 from '../../public/images/image3.jpg'
import image4 from '../../public/images/image4.jpg'

const backgroundImages: BackgroundImage[] = [
  {
    src: image1,
    alt: 'Background 1',
  },
  {
    src: image2,
    alt: 'Background 2',
  },
  {
    src: image3,
    alt: 'Background 3',
  },
  {
    src: image4,
    alt: 'Background 4',
  },
]

import Hero from '@/components/Hero'

import Categories from '@/components/Categories'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations = await getTranslations(lang)

  return (
    <main>
      <BackgroundSlider images={backgroundImages} />
      <Navigation lang={lang} translations={translations} />
      <Hero params={params} />
      <Categories params={params} />
    </main>
  )
}

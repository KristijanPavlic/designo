import type { Metadata } from 'next'
import { Alexandria } from 'next/font/google'

import './globals.css'

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

export async function generateStaticParams() {
  return [{ lang: 'hr' }, { lang: 'en' }]
}

const alexandria = Alexandria({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'FOTO&VIDEO DESIGNO',
  description: 'FOTO&VIDEO DESIGNO',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params
  const translations = await getTranslations(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body
        className={`${alexandria.className} relative min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <BackgroundSlider images={backgroundImages} />
        <Navigation lang={lang} translations={translations} />
        <div className="relative pt-16 lg:pt-20">{children}</div>
      </body>
    </html>
  )
}

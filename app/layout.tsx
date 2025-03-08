import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Alexandria } from 'next/font/google'
import './[lang]/globals.css'

const alexandria = Alexandria({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export async function generateStaticParams() {
  return [{ lang: 'hr' }, { lang: 'en' }]
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://foto-designo.com'),
  title: {
    default: 'Foto & video DESIGNO',
    template: '%s | Foto & video DESIGNO',
  },
  description:
    'Professional photography and video services for your special moments',
  keywords: [
    'photography',
    'fotografiranje',
    'videography',
    'snimanje videa',
    'weddings',
    'vjenčanja',
    'family',
    'obitelj',
    'kids',
    'djeca',
    'newborn',
    'novorođenčad',
    'christening',
    'krštenje',
    'birthdays',
    'rođendani',
    'events',
    'događaji',
    'cake smash',
    'photo studio',
    'video production',
    'croatia',
    'hrvatska',
    'zagreb',
    'professional photography',
    'profesionalna fotografija',
    'profesionalan video',
  ],
  authors: [{ name: 'KriPa Web' }],
  creator: 'KriPa Web',
  publisher: 'Foto & video DESIGNO',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      hr: '/hr',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'hr_HR',
    title: 'Foto & video DESIGNO',
    description:
      'Professional photography and video services for your special moments',
    siteName: 'Foto & video DESIGNO',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foto & video DESIGNO',
      },
    ],
  },
  /* twitter: {
    card: 'summary_large_image',
    title: 'Foto & video DESIGNO',
    description:
      'Professional photography and video services for your special moments',
    images: ['/twitter-image.jpg'],
    creator: '@yourtwitterhandle',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  }, */
  category: 'photography',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body
        className={`${alexandria.className} relative antialiased`}
        suppressHydrationWarning
      >
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Foto & video DESIGNO',
              image: 'https://foto-designo.com/logo.jpg',
              '@id': 'https://foto-designo.com',
              url: 'https://foto-designo.com',
              telephone: '0989210905',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Savska cesta 15',
                addressLocality: 'Sesvete',
                postalCode: '10360',
                addressCountry: 'HR',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '08:00',
                closes: '20:00',
              },
              sameAs: [
                'https://www.facebook.com/FotoDesigno/',
                'https://www.instagram.com/krumenjak_photography',
              ],
            }),
          }}
        />
        <div>{children}</div>
      </body>
    </html>
  )
}

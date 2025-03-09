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
  title: 'Foto & video DESIGNO',
  description:
    'Foto & video DESIGNO offers photography and videography services in Croatia. Specializing in weddings, christening, cake smash/birthdays, and newborn photography, we capture every special moment with care and creativity',
  icons: [
    {
      url: '/favicon.ico',
      href: '/favicon.ico',
      sizes: '32x32',
      type: 'image/ico',
    },
    {
      url: '/images/apple-touch-icon.png',
      href: '/images/apple-touch-icon.png',
      sizes: '180x180',
      type: 'apple-touch-icon',
    },
    {
      url: '/images/icon-192x192.png',
      href: '/images/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/images/icon-512x512.png',
      href: '/images/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
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
    'designo',
    'foto designo',
    'foto studio designo',
    'foto i video designo',
    'foto i video studio designo',
    'video designo',
    'designo foto studio',
  ],
  authors: [{ name: 'Kristijan Pavlic', url: 'https://kripaweb.com/' }],
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
      'Foto & video DESIGNO offers photography and videography services in Croatia. Specializing in weddings, christening, cake smash/birthdays, and newborn photography, we capture every special moment with care and creativity',
    siteName: 'Foto & video DESIGNO',
    url: 'https://foto-designo.com',
    images: [
      {
        url: '/favicon.ico',
        width: 128,
        height: 128,
        alt: 'DESIGNO Web Icon',
      },
      {
        url: '/images/apple-touch-icon.png',
        width: 180,
        height: 180,
        alt: 'DESIGNO Web Apple Touch Icon',
      },
      {
        url: '/images/icon-192x192.png',
        width: 192,
        height: 192,
        alt: 'DESIGNO Web Android Chrome 192x192',
      },
      {
        url: '/images/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'DESIGNO Web Android Chrome 512x512',
      },
    ],
  },
  category: 'photography',
}

export default async function NotFoundLayout({
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
              image: 'https://foto-designo.com/images/icon-512x512.png',
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

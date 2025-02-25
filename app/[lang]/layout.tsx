import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Alexandria } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

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
    default: 'FOTO&VIDEO DESIGNO',
    template: '%s | FOTO&VIDEO DESIGNO',
  },
  description:
    'Professional photography and video services for your special moments',
  keywords: [
    'photography',
    'videography',
    'photo studio',
    'video production',
    'croatia',
    'professional photography',
  ],
  authors: [{ name: 'KriPa Web' }],
  creator: 'KriPa Web',
  publisher: 'FOTO&VIDEO DESIGNO',
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
    title: 'FOTO&VIDEO DESIGNO',
    description:
      'Professional photography and video services for your special moments',
    siteName: 'FOTO&VIDEO DESIGNO',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FOTO&VIDEO DESIGNO',
      },
    ],
  },
  /* twitter: {
    card: 'summary_large_image',
    title: 'FOTO&VIDEO DESIGNO',
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
    <ClerkProvider>
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
                name: 'FOTO&VIDEO DESIGNO',
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
    </ClerkProvider>
  )
}

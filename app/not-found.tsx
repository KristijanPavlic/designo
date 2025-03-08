'use client'

import { Alexandria } from 'next/font/google'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import '@/app/[lang]/globals.css'
import { useTranslations } from '@/hooks/useTranslations'

const alexandria = Alexandria({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export default function NotFound() {
  const translations = useTranslations('not_found')

  return (
    <html>
      <head>
        <title>{translations.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${alexandria.className} relative antialiased`}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 sm:px-6">
          <div className="max-w-md text-center">
            <div className="mb-8">
              {/* Responsive font size for the error code */}
              <h1 className="text-6xl font-medium leading-none tracking-wide sm:text-7xl md:text-8xl lg:text-9xl">
                404
              </h1>
            </div>

            {/* Responsive heading size */}
            <h2 className="mb-4 text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
              {translations.text1}
            </h2>

            <p className="mb-10 text-lg font-light text-[var(--gray)]">
              {translations.text2}
            </p>

            <div className="flex justify-center">
              <Button
                asChild
                variant="outline"
                className="h-12 border border-gray-200 px-6 shadow-sm transition-colors hover:bg-gray-50"
              >
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{translations.backToHome}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

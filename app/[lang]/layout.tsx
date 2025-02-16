import type { Metadata } from 'next'
import { Alexandria } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'

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

  return (
    <ClerkProvider>
      <html lang={lang} suppressHydrationWarning>
        <head />
        <body
          className={`${alexandria.className} relative antialiased`}
          suppressHydrationWarning
        >
          <div>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  )
}

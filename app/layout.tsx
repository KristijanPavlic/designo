import type { Metadata } from 'next'
import { Alexandria } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'FOTO&VIDEO DESIGNO',
  description: 'FOTO&VIDEO DESIGNO',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${alexandria.className} antialiased`}>{children}</body>
    </html>
  )
}

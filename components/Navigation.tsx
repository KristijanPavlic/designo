'use client'

import * as React from 'react'
import { Frank_Ruhl_Libre } from 'next/font/google'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { Translations } from '@/types/translations'

const frankRuhlLibre = Frank_Ruhl_Libre({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

interface NavigationProps {
  lang: string
  translations: Translations
}

export function Navigation({ lang, translations }: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const routes = [
    { href: `#`, label: translations.navigation.gallery },
    { href: `#`, label: translations.navigation.about },
    { href: `#`, label: translations.navigation.contact },
  ]

  const socialLinks = [
    {
      href: 'https://www.instagram.com/krumenjak_photography',
      label: translations.navigation.instagram,
    },
    {
      href: 'https://www.facebook.com/FotoDesigno/',
      label: translations.navigation.facebook,
    },
  ]

  return (
    <header className="sticky left-0 right-0 top-0 z-50">
      <nav className="bg-black/70 backdrop-blur-md">
        <div className="container mx-auto flex justify-between px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] antialiased transition-colors hover:text-white`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center lg:flex-1 lg:justify-center">
            <Link
              href={`/${lang}`}
              className="text-lg font-medium tracking-[5.7] text-white lg:text-2xl lg:tracking-[7.7]"
            >
              DESIGNO
              <span className="flex text-lg font-extralight tracking-tight lg:text-2xl">
                FOTO & VIDEO
              </span>
            </Link>
          </div>

          {/* Desktop Social Links & Language */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-8">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] antialiased transition-colors hover:text-white`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                const newLang = lang === 'hr' ? 'en' : 'hr'
                window.location.href = window.location.href.replace(
                  `/${lang}`,
                  `/${newLang}`
                )
              }}
              className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] transition-colors hover:text-white`}
            >
              {lang === 'hr' ? 'EN' : 'HR'}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => {
                const newLang = lang === 'hr' ? 'en' : 'hr'
                window.location.href = window.location.href.replace(
                  `/${lang}`,
                  `/${newLang}`
                )
              }}
              className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] transition-colors hover:text-white`}
            >
              {lang === 'hr' ? 'EN' : 'HR'}
            </button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="text-[#bbbbbb] hover:text-white">
                {isOpen ? (
                  <span
                    className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] transition-colors hover:text-white`}
                  >
                    {translations.navigation.close}
                  </span>
                ) : (
                  <span
                    className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] transition-colors hover:text-white`}
                  >
                    {translations.navigation.menu}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent
                side="top"
                className="h-screen w-full border-none bg-black/90 backdrop-blur-md"
              >
                <div className="flex h-full flex-col items-center justify-center gap-8">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] antialiased transition-colors hover:text-white`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex gap-6">
                    {socialLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`${frankRuhlLibre.className} text-xl font-light text-[#bbbbbb] antialiased transition-colors hover:text-white`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

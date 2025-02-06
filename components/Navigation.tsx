'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { Frank_Ruhl_Libre } from 'next/font/google'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
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

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

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
      <nav className="bg-[var(--light-black)] py-3 backdrop-blur-lg">
        <div className="container mx-auto flex justify-between px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-8">
            {routes.map((route, index) => (
              <Link
                key={route.href + index + 'desktop 1'}
                href={route.href}
                className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] antialiased transition-colors hover:text-[var(--white)] lg:text-2xl`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center lg:flex-1 lg:justify-center">
            <Link
              href={`/${lang}`}
              className="text-lg font-medium tracking-[5.7px] text-[var(--white)] lg:text-2xl lg:tracking-[7.7px]"
            >
              DESIGNO
              <span className="flex text-lg font-extralight tracking-tight lg:text-2xl">
                FOTO & VIDEO
              </span>
            </Link>
          </div>

          {/* Desktop Social Links & Language */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-8">
            {socialLinks.map((link, index) => (
              <Link
                key={link.href + index + 'desktop 2'}
                href={link.href}
                className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] antialiased transition-colors hover:text-[var(--white)] lg:text-2xl`}
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
              className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] transition-colors hover:text-[var(--white)] lg:text-2xl`}
            >
              {lang === 'hr' ? 'EN' : 'HR'}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
              <SheetTrigger className="text-[var(--stone-gray)] hover:text-[var(--white)]">
                <span
                  className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] transition-colors hover:text-[var(--white)] lg:text-2xl`}
                >
                  {isOpen
                    ? translations.navigation.close
                    : translations.navigation.menu}
                </span>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="mt-20 border-none bg-[var(--light-black)] backdrop-blur-lg transition-transform duration-300"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {/* Navigation & Social Links */}
                <div className="border-t border-[var(--gray)]"></div>
                <div className="container mx-auto mt-4 flex flex-row flex-wrap justify-evenly px-4 pb-6">
                  {routes.map((route, index) => (
                    <Link
                      key={route.href + index + 'mobile 1'}
                      href={route.href}
                      className={`${frankRuhlLibre.className} py-2 text-xl font-light text-[var(--stone-gray)] transition-colors hover:text-[var(--white)]`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
                <div className="container mx-auto mt-4 flex flex-row flex-wrap justify-evenly px-4 pb-6">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={link.href + index + 'mobile 2'}
                      href={link.href}
                      className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] transition-colors hover:text-[var(--white)]`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <button
              onClick={() => {
                const newLang = lang === 'hr' ? 'en' : 'hr'
                window.location.href = window.location.href.replace(
                  `/${lang}`,
                  `/${newLang}`
                )
              }}
              className={`${frankRuhlLibre.className} text-xl font-light text-[var(--stone-gray)] transition-colors hover:text-[var(--white)] lg:text-2xl`}
            >
              {lang === 'hr' ? 'EN' : 'HR'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

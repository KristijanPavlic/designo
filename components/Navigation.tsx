'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import type { Translations } from '@/types/translations'

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
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#202020] text-white">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-sm font-medium text-[#bbbbbb] transition-colors hover:text-white"
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center lg:flex-1 lg:justify-center">
            <Link
              href={`/${lang}`}
              className="text-xl font-semibold tracking-wider"
            >
              DESIGNO
              <span className="block text-center text-xs tracking-wide text-[#bbbbbb]">
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
                className="text-sm font-medium text-[#bbbbbb] transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSwitcher currentLang={lang} />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  className="px-2 text-[#bbbbbb] hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full bg-[#202020] px-0 py-8"
              >
                <div className="flex flex-col items-center gap-6">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="text-lg font-medium text-[#bbbbbb] transition-colors hover:text-white"
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
                        className="text-sm font-medium text-[#bbbbbb] transition-colors hover:text-white"
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

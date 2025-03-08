'use client'

import { useParams, usePathname } from 'next/navigation'
import en from '@/public/locales/en/common.json'
import hr from '@/public/locales/hr/common.json'

type NotFoundTranslations = {
  title: string
  text1: string
  text2: string
  backToHome: string
}

type Translations = {
  not_found: NotFoundTranslations
  // You can add other namespaces here as needed.
}

const translations: Record<string, Translations> = {
  en,
  hr,
}

export function useTranslations(
  namespace: keyof Translations
): Translations[typeof namespace] {
  const params = useParams() as { lang?: string }
  let currentLang = params.lang
  const pathname = usePathname() // e.g. "/hr/some-page"

  // If lang isn't provided in params, try to parse it from the pathname.
  if (!currentLang) {
    const segments = pathname.split('/')
    // Assuming the language is the first segment (after the leading slash)
    if (segments.length > 1 && translations[segments[1]]) {
      currentLang = segments[1]
    }
  }

  // Default to English if the language is still missing or unsupported.
  if (!currentLang || !translations[currentLang]) {
    currentLang = 'en'
  }

  return translations[currentLang][namespace]
}

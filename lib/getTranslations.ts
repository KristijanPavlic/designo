import { promises as fs } from 'fs'
import path from 'path'
import type { Translations } from '../types/translations'

export async function getTranslations(locale: string): Promise<Translations> {
  if (locale === 'favicon.ico') {
    // Optionally log or handle this case
    return {} as Translations
  }

  // Check if locale is valid
  if (!['hr', 'en'].includes(locale)) {
    console.error(`Invalid locale: ${locale}`)
    // Return default/fallback translations or throw an error
    return {} as Translations
  }

  const filePath = path.join(
    process.cwd(),
    'public',
    'locales',
    locale,
    'common.json'
  )
  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents) as Translations
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error)
  }

  return {} as Translations
}

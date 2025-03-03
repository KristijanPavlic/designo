import { Translations } from '@/types/translations'
import { getTranslations } from '@/lib/getTranslations'
import Link from 'next/link'

export default async function Footer({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--stone-gray)] font-light text-[var(--dark-gray)]">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 text-sm md:flex-row md:text-base">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
          <span className="text-center md:text-start">
            © {currentYear} {translations.footer.text}
          </span>
          <Link
            href={`${lang}/dashboard`}
            className="transition-all duration-300 ease-in-out hover:text-[var(--black)]"
          >
            {translations.footer.dashboard}
          </Link>
        </div>
        <div className="flex items-center justify-center md:justify-start">
          <span>
            {translations.footer.developedby}{' '}
            <Link
              href="https://kripaweb.com/"
              rel="noopener noreferrer"
              target="_blank"
              className="transition-all duration-300 ease-in-out hover:text-[var(--black)]"
            >
              KriPa Web
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

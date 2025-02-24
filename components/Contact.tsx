import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../types/translations'
/* import { Frank_Ruhl_Libre } from 'next/font/google' */
import BackgroundLines from './ui/BackgroundLines'
import Link from 'next/link'

import { ContactForm } from '@/components/ContactForm'

/* const frankRuhlLibre = Frank_Ruhl_Libre({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
}) */

export default async function Contact({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  const socialNetworks = [
    {
      text: 'Instagram',
      url: 'https://www.instagram.com/krumenjak_photography',
    },
    {
      text: 'Facebook',
      url: 'https://www.facebook.com/krumenjak.photography',
    },
  ]

  return (
    <section
      id="gallery-section"
      className={`container relative mx-auto pb-20 scroll-m-20 px-4`}
    >
      <BackgroundLines />
      <div className="flex flex-col items-start justify-between space-y-12 lg:flex-row lg:items-center lg:space-y-0">
        <div className="lg:w-[60.3%]">
          <h1 className="mb-8 text-4xl font-semibold lg:text-5xl">
            {translations.contact.title}{' '}
            <span className="underline decoration-2">
              {translations.contact.company}
            </span>
          </h1>
          <p className="mb-8 text-lg font-light text-[var(--dark-gray)] lg:text-xl">
            {translations.contact.text}
          </p>
          <ContactForm
            translations={translations.contact.form}
            lang={(await params).lang}
          />
        </div>
        <div>
          <div className="space-y-10">
            <div>
              <h4 className="mb-1 text-lg font-light text-[var(--gray)]">
                {translations.contact.form.email}
              </h4>
              <Link
                href="mailto:fotovideo.designo@gmail.com"
                className="text-lg text-[var(--dark-gray)] hover:underline"
              >
                fotovideo.designo@gmail.com
              </Link>
            </div>
            <div>
              <h4 className="mb-1 text-lg font-light text-[var(--gray)]">
                {translations.contact.phone}
              </h4>
              <Link
                href="tel:+385098921905"
                className="text-lg text-[var(--dark-gray)] hover:underline"
              >
                +385 (0) 98 921 0905
              </Link>
            </div>
            <div>
              <h4 className="mb-1 text-lg font-light text-[var(--gray)]">
                {translations.contact.socialNetworks}
              </h4>
              <div className="flex gap-8">
                {socialNetworks.map((network) => (
                  <Link
                    href={network.url}
                    rel="noreferrer"
                    target="_blank"
                    key={network.text}
                    className="text-lg text-[var(--dark-gray)] hover:underline"
                  >
                    {network.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

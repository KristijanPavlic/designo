import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '../types/translations'
/* import { Frank_Ruhl_Libre } from 'next/font/google' */
import BackgroundLines from './ui/BackgroundLines'
import Link from 'next/link'
import Image from 'next/image'
import { CopyToClipboard } from '@/components/CopyToClipboard'
import { ToastProvider } from '@/components/ToastProvider'

import { ContactForm } from '@/components/ContactForm'

import camera from '@/public/images/camera.svg'

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
      url: 'https://www.instagram.com/fotovideodesigno/',
    },
    {
      text: 'Facebook',
      url: 'https://www.facebook.com/FotoDesigno/',
    },
  ]

  return (
    <>
      <ToastProvider />
      <section
        id="contact-section"
        className={`container relative mx-auto scroll-m-24 px-4 pb-20`}
      >
        <BackgroundLines />
        <div className="flex flex-col items-start justify-between space-y-12 lg:flex-row lg:items-center lg:space-y-0">
          <div className="lg:w-[60.3%]">
            <h2 className="mb-8 text-4xl font-semibold lg:text-6xl">
              {translations.contact.title}{' '}
              <span className="underline decoration-2">
                {translations.contact.company}
              </span>
            </h2>
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
                <CopyToClipboard
                  text="fotovideo.designo@gmail.com"
                  translations={translations.contact}
                >
                  <span className="text-lg text-[var(--dark-gray)] hover:underline">
                    fotovideo.designo@gmail.com
                  </span>
                </CopyToClipboard>
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
      <Image
        src={camera || '/placeholder.svg'}
        alt="Camera"
        width={384}
        height={384}
        className="absolute bottom-40 right-0 z-[-999] mx-auto h-72 w-72 lg:h-96 lg:w-96"
      />
    </>
  )
}

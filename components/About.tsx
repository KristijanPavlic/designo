import { getTranslations } from '@/lib/getTranslations'
import type { Translations } from '@/types/translations'
import Image from 'next/image'
import { Star } from 'lucide-react'
import BackgroundLines from './ui/BackgroundLines'
import Link from 'next/link'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const translations: Translations = await getTranslations(lang)

  const stats = [
    {
      number: '500+',
      label: translations.about.info1,
    },
    {
      number: '100+',
      label: translations.about.info2,
    },
    {
      number: '25+',
      label: translations.about.info3,
    },
  ]

  const reviews = [
    {
      name: translations.about.reviews.review1.name,
      image:
        'https://lh3.googleusercontent.com/a-/ALV-UjW9Lp_grvRcyun3DKbSoAGN41LmUr5ZT9jG-TM0579Wbn4h1Qg=w75-h75-p-rp-mo-br100',
      rating: 5,
      text: translations.about.reviews.review1.text,
      link: 'https://maps.app.goo.gl/iNsmRzz26Yz1pJra8',
    },
    {
      name: translations.about.reviews.review2.name,
      image:
        'https://lh3.googleusercontent.com/a-/ALV-UjVcxTb1zWpcD0rF8CCjm30qE-gbGZ93ykNLRKvL8uYkf9Am2ise=w75-h75-p-rp-mo-br100',
      rating: 5,
      text: translations.about.reviews.review2.text,
      link: 'https://maps.app.goo.gl/NzSMBU5dWYhk1CJd6',
    },
    {
      name: translations.about.reviews.review3.name,
      image:
        'https://lh3.googleusercontent.com/a-/ALV-UjVT_CNx19byinTwWo2HFO8JEULKEatgfiV7PZch4sZfSXckysU=w75-h75-p-rp-mo-br100',
      rating: 5,
      text: translations.about.reviews.review3.text,
      link: 'https://maps.app.goo.gl/pPyeoB2uF9pHdRFz9',
    },
  ]

  return (
    <section
      id="about-section"
      className={`container relative mx-auto scroll-m-24 px-4 pb-20 lg:pb-32`}
    >
      <BackgroundLines />
      <div className="grid gap-20 md:grid-cols-2">
        <div className="mt-20 space-y-8">
          {[
            translations.about.text1,
            translations.about.text2,
            translations.about.text3,
          ].map((text, i) => (
            <p
              key={i}
              className="text-xl font-light text-[var(--dark-gray)] lg:text-xl"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Stats on the right */}
        <div className="relative mt-20 lg:mt-32">
          {stats.map((stat, index) => (
            <div
              key={stat.number}
              className="absolute flex h-[140px] w-[140px] items-center justify-center rounded-2xl border-2 border-[var(--dark-gray)] bg-[var(--stone-gray)] text-center shadow-md"
              style={{
                transform: `
                  rotate(45deg)
                  translate(${index === 0 ? '-40%, -50%' : index === 1 ? '70%, -50%' : '70%, 60%'})
                `,
              }}
            >
              <div className="flex -rotate-45 flex-col items-center">
                <span className="text-2xl font-bold text-[var(--black)]">
                  {stat.number}
                </span>
                <span className="mt-1 text-base font-light text-[var(--dark-gray)]">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-40">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="relative rounded-lg bg-[#f5f5f5] p-8 text-center shadow-md"
            >
              <Image
                src={review.image || '/placeholder.svg'}
                alt={review.name}
                width={64}
                height={64}
                className="absolute -top-8 left-1/2 mx-auto mb-4 -translate-x-1/2 transform rounded-full border-8 border-[var(--white)]"
              />
              <h3 className="text-md mb-2 mt-4 font-light">{review.name}</h3>
              <div className="mb-6 flex justify-center space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#fbbc04] text-[#fbbc04]"
                  />
                ))}
              </div>
              <p className="mb-8 text-lg text-[var(--dark-gray)]">
                {review.text}
              </p>
              <Link
                href={review.link}
                target="_blank"
                className="rounded-md bg-[#8e8e8e] px-6 py-2 font-light text-white transition-colors hover:bg-[#757575]"
              >
                {translations.about.reviews.button}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="https://www.google.com/maps/place/Foto%26video+DESIGNO/@45.8158738,16.1166521,818m/data=!3m1!1e3!4m8!3m7!1s0x476679891f59a40f:0xcac1268bc5c04fdb!8m2!3d45.8158701!4d16.119227!9m1!1b1!16s%2Fg%2F11mv5fvrf2!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDIxOS4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
            target="_blank"
            className="text-lg text-[var(--dark-gray)] hover:underline"
          >
            {translations.about.readAllReviews}
          </Link>
        </div>
      </div>
    </section>
  )
}

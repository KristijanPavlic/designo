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
      number: '10 000+',
      label: translations.about.info1,
    },
    {
      number: '400+',
      label: translations.about.info2,
    },
    {
      number: '30+',
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
        'https://lh3.googleusercontent.com/a/ACg8ocI0jJOO-hq1GGwL7h6DJO-7Obf9i808rhk-H85A3OGS8hwibQ=w75-h75-p-rp-mo-br100',
      rating: 5,
      text: translations.about.reviews.review2.text,
      link: 'https://maps.app.goo.gl/66JJiA7Zd1jQB2ra7',
    },
    {
      name: translations.about.reviews.review3.name,
      image:
        'https://lh3.googleusercontent.com/a/ACg8ocIWiASjqZiJyAMLprZJw0_pEZY3Q2kCKjZRS2XrJNhb8LDkNw=w75-h75-p-rp-mo-br100',
      rating: 5,
      text: translations.about.reviews.review3.text,
      link: 'https://maps.app.goo.gl/DxrTjw8ZuRPjYx2c9',
    },
  ]

  return (
    <section
      id="about-section"
      className="container relative mx-auto scroll-m-24 px-4 pb-20 pt-10 lg:pb-32"
    >
      <BackgroundLines />
      <h2 className="pb-6 pt-10 text-center text-2xl font-light lg:hidden">
        {translations.navigation.about}
      </h2>
      <div className="grid items-center gap-20 lg:grid-cols-2">
        {/* Text Column */}
        <div className="space-y-8 text-center md:text-left">
          {[
            translations.about.text1,
            translations.about.text2,
            translations.about.text3,
            translations.about.text4,
            translations.about.text5,
          ].map((text, i) => (
            <p
              key={i}
              className="text-lg font-light text-[var(--dark-gray)] md:text-xl"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Stats Column */}
        <div className="relative lg:mt-32">
          {/* Mobile Stats: show on small screens */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-10 space-x-4 md:flex-row md:gap-12 lg:hidden">
            {stats.map((stat) => (
              <div
                key={stat.number}
                className="sm:h-22 sm:w-22 ml-3 flex h-[7rem] w-[7rem] rotate-45 transform items-center justify-center rounded-2xl border-2 border-[var(--dark-gray)] bg-[var(--stone-gray)] shadow-md"
              >
                <div className="flex -rotate-45 flex-col items-center">
                  <span className="text-center text-base font-bold text-[var(--black)]">
                    {stat.number}
                  </span>
                  <span className="mt-1 text-center text-[8px] text-base font-light text-[var(--dark-gray)]">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Stats: show on large screens */}
          <div className="relative hidden h-[300px] w-full lg:block">
            {stats.map((stat, index) => {
              const desktopTransforms = [
                'rotate(45deg) translate(-40%, -50%)',
                'rotate(45deg) translate(70%, -50%)',
                'rotate(45deg) translate(70%, 60%)',
              ]
              return (
                <div
                  key={stat.number}
                  className="absolute left-[8.5rem] top-0 flex h-[140px] w-[140px] items-center justify-center rounded-2xl border-2 border-[var(--dark-gray)] bg-[var(--stone-gray)] shadow-md"
                  style={{ transform: desktopTransforms[index] }}
                >
                  <div className="flex -rotate-45 flex-col items-center">
                    <span className="text-center text-2xl font-bold text-[var(--black)]">
                      {stat.number}
                    </span>
                    <span className="mt-1 text-center text-base font-light text-[var(--dark-gray)]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20">
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
              <h5 className="text-md mb-2 mt-4 font-light">{review.name}</h5>
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
                className="rounded-md bg-[var(--stone-gray)] px-6 py-2 font-light text-[var(--black)] transition-all duration-300 ease-in-out hover:bg-[var(--dark-gray)] hover:text-[var(--white)]"
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

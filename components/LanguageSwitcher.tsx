'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from './ui/button'

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const newLang = currentLang === 'hr' ? 'en' : 'hr'
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPathname)
  }

  return (
    <Button onClick={toggleLanguage}>
      {currentLang === 'hr' ? 'EN' : 'HR'}
    </Button>
  )
}

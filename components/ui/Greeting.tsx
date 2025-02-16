import React from 'react'
import type { Translations } from '@/types/translations'

type GreetingProps = {
  translations: Translations['dashboard']
}

export default function Greeting({ translations }: GreetingProps) {
  const currentHour = new Date().getHours()
  let greeting = ''

  if (currentHour < 12) {
    greeting = translations.morning
  } else if (currentHour < 18) {
    greeting = translations.afternoon
  } else {
    greeting = translations.evening
  }

  return <>{greeting}</>
}

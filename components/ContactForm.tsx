'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { contactFormSchema, type ContactFormData } from '@/lib/schema'
import { sendEmail } from '@/app/actions'
import { toast } from 'sonner'
import type { Translations } from '@/types/translations'

interface ContactFormProps {
  translations: Translations['contact']['form']
  lang: string
}

export function ContactForm({ translations, lang }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      const result = await sendEmail(formData)
      if (result.error) {
        toast.error(translations.error)
      } else {
        toast.success(translations.success)
        reset()
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error(translations.error)
    } finally {
      setIsSubmitting(false)
    }
  })

  const getErrorMessage = (error: string): string => {
    if (!error) return ''
    return typeof error === 'string' ? error : error[lang as 'en' | 'hr']
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <span className="text-md font-light text-[var(--dark-gray)]">
          {translations.name}
        </span>
        <input
          placeholder={translations.namePlaceholder}
          {...register('name')}
          className="h-12 w-full rounded-md border border-[var(--stone-gray)] px-4 font-normal"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[var(--red)]">
            {getErrorMessage(translations.nameError)}
          </p>
        )}
      </div>
      <div>
        <span className="text-md font-light text-[var(--dark-gray)]">
          {translations.email}
        </span>
        <input
          placeholder={translations.emailPlaceholder}
          type="email"
          {...register('email')}
          className="h-12 w-full rounded-md border border-[var(--stone-gray)] px-4 font-normal"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--red)]">
            {getErrorMessage(translations.emailError)}
          </p>
        )}
      </div>
      <div>
        <span className="text-md font-light text-[var(--dark-gray)]">
          {translations.message}
        </span>
        <textarea
          placeholder={translations.messagePlaceholder}
          {...register('message')}
          className="min-h-[120px] w-full resize-none rounded-md border border-[var(--stone-gray)] p-4 font-normal"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[var(--red)]">
            {getErrorMessage(translations.messageError)}
          </p>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="h-12 w-fit rounded-md bg-[var(--stone-gray)] px-8 text-[var(--black)] transition-all duration-300 ease-in-out hover:bg-[var(--dark-gray)] hover:text-[var(--white)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? translations.sendingButton : translations.sendButton}
        </button>
      </div>
    </form>
  )
}

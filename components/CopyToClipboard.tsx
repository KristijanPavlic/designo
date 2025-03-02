'use client'

import { Translations } from '@/types/translations'
import type React from 'react'

import { useState } from 'react'
import { toast } from 'sonner'

interface CopyToClipboardProps {
  text: string
  children: React.ReactNode
  className?: string
  translations: Translations['contact']
}

export function CopyToClipboard({
  text,
  children,
  className,
  translations,
}: CopyToClipboardProps) {
  const [copying, setCopying] = useState(false)

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (copying) return

    setCopying(true)

    try {
      await navigator.clipboard.writeText(text)
      toast.success(translations.info.emailCopyToClipboard, {
        duration: 3000,
      })
    } catch (error) {
      toast.error(translations.info.emailCopyError)
      console.error('Failed to copy:', error)
    } finally {
      setCopying(false)
    }
  }

  return (
    <span
      onClick={copyToClipboard}
      className={`cursor-pointer ${className || ''}`}
    >
      {children}
    </span>
  )
}

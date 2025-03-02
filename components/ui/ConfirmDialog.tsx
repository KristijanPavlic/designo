'use client'

import type React from 'react'

import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  confirmText: string
  cancelText: string
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div ref={dialogRef} className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-medium">{title}</h3>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRef, type ChangeEvent } from 'react'
import type { Translations } from '@/types/translations'
import { toast } from 'sonner'

interface FileSelectorProps {
  onFileChange: (files: FileList | null) => void
  translations: Translations
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export default function FileSelector({
  onFileChange,
  translations,
}: FileSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} exceeds the 10MB size limit.`)
          return false
        }
        return true
      })

      if (validFiles.length > 0) {
        onFileChange(validFiles as unknown as FileList)
      } else {
        onFileChange(null)
      }
    } else {
      onFileChange(null)
    }
  }

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {translations.dashboard.selectImagesVideos}
      </label>
      <div className="flex items-center overflow-hidden rounded-md border">
        <button
          type="button"
          onClick={handleChooseFilesClick}
          className="border-r bg-white px-4 py-2"
        >
          {translations.dashboard.chooseFiles}
        </button>
        <input
          title="File selector"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

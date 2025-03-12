'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { MediaFile, MediaCategory } from '@/types/media'
import FileSelector from './FileSelector'
import CategorySelector from './CategorySelector'
import MediaPreview from './MediaPreview'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { v4 as uuidv4 } from 'uuid'
import { Translations } from '@/types/translations'

interface MediaUploaderProps {
  translations: Translations
}

export default function MediaUploader({ translations }: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | ''>(
    ''
  )
  const [isUploading, setIsUploading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return

    const newMediaFiles: MediaFile[] = []

    Array.from(files).forEach((file) => {
      // Check if file is an image or video
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return
      }

      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      const preview = URL.createObjectURL(file)

      newMediaFiles.push({
        id: uuidv4(),
        file,
        preview,
        status: 'pending',
        type: fileType,
      })
    })

    setMediaFiles((prev) => [...prev, ...newMediaFiles])
  }, [])

  const handleCategoryChange = useCallback((category: MediaCategory) => {
    setSelectedCategory(category)
  }, [])

  const handleStatusChange = useCallback(
    (id: string, status: 'accepted' | 'rejected') => {
      setMediaFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, status } : file))
      )
    },
    []
  )

  const handleRemoveAll = useCallback(() => {
    setShowConfirmDialog(true)
  }, [])

  const confirmRemoveAll = useCallback(() => {
    // Revoke all object URLs to prevent memory leaks
    mediaFiles.forEach((file) => URL.revokeObjectURL(file.preview))
    setMediaFiles([])
    setShowConfirmDialog(false)
  }, [mediaFiles])

  const uploadToCloudinary = useCallback(async () => {
    if (!selectedCategory) {
      toast.error(translations.dashboard.categoryRequired)
      return
    }

    const acceptedFiles = mediaFiles.filter(
      (file) => file.status === 'accepted'
    )
    if (acceptedFiles.length === 0) {
      return
    }

    setIsUploading(true)

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration missing')
      }

      // Upload each accepted file directly to Cloudinary
      const uploadPromises = acceptedFiles.map(async (mediaFile) => {
        const formData = new FormData()
        formData.append('file', mediaFile.file)
        formData.append('upload_preset', uploadPreset)
        formData.append('folder', selectedCategory)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!response.ok) {
          throw new Error('Upload failed')
        }
        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      toast.success(translations.dashboard.uploadSuccess)
      // Clear accepted files after successful upload
      setMediaFiles((prev) => prev.filter((file) => file.status !== 'accepted'))
      console.log('Upload results:', results)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(translations.dashboard.uploadError)
    } finally {
      setIsUploading(false)
    }
  }, [selectedCategory, mediaFiles, translations])

  return (
    <div className="mt-20 space-y-6">
      <h1 className="text-3xl font-light">
        {translations.dashboard.uploadMedia}
      </h1>

      <FileSelector
        onFileChange={handleFileChange}
        translations={translations}
      />

      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        translations={translations}
      />

      {mediaFiles.length > 0 && (
        <MediaPreview
          mediaFiles={mediaFiles}
          onStatusChange={handleStatusChange}
          onRemoveAll={handleRemoveAll}
          translations={translations}
        />
      )}

      {mediaFiles.filter((file) => file.status === 'accepted').length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={uploadToCloudinary}
            disabled={isUploading}
            className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {isUploading
              ? translations.dashboard.uploading
              : translations.dashboard.uploadToCloudinary}
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRemoveAll}
        title={translations.dashboard.confirmRemoveAll}
        confirmText={translations.dashboard.yes}
        cancelText={translations.dashboard.no}
      />
    </div>
  )
}

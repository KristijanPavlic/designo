'use client'

import { useState } from 'react'
import type { MediaFile, MediaStatus } from '@/types/media'
import MediaGrid from './MediaGrid'
import FullscreenModal from './FullscreenModal'
import { Translations } from '@/types/translations'

interface MediaPreviewProps {
  mediaFiles: MediaFile[]
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
  onRemoveAll: () => void
  translations: Translations
}

export default function MediaPreview({
  mediaFiles,
  onStatusChange,
  onRemoveAll,
  translations,
}: MediaPreviewProps) {
  const [activeTab, setActiveTab] = useState<MediaStatus>('pending')
  const [fullscreenMedia, setFullscreenMedia] = useState<MediaFile | null>(null)
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(0)

  const filteredFiles = mediaFiles.filter((file) => file.status === activeTab)

  const handleFullscreenOpen = (file: MediaFile) => {
    const index = mediaFiles.findIndex((f) => f.id === file.id)
    setFullscreenMedia(file)
    setFullscreenIndex(index)
  }

  const handleFullscreenClose = () => {
    setFullscreenMedia(null)
  }

  const handleNextMedia = () => {
    const currentIndex = fullscreenIndex
    const filteredByStatus = mediaFiles.filter(
      (file) => file.status === activeTab
    )

    if (currentIndex < filteredByStatus.length - 1) {
      const nextFile = filteredByStatus[currentIndex + 1]
      setFullscreenMedia(nextFile)
      setFullscreenIndex(currentIndex + 1)
    }
  }

  const handlePrevMedia = () => {
    const currentIndex = fullscreenIndex

    if (currentIndex > 0) {
      const prevFile = mediaFiles.filter((file) => file.status === activeTab)[
        currentIndex - 1
      ]
      setFullscreenMedia(prevFile)
      setFullscreenIndex(currentIndex - 1)
    }
  }

  const handleFullscreenStatusChange = (
    id: string,
    status: 'accepted' | 'rejected'
  ) => {
    onStatusChange(id, status)

    // Find the next media in the current tab
    const currentTabFiles = mediaFiles.filter(
      (file) => file.status === activeTab
    )
    if (fullscreenIndex < currentTabFiles.length - 1) {
      handleNextMedia()
    } else {
      // If it was the last item, close the modal
      handleFullscreenClose()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {translations.dashboard.mediaPreview}
      </h2>

      <div className="overflow-hidden rounded-lg border">
        <div className="flex">
          <button
            className={`flex-1 py-3 ${activeTab === 'pending' ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            {translations.dashboard.pending}
          </button>
          <button
            className={`flex-1 py-3 ${activeTab === 'accepted' ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('accepted')}
          >
            {translations.dashboard.accepted}
          </button>
          <button
            className={`flex-1 py-3 ${activeTab === 'rejected' ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('rejected')}
          >
            {translations.dashboard.rejected}
          </button>
        </div>

        <div className="p-4">
          <MediaGrid
            mediaFiles={filteredFiles}
            activeTab={activeTab}
            onStatusChange={onStatusChange}
            onFullscreenOpen={handleFullscreenOpen}
          />

          {mediaFiles.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onRemoveAll}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                {translations.dashboard.removeAll}
              </button>
            </div>
          )}
        </div>
      </div>

      {fullscreenMedia && (
        <FullscreenModal
          media={fullscreenMedia}
          onClose={handleFullscreenClose}
          onStatusChange={handleFullscreenStatusChange}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
          hasNext={
            fullscreenIndex <
            mediaFiles.filter((file) => file.status === activeTab).length - 1
          }
          hasPrev={fullscreenIndex > 0}
          activeTab={activeTab}
        />
      )}
    </div>
  )
}

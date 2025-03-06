'use client'

import { useState } from 'react'
import type { MediaFile, MediaStatus } from '@/types/media'
import MediaItem from './MediaItem'
import { Translations } from '@/types/translations'

interface MediaGridProps {
  mediaFiles: MediaFile[]
  activeTab: MediaStatus
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
  onFullscreenOpen: (file: MediaFile) => void
  translations: Translations
}

export default function MediaGrid({
  mediaFiles,
  activeTab,
  onStatusChange,
  onFullscreenOpen,
  translations,
}: MediaGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {mediaFiles.length === 0 ? (
        <div className="col-span-full py-8 text-center text-gray-500">
          {translations.dashboard.noAssets}
        </div>
      ) : (
        mediaFiles.map((file) => (
          <MediaItem
            key={file.id}
            file={file}
            isHovered={hoveredId === file.id}
            onMouseEnter={() => setHoveredId(file.id)}
            onMouseLeave={() => setHoveredId(null)}
            onStatusChange={onStatusChange}
            onFullscreenOpen={() => onFullscreenOpen(file)}
            activeTab={activeTab}
          />
        ))
      )}
    </div>
  )
}

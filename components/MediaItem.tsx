'use client'

import { Check, X, Maximize } from 'lucide-react'
import type { MediaFile, MediaStatus } from '@/types/media'
import Image from 'next/image'

interface MediaItemProps {
  file: MediaFile
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
  onFullscreenOpen: () => void
  activeTab: MediaStatus
}

export default function MediaItem({
  file,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onStatusChange,
  onFullscreenOpen,
  activeTab,
}: MediaItemProps) {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {file.type === 'image' ? (
        <Image
          src={file.preview || '/placeholder.svg'}
          fill
          alt="Preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          src={file.preview}
          className="h-full w-full object-cover"
          controls
        />
      )}

      {isHovered && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          {activeTab === 'pending' && (
            <button
              title="Accept media"
              onClick={() => onStatusChange(file.id, 'accepted')}
              className="rounded-md bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
            >
              <Check size={16} />
            </button>
          )}
          {(activeTab === 'pending' || activeTab === 'accepted') && (
            <button
              title="Reject media"
              onClick={() => onStatusChange(file.id, 'rejected')}
              className="rounded-md bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
            >
              <X size={16} />
            </button>
          )}
          {activeTab === 'rejected' && (
            <button
              title="Accept media"
              onClick={() => onStatusChange(file.id, 'accepted')}
              className="rounded-md bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
            >
              <Check size={16} />
            </button>
          )}
          <button
            title="Open fullscreen"
            onClick={onFullscreenOpen}
            className="rounded-md bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
          >
            <Maximize size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

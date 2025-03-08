'use client'

import type React from 'react'

import { useEffect, useRef } from 'react'
import {
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  DoorClosedIcon as Close,
} from 'lucide-react'
import type { MediaFile, MediaStatus } from '@/types/media'
import Image from 'next/image'

interface FullscreenModalProps {
  media: MediaFile
  onClose: () => void
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
  activeTab: MediaStatus
}

export default function FullscreenModal({
  media,
  onClose,
  onStatusChange,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  activeTab,
}: FullscreenModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext()
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleBackdropClick}
    >
      {/* Updated container: using full height and width */}
      <div ref={modalRef} className="relative h-full w-full overflow-hidden">
        <button
          title="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
        >
          <Close size={20} />
        </button>

        {media.type === 'image' ? (
          <div className="relative h-full w-full">
            <Image
              src={media.preview || '/placeholder.svg'}
              alt="Fullscreen preview"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <video
            src={media.preview}
            className="h-full w-full"
            controls
            autoPlay
          />
        )}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-4">
          {activeTab === 'pending' && (
            <button
              title="Accept media"
              onClick={() => onStatusChange(media.id, 'accepted')}
              className="rounded-md bg-black bg-opacity-70 p-3 text-white hover:bg-opacity-90"
            >
              <Check size={20} />
            </button>
          )}

          {(activeTab === 'pending' || activeTab === 'accepted') && (
            <button
              title="Reject media"
              onClick={() => onStatusChange(media.id, 'rejected')}
              className="rounded-md bg-black bg-opacity-70 p-3 text-white hover:bg-opacity-90"
            >
              <X size={20} />
            </button>
          )}

          {activeTab === 'rejected' && (
            <button
              title="Accept media"
              onClick={() => onStatusChange(media.id, 'accepted')}
              className="rounded-md bg-black bg-opacity-70 p-3 text-white hover:bg-opacity-90"
            >
              <Check size={20} />
            </button>
          )}
        </div>

        {hasPrev && (
          <button
            title="Previous"
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {hasNext && (
          <button
            title="Next"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

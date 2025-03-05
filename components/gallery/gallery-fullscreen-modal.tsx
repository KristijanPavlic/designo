"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import Image from "next/image"
import type { CloudinaryResource } from "@/types/cloudinary"

interface GalleryFullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  resources: CloudinaryResource[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
}

export default function GalleryFullscreenModal({
  isOpen,
  onClose,
  resources,
  currentIndex,
  onNext,
  onPrev,
}: GalleryFullscreenModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const hasNext = currentIndex < resources.length - 1
  const hasPrev = currentIndex > 0
  const currentResource = resources[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext()
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onPrev()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen || !currentResource) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className="relative max-h-[90vh] max-w-4xl overflow-hidden">
        <button
          title="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
        >
          <X size={20} />
        </button>

        {currentResource.resource_type === "video" ? (
          <video src={currentResource.secure_url} className="max-h-[90vh] max-w-full" controls autoPlay />
        ) : (
          <div className="relative h-[90vh] w-[90vw] max-w-4xl">
            <Image
              src={currentResource.secure_url || "/placeholder.svg"}
              alt=""
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        )}

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

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
          {currentIndex + 1} / {resources.length}
        </div>
      </div>
    </div>
  )
}


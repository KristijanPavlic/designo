"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Maximize2, Trash2 } from "lucide-react"
import type { CloudinaryResource } from "@/types/cloudinary"

interface GalleryItemProps {
  resource: CloudinaryResource
  index: number
  isLoggedIn: boolean
  onDelete: (resource: CloudinaryResource) => void
  onView: (index: number) => void
}

export default function GalleryItem({ resource, index, isLoggedIn, onDelete, onView }: GalleryItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(resource)
  }

  const handleView = () => {
    onView(index)
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative aspect-[4/3] w-full cursor-pointer">
        {resource.resource_type === "video" ? (
          <video src={resource.secure_url} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={resource.secure_url || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
            <div className="flex gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 transition-colors hover:bg-white"
                onClick={handleView}
                aria-label="View fullscreen"
              >
                <Maximize2 size={20} />
              </button>

              {isLoggedIn && (
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-red-600 transition-colors hover:bg-white"
                  onClick={handleDelete}
                  aria-label="Delete image"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}


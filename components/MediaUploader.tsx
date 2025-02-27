'use client'

import { useState, useCallback } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, X, Maximize, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Translations } from '@/types/translations'

// Define types for our media items
type MediaItem = {
  id: string
  url: string
  publicId: string
  category: string
  status: 'pending' | 'accepted' | 'rejected'
}

// Define available categories
const CATEGORIES = [
  { id: 'weddings', name: 'Weddings' },
  { id: 'portraits', name: 'Portraits' },
  { id: 'events', name: 'Events' },
  { id: 'family', name: 'Family' },
  { id: 'commercial', name: 'Commercial' },
]

interface MediaUploaderProps {
  translations: Translations['dashboard']
}

export default function MediaUploader({ translations }: MediaUploaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  // Handle successful upload
  const handleUploadSuccess = useCallback(
    (result: {
      info: { asset_id: string; secure_url: string; public_id: string }
    }) => {
      setIsUploading(false)

      if (!selectedCategory) {
        toast.error('Please select a category before uploading')
        return
      }

      if (result.info && typeof result.info === 'object') {
        const newItem: MediaItem = {
          id: result.info.asset_id,
          url: result.info.secure_url,
          publicId: result.info.public_id,
          category: selectedCategory,
          status: 'pending',
        }

        setMediaItems((prev) => [...prev, newItem])
        toast.success('Media uploaded successfully')
      } else {
        toast.error('Invalid upload result')
      }
    },
    [selectedCategory]
  )

  // Handle upload error
  const handleUploadError = useCallback(() => {
    setIsUploading(false)
    toast.error('Upload failed. Please try again.')
  }, [])

  // Handle status change
  const handleStatusChange = useCallback(
    (id: string, newStatus: 'accepted' | 'rejected') => {
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      )

      // Here you would typically call an API to update the status in your database
      // updateMediaStatus(id, newStatus)
    },
    []
  )

  // Handle remove all
  const handleRemoveAll = useCallback(() => {
    setMediaItems([])
    toast.success('All media items removed')
  }, [])

  // Filter media items by status
  const pendingItems = mediaItems.filter((item) => item.status === 'pending')
  const acceptedItems = mediaItems.filter((item) => item.status === 'accepted')
  const rejectedItems = mediaItems.filter((item) => item.status === 'rejected')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-semibold">{translations.upload}</h2>

        <div className="space-y-4">
          <div>
            <p className="mb-2">{translations.select}</p>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                sources: ['local', 'url', 'camera'],
                multiple: true,
                folder: selectedCategory || 'uncategorized',
                clientAllowedFormats: ['image', 'video'],
                maxFileSize: 10000000, // 10MB
              }}
              onUpload={(result) => {
                if (
                  result.event === 'success' &&
                  result.info &&
                  typeof result.info !== 'string'
                ) {
                  handleUploadSuccess({ info: result.info })
                }
              }}
              onError={handleUploadError}
            >
              {({ open }) => (
                <Button
                  onClick={() => {
                    if (!selectedCategory) {
                      toast.error('Please select a category first')
                      return
                    }
                    setIsUploading(true)
                    open()
                  }}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {translations.uploading}
                    </>
                  ) : (
                    translations.button
                  )}
                </Button>
              )}
            </CldUploadWidget>
          </div>

          <div>
            <p className="mb-2">{translations.category}</p>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder={translations.category} />
              </SelectTrigger>
              <SelectContent className="z-50 bg-[var(--white)]">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="transition-all duration-300 ease-in-out hover:bg-[var(--gray)]"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          {translations.preview} ({mediaItems.length})
        </h2>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gray-200"
            >
              {translations.pending}
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="data-[state=active]:bg-gray-200"
            >
              {translations.accepted}
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-gray-200"
            >
              {translations.rejected}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="rounded-md border p-4">
            {pendingItems.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                no images to review
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {pendingItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onExpand={() => setExpandedImage(item.url)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="rounded-md border p-4">
            {acceptedItems.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                no accepted images
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {acceptedItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onExpand={() => setExpandedImage(item.url)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="rounded-md border p-4">
            {rejectedItems.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                no rejected images
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {rejectedItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onExpand={() => setExpandedImage(item.url)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {mediaItems.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={handleRemoveAll}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {translations.button}
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <Image
              src={expandedImage || '/placeholder.svg'}
              alt="Expanded preview"
              width={1200}
              height={800}
              className="max-h-[90vh] object-contain"
            />
            <Button
              variant="secondary"
              className="absolute right-2 top-2 bg-white"
              onClick={() => setExpandedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Media Card Component
function MediaCard({
  item,
  onStatusChange,
  onExpand,
}: {
  item: MediaItem
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
  onExpand: () => void
}) {
  return (
    <div className="group relative overflow-hidden rounded-md border">
      <div className="relative aspect-square">
        <Image
          src={item.url || '/placeholder.svg'}
          alt="Media preview"
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-black bg-opacity-50 p-2">
        {item.status === 'pending' && (
          <>
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700"
              onClick={() => onStatusChange(item.id, 'accepted')}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8 rounded-md bg-red-600 hover:bg-red-700"
              onClick={() => onStatusChange(item.id, 'rejected')}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          size="icon"
          variant="default"
          className="h-8 w-8 rounded-md bg-gray-600 hover:bg-gray-700"
          onClick={onExpand}
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {item.status !== 'pending' && (
        <div className="absolute right-2 top-2">
          {item.status === 'accepted' && (
            <div className="rounded-full bg-green-500 p-1 text-white">
              <Check className="h-4 w-4" />
            </div>
          )}
          {item.status === 'rejected' && (
            <div className="rounded-full bg-red-500 p-1 text-white">
              <X className="h-4 w-4" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

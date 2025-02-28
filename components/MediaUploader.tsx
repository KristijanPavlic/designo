'use client'

import { useState, useCallback, useRef } from 'react'
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
import { v4 as uuidv4 } from 'uuid'

// Updated MediaItem type allows a flag for local (not-yet-uploaded) items.
export type MediaItem = {
  id: string
  url: string
  publicId?: string
  category: string
  status: 'pending' | 'accepted' | 'rejected'
  isLocal?: boolean
}

// Updated SelectedFile type to store the category selected at time of file selection.
type SelectedFile = {
  id: string
  file: File
  preview: string
  category: string
}

// Updated categories list.
const CATEGORIES = [
  { id: 'weddings', name: 'Weddings' },
  { id: 'family&kids', name: 'Family & kids' },
  { id: 'christening', name: 'Christening' },
  { id: 'birthdays', name: 'Birthdays' },
]

interface MediaUploaderProps {
  translations: Translations['dashboard']
}

export default function MediaUploader({ translations }: MediaUploaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // When files are selected via the hidden input, add them to state.
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extra safety: check if a category is selected.
    if (!selectedCategory) {
      toast.error('Please select a category first')
      return
    }
    const files = e.target.files
    if (files) {
      const newSelectedFiles: SelectedFile[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const id = uuidv4()
        const preview = URL.createObjectURL(file)
        // Lock in the current category for this file.
        newSelectedFiles.push({ id, file, preview, category: selectedCategory })
      }
      setSelectedFiles((prev) => [...prev, ...newSelectedFiles])
      // Reset the input value to allow re-selection of the same files if needed.
      e.target.value = ''
    }
  }

  // Helper: convert a file to a base64 string.
  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Upload all selected (local) files to Cloudinary.
  const handleUploadSelected = useCallback(async () => {
    // Check if category is still selected (extra safety)
    if (!selectedCategory) {
      toast.error('Please select a category before uploading')
      return
    }
    if (selectedFiles.length === 0) {
      toast.error('No files selected for upload')
      return
    }
    setIsUploading(true)
    const uploadedItems: MediaItem[] = []

    for (const selected of selectedFiles) {
      try {
        const base64 = await fileToBase64(selected.file)
        // Use the category stored with the file.
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ folder: selected.category, file: base64 }),
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) {
          throw new Error('Upload failed')
        }
        const data = await res.json()
        const newItem: MediaItem = {
          id: data.asset_id,
          url: data.secure_url,
          publicId: data.public_id,
          category: selected.category,
          status: 'pending',
        }
        uploadedItems.push(newItem)
        toast.success('File uploaded successfully')
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload one of the files')
      }
    }
    // Add successfully uploaded items to the media items list.
    setMediaItems((prev) => [...prev, ...uploadedItems])
    // Clear the selected files (they’re now either uploaded or errored).
    setSelectedFiles([])
    setIsUploading(false)
  }, [selectedFiles, selectedCategory])

  // Allow status changes for uploaded media items.
  const handleStatusChange = useCallback(
    async (id: string, newStatus: 'accepted' | 'rejected') => {
      try {
        // Simulate API call here if needed.
        setMediaItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        )
        toast.success(`Media marked as ${newStatus}`)
      } catch {
        toast.error('Failed to update media status.')
      }
    },
    []
  )

  // Remove all files (both pending and uploaded).
  const handleRemoveAll = useCallback(() => {
    setMediaItems([])
    setSelectedFiles([])
    toast.success('All media items removed')
  }, [])

  // Pending items include local (not yet uploaded) files as well as uploaded items with status "pending".
  const pendingItems: MediaItem[] = [
    ...selectedFiles.map((file) => ({
      id: file.id,
      url: file.preview,
      category: file.category,
      status: 'pending' as const,
      isLocal: true,
    })),
    ...mediaItems.filter((item) => item.status === 'pending'),
  ]
  const acceptedItems = mediaItems.filter((item) => item.status === 'accepted')
  const rejectedItems = mediaItems.filter((item) => item.status === 'rejected')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-semibold">{translations.upload}</h2>
        <div className="flex flex-col gap-10 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          {/* Category selection comes first */}
          <div>
            <p className="mb-2">{translations.category}</p>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue
                  placeholder={translations.category}
                />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="font-light transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-[var(--stone-gray)] hover:shadow-md"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* File selection button comes second */}
          <div>
            <p className="mb-2">{translations.select}</p>
            <Button
              onClick={() => {
                if (!selectedCategory) {
                  toast.error('Please select a category first')
                  return
                }
                if (fileInputRef.current) {
                  fileInputRef.current.click()
                }
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
                translations.select
              )}
            </Button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              aria-label="Select files to upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFilesSelected}
            />
          </div>
        </div>
      </div>

      {/* Upload Selected Files Button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleUploadSelected}
            className="bg-primary text-white hover:bg-primary/90"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translations.uploading}
              </>
            ) : (
              'Upload Selected'
            )}
          </Button>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          {translations.preview} ({pendingItems.length + mediaItems.length})
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
                No images to review
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
                No accepted images
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
                No rejected images
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

        {(pendingItems.length > 0 || mediaItems.length > 0) && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={handleRemoveAll}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {translations.remove || 'Remove All'}
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
        {/* Only allow status changes on already uploaded items */}
        {!item.isLocal && item.status === 'pending' && (
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
      {/* Show status badge for uploaded items */}
      {!item.isLocal && item.status !== 'pending' && (
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
      {/* For local (not-yet-uploaded) items, display a badge */}
      {item.isLocal && (
        <div className="absolute right-2 top-2">
          <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs text-white">
            Not Uploaded
          </span>
        </div>
      )}
    </div>
  )
}

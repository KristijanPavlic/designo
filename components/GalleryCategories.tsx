'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Translations } from '@/types/translations'
import { useUser } from '@clerk/nextjs'
import { Maximize2, Trash2 } from 'lucide-react'
import {
  fetchGalleryImages,
  deleteGalleryImage,
} from '@/app/actions/gallery-actions'
import Spinner from './ui/spinner'
import GalleryFullscreenModal from './gallery/gallery-fullscreen-modal'
import ConfirmDialog from './ui/ConfirmDialog'
import type { CloudinaryResource } from '@/types/cloudinary'

import weddingsImg from 'public/images/slider_mobile_weddings.jpg'
import familyKidsImg from 'public/images/slider_desktop_mobile_family.jpg'
import christeningImg from 'public/images/slider_desktop_mobile_christening.jpg'
import birthdaysImg from 'public/images/slider_mobile_birthdays.jpg'

interface GalleryCategoriesProps {
  translations: Translations
}

type Category = 'weddings' | 'family_kids' | 'christening' | 'birthdays'

interface CategoryData {
  id: Category
  name: string
  images: StaticImageData[]
}

const LIMIT = 9

export default function GalleryCategories({
  translations,
}: GalleryCategoriesProps) {
  const { isSignedIn } = useUser()

  // For preview auto‑rotation (when no category is open)
  const [activeCategory, setActiveCategory] = useState<Category>('weddings')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cloudinary gallery state and handlers
  const [openGalleryCategory, setOpenGalleryCategory] =
    useState<Category | null>(null)
  const [galleryResources, setGalleryResources] = useState<
    CloudinaryResource[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] =
    useState<CloudinaryResource | null>(null)

  // In‑memory cache: once images are fetched for a category they are cached until page reload.
  const galleryCache = useRef<
    Record<Category, { images: CloudinaryResource[]; hasMore: boolean }>
  >({} as Record<Category, { images: CloudinaryResource[]; hasMore: boolean }>)

  // Use a ref to capture the category being requested (to avoid race conditions)
  const selectedCategoryRef = useRef<Category | null>(null)

  const categories: CategoryData[] = [
    {
      id: 'weddings',
      name: translations.dashboard.categories.weddings,
      images: [weddingsImg],
    },
    {
      id: 'family_kids',
      name: translations.dashboard.categories.family_kids,
      images: [familyKidsImg],
    },
    {
      id: 'christening',
      name: translations.dashboard.categories.christening,
      images: [christeningImg],
    },
    {
      id: 'birthdays',
      name: translations.dashboard.categories.birthdays,
      images: [birthdaysImg],
    },
  ]

  const categoryOrder = categories.map((cat) => cat.id)
  const getNextCategory = (current: Category): Category => {
    const currentIndex = categoryOrder.indexOf(current)
    const nextIndex = (currentIndex + 1) % categoryOrder.length
    return categoryOrder[nextIndex]
  }

  // Auto‑rotation for preview (only when no category is open)
  const startLoading = useCallback(() => {
    if (openGalleryCategory) return // pause auto‑rotation if a category is open
    const startTime = Date.now()
    const duration = 4000 // 4 seconds

    const animateLoading = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setLoadingProgress(progress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateLoading)
      } else {
        setActiveCategory(getNextCategory(activeCategory))
        setLoadingProgress(0)
        setCurrentImageIndex(0)
        startLoading() // restart auto‑rotation
      }
    }
    animationFrameRef.current = requestAnimationFrame(animateLoading)
  }, [activeCategory, openGalleryCategory])

  useEffect(() => {
    startLoading()
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current)
      const currentInterval = intervalRef.current
      if (currentInterval) clearInterval(currentInterval)
    }
  }, [startLoading])

  // Handle category click – toggles gallery open state and fetches Cloudinary images if opening.
  const handleCategoryClick = async (category: Category) => {
    if (openGalleryCategory === category) {
      // Close the gallery and restart preview auto‑rotation
      setOpenGalleryCategory(null)
      setGalleryResources([])
      setHasMore(false)
      setLoadingProgress(0)
      setCurrentImageIndex(0)
      startLoading()
    } else {
      setActiveCategory(category)
      setOpenGalleryCategory(category)
      // Check cache first.
      if (galleryCache.current[category]) {
        setGalleryResources(galleryCache.current[category].images)
        setHasMore(galleryCache.current[category].hasMore)
        return
      }
      // No cache: fetch initial images
      selectedCategoryRef.current = category
      setGalleryResources([]) // clear previous images
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setLoadingProgress(0)
      setCurrentImageIndex(0)
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchGalleryImages(category)
        if (selectedCategoryRef.current === category) {
          if (result.success) {
            setGalleryResources(result.data)
            const more = result.data.length === LIMIT
            setHasMore(more)
            galleryCache.current[category] = {
              images: result.data,
              hasMore: more,
            }
          } else {
            setError(result.error || 'Failed to load images')
          }
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // "View more" handler – fetches next batch of images and appends them.
  const handleViewMore = async () => {
    if (!openGalleryCategory) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchGalleryImages(openGalleryCategory)
      if (result.success) {
        const newImages = result.data
        const updatedImages = [...galleryResources, ...newImages]
        setGalleryResources(updatedImages)
        const more = newImages.length === LIMIT
        setHasMore(more)
        // Update the cache.
        galleryCache.current[openGalleryCategory] = {
          images: updatedImages,
          hasMore: more,
        }
      } else {
        setError(result.error || 'Failed to load images')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handlers for gallery modal and deletion.
  const handleViewImage = (index: number) => {
    setFullscreenIndex(index)
    setIsFullscreenOpen(true)
  }

  const handleNextImage = () => {
    setFullscreenIndex((prev) =>
      prev < galleryResources.length - 1 ? prev + 1 : prev
    )
  }

  const handlePrevImage = () => {
    setFullscreenIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleDeleteClick = (
    e: React.MouseEvent,
    resource: CloudinaryResource
  ) => {
    e.stopPropagation()
    setResourceToDelete(resource)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return

    try {
      const result = await deleteGalleryImage(resourceToDelete.public_id)
      if (result.success) {
        setGalleryResources((prev) =>
          prev.filter((item) => item.public_id !== resourceToDelete.public_id)
        )
        // Update cache as well.
        if (openGalleryCategory) {
          galleryCache.current[openGalleryCategory] = {
            images: galleryResources.filter(
              (item) => item.public_id !== resourceToDelete.public_id
            ),
            hasMore,
          }
        }
      } else {
        setError(result.error || 'Failed to delete image')
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting')
      console.error(err)
    } finally {
      setIsDeleteDialogOpen(false)
      setResourceToDelete(null)
    }
  }

  // Updated gallery grid – uses a fixed row height so Next.js Image (fill) renders properly.
  const renderGalleryGrid = (resources: CloudinaryResource[]) => {
    return (
      <div className="mt-8 grid auto-rows-[300px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {resources.map((resource, index) => {
          const gridClass =
            index === 2
              ? 'col-span-1 md:col-span-2 row-span-2'
              : index === 3
                ? 'col-span-1 md:col-span-1 row-span-2'
                : 'col-span-1 row-span-1'
          return (
            <div
              key={resource.public_id}
              className={`group relative overflow-hidden rounded-lg ${gridClass}`}
              onClick={() => handleViewImage(index)}
            >
              {resource.resource_type === 'video' ? (
                <video
                  src={resource.secure_url}
                  className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                  muted
                  playsInline
                />
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={resource.secure_url || '/placeholder.svg'}
                    alt=""
                    fill
                    className="cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 transition-colors hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewImage(index)
                    }}
                    aria-label="View fullscreen"
                  >
                    <Maximize2 size={20} />
                  </button>
                  {isSignedIn && (
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-red-600 transition-colors hover:bg-white"
                      onClick={(e) => handleDeleteClick(e, resource)}
                      aria-label="Delete image"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Mobile layout: render category texts in a 2×2 grid only.
  const renderMobileCategoryTextGrid = () => {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-center rounded border p-2"
          >
            <motion.h2
              className="cursor-pointer text-xl font-light transition-colors duration-500 ease-in-out"
              style={{
                backgroundImage:
                  category.id === activeCategory &&
                  openGalleryCategory !== category.id
                    ? `linear-gradient(to right, #000000 ${loadingProgress * 100}%, #8e8e8e ${loadingProgress * 100}%)`
                    : 'none',
                WebkitBackgroundClip:
                  category.id === activeCategory &&
                  openGalleryCategory !== category.id
                    ? 'text'
                    : 'unset',
                WebkitTextFillColor:
                  category.id === activeCategory &&
                  openGalleryCategory !== category.id
                    ? 'transparent'
                    : openGalleryCategory === category.id
                      ? '#000000'
                      : '#8e8e8e',
                color:
                  openGalleryCategory === category.id
                    ? '#000000'
                    : category.id === activeCategory &&
                        openGalleryCategory !== category.id
                      ? '#000000'
                      : '#8e8e8e',
              }}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </motion.h2>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Large Screen Layout */}
      <div className="mx-auto hidden w-full max-w-[1920px] space-y-16 py-12 lg:block">
        <div
          className={`flex items-start justify-between transition-all duration-500 ${
            openGalleryCategory
              ? 'flex-col'
              : 'lg:flex-row lg:items-center lg:justify-between'
          }`}
        >
          {/* Categories List */}
          <div
            className={`space-y-16 transition-all duration-500 ${
              openGalleryCategory ? 'w-full' : 'w-1/3'
            }`}
          >
            {categories.map((category) => (
              <div key={category.id} className="space-y-4">
                <motion.h2
                  className="cursor-pointer text-2xl font-light transition-colors duration-500 ease-in-out sm:text-4xl md:text-5xl xl:text-[5rem]"
                  style={{
                    backgroundImage:
                      category.id === activeCategory && !openGalleryCategory
                        ? `linear-gradient(to right, #000000 ${loadingProgress * 100}%, #8e8e8e ${loadingProgress * 100}%)`
                        : 'none',
                    WebkitBackgroundClip:
                      category.id === activeCategory && !openGalleryCategory
                        ? 'text'
                        : 'unset',
                    WebkitTextFillColor:
                      category.id === activeCategory && !openGalleryCategory
                        ? 'transparent'
                        : openGalleryCategory === category.id
                          ? '#000000'
                          : '#8e8e8e',
                    color:
                      openGalleryCategory === category.id
                        ? '#000000'
                        : category.id === activeCategory && !openGalleryCategory
                          ? '#000000'
                          : '#8e8e8e',
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </motion.h2>
                {/* When a category is open, display its Cloudinary gallery */}
                {openGalleryCategory === category.id && (
                  <div className="mt-8 w-full">
                    {isLoading ? (
                      <div className="flex h-64 items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : error ? (
                      <div className="rounded-md bg-red-50 p-4 text-red-800">
                        <p>{error}</p>
                        <button
                          className="mt-2 text-sm font-medium underline"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          Try again
                        </button>
                      </div>
                    ) : galleryResources.length === 0 ? (
                      <div className="rounded-md bg-gray-50 p-4 text-gray-800">
                        <p>No images found in this category.</p>
                      </div>
                    ) : (
                      <>
                        {renderGalleryGrid(galleryResources)}
                        {hasMore && (
                          <div className="mt-8 flex justify-center">
                            <button
                              className="text-base text-gray-500 hover:text-gray-800"
                              onClick={handleViewMore}
                            >
                              View more
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview Image Container (shown when no gallery is open) */}
          {!openGalleryCategory && (
            <div className="relative h-[50vh] w-full overflow-hidden rounded-lg shadow-lg sm:h-[60vh] md:h-[70vh] lg:h-[80vh] lg:w-3/6">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeCategory}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
                  className="absolute h-full w-full"
                >
                  {(() => {
                    const currentCat =
                      categories.find((cat) => cat.id === activeCategory) ||
                      categories[0]
                    const currentImg =
                      currentCat.images[
                        currentImageIndex % currentCat.images.length
                      ]
                    return (
                      <Image
                        src={currentImg || '/placeholder.svg'}
                        alt={currentCat.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Modals for large screens */}
        <GalleryFullscreenModal
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          resources={galleryResources}
          currentIndex={fullscreenIndex}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Image"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Render a 2×2 grid of category texts only */}
        {renderMobileCategoryTextGrid()}

        {/* Below the category grid, show the preview container or gallery */}
        {openGalleryCategory ? (
          <div className="mt-4 px-4">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-2 text-red-800">
                <p>{error}</p>
                <button
                  className="mt-1 text-xs font-medium underline"
                  onClick={() => handleCategoryClick(openGalleryCategory)}
                >
                  Try again
                </button>
              </div>
            ) : galleryResources.length === 0 ? (
              <div className="rounded-md bg-gray-50 p-2 text-gray-800">
                <p>No images found in this category.</p>
              </div>
            ) : (
              <>
                {renderGalleryGrid(galleryResources)}
                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <button
                      className="text-base text-gray-500 hover:text-gray-800"
                      onClick={handleViewMore}
                    >
                      View more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="relative mt-4 h-[50vh] w-full overflow-hidden rounded-lg shadow-lg">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeCategory}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
                className="absolute h-full w-full"
              >
                {(() => {
                  const currentCat =
                    categories.find((cat) => cat.id === activeCategory) ||
                    categories[0]
                  const currentImg =
                    currentCat.images[
                      currentImageIndex % currentCat.images.length
                    ]
                  return (
                    <Image
                      src={currentImg || '/placeholder.svg'}
                      alt={currentCat.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <GalleryFullscreenModal
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          resources={galleryResources}
          currentIndex={fullscreenIndex}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title={translations.categories.deleteAsset}
          confirmText={translations.categories.delete}
          cancelText={translations.categories.cancel}
        />
      </div>
    </>
  )
}

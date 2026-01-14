'use server'

import {
  getCloudinaryResources,
  deleteCloudinaryResource,
} from '@/lib/cloudinary_lib'
import type { CloudinaryResource } from '@/types/cloudinary'
import { currentUser } from '@clerk/nextjs/server'

export async function fetchGalleryImages(category: string): Promise<{
  success: boolean
  data: CloudinaryResource[]
  error?: string
}> {
  try {
    // Map category to folder name in Cloudinary
    const folderMap: Record<string, string> = {
      weddings: 'weddings',
      family_kids: 'family_kids',
      christening: 'christening',
      cake_smash_birthdays: 'cake_smash_birthdays',
      newborn: 'newborn',
    }

    const folder = folderMap[category] || category
    const resources = await getCloudinaryResources(folder)

    return {
      success: true,
      data: resources,
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to fetch images. Please try again later.',
    }
  }
}

export async function deleteGalleryImage(
  publicId: string,
  resourceType: string = 'image'
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Check if user is authenticated
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized. You must be logged in to delete images.',
      }
    }

    // Pass resourceType to the deletion function
    const result = await deleteCloudinaryResource(publicId, resourceType)

    if (result) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        error: 'Failed to delete asset. Please try again later.',
      }
    }
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    }
  }
}

// Utility function to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Progressive loading - fetch first batch immediately, then load more in background
export async function fetchInitialImages(): Promise<{
  success: boolean
  data: { horizontal: CloudinaryResource[]; portrait: CloudinaryResource[] }
  error?: string
}> {
  try {
    const categories = ['weddings', 'family_kids', 'christening', 'cake_smash_birthdays', 'newborn']
    
    // Get just 1 image per category for VERY fast initial loading
    const initialPromises = categories.map(async (category) => {
      try {
        const resources = await getCloudinaryResources(category)
        return shuffleArray(resources).slice(0, 1) // Just 1 per category for speed
      } catch (error) {
        console.error(`Error fetching initial ${category} images:`, error)
        return []
      }
    })
    
    const results = await Promise.allSettled(initialPromises)
    const allImages: CloudinaryResource[] = []
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allImages.push(...result.value)
      }
    })
    
    const shuffledImages = shuffleArray(allImages)
    
    // Filter by aspect ratio
    const horizontalImages = shuffledImages.filter(img => img.width > img.height)
    const portraitImages = shuffledImages.filter(img => img.height >= img.width)
    
    return {
      success: true,
      data: {
        horizontal: horizontalImages,
        portrait: portraitImages
      }
    }
  } catch (error) {
    console.error('Error fetching initial images:', error)
    return {
      success: false,
      data: { horizontal: [], portrait: [] },
      error: 'Failed to fetch initial images.'
    }
  }
}

export async function fetchAllCategoryImages(limitPerCategory: number = 3): Promise<{
  success: boolean
  data: { horizontal: CloudinaryResource[]; portrait: CloudinaryResource[] }
  error?: string
  categories: string[]
}> {
  try {
    const categories = ['weddings', 'family_kids', 'christening', 'cake_smash_birthdays', 'newborn']
    
    // Fetch images from all categories in parallel with timeout for faster performance
    const categoryPromises = categories.map(async (category) => {
      try {
        // Add timeout to prevent long waits
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2500) // 2.5 second timeout per category
        
        const resources = await getCloudinaryResources(category)
        clearTimeout(timeoutId)
        
        // Shuffle and take random images from each category
        const shuffledResources = shuffleArray(resources)
        return {
          category,
          images: shuffledResources.slice(0, limitPerCategory),
          success: true
        }
      } catch (error) {
        console.error(`Error fetching ${category} images:`, error)
        return {
          category,
          images: [],
          success: false
        }
      }
    })
    
    const categoryResults = await Promise.allSettled(categoryPromises)
    const allImages: CloudinaryResource[] = []
    const successfulCategories: string[] = []
    
    categoryResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        allImages.push(...result.value.images)
        successfulCategories.push(result.value.category)
      }
    })
    
    // Shuffle all images for better randomization
    const shuffledAllImages = shuffleArray(allImages)
    
    // Filter images by aspect ratio with better categorization
    const horizontalImages = shuffledAllImages.filter(img => {
      const aspectRatio = img.width / img.height
      return aspectRatio > 1.2 // More clearly horizontal images
    })
    
    const portraitImages = shuffledAllImages.filter(img => {
      const aspectRatio = img.width / img.height
      return aspectRatio < 0.9 // More clearly portrait images
    })
    
    // Add square/near-square images to both arrays for flexibility
    const squareImages = shuffledAllImages.filter(img => {
      const aspectRatio = img.width / img.height
      return aspectRatio >= 0.9 && aspectRatio <= 1.2
    })
    
    return {
      success: true,
      data: {
        horizontal: [...horizontalImages, ...squareImages].slice(0, 20), // Limit to 20 for performance
        portrait: [...portraitImages, ...squareImages].slice(0, 20) // Limit to 20 for performance
      },
      categories: successfulCategories
    }
  } catch (error) {
    console.error('Error fetching all category images:', error)
    return {
      success: false,
      data: { horizontal: [], portrait: [] },
      error: 'Failed to fetch images from categories.',
      categories: []
    }
  }
}


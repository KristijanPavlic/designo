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
      birthdays: 'birthdays',
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

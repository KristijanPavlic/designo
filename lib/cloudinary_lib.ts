'use server'

import { v2 as cloudinary } from 'cloudinary'
import type {
  CloudinaryResource,
  CloudinarySearchResult,
} from '@/types/cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function getCloudinaryResources(
  folder: string
): Promise<CloudinaryResource[]> {
  try {
    const result = (await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()) as CloudinarySearchResult

    return result.resources.map((resource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      resource_type: resource.resource_type,
      created_at: resource.created_at,
    }))
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error)
    return []
  }
}

export async function deleteCloudinaryResource(
  publicId: string,
  resourceType: string = 'image'
): Promise<boolean> {
  try {
    const result = (await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })) as {
      result: string
    }
    return result.result === 'ok'
  } catch (error) {
    console.error('Error deleting Cloudinary resource:', error)
    return false
  }
}

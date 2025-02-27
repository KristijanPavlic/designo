import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Function to get all folders
export async function getCloudinaryFolders() {
  try {
    const result = await cloudinary.api.root_folders()
    return result.folders
  } catch (error) {
    console.error('Error fetching Cloudinary folders:', error)
    return []
  }
}

// Function to get images from a specific folder
export async function getImagesFromFolder(folderName: string) {
  try {
    const result = await cloudinary.search
      .expression(`folder:${folderName}/*`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()

    return result.resources
  } catch (error) {
    console.error(`Error fetching images from folder ${folderName}:`, error)
    return []
  }
}

// Function to delete an image
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error(`Error deleting image ${publicId}:`, error)
    throw error
  }
}

// Function to create a new folder
export async function createFolder(folderName: string) {
  try {
    // Cloudinary doesn't have a direct API to create empty folders
    // Folders are created automatically when uploading files to them
    // This is a workaround to create an empty folder
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      {
        public_id: `${folderName}/.placeholder`,
        folder: folderName,
      }
    )
    return result
  } catch (error) {
    console.error(`Error creating folder ${folderName}:`, error)
    throw error
  }
}

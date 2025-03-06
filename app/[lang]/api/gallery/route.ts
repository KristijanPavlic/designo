import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Fetch images from each folder
    const fetchFolderImages = async (folder: string) => {
      const result = await cloudinary.search
        .expression(`folder:${folder}`)
        .sort_by('created_at', 'desc')
        .max_results(10)
        .execute()

      return result.resources.map(
        (resource: { secure_url: string }) => resource.secure_url
      )
    }

    // Fetch images for all categories
    const [weddings, family_kids, christening, birthdays] = await Promise.all([
      fetchFolderImages('weddings'),
      fetchFolderImages('family_kids'),
      fetchFolderImages('christening'),
      fetchFolderImages('birthdays'),
    ])

    return NextResponse.json({
      images: {
        weddings,
        family_kids,
        christening,
        birthdays,
      },
    })
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

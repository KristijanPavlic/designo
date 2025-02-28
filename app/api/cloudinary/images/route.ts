import { NextResponse } from 'next/server'
import { getImagesFromFolder, deleteImage } from '@/lib/cloudinary'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folder = searchParams.get('folder')
  if (!folder) {
    return NextResponse.json(
      { error: 'Folder parameter is required' },
      { status: 400 }
    )
  }
  try {
    const images = await getImagesFromFolder(folder)
    return NextResponse.json(images)
  } catch (error) {
    console.error(`Error fetching images from folder ${folder}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { publicId } = await request.json()
  if (!publicId) {
    return NextResponse.json(
      { error: 'Public ID is required' },
      { status: 400 }
    )
  }
  try {
    const result = await deleteImage(publicId)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error deleting image ${publicId}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

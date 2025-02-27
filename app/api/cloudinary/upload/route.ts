import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function POST(request: Request) {
  try {
    const { folder, file } = await request.json()

    if (!folder || !file) {
      return NextResponse.json(
        { error: 'Folder and file are required' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

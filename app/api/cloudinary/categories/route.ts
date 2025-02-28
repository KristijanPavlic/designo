import { NextResponse } from 'next/server'
import { getCloudinaryFolders, createFolder } from '@/lib/cloudinary'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
  try {
    const folders = await getCloudinaryFolders()
    return NextResponse.json(folders)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }
    // Create folder in Cloudinary
    const result = await createFolder(name)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) {
    return NextResponse.json(
      { error: 'Path parameter is required' },
      { status: 400 }
    )
  }
  try {
    // Note: Cloudinary doesn't have a direct API to delete folders
    // This is a workaround to delete all resources in a folder
    const result = await cloudinary.api.delete_resources_by_prefix(path)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error deleting category ${path}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

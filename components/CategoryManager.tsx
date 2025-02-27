'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Category = {
  name: string
  path: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cloudinary/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/cloudinary/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      toast.success(`Category "${newCategory}" created successfully`)
      setNewCategory('')
      fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    } finally {
      setIsCreating(false)
    }
  }

  // Delete a category
  const handleDeleteCategory = async (category: Category) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${category.name}"?`
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `/api/cloudinary/categories?path=${category.path}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      toast.success(`Category "${category.name}" deleted successfully`)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manage Categories</h2>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleCreateCategory}
          disabled={isCreating || !newCategory.trim()}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="mb-4 text-lg font-medium">Existing Categories</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No categories found
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.path}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete {category.name}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

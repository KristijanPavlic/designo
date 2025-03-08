'use client'

import { useState } from 'react'
import type { MediaCategory } from '@/types/media'
import { Translations } from '@/types/translations'

interface CategorySelectorProps {
  selectedCategory: MediaCategory | ''
  onCategoryChange: (category: MediaCategory) => void
  translations: Translations
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
  translations,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories: MediaCategory[] = [
    'weddings',
    'christening',
    'cake_smash_birthdays',
    'newborn',
  ]

  const handleCategorySelect = (category: MediaCategory) => {
    onCategoryChange(category)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <label className="block text-lg font-light">
        {translations.dashboard.selectCategory}
      </label>
      <div className="relative bg-white">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md border px-4 py-2"
        >
          <span>
            {selectedCategory
              ? translations.dashboard.categories[selectedCategory]
              : translations.dashboard.selectACategory}
          </span>
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className="w-full px-4 py-2 text-left font-light transition-all duration-300 ease-in-out hover:bg-gray-100"
              >
                {translations.dashboard.categories[category]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

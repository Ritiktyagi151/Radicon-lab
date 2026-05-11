'use client'

import { Search } from 'lucide-react'
import type { Category } from '@/types/product'

export default function ProductFilters({
  categories,
  activeCategory,
  search,
  onCategoryChange,
  onSearchChange,
}: {
  categories: Category[]
  activeCategory: string
  search: string
  onCategoryChange: (value: string) => void
  onSearchChange: (value: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      <label className="flex h-12 items-center gap-3 rounded-sm border border-brand-100 bg-white px-4 shadow-sm">
        <Search size={18} className="text-brand-600" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className="h-full w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('All')}
          className={`rounded-sm border px-4 py-2 text-sm font-bold transition ${
            activeCategory === 'All'
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-brand-100 bg-white text-gray-600 hover:text-brand-600'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`rounded-sm border px-4 py-2 text-sm font-bold transition ${
              activeCategory === category._id
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-brand-100 bg-white text-gray-600 hover:text-brand-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

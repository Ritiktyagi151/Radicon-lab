'use client'

import { useMemo, useState } from 'react'
import type { Category, Product } from '@/types/product'
import ProductCard from './ProductCard'
import ProductFilters from './ProductFilters'

export default function ProductListing({
  categories,
  products,
  lockedCategoryId,
}: {
  categories: Category[]
  products: Product[]
  lockedCategoryId?: string
}) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(lockedCategoryId || 'All')

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const categoryId = typeof product.category === 'string' ? product.category : product.category?._id
      const matchesCategory = activeCategory === 'All' || categoryId === activeCategory
      const searchable = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase()
      return matchesCategory && (!query || searchable.includes(query))
    })
  }, [activeCategory, products, search])

  return (
    <section className="bg-[#F0F8FF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-brand-100 pb-8">
          <ProductFilters
            categories={lockedCategoryId ? [] : categories}
            activeCategory={activeCategory}
            search={search}
            onCategoryChange={setActiveCategory}
            onSearchChange={setSearch}
          />
        </div>

        {visibleProducts.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-brand-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">No Products</p>
            <h3 className="mt-3 text-2xl font-bold text-[#111111]">No product matched your filter</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Try another search term or category to continue browsing Radicon Lab products.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

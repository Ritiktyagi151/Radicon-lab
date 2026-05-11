'use client'

import { useMemo, useState } from 'react'
import type { Blog, BlogListResponse } from '@/types/blog'
import BlogCard from './BlogCard'
import BlogFilter from './BlogFilter'
import BlogSearch from './BlogSearch'
import BlogSkeleton from './BlogSkeleton'
import FeaturedBlog from './FeaturedBlog'
import Pagination from './Pagination'
import SectionHeading from './SectionHeading'

const PAGE_SIZE = 6

type BlogListingProps = {
  initialBlogs: BlogListResponse
  featuredBlog: Blog | null
  canonicalPath?: string
}

export default function BlogListing({ initialBlogs, featuredBlog }: BlogListingProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(initialBlogs.data.map((blog) => blog.category)))],
    [initialBlogs.data],
  )

  const filteredBlogs = useMemo(() => {
    const haystack = search.trim().toLowerCase()

    return initialBlogs.data.filter((blog) => {
      const matchesCategory = activeCategory === 'All' || blog.category === activeCategory
      const searchable = `${blog.title} ${blog.excerpt} ${blog.category} ${blog.tags.join(' ')}`.toLowerCase()
      const matchesSearch = !haystack || searchable.includes(haystack)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, initialBlogs.data, search])

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleBlogs = filteredBlogs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleFilter = (action: () => void) => {
    setIsFiltering(true)
    action()
    setPage(1)
    window.setTimeout(() => setIsFiltering(false), 250)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#F0F8FF] py-20 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Radicon Lab Blog</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#111111] sm:text-5xl">
              Practical pharma insights for quality-led manufacturing
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
              Explore useful articles on formulation, quality systems, documentation, research, and
              dependable pharmaceutical operations.
            </p>
          </div>
          <div className="grid gap-4 rounded-sm border border-brand-100 bg-white p-5 shadow-sm sm:grid-cols-3">
            {[
              ['Quality', 'Documentation and compliance'],
              ['Research', 'Formulation and process notes'],
              ['Operations', 'Manufacturing knowledge'],
            ].map(([label, text]) => (
              <div key={label} className="border-l-2 border-brand-600 pl-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#111111]">{label}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredBlog ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FeaturedBlog blog={featuredBlog} />
          </div>
        </section>
      ) : null}

      <section className="bg-[#F0F8FF] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-6 border-b border-brand-100 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <SectionHeading
              eyebrow="Latest Articles"
              title="Browse our blog"
              subtitle="Search by topic or filter by category to find relevant insights quickly."
            />
            <div className="grid gap-4">
              <BlogSearch value={search} onChange={(value) => handleFilter(() => setSearch(value))} />
              <BlogFilter
                categories={categories}
                activeCategory={activeCategory}
                onChange={(category) => handleFilter(() => setActiveCategory(category))}
              />
            </div>
          </div>

          {isFiltering ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : visibleBlogs.length ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visibleBlogs.map((blog) => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="rounded-sm border border-dashed border-brand-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">No Articles</p>
              <h3 className="mt-3 text-2xl font-bold text-[#111111]">Nothing matched your search</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Try a different keyword or choose another category to continue browsing Radicon Lab
                insights.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

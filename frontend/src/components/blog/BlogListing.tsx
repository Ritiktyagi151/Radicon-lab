'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
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
      <section className="relative min-h-[430px] overflow-hidden bg-[#F0F8FF] sm:min-h-[500px] lg:min-h-[560px]">
        <Image
          src="/homepage-banner/blog-banner.png"
          alt="Radicon Lab Blog"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/10" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-t from-white/70 via-transparent to-transparent lg:hidden" />
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600" />

        <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-14 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-600">Radicon Lab Blog</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
              Practical pharma insights for quality-led manufacturing
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-gray-700">
              Explore useful articles on formulation, quality systems, documentation, research, and
              dependable pharmaceutical operations.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['Quality', 'Research', 'Operations'].map((label) => (
                <span
                  key={label}
                  className="border border-brand-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#111111] shadow-sm backdrop-blur"
                >
                  {label}
                </span>
              ))}
            </div>
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

'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'
import type { Blog } from '@/types/blog'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

const getBlogDate = (blog: Blog) => blog.publishedAt || blog.createdAt

export default function BlogCard({ blog }: { blog: Blog }) {
  const { blogHref } = useSeoRoutes()
  const href = blogHref(blog.slug)

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-sm border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-100/70"
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-[245px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 rounded-sm bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
            {blog.category}
          </span>
          <span className="absolute bottom-4 left-4 rounded-sm bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#111111] shadow-md">
            {formatDate(getBlogDate(blog))}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <User size={15} className="text-brand-600" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} className="text-brand-600" />
            {blog.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold leading-snug text-[#111111] transition-colors group-hover:text-brand-600">
          <Link href={href}>{blog.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">{blog.excerpt}</p>

        <div className="mt-6 flex items-center justify-between border-t border-brand-50 pt-5">
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-[#f0f4f8] px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={href}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-100 transition-all hover:bg-brand-700 active:scale-95"
            aria-label={`Read ${blog.title}`}
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

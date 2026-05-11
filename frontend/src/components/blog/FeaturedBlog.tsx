'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'
import type { Blog } from '@/types/blog'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

const getBlogDate = (blog: Blog) => blog.publishedAt || blog.createdAt

export default function FeaturedBlog({ blog }: { blog: Blog }) {
  const { blogHref } = useSeoRoutes()
  const href = blogHref(blog.slug)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="grid overflow-hidden rounded-sm border border-brand-100 bg-white shadow-lg shadow-brand-100/50 lg:grid-cols-[1.08fr_0.92fr]"
    >
      <Link href={href} className="relative block overflow-hidden">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="h-full min-h-[320px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute bottom-5 left-5 rounded-sm bg-white px-4 py-2 text-sm font-bold text-[#111111] shadow-md">
          {formatDate(getBlogDate(blog))}
        </span>
      </Link>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <span className="w-fit rounded-sm bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-600 ring-1 ring-brand-100">
          Featured / {blog.category}
        </span>
        <h2 className="mt-5 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl">
          <Link href={href} className="transition-colors hover:text-brand-600">
            {blog.title}
          </Link>
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-500">{blog.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-brand-50 py-4 text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <User size={16} className="text-brand-600" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} className="text-brand-600" />
            {blog.readTime}
          </span>
        </div>
        <Link
          href={href}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-brand-700 active:scale-95"
        >
          Read More <ArrowRight size={17} />
        </Link>
      </div>
    </motion.article>
  )
}

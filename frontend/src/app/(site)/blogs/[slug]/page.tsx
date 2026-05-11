import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Tag, User } from 'lucide-react'
import Link from 'next/link'
import BlogCard from '@/components/blog/BlogCard'
import RichContent, { getTableOfContents } from '@/components/blog/RichContent'
import SocialShare from '@/components/blog/SocialShare'
import TableOfContents from '@/components/blog/TableOfContents'
import { getAllPublishedBlogs, getBlogBySlug } from '@/lib/blogApi'
import {
  findRouteByPath,
  getBlogDetailPath,
  getBlogIndexPath,
  getPublicSeoRoutes,
} from '@/lib/seoRoutes'

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

const getBlogDate = (blog: { publishedAt?: string; createdAt: string }) => blog.publishedAt || blog.createdAt

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const [blog, routes] = await Promise.all([getBlogBySlug(slug), getPublicSeoRoutes()])

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  const detailPath = getBlogDetailPath(routes, blog.slug)
  const route = findRouteByPath(routes, detailPath) || findRouteByPath(routes, `/blogs/${blog.slug}`)
  const title = route?.metaTitle || blog.seoTitle || blog.title
  const description = route?.metaDescription || blog.seoDescription || blog.excerpt
  const canonical = route?.canonicalUrl || detailPath
  const ogTitle = route?.openGraph?.title || title
  const ogDescription = route?.openGraph?.description || description
  const ogImage = route?.openGraph?.image || blog.featuredImage
  const twitterTitle = route?.twitter?.title || ogTitle
  const twitterDescription = route?.twitter?.description || ogDescription
  const twitterImage = route?.twitter?.image || ogImage

  return {
    title,
    description,
    keywords: route?.focusKeyword
      ? route.focusKeyword.split(',').map((keyword) => keyword.trim()).filter(Boolean)
      : blog.tags,
    alternates: {
      canonical,
    },
    robots: {
      index: route?.robotsIndex !== 'noindex',
      follow: route?.robotsFollow !== 'nofollow',
      googleBot: {
        index: route?.robotsIndex !== 'noindex',
        follow: route?.robotsFollow !== 'nofollow',
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: canonical,
      images: [{ url: ogImage }],
      publishedTime: getBlogDate(blog),
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const [blog, blogs, routes] = await Promise.all([
    getBlogBySlug(slug),
    getAllPublishedBlogs(),
    getPublicSeoRoutes(),
  ])

  if (!blog) notFound()

  const currentIndex = blogs.findIndex((item) => item.slug === blog.slug)
  const previousBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null
  const nextBlog = currentIndex >= 0 && currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null
  const relatedBlogs = blogs
    .filter((item) => item.slug !== blog.slug && item.category === blog.category)
    .slice(0, 3)
  const tocItems = getTableOfContents(blog.content)
  const blogIndexPath = getBlogIndexPath(routes)

  return (
    <>
      <article>
        <section className="relative overflow-hidden bg-[#F0F8FF] py-16 sm:py-20">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600" />
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Link
              href={blogIndexPath}
              className="mb-8 inline-flex items-center gap-2 rounded-sm border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand-600 shadow-sm transition-colors hover:text-brand-700"
            >
              <ArrowLeft size={17} />
              Back to Blogs
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-sm bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                {blog.category}
              </span>
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 shadow-sm"
                >
                  <Tag size={13} className="text-brand-600" />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-[#111111] sm:text-5xl">
              {blog.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-500">
              {blog.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <User size={16} className="text-brand-600" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={16} className="text-brand-600" />
                {formatDate(getBlogDate(blog))}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-brand-600" />
                {blog.readTime}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="h-[320px] w-full rounded-sm border border-brand-100 object-cover shadow-xl shadow-brand-100/50 sm:h-[460px] lg:h-[560px]"
            />
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:px-8">
            <div className="min-w-0">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-100 pb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Share this article
                </p>
                <SocialShare title={blog.title} />
              </div>
              <RichContent content={blog.content} />
            </div>
            <div className="hidden lg:block">
              <TableOfContents items={tocItems} />
            </div>
          </div>
        </section>
      </article>

      <section className="bg-[#F0F8FF] py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {previousBlog ? (
            <Link
              href={getBlogDetailPath(routes, previousBlog.slug)}
              className="rounded-sm border border-brand-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/70"
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-600">
                <ArrowLeft size={16} />
                Previous
              </span>
              <h3 className="mt-3 text-xl font-bold text-[#111111]">{previousBlog.title}</h3>
            </Link>
          ) : null}
          {nextBlog ? (
            <Link
              href={getBlogDetailPath(routes, nextBlog.slug)}
              className="rounded-sm border border-brand-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/70 md:text-right"
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-600">
                Next
                <ArrowRight size={16} />
              </span>
              <h3 className="mt-3 text-xl font-bold text-[#111111]">{nextBlog.title}</h3>
            </Link>
          ) : null}
        </div>
      </section>

      {relatedBlogs.length ? (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Related Blogs
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#111111]">More from {blog.category}</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((item) => (
                <BlogCard key={item.slug} blog={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

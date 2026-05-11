import type { Metadata } from 'next'
import BlogListing from '@/components/blog/BlogListing'
import { getBlogs, getFeaturedBlog } from '@/lib/blogApi'
import { buildSeoMetadata, getPublicSeoRoutes, resolveHref } from '@/lib/seoRoutes'

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/blogs', {
    title: 'Blogs',
    description:
      'Read Radicon Lab insights on pharmaceutical manufacturing, quality, research, and operations.',
  })
}

export default async function BlogsPage() {
  const [blogs, featuredBlog, routes] = await Promise.all([
    getBlogs({ limit: 100 }),
    getFeaturedBlog(),
    getPublicSeoRoutes(),
  ])

  return (
    <BlogListing
      initialBlogs={blogs}
      featuredBlog={featuredBlog}
      canonicalPath={resolveHref(routes, '/blogs')}
    />
  )
}

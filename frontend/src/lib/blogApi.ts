import { sampleBlogs } from '@/lib/sampleBlogs'
import type { Blog, BlogListResponse } from '@/types/blog'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type BlogQuery = {
  page?: number
  limit?: number
  search?: string
  category?: string
}

const getBlogDate = (blog: Blog) => blog.publishedAt || blog.createdAt

const sortByDate = (blogs: Blog[]) =>
  [...blogs].sort((a, b) => new Date(getBlogDate(b)).getTime() - new Date(getBlogDate(a)).getTime())

export async function getBlogs(query: BlogQuery = {}): Promise<BlogListResponse> {
  const params = new URLSearchParams()
  params.set('status', 'published')
  params.set('page', String(query.page || 1))
  params.set('limit', String(query.limit || 9))

  if (query.search) params.set('search', query.search)
  if (query.category && query.category !== 'All') params.set('category', query.category)

  try {
    const response = await fetch(`${API_BASE_URL}/blogs?${params.toString()}`, {
      cache: 'no-store',
    })

    if (!response.ok) throw new Error('Unable to fetch blogs')

    return response.json() as Promise<BlogListResponse>
  } catch {
    const filtered = sortByDate(sampleBlogs).filter((blog) => {
      const matchesCategory =
        !query.category || query.category === 'All' || blog.category === query.category
      const haystack = `${blog.title} ${blog.excerpt} ${blog.category} ${blog.tags.join(' ')}`.toLowerCase()
      const matchesSearch = !query.search || haystack.includes(query.search.toLowerCase())

      return matchesCategory && matchesSearch
    })
    const page = query.page || 1
    const limit = query.limit || 9
    const start = (page - 1) * limit

    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    }
  }
}

export async function getAllPublishedBlogs(): Promise<Blog[]> {
  const result = await getBlogs({ limit: 100 })
  return result.data
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      cache: 'no-store',
    })

    if (!response.ok) throw new Error('Unable to fetch blog')

    return response.json() as Promise<Blog>
  } catch {
    return sampleBlogs.find((blog) => blog.slug === slug) || null
  }
}

export async function getFeaturedBlog(): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/featured`, {
      cache: 'no-store',
    })

    if (!response.ok) throw new Error('Unable to fetch featured blog')

    return response.json() as Promise<Blog>
  } catch {
    return sortByDate(sampleBlogs)[0] || null
  }
}

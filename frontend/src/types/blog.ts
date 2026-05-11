export type BlogStatus = 'draft' | 'published' | 'archived'

export type Blog = {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  seoTitle?: string
  seoDescription?: string
  status: BlogStatus
  readTime: string
  publishedAt?: string
  createdAt: string
  updatedAt?: string
}

export type BlogListResponse = {
  data: Blog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

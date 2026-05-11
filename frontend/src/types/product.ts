export type ProductStatus = 'active' | 'draft' | 'archived'

export type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  metaTitle?: string
  metaDescription?: string
  status: ProductStatus
  sortOrder?: number
}

export type Product = {
  _id: string
  name: string
  slug: string
  sku: string
  category: Category | string | null
  description: string
  shortDescription?: string
  fullContent?: string
  image: string
  gallery: string[]
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  seoKeywords?: string[]
  canonicalUrl?: string
  status: ProductStatus
  sortOrder?: number
}

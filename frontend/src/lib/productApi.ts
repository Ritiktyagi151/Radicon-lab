import type { Category, Product } from '@/types/product'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' })
  if (!response.ok) throw new Error('Unable to load product data')
  return response.json() as Promise<T>
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchJson<Category[]>('/categories?includeDrafts=false')
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await fetchJson<Category>(`/categories/slug/${slug}`)
  } catch {
    return null
  }
}

export async function getProducts(query: { category?: string; search?: string } = {}): Promise<Product[]> {
  const params = new URLSearchParams()
  params.set('status', 'active')
  if (query.category) params.set('category', query.category)
  if (query.search) params.set('search', query.search)

  try {
    return await fetchJson<Product[]>(`/products?${params.toString()}`)
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await fetchJson<Product>(`/products/slug/${slug}`)
  } catch {
    return null
  }
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const categoryId = typeof product.category === 'string' ? product.category : product.category?._id
  if (!categoryId) return []
  try {
    return await fetchJson<Product[]>(`/products/${product._id}/related/${categoryId}`)
  } catch {
    return []
  }
}

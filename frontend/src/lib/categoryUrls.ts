const CATEGORY_PRODUCT_PREFIX = 'product-'

export function getCategoryPath(slug: string) {
  return `/${CATEGORY_PRODUCT_PREFIX}${slug}`
}

export function getCategorySlugFromPath(path: string) {
  if (path.includes('/') || !path.startsWith(CATEGORY_PRODUCT_PREFIX)) return null

  const slug = path.slice(CATEGORY_PRODUCT_PREFIX.length)
  return slug || null
}

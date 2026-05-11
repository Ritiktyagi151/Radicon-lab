const PRODUCT_DETAIL_PREFIX = 'product-details-'

export function getProductPath(slug: string) {
  return `/${PRODUCT_DETAIL_PREFIX}${slug}`
}

export function getProductSlugFromPath(path: string) {
  if (path.includes('/') || !path.startsWith(PRODUCT_DETAIL_PREFIX)) return null

  const slug = path.slice(PRODUCT_DETAIL_PREFIX.length)
  return slug || null
}

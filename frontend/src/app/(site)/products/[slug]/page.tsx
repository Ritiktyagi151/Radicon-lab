import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import { getProductBySlug, getRelatedProducts } from '@/lib/productApi'
import { getProductPath } from '@/lib/productUrls'
import { buildSeoMetadata, findRouteByPath, getPublicSeoRoutes } from '@/lib/seoRoutes'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [product, routes] = await Promise.all([getProductBySlug(slug), getPublicSeoRoutes()])

  if (!product) {
    return {
      title: 'Product Not Found | Radicon Lab',
    }
  }

  const path = getProductPath(product.slug)
  const route = findRouteByPath(routes, path)

  if (route) {
    return buildSeoMetadata(routes, path, {
      title: product.name,
      description: product.shortDescription || product.description,
    })
  }

  return {
    title: `${product.metaTitle || product.name} | Radicon Lab`,
    description: product.metaDescription || product.shortDescription || product.description,
    keywords: product.seoKeywords,
    alternates: product.canonicalUrl
      ? {
          canonical: product.canonicalUrl,
        }
      : undefined,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}

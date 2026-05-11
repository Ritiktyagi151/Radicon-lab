import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AboutPage from '@/app/(site)/about/page'
import BlogDetailPage, {
  generateMetadata as generateBlogMetadata,
} from '@/app/(site)/blogs/[slug]/page'
import BlogsPage from '@/app/(site)/blogs/page'
import CategoryDetailPage, {
  generateMetadata as generateCategoryMetadata,
} from '@/app/(site)/categories/[slug]/page'
import CareerPage from '@/app/(site)/career/page'
import ContactPage from '@/app/(site)/contact/page'
import PrivacyPolicyPage from '@/app/(site)/privacy/page'
import ProductDetailPage, {
  generateMetadata as generateProductMetadata,
} from '@/app/(site)/products/[slug]/page'
import ServicesPage, {
  generateServiceMetadata,
} from '@/app/(site)/services/page'
import TermsConditionsPage from '@/app/(site)/terms/page'
import { getCategorySlugFromPath } from '@/lib/categoryUrls'
import { getProductSlugFromPath } from '@/lib/productUrls'
import { getServiceBySlug } from '@/lib/serviceData'
import {
  buildSeoMetadata,
  findRouteByPath,
  getBlogIndexPath,
  getBlogSlugFromPath,
  getPublicSeoRoutes,
  normalizePath,
} from '@/lib/seoRoutes'

type DynamicPageProps = {
  params: Promise<{ slug: string[] }>
}

function getPath(slug: string[]) {
  return normalizePath(slug.join('/'))
}

function getPageKey(pageName = '', pageType = '') {
  return `${pageName} ${pageType}`.toLowerCase()
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const path = getPath(slug)
  const routes = await getPublicSeoRoutes()
  const blogSlug = getBlogSlugFromPath(routes, path)
  const productSlug = getProductSlugFromPath(path)
  const categorySlug = getCategorySlugFromPath(path)
  const serviceSlug = path.replace(/^\//, '')

  if (productSlug) {
    return generateProductMetadata({ params: Promise.resolve({ slug: productSlug }) })
  }

  if (categorySlug) {
    return generateCategoryMetadata({ params: Promise.resolve({ slug: categorySlug }) })
  }

  if (getServiceBySlug(serviceSlug)) {
    return generateServiceMetadata(serviceSlug)
  }

  if (blogSlug) {
    return generateBlogMetadata({ params: Promise.resolve({ slug: blogSlug }) })
  }

  const route = findRouteByPath(routes, path)

  if (!route) return {}

  return buildSeoMetadata(routes, path, {
    title: route.pageName,
    description: '',
  })
}

export default async function DynamicSitePage({ params }: DynamicPageProps) {
  const { slug } = await params
  const path = getPath(slug)
  const routes = await getPublicSeoRoutes()
  const blogIndexPath = getBlogIndexPath(routes)
  const blogSlug = getBlogSlugFromPath(routes, path)
  const productSlug = getProductSlugFromPath(path)
  const categorySlug = getCategorySlugFromPath(path)
  const serviceSlug = path.replace(/^\//, '')

  if (productSlug) {
    return <ProductDetailPage params={Promise.resolve({ slug: productSlug })} />
  }

  if (categorySlug) {
    return <CategoryDetailPage params={Promise.resolve({ slug: categorySlug })} />
  }

  if (getServiceBySlug(serviceSlug)) {
    return <ServicesPage serviceSlug={serviceSlug} />
  }

  if (path === blogIndexPath) {
    return <BlogsPage />
  }

  if (blogSlug) {
    return <BlogDetailPage params={Promise.resolve({ slug: blogSlug })} />
  }

  const route = findRouteByPath(routes, path)

  if (!route) notFound()

  const pageKey = getPageKey(route.pageName, route.pageType)

  if (pageKey.includes('about')) return <AboutPage />
  if (pageKey.includes('career')) return <CareerPage />
  if (pageKey.includes('contact')) return <ContactPage />
  if (pageKey.includes('privacy')) return <PrivacyPolicyPage />
  if (pageKey.includes('term')) return <TermsConditionsPage />
  if (pageKey.includes('service') || pageKey.includes('product')) return <ServicesPage />
  if (pageKey.includes('blog') || pageKey.includes('article')) return <BlogsPage />

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        {route.pageType}
      </p>
      <h1 className="mt-3 text-4xl font-bold text-gray-950">{route.pageName}</h1>
      {route.metaDescription ? (
        <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
          {route.metaDescription}
        </p>
      ) : null}
    </section>
  )
}

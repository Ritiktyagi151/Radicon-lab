import type { Metadata } from 'next'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export type PublicSeoRoute = {
  id: string
  pageName: string
  pageType: string
  url: string
  customSlug: string
  path: string
  canonicalUrl: string
  canonicalMode: 'self' | 'custom'
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  openGraph: {
    title?: string
    description?: string
    image?: string
  }
  twitter: {
    title?: string
    description?: string
    image?: string
  }
  robotsIndex: 'index' | 'noindex'
  robotsFollow: 'follow' | 'nofollow'
  schemaType: string
}

const fallbackRoutes: PublicSeoRoute[] = [
  createFallbackRoute('home', 'Home', 'Website', '/'),
  createFallbackRoute('about', 'About', 'WebPage', '/about'),
  createFallbackRoute('services', 'Services', 'Product', '/services'),
  createFallbackRoute('blogs', 'Blogs', 'Article', '/blogs', '/blog'),
  createFallbackRoute('contact', 'Contact', 'ContactPage', '/contact'),
  createFallbackRoute('career', 'Career', 'WebPage', '/career'),
  createFallbackRoute('privacy', 'Privacy Policy', 'WebPage', '/privacy'),
  createFallbackRoute('terms', 'Terms & Conditions', 'WebPage', '/terms'),
]

function createFallbackRoute(
  id: string,
  pageName: string,
  pageType: string,
  path: string,
  publicPath = path,
): PublicSeoRoute {
  return {
    id,
    pageName,
    pageType,
    url: path,
    customSlug: '',
    path: publicPath,
    canonicalUrl: publicPath,
    canonicalMode: 'self',
    metaTitle: pageName,
    metaDescription: '',
    focusKeyword: '',
    openGraph: {},
    twitter: {},
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: pageType,
  }
}

export function normalizePath(value: string) {
  const trimmed = (value || '/').trim()

  if (!trimmed || trimmed === '/') return '/'
  if (trimmed.startsWith('http') || trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed
  }

  const path = trimmed
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    )
    .filter(Boolean)
    .join('/')

  return path ? `/${path}` : '/'
}

export async function getPublicSeoRoutes(): Promise<PublicSeoRoute[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seo-routes`, {
      cache: 'no-store',
    })

    if (!response.ok) throw new Error('Unable to load SEO routes')

    const routes = (await response.json()) as PublicSeoRoute[]
    return routes.length ? routes : fallbackRoutes
  } catch {
    return fallbackRoutes
  }
}

export function resolveHref(routes: PublicSeoRoute[], defaultPath: string) {
  const normalizedDefault = normalizePath(defaultPath)
  const route = routes.find(
    (item) => item.url === normalizedDefault || item.path === normalizedDefault,
  )

  return route?.path || normalizedDefault
}

export function getBlogIndexPath(routes: PublicSeoRoute[]) {
  return resolveHref(routes, '/blogs')
}

export function getBlogDetailPath(routes: PublicSeoRoute[], slug: string) {
  const blogIndexPath = getBlogIndexPath(routes).replace(/\/$/, '').replace(/\/blogs$/, '/blog')
  return `${blogIndexPath || '/blog'}-${normalizePath(slug).replace(/^\//, '')}`
}

export function getBlogSlugFromPath(routes: PublicSeoRoute[], path: string) {
  const normalizedPath = normalizePath(path)
  const blogIndexPath = getBlogIndexPath(routes).replace(/\/$/, '')
  const detailBasePath = blogIndexPath.replace(/\/blogs$/, '/blog')
  const dashedPrefix = `${detailBasePath || '/blog'}-`
  const legacySlashPrefix = `${blogIndexPath || '/blogs'}/`

  if (normalizedPath.startsWith(dashedPrefix)) {
    return normalizedPath.slice(dashedPrefix.length)
  }

  if (normalizedPath.startsWith(legacySlashPrefix)) {
    return normalizedPath.slice(legacySlashPrefix.length)
  }

  return null
}

export function findRouteByPath(routes: PublicSeoRoute[], path: string) {
  const normalizedPath = normalizePath(path)

  return routes.find(
    (route) => route.path === normalizedPath || route.url === normalizedPath,
  )
}

export function getFallbackSeoRoutes() {
  return fallbackRoutes
}

export function buildSeoMetadata(
  routes: PublicSeoRoute[],
  defaultPath: string,
  fallback: {
    title: string
    description: string
  },
): Metadata {
  const route = findRouteByPath(routes, defaultPath)
  const title = route?.metaTitle || route?.pageName || fallback.title
  const description = route?.metaDescription || fallback.description
  const canonical = route?.canonicalUrl || resolveHref(routes, defaultPath)
  const keywords = route?.focusKeyword
    ? route.focusKeyword
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : undefined

  return {
    title,
    description,
    keywords,
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
      title: route?.openGraph?.title || title,
      description: route?.openGraph?.description || description,
      type: 'website',
      url: canonical,
      siteName: 'Radicon Lab',
      images: route?.openGraph?.image ? [{ url: route.openGraph.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: route?.twitter?.title || route?.openGraph?.title || title,
      description: route?.twitter?.description || route?.openGraph?.description || description,
      images: route?.twitter?.image || route?.openGraph?.image ? [route.twitter?.image || route.openGraph?.image || ''] : undefined,
    },
  }
}

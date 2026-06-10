import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AboutPageClient from '@/components/about/AboutPageClient'
import { getAboutPageBySlug, getAboutPages, getAboutPath } from '@/lib/aboutData'
import { buildSeoMetadata, findRouteByPath, getPublicSeoRoutes } from '@/lib/seoRoutes'

type AboutPageProps = {
  pageSlug?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/about', {
    title: 'About Radicon Lab',
    description: 'Learn about Radicon Lab and its pharmaceutical manufacturing capabilities.',
  })
}

export async function generateAboutMetadata(pageSlug = ''): Promise<Metadata> {
  const page = getAboutPageBySlug(pageSlug)

  if (!page) return {}

  const routes = await getPublicSeoRoutes()
  const path = getAboutPath(page.slug)
  const route = findRouteByPath(routes, path)

  if (route) {
    return buildSeoMetadata(routes, path, {
      title: page.title,
      description: page.description,
    })
  }

  return {
    title: `${page.title} | Radicon Lab`,
    description: page.description,
    alternates: {
      canonical: getAboutPath(page.slug),
    },
  }
}

export default function AboutPage({ pageSlug = '' }: AboutPageProps) {
  const pages = getAboutPages()
  const page = getAboutPageBySlug(pageSlug)

  if (!page) notFound()

  return <AboutPageClient pages={pages} page={page} />
}

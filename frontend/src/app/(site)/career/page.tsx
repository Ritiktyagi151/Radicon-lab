import type { Metadata } from 'next'
import CareerPageClient from '@/components/career/CareerPageClient'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/career', {
    title: 'Career at Radicon Lab',
    description:
      'Explore career opportunities at Radicon Laboratories across pharmaceutical manufacturing, quality, production, and business support.',
  })
}

export default function CareerPage() {
  return <CareerPageClient />
}

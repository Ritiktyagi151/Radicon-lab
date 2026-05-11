import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/contact', {
    title: 'Contact Radicon Lab',
    description: 'Contact Radicon Lab for pharmaceutical manufacturing and business inquiries.',
  })
}

export default function ContactPage() {
  return <ContactPageClient />
}

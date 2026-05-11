import type { Metadata } from 'next'
import AboutPage, { generateAboutMetadata } from '@/app/(site)/about/page'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return generateAboutMetadata(slug)
}

export default async function AboutDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <AboutPage pageSlug={slug} />
}

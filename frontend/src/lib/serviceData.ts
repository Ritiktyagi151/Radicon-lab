import services from '@/data/services.json'

export type StaticService = {
  title: string
  slug: string
  excerpt: string
  hero: string
  images: string[]
  points: string[]
  sections?: {
    title: string
    content: string
  }[]
}

export function getServices() {
  return services as StaticService[]
}

export function getServiceBySlug(slug: string) {
  return getServices().find((service) => service.slug === slug) || null
}

export function getServicePath(slug: string) {
  return `/${slug}`
}

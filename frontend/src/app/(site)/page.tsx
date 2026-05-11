import type { Metadata } from 'next'
import { About, BrandsSection, Contact, Features, Hero, MissionSection, RadiconServices,  } from '@/components/home'
import BlogSection from '@/components/home/HomeBlogs'
import HomeScrollSection from '@/components/home/HomeScrollSection'
import ResearchSection from '@/components/home/ResearchSection'
import StatsSection from '@/components/home/StatsSection'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/', {
    title: 'Radicon Lab',
    description: 'Radicon Lab - Your trusted pharmaceutical manufacturing partner.',
  })
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeScrollSection direction="left">
        <About />
      </HomeScrollSection>
      <HomeScrollSection direction="right">
        <Features />
      </HomeScrollSection>
      <HomeScrollSection>
        <StatsSection/>
      </HomeScrollSection>
      <HomeScrollSection>
        <MissionSection />
      </HomeScrollSection>
      <HomeScrollSection direction="left">
        <ResearchSection/>
      </HomeScrollSection>
      <HomeScrollSection direction="right">
        <RadiconServices/>
      </HomeScrollSection>
      <HomeScrollSection>
        <BrandsSection />
      </HomeScrollSection>
      <HomeScrollSection>
        <BlogSection />
      </HomeScrollSection>
      <HomeScrollSection direction="left">
        <Contact />
      </HomeScrollSection>
      
    </>
  )
}

import type { Metadata } from 'next'
import EventPopup from '@/components/event/EventPopup'
import { About, BrandsSection, Contact, Features, Hero, MissionSection, RadiconServices, VideoReelsSection } from '@/components/home'
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
      <EventPopup image="/event/events.png" maxShows={2} reopenDelay={15000} useNextImage={false} />
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
        <VideoReelsSection />
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

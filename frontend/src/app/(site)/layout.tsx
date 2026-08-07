import Footer from '@/components/layout/Footer'
import FloatingContactActions from '@/components/layout/FloatingContactActions'
// import ChatBot from '@/components/chat/ChatBot'
import EventPopup from '@/components/event/EventPopup'
import CookieConsent from '@/components/layout/CookieConsent'
import Navbar from '@/components/layout/Navbar'
import { getPublicSeoRoutes } from '@/lib/seoRoutes'

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const routes = await getPublicSeoRoutes()

  return (
    <>
      <Navbar initialRoutes={routes} />
      <main className="site-wave-bg">{children}</main>
      <Footer initialRoutes={routes} />
      <EventPopup image="/event/events.png" maxShows={2} reopenDelay={15000} useNextImage={false} />
      <FloatingContactActions />
      <CookieConsent />
      {/* <ChatBot /> */}
    </>
  )
}

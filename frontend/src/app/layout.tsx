import type { Metadata } from 'next'
import { Livvic } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const livvic = Livvic({
  variable: '--font-livvic',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiconlab.com'
const gaMeasurementId = 'G-JGSGPQGP20'
const googleSiteVerification = 'aDL7GwjoAZkJmmIejWoHJAkYbM77Zm26y1mqe-fGlJ8'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Radicon Laboratories Ltd',
  url: 'https://www.radiconlab.com',
  logo: 'https://www.radiconlab.com/radicon-logo.png',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91 8796911105',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: 'English',
    },
  ],
  founder: 'Mr. Rakesh Kumar Khaneja',
  foundingDate: '2007',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '108-A Ecotech-XII',
    addressLocality: 'Greater Noida West',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201306',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.facebook.com/people/Radicon-Laboratories-Ltd/61554746195773/',
    'https://www.linkedin.com/company/radicon-laboratories-limited/',
    'https://www.instagram.com/radiconlaboratoriesltd/?igshid=OGQ5ZDc2ODk2ZA%3D%3D',
    'https://twitter.com/radiconlabsltd?t=wHM92aoO5oyHsB25pQJJ5Q&s=09',
    'https://www.youtube.com/@radiconlaboratoriesltd',
  ],
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Radicon Laboratories Ltd',
  legalName: 'Radicon Laboratories Limited',
  url: 'https://www.radiconlab.com/',
  logo: 'https://www.radiconlab.com/radicon-logo.png',
  image: 'https://www.radiconlab.com/radicon-logo.png',
  description:
    'Radicon Laboratories Ltd offers quality Sildenafil, Viagra, Kamagra, and Cenforce tablets. Trusted formulas, safe use, and competitive prices for every customer.',
  foundingDate: '2007',
  telephone: '+91 8796911105',
  email: 'info@radiconlab.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No-1595/8, Ground Floor, Bhagirath Palace, Chandni Chowk, Near Diwan Hall',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110006',
    addressCountry: 'IN',
  },
  branchOf: {
    '@type': 'Organization',
    name: 'Radicon Laboratories Ltd',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Industrial Plot No. 108-A, Ecotech-XII',
      addressLocality: 'Greater Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201306',
      addressCountry: 'IN',
    },
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+91 8796911105',
      email: 'info@radiconlab.com',
    },
  ],
  sameAs: [
    'https://www.facebook.com/people/Radicon-Laboratories-Ltd/61554746195773/',
    'https://www.linkedin.com/company/radicon-laboratories-limited/',
    'https://www.instagram.com/radiconlaboratoriesltd/?igshid=OGQ5ZDc2ODk2ZA%3D%3D',
    'https://twitter.com/radiconlabsltd?t=wHM92aoO5oyHsB25pQJJ5Q&s=09',
    'https://www.youtube.com/@radiconlaboratoriesltd',
  ],
  areaServed: 'IN',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Radicon Lab',
  authors: [{ name: 'Radicon Lab' }],
  creator: 'Radicon Lab',
  publisher: 'Radicon Lab',
  verification: {
    google: googleSiteVerification,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${livvic.className} ${livvic.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MGZSL92D"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  )
}

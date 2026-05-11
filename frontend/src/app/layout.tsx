import type { Metadata } from 'next'
import { Livvic } from 'next/font/google'
import './globals.css'

const livvic = Livvic({
  variable: '--font-livvic',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiconlab.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Radicon Lab',
  authors: [{ name: 'Radicon Lab' }],
  creator: 'Radicon Lab',
  publisher: 'Radicon Lab',
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
        {children}
      </body>
    </html>
  )
}

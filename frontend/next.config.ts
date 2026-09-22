import type { NextConfig } from 'next'

const uploadOrigins = new Set([
  'https://www.radiconlab.com',
  'https://radiconlab.com',
  new URL(process.env.NEXT_PUBLIC_API_URL || 'https://www.radiconlab.com/api').origin,
])

const config: NextConfig = {
  images: {
    remotePatterns: [...uploadOrigins].map((origin) => new URL('/uploads/**', origin)),
  },
}

export default config

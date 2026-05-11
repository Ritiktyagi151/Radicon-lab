/** @type {import('next-sitemap').IConfig} */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://radiconlab.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/seo-routes`)
      if (!response.ok) return []
      const routes = await response.json()

      return routes
        .filter((route) => route.path && route.path !== '/')
        .map((route) => ({
          loc: route.path,
          changefreq: 'weekly',
          priority: route.pageType === 'Website' ? 1 : 0.7,
          lastmod: new Date().toISOString(),
        }))
    } catch {
      return []
    }
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/hr/', '/en/'],
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: [
      'https://foto-designo.com/en/sitemap.xml',
      'https://foto-designo.com/hr/sitemap.xml',
    ],
  }
}

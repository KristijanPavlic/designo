import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://foto-designo.com'

  // Add your dynamic routes here
  const routes = ['', '/']

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.1,
    })),
    ...routes.map((route) => ({
      url: `${baseUrl}/hr`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.9,
    })),
    ...routes.map((route) => ({
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.9,
    })),
  ]
}

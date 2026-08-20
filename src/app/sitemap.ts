import { MetadataRoute } from 'next'

const blogPosts = [
  'splitwise-alternative-australia',
  'split-bills-group-trip',
  'payid-split-bills',
  'housemate-bills',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://easysplit.com.au'
  const staticPages = [
    '', '/features', '/pricing', '/vs-splitwise', '/download',
    '/blog', '/help', '/privacy', '/terms',
  ].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date('2025-05-17'),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const blogPages = blogPosts.map(slug => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date('2025-05-17'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}

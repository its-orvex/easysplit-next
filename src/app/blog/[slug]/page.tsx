import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import AdBanner from '@/components/AdBanner'
import AffiliateBanner from '@/components/AffiliateBanner'
import ReadingProgress from '@/components/marketing/ReadingProgress'

const blogDir = path.join(process.cwd(), 'content/blog')

const categoryEmoji: Record<string, string> = {
  Comparisons: '🌏',
  'Group Travel': '🏝️',
  Tips: '⚡',
  Guides: '📖',
  News: '📣',
}

function getPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { data: data as { title: string; date: string; excerpt: string; category: string; readTime: number; affiliate?: boolean }, content }
}

function getAllSlugs() {
  if (!fs.existsSync(blogDir)) return []
  return fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}

function getRelatedPosts(currentSlug: string) {
  const slugs = getAllSlugs().filter(s => s !== currentSlug)
  return slugs.slice(0, 3).map(slug => {
    const post = getPost(slug)
    return { slug, ...post?.data }
  })
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.data.title,
    description: post.data.excerpt,
  }
}

const affiliateSlugs = ['split-bills-group-trip', 'housemate-bills']

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { data, content } = post
  const relatedPosts = getRelatedPosts(slug)
  const showAffiliate = affiliateSlugs.includes(slug)
  const emoji = categoryEmoji[data.category] ?? '📝'

  const formattedDate = new Date(data.date).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <MarketingNav />

      {/* Hero banner */}
      <div
        className="pt-16 pb-12"
        style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center pt-12">
          <span className="inline-block text-6xl mb-4">{emoji}</span>
          <div className="mb-3">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-[0.2em]">{data.category}</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            {data.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-teal-200">
            <span>EasySplit Team</span>
            <span>·</span>
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{data.readTime} min read</span>
          </div>
          {/* Share buttons */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(`https://easysplit.com.au/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-200 hover:text-white border border-teal-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Share on X
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <article className="flex-1 min-w-0">
              {/* MDX prose */}
              <div
                className="max-w-2xl"
                style={{
                  '--prose-body': '#475569',
                  '--prose-headings': '#0F172A',
                } as React.CSSProperties}
              >
                <style>{`
                  article h1 { font-family: var(--font-sora); font-size: 2.5rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem; margin-top: 2.5rem; line-height: 1.2; }
                  article h2 { font-family: var(--font-plus-jakarta-sans); font-size: 1.75rem; font-weight: 600; color: #0F172A; margin-bottom: 0.75rem; margin-top: 2.5rem; padding-left: 1rem; border-left: 4px solid #1D9E75; line-height: 1.3; }
                  article h3 { font-family: var(--font-plus-jakarta-sans); font-size: 1.375rem; font-weight: 600; color: #0F172A; margin-bottom: 0.5rem; margin-top: 2rem; }
                  article p { font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem; }
                  article ul, article ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
                  article li { font-size: 1.0625rem; line-height: 1.8; color: #475569; margin-bottom: 0.5rem; }
                  article a { color: #1D9E75; text-decoration: none; }
                  article a:hover { text-decoration: underline; }
                  article blockquote { background: #F0FDF8; border-left: 4px solid #1D9E75; border-radius: 0 0.75rem 0.75rem 0; padding: 1.25rem 1.5rem; margin: 2rem 0; font-style: italic; font-size: 1.2rem; color: #0F6E56; }
                  article code { font-family: monospace; background: #F1F5F9; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #1D9E75; }
                  article strong { color: #0F172A; }
                `}</style>
                <MDXRemote source={content} />
              </div>

              {/* Mobile AdBanner */}
              <div className="mt-12 lg:hidden">
                <AdBanner />
              </div>

              {/* CTA box */}
              <div
                className="mt-16 rounded-2xl p-8 text-center text-white"
                style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)' }}
              >
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-sora)' }}>
                  Ready to split bills the easy way?
                </h2>
                <p className="opacity-90 mb-6">Try EasySplit free — no account needed.</p>
                <Link
                  href="/app"
                  className="inline-block bg-white text-teal-600 font-bold rounded-full px-7 py-3.5 hover:bg-teal-50 transition-colors shadow-sm"
                >
                  Try EasySplit free →
                </Link>
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-sora)' }}>
                    More from the blog
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedPosts.map(rp => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all block group"
                      >
                        <span className="text-xs font-semibold text-teal-600">{rp.category}</span>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1 leading-snug group-hover:text-teal-600 transition-colors">
                          {rp.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Table of contents */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">On this page</p>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded-full w-4/5" />
                    <div className="h-3 bg-slate-200 rounded-full w-3/5" />
                    <div className="h-3 bg-slate-200 rounded-full w-4/5" />
                    <div className="h-3 bg-slate-200 rounded-full w-2/3" />
                  </div>
                </div>

                {/* Sidebar CTA */}
                <div
                  className="rounded-2xl p-6 text-center text-white"
                  style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)' }}
                >
                  <p className="font-bold text-sm mb-2">Try EasySplit free</p>
                  <p className="text-xs opacity-80 mb-4">No account needed to get started.</p>
                  <Link
                    href="/app"
                    className="block bg-white text-teal-600 font-bold rounded-full py-2.5 text-sm hover:bg-teal-50 transition-colors"
                  >
                    Open app →
                  </Link>
                </div>

                <AdBanner />
                {showAffiliate && <AffiliateBanner />}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

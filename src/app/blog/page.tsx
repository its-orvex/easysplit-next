import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, guides, and news from the EasySplit team about splitting bills, group travel, and managing shared expenses in Australia.',
}

function getPosts() {
  const blogDir = path.join(process.cwd(), 'content/blog')
  if (!fs.existsSync(blogDir)) return []
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'))
  return files.map(filename => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(blogDir, filename), 'utf8')
    const { data } = matter(raw)
    return { slug, ...(data as { title: string; date: string; excerpt: string; category: string; readTime: number }) }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BlogPage() {
  const posts = getPosts()

  return (
    <div className="min-h-screen">
      <MarketingNav />

      <div className="pt-24 pb-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest">Blog</p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mt-3">
            Tips, guides & news
          </h1>
          <p className="text-xl text-slate-500 mt-4">
            From the EasySplit team — splitting bills, group travel, and life admin in Australia.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 py-16 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-6">
          {posts.length === 0 ? (
            <p className="text-center text-slate-400">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-all block group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                  <span className="text-teal-600 text-sm font-semibold">Read more →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

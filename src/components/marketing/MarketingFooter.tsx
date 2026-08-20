import Link from 'next/link'
import { Divide } from 'lucide-react'

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Teal accent stripe */}
      <div className="h-1 bg-teal-500" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Left: Logo + tagline + newsletter */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center">
                <Divide size={16} className="text-white" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: 'var(--font-sora)' }}>EasySplit</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">Split bills, settle up fairly.</p>
            {/* Newsletter — TODO: wire up to email backend */}
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Stay updated — no spam, just product news</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full px-4 py-2 outline-none focus:border-teal-500 transition-colors placeholder:text-slate-500"
                  aria-label="Email address"
                />
                <button
                  type="button"
                  className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-full px-4 py-2 transition-colors flex-shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Centre: Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center items-start pt-1">
            {[
              { href: '/features', label: 'Features' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/blog', label: 'Blog' },
              { href: '/help', label: 'Help' },
              { href: '/vs-splitwise', label: 'vs Splitwise' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm hover:text-teal-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Country + social */}
          <div className="md:text-right">
            <p className="text-sm text-slate-300 font-medium">Made in Australia 🇦🇺</p>
            <p className="text-xs mt-1 mb-5">Built for groups who actually want to settle up.</p>

            {/* Social links */}
            <div className="flex gap-3 md:justify-end">
              {/* X / Twitter */}
              <a
                href="https://twitter.com/easysplitau"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Twitter / X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 group-hover:text-white transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/easysplit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 group-hover:text-white transition-colors">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2025 EasySplit</span>
          {/* TODO: Fill in ABN once registered */}
          <span>ABN XX XXX XXX XXX</span>
        </div>
      </div>
    </footer>
  )
}

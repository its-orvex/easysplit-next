'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Divide } from 'lucide-react'

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/help', label: 'Help' },
]

export default function MarketingNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
          paddingTop: scrolled ? '8px' : '16px',
          paddingBottom: scrolled ? '8px' : '16px',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg group">
            <div
              className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-[15deg]"
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              <Divide size={16} className="text-white" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: 'var(--font-sora)' }}>EasySplit</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium nav-link-hover transition-colors pb-0.5 ${
                  pathname === link.href
                    ? 'text-teal-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="btn-primary bg-teal-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm"
            >
              Open app
            </Link>
            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
              <Link href="/" className="flex items-center gap-2 font-bold text-slate-900" onClick={() => setOpen(false)}>
                <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Divide size={14} className="text-white" strokeWidth={3} />
                </div>
                <span style={{ fontFamily: 'var(--font-sora)' }}>EasySplit</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium py-3 border-b border-slate-50 transition-colors ${
                    pathname === link.href ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 pb-8">
              <Link
                href="/app"
                onClick={() => setOpen(false)}
                className="block w-full bg-teal-500 hover:bg-teal-600 text-white text-center rounded-full px-4 py-3 font-semibold transition-colors"
              >
                Open app
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

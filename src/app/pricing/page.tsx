'use client'
import Link from 'next/link'
import { useState } from 'react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import ScrollRevealInit from '@/components/marketing/ScrollRevealInit'

const freeFeatures = [
  { text: 'Unlimited trips', premium: false },
  { text: 'Unlimited expenses', premium: false },
  { text: 'Receipt scanning (10/month)', premium: false },
  { text: 'PayID settlements', premium: false },
  { text: 'Invite codes + guest links', premium: false },
  { text: 'Recurring expenses (3 active)', premium: false },
  { text: 'All split modes', premium: false },
]

const premiumFeatures = [
  { text: 'Everything in Free', premium: false },
  { text: 'Unlimited receipt scanning', premium: true },
  { text: 'PDF export', premium: true },
  { text: 'Multi-currency with live FX', premium: true },
  { text: 'Unlimited recurring expenses', premium: true },
  { text: 'Priority support', premium: true },
  { text: 'Early access to new features', premium: true },
]

const faqs = [
  {
    q: 'Is EasySplit really free?',
    a: 'Yes. We don\'t limit your expenses, add ads to the app, or charge for features. The app is fully functional with no usage caps.',
  },
  {
    q: 'How do you make money?',
    a: 'We plan to charge a small fee on transactions settled through EasySplit Pay (coming soon). You only pay when money actually moves — never to track expenses.',
  },
  {
    q: 'Will you add limits later?',
    a: 'No. The free plan is guaranteed free for expense tracking forever. That\'s our commitment.',
  },
]

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 flex-shrink-0">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const monthlyPrice = 4.99
  const yearlyMonthly = 3.25
  const yearlySaving = ((monthlyPrice * 12) - (yearlyMonthly * 12)).toFixed(2)

  return (
    <div className="min-h-screen page-enter">
      <ScrollRevealInit />
      <MarketingNav />

      {/* Hero */}
      <div className="pt-24 pb-16 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Pricing</p>
          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Simple, honest pricing
          </h1>
          <p className="text-xl text-slate-500 mt-4">Free for tracking. Small fee when money moves.</p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold transition-colors ${!yearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setYearly(v => !v)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300"
              style={{ background: yearly ? '#1D9E75' : '#CBD5E1' }}
              aria-label="Toggle billing period"
            >
              <span
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300"
                style={{ left: yearly ? 28 : 4 }}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors ${yearly ? 'text-slate-900' : 'text-slate-400'}`}>
              Yearly
              <span className="ml-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Save 35%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free plan */}
            <div className="reveal pricing-card border-2 border-slate-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>Free</h2>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Current plan</span>
              </div>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>$0</span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">Free forever, no credit card</p>

              <ul className="space-y-3 mb-8">
                {freeFeatures.map(f => (
                  <li key={f.text} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckIcon />
                    {f.text}
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-4 font-semibold transition-colors btn-primary"
              >
                Start for free
              </Link>
            </div>

            {/* Premium plan */}
            <div className="reveal pricing-card border-2 border-teal-500 rounded-2xl p-8 relative" style={{ transitionDelay: '80ms', boxShadow: '0 8px 32px rgba(29,158,117,0.15)' }}>
              {/* Most popular badge */}
              <div className="absolute -top-3.5 right-6">
                <span className="bg-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Most popular</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>Premium</h2>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Coming soon</span>
              </div>

              <div className="mb-1 flex items-baseline gap-1">
                <span
                  className="text-6xl font-black text-teal-600 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-sora)' }}
                >
                  ${yearly ? yearlyMonthly : monthlyPrice}
                </span>
                <span className="text-slate-400 ml-1">/mo</span>
              </div>
              {yearly ? (
                <p className="text-sm font-semibold text-emerald-600 mb-8">
                  You save ${yearlySaving}/year
                </p>
              ) : (
                <p className="text-sm text-teal-600 font-medium mb-8">or $39/year — save 35%</p>
              )}

              <ul className="space-y-3 mb-8">
                {premiumFeatures.map(f => (
                  <li key={f.text} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckIcon />
                    <span>{f.text}</span>
                    {f.premium && (
                      <span className="ml-auto text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 flex-shrink-0">
                        ✨ Premium
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@easysplit.com.au?subject=EasySplit%20Premium%20Waitlist"
                className="block w-full text-center border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-xl py-4 font-semibold transition-colors"
              >
                Join the waitlist
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 text-center mb-12" style={{ fontFamily: 'var(--font-sora)' }}>
            Common questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={q}
                className="reveal bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <h3 className="font-semibold text-slate-900 text-lg mb-3">{q}</h3>
                <p className="text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

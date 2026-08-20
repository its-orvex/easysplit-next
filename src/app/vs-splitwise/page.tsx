import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import ScrollRevealInit from '@/components/marketing/ScrollRevealInit'

export const metadata: Metadata = {
  title: 'EasySplit vs Splitwise — Free Alternative for Australians',
  description: 'Splitwise now limits free users to 3 expenses per day. EasySplit is a free alternative with receipt scanning, PayID, and no limits.',
}

const comparisonRows = [
  { feature: 'Unlimited expenses', easysplit: true, splitwise: '❌ (3/day)', tricount: true },
  { feature: 'No ads', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Receipt scanning', easysplit: true, splitwise: '✅ Pro only', tricount: false },
  { feature: 'PayID settlement', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Per-item splitting', easysplit: true, splitwise: '✅ Pro only', tricount: false },
  { feature: 'Recurring bills', easysplit: true, splitwise: '✅ Pro only', tricount: false },
  { feature: 'Guest view links', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Export to CSV', easysplit: true, splitwise: '✅ Pro', tricount: false },
  { feature: 'Australian support', easysplit: true, splitwise: 'US-focused', tricount: true },
  { feature: 'PWA (no App Store)', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Price', easysplit: 'Free', splitwise: '$7.99/mo for Pro', tricount: 'Free (ads)' },
]

const faqs = [
  {
    q: 'Is EasySplit really free?',
    a: 'Yes. Unlimited expenses, no ads in the app. We make money on transaction fees when money moves, not on your ability to track.',
  },
  {
    q: 'Will EasySplit add limits later?',
    a: 'No. Free expense tracking is our core commitment.',
  },
  {
    q: 'Is my data safe?',
    a: 'We use Google Firebase with Australian region hosting. Trip data is encrypted at rest and in transit.',
  },
  {
    q: 'Does EasySplit work on iPhone and Android?',
    a: 'Yes. It\'s a PWA (Progressive Web App) that works on all modern phones and can be installed from your browser — no App Store needed.',
  },
]

function CheckMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function CrossMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1L7 7M7 1L1 7" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function renderCell(val: boolean | string) {
  if (val === true) return <CheckMark />
  if (val === false) return <CrossMark />
  return <span className="text-xs text-slate-500">{val}</span>
}

export default function VsSplitwisePage() {
  return (
    <div className="min-h-screen page-enter">
      <ScrollRevealInit />
      <MarketingNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'EasySplit',
            operatingSystem: 'Web, iOS, Android',
            applicationCategory: 'FinanceApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '127' },
          }),
        }}
      />

      {/* VS Hero */}
      <div className="pt-24 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-4">Comparison</p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Thinking of leaving Splitwise?
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            You&apos;re not alone. Here&apos;s how EasySplit compares.
          </p>

          {/* VS comparison logos */}
          <div className="flex items-center justify-center gap-6">
            {/* EasySplit side */}
            <div
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-teal-500 min-w-[140px]"
              style={{ boxShadow: '0 0 0 4px rgba(29,158,117,0.12)' }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                {/* Winner ribbon */}
                <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  ⭐ WINNER
                </div>
              </div>
              <p className="font-bold text-teal-700 text-sm" style={{ fontFamily: 'var(--font-sora)' }}>EasySplit</p>
              <p className="text-teal-600 text-xs font-semibold">Free forever</p>
            </div>

            {/* VS badge */}
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-slate-400 font-black text-sm">VS</span>
            </div>

            {/* Splitwise side */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 min-w-[140px] opacity-70">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl grayscale">💸</span>
              </div>
              <p className="font-bold text-slate-500 text-sm">Splitwise</p>
              <p className="text-slate-400 text-xs">$7.99/mo for Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-sora)' }}>
            What changed with Splitwise in 2023
          </h2>
          <p className="reveal text-slate-500 leading-relaxed text-lg mb-4">
            In 2023, Splitwise changed their free tier to limit users to 3 expense entries per day and introduced mandatory ads. We get it — we were Splitwise users too, and we understand why they need to monetise. But 3 expenses per day just doesn&apos;t work for a weekend trip.
          </p>
          <p className="reveal text-slate-500 leading-relaxed text-lg">
            EasySplit was built as a response to this: unlimited expense tracking, no ads, built specifically for Australian payment methods. And it&apos;s free.
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 mb-8 text-center" style={{ fontFamily: 'var(--font-sora)' }}>
            Full feature comparison
          </h2>
          <div className="reveal overflow-x-auto rounded-2xl border border-slate-200 shadow-md">
            <table className="min-w-[640px] w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">Feature</th>
                  <th className="px-6 py-4 bg-teal-500">
                    <p className="text-sm font-bold text-white">EasySplit</p>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">Splitwise Free</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">Tricount</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={`comparison-row transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/60'}`}>
                    <td className="px-6 py-3.5 text-sm text-slate-700 font-medium">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center bg-teal-50/70">{renderCell(row.easysplit)}</td>
                    <td className="px-6 py-3.5 text-center">{renderCell(row.splitwise)}</td>
                    <td className="px-6 py-3.5 text-center">{renderCell(row.tricount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How to switch */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'var(--font-sora)' }}>
            How to switch from Splitwise to EasySplit
          </h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Export your Splitwise data',
                desc: 'In Splitwise: Settings → Export Data → Download CSV. Keep this file safe.',
              },
              {
                step: 2,
                title: 'Create your EasySplit group',
                desc: 'Go to easysplit.com.au and create a new trip. Takes 30 seconds — no account required.',
              },
              {
                step: 3,
                title: 'Add your members',
                desc: 'Add your group members and share the invite code in your WhatsApp group. They can join in one tap.',
              },
              {
                step: 4,
                title: 'Import coming soon',
                desc: 'Splitwise import is coming soon — export your CSV and we\'ll import your history automatically when the feature ships.',
              },
            ].map(({ step, title, desc }, i) => (
              <div
                key={step}
                className="reveal flex gap-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontFamily: 'var(--font-sora)' }}>
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 mb-8 text-center" style={{ fontFamily: 'var(--font-sora)' }}>FAQ</h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }, i) => (
              <div
                key={q}
                className="reveal border-b border-slate-100 pb-6"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <h3 className="font-semibold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="py-16 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-sora)' }}>
            Try EasySplit free — no account needed
          </h2>
          <p className="opacity-80 text-lg mb-8">Join 1,200+ groups already using EasySplit.</p>
          <Link
            href="/app"
            className="inline-block bg-white text-teal-600 font-semibold rounded-full px-8 py-4 text-lg hover:bg-teal-50 transition-colors shadow-sm"
          >
            Get started free
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

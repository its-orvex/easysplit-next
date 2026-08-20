import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Receipt scanning, PayID settlement, smart splitting, recurring bills, invite codes, and the debt minimisation algorithm — all free.',
}

const sections = [
  {
    id: 'receipt-scanning',
    title: 'Scan any receipt in seconds',
    tag: 'Receipt Scanning',
    paras: [
      'Point your camera at any receipt — at a restaurant, supermarket, or pharmacy — and EasySplit automatically extracts the total, merchant name, and date. No typing, no mistakes.',
      'In group dining situations, you can split the receipt by individual items. Everyone selects what they ordered, and the app calculates each person\'s share exactly.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="w-full h-32 bg-teal-50 border-2 border-dashed border-teal-200 rounded-xl flex flex-col items-center justify-center mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-2">
            <div className="w-5 h-4 border-2 border-teal-600 rounded-sm" />
          </div>
          <span className="text-xs text-teal-600 font-medium">Scanning receipt…</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Merchant</span>
            <span className="text-sm font-semibold text-slate-900">The Italiano</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Amount</span>
            <span className="text-sm font-semibold text-slate-900">$147.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Date</span>
            <span className="text-sm font-semibold text-slate-900">15 May 2025</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'payid',
    title: 'Settle up with one tap via PayID',
    tag: 'PayID Settlements',
    paras: [
      'Every Australian bank supports PayID — it\'s the BSB and account number alternative that\'s linked to your phone number or email. EasySplit stores your friends\' PayIDs and pre-fills the exact settlement amount when you tap Pay Now.',
      'Supported banks include CommBank, ANZ, Westpac, NAB, ING, Macquarie, and every other bank on the NPP network — which is all of them.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Settle Up</div>
        <div className="space-y-3 mb-4">
          {[
            { from: 'Alex', to: 'Ben', amount: '$36.88' },
            { from: 'Chloe', to: 'Ben', amount: '$24.15' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
              <div className="w-7 h-7 bg-teal-500 rounded-full" />
              <span className="text-sm font-medium text-slate-700 flex-1">{s.from} → {s.to}</span>
              <span className="text-sm font-bold text-teal-600">{s.amount}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-teal-500 rounded-xl py-3 text-center">
          <span className="text-sm font-semibold text-white">Pay via PayID</span>
        </div>
      </div>
    ),
  },
  {
    id: 'splitting',
    title: 'Split any way you like',
    tag: 'Smart Splitting',
    paras: [
      'Equal split is the default, but EasySplit supports custom amounts, per-item splitting from scanned receipts, and preset splits for recurring situations.',
      'The "driver free" preset automatically excludes one person from fuel costs. You can save your own custom presets for your group.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">How to Split</div>
        <div className="grid grid-cols-4 gap-1 bg-slate-100 rounded-xl p-1 mb-4">
          {['Split all', 'Selected', 'Custom', 'By item'].map((opt, i) => (
            <div key={opt} className={`text-xs font-semibold py-1.5 rounded-lg text-center ${i === 0 ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}>
              {opt}
            </div>
          ))}
        </div>
        <div className="bg-teal-50 rounded-xl px-4 py-3">
          <p className="text-sm text-teal-700">Each of 4 members owes <span className="font-bold">$36.88</span></p>
        </div>
      </div>
    ),
  },
  {
    id: 'recurring',
    title: 'Never forget rent again',
    tag: 'Recurring Bills',
    paras: [
      'Set up any recurring expense — rent, electricity, streaming subscriptions — and EasySplit handles the scheduling. It notifies the group when a bill is due and logs it automatically.',
      'Common presets: monthly rent, weekly groceries, quarterly utilities, annual subscriptions. Set the due date once, forget about it.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Recurring Bills</div>
        <div className="space-y-3">
          {[
            { name: 'Monthly Rent', amount: '$2,400', next: 'Due 1 Jun' },
            { name: 'Electricity', amount: '$180', next: 'Due 15 Jun' },
            { name: 'Netflix', amount: '$22.99', next: 'Due 20 Jun' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 border border-slate-100 rounded-xl px-4 py-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-400">{item.next}</p>
              </div>
              <span className="text-sm font-semibold text-slate-700">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'invites',
    title: 'Join a trip without downloading anything',
    tag: 'Invite System',
    paras: [
      'Every trip has a unique join code and QR code. Share it in a WhatsApp group and friends tap the link to join — no account creation, no app download.',
      'Guest view links let anyone check the current balances in a browser, even if they never joined. Perfect for people who want to see what they owe without using the app.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Join Trip</div>
        <div className="w-24 h-24 bg-slate-100 rounded-xl mx-auto mb-4 grid grid-cols-4 gap-px p-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-white'}`} />
          ))}
        </div>
        <p className="text-sm font-mono font-bold text-slate-900 tracking-widest mb-1">BALI25</p>
        <p className="text-xs text-slate-400">Scan or share code</p>
      </div>
    ),
  },
  {
    id: 'algorithm',
    title: 'The minimum number of payments',
    tag: 'Settlement Algorithm',
    paras: [
      'Most apps calculate who owes what directly — 5 people means potentially 10 different transfers. EasySplit uses a debt consolidation algorithm to find the minimum number of transfers that settles everyone up.',
      'With 10 people, you typically need 3-4 transfers instead of 9. Less hassle, fewer bank notifications, same result.',
    ],
    visual: (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-3xl font-black text-red-400">9</p>
            <p className="text-xs text-slate-400">transfers (old way)</p>
          </div>
          <div className="text-2xl text-slate-300">→</div>
          <div className="text-center">
            <p className="text-3xl font-black text-teal-500">3</p>
            <p className="text-xs text-slate-400">transfers (EasySplit)</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center">For 10 people, same result, far less hassle.</p>
      </div>
    ),
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      <div className="pt-24 pb-16 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Every feature you need. Nothing you don&apos;t.
          </h1>
          <p className="text-xl text-slate-500 mt-6 leading-relaxed">
            EasySplit is built for real Australians doing real group trips and shared living.
          </p>
          <Link
            href="/app"
            className="inline-block mt-8 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-4 text-lg font-semibold transition-colors"
          >
            Try it free
          </Link>
        </div>
      </div>

      <div className="bg-white pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-24">
            {sections.map((section, i) => (
              <div
                key={section.id}
                id={section.id}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
                    {section.tag}
                  </span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-5">{section.title}</h2>
                  {section.paras.map((para, j) => (
                    <p key={j} className="text-slate-500 leading-relaxed text-lg mb-4">{para}</p>
                  ))}
                </div>
                <div className="flex-1 max-w-sm w-full">{section.visual}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-teal-600 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">All of this, completely free</h2>
          <p className="opacity-80 text-lg mb-8">No limits, no ads, no premium paywalls on core features.</p>
          <Link
            href="/app"
            className="inline-block bg-white text-teal-600 font-semibold rounded-full px-8 py-4 text-lg hover:bg-teal-50 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

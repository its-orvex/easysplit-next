'use client'

import { useState } from 'react'
import { Mail, Users } from 'lucide-react'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import ScrollRevealInit from '@/components/marketing/ScrollRevealInit'

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left py-5 flex justify-between items-center font-semibold text-[17px] transition-colors ${open ? 'text-teal-600' : 'text-slate-900 hover:text-teal-600'}`}
      >
        {q}
        <span
          className="w-7 h-7 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300 text-teal-600 font-bold text-lg"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <p className="pb-5 text-slate-600 leading-relaxed text-base">{a}</p>
      </div>
    </div>
  )
}

const sections = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'How do I create a trip?',
        a: 'Tap "New Trip" from the home screen, give it a name, and you\'re set. Your trip gets a unique code you can share.',
      },
      {
        q: 'How do I invite friends?',
        a: 'Share the invite code or QR code from the trip page. Friends can join by tapping your link — no account needed.',
      },
      {
        q: 'Does everyone need to download the app?',
        a: 'No. Friends can view balances and join trips via a browser link without installing anything.',
      },
      {
        q: 'Can I use it without an account?',
        a: 'Yes for most features. An account lets you sync across devices and access your trips from a new phone.',
      },
    ],
  },
  {
    title: 'Splitting expenses',
    items: [
      {
        q: 'How does per-item splitting work?',
        a: 'When adding an expense from a scanned receipt, you can assign individual items to each person. Everyone pays for exactly what they ordered.',
      },
      {
        q: 'What is the "driver free" preset?',
        a: 'A split mode that automatically excludes one person from fuel costs. Useful for road trips where the driver paid for petrol.',
      },
      {
        q: 'How does receipt scanning work?',
        a: 'Take a photo of any receipt. The app uses AI to extract the total, merchant, and line items. Review and confirm before logging.',
      },
      {
        q: 'What currencies are supported?',
        a: 'AUD is the default. USD, EUR, GBP, and other major currencies are supported with manual exchange rate entry. Live FX is coming in Premium.',
      },
    ],
  },
  {
    title: 'Settling up',
    items: [
      {
        q: 'How does PayID settlement work?',
        a: 'Each person saves their PayID (usually their phone number or email). When you tap Pay Now, your banking app opens with the exact amount pre-filled.',
      },
      {
        q: 'Which banks support one-tap payment?',
        a: 'All Australian banks on the NPP network, which includes CommBank, ANZ, Westpac, NAB, ING, Macquarie, Bendigo, and many more.',
      },
      {
        q: 'How do I mark a payment as settled?',
        a: 'After transferring money, tap Mark as Settled in the app. The other person can confirm receipt.',
      },
      {
        q: 'What is the settlement algorithm?',
        a: 'An algorithm that finds the minimum number of transfers to settle all debts in a group. Reduces transfers by consolidating debts.',
      },
    ],
  },
  {
    title: 'Account and data',
    items: [
      {
        q: 'Is my data private?',
        a: 'Your trip data is private to your group. We never sell data or use it for advertising. See our Privacy Policy for details.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Delete Account. This permanently deletes all your trips and data.',
      },
      {
        q: 'Can I export my trip data?',
        a: 'CSV export is available from each trip\'s settings menu. Premium will add PDF export with formatted summaries.',
      },
      {
        q: 'Is EasySplit free forever?',
        a: 'Expense tracking is free forever, no exceptions. We may add paid premium features, but the core app stays free.',
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen page-enter">
      <ScrollRevealInit />
      <MarketingNav />

      <div className="pt-24 pb-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Help Centre</p>
          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Help & FAQ
          </h1>
          <p className="text-xl text-slate-500 mt-4">
            Answers to common questions about EasySplit.
          </p>
        </div>
      </div>

      <div className="bg-white pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {sections.map((section, si) => (
            <div key={section.title} className="reveal mb-12" style={{ transitionDelay: `${si * 60}ms` }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
                {section.title}
              </h2>
              <div>
                {section.items.map(item => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="reveal text-3xl font-bold text-slate-900 text-center mb-3" style={{ fontFamily: 'var(--font-sora)' }}>
            Still stuck?
          </h2>
          <p className="reveal text-slate-500 text-center mb-10">We&apos;re happy to help.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="reveal bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <Mail size={22} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Email us</h3>
              <a href="mailto:help@easysplit.com.au" className="text-teal-600 font-medium text-sm hover:underline mb-2">
                help@easysplit.com.au
              </a>
              <p className="text-slate-400 text-xs">We reply within 24 hours</p>
            </div>

            {/* Community */}
            <div className="reveal bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center" style={{ transitionDelay: '80ms' }}>
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <Users size={22} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Join the community</h3>
              <p className="text-teal-600 font-medium text-sm mb-2">r/easysplit</p>
              <p className="text-slate-400 text-xs">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

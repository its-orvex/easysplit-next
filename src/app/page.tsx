'use client'
import Link from 'next/link'
import { Camera, Zap, Calculator, RefreshCw, Users, QrCode, ArrowRight, Check } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import { useEffect, useRef, useState } from 'react'

/* ─── Data ───────────────────────────────────────────────────── */

const features = [
  {
    icon: Camera,
    title: 'Scan any receipt',
    desc: 'Take a photo of a receipt and the app fills in the amount, merchant, and even the individual items. Works on any phone camera.',
  },
  {
    icon: Zap,
    title: 'Settle up via PayID',
    desc: 'Store everyone\'s PayID once. One tap opens your banking app with the amount pre-filled. No more manual transfers.',
  },
  {
    icon: Calculator,
    title: 'Minimum transfers',
    desc: 'Our algorithm finds the fewest possible payments to settle everyone up. 10 people, 3 transfers. Not 9.',
  },
  {
    icon: RefreshCw,
    title: 'Recurring bills',
    desc: 'Set up rent, electricity, and Netflix once. The app reminds you when they\'re due and logs them automatically.',
  },
  {
    icon: Users,
    title: 'No forced sign-ups',
    desc: 'Share a link. Friends see the balances in their browser without downloading anything or creating an account.',
  },
  {
    icon: QrCode,
    title: 'Invite by QR code',
    desc: 'Generate a QR code anyone can scan to join your trip instantly. No link-sharing needed.',
  },
]

const comparisonRows = [
  { feature: 'Unlimited expenses', easysplit: true, splitwise: '3/day limit', tricount: true },
  { feature: 'No ads', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Receipt scanning', easysplit: true, splitwise: 'Pro only', tricount: false },
  { feature: 'PayID settlement', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Per-item splitting', easysplit: true, splitwise: 'Pro only', tricount: false },
  { feature: 'Recurring bills', easysplit: true, splitwise: 'Pro only', tricount: false },
  { feature: 'Guest view links', easysplit: true, splitwise: false, tricount: false },
  { feature: 'Price', easysplit: 'Free', splitwise: '$7.99/mo', tricount: 'Free (ads)' },
]

const blogPosts = [
  {
    slug: 'splitwise-alternative-australia',
    title: 'Splitwise Added Daily Limits — Here Are the Best Free Alternatives',
    date: '1 May 2025',
    category: 'Comparisons',
    excerpt: 'Splitwise\'s free tier now caps you at 3 expenses per day. Here are the five best alternatives for Australians.',
    emoji: '🌏',
    color: '#1D9E75',
  },
  {
    slug: 'split-bills-group-trip',
    title: 'How to Split Bills Fairly on a Group Trip to Bali',
    date: '8 May 2025',
    category: 'Group Travel',
    excerpt: 'Group trips are brilliant until the money conversation starts. Here\'s a practical guide to splitting bills fairly.',
    emoji: '🏝️',
    color: '#F59E0B',
  },
  {
    slug: 'payid-split-bills',
    title: 'How to Use PayID to Split Bills Instantly in Australia',
    date: '15 May 2025',
    category: 'Tips',
    excerpt: 'PayID is the fastest way to transfer money between Australians. Here\'s how EasySplit uses it to make settling up one tap.',
    emoji: '⚡',
    color: '#6366F1',
  },
]

/* ─── Stat counter ───────────────────────────────────────────── */

function StatCard({ number, suffix, label }: { number: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = Date.now()
          const duration = 1800
          const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1)
            const e = 1 - Math.pow(1 - p, 3)
            setCount(Math.round(e * number))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [number])

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 border-t-[3px] border-teal-500 shadow-sm text-center">
      <p className="text-4xl font-black text-teal-600" style={{ fontFamily: 'var(--font-sora)' }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-500 text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

/* ─── Comparison table helpers ───────────────────────────────── */

function CheckMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function CrossMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1L7 7M7 1L1 7" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </span>
  )
}

function ProBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
      {text}
    </span>
  )
}

function renderCell(val: boolean | string) {
  if (val === true) return <CheckMark />
  if (val === false) return <CrossMark />
  if (typeof val === 'string' && val.includes('only')) return <ProBadge text={val} />
  if (typeof val === 'string' && val.includes('limit')) return <ProBadge text={val} />
  return <span className="text-sm font-semibold text-slate-700">{val}</span>
}

/* ─── Landing page ───────────────────────────────────────────── */

export default function LandingPage() {
  const [activeScreen, setActiveScreen] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActiveScreen(p => (p + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="min-h-screen page-enter">
      <MarketingNav />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 bg-white overflow-hidden">
        {/* Subtle teal glow */}
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-50 opacity-60 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-4 py-1.5 text-sm font-medium mb-8 animate-fade-in">
                <span className="text-teal-500">✦</span>
                Built for Australia
              </div>

              <h1 className="font-sora text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6 animate-fade-up animation-delay-100">
                Split bills<br />
                <span className="text-teal-600">without the</span><br />
                awkwardness
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 animate-fade-up animation-delay-200">
                The free Australian bill-splitting app with receipt scanning, PayID settlements, and zero daily limits.
              </p>

              <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start animate-fade-up animation-delay-300">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-600 font-semibold px-8 py-4 rounded-full transition-all duration-200"
                >
                  See how it works
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-slate-500 justify-center lg:justify-start animate-fade-up animation-delay-400">
                {['No daily limits', 'No credit card', 'Free forever'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-teal-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — phone */}
            <div className="flex justify-center lg:justify-end animate-slide-right animation-delay-200">
              <div className="relative" style={{ width: 280 }}>

                {/* Floating card — top right */}
                <div className="absolute -right-4 top-14 bg-white rounded-xl shadow-lg border border-slate-100 border-l-4 border-l-teal-500 px-3 py-2 text-xs w-40 z-20 hidden lg:block animate-fade-in animation-delay-500 animate-float">
                  <p className="font-semibold text-slate-800">Receipt scanned ✓</p>
                  <p className="text-slate-400">$147.50 · The Italiano</p>
                </div>

                {/* Floating card — bottom left */}
                <div className="absolute -left-4 bottom-28 bg-white rounded-xl shadow-lg border border-slate-100 border-l-4 border-l-amber-400 px-3 py-2 text-xs w-36 z-20 hidden lg:block animate-fade-in animation-delay-700 animate-float animation-delay-500">
                  <p className="font-semibold text-slate-800">⚡ 3 transfers</p>
                  <p className="text-slate-400">to settle up</p>
                </div>

                {/* iPhone shell */}
                <div className="relative bg-slate-900 rounded-[44px] p-[10px]" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08) inset' }}>
                  {/* Side buttons */}
                  <div className="absolute left-[-3px] top-[110px] w-[3px] h-8 bg-slate-700 rounded-l-full" />
                  <div className="absolute left-[-3px] top-[155px] w-[3px] h-8 bg-slate-700 rounded-l-full" />
                  <div className="absolute right-[-3px] top-[140px] w-[3px] h-14 bg-slate-700 rounded-r-full" />

                  {/* Screen */}
                  <div className="bg-white rounded-[36px] overflow-hidden relative" style={{ height: 540 }}>
                    {/* Dynamic Island */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 100, height: 28 }} />

                    {/* Screen content with fade transition */}
                    <div key={activeScreen} className="animate-fade-in h-full">

                      {/* Screen 0 — Trip view */}
                      {activeScreen === 0 && (
                        <div className="flex flex-col h-full">
                          <div className="px-5 pt-12 pb-2 flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-900">9:41</span>
                            <div className="flex gap-px items-end">
                              {[3,5,7,9].map((h,i) => <div key={i} className="w-0.5 bg-teal-500 rounded-sm" style={{height:h}} />)}
                            </div>
                          </div>
                          <div className="px-4 pb-3 border-b border-slate-100 flex justify-between items-start">
                            <div>
                              <p className="text-[11px] text-slate-400">← Back</p>
                              <h3 className="font-bold text-slate-900 text-sm">Bali 2025</h3>
                            </div>
                            <div className="bg-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">+ Add</div>
                          </div>
                          <div className="flex gap-1.5 px-4 py-2.5">
                            {[{l:'A',c:'#1D9E75'},{l:'F',c:'#F59E0B'},{l:'J',c:'#6366F1'},{l:'V',c:'#EC4899'}].map(({l,c}) => (
                              <div key={l} className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{background:c}}>{l}</div>
                            ))}
                          </div>
                          <div className="px-4 flex-1">
                            {[
                              {emoji:'✈️',name:'Flights',who:'Amy',amount:'$1,840'},
                              {emoji:'🏠',name:'Villa Seminyak',who:'Fad',amount:'$3,200'},
                              {emoji:'🍜',name:'Dinner at Ku De Ta',who:'Josh',amount:'$284'},
                            ].map(({emoji,name,who,amount}) => (
                              <div key={name} className="flex items-center justify-between py-2.5 border-b border-slate-50">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">{emoji}</div>
                                  <div>
                                    <p className="text-[11px] font-semibold text-slate-800">{name}</p>
                                    <p className="text-[10px] text-slate-400">{who} paid · Split 4 ways</p>
                                  </div>
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">{amount}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 flex mt-auto">
                            <div className="flex-1 py-3 text-center text-[10px] font-semibold text-teal-600 border-t-2 border-teal-500">Expenses</div>
                            <div className="flex-1 py-3 text-center text-[10px] text-slate-400">Balances</div>
                          </div>
                        </div>
                      )}

                      {/* Screen 1 — Receipt scan */}
                      {activeScreen === 1 && (
                        <div className="flex flex-col h-full">
                          <div className="px-5 pt-12 pb-2 flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-900">9:41</span>
                            <div className="flex gap-px items-end">
                              {[3,5,7,9].map((h,i) => <div key={i} className="w-0.5 bg-teal-500 rounded-sm" style={{height:h}} />)}
                            </div>
                          </div>
                          <div className="px-4 pt-2 pb-3 border-b border-slate-100">
                            <p className="text-[11px] text-slate-400">← Add Expense</p>
                            <h3 className="font-bold text-slate-900 text-sm">Scan Receipt</h3>
                          </div>
                          <div className="mx-4 mt-3 border-2 border-dashed border-teal-300 rounded-xl bg-teal-50 flex flex-col items-center justify-center py-5">
                            <div className="text-2xl mb-1">📷</div>
                            <p className="text-xs font-semibold text-teal-700">Receipt scanned ✓</p>
                            <p className="text-xs text-teal-500">The Italiano</p>
                          </div>
                          <div className="px-4 mt-3 space-y-2">
                            <div className="bg-slate-50 rounded-lg px-3 py-2">
                              <p className="text-[10px] text-slate-400">Merchant</p>
                              <p className="text-xs font-semibold text-slate-900">The Italiano</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg px-3 py-2">
                              <p className="text-[10px] text-slate-400">Amount</p>
                              <p className="text-xs font-semibold text-teal-700">$147.50</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg px-3 py-2">
                              <p className="text-[10px] text-slate-400">Split 4 ways</p>
                              <p className="text-xs font-semibold text-slate-900">$36.88 each</p>
                            </div>
                          </div>
                          <div className="mx-4 mt-3 bg-teal-600 text-white text-xs font-semibold text-center py-2.5 rounded-xl">
                            Log Expense
                          </div>
                        </div>
                      )}

                      {/* Screen 2 — Balances */}
                      {activeScreen === 2 && (
                        <div className="flex flex-col h-full">
                          <div className="px-5 pt-12 pb-2 flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-900">9:41</span>
                            <div className="flex gap-px items-end">
                              {[3,5,7,9].map((h,i) => <div key={i} className="w-0.5 bg-teal-500 rounded-sm" style={{height:h}} />)}
                            </div>
                          </div>
                          <div className="px-4 pt-2 pb-0 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm mb-2">Bali 2025</h3>
                            <div className="flex gap-4">
                              <p className="text-[10px] text-slate-400 pb-2">Expenses</p>
                              <p className="text-[10px] font-semibold text-teal-600 pb-2 border-b-2 border-teal-600">Balances</p>
                            </div>
                          </div>
                          <div className="px-4 mt-2">
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Net balances</p>
                            {[
                              {name:'Amy',amount:'+$342.50',color:'text-teal-600'},
                              {name:'Fad',amount:'-$198.00',color:'text-red-500'},
                              {name:'Josh',amount:'-$89.25',color:'text-red-500'},
                              {name:'Viv',amount:'-$55.25',color:'text-red-500'},
                            ].map((m,i) => (
                              <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-50">
                                <span className="text-xs font-medium text-slate-700">{m.name}</span>
                                <span className={`text-xs font-bold ${m.color}`}>{m.amount}</span>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 mt-3">
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Settle up — 3 transfers</p>
                            <div className="bg-teal-600 text-white text-xs font-semibold text-center py-2.5 rounded-xl">
                              ⚡ Pay Now via PayID
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Screen indicator dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {[0,1,2].map(i => (
                    <button
                      key={i}
                      onClick={() => setActiveScreen(i)}
                      className={`rounded-full transition-all duration-300 ${activeScreen === i ? 'w-6 h-2 bg-teal-600' : 'w-2 h-2 bg-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard number={1200} suffix="+" label="Groups created" />
            <StatCard number={8400} suffix="+" label="Expenses logged" />
            <StatCard number={340} suffix="K+" label="Settled to date" />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Features</p>
            <h2
              className="text-4xl sm:text-5xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              Everything Splitwise should have been
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
              Built from scratch for Australians, with the payment methods and features that actually matter here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group feature-card bg-white border border-slate-100 rounded-2xl p-7 cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="feature-icon w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
              Three steps to settled
            </h2>
          </div>

          {/* 3-column step cards with connectors */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">

            {/* Step 1 */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</div>
                <h3 className="font-bold text-slate-900 text-lg">Create a trip</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Add your trip name and invite everyone with a code or QR code. They join in one tap — no app download required.
              </p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Join Bali 2025</div>
                <div className="bg-teal-50 rounded-xl p-3 text-center mb-3 border border-teal-100">
                  <p className="text-xs text-teal-600 font-medium mb-1">Invite code</p>
                  <p className="text-xl font-black text-teal-700 tracking-widest" style={{ fontFamily: 'var(--font-sora)' }}>BALI25</p>
                </div>
                <div className="grid grid-cols-8 gap-0.5 w-20 mx-auto mb-3">
                  {[1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,0,1,1,0,0,1,0,1,1,0,1,0,1,1,0,0,0,1,0,1,0,1,1,0].map((on, i) => (
                    <div key={i} className="w-2 h-2 rounded-sm" style={{ background: on ? '#0F172A' : 'transparent' }} />
                  ))}
                </div>
                <p className="text-xs text-slate-400 text-center mb-2">4 members joined</p>
                <div className="flex justify-center gap-1.5">
                  {['A','F','J','V'].map((l, idx) => (
                    <div key={l} className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                      style={{ background: ['#1D9E75','#F59E0B','#6366F1','#EC4899'][idx] }}>{l}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connector 1→2 */}
            <div className="hidden md:flex items-center justify-center px-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className="w-8 border-t-2 border-dashed border-teal-200" />
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M1 1L7 6L1 11" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</div>
                <h3 className="font-bold text-slate-900 text-lg">Log expenses as you go</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Anyone in the group can add expenses. Scan receipts with your camera, split by item, or just enter the total.
              </p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Add Expense</div>
                <div className="bg-teal-50 border-2 border-dashed border-teal-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 mb-3">
                  <Camera size={22} className="text-teal-500" />
                  <span className="text-xs font-semibold text-teal-700">📷 Tap to scan receipt</span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-8 bg-white border border-slate-200 rounded-lg" />
                  <div className="h-8 bg-white border border-slate-200 rounded-lg w-3/4" />
                </div>
                <div className="bg-teal-500 rounded-xl py-2 text-center">
                  <span className="text-xs font-bold text-white">Log Expense</span>
                </div>
              </div>
            </div>

            {/* Connector 2→3 */}
            <div className="hidden md:flex items-center justify-center px-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className="w-8 border-t-2 border-dashed border-teal-200" />
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M1 1L7 6L1 11" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</div>
                <h3 className="font-bold text-slate-900 text-lg">Settle up in seconds</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                See exactly who owes what. Tap Pay Now to open your banking app with the amount pre-filled via PayID. Done.
              </p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Settle Up</div>
                <div className="space-y-2 mb-3">
                  {[
                    { f: 'F', t: 'A', amount: '$198.00' },
                    { f: 'J', t: 'A', amount: '$89.25' },
                  ].map(({ f, t, amount }) => (
                    <div key={f} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">{f}</div>
                      <span className="text-slate-300 text-xs">→</span>
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center">{t}</div>
                      <span className="flex-1 text-xs font-semibold text-slate-700">{amount}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-teal-500 rounded-xl py-2 text-center mb-2">
                  <span className="text-xs font-bold text-white">Pay Now via PayID ⚡</span>
                </div>
                <div className="flex gap-1.5 justify-center">
                  {[{l:'CBA',bg:'#F5A623'},{l:'ANZ',bg:'#007BBF'},{l:'WBC',bg:'#D5002B'},{l:'NAB',bg:'#E11D48'}].map(({l,bg}) => (
                    <div key={l} className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{background:bg}}>{l}</div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Comparison</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
              Why Australians are switching from Splitwise
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">A feature-by-feature comparison of the most popular options.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-md">
            <table className="min-w-[600px] w-full border-collapse">
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
                    <td className="px-6 py-3.5 text-center text-slate-500">{renderCell(row.splitwise)}</td>
                    <td className="px-6 py-3.5 text-center text-slate-500">{renderCell(row.tricount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-400 mt-6 text-center max-w-xl mx-auto">
            EasySplit is free forever. We make money when you use PayID to settle up — a small fee on transactions, never on your ability to track expenses.
          </p>
        </div>
      </section>

      {/* ── Download / Install (LIGHT) ────────────────────────── */}
      <section className="py-24" style={{ background: '#F0FDF8' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Install</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
              Add EasySplit to your home screen
            </h2>
            <p className="text-lg text-slate-500 mt-4">No App Store needed. Installs directly from your browser in two taps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {/* iPhone */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl">🍎</div>
                <h3 className="font-bold text-xl text-slate-900">iPhone</h3>
              </div>
              <ol className="space-y-3">
                {[
                  'Open easysplit.com.au in Safari',
                  'Tap the Share button (box with arrow)',
                  'Tap "Add to Home Screen"',
                  'Tap Add',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Android */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100" style={{ transitionDelay: '80ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl">🤖</div>
                <h3 className="font-bold text-xl text-slate-900">Android</h3>
              </div>
              <ol className="space-y-3">
                {[
                  'Open easysplit.com.au in Chrome',
                  'Tap the menu (three dots)',
                  'Tap "Add to Home Screen"',
                  'Tap Add',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400 mb-4">Or use it in your browser — no install required</p>
            <Link
              href="/app"
              className="btn-primary inline-flex items-center gap-2 bg-teal-500 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-md"
            >
              Open EasySplit <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ──────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">Blog</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
              From the EasySplit blog
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 block group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Emoji banner */}
                <div
                  className="h-28 flex items-center justify-center text-5xl"
                  style={{ background: post.color, opacity: 0.9 }}
                >
                  {post.emoji}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{post.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="text-teal-600 text-sm font-semibold">
                    Read more <span className="read-more-arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors inline-flex items-center gap-1"
            >
              View all posts <span className="read-more-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'

const SCREEN_COUNT = 3
const INTERVAL_MS = 3200

/* ─── Individual screen components ─────────────────────────── */

function Screen1() {
  return (
    <div className="w-full flex-shrink-0 h-full flex flex-col bg-white">
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-[10px] font-semibold text-slate-900">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="flex gap-px items-end">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} className="w-0.5 bg-teal-500 rounded-sm" style={{ height: h }} />
            ))}
          </div>
          <div className="w-3.5 h-2.5 border border-slate-700 rounded-sm ml-1 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-px h-1.5 bg-slate-700 rounded-r-sm" />
            <div className="m-px h-full bg-teal-500 rounded-sm w-3/4" />
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
        <div>
          <p className="text-[11px] text-slate-400">← Back</p>
          <p className="text-sm font-bold text-slate-900">Bali 2025</p>
        </div>
        <div className="bg-teal-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full">+ Add</div>
      </div>
      {/* Member chips */}
      <div className="flex gap-1.5 px-4 py-2 overflow-x-auto">
        {[
          { l: 'A', bg: '#1D9E75' },
          { l: 'F', bg: '#F59E0B' },
          { l: 'J', bg: '#6366F1' },
          { l: 'V', bg: '#EC4899' },
        ].map(({ l, bg }) => (
          <div
            key={l}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: bg }}
          >
            {l}
          </div>
        ))}
      </div>
      {/* Expense cards */}
      <div className="flex flex-col gap-2 px-4 pb-2 overflow-y-auto flex-1">
        {[
          { emoji: '✈️', name: 'Flights', amount: '$1,840', who: 'Amy paid' },
          { emoji: '🏠', name: 'Villa Seminyak', amount: '$3,200', who: 'Fad paid' },
          { emoji: '🍜', name: 'Dinner at Ku De Ta', amount: '$284', who: 'Josh paid' },
        ].map(({ emoji, name, amount, who }) => (
          <div key={name} className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100">
            <span className="text-base leading-none">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-900 truncate">{name}</p>
              <p className="text-[9px] text-slate-400">{who} · Split 4 ways</p>
            </div>
            <span className="text-[11px] font-bold text-slate-900 flex-shrink-0">{amount}</span>
          </div>
        ))}
      </div>
      {/* Tab bar */}
      <div className="flex border-t border-slate-100 mt-auto">
        <button className="flex-1 py-2 text-[9px] font-semibold text-teal-600 border-t-2 border-teal-500">Expenses</button>
        <button className="flex-1 py-2 text-[9px] font-medium text-slate-400">Balances</button>
      </div>
    </div>
  )
}

function Screen2({ active }: { active: boolean }) {
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState(0)
  const fullMerchant = 'The Italiano'
  const targetAmount = 147.50

  useEffect(() => {
    if (!active) { setMerchant(''); setAmount(0); return }
    let idx = 0
    const t1 = setInterval(() => {
      idx++
      setMerchant(fullMerchant.slice(0, idx))
      if (idx >= fullMerchant.length) clearInterval(t1)
    }, 80)

    let val = 0
    const t2 = setInterval(() => {
      val = Math.min(val + 4.9, targetAmount)
      setAmount(parseFloat(val.toFixed(2)))
      if (val >= targetAmount) clearInterval(t2)
    }, 40)

    return () => { clearInterval(t1); clearInterval(t2) }
  }, [active])

  return (
    <div className="w-full flex-shrink-0 h-full flex flex-col bg-white">
      <div className="flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-[10px] font-semibold text-slate-900">9:41</span>
        <div className="w-3.5 h-2.5 border border-slate-700 rounded-sm relative">
          <div className="m-px h-full bg-teal-500 rounded-sm w-3/4" />
        </div>
      </div>
      <div className="px-4 py-2 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-900">Add Expense</p>
      </div>
      {/* Scan area */}
      <div className="mx-4 mt-3">
        <div className="bg-teal-50 border-2 border-dashed border-teal-300 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
          <span className="text-lg">📷</span>
          <p className="text-[10px] font-semibold text-teal-700">Receipt scanned ✓</p>
        </div>
      </div>
      {/* Auto-filling form */}
      <div className="mx-4 mt-3 space-y-2">
        <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
          <p className="text-[8px] text-slate-400 uppercase tracking-wide">Merchant</p>
          <p className="text-[11px] font-semibold text-slate-900 min-h-[14px]">
            {merchant}{active && merchant.length < fullMerchant.length ? <span className="animate-pulse">|</span> : ''}
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
          <p className="text-[8px] text-slate-400 uppercase tracking-wide">Amount</p>
          <p className="text-[11px] font-bold text-slate-900">${amount.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
            <p className="text-[8px] text-slate-400 uppercase tracking-wide">Category</p>
            <p className="text-[10px] font-semibold text-slate-900">Food & Drink</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
            <p className="text-[8px] text-slate-400 uppercase tracking-wide">Date</p>
            <p className="text-[10px] font-semibold text-slate-900">15 May 2025</p>
          </div>
        </div>
      </div>
      {/* Split */}
      <div className="mx-4 mt-2">
        <div className="bg-teal-50 rounded-lg px-3 py-1.5 border border-teal-100">
          <p className="text-[10px] font-semibold text-teal-800">Split 4 ways · $36.88 each</p>
          <div className="flex gap-1 mt-1">
            {['A', 'F', 'J', 'V'].map((l) => (
              <div key={l} className="w-5 h-5 rounded-full bg-teal-600 text-white text-[8px] font-bold flex items-center justify-center">{l}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-4 mt-2">
        <div className="bg-teal-500 rounded-xl py-2.5 text-center">
          <p className="text-[11px] font-bold text-white">Log Expense</p>
        </div>
      </div>
    </div>
  )
}

function Screen3({ active }: { active: boolean }) {
  const targets = { amy: 342.50, fad: -198.00, josh: -89.25, viv: -55.25 }
  const [vals, setVals] = useState({ amy: 0, fad: 0, josh: 0, viv: 0 })

  useEffect(() => {
    if (!active) { setVals({ amy: 0, fad: 0, josh: 0, viv: 0 }); return }
    const start = Date.now()
    const duration = 1200
    const frame = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVals({
        amy: parseFloat((e * targets.amy).toFixed(2)),
        fad: parseFloat((e * targets.fad).toFixed(2)),
        josh: parseFloat((e * targets.josh).toFixed(2)),
        viv: parseFloat((e * targets.viv).toFixed(2)),
      })
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active])

  const balances = [
    { name: 'Amy', val: vals.amy, positive: true },
    { name: 'Fad', val: vals.fad, positive: false },
    { name: 'Josh', val: vals.josh, positive: false },
    { name: 'Viv', val: vals.viv, positive: false },
  ]

  const settlements = [
    { from: 'F', to: 'A', fromName: 'Fad', toName: 'Amy', amount: 198.00 },
    { from: 'J', to: 'A', fromName: 'Josh', toName: 'Amy', amount: 89.25 },
    { from: 'V', to: 'A', fromName: 'Viv', toName: 'Amy', amount: 55.25 },
  ]

  return (
    <div className="w-full flex-shrink-0 h-full flex flex-col bg-white">
      <div className="flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-[10px] font-semibold text-slate-900">9:41</span>
        <div className="w-3.5 h-2.5 border border-slate-700 rounded-sm relative">
          <div className="m-px h-full bg-teal-500 rounded-sm w-3/4" />
        </div>
      </div>
      <div className="flex border-b border-slate-100">
        <button className="flex-1 py-2 text-[9px] font-medium text-slate-400">Expenses</button>
        <button className="flex-1 py-2 text-[9px] font-bold text-teal-600 border-b-2 border-teal-500">Balances</button>
      </div>
      {/* Net balances */}
      <div className="px-4 pt-2">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Net Balances</p>
        <div className="space-y-1">
          {balances.map(({ name, val, positive }) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-700">{name}</span>
              <span className={`text-[11px] font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {positive ? '+' : ''}${Math.abs(val).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Settle up */}
      <div className="px-4 pt-3">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Settle Up</p>
        <div className="space-y-1.5">
          {settlements.map(({ from, to, fromName, toName, amount }) => (
            <div key={from} className="bg-slate-50 rounded-lg p-2 flex items-center gap-1.5 border border-slate-100">
              <div className="w-5 h-5 rounded-full bg-amber-400 text-white text-[8px] font-bold flex items-center justify-center">{from}</div>
              <span className="text-[9px] text-slate-400">→</span>
              <div className="w-5 h-5 rounded-full bg-teal-500 text-white text-[8px] font-bold flex items-center justify-center">{to}</div>
              <span className="text-[9px] font-semibold text-slate-700 flex-1">${amount.toFixed(2)}</span>
              <div className="bg-teal-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Pay ⚡</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main PhoneMockup ──────────────────────────────────────── */

export default function PhoneMockup() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % SCREEN_COUNT), INTERVAL_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative">
      {/* Background blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 60% 50%, rgba(29,158,117,0.10) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Floating card — top right */}
      <div
        className="absolute hidden lg:flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2 border-l-4 border-teal-500 z-20"
        style={{
          top: '10%',
          right: '-12%',
          animation: 'springIn 600ms cubic-bezier(0.34,1.56,0.64,1) 400ms both, bob 3s ease-in-out 1s infinite',
          minWidth: 160,
        }}
      >
        <span className="text-base">✓</span>
        <div>
          <p className="text-[10px] font-bold text-slate-900 leading-tight">Receipt scanned</p>
          <p className="text-[9px] text-teal-600">The Italiano · $147.50</p>
        </div>
      </div>

      {/* Floating card — left middle */}
      <div
        className="absolute hidden lg:flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2 border-l-4 border-amber-400 z-20"
        style={{
          top: '42%',
          left: '-16%',
          animation: 'springIn 600ms cubic-bezier(0.34,1.56,0.64,1) 900ms both, bob 3.4s ease-in-out 1.4s infinite',
          minWidth: 156,
        }}
      >
        <span className="text-base">💸</span>
        <div>
          <p className="text-[10px] font-bold text-slate-900 leading-tight">Josh paid $89.25</p>
          <p className="text-[9px] text-slate-400">Ku De Ta dinner</p>
        </div>
      </div>

      {/* Floating card — bottom right */}
      <div
        className="absolute hidden lg:flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2 border-l-4 border-indigo-400 z-20"
        style={{
          bottom: '14%',
          right: '-14%',
          animation: 'springIn 600ms cubic-bezier(0.34,1.56,0.64,1) 1400ms both, bob 3.8s ease-in-out 1.8s infinite',
          minWidth: 152,
        }}
      >
        <span className="text-base">⚡</span>
        <div>
          <p className="text-[10px] font-bold text-slate-900 leading-tight">3 transfers to settle</p>
          <p className="text-[9px] text-slate-400">via PayID</p>
        </div>
      </div>

      {/* iPhone 15 Pro frame */}
      <div
        className="relative mx-auto z-10"
        style={{
          width: 280,
          height: 560,
        }}
      >
        {/* Outer shell */}
        <div
          className="absolute inset-0 rounded-[44px]"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset',
          }}
        />
        {/* Volume buttons */}
        <div className="absolute left-[-3px] top-[110px] w-[3px] h-8 bg-slate-700 rounded-l-full" />
        <div className="absolute left-[-3px] top-[155px] w-[3px] h-8 bg-slate-700 rounded-l-full" />
        <div className="absolute left-[-3px] top-[200px] w-[3px] h-8 bg-slate-700 rounded-l-full" />
        {/* Power button */}
        <div className="absolute right-[-3px] top-[140px] w-[3px] h-14 bg-slate-700 rounded-r-full" />

        {/* Screen bezel */}
        <div
          className="absolute inset-[8px] rounded-[38px] overflow-hidden bg-white"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30"
            style={{
              width: 100,
              height: 28,
              background: '#0a0a0a',
              borderRadius: 20,
            }}
          />

          {/* Screens slider */}
          <div
            className="flex h-full"
            style={{
              width: `${SCREEN_COUNT * 100}%`,
              transform: `translateX(-${(active * 100) / SCREEN_COUNT}%)`,
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: `${100 / SCREEN_COUNT}%` }} className="h-full">
              <Screen1 />
            </div>
            <div style={{ width: `${100 / SCREEN_COUNT}%` }} className="h-full">
              <Screen2 active={active === 1} />
            </div>
            <div style={{ width: `${100 / SCREEN_COUNT}%` }} className="h-full">
              <Screen3 active={active === 2} />
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: active === i ? 20 : 8,
              height: 8,
              background: active === i ? '#1D9E75' : '#CBD5E1',
            }}
            aria-label={`Screen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

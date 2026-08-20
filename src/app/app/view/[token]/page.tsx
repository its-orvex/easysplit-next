'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Users, Receipt, ArrowRight, CheckCircle } from 'lucide-react'
import { getTripByShareToken } from '@/hooks/useFirestore'
import { IS_CONFIGURED } from '@/lib/firebase'
import { formatCurrency } from '@/utils/format'
import { calculateSettlements, calculateNetBalances } from '@/utils/settlement'
import MemberAvatar from '@/components/MemberAvatar'
import ExpenseCard from '@/components/expenses/ExpenseCard'

export default function GuestViewPage() {
  const params      = useParams()
  const shareToken  = params.token as string

  const [trip,      setTrip]      = useState<any>(null)
  const [status,    setStatus]    = useState<'loading' | 'not-configured' | 'found' | 'not-found' | 'error'>('loading')
  const [activeTab, setActiveTab] = useState('expenses')

  useEffect(() => {
    if (!IS_CONFIGURED) { setStatus('not-configured'); return }
    getTripByShareToken(shareToken)
      .then((t: any) => { setTrip(t); setStatus(t ? 'found' : 'not-found') })
      .catch(() => setStatus('error'))
  }, [shareToken])

  if (status === 'loading') {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading…</div>
  }

  if (status === 'not-configured') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">Firebase not configured</p>
        <p className="text-sm text-slate-500">Guest links require Firestore to be set up.</p>
        <Link href="/app" className="mt-4 block text-teal-600 text-sm underline">Back to home</Link>
      </div>
    )
  }

  if (status === 'not-found' || !trip) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-semibold text-gray-800 mb-2">Link not found</p>
        <p className="text-sm text-slate-500 mb-4">This view-only link may have expired or been removed.</p>
        <Link href="/app" className="text-teal-600 text-sm underline">Back to home</Link>
      </div>
    )
  }

  const totalSpend  = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0)
  const netBalances = calculateNetBalances(trip.members, trip.expenses)
  const settlements = calculateSettlements(trip.members, trip.expenses)
  const allSettled  = settlements.length === 0
  const sorted      = [...trip.expenses].sort((a: any, b: any) => b.date.localeCompare(a.date))

  function memberName(id: string) { return trip.members.find((m: any) => m.id === id)?.name ?? id }
  function memberIndex(id: string) { return trip.members.findIndex((m: any) => m.id === id) }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-3">
        <span>👁 Viewing as guest — sign in to add expenses</span>
        <Link href="/app" className="text-teal-600 font-semibold text-xs whitespace-nowrap hover:underline">Sign in</Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{trip.name}</h1>
      <p className="text-sm text-slate-400 mb-5">
        {new Date(trip.createdAt?.seconds ? trip.createdAt.seconds * 1000 : trip.createdAt)
          .toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="flex items-center gap-6 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 text-sm">
        <span className="flex items-center gap-2 text-slate-600"><Users size={14} className="text-teal-500" />{trip.members.length} members</span>
        <span className="flex items-center gap-2 text-slate-600"><Receipt size={14} className="text-teal-500" />{trip.expenses.length} expenses</span>
        <span className="ml-auto font-bold text-gray-900">{formatCurrency(totalSpend)}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Members</p>
        <div className="flex flex-wrap gap-2">
          {trip.members.map((m: any, idx: number) => (
            <div key={m.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
              <MemberAvatar name={m.name} index={idx} size="xs" />
              <span className="text-sm font-medium text-slate-700">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-5">
        {['expenses', 'balances'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-gray-800'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'expenses' && (
        trip.expenses.length === 0
          ? <div className="text-center py-12 text-slate-400"><div className="text-4xl mb-3">🧾</div><p>No expenses yet.</p></div>
          : <div className="flex flex-col gap-2.5">
              {sorted.map((exp: any) => (
                <ExpenseCard key={exp.id} expense={exp} members={trip.members} onDelete={null} readOnly />
              ))}
            </div>
      )}

      {activeTab === 'balances' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 pt-4 pb-3">Net Balances</p>
            <div className="divide-y divide-slate-100">
              {trip.members.map((m: any, idx: number) => {
                const bal    = (netBalances as any)[m.id] ?? 0
                const isZero = Math.abs(bal) < 0.005
                return (
                  <div key={m.id} className={`flex items-center gap-3 px-5 py-3 ${!isZero && (bal > 0 ? 'bg-green-50' : 'bg-red-50')}`}>
                    <MemberAvatar name={m.name} index={idx} size="sm" />
                    <span className="text-sm font-medium text-gray-800 flex-1">{m.name}</span>
                    <span className={`text-sm font-semibold ${isZero ? 'text-slate-400' : bal > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {isZero ? 'Settled up' : bal > 0 ? `+${formatCurrency(bal)} owed to them` : `−${formatCurrency(Math.abs(bal))} owes`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 pt-4 pb-3">Settle Up</p>
            {allSettled
              ? <div className="flex items-center gap-2 px-5 pb-5 text-green-600"><CheckCircle size={16} /><span className="text-sm font-medium">All settled up!</span></div>
              : <div className="divide-y divide-slate-100">
                  {(settlements as any[]).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-5 py-3.5">
                      <MemberAvatar name={memberName(s.from)} index={memberIndex(s.from)} size="sm" />
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[100px]">{memberName(s.from)}</span>
                      <ArrowRight size={13} className="text-slate-400 flex-shrink-0" />
                      <MemberAvatar name={memberName(s.to)} index={memberIndex(s.to)} size="sm" />
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[100px]">{memberName(s.to)}</span>
                      <span className="ml-auto font-bold text-teal-700 text-sm">{formatCurrency(s.amount)}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Copy, Check, ChevronDown, ChevronRight, Zap, Settings } from 'lucide-react'
import { calculateSettlements, calculateNetBalances } from '@/utils/settlement'
import { formatCurrency } from '@/utils/format'
import MemberAvatar from './MemberAvatar'
import PaymentSheet from './members/PaymentSheet'

interface Props {
  trip: any
  updateTrip: (trip: any) => void
  onEditMember?: (member: any) => void
}

export default function BalancesTab({ trip, updateTrip, onEditMember }: Props) {
  const [copied,      setCopied]      = useState(false)
  const [showSettled, setShowSettled] = useState(false)
  const [payTarget,   setPayTarget]   = useState<any>(null)

  if (trip.expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold text-gray-700">No expenses yet</p>
        <p className="text-sm mt-1 text-slate-400">Add expenses to see who owes what.</p>
      </div>
    )
  }

  const netBalances = calculateNetBalances(trip.members, trip.expenses)
  const settlements = calculateSettlements(trip.members, trip.expenses)
  const paidKeys    = new Set(trip.paidTransfers ?? [])

  const active     = settlements.filter((s: any) => !paidKeys.has(`${s.from}::${s.to}`))
  const paid       = settlements.filter((s: any) =>  paidKeys.has(`${s.from}::${s.to}`))
  const allSettled = active.length === 0

  const member      = (id: string) => trip.members.find((m: any) => m.id === id)
  const memberName  = (id: string) => member(id)?.name ?? id
  const memberIndex = (id: string) => trip.members.findIndex((m: any) => m.id === id)

  function markPaid(s: any) {
    const key = `${s.from}::${s.to}`
    updateTrip({ ...trip, paidTransfers: [...(trip.paidTransfers ?? []), key] })
  }

  function resetAll() {
    updateTrip({ ...trip, paidTransfers: [] })
  }

  function buildSummaryText() {
    const lines = [`Trip: ${trip.name}`, '']
    if (allSettled && paid.length === 0) { lines.push('All settled up!') }
    else {
      active.forEach((s: any) => lines.push(`${memberName(s.from)} pays ${memberName(s.to)}: ${formatCurrency(s.amount)}`))
      if (paid.length > 0) { lines.push('', '✓ Already paid:'); paid.forEach((s: any) => lines.push(`  ${memberName(s.from)} paid ${memberName(s.to)}: ${formatCurrency(s.amount)}`)) }
    }
    return lines.join('\n')
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(buildSummaryText()); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { /* ignore */ }
  }

  function openPay(s: any) {
    setPayTarget({ settlement: s, debtor: member(s.from), creditor: member(s.to) })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Net balances */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 pt-4 pb-3">Net balances</p>
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

      {/* Settle up */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Settle up{active.length > 0 ? ` — ${active.length} remaining` : ''}
          </p>
          <button onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${copied ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy summary'}
          </button>
        </div>

        {allSettled && paid.length === 0 ? (
          <div className="flex items-center gap-2.5 px-5 pb-5 text-green-600">
            <CheckCircle size={18} /><span className="text-sm font-medium">All settled up! No transfers needed.</span>
          </div>
        ) : allSettled ? (
          <div className="flex items-center gap-2.5 px-5 pb-5 text-green-600">
            <CheckCircle size={18} /><span className="text-sm font-medium">All transfers marked as paid!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {active.map((s: any, idx: number) => {
              const debtor   = member(s.from)
              const creditor = member(s.to)
              const canPay   = !!debtor?.preferredBank
              return (
                <div key={idx} className="flex items-center gap-2 px-4 py-3.5 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MemberAvatar name={memberName(s.from)} index={memberIndex(s.from)} size="sm" />
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[80px]">{memberName(s.from)}</span>
                  </div>
                  <ArrowRight size={13} className="text-slate-400 flex-shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MemberAvatar name={memberName(s.to)} index={memberIndex(s.to)} size="sm" />
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[80px]">{memberName(s.to)}</span>
                  </div>
                  <span className="ml-auto text-sm font-bold text-teal-700 flex-shrink-0">{formatCurrency(s.amount)}</span>
                  {canPay ? (
                    <button onClick={() => openPay(s)}
                      className="flex items-center gap-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1.5 rounded-full transition-colors flex-shrink-0">
                      <Zap size={11} /> Pay Now
                    </button>
                  ) : (
                    <button onClick={() => onEditMember?.(debtor)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-teal-600 flex-shrink-0">
                      <Settings size={11} /> Set up PayID
                    </button>
                  )}
                  <button onClick={() => markPaid(s)}
                    className="text-xs font-medium text-slate-400 hover:text-teal-700 border border-slate-200 hover:border-teal-400 px-2 py-1 rounded-lg transition-all flex-shrink-0">
                    Mark paid
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {paid.length > 0 && (
          <div className="border-t border-slate-100">
            <button onClick={() => setShowSettled(v => !v)}
              className="flex items-center gap-2 w-full px-5 py-3 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
              {showSettled ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Settled ✓ ({paid.length})
            </button>
            {showSettled && (
              <>
                <div className="divide-y divide-slate-100">
                  {paid.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-5 py-3 opacity-50">
                      <MemberAvatar name={memberName(s.from)} index={memberIndex(s.from)} size="sm" />
                      <span className="text-sm font-semibold text-gray-600 line-through truncate max-w-[90px]">{memberName(s.from)}</span>
                      <ArrowRight size={13} className="text-slate-300 flex-shrink-0" />
                      <MemberAvatar name={memberName(s.to)} index={memberIndex(s.to)} size="sm" />
                      <span className="text-sm font-semibold text-gray-600 line-through truncate max-w-[90px]">{memberName(s.to)}</span>
                      <span className="ml-auto text-sm font-bold text-slate-400 line-through">{formatCurrency(s.amount)}</span>
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3">
                  <button onClick={resetAll} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Reset all</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {payTarget && (
        <PaymentSheet
          settlement={payTarget.settlement}
          debtor={payTarget.debtor}
          creditor={payTarget.creditor}
          tripName={trip.name}
          onMarkPaid={markPaid}
          onClose={() => setPayTarget(null)}
        />
      )}
    </div>
  )
}

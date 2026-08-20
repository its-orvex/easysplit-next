'use client'

import { useState } from 'react'
import { X, CreditCard } from 'lucide-react'
import { BANKS, MEMBER_TAGS, MEMBER_TAG_LABELS } from '@/utils/models'
import { formatCurrency } from '@/utils/format'
import { calculateMemberShares, calculateSettlements } from '@/utils/settlement'
import PaymentSheet from './PaymentSheet'

const TABS = ['Profile', 'Expenses', 'Settlements']

function ProfileTab({ member, onSave, onClose }: any) {
  const [name,          setName]          = useState(member.name)
  const [payId,         setPayId]         = useState(member.payId ?? '')
  const [bsb,           setBsb]           = useState(member.bsb ?? '')
  const [accountNumber, setAccountNumber] = useState(member.accountNumber ?? '')
  const [preferredBank, setPreferredBank] = useState(member.preferredBank ?? '')
  const [tags,          setTags]          = useState(member.tags ?? [])

  function toggleTag(tag: string) {
    setTags((prev: string[]) => prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag])
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({
      ...member,
      name: name.trim(),
      payId: payId.trim() || null,
      bsb: bsb.trim() || null,
      accountNumber: accountNumber.trim() || null,
      preferredBank: preferredBank || null,
      tags,
    })
  }

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PayID</label>
        <p className="text-xs text-slate-400 mb-1.5">Phone number or email address</p>
        <input type="text" value={payId} onChange={e => setPayId(e.target.value)}
          placeholder="e.g. 0412 345 678 or name@email.com" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank transfer details</label>
        <p className="text-xs text-slate-400 mb-1.5">Optional alternative to PayID</p>
        <div className="grid grid-cols-[110px_1fr] gap-2">
          <input type="text" inputMode="numeric" value={bsb} onChange={e => setBsb(e.target.value)}
            placeholder="BSB" className={inputCls} />
          <input type="text" inputMode="numeric" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}
            placeholder="Account number" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred payment app</label>
        <p className="text-xs text-slate-400 mb-1.5">Used to show the right "Pay Now" button</p>
        <select value={preferredBank} onChange={e => setPreferredBank(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="">None / Not set</option>
          {BANKS.map((b: any) => <option key={b.key} value={b.key}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <p className="text-xs text-slate-400 mb-2">Used by smart split presets in the expense form</p>
        <div className="flex flex-wrap gap-2">
          {(MEMBER_TAGS as string[]).map(tag => {
            const active = tags.includes(tag)
            return (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>
                {(MEMBER_TAG_LABELS as any)[tag]}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
          Save
        </button>
      </div>
    </div>
  )
}

function ExpensesTab({ member, trip }: any) {
  if (!trip) return null
  const allExpenses = trip.expenses ?? []
  const shares      = calculateMemberShares(trip.members, allExpenses) as Record<string, Record<string, number>>
  const involved    = allExpenses.filter((exp: any) =>
    exp.paidById === member.id || exp.participants?.includes(member.id)
  ).sort((a: any, b: any) => b.date.localeCompare(a.date))

  let totalPaid = 0, totalOwed = 0
  involved.forEach((exp: any) => {
    if (exp.paidById === member.id) totalPaid += exp.amount
    const share = shares[exp.id]?.[member.id] ?? 0
    totalOwed += share
  })
  const net = +(totalPaid - totalOwed).toFixed(2)

  if (involved.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">No expenses yet for {member.name}.</p>
  }

  return (
    <div>
      <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 flex gap-4 text-sm">
        <div><p className="text-xs text-slate-400">Paid upfront</p><p className="font-bold text-gray-800">{formatCurrency(totalPaid)}</p></div>
        <div><p className="text-xs text-slate-400">Owes (share)</p><p className="font-bold text-gray-800">{formatCurrency(totalOwed)}</p></div>
        <div className="ml-auto text-right">
          <p className="text-xs text-slate-400">Net</p>
          <p className={`font-bold text-sm ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {net >= 0 ? `+${formatCurrency(net)}` : `-${formatCurrency(Math.abs(net))}`}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {involved.map((exp: any) => {
          const share  = shares[exp.id]?.[member.id] ?? 0
          const didPay = exp.paidById === member.id
          let itemLines: string[] = []
          if (exp.splitMode === 'byItem' && exp.items) {
            itemLines = exp.items
              .filter((it: any) => it.assignedTo?.includes(member.id))
              .map((it: any) => {
                const perPerson = it.price / it.assignedTo.length
                const shared = it.assignedTo.length > 1
                  ? ` (shared with ${it.assignedTo.filter((id: string) => id !== member.id).map((id: string) => trip.members.find((m: any) => m.id === id)?.name ?? 'Unknown').join(', ')})`
                  : ''
                return `${it.name}${shared} — ${formatCurrency(perPerson)}`
              })
          }
          return (
            <div key={exp.id} className="border border-slate-100 rounded-xl p-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{exp.description}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(exp.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    {didPay && ' · You paid'}
                  </p>
                  {itemLines.map((line: string, i: number) => (
                    <p key={i} className="text-xs text-slate-500 mt-0.5">{line}</p>
                  ))}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400 mb-0.5">Your share</p>
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(share)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SettlementsTab({ member, trip }: any) {
  const [payingTo, setPayingTo] = useState<any>(null)
  if (!trip) return null

  const allSettlements = calculateSettlements(trip.members, trip.expenses ?? [])
  const owes = allSettlements.filter((s: any) => s.from === member.id)
  const owed = allSettlements.filter((s: any) => s.to === member.id)
  const findMember = (id: string) => trip.members.find((m: any) => m.id === id)

  if (owes.length === 0 && owed.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-sm font-semibold text-gray-700">{member.name} is all settled up!</p>
        <p className="text-xs text-slate-400 mt-1">No outstanding balances.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {owes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{member.name} owes</p>
          <div className="flex flex-col gap-2">
            {owes.map((s: any, i: number) => {
              const creditor = findMember(s.to)
              return (
                <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">→ {creditor?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-slate-400">{creditor?.payId ? `PayID: ${creditor.payId}` : 'No PayID set'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-500 text-sm">{formatCurrency(s.amount)}</span>
                    {creditor && (
                      <button onClick={() => setPayingTo({ to: creditor, amount: s.amount })}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors">
                        <CreditCard size={11} /> Pay
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {owed.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Others owe {member.name}</p>
          <div className="flex flex-col gap-2">
            {owed.map((s: any, i: number) => {
              const debtor = findMember(s.from)
              return (
                <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">← {debtor?.name ?? 'Unknown'}</p>
                  </div>
                  <span className="font-bold text-green-600 text-sm">{formatCurrency(s.amount)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {payingTo && (
        <PaymentSheet
          settlement={{ amount: payingTo.amount }}
          debtor={member}
          creditor={payingTo.to}
          tripName={trip?.name ?? ''}
          onMarkPaid={() => setPayingTo(null)}
          onClose={() => setPayingTo(null)}
        />
      )}
    </div>
  )
}

interface Props {
  member: any
  trip: any
  onSave: (m: any) => void
  onClose: () => void
}

export default function MemberDetailSheet({ member, trip, onSave, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50">
      <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{member.name}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="flex border-b border-slate-200 px-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-gray-800'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'Profile'     && <ProfileTab member={member} onSave={onSave} onClose={onClose} />}
          {activeTab === 'Expenses'    && <ExpensesTab member={member} trip={trip} />}
          {activeTab === 'Settlements' && <SettlementsTab member={member} trip={trip} />}
        </div>
      </div>
    </div>
  )
}

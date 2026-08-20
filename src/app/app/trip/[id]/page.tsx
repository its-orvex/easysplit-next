'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Users, Receipt, Check, X, Link2 } from 'lucide-react'
import { useTrips } from '@/context/TripsContext'
import { formatCurrency } from '@/utils/format'
import { createMember } from '@/utils/models'
import { useRecurring } from '@/hooks/useRecurring'
import MemberAvatar from '@/components/MemberAvatar'
import ExpenseCard from '@/components/expenses/ExpenseCard'
import BalancesTab from '@/components/BalancesTab'
import InviteSheet from '@/components/InviteSheet'
import MemberDetailSheet from '@/components/members/MemberDetailSheet'
import RecurringTab from '@/components/RecurringTab'

function MembersSection({ trip, updateTrip, onEditMember }: any) {
  const [adding,  setAdding]  = useState(false)
  const [newName, setNewName] = useState('')
  const [error,   setError]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startAdding() { setAdding(true); setNewName(''); setError(''); setTimeout(() => inputRef.current?.focus(), 0) }
  function cancel()      { setAdding(false); setNewName(''); setError('') }

  function commit() {
    const trimmed = newName.trim()
    if (!trimmed) { setError('Name cannot be empty.'); return }
    if (trip.members.some((m: any) => m.name.toLowerCase() === trimmed.toLowerCase())) { setError('Already exists.'); return }
    updateTrip({ ...trip, members: [...trip.members, createMember(trimmed)] })
    cancel()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Members <span className="normal-case font-normal text-slate-400">(tap to edit)</span>
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {trip.members.map((m: any, idx: number) => (
          <button key={m.id} onClick={() => onEditMember(m)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-full pl-1 pr-3 py-1 transition-colors">
            <MemberAvatar name={m.name} index={idx} size="xs" />
            <span className="text-sm font-medium text-slate-700">{m.name}</span>
            {m.payId && <span className="text-[10px] text-teal-500 ml-0.5">●</span>}
          </button>
        ))}
      </div>
      {adding ? (
        <div>
          <div className="flex items-center gap-2">
            <input ref={inputRef} type="text" value={newName}
              onChange={e => { setNewName(e.target.value); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
              placeholder="Member name"
              className="flex-1 border border-teal-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <button onClick={commit} className="p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg" aria-label="Confirm"><Check size={14} /></button>
            <button onClick={cancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" aria-label="Cancel"><X size={14} /></button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <button onClick={startAdding} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium">
          <Plus size={14} /> Add member
        </button>
      )}
    </div>
  )
}

function ExpensesTab({ trip, onDeleteExpense, onEditExpense, upcomingBills, onLogBill }: any) {
  return (
    <div>
      {upcomingBills.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <span className="text-lg">⏰</span>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Upcoming bills</p>
            <p className="text-xs text-amber-700 truncate">
              {upcomingBills.map((r: any) => r.description).join(' · ')}
            </p>
          </div>
          <button onClick={onLogBill}
            className="flex-shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors">
            View
          </button>
        </div>
      )}

      {trip.expenses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🧾</div>
          <p className="font-semibold text-gray-700 text-lg">No expenses yet</p>
          <p className="text-sm mt-1 text-slate-400">Add your first expense to start tracking.</p>
          <Link href={`/app/trip/${trip.id}/add-expense`}
            className="inline-flex items-center gap-2 mt-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            <Plus size={15} /> Add expense
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {[...trip.expenses].sort((a: any, b: any) => b.date.localeCompare(a.date)).map((exp: any) => (
            <ExpenseCard key={exp.id} expense={exp} members={trip.members}
              onDelete={onDeleteExpense} onEdit={onEditExpense} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function TripDetailPage() {
  const params   = useParams()
  const id       = params.id as string
  const router   = useRouter()
  const { getTripById, updateTrip } = useTrips()

  const [activeTab,     setActiveTab]     = useState('expenses')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [showInvite,    setShowInvite]    = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const trip = getTripById(id)
  const { items: recurringItems } = useRecurring(trip?.id ?? '')

  if (!trip) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-slate-500">Trip not found.</p>
      <Link href="/app" className="text-teal-600 underline mt-2 block text-sm">Back to home</Link>
    </div>
  )

  const today  = new Date().toISOString().slice(0, 10)
  const in7    = new Date(); in7.setDate(in7.getDate() + 7)
  const in7Str = in7.toISOString().slice(0, 10)

  const overdueCount  = recurringItems.filter((r: any) => r.isActive && r.nextDueDate <= today).length
  const upcomingBills = recurringItems.filter((r: any) => r.isActive && r.nextDueDate <= in7Str)

  function confirmDelete() {
    updateTrip({ ...trip, expenses: trip.expenses.filter((e: any) => e.id !== pendingDelete) })
    setPendingDelete(null)
  }

  function handleEditExpense(expense: any) {
    router.push(`/app/trip/${id}/add-expense?edit=${expense.id}`)
  }

  function handleSaveMember(updatedMember: any) {
    updateTrip({ ...trip, members: trip.members.map((m: any) => m.id === updatedMember.id ? updatedMember : m) })
    setEditingMember(null)
  }

  const totalSpend = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0)

  const TABS = [
    { key: 'expenses',  label: 'Expenses' },
    { key: 'balances',  label: 'Balances' },
    { key: 'recurring', label: overdueCount > 0 ? `Recurring (${overdueCount})` : 'Recurring' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={15} /> All trips
      </Link>

      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{trip.name}</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {new Date(trip.createdAt?.seconds ? trip.createdAt.seconds * 1000 : trip.createdAt)
              .toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 border border-slate-200 hover:border-teal-400 text-slate-600 hover:text-teal-700 text-sm font-medium px-3 py-2.5 rounded-full transition-colors">
            <Link2 size={14} /> Invite
          </button>
          <Link href={`/app/trip/${trip.id}/add-expense`}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors shadow-sm">
            <Plus size={15} /> Add expense
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-6 text-sm">
        <div className="flex items-center gap-2 text-slate-600"><Users size={15} className="text-teal-500" /><span>{trip.members.length} members</span></div>
        <div className="flex items-center gap-2 text-slate-600"><Receipt size={15} className="text-teal-500" /><span>{trip.expenses.length} expense{trip.expenses.length !== 1 ? 's' : ''}</span></div>
        <div className="ml-auto font-bold text-gray-900">{formatCurrency(totalSpend)}</div>
      </div>

      <MembersSection trip={trip} updateTrip={updateTrip} onEditMember={setEditingMember} />

      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-gray-800'} ${tab.key === 'recurring' && overdueCount > 0 ? 'text-amber-600' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'expenses' && (
        <ExpensesTab trip={trip} onDeleteExpense={setPendingDelete} onEditExpense={handleEditExpense}
          upcomingBills={upcomingBills} onLogBill={() => setActiveTab('recurring')} />
      )}
      {activeTab === 'balances' && (
        <BalancesTab trip={trip} updateTrip={updateTrip} onEditMember={setEditingMember} />
      )}
      {activeTab === 'recurring' && (
        <RecurringTab trip={trip} updateTrip={updateTrip} />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete expense?</h2>
            <p className="text-sm text-slate-500 mb-5">This can&apos;t be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setPendingDelete(null)} className="flex-1 border border-slate-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showInvite && <InviteSheet trip={trip} onClose={() => setShowInvite(false)} />}

      {editingMember && (
        <MemberDetailSheet
          member={editingMember}
          trip={trip}
          onSave={handleSaveMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  )
}

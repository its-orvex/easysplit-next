'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Check, CheckCircle2, CreditCard, Loader2, Plus, Receipt,
  Share2, UserPlus, Users, X,
} from 'lucide-react'
import { IS_SUPABASE_CONFIGURED } from '@/lib/supabase'
import {
  ensureSharedTrip, subscribeToSharedTrip, updateSharedTrip,
} from '@/hooks/useSupabaseSharedTrip'
import { createExpense, createMember, CATEGORIES } from '@/utils/models'
import { calculateNetBalances, calculateSettlements } from '@/utils/settlement'
import { formatCurrency } from '@/utils/format'
import MemberAvatar from '@/components/MemberAvatar'
import ExpenseCard from '@/components/expenses/ExpenseCard'
import MemberDetailSheet from '@/components/members/MemberDetailSheet'
import PaymentSheet from '@/components/members/PaymentSheet'

const SLUG = 'snow-2026'
const initialTrip = {
  name: 'SNOW 2026',
  members: [],
  expenses: [],
  paidTransfers: [],
  visibility: 'shared-editable',
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function SharedTripWorkspace() {
  const [trip, setTrip] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'expenses' | 'balances'>('expenses')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberNameInput, setMemberNameInput] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('other')
  const [paidById, setPaidById] = useState('')
  const [participants, setParticipants] = useState<string[]>([])
  const [pendingDelete, setPendingDelete] = useState<any>(null)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [payTarget, setPayTarget] = useState<any>(null)
  const [paidNotice, setPaidNotice] = useState('')

  useEffect(() => {
    let active = true
    ensureSharedTrip(SLUG, initialTrip).catch(err => {
      if (!active) return
      setError(err.message ?? 'Could not create the shared trip.')
      setStatus('error')
    })

    const unsubscribe = subscribeToSharedTrip(
      SLUG,
      next => {
        if (!active) return
        setTrip(next)
        if (next) setStatus('ready')
      },
      err => {
        if (!active) return
        setError(err.message ?? 'Could not load the shared trip.')
        setStatus('error')
      },
    )

    return () => { active = false; unsubscribe() }
  }, [])

  async function save(nextTrip: any) {
    setSaving(true)
    try {
      const { id: _id, ...data } = nextTrip
      await updateSharedTrip(SLUG, data)
    } catch (err: any) {
      setError(err.message ?? 'Could not save that change.')
    } finally {
      setSaving(false)
    }
  }

  function addMember(event: React.FormEvent) {
    event.preventDefault()
    const name = memberNameInput.trim()
    if (!name || !trip) return
    if (trip.members.some((member: any) => member.name.toLowerCase() === name.toLowerCase())) {
      setError('That person is already on the trip.')
      return
    }
    const next = { ...trip, members: [...trip.members, createMember(name)] }
    setMemberNameInput('')
    setShowMemberForm(false)
    setError('')
    save(next)
  }

  function addExpense(event: React.FormEvent) {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!trip || !description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0 || !paidById || participants.length === 0) {
      setError('Add a description, amount, payer, and at least one person to split it with.')
      return
    }
    const expense = createExpense({
      description: description.trim(),
      category,
      amount: numericAmount,
      paidById,
      splitMode: 'equal',
      participants,
      customSplits: null,
      items: null,
      receiptImage: null,
      date: today(),
    })
    save({ ...trip, expenses: [...trip.expenses, expense] })
    setDescription('')
    setAmount('')
    setShowExpenseForm(false)
    setError('')
  }

  function openExpenseForm() {
    if (!trip) return
    setParticipants([])
    setShowExpenseForm(true)
    setError('')
  }

  function toggleParticipant(memberId: string) {
    setParticipants(current => current.includes(memberId)
      ? current.filter(id => id !== memberId)
      : [...current, memberId])
  }

  function deleteExpense(id: string) {
    if (!trip) return
    save({ ...trip, expenses: trip.expenses.filter((expense: any) => expense.id !== id) })
  }

  function requestDeleteExpense(id: string) {
    setPendingDelete(trip?.expenses.find((expense: any) => expense.id === id) ?? null)
  }

  function confirmDeleteExpense() {
    if (!pendingDelete) return
    deleteExpense(pendingDelete.id)
    setPendingDelete(null)
  }

  function saveMember(updatedMember: any) {
    if (!trip) return
    save({ ...trip, members: trip.members.map((member: any) => member.id === updatedMember.id ? updatedMember : member) })
    setEditingMember(null)
  }

  function openPayment(transfer: any) {
    setPayTarget({
      settlement: transfer,
      debtor: trip.members.find((member: any) => member.id === transfer.from),
      creditor: trip.members.find((member: any) => member.id === transfer.to),
    })
  }

  function markPaid(transfer: any) {
    if (!trip) return
    const key = `${transfer.from}::${transfer.to}`
    const nextTrip = { ...trip, paidTransfers: [...new Set([...(trip.paidTransfers ?? []), key])] }
    setTrip(nextTrip)
    setPaidNotice(`${memberName(transfer.from)} → ${memberName(transfer.to)} marked as paid.`)
    setTimeout(() => setPaidNotice(''), 3500)
    save(nextTrip)
  }

  function undoPaid(transfer: any) {
    if (!trip) return
    const key = `${transfer.from}::${transfer.to}`
    const nextTrip = { ...trip, paidTransfers: (trip.paidTransfers ?? []).filter((item: string) => item !== key) }
    setTrip(nextTrip)
    setPaidNotice(`${memberName(transfer.from)} → ${memberName(transfer.to)} moved back to Settle Up.`)
    setTimeout(() => setPaidNotice(''), 3500)
    save(nextTrip)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const totalSpend = useMemo(
    () => trip?.expenses?.reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0) ?? 0,
    [trip],
  )
  const balances: Record<string, number> = trip ? calculateNetBalances(trip.members, trip.expenses) as Record<string, number> : {}
  const settlements = trip ? calculateSettlements(trip.members, trip.expenses) : []
  const paidKeys = new Set(trip?.paidTransfers ?? [])
  const activeSettlements = settlements.filter((transfer: any) => !paidKeys.has(`${transfer.from}::${transfer.to}`))
  const paidSettlements = settlements.filter((transfer: any) => paidKeys.has(`${transfer.from}::${transfer.to}`))

  function memberName(id: string) {
    return trip?.members.find((member: any) => member.id === id)?.name ?? id
  }

  if (!IS_SUPABASE_CONFIGURED) {
    return <Message title="Supabase needs to be connected" body="Add the Supabase project URL and anon key to the Vercel environment variables, then redeploy this site." />
  }

  if (status === 'error') {
    return <Message title="Could not open SNOW 2026" body={error || 'Check the Supabase table and policies, then try again.'} />
  }

  if (status !== 'ready' || !trip) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5"><div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={17} className="animate-spin" /> Opening SNOW 2026…</div></div>
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <header className="py-5 flex items-center justify-between gap-3">
          <a href="/" className="text-teal-700 font-black tracking-tight text-lg">EasySplit</a>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400">Live shared trip</span>
            <button onClick={copyLink} className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 rounded-full text-xs font-semibold text-slate-600 hover:border-teal-400 hover:text-teal-700">
              {copied ? <Check size={14} /> : <Share2 size={14} />}{copied ? 'Copied' : 'Share trip'}
            </button>
          </div>
        </header>

        <section className="bg-teal-700 text-white rounded-3xl p-5 sm:p-7 shadow-sm">
          <p className="text-teal-100 text-xs font-bold tracking-[0.18em] uppercase">Shared trip workspace</p>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div><h1 className="text-3xl sm:text-4xl font-black tracking-tight">SNOW 2026</h1><p className="text-teal-100 text-sm mt-1">Everyone with this link can add names and expenses.</p></div>
            <div className="text-left sm:text-right"><p className="text-teal-100 text-xs">Total tracked</p><p className="text-2xl font-black">{formatCurrency(totalSpend)}</p></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5 text-xs font-semibold">
            <span className="bg-white/15 rounded-full px-3 py-1.5 flex items-center gap-1.5"><Users size={13} /> {trip.members.length} people</span>
            <span className="bg-white/15 rounded-full px-3 py-1.5 flex items-center gap-1.5"><Receipt size={13} /> {trip.expenses.length} expenses</span>
            {saving && <span className="bg-white/15 rounded-full px-3 py-1.5 flex items-center gap-1.5"><Loader2 size={13} className="animate-spin" /> Saving…</span>}
          </div>
        </section>

        <section className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="text-lg">🔗</span><p className="text-xs sm:text-sm text-amber-800 leading-relaxed">This page saves automatically and stays in sync for everyone. No account or password is needed — just keep this link.</p>
        </section>

        <section className="mt-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-3"><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Going on the trip</p><p className="text-[11px] text-slate-400 mt-0.5">Tap a person to add PayID or bank details</p></div><button onClick={() => setShowMemberForm(v => !v)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"><UserPlus size={15} /> Add me</button></div>
          {trip.members.length === 0 ? <p className="text-sm text-slate-400">Add everyone’s name so expenses can be assigned correctly.</p> : <div className="flex flex-wrap gap-2">{trip.members.map((member: any, index: number) => <button key={member.id} onClick={() => setEditingMember(member)} className="flex items-center gap-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-full pl-1 pr-3 py-1 transition-colors"><MemberAvatar name={member.name} index={index} size="xs" /><span className="text-sm font-medium text-slate-700">{member.name}</span>{(member.payId || (member.bsb && member.accountNumber)) && <span className="text-[10px] text-teal-500">●</span>}</button>)}</div>}
          {showMemberForm && <form onSubmit={addMember} className="flex gap-2 mt-4"><input value={memberNameInput} onChange={event => setMemberNameInput(event.target.value)} placeholder="Your name" autoFocus className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /><button className="bg-teal-600 text-white rounded-xl px-4 text-sm font-semibold">Add</button><button type="button" onClick={() => setShowMemberForm(false)} className="p-2 text-slate-400"><X size={18} /></button></form>}
        </section>

        {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {paidNotice && <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"><CheckCircle2 size={17} /> {paidNotice}</div>}

        <div className="flex items-center justify-between border-b border-slate-200 mt-7 mb-5"><div className="flex"><button onClick={() => setTab('expenses')} className={`px-4 py-3 text-sm font-bold border-b-2 -mb-px ${tab === 'expenses' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400'}`}>Expenses</button><button onClick={() => setTab('balances')} className={`px-4 py-3 text-sm font-bold border-b-2 -mb-px ${tab === 'balances' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400'}`}>Balances</button></div>{tab === 'expenses' && <button onClick={showExpenseForm ? () => setShowExpenseForm(false) : openExpenseForm} disabled={trip.members.length === 0} className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-2 rounded-full text-xs font-bold disabled:opacity-40"><Plus size={14} /> Add expense</button>}</div>

        {tab === 'expenses' && <>
          {showExpenseForm && (
            <form onSubmit={addExpense} className="bg-white rounded-2xl border border-teal-200 shadow-sm p-4 sm:p-5 mb-4">
              <div className="flex items-center justify-between mb-4"><p className="font-bold text-gray-900">New expense</p><button type="button" onClick={() => setShowExpenseForm(false)} className="text-slate-400"><X size={18} /></button></div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_130px] gap-3"><input value={description} onChange={event => setDescription(event.target.value)} placeholder="What was it? e.g. lift tickets" autoFocus className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /><input type="number" min="0.01" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} placeholder="Amount" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"><select value={category} onChange={event => setCategory(event.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white">{CATEGORIES.map((item: string) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}</select><select value={paidById} onChange={event => setPaidById(event.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"><option value="">Paid by…</option>{trip.members.map((member: any) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></div>
              <div className="mt-4"><div className="flex items-center justify-between gap-3 mb-2"><p className="text-sm font-semibold text-slate-700">Split between</p><button type="button" onClick={() => setParticipants(trip.members.map((member: any) => member.id))} className="text-xs font-semibold text-teal-700">Select all</button></div><div className="flex flex-wrap gap-2">{trip.members.map((member: any, index: number) => { const selected = participants.includes(member.id); return <button key={member.id} type="button" onClick={() => toggleParticipant(member.id)} className={`inline-flex items-center gap-1.5 rounded-full border-2 pl-1 pr-3 py-1 text-sm font-semibold transition-colors ${selected ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-400'}`}><MemberAvatar name={member.name} index={index} size="xs" />{member.name}{selected && <Check size={13} />}</button>})}</div><p className="text-xs text-slate-400 mt-2">Selected people split this expense equally. {participants.length} selected.</p></div>
              <button className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 text-sm font-bold">Save expense</button>
            </form>
          )}
          {trip.expenses.length === 0 ? <div className="text-center py-14 bg-white rounded-2xl border border-slate-100"><div className="text-5xl mb-3">🏔️</div><p className="font-bold text-gray-800">No expenses yet</p><p className="text-sm text-slate-400 mt-1">Add the first trip cost when you have one.</p></div> : <div className="flex flex-col gap-2.5">{[...trip.expenses].sort((a: any, b: any) => b.date.localeCompare(a.date)).map((expense: any) => <ExpenseCard key={expense.id} expense={expense} members={trip.members} onDelete={requestDeleteExpense} />)}</div>}
        </>}

        {tab === 'balances' && <div className="flex flex-col gap-4"><div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"><p className="px-5 pt-4 pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Net balances</p>{trip.members.map((member: any, index: number) => { const balance = balances[member.id] ?? 0; const settled = Math.abs(balance) < 0.005; return <div key={member.id} className={`px-5 py-3 flex items-center gap-3 border-t border-slate-100 ${settled ? '' : balance > 0 ? 'bg-green-50' : 'bg-red-50'}`}><MemberAvatar name={member.name} index={index} size="sm" /><button onClick={() => setEditingMember(member)} className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-teal-700">{member.name}</button><span className={`text-xs sm:text-sm font-bold ${settled ? 'text-slate-400' : balance > 0 ? 'text-green-600' : 'text-red-500'}`}>{settled ? 'Settled up' : balance > 0 ? `+${formatCurrency(balance)} owed` : `−${formatCurrency(Math.abs(balance))} owes`}</span></div>})}</div><div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"><div className="px-5 pt-4 pb-3"><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Settle up</p><p className="text-[11px] text-slate-400 mt-1">Optimised to use the fewest payments for this group.</p></div>{activeSettlements.length === 0 ? <div className="px-5 pb-5 flex items-center gap-2 text-green-600 text-sm font-semibold"><CheckCircle2 size={18} /> {paidKeys.size > 0 ? 'All payments marked as paid.' : 'All settled up.'}</div> : activeSettlements.map((transfer: any, index: number) => { const creditor = trip.members.find((member: any) => member.id === transfer.to); const hasPaymentDetails = Boolean(creditor?.payId || (creditor?.bsb && creditor?.accountNumber)); return <div key={index} className="px-4 sm:px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-gray-800 truncate max-w-[90px]">{memberName(transfer.from)}</span><ArrowRight size={14} className="text-slate-400" /><span className="text-sm font-semibold text-gray-800 truncate max-w-[90px]">{memberName(transfer.to)}</span><span className="ml-auto text-sm font-black text-teal-700">{formatCurrency(transfer.amount)}</span>{hasPaymentDetails && <button onClick={() => openPayment(transfer)} className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700"><CreditCard size={12} /> Pay now</button>}<button onClick={() => markPaid(transfer)} className="text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-teal-400 hover:text-teal-700">Mark paid</button></div>})}</div></div>}

        {tab === 'balances' && paidSettlements.length > 0 && <div className="mt-4 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm"><div className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wide text-green-700"><CheckCircle2 size={15} /> Paid</div>{paidSettlements.map((transfer: any, index: number) => <div key={index} className="flex flex-wrap items-center gap-2 border-t border-green-100 bg-green-50/60 px-4 sm:px-5 py-3"><span className="text-sm font-semibold text-slate-500 line-through">{memberName(transfer.from)}</span><ArrowRight size={13} className="text-slate-300" /><span className="text-sm font-semibold text-slate-500 line-through">{memberName(transfer.to)}</span><span className="ml-auto text-sm font-bold text-green-700">{formatCurrency(transfer.amount)}</span><button onClick={() => undoPaid(transfer)} className="rounded-lg border border-green-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50">Undo</button></div>)}</div>}

        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-gray-900">Delete “{pendingDelete.description}”?</h2>
              <p className="mt-2 text-sm text-slate-500">This removes {formatCurrency(pendingDelete.amount)} from the trip and recalculates everyone’s balances. This can’t be undone.</p>
              <div className="mt-5 flex gap-3"><button onClick={() => setPendingDelete(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button onClick={confirmDeleteExpense} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Delete expense</button></div>
            </div>
          </div>
        )}

        {editingMember && <MemberDetailSheet member={editingMember} trip={trip} onSave={saveMember} onClose={() => setEditingMember(null)} />}
        {payTarget && <PaymentSheet settlement={payTarget.settlement} debtor={payTarget.debtor} creditor={payTarget.creditor} tripName={trip.name} onMarkPaid={markPaid} onClose={() => setPayTarget(null)} />}
      </div>
    </main>
  )
}

function Message({ title, body }: { title: string; body: string }) {
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center px-5"><div className="max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm"><h1 className="text-lg font-bold text-gray-900">{title}</h1><p className="text-sm text-slate-500 mt-2 leading-relaxed">{body}</p></div></main>
}

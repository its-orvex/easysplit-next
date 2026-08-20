'use client'

import { useState } from 'react'
import { Plus, MoreVertical, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRecurring } from '@/hooks/useRecurring'
import { formatCurrency } from '@/utils/format'
import {
  createRecurringExpense, nextDueDateAfter,
  RECURRING_PRESETS, CATEGORIES, createExpense,
} from '@/utils/models'
import MemberAvatar from './MemberAvatar'

function isOverdue(dateStr: string) {
  return dateStr <= new Date().toISOString().slice(0, 10)
}

function ordinal(n: number) {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v-20)%10] || s[v] || s[0])
}

function frequencyLabel(f: string, day: number) {
  switch (f) {
    case 'weekly':      return 'weekly'
    case 'fortnightly': return 'fortnightly'
    case 'monthly':     return day ? `monthly · ${ordinal(day)} of month` : 'monthly'
    case 'quarterly':   return day ? `quarterly · ${ordinal(day)} of month` : 'quarterly'
    default: return f
  }
}

function VariableAmountModal({ recurring, onLog, onCancel }: any) {
  const [amount, setAmount] = useState(recurring.amount > 0 ? String(recurring.amount) : '')
  const val = parseFloat(amount) || 0

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Log {recurring.description}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <p className="text-sm text-slate-500 mb-3">Enter this cycle's amount:</p>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" autoFocus
            className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-slate-200 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button disabled={val <= 0} onClick={() => onLog(val)}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition-colors">
            Log expense
          </button>
        </div>
      </div>
    </div>
  )
}

function HistoryModal({ recurring, expenses, members, onClose }: any) {
  const linked = expenses.filter((e: any) => e.recurringId === recurring.id)
    .sort((a: any, b: any) => b.date.localeCompare(a.date))

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">{recurring.description} history</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1">
          {linked.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No entries logged yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {linked.map((exp: any) => {
                const payer = members.find((m: any) => m.id === exp.paidById)
                return (
                  <div key={exp.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(exp.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-400">{payer?.name ?? 'Unknown'} paid</p>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{formatCurrency(exp.amount)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <button onClick={onClose} className="mt-4 w-full border border-slate-200 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">Close</button>
      </div>
    </div>
  )
}

function RecurringCard({ recurring, members, trip, expenses, onLog, onEdit, onPause, onDelete, onHistory }: any) {
  const [menuOpen, setMenuOpen] = useState(false)
  const payer   = members.find((m: any) => m.id === recurring.paidById)
  const overdue = isOverdue(recurring.nextDueDate)
  const formatFreq = frequencyLabel(recurring.frequency, recurring.dayOfMonth)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${overdue && recurring.isActive ? 'border-amber-300' : 'border-slate-100'} ${!recurring.isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">
          {recurring.icon ?? '💳'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 text-sm">{recurring.description}</p>
            {recurring.isVariable && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded uppercase tracking-wide">Variable</span>}
            {!recurring.isActive && <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-semibold rounded uppercase tracking-wide">Paused</span>}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {recurring.isVariable ? `~${formatCurrency(recurring.amount)}/` : `${formatCurrency(recurring.amount)}/`}
            {recurring.frequency === 'monthly' ? 'month' : recurring.frequency === 'quarterly' ? 'quarter' : recurring.frequency}
            {' · '}{formatFreq}{' · '}{payer?.name ?? 'Unknown'} pays
          </p>
          {recurring.isActive && (
            <p className={`text-xs mt-0.5 font-medium ${overdue ? 'text-amber-600' : 'text-slate-400'}`}>
              {overdue ? '⚠️ Due ' : 'Next due: '}
              {new Date(recurring.nextDueDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {recurring.isActive && (
            <button onClick={() => onLog(recurring)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors">
              Log now
            </button>
          )}
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg w-40 py-1 z-20">
                <button onClick={() => { onEdit(recurring); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Edit</button>
                <button onClick={() => { onHistory(recurring); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">View history</button>
                <button onClick={() => { onPause(recurring); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">
                  {recurring.isActive ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => { onDelete(recurring.id); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RecurringForm({ trip, existing, onSave, onCancel }: any) {
  const today = new Date().toISOString().slice(0, 10)
  const [desc,         setDesc]         = useState(existing?.description ?? '')
  const [category,     setCategory]     = useState(existing?.category ?? 'other')
  const [amount,       setAmount]       = useState(existing?.amount > 0 ? String(existing.amount) : '')
  const [isVariable,   setIsVariable]   = useState(existing?.isVariable ?? false)
  const [paidById,     setPaidById]     = useState(existing?.paidById ?? trip.members[0]?.id ?? '')
  const [splitMode,    setSplitMode]    = useState(existing?.splitMode ?? 'equal')
  const [participants, setParticipants] = useState(existing?.participants ?? trip.members.map((m: any) => m.id))
  const [frequency,    setFrequency]    = useState(existing?.frequency ?? 'monthly')
  const [dayOfMonth,   setDayOfMonth]   = useState(existing?.dayOfMonth ?? 1)
  const [startDate,    setStartDate]    = useState(existing?.nextDueDate ?? today)
  const [presetQuery,  setPresetQuery]  = useState('')
  const [showPresets,  setShowPresets]  = useState(false)
  const [icon,         setIcon]         = useState(existing?.icon ?? null)

  const filteredPresets = presetQuery.length > 0
    ? (RECURRING_PRESETS as any[]).filter((p: any) => p.name.toLowerCase().includes(presetQuery.toLowerCase()))
    : []

  function applyPreset(preset: any) {
    setDesc(preset.name)
    setCategory(preset.category)
    setIsVariable(preset.variable ?? false)
    setIcon(preset.icon)
    if (preset.amount) setAmount(String(preset.amount))
    setPresetQuery('')
    setShowPresets(false)
  }

  function toggleParticipant(id: string) {
    setParticipants((prev: string[]) => prev.includes(id) ? prev.filter((p: string) => p !== id) : [...prev, id])
  }

  function handleSave() {
    if (!desc.trim()) { toast.error('Enter a description.'); return }
    if (!paidById) { toast.error('Select who pays.'); return }
    if (participants.length === 0) { toast.error('Select at least one participant.'); return }
    const rec = createRecurringExpense({
      tripId: trip.id, description: desc.trim(), category,
      amount: parseFloat(amount) || 0, isVariable, splitMode, participants,
      customSplits: null, paidById, frequency, dayOfMonth: Number(dayOfMonth),
      nextDueDate: startDate, icon,
    })
    if (existing) onSave({ ...existing, ...rec, id: existing.id })
    else onSave(rec)
  }

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
  const memberIndices = Object.fromEntries(trip.members.map((m: any, i: number) => [m.id, i]))

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-slate-300 rounded-full" /></div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">{existing ? 'Edit Recurring Bill' : 'Add Recurring Bill'}</h2>
            <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input type="text" value={desc}
                onChange={e => { setDesc(e.target.value); setPresetQuery(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onBlur={() => setTimeout(() => setShowPresets(false), 150)}
                placeholder="e.g. Rent, Netflix, AGL Electricity…" className={inputCls} />
              {showPresets && filteredPresets.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                  {filteredPresets.map((preset: any) => (
                    <button key={preset.name} type="button" onMouseDown={() => applyPreset(preset)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2">
                      <span>{preset.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{preset.name}</p>
                        {preset.amount && <p className="text-xs text-slate-400">${preset.amount}/mo</p>}
                        {preset.variable && <p className="text-xs text-slate-400">Variable amount</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
                {(CATEGORIES as string[]).map((c: string) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={isVariable} onChange={e => setIsVariable(e.target.checked)} className="rounded" />
                  Variable amount
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder={isVariable ? 'Estimated amount' : '0.00'}
                  className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
              </div>
              {isVariable && <p className="text-xs text-slate-400 mt-1">You'll be asked for the actual amount each time it's logged.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Who pays upfront</label>
              <div className="flex flex-wrap gap-2">
                {trip.members.map((m: any) => (
                  <button key={m.id} type="button" onClick={() => setPaidById(m.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${paidById === m.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'}`}>
                    <MemberAvatar name={m.name} index={memberIndices[m.id]} size="xs" />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split between</label>
              <div className="flex flex-wrap gap-2">
                {trip.members.map((m: any) => {
                  const sel = participants.includes(m.id)
                  return (
                    <button key={m.id} type="button" onClick={() => toggleParticipant(m.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${sel ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-400'}`}>
                      <MemberAvatar name={m.name} index={memberIndices[m.id]} size="xs" />
                      {m.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequency</label>
                <select value={frequency} onChange={e => setFrequency(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              {(frequency === 'monthly' || frequency === 'quarterly') && (
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Day of month</label>
                  <input type="number" min="1" max="28" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} className={inputCls} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Next due date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
        <div className="p-6 pt-3 border-t border-slate-100 flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
            {existing ? 'Save changes' : 'Add recurring bill'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  trip: any
  updateTrip: (trip: any) => void
}

export default function RecurringTab({ trip, updateTrip }: Props) {
  const { items, addRecurring, updateRecurring, deleteRecurring } = useRecurring(trip.id)
  const [showForm,    setShowForm]    = useState(false)
  const [editingRec,  setEditingRec]  = useState<any>(null)
  const [variableRec, setVariableRec] = useState<any>(null)
  const [historyRec,  setHistoryRec]  = useState<any>(null)

  const today       = new Date().toISOString().slice(0, 10)
  const activeItems = items.filter((r: any) => r.isActive)
  const pausedItems = items.filter((r: any) => !r.isActive)
  const overdueItems = activeItems.filter((r: any) => isOverdue(r.nextDueDate))

  function logRecurring(recurring: any, overrideAmount?: number) {
    const amount = overrideAmount ?? recurring.amount
    const expense = createExpense({
      description: recurring.description, category: recurring.category, amount,
      paidById: recurring.paidById, splitMode: recurring.splitMode ?? 'equal',
      participants: recurring.participants, customSplits: recurring.customSplits,
      items: null, receiptImage: null, date: today,
    })
    const taggedExpense = { ...expense, recurringId: recurring.id }
    updateTrip({ ...trip, expenses: [...trip.expenses, taggedExpense] })
    updateRecurring({
      ...recurring,
      lastLoggedDate: today,
      nextDueDate: nextDueDateAfter(recurring.nextDueDate, recurring.frequency),
      amount: overrideAmount ?? recurring.amount,
    })
    toast.success(`${recurring.description} logged — ${formatCurrency(amount)} added to expenses`)
  }

  function handleLog(recurring: any) {
    if (recurring.isVariable) setVariableRec(recurring)
    else logRecurring(recurring)
  }

  function handleLogAll() {
    const fixed    = overdueItems.filter((r: any) => !r.isVariable)
    const variable = overdueItems.filter((r: any) => r.isVariable)
    fixed.forEach((r: any) => logRecurring(r))
    if (variable.length > 0) setVariableRec(variable[0])
    if (fixed.length > 0) toast.success(`${fixed.length} bill${fixed.length !== 1 ? 's' : ''} logged automatically`)
  }

  function handlePause(recurring: any) {
    updateRecurring({ ...recurring, isActive: !recurring.isActive })
    toast.success(recurring.isActive ? 'Bill paused.' : 'Bill resumed.')
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this recurring bill? Past logged expenses are kept.')) {
      deleteRecurring(id)
    }
  }

  return (
    <div>
      {overdueItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⏰</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 mb-1">
              {overdueItems.length} bill{overdueItems.length !== 1 ? 's' : ''} due
            </p>
            <div className="flex flex-col gap-0.5 mb-3">
              {overdueItems.map((r: any) => (
                <p key={r.id} className="text-xs text-amber-700">
                  {r.icon} {r.description} — {r.isVariable ? 'variable' : formatCurrency(r.amount)}
                  {isOverdue(r.nextDueDate) ? r.nextDueDate === today ? ' · due today' : ' · overdue' : ''}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleLogAll}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors">
                Log all
              </button>
              <p className="text-xs text-amber-600 self-center">or log individually below</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Recurring Bills</p>
        <button onClick={() => { setEditingRec(null); setShowForm(true) }}
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium">
          <Plus size={14} /> Add recurring bill
        </button>
      </div>

      {activeItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔄</div>
          <p className="font-semibold text-gray-700 text-lg">No recurring bills</p>
          <p className="text-sm mt-1 text-slate-400">Add rent, subscriptions, or utilities to automate logging.</p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {activeItems.map((r: any) => (
          <RecurringCard key={r.id} recurring={r} members={trip.members} trip={trip} expenses={trip.expenses}
            onLog={handleLog} onEdit={(rec: any) => { setEditingRec(rec); setShowForm(true) }}
            onPause={handlePause} onDelete={handleDelete} onHistory={setHistoryRec} />
        ))}
      </div>

      {pausedItems.length > 0 && (
        <>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-6 mb-3">Paused</p>
          <div className="flex flex-col gap-2.5">
            {pausedItems.map((r: any) => (
              <RecurringCard key={r.id} recurring={r} members={trip.members} trip={trip} expenses={trip.expenses}
                onLog={handleLog} onEdit={(rec: any) => { setEditingRec(rec); setShowForm(true) }}
                onPause={handlePause} onDelete={handleDelete} onHistory={setHistoryRec} />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <RecurringForm trip={trip} existing={editingRec}
          onSave={(rec: any) => {
            if (editingRec) updateRecurring(rec)
            else addRecurring(rec)
            setShowForm(false)
            toast.success(editingRec ? 'Recurring bill updated.' : 'Recurring bill added.')
          }}
          onCancel={() => setShowForm(false)} />
      )}

      {variableRec && (
        <VariableAmountModal recurring={variableRec}
          onLog={(amount: number) => { logRecurring(variableRec, amount); setVariableRec(null) }}
          onCancel={() => setVariableRec(null)} />
      )}

      {historyRec && (
        <HistoryModal recurring={historyRec} expenses={trip.expenses} members={trip.members}
          onClose={() => setHistoryRec(null)} />
      )}
    </div>
  )
}

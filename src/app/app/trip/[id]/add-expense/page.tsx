'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, BedDouble, Plane, UtensilsCrossed, Car, Star, Receipt,
  Camera, Loader2, X, Plus, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useTrips } from '@/context/TripsContext'
import { createExpense, CATEGORIES, MEMBER_TAG_LABELS } from '@/utils/models'
import { formatCurrency } from '@/utils/format'
import MemberAvatar from '@/components/MemberAvatar'

const today = () => new Date().toISOString().slice(0, 10)

const CATEGORY_ICONS: Record<string, any> = {
  accommodation: BedDouble, flights: Plane, food: UtensilsCrossed,
  transport: Car, activities: Star, other: Receipt,
}

const SPLIT_OPTS = [
  { value: 'equal-all',      label: 'Split all' },
  { value: 'equal-selected', label: 'Split selected' },
  { value: 'custom',         label: 'Custom' },
  { value: 'byItem',         label: 'By item' },
]

const SMART_PRESETS = [
  { id: 'driver-free',     label: '🚗 Driver free',     tag: 'driver',      exclude: true,       onlyInclude: false },
  { id: 'kids-half',       label: '👶 Kids half',        tag: 'child',       exclude: false,      onlyInclude: false },
  { id: 'nondrinker-free', label: '🍷 Non-drinker free', tag: 'non-drinker', exclude: true,       onlyInclude: false },
  { id: 'business-only',   label: '💼 Business only',   tag: 'business',    exclude: false,      onlyInclude: true  },
]

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{children}</p>
}

function ReceiptLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white"><X size={24} /></button>
        <img src={src} alt="Receipt" className="w-full rounded-xl shadow-2xl" />
      </div>
    </div>
  )
}

function ItemRow({ item, members, memberIndices, onChange, onDelete }: any) {
  function toggleMember(memberId: string) {
    const already = item.assignedTo.includes(memberId)
    onChange({ ...item, assignedTo: already ? item.assignedTo.filter((id: string) => id !== memberId) : [...item.assignedTo, memberId] })
  }
  const allAssigned = members.every((m: any) => item.assignedTo.includes(m.id))

  return (
    <div className={`border rounded-xl p-3 ${item.assignedTo.length === 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        <input type="text" value={item.name} onChange={e => onChange({ ...item, name: e.target.value })}
          placeholder="Item name"
          className="flex-1 text-sm border-0 bg-transparent focus:outline-none font-medium text-gray-800 placeholder-slate-400" />
        <span className="text-slate-300 text-sm">$</span>
        <input type="number" min="0" step="0.01" value={item.price || ''}
          onChange={e => onChange({ ...item, price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className="w-20 text-sm text-right border-0 bg-transparent focus:outline-none font-semibold text-gray-800" />
        <button type="button" onClick={onDelete} className="p-1 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 items-center">
        <button type="button"
          onClick={() => onChange({ ...item, assignedTo: allAssigned ? [] : members.map((m: any) => m.id) })}
          className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${allAssigned ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-300'}`}>
          All
        </button>
        {members.map((m: any, i: number) => {
          const assigned = item.assignedTo.includes(m.id)
          return (
            <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${assigned ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-300'}`}>
              <MemberAvatar name={m.name} index={memberIndices[m.id] ?? i} size="xs" />
              {m.name}
            </button>
          )
        })}
      </div>
      {item.assignedTo.length === 0 && (
        <p className="text-xs text-amber-600 mt-1.5">Who&apos;s paying for {item.name || 'this item'}?</p>
      )}
    </div>
  )
}

function imageFileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ data: (reader.result as string).split(',')[1], mediaType: file.type || 'image/jpeg' })
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AddExpensePage() {
  const params        = useParams()
  const id            = params.id as string
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const { getTripById, updateTrip } = useTrips()
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const trip        = getTripById(id)
  const editId      = searchParams.get('edit')
  const editExpense = editId ? trip?.expenses?.find((e: any) => e.id === editId) : null
  const isEdit      = !!editExpense

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [receiptImage,  setReceiptImage]  = useState<string | null>(null)
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null)
  const [scanning,      setScanning]      = useState(false)
  const [showLightbox,  setShowLightbox]  = useState(false)
  const [items,         setItems]         = useState<any[]>([])

  function splitModeFromExpense(exp: any) {
    if (!exp) return 'equal-all'
    if (exp.splitMode === 'byItem') return 'byItem'
    if (exp.splitMode === 'custom') return 'custom'
    const allIds = trip?.members.map((m: any) => m.id) ?? []
    const same = allIds.length === exp.participants.length && allIds.every((id: string) => exp.participants.includes(id))
    return same ? 'equal-all' : 'equal-selected'
  }

  const [form, setForm] = useState({
    description: '', category: 'other', amount: '', date: today(),
    paidById: '', splitMode: 'equal-all', selectedParticipants: [] as string[], customSplits: {} as Record<string, string>,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!trip) return
    if (isEdit && editExpense) {
      const mode = splitModeFromExpense(editExpense)
      const cs = Object.fromEntries(trip.members.map((m: any) => {
        const found = editExpense.customSplits?.find((s: any) => s.memberId === m.id)
        return [m.id, found ? String(found.amount) : '']
      }))
      setForm({
        description: editExpense.description, category: editExpense.category,
        amount: String(editExpense.amount), date: editExpense.date,
        paidById: editExpense.paidById, splitMode: mode,
        selectedParticipants: editExpense.participants, customSplits: cs,
      })
      if (editExpense.items) setItems(editExpense.items.map((it: any) => ({ ...it, id: it.id ?? crypto.randomUUID() })))
      if (editExpense.receiptImage) {
        setReceiptBase64(editExpense.receiptImage)
        setReceiptImage(`data:image/jpeg;base64,${editExpense.receiptImage}`)
      }
    } else {
      setForm(f => ({
        ...f,
        paidById: trip.members[0]?.id ?? '',
        selectedParticipants: trip.members.map((m: any) => m.id),
        customSplits: Object.fromEntries(trip.members.map((m: any) => [m.id, ''])),
      }))
    }
  }, [trip?.id, editId])

  if (!trip) return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <p className="text-slate-500">Trip not found.</p>
      <Link href="/app" className="text-teal-600 underline text-sm mt-2 block">Back to home</Link>
    </div>
  )

  const memberIndices   = Object.fromEntries(trip.members.map((m: any, i: number) => [m.id, i]))
  const amount          = parseFloat(form.amount) || 0
  const customTotal     = Object.values(form.customSplits).map(v => parseFloat(v) || 0).reduce((a, b) => a + b, 0)
  const customRemaining = +(amount - customTotal).toFixed(2)
  const itemsTotal      = items.reduce((s, it) => s + (parseFloat(it.price) || 0), 0)
  const itemsRemaining  = +(amount - itemsTotal).toFixed(2)

  function set(field: string, value: any) { setForm(f => ({ ...f, [field]: value })) }

  function toggleParticipant(memberId: string) {
    setForm(f => {
      const already = f.selectedParticipants.includes(memberId)
      return { ...f, selectedParticipants: already ? f.selectedParticipants.filter(p => p !== memberId) : [...f.selectedParticipants, memberId] }
    })
  }

  function setCustomSplit(memberId: string, value: string) {
    setForm(f => ({ ...f, customSplits: { ...f.customSplits, [memberId]: value } }))
  }

  function addItem() {
    setItems(prev => [...prev, { id: crypto.randomUUID(), name: '', price: 0, assignedTo: [] }])
  }

  function updateItem(index: number, updated: any) {
    setItems(prev => prev.map((it, i) => i === index ? updated : it))
  }

  function deleteItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function applyPreset(preset: any) {
    const tagged = trip.members.filter((m: any) => (m.tags ?? []).includes(preset.tag))
    if (tagged.length === 0) {
      toast(`No members tagged as ${(MEMBER_TAG_LABELS as any)[preset.tag] ?? preset.tag} — tag them in their profile first.`, { icon: 'ℹ️' })
      return
    }
    if (preset.onlyInclude) {
      setForm(f => ({ ...f, selectedParticipants: tagged.map((m: any) => m.id) }))
    } else if (preset.exclude) {
      setForm(f => ({ ...f, selectedParticipants: f.selectedParticipants.filter(id => !tagged.some((m: any) => m.id === id)) }))
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setScanning(true)
    try {
      const { data, mediaType } = await imageFileToBase64(file)
      setReceiptBase64(data)
      setReceiptImage(`data:${mediaType};base64,${data}`)

      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: data, mediaType }),
      })
      const result = await response.json()

      if (result.merchant) set('description', result.merchant)
      if (result.amount > 0) set('amount', String(result.amount))
      if (result.category) set('category', result.category)
      if (result.date) {
        const parts = result.date.split('/')
        if (parts.length === 3) {
          set('date', `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`)
        }
      }
      if (result.items && result.items.length >= 2) {
        set('splitMode', 'byItem')
        setItems(result.items.map((it: any) => ({ id: crypto.randomUUID(), name: it.name, price: it.price, assignedTo: [] })))
      }
      toast.success('Receipt scanned — check the details look right')
    } catch (err) {
      console.error(err)
      toast.error("Couldn't read that receipt — please enter manually")
      setReceiptImage(null)
      setReceiptBase64(null)
    } finally {
      setScanning(false)
    }
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.description.trim()) e.description = 'Description required.'
    if (!amount || amount <= 0)   e.amount = 'Enter a valid amount.'
    if (!form.paidById)           e.paidById = 'Select who paid.'
    if (form.splitMode === 'equal-selected' && form.selectedParticipants.length === 0)
      e.participants = 'Select at least one participant.'
    if (form.splitMode === 'custom') {
      const hasAny = trip.members.some((m: any) => (parseFloat(form.customSplits[m.id]) || 0) > 0)
      if (!hasAny) e.custom = 'Enter at least one amount.'
      else if (Math.abs(customRemaining) > 0.01)
        e.custom = `Must sum to ${formatCurrency(amount)}. ${customRemaining > 0 ? formatCurrency(customRemaining) + ' left.' : formatCurrency(Math.abs(customRemaining)) + ' over.'}`
    }
    if (form.splitMode === 'byItem') {
      if (items.length === 0) e.items = 'Add at least one item.'
      else {
        const unassigned = items.filter(it => it.assignedTo.length === 0)
        if (unassigned.length > 0) e.items = `Assign members to: ${unassigned.map(it => it.name || 'unnamed item').join(', ')}`
      }
    }
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    let participants: string[], splitMode: string, customSplits: any, expenseItems: any

    if (form.splitMode === 'equal-all') {
      splitMode = 'equal'; participants = trip.members.map((m: any) => m.id); customSplits = null; expenseItems = null
    } else if (form.splitMode === 'equal-selected') {
      splitMode = 'equal'; participants = form.selectedParticipants; customSplits = null; expenseItems = null
    } else if (form.splitMode === 'byItem') {
      splitMode = 'byItem'
      const mentioned = new Set(items.flatMap(it => it.assignedTo))
      participants = Math.abs(itemsRemaining) > 0.01 ? trip.members.map((m: any) => m.id) : Array.from(mentioned) as string[]
      customSplits = null
      expenseItems = items.map(it => ({ name: it.name, price: parseFloat(it.price) || 0, assignedTo: it.assignedTo }))
    } else {
      splitMode    = 'custom'
      participants = trip.members.filter((m: any) => (parseFloat(form.customSplits[m.id]) || 0) > 0).map((m: any) => m.id)
      customSplits = participants.map(memberId => ({ memberId, amount: parseFloat(form.customSplits[memberId]) }))
      expenseItems = null
    }

    const expenseData = {
      description: form.description.trim(), category: form.category, amount,
      paidById: form.paidById, splitMode, participants, customSplits,
      items: expenseItems, receiptImage: receiptBase64, date: form.date,
    }

    if (isEdit) {
      updateTrip({ ...trip, expenses: trip.expenses.map((e: any) => e.id === editId ? { ...editExpense, ...expenseData } : e) })
      toast.success('Changes saved.')
    } else {
      updateTrip({ ...trip, expenses: [...trip.expenses, createExpense(expenseData)] })
    }
    router.push(`/app/trip/${id}`)
  }

  const perPerson =
    form.splitMode === 'equal-all' && amount > 0 ? amount / trip.members.length
    : form.splitMode === 'equal-selected' && form.selectedParticipants.length > 0 ? amount / form.selectedParticipants.length
    : null

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link href={`/app/trip/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={15} /> Back to {trip.name}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Expense' : 'Add Expense'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Scan Receipt */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />

          {receiptImage ? (
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setShowLightbox(true)}>
                <img src={receiptImage} alt="Receipt preview" className="h-[120px] w-auto rounded-xl object-cover border border-slate-200 shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-teal-700 mb-1">Receipt attached</p>
                <p className="text-xs text-slate-400 mb-2">Tap image to view full size</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={scanning}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                    {scanning ? 'Scanning...' : 'Re-scan'}
                  </button>
                  <span className="text-slate-300">·</span>
                  <button type="button" onClick={() => { setReceiptImage(null); setReceiptBase64(null) }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                {isMobile && (
                  <button type="button" onClick={() => cameraInputRef.current?.click()} disabled={scanning}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-teal-300 hover:border-teal-500 text-teal-600 hover:text-teal-800 rounded-xl py-3 text-sm font-medium transition-colors disabled:opacity-60">
                    {scanning ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    {scanning ? 'Scanning...' : 'Take Photo'}
                  </button>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={scanning}
                  className={`${isMobile ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 border-2 border-dashed border-teal-300 hover:border-teal-500 text-teal-600 hover:text-teal-800 rounded-xl py-3 text-sm font-medium transition-colors disabled:opacity-60`}>
                  {scanning && !isMobile ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  {scanning && !isMobile ? 'Reading receipt...' : '📷 Scan Receipt'}
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">or enter manually below</p>
            </>
          )}
        </div>

        {/* Amount & Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionHeader>Amount & Details</SectionHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="e.g. Hotel night 1" className={inputCls} autoFocus={!isEdit} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (AUD)</label>
                <input type="number" min="0" step="0.01" value={form.amount}
                  onChange={e => set('amount', e.target.value)} placeholder="0.00" className={inputCls} />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {(CATEGORIES as string[]).map(c => {
                  const Icon   = CATEGORY_ICONS[c]
                  const active = form.category === c
                  return (
                    <button key={c} type="button" onClick={() => set('category', c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>
                      <Icon size={12} />{c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Who Paid */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionHeader>Who Paid</SectionHeader>
          <div className="flex flex-wrap gap-2">
            {trip.members.map((m: any) => {
              const active = form.paidById === m.id
              return (
                <button key={m.id} type="button" onClick={() => set('paidById', m.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'}`}>
                  <MemberAvatar name={m.name} index={memberIndices[m.id]} size="xs" />
                  {m.name}
                </button>
              )
            })}
          </div>
          {errors.paidById && <p className="text-red-500 text-xs mt-2">{errors.paidById}</p>}
        </div>

        {/* How to Split */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionHeader>How to Split</SectionHeader>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
            {SPLIT_OPTS.map(opt => (
              <button key={opt.value} type="button" onClick={() => set('splitMode', opt.value)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${form.splitMode === opt.value ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {form.splitMode === 'equal-all' && amount > 0 && (
            <p className="text-sm text-teal-700 bg-teal-50 px-3 py-2 rounded-lg">
              Each of the {trip.members.length} members owes {formatCurrency(perPerson!)}
            </p>
          )}

          {form.splitMode === 'equal-selected' && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Tap to include / exclude:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {trip.members.map((m: any) => {
                  const sel = form.selectedParticipants.includes(m.id)
                  return (
                    <button key={m.id} type="button" onClick={() => toggleParticipant(m.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${sel ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-400'}`}>
                      <MemberAvatar name={m.name} index={memberIndices[m.id]} size="xs" />
                      {m.name}
                      {sel && perPerson != null && amount > 0 && <span className="text-xs font-semibold text-teal-600">{formatCurrency(perPerson)}</span>}
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400 mb-2">Presets (tap to apply):</p>
                <div className="flex flex-wrap gap-2">
                  {SMART_PRESETS.map(preset => (
                    <button key={preset.id} type="button" onClick={() => applyPreset(preset)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-all">
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              {errors.participants && <p className="text-red-500 text-xs mt-2">{errors.participants}</p>}
            </div>
          )}

          {form.splitMode === 'custom' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Enter each person&apos;s share:</p>
                {amount > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${Math.abs(customRemaining) < 0.01 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {Math.abs(customRemaining) < 0.01 ? 'Balanced ✓' : customRemaining > 0 ? `${formatCurrency(customRemaining)} left` : `${formatCurrency(Math.abs(customRemaining))} over`}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {trip.members.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <MemberAvatar name={m.name} index={memberIndices[m.id]} size="sm" />
                    <span className="text-sm text-gray-700 flex-1 truncate">{m.name}</span>
                    <input type="number" min="0" step="0.01" value={form.customSplits[m.id] ?? ''}
                      onChange={e => setCustomSplit(m.id, e.target.value)} placeholder="0.00"
                      className="w-28 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-right" />
                  </div>
                ))}
              </div>
              {errors.custom && <p className="text-red-500 text-xs mt-2">{errors.custom}</p>}
            </div>
          )}

          {form.splitMode === 'byItem' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Assign each item to who ordered it:</p>
                {amount > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${Math.abs(itemsRemaining) < 0.01 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {Math.abs(itemsRemaining) < 0.01
                      ? `${formatCurrency(itemsTotal)} ✓`
                      : itemsRemaining > 0 ? `${formatCurrency(itemsRemaining)} unassigned` : `${formatCurrency(Math.abs(itemsRemaining))} over`}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 mb-3">
                {items.map((item, index) => (
                  <ItemRow key={item.id ?? index} item={item} members={trip.members}
                    memberIndices={memberIndices}
                    onChange={(updated: any) => updateItem(index, updated)}
                    onDelete={() => deleteItem(index)} />
                ))}
              </div>
              <button type="button" onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium">
                <Plus size={14} /> Add item
              </button>
              {amount > 0 && Math.abs(itemsRemaining) > 0.01 && items.length > 0 && (
                <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
                  Items total {formatCurrency(itemsTotal)}, expense is {formatCurrency(amount)} — difference of {formatCurrency(Math.abs(itemsRemaining))} will be split equally among all
                </p>
              )}
              {errors.items && <p className="text-red-500 text-xs mt-2">{errors.items}</p>}
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-full transition-colors text-sm shadow-sm">
          {isEdit ? 'Save Changes' : 'Add Expense'}
        </button>
      </form>

      {showLightbox && receiptImage && (
        <ReceiptLightbox src={receiptImage} onClose={() => setShowLightbox(false)} />
      )}
    </div>
  )
}

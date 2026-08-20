'use client'

import { useState } from 'react'
import { Trash2, Pencil, BedDouble, Plane, UtensilsCrossed, Car, Star, Receipt, Camera, ChevronDown, X } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { calculateMemberShares } from '@/utils/settlement'
import MemberAvatar from '@/components/MemberAvatar'

const CATEGORY_ICONS: Record<string, any> = {
  accommodation: BedDouble, flights: Plane, food: UtensilsCrossed,
  transport: Car, activities: Star, other: Receipt,
}
const CATEGORY_COLOURS: Record<string, string> = {
  accommodation: 'text-blue-500', flights: 'text-sky-500', food: 'text-orange-500',
  transport: 'text-yellow-600', activities: 'text-purple-500', other: 'text-slate-400',
}

function ReceiptLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X size={24} />
        </button>
        <img src={src} alt="Receipt" className="w-full rounded-xl shadow-2xl" />
      </div>
    </div>
  )
}

interface Props {
  expense: any
  members: any[]
  onDelete?: ((id: string) => void) | null
  onEdit?: ((expense: any) => void) | null
  readOnly?: boolean
}

export default function ExpenseCard({ expense, members, onDelete, onEdit, readOnly = false }: Props) {
  const [showReceipt, setShowReceipt] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const Icon       = CATEGORY_ICONS[expense.category] ?? Receipt
  const iconColour = CATEGORY_COLOURS[expense.category] ?? CATEGORY_COLOURS.other
  const payer      = members.find((m: any) => m.id === expense.paidById)
  const participants = members.filter((member: any) => expense.participants?.includes(member.id))
  const participantNames = participants.map((member: any) => member.name)
  const shares = (calculateMemberShares(members, [expense]) as Record<string, Record<string, number>>)[expense.id] ?? {}

  let splitSummary
  if (expense.splitMode === 'byItem' && expense.items) {
    splitSummary = `Split by item · ${participantNames.join(', ')}`
  } else if (expense.splitMode === 'custom' && expense.customSplits) {
    splitSummary = `Custom split · ${participantNames.join(', ')}`
  } else {
    splitSummary = `Split by ${participantNames.join(', ')}`
  }

  const receiptSrc = expense.receiptImage
    ? `data:image/jpeg;base64,${expense.receiptImage}`
    : null

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div onClick={() => setExpanded(value => !value)} className="p-4 flex items-center gap-3 sm:gap-4 cursor-pointer">
          <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Icon size={18} className={iconColour} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{expense.description}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {new Date(expense.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              {' · '}
              <span className="text-slate-600 font-medium">{payer?.name ?? 'Unknown'} paid</span>
              {' · '}
              {splitSummary}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-bold text-gray-900 text-sm mr-1">{formatCurrency(expense.amount)}</span>
            <ChevronDown size={14} className={`text-slate-300 transition-transform ${expanded ? 'rotate-180' : ''}`} />

          {receiptSrc && (
            <button
              onClick={event => { event.stopPropagation(); setShowReceipt(true) }}
              className="p-1.5 text-teal-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="View receipt"
            >
              <Camera size={13} />
            </button>
          )}

          {!readOnly && (
            <>
              {onEdit && (
                <button onClick={event => { event.stopPropagation(); onEdit(expense) }}
                  className="p-1.5 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  aria-label="Edit expense">
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button onClick={event => { event.stopPropagation(); onDelete(expense.id) }}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete expense">
                  <Trash2 size={13} />
                </button>
              )}
            </>
          )}
          </div>
        </div>

        {expanded && (
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Who this was split between</p>
            <div className="flex flex-col gap-2">
              {participants.map((member: any) => {
                const memberIndex = members.findIndex((item: any) => item.id === member.id)
                return (
                  <div key={member.id} className="flex items-center gap-2">
                    <MemberAvatar name={member.name} index={memberIndex} size="xs" />
                    <span className="text-sm font-medium text-slate-700 flex-1">{member.name}</span>
                    <span className="text-sm font-bold text-slate-700">{formatCurrency(shares[member.id] ?? 0)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showReceipt && receiptSrc && (
        <ReceiptLightbox src={receiptSrc} onClose={() => setShowReceipt(false)} />
      )}
    </>
  )
}

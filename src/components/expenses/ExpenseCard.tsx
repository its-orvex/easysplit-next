'use client'

import { useState } from 'react'
import { Trash2, Pencil, BedDouble, Plane, UtensilsCrossed, Car, Star, Receipt, Camera, X } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

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

  const Icon       = CATEGORY_ICONS[expense.category] ?? Receipt
  const iconColour = CATEGORY_COLOURS[expense.category] ?? CATEGORY_COLOURS.other
  const payer      = members.find((m: any) => m.id === expense.paidById)

  let splitSummary
  if (expense.splitMode === 'byItem' && expense.items) {
    splitSummary = `Split by item (${expense.items.length} item${expense.items.length !== 1 ? 's' : ''})`
  } else if (expense.splitMode === 'custom' && expense.customSplits) {
    splitSummary = 'Custom split'
  } else {
    splitSummary = `Split equally (${expense.participants.length})`
  }

  const receiptSrc = expense.receiptImage
    ? `data:image/jpeg;base64,${expense.receiptImage}`
    : null

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Icon size={18} className={iconColour} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate text-sm">{expense.description}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(expense.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            {' · '}
            <span className="text-slate-500">{payer?.name ?? 'Unknown'}</span> paid
            {' · '}
            {splitSummary}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-bold text-gray-900 text-sm mr-1">{formatCurrency(expense.amount)}</span>

          {receiptSrc && (
            <button
              onClick={() => setShowReceipt(true)}
              className="p-1.5 text-teal-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="View receipt"
            >
              <Camera size={13} />
            </button>
          )}

          {!readOnly && (
            <>
              {onEdit && (
                <button onClick={() => onEdit(expense)}
                  className="p-1.5 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  aria-label="Edit expense">
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(expense.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete expense">
                  <Trash2 size={13} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showReceipt && receiptSrc && (
        <ReceiptLightbox src={receiptSrc} onClose={() => setShowReceipt(false)} />
      )}
    </>
  )
}

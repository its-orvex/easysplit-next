'use client'

import { useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { BANKS } from '@/utils/models'
import { formatCurrency } from '@/utils/format'

function BankButton({ bank, highlighted, onClick }: { bank: any; highlighted: boolean; onClick: (b: any) => void }) {
  return (
    <button
      onClick={() => onClick(bank)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
        highlighted
          ? 'border-teal-500 bg-teal-50 text-teal-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
        style={{ backgroundColor: bank.colour }}
      >
        {bank.name.slice(0, 3).toUpperCase()}
      </div>
      {bank.name}
    </button>
  )
}

interface Props {
  settlement: any
  debtor: any
  creditor: any
  tripName: string
  onMarkPaid: (s: any) => void
  onClose: () => void
}

export default function PaymentSheet({ settlement, debtor, creditor, tripName, onMarkPaid, onClose }: Props) {
  const [phase,   setPhase]   = useState<'choose' | 'opening'>('choose')
  const [deepErr, setDeepErr] = useState(false)

  const amount      = formatCurrency(settlement.amount)
  const recipientId = creditor?.payId

  async function handleBankClick(bank: any) {
    const text = `${recipientId ?? creditor?.name} — ${amount} — ${tripName}`
    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }

    if (bank.deepLink) {
      setPhase('opening')
      setDeepErr(false)
      window.location.href = bank.deepLink
      setTimeout(() => setDeepErr(true), 2500)
    } else {
      setPhase('opening')
      setDeepErr(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50">
      <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Pay via your bank</h2>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <X size={18} />
            </button>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-5 text-center">
            <p className="text-sm text-teal-600 font-medium mb-0.5">Amount to send</p>
            <p className="text-3xl font-black text-teal-700 mb-1">{amount}</p>
            {recipientId
              ? <p className="text-sm text-teal-600">to <span className="font-semibold">{recipientId}</span></p>
              : <p className="text-sm text-amber-600">⚠️ {creditor?.name} has no PayID set — contact them directly</p>
            }
          </div>

          {phase === 'choose' && (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Choose your bank</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {BANKS.map((bank: any) => (
                  <BankButton
                    key={bank.key}
                    bank={bank}
                    highlighted={bank.key === debtor?.preferredBank}
                    onClick={handleBankClick}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 text-center">
                Amount copied to clipboard — paste it in your bank app
              </p>
            </>
          )}

          {phase === 'opening' && (
            <div className="text-center py-4">
              {deepErr ? (
                <div>
                  <AlertCircle size={32} className="text-amber-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-800 mb-1">App not opening?</p>
                  <p className="text-xs text-slate-500 mb-4">
                    Your payment details are copied — open your banking app manually and paste.
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Opening your bank app…</p>
                  <p className="text-xs text-slate-500">Payment details copied to clipboard.</p>
                </div>
              )}
              <p className="text-sm font-medium text-gray-700 mb-3">Done? Mark this as paid?</p>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border border-slate-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">
                  Not yet
                </button>
                <button
                  onClick={() => { onMarkPaid(settlement); onClose() }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Yes, mark paid
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

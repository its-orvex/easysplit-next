'use client'

import { useState } from 'react'
import { X, Copy, Check, MessageCircle, Eye } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0 ${
        copied ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
      }`}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

interface Props {
  trip: any
  onClose: () => void
}

export default function InviteSheet({ trip, onClose }: Props) {
  const BASE    = typeof window !== 'undefined' ? window.location.origin : ''
  const joinUrl = `${BASE}/join/${trip.inviteCode}`
  const viewUrl = `${BASE}/view/${trip.shareToken}`

  const waMessage = encodeURIComponent(
    `Hey! We're using EasySplit to track expenses for "${trip.name}".\n` +
    `Join with code: ${trip.inviteCode}\n` +
    `Or tap here: ${joinUrl}`
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50">
      <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Invite Friends</h2>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Join Code</p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-3xl font-black text-gray-900 tracking-[0.2em]">{trip.inviteCode}</span>
              <CopyButton text={trip.inviteCode} label="Copy code" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Join Link</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600 truncate">{joinUrl}</span>
              <CopyButton text={joinUrl} />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 inline-block">
              <QRCodeSVG value={joinUrl} size={160} level="M" />
            </div>
          </div>

          <a
            href={`https://wa.me/?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-sm py-3 rounded-xl transition-colors mb-5"
          >
            <MessageCircle size={16} />
            Share via WhatsApp
          </a>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Eye size={14} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">View-only link</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">Share with anyone to let them view balances without joining.</p>
            <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
              <span className="text-xs text-slate-500 truncate">{viewUrl}</span>
              <CopyButton text={viewUrl} label="Copy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

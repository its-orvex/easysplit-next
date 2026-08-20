'use client'

import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'

const DISMISSED_KEY = 'easysplit-pwa-dismissed'

function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
}

export default function PWAInstallBanner() {
  const [show,        setShow]        = useState(false)
  const [isIos,       setIsIos]       = useState(false)
  const [deferredEvt, setDeferredEvt] = useState<any>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (isInStandaloneMode()) return
    if (localStorage.getItem(DISMISSED_KEY)) return

    const ios = isIOS()
    setIsIos(ios)

    if (ios) {
      setShow(true)
      return
    }

    function handler(e: Event) {
      e.preventDefault()
      setDeferredEvt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
  }

  async function install() {
    if (!deferredEvt) return
    deferredEvt.prompt()
    const { outcome } = await deferredEvt.userChoice
    if (outcome === 'accepted') setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-lg">
          ÷
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Add EasySplit to Home Screen</p>
          {isIos ? (
            <p className="text-xs text-slate-500 mt-0.5">
              Tap <Share size={11} className="inline" /> then &ldquo;Add to Home Screen&rdquo;
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">Install for quick access, offline use</p>
          )}
          {!isIos && deferredEvt && (
            <button onClick={install}
              className="mt-2 flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              <Download size={12} /> Install
            </button>
          )}
        </div>
        <button onClick={dismiss} className="p-1 text-slate-300 hover:text-slate-500 flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

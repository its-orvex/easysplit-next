'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Split, LogIn, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

function UserMenu() {
  const { user, signOut, setShowAuthModal } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-400 px-3 py-1.5 rounded-full transition-colors"
      >
        <LogIn size={14} /> Sign in
      </button>
    )
  }

  const initial = (user.displayName ?? user.email ?? '?')[0].toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <span className="text-sm font-medium text-gray-800 hidden sm:block max-w-[100px] truncate">
          {user.displayName ?? user.email}
        </span>
        <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg w-44 py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-gray-800 truncate">{user.displayName ?? 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { signOut(); setOpen(false) }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const { showAuthModal } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
              <Split size={16} className="text-white" />
            </div>
            <span className="text-teal-600 font-black text-xl tracking-tight">EasySplit</span>
          </Link>
          <UserMenu />
        </div>
      </header>
      {showAuthModal && <AuthModal />}
    </>
  )
}

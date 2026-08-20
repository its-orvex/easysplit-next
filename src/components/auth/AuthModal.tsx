'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { IS_CONFIGURED } from '@/lib/firebase'

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.4 13.1 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 2.9-2.2 5.4-4.6 7.1l7.2 5.6c4.2-3.9 6.6-9.6 6.6-16.7z"/>
      <path fill="#FBBC05" d="M10.6 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6L2.3 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.1-6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.2-5.6c-2 1.4-4.6 2.1-8 2.1-6.3 0-11.6-3.6-14.4-8.8l-8 6.2C6.6 42.6 14.6 48 24 48z"/>
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg width="16" height="18" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 370.3 45.5 102.3 217.6 39.5c71.2-27.2 136-20 175.3.3 50.3 28.6 87.5 82 87.5 82s99.9-120.1 265.6-120.1c93.4 0 185.4 55.7 230.5 131z"/>
    </svg>
  )
}

export default function AuthModal() {
  const { setShowAuthModal, signInWithGoogle, signInWithApple } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError]     = useState('')

  async function handleGoogle() {
    if (!IS_CONFIGURED) {
      setError('Firebase is not configured yet. Add your credentials to .env.local')
      return
    }
    try {
      setLoading('google'); setError('')
      await signInWithGoogle()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleApple() {
    if (!IS_CONFIGURED) {
      setError('Firebase is not configured yet. Add your credentials to .env.local')
      return
    }
    try {
      setLoading('apple'); setError('')
      await signInWithApple()
    } catch {
      setError('Apple Sign-In requires additional setup in the Firebase console.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-7">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-xl">÷</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sign in to EasySplit</h2>
          <p className="text-sm text-slate-500 mt-1.5">Save your trips across all your devices</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 w-full border border-slate-200 bg-white hover:bg-slate-50 text-gray-800 font-medium text-sm py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <GoogleLogo />
            {loading === 'google' ? 'Signing in…' : 'Continue with Google'}
          </button>

          <button
            onClick={handleApple}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-900 text-white font-medium text-sm py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <AppleLogo />
            {loading === 'apple' ? 'Signing in…' : 'Continue with Apple'}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-3 text-center leading-relaxed">{error}</p>
        )}

        <p className="text-xs text-slate-400 text-center mt-5">No password needed. No spam.</p>

        {!IS_CONFIGURED && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-center">
            ⚠️ Firebase not configured — add credentials to <code className="font-mono">.env.local</code>
          </p>
        )}
      </div>
    </div>
  )
}

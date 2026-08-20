'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Receipt, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { IS_CONFIGURED } from '@/lib/firebase'
import { getTripByInviteCode, joinTrip } from '@/hooks/useFirestore'
import { createMember } from '@/utils/models'
import { formatCurrency } from '@/utils/format'

type Status = 'loading' | 'not-configured' | 'found' | 'not-found' | 'joining' | 'prompt-login' | 'error'

export default function JoinTripPage() {
  const params = useParams()
  const code   = params.code as string
  const router = useRouter()
  const { user, setShowAuthModal } = useAuth()

  const [trip,   setTrip]   = useState<any>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error,  setError]  = useState('')

  useEffect(() => {
    if (!IS_CONFIGURED) { setStatus('not-configured'); return }
    getTripByInviteCode(code)
      .then((t: any) => { setTrip(t); setStatus(t ? 'found' : 'not-found') })
      .catch(() => setStatus('error'))
  }, [code])

  useEffect(() => {
    if (user && trip && status === 'prompt-login') handleJoin()
  }, [user])

  async function handleJoin() {
    if (!user) { setShowAuthModal(true); setStatus('prompt-login'); return }

    if (trip.memberIds?.includes(user.uid)) {
      router.push(`/app/trip/${trip.id}`)
      return
    }

    setStatus('joining')
    try {
      const member = createMember(user.displayName ?? user.email ?? 'Member', {
        id: user.uid,
        email: user.email,
        isGuest: false,
      })
      await joinTrip(trip.id, member)
      router.push(`/app/trip/${trip.id}`)
    } catch (e: any) {
      setError(e.message)
      setStatus('error')
    }
  }

  const totalSpend = trip?.expenses?.reduce((s: number, e: any) => s + e.amount, 0) ?? 0

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {status === 'loading' && (
        <p className="text-slate-400 text-sm">Looking up trip…</p>
      )}

      {status === 'not-configured' && (
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Firebase not set up</p>
          <p className="text-sm text-slate-500 mb-4">
            Invite codes require Firestore. Configure your <code className="font-mono">.env.local</code> first.
          </p>
          <Link href="/app" className="text-teal-600 text-sm underline">Back to home</Link>
        </div>
      )}

      {status === 'not-found' && (
        <div>
          <div className="text-5xl mb-4">🤔</div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Code not found</p>
          <p className="text-sm text-slate-500 mb-4">
            Double-check the invite code <strong className="font-mono">{code}</strong> and try again.
          </p>
          <Link href="/app" className="text-teal-600 text-sm underline">Back to home</Link>
        </div>
      )}

      {(status === 'found' || status === 'joining' || status === 'prompt-login') && trip && (
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-6">
            <div className="text-4xl mb-3">✈️</div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{trip.name}</h1>
            <p className="text-slate-400 text-sm mb-5">You&apos;ve been invited to join this trip</p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-teal-500" />
                {trip.members?.length ?? 0} members
              </span>
              <span className="flex items-center gap-1.5">
                <Receipt size={14} className="text-teal-500" />
                {trip.expenses?.length ?? 0} expenses
              </span>
            </div>
            {totalSpend > 0 && (
              <p className="text-sm font-semibold text-gray-700 mt-3">
                Total spend: {formatCurrency(totalSpend)}
              </p>
            )}
          </div>

          {!user && (
            <p className="text-sm text-slate-500 mb-4">Sign in to join this trip</p>
          )}

          <button
            onClick={handleJoin}
            disabled={status === 'joining'}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            {status === 'joining' ? 'Joining…' : user ? 'Join this trip' : 'Sign in & Join'}
          </button>

          <Link href="/app" className="block mt-4 text-sm text-slate-400 hover:text-slate-600">
            Not now
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <p className="text-lg font-semibold text-red-600 mb-2">Something went wrong</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Link href="/app" className="text-teal-600 text-sm underline">Back to home</Link>
        </div>
      )}
    </div>
  )
}

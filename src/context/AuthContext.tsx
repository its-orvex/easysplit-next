'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, IS_CONFIGURED } from '@/lib/firebase'

interface AuthContextValue {
  user: any
  authLoading: boolean
  signInWithGoogle: () => Promise<any>
  signInWithApple: () => Promise<any>
  signOut: () => Promise<void>
  showAuthModal: boolean
  setShowAuthModal: (v: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(IS_CONFIGURED)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!auth) { setAuthLoading(false); return }
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  async function signInWithGoogle() {
    if (!auth) throw new Error('Firebase is not configured')
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    setShowAuthModal(false)
    return result
  }

  async function signInWithApple() {
    if (!auth) throw new Error('Firebase is not configured')
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
    const result = await signInWithPopup(auth, provider)
    setShowAuthModal(false)
    return result
  }

  async function signOut() {
    if (!auth) return
    await fbSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, authLoading,
      signInWithGoogle, signInWithApple, signOut,
      showAuthModal, setShowAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

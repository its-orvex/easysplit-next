'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import { IS_CONFIGURED } from '@/lib/firebase'
import * as FS from '@/hooks/useFirestore'

const LS_KEY     = 'easysplit-trips'
const LS_OLD_KEY = 'splitwise-trips'

function loadLS() {
  try {
    const v = localStorage.getItem(LS_KEY)
    if (v) return JSON.parse(v)
    const old = localStorage.getItem(LS_OLD_KEY)
    if (old) {
      localStorage.setItem(LS_KEY, old)
      localStorage.removeItem(LS_OLD_KEY)
      return JSON.parse(old)
    }
  } catch { /* ignore */ }
  return []
}

function saveLS(trips: any[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(trips)) } catch { /* ignore */ }
}

function clearLS() {
  localStorage.removeItem(LS_KEY)
}

interface TripsContextValue {
  trips: any[]
  loading: boolean
  addTrip: (trip: any) => Promise<string>
  updateTrip: (trip: any) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  getTripById: (id: string) => any
}

const TripsContext = createContext<TripsContextValue | null>(null)

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [trips, setTrips]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const migratedRef           = useRef(false)

  useEffect(() => {
    if (!user || !IS_CONFIGURED) {
      setTrips(loadLS())
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = FS.subscribeToUserTrips(user.uid, async fsTrips => {
      setTrips(fsTrips)
      setLoading(false)

      const migKey = `easysplit-migrated-${user.uid}`
      if (!migratedRef.current && !localStorage.getItem(migKey)) {
        migratedRef.current = true
        const localTrips = loadLS()
        if (localTrips.length > 0 && fsTrips.length === 0) {
          for (const t of localTrips) {
            await FS.createTrip({
              ...t,
              createdBy: user.uid,
              memberIds: Array.from(new Set([user.uid, ...(t.memberIds ?? t.members.map((m: any) => m.id))])),
            })
          }
          clearLS()
          toast.success('Your trips have been saved to your account.')
        }
        localStorage.setItem(migKey, '1')
      }
    })

    return unsubscribe
  }, [user])

  useEffect(() => {
    if (!user || !IS_CONFIGURED) saveLS(trips)
  }, [trips, user])

  async function addTrip(trip: any): Promise<string> {
    if (user && IS_CONFIGURED) {
      return await FS.createTrip({
        ...trip,
        createdBy: user.uid,
        memberIds: Array.from(new Set([user.uid, ...trip.members.map((m: any) => m.id)])),
      })
    }
    setTrips(prev => [trip, ...prev])
    return trip.id
  }

  async function updateTrip(updatedTrip: any) {
    if (user && IS_CONFIGURED) {
      await FS.updateTrip(updatedTrip.id, updatedTrip)
    } else {
      setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t))
    }
  }

  async function deleteTrip(tripId: string) {
    if (user && IS_CONFIGURED) {
      await FS.deleteTrip(tripId)
    } else {
      setTrips(prev => prev.filter(t => t.id !== tripId))
    }
  }

  function getTripById(id: string) {
    return trips.find(t => t.id === id) ?? null
  }

  return (
    <TripsContext.Provider value={{ trips, loading, addTrip, updateTrip, deleteTrip, getTripById }}>
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(TripsContext)
  if (!ctx) throw new Error('useTrips must be inside TripsProvider')
  return ctx
}

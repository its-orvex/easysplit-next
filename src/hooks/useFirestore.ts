import { db } from '@/lib/firebase'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, onSnapshot, getDocs,
  getDoc, setDoc, runTransaction, serverTimestamp, arrayUnion,
} from 'firebase/firestore'

const COL = 'trips'
const SHARED_COL = 'sharedTrips'

export function subscribeToUserTrips(userId: string, callback: (trips: any[]) => void) {
  if (!db) { callback([]); return () => {} }

  const q = query(collection(db, COL), where('memberIds', 'array-contains', userId))
  return onSnapshot(
    q,
    snap => {
      const trips = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      trips.sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      callback(trips)
    },
    err => { console.error('[Firestore] subscription error:', err); callback([]) }
  )
}

export async function createTrip(tripData: any) {
  if (!db) return tripData.id ?? null
  const { id: _localId, ...data } = tripData
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateTrip(tripId: string, data: any) {
  if (!db || !tripId) return
  const { id: _ignore, ...rest } = data
  await updateDoc(doc(db, COL, tripId), rest)
}

export async function deleteTrip(tripId: string) {
  if (!db || !tripId) return
  await deleteDoc(doc(db, COL, tripId))
}

export async function getTripByInviteCode(code: string) {
  if (!db) return null
  const q = query(collection(db, COL), where('inviteCode', '==', code.toUpperCase()))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getTripByShareToken(shareToken: string) {
  if (!db) return null
  const q = query(collection(db, COL), where('shareToken', '==', shareToken))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function joinTrip(tripId: string, member: any) {
  if (!db || !tripId) return
  await updateDoc(doc(db, COL, tripId), {
    members:   arrayUnion(member),
    memberIds: arrayUnion(member.id),
  })
}

export function subscribeToSharedTrip(
  slug: string,
  callback: (trip: any | null) => void,
  onError?: (error: Error) => void,
) {
  if (!db) { callback(null); return () => {} }

  return onSnapshot(
    doc(db, SHARED_COL, slug),
    snap => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    error => onError?.(error),
  )
}

export async function ensureSharedTrip(slug: string, initialTrip: any) {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, SHARED_COL, slug)
  const existing = await getDoc(ref)
  if (existing.exists()) return { id: existing.id, ...existing.data() }

  await setDoc(ref, { ...initialTrip, slug, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return { id: slug, ...initialTrip }
}

export async function updateSharedTrip(slug: string, data: any) {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, SHARED_COL, slug)
  await runTransaction(db, async transaction => {
    const current = await transaction.get(ref)
    if (!current.exists()) throw new Error('Shared trip not found')
    transaction.update(ref, { ...data, updatedAt: serverTimestamp() })
  })
}

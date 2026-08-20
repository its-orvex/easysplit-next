'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { useTrips } from '@/context/TripsContext'
import { formatCurrency } from '@/utils/format'
import MemberAvatar from '@/components/MemberAvatar'

function TripCard({ trip, onDelete }: { trip: any; onDelete: (trip: any) => void }) {
  const totalSpend    = trip.expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
  const previewMembers = trip.members.slice(0, 5)
  const overflow      = trip.members.length - previewMembers.length

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all border-l-4 border-l-teal-500">
      <Link href={`/app/trip/${trip.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate pr-6">{trip.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(trip.createdAt?.seconds ? trip.createdAt.seconds * 1000 : trip.createdAt)
                .toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <span className="flex-shrink-0 text-base font-bold text-gray-900">{formatCurrency(totalSpend)}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          <div className="flex -space-x-1.5">
            {previewMembers.map((m: any, idx: number) => (
              <div key={m.id} className="ring-2 ring-white rounded-full">
                <MemberAvatar name={m.name} index={idx} size="sm" />
              </div>
            ))}
          </div>
          {overflow > 0 && <span className="text-xs text-slate-400 ml-1">+{overflow} more</span>}
          <span className="ml-auto text-xs text-slate-400">
            {trip.expenses.length} expense{trip.expenses.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Link>
      <button
        onClick={e => { e.preventDefault(); onDelete(trip) }}
        className="absolute top-3.5 right-3.5 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Delete trip"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function ConfirmDialog({ trip, onConfirm, onCancel }: { trip: any; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Delete &quot;{trip.name}&quot;?</h2>
        <p className="text-sm text-slate-500 mb-5">
          This will permanently delete the trip and all {trip.expenses.length} expense{trip.expenses.length !== 1 ? 's' : ''}. This can&apos;t be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-slate-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { trips, loading, deleteTrip } = useTrips()
  const [pendingDelete, setPendingDelete] = useState<any>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">EasySplit</h1>
          <p className="text-slate-500 text-sm mt-1">Split bills, settle up fairly.</p>
        </div>
        <Link
          href="/app/new-trip"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Trip
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading your trips…</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🧳</div>
          <p className="font-semibold text-gray-700 text-lg">No trips yet</p>
          <p className="text-sm mt-1 text-slate-400">Create your first trip to start splitting.</p>
          <Link href="/app/new-trip"
            className="inline-flex items-center gap-2 mt-6 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-sm">
            <Plus size={15} />
            Create your first trip
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={setPendingDelete} />
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          trip={pendingDelete}
          onConfirm={() => { deleteTrip(pendingDelete.id); setPendingDelete(null) }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

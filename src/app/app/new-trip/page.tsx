'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { useTrips } from '@/context/TripsContext'
import { createTrip, createMember } from '@/utils/models'

const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"

export default function NewTripPage() {
  const router   = useRouter()
  const { addTrip } = useTrips()

  const [name,    setName]    = useState('')
  const [members, setMembers] = useState([
    { id: crypto.randomUUID(), name: '' },
    { id: crypto.randomUUID(), name: '' },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addMember() {
    setMembers(prev => [...prev, { id: crypto.randomUUID(), name: '' }])
  }

  function removeMember(id: string) {
    if (members.length <= 2) return
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  function updateMemberName(id: string, value: string) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, name: value } : m))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Trip name is required.'
    const filled = members.filter(m => m.name.trim())
    if (filled.length < 2) e.members = 'Add at least 2 members.'
    const names = filled.map(m => m.name.trim().toLowerCase())
    if (new Set(names).size !== names.length) e.members = 'Member names must be unique.'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const filledMembers = members.filter(m => m.name.trim()).map(m => createMember(m.name))
    const trip = createTrip({ name: name.trim(), members: filledMembers })
    addTrip(trip)
    router.push(`/app/trip/${trip.id}`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Trip</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Trip Details</p>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Bali 2025" className={inputCls} autoFocus />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Members</p>
          <div className="flex flex-col gap-2">
            {members.map((member, idx) => (
              <div key={member.id} className="flex items-center gap-2">
                <input type="text" value={member.name}
                  onChange={e => updateMemberName(member.id, e.target.value)}
                  placeholder={`Member ${idx + 1}`} className={inputCls} />
                <button type="button" onClick={() => removeMember(member.id)}
                  disabled={members.length <= 2}
                  className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          {errors.members && <p className="text-red-500 text-xs mt-2">{errors.members}</p>}
          <button type="button" onClick={addMember}
            className="mt-3 flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium">
            <Plus size={14} /> Add member
          </button>
        </div>

        <button type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-full transition-colors text-sm shadow-sm">
          Create Trip
        </button>
      </form>
    </div>
  )
}

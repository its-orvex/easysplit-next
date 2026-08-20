import { supabase } from '@/lib/supabase'

const TABLE = 'shared_trips'

function normaliseTrip(row: any) {
  if (!row) return null
  return {
    ...row,
    paidTransfers: row.paid_transfers ?? row.paidTransfers ?? [],
  }
}

export function subscribeToSharedTrip(
  slug: string,
  callback: (trip: any | null) => void,
  onError?: (error: Error) => void,
) {
  if (!supabase) { callback(null); return () => {} }
  const client = supabase

  let active = true
  const channel = client
    .channel(`shared-trip-${slug}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: TABLE, filter: `slug=eq.${slug}`,
    }, payload => {
      if (!active) return
      if (payload.eventType === 'DELETE') callback(null)
      else callback(normaliseTrip(payload.new))
    })
    .subscribe(status => {
      if (status === 'CHANNEL_ERROR' && active) onError?.(new Error('Realtime connection failed'))
    })

  client.from(TABLE).select('*').eq('slug', slug).maybeSingle()
    .then(({ data, error }) => {
      if (!active) return
      if (error) onError?.(error)
      else if (data) callback(normaliseTrip(data))
    })

  return () => {
    active = false
    void client.removeChannel(channel)
  }
}

export async function ensureSharedTrip(slug: string, initialTrip: any) {
  if (!supabase) throw new Error('Supabase is not configured')

  const existing = await supabase.from(TABLE).select('*').eq('slug', slug).maybeSingle()
  if (existing.error) throw existing.error
  if (existing.data) return normaliseTrip(existing.data)

  const inserted = await supabase.from(TABLE).insert({
    slug,
    name: initialTrip.name,
    members: initialTrip.members,
    expenses: initialTrip.expenses,
    paid_transfers: initialTrip.paidTransfers,
    visibility: initialTrip.visibility,
  }).select('*').single()

  if (!inserted.error) return normaliseTrip(inserted.data)

  // Another guest may have created the row at the same time. Read it back.
  const raced = await supabase.from(TABLE).select('*').eq('slug', slug).single()
  if (raced.error) throw inserted.error
  return normaliseTrip(raced.data)
}

export async function updateSharedTrip(slug: string, trip: any) {
  if (!supabase) throw new Error('Supabase is not configured')

  const result = await supabase.from(TABLE).update({
    name: trip.name,
    members: trip.members,
    expenses: trip.expenses,
    paid_transfers: trip.paidTransfers ?? [],
    visibility: trip.visibility ?? 'shared-editable',
    updated_at: new Date().toISOString(),
  }).eq('slug', slug)

  if (result.error) throw result.error
}

import type { Metadata } from 'next'
import SharedTripWorkspace from '@/components/shared/SharedTripWorkspace'

export const metadata: Metadata = {
  title: 'SNOW 2026 — Shared trip expenses',
  description: 'Shared expense tracker for the SNOW 2026 trip.',
}

export default function Snow2026Page() {
  return <SharedTripWorkspace />
}


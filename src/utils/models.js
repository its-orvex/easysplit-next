import { generateInviteCode, generateShareToken } from './inviteCode'

/**
 * Trip {
 *   id: string             — local id (Firestore uses doc id instead)
 *   name: string
 *   createdAt: string      — ISO date (localStorage) | Firestore timestamp
 *   createdBy: string?     — userId of creator
 *   inviteCode: string     — 6-char uppercase code
 *   shareToken: string     — UUID for read-only guest link
 *   memberIds: string[]    — flat array for Firestore array-contains queries
 *   members: Member[]
 *   expenses: Expense[]
 *   paidTransfers: string[]
 * }
 *
 * Member {
 *   id: string
 *   name: string
 *   email: string?
 *   payId: string?         — phone number or email for PayID
 *   bsb: string?           — Australian bank BSB
 *   accountNumber: string? — Australian bank account number
 *   preferredBank: string? — e.g. "commbank", "anz"
 *   isGuest: boolean       — true if manually added (not a real account)
 *   tags: string[]         — e.g. ["driver", "child", "non-drinker", "business"]
 * }
 *
 * Expense {
 *   id: string
 *   description: string
 *   category: 'accommodation'|'flights'|'food'|'transport'|'activities'|'other'
 *   amount: number
 *   paidById: string
 *   splitMode: 'equal'|'custom'|'byItem'
 *   participants: string[]
 *   customSplits?: { memberId: string, amount: number }[]
 *   items?: { name: string, price: number, assignedTo: string[] }[]  — for byItem mode
 *   receiptImage?: string  — base64 encoded image
 *   // TODO Phase 3: move to Firebase Storage for images > 1MB
 *   date: string
 * }
 */

export function createTrip({ name, members, createdBy = null }) {
  const ids = members.map(m => m.id)
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    createdBy,
    inviteCode: generateInviteCode(),
    shareToken: generateShareToken(),
    memberIds: ids,
    members,
    expenses: [],
    paidTransfers: [],
  }
}

export function createMember(name, overrides = {}) {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: name.trim(),
    email: overrides.email ?? null,
    payId: overrides.payId ?? null,
    bsb: overrides.bsb ?? null,
    accountNumber: overrides.accountNumber ?? null,
    preferredBank: overrides.preferredBank ?? null,
    isGuest: overrides.isGuest ?? true,
    tags: overrides.tags ?? [],
  }
}

export function createExpense({
  description, category, amount, paidById,
  splitMode, participants, customSplits, items, receiptImage, date,
}) {
  return {
    id: crypto.randomUUID(),
    description,
    category,
    amount: Number(amount),
    paidById,
    splitMode,
    participants,
    customSplits: customSplits ?? null,
    items: items ?? null,
    receiptImage: receiptImage ?? null,
    date,
  }
}

export const CATEGORIES = [
  'accommodation', 'flights', 'food', 'transport', 'activities', 'other',
]

export const MEMBER_TAGS = ['driver', 'child', 'non-drinker', 'business']
export const MEMBER_TAG_LABELS = {
  'driver': '🚗 Driver',
  'child': '👶 Child',
  'non-drinker': '🍷 Non-drinker',
  'business': '💼 Business',
}

export const BANKS = [
  { key: 'commbank',  name: 'CommBank',   colour: '#FFCC00', deepLink: 'commbank://transfer' },
  { key: 'anz',       name: 'ANZ',        colour: '#007DBA', deepLink: 'anz-retail://transfer' },
  { key: 'westpac',   name: 'Westpac',    colour: '#D5002B', deepLink: 'westpac://' },
  { key: 'nab',       name: 'NAB',        colour: '#CC0000', deepLink: 'nabmobilebanking://' },
  { key: 'macquarie', name: 'Macquarie',  colour: '#00A0DF', deepLink: 'macquarie://' },
  { key: 'ing',       name: 'ING',        colour: '#FF6200', deepLink: 'ing://' },
  { key: 'up',        name: 'Up',         colour: '#7B2FBE', deepLink: 'up://' },
  { key: 'bendigo',   name: 'Bendigo',    colour: '#CC0000', deepLink: 'bendigobank://' },
  { key: 'stgeorge',  name: 'St.George',  colour: '#005DA4', deepLink: 'stgeorge://' },
  { key: 'suncorp',   name: 'Suncorp',    colour: '#0047AB', deepLink: 'suncorpbank://' },
  { key: 'boq',       name: 'BOQ',        colour: '#E31837', deepLink: 'boq://' },
  { key: 'other',     name: 'Other',      colour: '#64748b', deepLink: null },
]

// ─── Recurring expense presets (Australian market) ───────────────────────────

export const RECURRING_PRESETS = [
  { name: 'AGL Electricity',          category: 'other',         icon: '⚡', variable: true  },
  { name: 'Origin Energy',            category: 'other',         icon: '⚡', variable: true  },
  { name: 'Sydney Water',             category: 'other',         icon: '💧', variable: true  },
  { name: 'Optus Internet',           category: 'other',         icon: '📶', variable: false },
  { name: 'Telstra Internet',         category: 'other',         icon: '📶', variable: false },
  { name: 'TPG Internet',             category: 'other',         icon: '📶', variable: false },
  { name: 'Netflix',                  category: 'other',         icon: '📺', amount: 22.99   },
  { name: 'Spotify Family',           category: 'other',         icon: '🎵', amount: 17.99   },
  { name: 'Stan',                     category: 'other',         icon: '📺', amount: 14.00   },
  { name: 'Disney+',                  category: 'other',         icon: '📺', amount: 13.99   },
  { name: 'YouTube Premium Family',   category: 'other',         icon: '▶️',  amount: 22.99   },
  { name: 'Apple TV+',                category: 'other',         icon: '📺', amount: 12.99   },
  { name: 'Amazon Prime',             category: 'other',         icon: '📦', amount: 9.99    },
  { name: 'Rent',                     category: 'accommodation', icon: '🏠', variable: true  },
  { name: 'Strata/Body Corporate',    category: 'accommodation', icon: '🏢', variable: true  },
  { name: 'Council Rates',            category: 'accommodation', icon: '📋', variable: true  },
  { name: 'Home Insurance',           category: 'accommodation', icon: '🔒', variable: false },
]

export function createRecurringExpense({
  tripId, description, category, amount, isVariable, splitMode,
  participants, customSplits, paidById, frequency, dayOfMonth,
  nextDueDate, icon,
}) {
  return {
    id: crypto.randomUUID(),
    tripId,
    description,
    category,
    amount: isVariable ? (amount || 0) : Number(amount),
    isVariable: isVariable ?? false,
    splitMode,
    participants,
    customSplits: customSplits ?? null,
    paidById,
    frequency,
    dayOfMonth: dayOfMonth ?? 1,
    nextDueDate,
    lastLoggedDate: null,
    isActive: true,
    icon: icon ?? null,
    createdAt: new Date().toISOString(),
  }
}

export function nextDueDateAfter(currentDue, frequency) {
  const d = new Date(currentDue)
  switch (frequency) {
    case 'weekly':       d.setDate(d.getDate() + 7);    break
    case 'fortnightly':  d.setDate(d.getDate() + 14);   break
    case 'monthly':      d.setMonth(d.getMonth() + 1);  break
    case 'quarterly':    d.setMonth(d.getMonth() + 3);  break
  }
  return d.toISOString().slice(0, 10)
}

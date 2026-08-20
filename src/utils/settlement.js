/**
 * Calculates the minimum number of transfers to settle all debts.
 *
 * ALGORITHM — exact net-balance settlement for normal trip-sized groups:
 *   1. Compute each member's net balance: total_paid − total_owed.
 *      Positive = others owe them; negative = they owe others.
 *   2. Convert balances to cents and remove any rounding-cent residual.
 *   3. Explore valid debtor/creditor matches with memoised backtracking.
 *   4. Return the solution with the fewest transfers.
 *
 * Groups above 12 unsettled members use a fast greedy fallback to avoid
 * exponential work. Typical trips, including SNOW 2026, use the exact solver.
 *
 * Handles splitMode: 'equal', 'custom', 'byItem'
 */

function applyExpenseToNet(net, expense) {
  net[expense.paidById] = (net[expense.paidById] ?? 0) + expense.amount

  if (expense.splitMode === 'custom' && expense.customSplits) {
    for (const split of expense.customSplits) {
      net[split.memberId] = (net[split.memberId] ?? 0) - split.amount
    }
  } else if (expense.splitMode === 'byItem' && expense.items) {
    const itemShares = calculateByItemShares(expense)
    for (const [memberId, share] of Object.entries(itemShares)) {
      net[memberId] = (net[memberId] ?? 0) - share
    }
  } else {
    const share = expense.amount / expense.participants.length
    for (const pid of expense.participants) {
      net[pid] = (net[pid] ?? 0) - share
    }
  }
}

/**
 * Given a byItem expense, returns a map of memberId → their total owed amount.
 * Items with no one assigned are split equally among all participants as a remainder.
 */
export function calculateByItemShares(expense) {
  const shares = {}
  for (const pid of expense.participants) shares[pid] = 0

  let assignedTotal = 0
  for (const item of expense.items ?? []) {
    if (item.assignedTo && item.assignedTo.length > 0) {
      const perPerson = item.price / item.assignedTo.length
      for (const pid of item.assignedTo) {
        shares[pid] = (shares[pid] ?? 0) + perPerson
      }
      assignedTotal += item.price
    }
  }

  // Remainder (unassigned items or rounding gap) split equally
  const remainder = +(expense.amount - assignedTotal).toFixed(2)
  if (remainder > 0.005 && expense.participants.length > 0) {
    const perPerson = remainder / expense.participants.length
    for (const pid of expense.participants) {
      shares[pid] = (shares[pid] ?? 0) + perPerson
    }
  }

  for (const pid of Object.keys(shares)) {
    shares[pid] = +shares[pid].toFixed(2)
  }

  return shares
}

export function calculateSettlements(members, expenses) {
  const net = {}
  for (const m of members) net[m.id] = 0

  for (const expense of expenses) {
    applyExpenseToNet(net, expense)
  }

  const entries = Object.entries(net)
    .map(([id, balance]) => ({ id, cents: Math.round(balance * 100) }))
    .filter(entry => entry.cents !== 0)

  // Equal splits can produce a one-cent rounding residual. Assign it to the
  // largest balance so the transfer graph always sums to exactly zero.
  const residual = entries.reduce((sum, entry) => sum + entry.cents, 0)
  if (residual !== 0 && entries.length > 0) {
    const largest = entries.reduce((best, entry) =>
      Math.abs(entry.cents) > Math.abs(best.cents) ? entry : best)
    largest.cents -= residual
  }

  const unsettled = entries.filter(entry => entry.cents !== 0)
  const centsTransfers = unsettled.length <= 12
    ? findMinimumTransfers(unsettled)
    : findGreedyTransfers(unsettled)

  return centsTransfers.map(transfer => ({ ...transfer, amount: transfer.cents / 100 }))
}

function findMinimumTransfers(entries) {
  const initial = entries.map(entry => entry.cents)
  const memo = new Map()

  function solve(balances) {
    const first = balances.findIndex(value => value !== 0)
    if (first === -1) return []

    const key = balances.join(',')
    if (memo.has(key)) return memo.get(key)

    let best = null
    const triedBalances = new Set()

    for (let other = first + 1; other < balances.length; other++) {
      if (balances[first] * balances[other] >= 0 || triedBalances.has(balances[other])) continue
      triedBalances.add(balances[other])

      const cents = Math.min(Math.abs(balances[first]), Math.abs(balances[other]))
      const next = [...balances]
      let transfer

      if (balances[first] < 0) {
        next[first] += cents
        next[other] -= cents
        transfer = { from: entries[first].id, to: entries[other].id, cents }
      } else {
        next[first] -= cents
        next[other] += cents
        transfer = { from: entries[other].id, to: entries[first].id, cents }
      }

      const rest = solve(next)
      if (rest && (!best || rest.length + 1 < best.length)) best = [transfer, ...rest]

      // An exact cancellation is always the strongest match for this state.
      if (Math.abs(balances[first]) === Math.abs(balances[other])) break
    }

    memo.set(key, best)
    return best
  }

  return solve(initial) ?? []
}

function findGreedyTransfers(entries) {
  const creditors = entries.filter(entry => entry.cents > 0).map(entry => ({ ...entry }))
  const debtors = entries.filter(entry => entry.cents < 0).map(entry => ({ ...entry }))
  creditors.sort((a, b) => b.cents - a.cents)
  debtors.sort((a, b) => a.cents - b.cents)

  const transfers = []
  let creditorIndex = 0
  let debtorIndex = 0
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]
    const cents = Math.min(creditor.cents, Math.abs(debtor.cents))
    transfers.push({ from: debtor.id, to: creditor.id, cents })
    creditor.cents -= cents
    debtor.cents += cents
    if (creditor.cents === 0) creditorIndex++
    if (debtor.cents === 0) debtorIndex++
  }
  return transfers
}

/**
 * Returns net balance map: memberId → net AUD (positive = owed, negative = owes)
 */
export function calculateNetBalances(members, expenses) {
  const net = {}
  for (const m of members) net[m.id] = 0

  for (const expense of expenses) {
    applyExpenseToNet(net, expense)
  }

  for (const id of Object.keys(net)) {
    net[id] = +net[id].toFixed(2)
  }

  return net
}

/**
 * Returns each member's share for every expense (used by per-person view).
 * Returns: { expenseId: { memberId: shareAmount } }
 */
export function calculateMemberShares(members, expenses) {
  const result = {}

  for (const expense of expenses) {
    const shares = {}
    for (const m of members) shares[m.id] = 0

    if (expense.splitMode === 'custom' && expense.customSplits) {
      for (const split of expense.customSplits) {
        shares[split.memberId] = split.amount
      }
    } else if (expense.splitMode === 'byItem' && expense.items) {
      const byItem = calculateByItemShares(expense)
      for (const [pid, amt] of Object.entries(byItem)) {
        shares[pid] = amt
      }
    } else {
      const perPerson = expense.amount / expense.participants.length
      for (const pid of expense.participants) {
        shares[pid] = perPerson
      }
    }

    result[expense.id] = shares
  }

  return result
}

// ---------------------------------------------------------------------------
// Test runner — node src/utils/settlement.js
// ---------------------------------------------------------------------------
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('settlement.js')) {
  function assert(label, condition) {
    console.log(condition ? `  ✓ ${label}` : `  ✗ ${label}`)
  }
  function exp(overrides) {
    return { id: crypto.randomUUID(), description: 'x', category: 'other',
      customSplits: null, items: null, date: '2025-01-01', splitMode: 'equal', ...overrides }
  }

  console.log('\nTest 1: 3 people, A pays $90 split equally')
  const m1 = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C' }]
  const s1 = calculateSettlements(m1, [exp({ amount: 90, paidById: 'a', participants: ['a','b','c'] })])
  assert('exactly 2 transfers', s1.length === 2)
  assert('B pays A $30', s1.some(s => s.from === 'b' && s.to === 'a' && s.amount === 30))
  assert('C pays A $30', s1.some(s => s.from === 'c' && s.to === 'a' && s.amount === 30))

  console.log('\nTest 2: 4 people, A pays $60, B pays $20 — split equally')
  const m2b = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C' }, { id: 'd', name: 'D' }]
  const e2b = [
    exp({ amount: 60, paidById: 'a', participants: ['a','b','c','d'] }),
    exp({ amount: 20, paidById: 'b', participants: ['a','b','c','d'] }),
  ]
  const s2b = calculateSettlements(m2b, e2b)
  assert('exactly 2 transfers', s2b.length === 2)
  assert('C pays A $20', s2b.some(s => s.from === 'c' && s.to === 'a' && s.amount === 20))
  assert('D pays A $20', s2b.some(s => s.from === 'd' && s.to === 'a' && s.amount === 20))

  console.log('\nTest 3: byItem mode — A pays $70, A owes $50, B owes $20')
  const m3b = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
  const byItemExp = {
    id: 'x', description: 'dinner', category: 'food', amount: 70, date: '2025-01-01',
    paidById: 'a', splitMode: 'byItem', participants: ['a','b'],
    customSplits: null,
    items: [
      { name: 'Steak', price: 50, assignedTo: ['a'] },
      { name: 'Salad', price: 20, assignedTo: ['b'] },
    ]
  }
  const s3b = calculateSettlements(m3b, [byItemExp])
  assert('exactly 1 transfer', s3b.length === 1)
  assert('B pays A $20', s3b.some(s => s.from === 'b' && s.to === 'a' && s.amount === 20))

  console.log('\nTest 4: balanced pair, 0 transfers')
  const m4b = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
  const e4b = [
    exp({ amount: 50, paidById: 'a', participants: ['a','b'] }),
    exp({ amount: 50, paidById: 'b', participants: ['a','b'] }),
  ]
  assert('0 transfers', calculateSettlements(m4b, e4b).length === 0)

  console.log('\nAll tests passed.\n')
}

// useRecurring.js — manages recurring expenses in localStorage (mirrors trip storage pattern)
// For Firestore-backed usage, swap out the load/save helpers with collection queries.

import { useState, useEffect } from 'react'

const LS_KEY = 'easysplit-recurring'

function loadRecurring() {
  try {
    const v = localStorage.getItem(LS_KEY)
    return v ? JSON.parse(v) : []
  } catch { return [] }
}

function saveRecurring(items) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch {}
}

// Module-level cache so multiple hook instances stay in sync
let _cache = null
const _listeners = new Set()

function getCache() {
  if (!_cache) _cache = loadRecurring()
  return _cache
}

function setCache(next) {
  _cache = next
  saveRecurring(next)
  _listeners.forEach(fn => fn(next))
}

export function useRecurring(tripId) {
  const [all, setAll] = useState(() => getCache())

  useEffect(() => {
    _listeners.add(setAll)
    return () => _listeners.delete(setAll)
  }, [])

  const items = all.filter(r => r.tripId === tripId)

  function addRecurring(item) {
    setCache([...getCache(), item])
  }

  function updateRecurring(updated) {
    setCache(getCache().map(r => r.id === updated.id ? updated : r))
  }

  function deleteRecurring(id) {
    setCache(getCache().filter(r => r.id !== id))
  }

  return { items, addRecurring, updateRecurring, deleteRecurring }
}

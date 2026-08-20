import { useState, useEffect } from 'react'

/**
 * Persists state to localStorage and syncs across re-renders.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key absent
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // storage full or private mode — fail silently
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

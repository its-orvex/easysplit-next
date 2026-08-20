'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      id="reading-progress"
      style={{ width: `${pct}%` }}
      aria-hidden="true"
    />
  )
}

'use client'
import { useEffect } from 'react'

export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.reveal, .fade-up').forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })
    }

    observe()
    const t = setTimeout(observe, 200)
    return () => { observer.disconnect(); clearTimeout(t) }
  }, [])

  return null
}

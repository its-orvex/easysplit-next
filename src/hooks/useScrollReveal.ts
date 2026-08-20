'use client'
import { useEffect } from 'react'

export function useScrollReveal() {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.fade-up').forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })
    }

    observe()
    const t = setTimeout(observe, 200)
    return () => { observer.disconnect(); clearTimeout(t) }
  }, [])
}

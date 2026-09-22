'use client'

import { useEffect, useState, type RefObject } from 'react'

// Timed animations should only run for visible content in an active tab.
export function useViewportActivity(ref: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => setActive(visible && !document.hidden && !reducedMotion.matches)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    reducedMotion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [ref])
  return active
}

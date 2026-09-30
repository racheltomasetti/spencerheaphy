'use client'

import {useEffect, useRef, useState} from 'react'

// Flips on once the element has entered the viewport, so a frame can arrive
// instead of sitting in place. Reduced motion shows it immediately.
export function useShown<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    let frame = 0
    const reveal = () => {
      frame = requestAnimationFrame(() => setShown(true))
    }
    const inView = () => {
      const box = node.getBoundingClientRect()
      return box.top < window.innerHeight * 0.96 && box.bottom > 0
    }

    if (inView()) {
      reveal()
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        reveal()
        observer.disconnect()
      },
      {threshold: 0.12},
    )
    observer.observe(node)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return {ref, shown}
}

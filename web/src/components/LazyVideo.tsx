'use client'

import {useEffect, useRef, useState} from 'react'

export function LazyVideo({src, className}: {src: string; className?: string}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {rootMargin: '200px'},
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={inView ? src : undefined}
      preload="none"
      autoPlay={inView}
      muted
      loop
      playsInline
    />
  )
}

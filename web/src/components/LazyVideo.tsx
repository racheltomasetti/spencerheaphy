'use client'

import {useEffect, useRef, useState} from 'react'

function playVideo(node: HTMLVideoElement) {
  const attempt = node.play()
  if (attempt) {
    attempt.catch((error: unknown) => {
      // Chrome rejects play() when the element is paused, src-swapped, or
      // unmounted before playback actually starts. That's expected here.
      if (error instanceof DOMException && error.name === 'AbortError') return
    })
  }
}

export function LazyVideo({
  src,
  className,
  loop = true,
  active = true,
  playsBeforeAdvance,
  onAdvance,
}: {
  src: string
  className?: string
  loop?: boolean
  active?: boolean
  playsBeforeAdvance?: number
  onAdvance?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const playsRef = useRef(0)
  const [inView, setInView] = useState(false)
  const shouldLoop = !playsBeforeAdvance && loop

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

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return

    playsRef.current = 0

    if (active) {
      node.currentTime = 0
      playVideo(node)
    } else {
      node.pause()
    }
  }, [active, inView, src])

  return (
    <video
      ref={ref}
      className={className}
      src={inView ? src : undefined}
      preload="none"
      autoPlay={inView && active}
      muted
      loop={shouldLoop}
      playsInline
      onEnded={() => {
        if (!playsBeforeAdvance || !active) return
        playsRef.current += 1
        if (playsRef.current >= playsBeforeAdvance) {
          playsRef.current = 0
          onAdvance?.()
          return
        }
        const node = ref.current
        if (node) playVideo(node)
      }}
    />
  )
}

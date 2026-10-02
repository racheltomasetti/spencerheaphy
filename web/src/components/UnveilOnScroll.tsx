'use client'

import {useEffect, useLayoutEffect, useRef, type ReactNode} from 'react'

// Fades [data-unveil] tiles in as they are scrolled to. Whatever is already on screen
// when the page opens is simply there; only tiles below the fold are held back, and
// each fades in the first time it comes into view (a row at a time, since a row
// arrives together). A row waits for its films to have a frame to show, so the fade
// brings in footage rather than an empty box, but never longer than MAX_WAIT.
// The motion itself lives in globals.css under `.unveil`; this only decides when.
const MAX_WAIT = 1200

function mediaReady(tile: HTMLElement) {
  return new Promise<void>((resolve) => {
    const video = tile.querySelector('video')
    const image = tile.querySelector('img')
    if (video) {
      if (video.readyState >= 2) return resolve()
      video.addEventListener('loadeddata', () => resolve(), {once: true})
      video.addEventListener('error', () => resolve(), {once: true})
    } else if (image) {
      if (image.complete) return resolve()
      image.addEventListener('load', () => resolve(), {once: true})
      image.addEventListener('error', () => resolve(), {once: true})
    } else {
      resolve()
    }
  })
}

export function UnveilOnScroll({children, className}: {children: ReactNode; className?: string}) {
  const ref = useRef<HTMLDivElement>(null)

  // Before the first paint, hold back the tiles that start below the fold. Tiles are
  // visible by default, so nothing on the first screen ever flashes or animates.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-unveil]:not([data-seen])').forEach((tile) => {
      tile.setAttribute('data-seen', '')
      if (tile.getBoundingClientRect().top >= window.innerHeight) tile.setAttribute('data-pending', '')
    })
  }, [children])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    let alive = true

    const observer = new IntersectionObserver(
      (entries) => {
        const tiles: HTMLElement[] = []
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const tile = entry.target as HTMLElement
          observer.unobserve(tile)
          tiles.push(tile)
        }
        if (!tiles.length) return

        const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT))
        Promise.race([Promise.all(tiles.map(mediaReady)), timeout]).then(() => {
          if (!alive) return
          for (const tile of tiles) tile.removeAttribute('data-pending')
        })
      },
      {threshold: 0.15},
    )

    root.querySelectorAll<HTMLElement>('[data-unveil][data-pending]').forEach((tile) => {
      observer.observe(tile)
    })
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [children])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
